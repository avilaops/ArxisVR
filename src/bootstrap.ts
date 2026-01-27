/**
 * bootstrap.ts - Composition root (entry point)
 * Inicializa AppShell e serviços
 */

import './styles/tokens.css';
import './styles/app.css';

import { AppShell } from './app/AppShell';
import { di } from './app/di';
import { uiStore } from './app/state/uiStore';
import { eventBus } from './app/state/eventBus';
import { ModelSession } from './systems/model/ModelSession';
import { IFCLoader } from './loaders/IFCLoader';
import { IFCOptimizedLoader } from './loaders/IFCOptimizedLoader';
import { LoadingOverlay } from './ui/LoadingOverlay';
import { fileService } from './systems/file';

/**
 * Bootstrap application
 */
async function bootstrap() {
  console.log('🚀 ArxisVR starting...');

  // 1. Get root container
  const root = document.getElementById('app');
  if (!root) {
    throw new Error('Root element #app not found');
  }

  // 2. Initialize AppShell (monta layout)
  const appShell = new AppShell(root);

  // 3. Get Three.js references from ViewerHost
  const viewerHost = appShell.getViewerHost();
  const { scene, camera, renderer } = viewerHost;

  // 4. Initialize core services
  console.log('📦 Initializing services...');
  
  const entityManager = new (await import('./engine/ecs')).EntityManager();
  const lodSystem = new (await import('./systems/LODSystem')).LODSystem(camera, entityManager);
  
  // NOVO: IFC Loader ULTRA otimizado com todas as técnicas de performance
  const ifcOptimizedLoader = new IFCOptimizedLoader(scene, camera, lodSystem, entityManager);
  const loadingOverlay = new LoadingOverlay();
  
  // Fallback: IFC Loader tradicional (manter por compatibilidade)
  const ifcLoader = new IFCLoader(scene, lodSystem, entityManager);
  
  const modelSession = new ModelSession(scene, camera);
  
  console.log('✅ IFCOptimizedLoader created:', ifcOptimizedLoader);
  
  // AppController é singleton
  const AppControllerClass = (await import('./app/AppController')).AppController as any;
  const appController = AppControllerClass.getInstance();

  // 5. Register services in DI
  console.log('📝 Registering services in DI...');
  di.register('ifcLoader', ifcLoader); // Tradicional (fallback)
  di.register('ifcOptimizedLoader', ifcOptimizedLoader); // NOVO: Ultra otimizado
  di.register('loadingOverlay', loadingOverlay);
  di.register('modelSession', modelSession);
  di.register('appController', appController);
  
  console.log('✅ Services registered. IFCOptimizedLoader in DI:', di.has('ifcOptimizedLoader'));

  // 6. Configure FileService - usa o loader OTIMIZADO por padrão
  fileService.setIfcLoader(async (file: File) => {
    console.log('🚀 Usando IFC Loader OTIMIZADO para máxima performance!');
    
    try {
      // Usar loader otimizado com todas as técnicas de performance
      await ifcOptimizedLoader.loadOptimized(file);
      
      console.log('✅ Arquivo carregado com sucesso usando loader otimizado!');
      console.log('📊 Estatísticas:', ifcOptimizedLoader.getStats());
    } catch (error) {
      console.error('❌ Erro no loader otimizado, tentando fallback...', error);
      
      // Fallback para loader tradicional em caso de erro
      await ifcLoader.loadIFC(file);
    }
  });

  // 7. Listen to file load events
  eventBus.on('ModelLoaded', (event) => {
    console.log('✅ Model loaded:', event.payload);
    
    // Auto-switch to layers panel
    uiStore.setActiveView('layers');
  });

  // 8. Setup app controller
  appController.setEngineReferences(scene, camera, renderer);

  console.log('✨ ArxisVR ready!');
  console.log('💡 Press Ctrl+B to toggle sidebar');
  console.log('💡 Press Escape to close modals');

  // Expose for debugging (only in dev)
  if (import.meta.env.DEV) {
    (window as any).appShell = appShell;
    (window as any).di = di;
    (window as any).uiStore = uiStore;
    (window as any).eventBus = eventBus;
  }
}

// Start app
bootstrap().catch((error) => {
  console.error('❌ Failed to start ArxisVR:', error);
  document.body.innerHTML = `
    <div style="padding: 20px; color: #f44336; font-family: monospace;">
      <h1>Failed to start ArxisVR</h1>
      <pre>${error.message}\n\n${error.stack}</pre>
    </div>
  `;
});
