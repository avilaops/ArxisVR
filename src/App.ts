/**
 * App.ts - Composition root (entry point)
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
  const ifcLoader = new IFCLoader(scene, lodSystem, entityManager);
  const modelSession = new ModelSession(scene, camera);
  
  console.log('✅ IFCLoader created:', ifcLoader);
  
  // AppController é singleton
  const AppControllerClass = (await import('./app/AppController')).AppController as any;
  const appController = AppControllerClass.getInstance();

  // 5. Register services in DI
  console.log('📝 Registering services in DI...');
  di.register('ifcLoader', ifcLoader);
  di.register('modelSession', modelSession);
  di.register('appController', appController);
  
  console.log('✅ Services registered. IFCLoader in DI:', di.has('ifcLoader'));

  // 6. Configure FileService - usa callback wrapper
  fileService.setIfcLoader(async (file: File) => {
    await ifcLoader.loadIFC(file);
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
