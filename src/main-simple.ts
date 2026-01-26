/**
 * ArxisVR - Fast Start Mode (Optimized)
 * - Lazy loading: componentes carregados sob demanda
 * - Renderização otimizada com fog
 * - Sistemas pesados removidos do boot
 * - UI Runtime integrado com AppController/ToolManager/CommandHistory
 */
import * as THREE from 'three';
import { ComponentsRegistry, componentManager, isTypingInUI, hasOpenUI } from './components-registry';
import { IFCLoader } from './loaders/IFCLoader';
import { LODSystem } from './systems/LODSystem';
import { EntityManager } from './engine/ecs';
import { eventBus } from './core';
import { AppController } from './app/AppController';
import { initializeUI } from './ui/UI';
import { fileService } from './systems/file';
import { ModelSession } from './systems/model/ModelSession';
import { SelectionTool } from './tools/SelectionTool';
import { MeasurementTool } from './tools/MeasurementTool';
import { SectionTool } from './tools/SectionTool';
import { LayerTool } from './tools/LayerTool';
import { ToolType } from './core/types';
import { getErrorBoundary } from './core/ErrorBoundary';
import { getLogger } from './core/Logger';
import { LoadingManager } from './core/LoadingManager';
import { getQualityManager } from './core/QualityManager';

// Performance tracking
performance.mark('app-start');

// Initialize Loading Manager FIRST with enterprise options
const loadingManager = new LoadingManager({
  timeoutDurationMs: 15000,
  debug: true,
  onTimeout: () => {
    getLogger().error('Bootstrap', 'Loading timeout triggered - recovery actions shown');
  },
  onComplete: (elapsedMs) => {
    getLogger().info('Bootstrap', `✅ App loaded in ${elapsedMs}ms`);
    performance.mark('app-loaded');
    performance.measure('app-load-time', 'app-start', 'app-loaded');
  }
});
loadingManager.setStage('Inicializando...', 'Preparando engine', 10);

// Initialize ErrorBoundary and Logger
const errorBoundary = getErrorBoundary();
const logger = getLogger();

logger.info('Bootstrap', '🛡️ ErrorBoundary initialized');
logger.info('Bootstrap', '🚀 ArxisVR - Fast Start Mode');
logger.info('Bootstrap', `📦 ${Object.keys(ComponentsRegistry).length} componentes disponíveis (lazy load)`);

// Hide default loading (managed by LoadingManager now)
loadingManager.setStage('Criando cena 3D...', 'Preparando WebGL', 20);

// Create scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0f);
scene.fog = new THREE.Fog(0x0a0a0f, 50, 200); // Fog para melhor performance

// Create camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(5, 1.7, 5);

performance.mark('scene-ready');
performance.measure('init-time', 'app-start', 'scene-ready');
const initTime = performance.getEntriesByName('init-time')[0].duration;
logger.info('Bootstrap', `✅ Scene + Camera prontos em ${initTime.toFixed(0)}ms`, { duration: initTime });
loadingManager.setStage('Configurando renderização...', 'WebGL Renderer', 40);
// Camera rotation (Euler angles)
const euler = new THREE.Euler(0, 0, 0, 'YXZ');
const PI_2 = Math.PI / 2;

// Movement state
const movement = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  up: false,
  down: false,
  speed: 0.1
};

// Spatial mode (fly mode)
let spatialMode = false;

// Rotation state (Arrow keys)
const rotation = {
  up: false,
  down: false,
  left: false,
  right: false,
  speed: 0.03
};

// Mouse look
let isPointerLocked = false;

// Keyboard controls globais (navegação sempre ativa)
window.addEventListener('keydown', (e) => {
  if (isTypingInUI()) return;
  
  const key = e.key.toLowerCase();
  
  switch(key) {
    case 'w': movement.forward = true; break;
    case 's': movement.backward = true; break;
    case 'a': movement.left = true; break;
    case 'd': movement.right = true; break;
    case ' ': movement.up = true; e.preventDefault(); break;
    case 'shift': movement.down = true; e.preventDefault(); break;
    case 'arrowup': rotation.up = true; e.preventDefault(); break;
    case 'arrowdown': rotation.down = true; e.preventDefault(); break;
    case 'arrowleft': rotation.left = true; e.preventDefault(); break;
    case 'arrowright': rotation.right = true; e.preventDefault(); break;
  }
});

window.addEventListener('keyup', (e) => {
  if (isTypingInUI()) return;
  
  const key = e.key.toLowerCase();
  
  switch(key) {
    case 'w': movement.forward = false; break;
    case 's': movement.backward = false; break;
    case 'a': movement.left = false; break;
    case 'd': movement.right = false; break;
    case ' ': movement.up = false; break;
    case 'shift': movement.down = false; break;
    case 'arrowup': rotation.up = false; break;
    case 'arrowdown': rotation.down = false; break;
    case 'arrowleft': rotation.left = false; break;
    case 'arrowright': rotation.right = false; break;
  }
});

console.log('✅ Global WASD navigation active');

// Get canvas container
const container = document.getElementById('canvas-container');
if (!container) {
  console.error('❌ Canvas container not found!');
  throw new Error('Canvas container not found');
}

// Create renderer (performance-optimized)
const renderer = new THREE.WebGLRenderer({ 
  antialias: false, // Desabilitar AA para melhor performance
  powerPreference: 'high-performance',
  stencil: false,
  depth: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limitar a 2x para performance
renderer.shadowMap.enabled = false; // Desabilitar sombras por padrão
container.appendChild(renderer.domElement);
logger.info('Renderer', '✅ Renderer otimizado criado');

// Initialize QualityManager
const qualityManager = getQualityManager();
qualityManager.initialize(renderer, scene);
logger.info('Quality', '✅ QualityManager initialized (auto-adjust enabled)');

loadingManager.setStage('Adicionando controles...', 'Mouse e teclado', 60);

// Pointer Lock (Mouse look - FPS style) - Only when double-clicking canvas
renderer.domElement.addEventListener('dblclick', () => {
  // Não trava mouse se qualquer UI estiver aberta
  if (!hasOpenUI()) {
    renderer.domElement.requestPointerLock();
  }
});

// Exit pointer lock with ESC (com InputGate)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    // Se tem UI aberta, fecha a UI (prioridade)
    if (hasOpenUI()) {
      // UI Runtime/ComponentManager já gerencia o ESC
      return;
    }
    // Se não tem UI mas pointer lock ativo, sai do pointer lock
    if (isPointerLocked) {
      document.exitPointerLock();
    }
  }
});

document.addEventListener('pointerlockchange', () => {
  isPointerLocked = document.pointerLockElement === renderer.domElement;
  console.log(isPointerLocked ? '🖱️ Mouse locked (ESC to exit)' : '🖱️ Mouse unlocked');
});

document.addEventListener('mousemove', (e) => {
  if (!isPointerLocked) return;
  
  const movementX = e.movementX || 0;
  const movementY = e.movementY || 0;
  
  euler.setFromQuaternion(camera.quaternion);
  euler.y -= movementX * 0.002;
  euler.x -= movementY * 0.002;
  euler.x = Math.max(-PI_2, Math.min(PI_2, euler.x));
  camera.quaternion.setFromEuler(euler);
});

console.log('✅ Mouse look controls added (double-click to lock, ESC to exit)');

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);
console.log('✅ Lights added');

// Add axes
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// Add grid (togglable via G key)
const gridHelper = new THREE.GridHelper(100, 100, 0x444444, 0x222222);
gridHelper.position.y = 0;
gridHelper.visible = true; // Visível por padrão
scene.add(gridHelper);

// Grid toggle function
(window as any).toggleGrid = () => {
  gridHelper.visible = !gridHelper.visible;
  console.log(`Grid ${gridHelper.visible ? 'ativado' : 'desativado'}`);
  return gridHelper.visible;
};

(window as any).getGridState = () => gridHelper.visible;

console.log('✅ Scene setup completo (Grid + Axes)');
console.log('💡 Use tecla G para toggle do grid');

// Lazy initialization - só cria quando necessário
let entityManager: EntityManager | null = null;
let lodSystem: LODSystem | null = null;
let ifcLoader: IFCLoader | null = null;
let modelSession: ModelSession | null = null;

function initializeModelSession() {
  if (!modelSession) {
    console.log('⏳ Inicializando ModelSession...');
    modelSession = ModelSession.getInstance(scene, camera);
    fileService.setModelSession(modelSession);
    console.log('✅ ModelSession inicializada');
  }
  return modelSession;
}

function initializeIFCLoader() {
  if (!ifcLoader) {
    console.log('⏳ Inicializando IFC Loader...');
    entityManager = new EntityManager();
    lodSystem = new LODSystem(camera);
    ifcLoader = new IFCLoader(scene, lodSystem, entityManager);
    
    // Inicializa ModelSession se ainda não foi
    initializeModelSession();
    
    console.log('✅ IFC Loader inicializado');
  }
  return ifcLoader;
}

// Global function to load IFC files (lazy init)
(window as any).loadIFCFile = async (file: File) => {
  try {
    console.log(`📦 Loading IFC: ${file.name}`);
    const loader = initializeIFCLoader();
    await loader.loadIFC(file);
    console.log(`✅ IFC loaded successfully: ${file.name}`);
  } catch (error) {
    console.error('❌ Error loading IFC:', error);
    alert(`Erro ao carregar IFC: ${error}`);
  }
};

// Add a simple test cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00d4ff }); // BasicMaterial é mais leve
const cube = new THREE.Mesh(geometry, material);
cube.position.y = 0.5;
scene.add(cube);

// Handle resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  // Apply rotation (Arrow keys)
  euler.setFromQuaternion(camera.quaternion);
  
  if (rotation.up) euler.x += rotation.speed;
  if (rotation.down) euler.x -= rotation.speed;
  if (rotation.left) euler.y += rotation.speed;
  if (rotation.right) euler.y -= rotation.speed;
  
  euler.x = Math.max(-PI_2, Math.min(PI_2, euler.x));
  camera.quaternion.setFromEuler(euler);
  
  // Calculate movement direction
  const direction = new THREE.Vector3();
  
  if (movement.forward) direction.z -= movement.speed;
  if (movement.backward) direction.z += movement.speed;
  if (movement.left) direction.x -= movement.speed;
  if (movement.right) direction.x += movement.speed;
  
  // Vertical movement (spatial mode)
  if (spatialMode) {
    if (movement.up) direction.y += movement.speed;
    if (movement.down) direction.y -= movement.speed;
  }
  
  // Apply movement relative to camera
  if (direction.length() > 0) {
    if (spatialMode) {
      direction.applyQuaternion(camera.quaternion);
      camera.position.add(direction);
    } else {
      const yRotation = new THREE.Euler(0, euler.y, 0, 'YXZ');
      const quaternion = new THREE.Quaternion().setFromEuler(yRotation);
      const horizontalDir = new THREE.Vector3(direction.x, 0, direction.z);
      horizontalDir.applyQuaternion(quaternion);
      camera.position.add(horizontalDir);
    }
  }
  
  // Update active tool (for Selection/Measurement)
  const activeTool = appController.toolManager.getActiveTool();
  if (activeTool && typeof activeTool.update === 'function') {
    activeTool.update(0.016);
  }
  
  // Rotate cube
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  
  // Update ModelSession
  if (modelSession) {
    modelSession.update(0.016);
  }
  
  renderer.render(scene, camera);
}

animate();

// Final performance report
performance.mark('app-ready');
performance.measure('total-load', 'app-start', 'app-ready');
const totalTime = performance.getEntriesByName('total-load')[0].duration;
logger.info('Bootstrap', '✅ Animation loop started');
logger.info('Bootstrap', `🎉 ArxisVR carregado em ${totalTime.toFixed(0)}ms`, { totalLoadTime: totalTime });
logger.debug('Bootstrap', '💡 Dica: Use duplo-clique para controle FPS, ESC para sair');
logger.debug('Bootstrap', '💡 Ctrl+O para abrir arquivos IFC');

// Multiplayer button
const mpButton = document.querySelector('.connect-multiplayer-btn') as HTMLButtonElement;
if (mpButton) {
  mpButton.addEventListener('click', () => {
    alert('Multiplayer feature coming soon!');
  });
}

// Spatial mode button
const spatialButton = document.querySelector('.spatial-mode-btn') as HTMLButtonElement;
if (spatialButton) {
  spatialButton.addEventListener('click', () => {
    spatialMode = !spatialMode;
    
    if (spatialMode) {
      spatialButton.classList.add('active');
      spatialButton.innerHTML = '🚀 Modo Espacial (ON)';
      console.log('🚀 Spatial mode enabled - Use Space/Shift to fly up/down');
    } else {
      spatialButton.classList.remove('active');
      spatialButton.innerHTML = '🚀 Modo Espacial';
      console.log('🚶 Normal mode - Walking on ground');
    }
  });
  console.log('✅ Spatial mode button ready');
}

// Grid toggle button
const gridButton = document.querySelector('.grid-toggle-btn') as HTMLButtonElement;
if (gridButton) {
  // Set initial state
  if ((window as any).getGridState?.()) {
    gridButton.classList.add('active');
  }
  
  gridButton.addEventListener('click', () => {
    const isVisible = (window as any).toggleGrid?.();
    
    if (isVisible) {
      gridButton.classList.add('active');
    } else {
      gridButton.classList.remove('active');
    }
  });
  console.log('✅ Grid toggle button ready');
}

// Toolbar buttons
const toolbarButtons = document.querySelectorAll('.toolbar-btn');
console.log(`🔍 Found ${toolbarButtons.length} toolbar buttons`);

// Mapeamento tool -> componentName
const toolComponentMap: Record<string, string> = {
  'measure': 'MeasurementPanel',
  'section': 'SectionBoxTool',
  'layers': 'LayersPanel',
  'transparency': 'TransparencyControl',
  'explode': 'ExplodeViewPanel',
  'camera': 'CameraPresetsPanel',
  'annotate': 'AnnotationsPanel',
  'comments': 'ChatPanel',
  'settings': 'SettingsPanel'
};

toolbarButtons.forEach((button, index) => {
  console.log(`  Button ${index}: ${button.getAttribute('data-tool')}`);
  button.addEventListener('click', async () => {
    const tool = button.getAttribute('data-tool');
    if (!tool) return;
    
    console.log(`🖱️ CLICK on button: ${tool}`);
    
    // Update active state
    toolbarButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    // Handle special tools
    switch(tool) {
      case 'select':
        console.log('👆 Ferramenta: Selecionar');
        // Close all panels on select
        componentManager.closeAll();
        break;
      
      case 'vr':
        console.log('🥽 Ferramenta: Modo VR');
        alert('VR: Entrar em modo VR/AR (requer headset WebXR)');
        break;
      
      case 'menu':
        console.log('☰ Abrindo menu de componentes');
        const menu = document.getElementById('components-menu');
        if (menu) {
          menu.style.display = 'flex';
        }
        break;
      
      default:
        // Handle panel-based tools via componentManager
        const componentName = toolComponentMap[tool];
        if (componentName) {
          console.log(`🔧 Tool: ${tool} → Component: ${componentName}`);
          await componentManager.toggle(`tool:${tool}`, componentName);
        }
        break;
    }
  });
});

// Keyboard shortcuts for tools (com InputGate + ComponentManager)
window.addEventListener('keydown', async (e) => {
  // InputGate: não dispara hotkeys se usuário está digitando
  if (isTypingInUI()) return;
  if (isPointerLocked) return; // Não dispara quando mouse travado
  
  // Ctrl+O to open file
  if (e.ctrlKey && e.key.toLowerCase() === 'o') {
    e.preventDefault();
    console.log('📁 Ctrl+O: Opening LoadFileModal');
    await componentManager.open('modal:load-file', 'LoadFileModal');
    return;
  }
  
  // Hotkeys de ferramentas (Q/M/C/L/T/E/V/A/K/,/G)
  let toolKey: string | null = null;
  let componentName: string | null = null;
  
  switch(e.key.toLowerCase()) {
    case 'q': toolKey = 'tool:select'; break; // Select (não abre painel)
    case 'm': toolKey = 'tool:measure'; componentName = 'MeasurementPanel'; break;
    case 'c': toolKey = 'tool:section'; componentName = 'SectionBoxTool'; break;
    case 'l': toolKey = 'tool:layers'; componentName = 'LayersPanel'; break;
    case 't': toolKey = 'tool:transparency'; componentName = 'TransparencyControl'; break;
    case 'e': toolKey = 'tool:explode'; componentName = 'ExplodeViewPanel'; break;
    case 'v': toolKey = 'tool:camera'; componentName = 'CameraPresetsPanel'; break;
    case 'a': toolKey = 'tool:annotate'; componentName = 'AnnotationsPanel'; break;
    case 'k': toolKey = 'tool:comments'; componentName = 'ChatPanel'; break;
    case ',': toolKey = 'tool:settings'; componentName = 'SettingsPanel'; break;
    case 'g': 
      // Toggle grid
      (window as any).toggleGrid();
      return;
  }
  
  if (toolKey && componentName) {
    await componentManager.toggle(toolKey, componentName);
  } else if (e.key.toLowerCase() === 'q') {
    // Select tool (apenas simula click no botão)
    const selectBtn = document.querySelector('[data-tool="select"]');
    if (selectBtn) (selectBtn as HTMLElement).click();
  }
});

console.log('✅ Toolbar initialized with 11 tools + G for grid toggle + Ctrl+O shortcut');

// Components Menu Management
const componentsMenu = document.getElementById('components-menu');
const closeMenuBtn = document.querySelector('.close-menu');
const componentButtons = document.querySelectorAll('[data-component]');

// Close menu button
if (closeMenuBtn) {
  closeMenuBtn.addEventListener('click', () => {
    if (componentsMenu) {
      componentsMenu.style.display = 'none';
    }
  });
}

// Component buttons in menu
console.log(`🔍 Found ${componentButtons.length} component buttons in menu`);
componentButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    const componentName = button.getAttribute('data-component');
    if (!componentName) return;
    
    console.log(`🖱️ Creating component: ${componentName}`);
    
    // Close menu
    if (componentsMenu) {
      componentsMenu.style.display = 'none';
    }
    
    // Usa componentManager para abrir/toggle
    await componentManager.open(`menu:${componentName}`, componentName);
  });
});

// Menu bar buttons (same logic as component buttons)
const menuBarButtons = document.querySelectorAll('.menu-bar-dropdown button[data-component]');
console.log(`🔍 Found ${menuBarButtons.length} menu bar buttons`);
menuBarButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    const componentName = button.getAttribute('data-component');
    if (!componentName) return;
    
    console.log(`🖱️ Creating component from menu bar: ${componentName}`);
    
    // Usa componentManager para abrir
    await componentManager.open(`menubar:${componentName}`, componentName);
  });
});

console.log('✅ Components menu initialized');
console.log('✅ Menu bar initialized');

// Export for debugging
if (typeof window !== 'undefined') {
  (window as any).scene = scene;
  (window as any).camera = camera;
  (window as any).renderer = renderer;
}

// =============================================================================
// UI RUNTIME - Conecta HTML aos sistemas reais
// =============================================================================

logger.info('UIRuntime', '🎨 Inicializando UI Runtime...');

// Instancia AppController (gerenciador central da aplicação)
const appController = AppController.getInstance();

// Configura referências da engine no AppController
// Type cast: main-simple usa THREE.Scene diretamente (bootstrap mode)
appController.setEngineReferences(
  scene as any, // TODO: Usar ThreeSceneAdapter para type safety
  camera as any,
  renderer as any
);

// Register all tools in ToolManager
const toolManager = appController.toolManager;
if (toolManager) {
  // Ferramentas principais (navegação é global via WASD)
  const selectionTool = new SelectionTool(scene, camera);
  const measurementTool = new MeasurementTool(scene, camera);
  const sectionTool = new SectionTool(scene, camera);
  const layerTool = new LayerTool();
  
  toolManager.registerTool(ToolType.SELECTION, selectionTool);
  toolManager.registerTool(ToolType.MEASUREMENT, measurementTool);
  toolManager.registerTool(ToolType.CUT, sectionTool);
  toolManager.registerTool(ToolType.LAYER, layerTool);
  
  // Selection como ferramenta padrão
  toolManager.setActiveTool(ToolType.SELECTION);
  
  logger.info('ToolManager', '✅ 4 tools registered (Selection, Measurement, Section, Layer)');
  logger.debug('ToolManager', '💡 Navigation is always active via WASD keys');
  logger.debug('ToolManager', '📋 Atalhos: Q=Select, M=Measure, C=Section, L=Layers, T/E/V/A/K=Panels');
}

loadingManager.setStage('Carregando UI...', 'Inicializando componentes', 80);

// Inicializa UIRuntime com dependências reais
const uiRuntime = initializeUI(
  eventBus,                        // EventBus real (src/core/EventBus.ts)
  appController,                    // AppController (src/app/AppController.ts)
  appController.toolManager,        // ToolManager (src/app/ToolManager.ts)
  (window as any).commandHistory || { undo: () => {}, redo: () => {} }, // CommandHistory
  undefined                         // NetworkManager (opcional)
);

logger.info('UIRuntime', '✅ UI Runtime conectado aos sistemas');

loadingManager.setStage('Finalizando...', 'Preparando interface', 95);

// Exporta para debug
if (typeof window !== 'undefined') {
  (window as any).appController = appController;
  (window as any).uiRuntime = uiRuntime;
  (window as any).errorBoundary = errorBoundary;
  (window as any).logger = logger;
  logger.debug('Debug', '   - window.appController');
  logger.debug('Debug', '   - window.uiRuntime');
  logger.debug('Debug', '   - window.errorBoundary');
  logger.debug('Debug', '   - window.logger');
  logger.debug('Debug', '   - window.loadIFCFile(file) [já definido acima]');
}

// Monitor de erros na status bar
setInterval(() => {
  const errorCount = errorBoundary.getErrorCount();
  const statusErrors = document.getElementById('status-errors');
  const statusErrorsCount = document.getElementById('status-errors-count');
  
  if (statusErrors && statusErrorsCount) {
    if (errorCount > 0) {
      statusErrors.style.display = 'block';
      statusErrorsCount.textContent = errorCount.toString();
    } else {
      statusErrors.style.display = 'none';
    }
  }
}, 2000); // Verifica a cada 2 segundos

logger.info('ErrorBoundary', '✅ ErrorBoundary monitoring status bar');

// Complete loading
loadingManager.setStage('Pronto!', 'Aplicativo carregado', 100);
setTimeout(async () => {
  loadingManager.complete();
  
  // Preload critical components in idle time
  const { preloadCriticalComponents } = await import('./components-registry');
  preloadCriticalComponents();
  
  // Show onboarding after loading
  showOnboarding();
}, 500); // Pequeno delay para mostrar 100%

// =============================================================================
// ONBOARDING - First-time user experience
// =============================================================================

function showOnboarding(): void {
  const onboarding = document.getElementById('onboarding');
  const dropzone = document.getElementById('dropzone');
  const loadDemoBtn = document.getElementById('load-demo-btn');

  if (!onboarding) return;

  // Show onboarding
  onboarding.classList.remove('hidden');

  // Dropzone drag & drop
  if (dropzone) {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
      }, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, () => {
        dropzone.classList.add('dragover');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, () => {
        dropzone.classList.remove('dragover');
      }, false);
    });

    dropzone.addEventListener('drop', (e: DragEvent) => {
      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        handleFileLoad(files[0]);
      }
    }, false);

    // Click to select
    dropzone.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.ifc';
      input.onchange = (e: Event) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) handleFileLoad(file);
      };
      input.click();
    });
  }

  // Demo button
  if (loadDemoBtn) {
    loadDemoBtn.addEventListener('click', () => {
      loadDemoModel();
    });
  }
}

function handleFileLoad(file: File): void {
  logger.info('Onboarding', `Loading file: ${file.name}`, { size: file.size });
  
  // Hide onboarding
  const onboarding = document.getElementById('onboarding');
  if (onboarding) {
    onboarding.classList.add('hidden');
    setTimeout(() => onboarding.remove(), 300);
  }

  // Load file using existing function
  (window as any).loadIFCFile?.(file);
}

function loadDemoModel(): void {
  logger.info('Onboarding', 'Loading demo model');
  
  // Hide onboarding
  const onboarding = document.getElementById('onboarding');
  if (onboarding) {
    onboarding.classList.add('hidden');
    setTimeout(() => onboarding.remove(), 300);
  }

  // TODO: Carregar modelo demo (pode ser um IFC pequeno na pasta Examples-files)
  // Por enquanto, simula carregamento
  logger.warn('Onboarding', 'Demo model not implemented yet - would load from Examples-files/');
  
  // Abre modal de load como fallback
  componentManager.open('modal:load-file', 'LoadFileModal');
}

