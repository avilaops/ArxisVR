/**
 * ArxisVR - Fast Start Mode (Optimized)
 * - Lazy loading: componentes carregados sob demanda
 * - Renderização otimizada com fog
 * - Sistemas pesados removidos do boot
 */
import * as THREE from 'three';
import { ComponentsRegistry, createComponent } from './components-registry';
import { IFCLoader } from './loaders/IFCLoader';
import { LODSystem } from './systems/LODSystem';
import { EntityManager } from './engine/ecs';

// Performance tracking
performance.mark('app-start');

console.log('🚀 ArxisVR - Fast Start Mode');
console.log(`📦 ${Object.keys(ComponentsRegistry).length} componentes disponíveis (lazy load)`);

// Hide loading IMMEDIATELY (no timeout)
const loading = document.getElementById('loading');
if (loading) {
  loading.classList.add('hidden');
  setTimeout(() => loading.remove(), 300);
}

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
console.log(`✅ Scene + Camera prontos em ${initTime.toFixed(0)}ms`);

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

// Keyboard controls
window.addEventListener('keydown', (e) => {
  switch(e.key.toLowerCase()) {
    case 'w': movement.forward = true; break;
    case 's': movement.backward = true; break;
    case 'a': movement.left = true; break;
    case 'd': movement.right = true; break;
    case ' ': 
      movement.up = true; 
      e.preventDefault(); 
      break;
    case 'shift': 
      movement.down = true; 
      e.preventDefault(); 
      break;
    case 'arrowup': rotation.up = true; e.preventDefault(); break;
    case 'arrowdown': rotation.down = true; e.preventDefault(); break;
    case 'arrowleft': rotation.left = true; e.preventDefault(); break;
    case 'arrowright': rotation.right = true; e.preventDefault(); break;
  }
});

window.addEventListener('keyup', (e) => {
  switch(e.key.toLowerCase()) {
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

console.log('✅ WASD + Arrow keys + Space/Shift controls added');

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
console.log('✅ Renderer otimizado criado');

// Pointer Lock (Mouse look - FPS style) - Only when double-clicking canvas
renderer.domElement.addEventListener('dblclick', (e) => {
  // Don't lock if there are open modals/panels
  const hasOpenModals = document.querySelector('.arxis-modal-overlay') !== null;
  const hasOpenPanels = document.querySelector('.layers-panel') !== null;
  
  if (!hasOpenModals && !hasOpenPanels) {
    renderer.domElement.requestPointerLock();
  }
});

// Exit pointer lock with ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isPointerLocked) {
    document.exitPointerLock();
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

// Add grid (reduced for performance)
const gridHelper = new THREE.GridHelper(20, 10, 0x00d4ff, 0x222222); // Menos linhas
scene.add(gridHelper);

// Add axes
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

console.log('✅ Scene setup completo');

// Lazy initialization - só cria quando necessário
let entityManager: EntityManager | null = null;
let lodSystem: LODSystem | null = null;
let ifcLoader: IFCLoader | null = null;

function initializeIFCLoader() {
  if (!ifcLoader) {
    console.log('⏳ Inicializando IFC Loader...');
    entityManager = new EntityManager();
    lodSystem = new LODSystem(camera);
    ifcLoader = new IFCLoader(scene, lodSystem, entityManager);
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
  
  if (rotation.up) {
    euler.x += rotation.speed;
  }
  if (rotation.down) {
    euler.x -= rotation.speed;
  }
  if (rotation.left) {
    euler.y += rotation.speed;
  }
  if (rotation.right) {
    euler.y -= rotation.speed;
  }
  
  // Clamp vertical rotation
  euler.x = Math.max(-PI_2, Math.min(PI_2, euler.x));
  camera.quaternion.setFromEuler(euler);
  
  // Calculate movement direction based on camera rotation
  const direction = new THREE.Vector3();
  
  if (movement.forward) {
    direction.z -= movement.speed;
  }
  if (movement.backward) {
    direction.z += movement.speed;
  }
  if (movement.left) {
    direction.x -= movement.speed;
  }
  if (movement.right) {
    direction.x += movement.speed;
  }
  
  // Vertical movement (only in spatial mode)
  if (spatialMode) {
    if (movement.up) {
      direction.y += movement.speed;
    }
    if (movement.down) {
      direction.y -= movement.speed;
    }
  }
  
  // Apply movement relative to camera direction
  if (direction.length() > 0) {
    if (spatialMode) {
      // Full 3D movement in spatial mode
      direction.applyQuaternion(camera.quaternion);
      camera.position.add(direction);
    } else {
      // Horizontal movement only in normal mode
      const yRotation = new THREE.Euler(0, euler.y, 0, 'YXZ');
      const quaternion = new THREE.Quaternion().setFromEuler(yRotation);
      const horizontalDir = new THREE.Vector3(direction.x, 0, direction.z);
      horizontalDir.applyQuaternion(quaternion);
      camera.position.add(horizontalDir);
    }
  }
  
  // Rotate cube
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  
  renderer.render(scene, camera);
}

animate();

// Final performance report
performance.mark('app-ready');
performance.measure('total-load', 'app-start', 'app-ready');
const totalTime = performance.getEntriesByName('total-load')[0].duration;
console.log('✅ Animation loop started');
console.log(`🎉 ArxisVR carregado em ${totalTime.toFixed(0)}ms`);
console.log('💡 Dica: Use duplo-clique para controle FPS, ESC para sair');
console.log('💡 Ctrl+O para abrir arquivos IFC');

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

// Toolbar buttons
const toolbarButtons = document.querySelectorAll('.toolbar-btn');
console.log(`🔍 Found ${toolbarButtons.length} toolbar buttons`);
let activeTool = 'select';

// Store panel instances
let activePanels: Map<string, any> = new Map();

toolbarButtons.forEach((button, index) => {
  console.log(`  Button ${index}: ${button.getAttribute('data-tool')}`);
  button.addEventListener('click', (e) => {
    console.log(`🖱️ CLICK on button:`, button.getAttribute('data-tool'));
    const tool = button.getAttribute('data-tool');
    if (!tool) return;
    
    // Update active state
    toolbarButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    activeTool = tool;
    
    // Close previous panel if exists
    if (activePanels.has(tool) && activePanels.get(tool)) {
      const panel = activePanels.get(tool);
      if (panel && panel.element && panel.element.parentElement) {
        panel.destroy();
        activePanels.delete(tool);
        console.log(`❌ Closed ${tool} panel`);
        return;
      }
    }
    
    // Tool actions - Create actual panels using registry
    switch(tool) {
      case 'select':
        console.log('👆 Ferramenta: Selecionar');
        break;
      case 'measure':
        console.log('📏 Ferramenta: Medir');
        const measurePanel = createComponent('MeasurementPanel');
        if (measurePanel) {
          document.body.appendChild(measurePanel.element);
          activePanels.set(tool, measurePanel);
        }
        break;
      case 'section':
        console.log('✂️ Ferramenta: Corte/Seção');
        const sectionPanel = createComponent('SectionBoxTool');
        if (sectionPanel) {
          document.body.appendChild(sectionPanel.element);
          activePanels.set(tool, sectionPanel);
        }
        break;
      case 'layers':
        console.log('📁 Ferramenta: Camadas');
        const layersPanel = createComponent('LayersPanel');
        if (layersPanel) {
          document.body.appendChild(layersPanel.element);
          activePanels.set(tool, layersPanel);
        }
        break;
      case 'transparency':
        console.log('👻 Ferramenta: Transparência');
        const transparencyPanel = createComponent('TransparencyControl');
        if (transparencyPanel) {
          document.body.appendChild(transparencyPanel.element);
          activePanels.set(tool, transparencyPanel);
        }
        break;
      case 'explode':
        console.log('💥 Ferramenta: Vista Explodida');
        const explodePanel = createComponent('ExplodeViewPanel');
        if (explodePanel) {
          document.body.appendChild(explodePanel.element);
          activePanels.set(tool, explodePanel);
        }
        break;
      case 'camera':
        console.log('📷 Ferramenta: Vistas de Câmera');
        const cameraPanel = createComponent('CameraPresetsPanel');
        if (cameraPanel) {
          document.body.appendChild(cameraPanel.element);
          activePanels.set(tool, cameraPanel);
        }
        break;
      case 'annotate':
        console.log('📝 Ferramenta: Anotar');
        const annotatePanel = createComponent('AnnotationsPanel');
        if (annotatePanel) {
          document.body.appendChild(annotatePanel.element);
          activePanels.set(tool, annotatePanel);
        }
        break;
      case 'comments':
        console.log('💬 Ferramenta: Comentários');
        const chatPanel = createComponent('ChatPanel');
        if (chatPanel) {
          document.body.appendChild(chatPanel.element);
          activePanels.set(tool, chatPanel);
        }
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
      case 'settings':
        console.log('⚙️ Ferramenta: Configurações');
        const settingsPanel = createComponent('SettingsPanel');
        if (settingsPanel) {
          document.body.appendChild(settingsPanel.element);
          activePanels.set(tool, settingsPanel);
        }
        break;
    }
  });
});

// Keyboard shortcuts for tools
window.addEventListener('keydown', async (e) => {
  if (isPointerLocked) return; // Don't trigger when mouse is locked
  
  // Ctrl+O to open file
  if (e.ctrlKey && e.key.toLowerCase() === 'o') {
    e.preventDefault();
    console.log('📁 Ctrl+O: Opening LoadFileModal');
    
    // Check if modal already exists
    if (activePanels.has('LoadFileModal')) {
      const existingModal = activePanels.get('LoadFileModal');
      if (existingModal && existingModal.open) {
        existingModal.open();
      }
    } else {
      // Create new modal
      const modal = await createComponent('LoadFileModal');
      if (modal) {
        if (modal.open && typeof modal.open === 'function') {
          modal.open();
        }
        activePanels.set('LoadFileModal', modal);
        console.log('✅ LoadFileModal created and opened');
      }
    }
    return;
  }
  
  let toolButton: Element | null = null;
  
  switch(e.key.toLowerCase()) {
    case 'q': toolButton = document.querySelector('[data-tool="select"]'); break;
    case 'm': toolButton = document.querySelector('[data-tool="measure"]'); break;
    case 'c': toolButton = document.querySelector('[data-tool="section"]'); break;
    case 'l': toolButton = document.querySelector('[data-tool="layers"]'); break;
    case 't': toolButton = document.querySelector('[data-tool="transparency"]'); break;
    case 'e': toolButton = document.querySelector('[data-tool="explode"]'); break;
    case 'v': toolButton = document.querySelector('[data-tool="camera"]'); break;
    case 'a': toolButton = document.querySelector('[data-tool="annotate"]'); break;
    case 'k': toolButton = document.querySelector('[data-tool="comments"]'); break;
    case ',': toolButton = document.querySelector('[data-tool="settings"]'); break;
  }
  
  if (toolButton) {
    (toolButton as HTMLElement).click();
  }
});

console.log('✅ Toolbar initialized with 11 tools + Ctrl+O shortcut');

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

// Close menu on ESC
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && componentsMenu && componentsMenu.style.display === 'flex') {
    componentsMenu.style.display = 'none';
  }
});

// Component buttons in menu
console.log(`🔍 Found ${componentButtons.length} component buttons in menu`);
componentButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const componentName = button.getAttribute('data-component');
    if (!componentName) return;
    
    console.log(`🖱️ Creating component: ${componentName}`);
    
    // Close menu
    if (componentsMenu) {
      componentsMenu.style.display = 'none';
    }
    
    // Check if component already exists
    if (activePanels.has(componentName)) {
      const existingPanel = activePanels.get(componentName);
      if (existingPanel) {
        console.log(`ℹ️ Component ${componentName} already open`);
        // If it's a modal, try to open it again
        if (existingPanel.open && typeof existingPanel.open === 'function') {
          existingPanel.open();
        }
        return;
      }
    }
    
    // Create component
    const component = createComponent(componentName);
    if (component) {
      // Modals open themselves, panels need to be appended
      if (component.element) {
        document.body.appendChild(component.element);
      }
      // If component has an open method (like modals), call it
      if (component.open && typeof component.open === 'function') {
        component.open();
      }
      activePanels.set(componentName, component);
      console.log(`✅ Component ${componentName} created`);
    }
  });
});

// Menu bar buttons (same logic as component buttons)
const menuBarButtons = document.querySelectorAll('.menu-bar-dropdown button[data-component]');
console.log(`🔍 Found ${menuBarButtons.length} menu bar buttons`);
menuBarButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const componentName = button.getAttribute('data-component');
    if (!componentName) return;
    
    console.log(`🖱️ Creating component from menu bar: ${componentName}`);
    
    // Check if component already exists
    if (activePanels.has(componentName)) {
      const existingPanel = activePanels.get(componentName);
      if (existingPanel) {
        console.log(`ℹ️ Component ${componentName} already open`);
        // If it's a modal, try to open it again
        if (existingPanel.open && typeof existingPanel.open === 'function') {
          existingPanel.open();
        }
        return;
      }
    }
    
    // Create component
    const component = createComponent(componentName);
    if (component) {
      // Modals open themselves, panels need to be appended
      if (component.element) {
        document.body.appendChild(component.element);
      }
      // If component has an open method (like modals), call it
      if (component.open && typeof component.open === 'function') {
        component.open();
      }
      activePanels.set(componentName, component);
      console.log(`✅ Component ${componentName} created from menu bar`);
    }
  });
});

console.log('✅ Components menu initialized');
console.log('✅ Menu bar initialized');

// ========================================
// CORE SYSTEMS DEMO
// ========================================
console.log('\n🎯 Running Core Systems Demo...\n');

// Aguarda a cena estar pronta
setTimeout(() => {
  coreSystemsDemo.runAllDemos(scene);
}, 1000);

// Export for debugging
if (typeof window !== 'undefined') {
  (window as any).scene = scene;
  (window as any).camera = camera;
  (window as any).renderer = renderer;
  (window as any).georeferencing = georeferencing;
  (window as any).openBIM = openBIM;
  (window as any).versioning = versioning;
  (window as any).metricPrecision = metricPrecision;
  (window as any).ifc43AlignmentSystem = ifc43AlignmentSystem;
  (window as any).coreSystemsDemo = coreSystemsDemo;
  console.log('🎯 Debug: Core systems available in window object');
  console.log('   - window.georeferencing');
  console.log('   - window.openBIM');
  console.log('   - window.versioning');
  console.log('   - window.metricPrecision');
  console.log('   - window.ifc43AlignmentSystem');
  console.log('   - window.coreSystemsDemo');
}

