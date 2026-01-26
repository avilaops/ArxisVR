import { CommandId, CommandPayload } from './Command';
import { commandRegistry } from './CommandRegistry';
import { appController, commandHistory, projectSerializer } from '../app';
import { eventBus, EventType } from '../core';
import { 
  getThemeSelectorModal, 
  getNetworkConnectModal, 
  getShortcutsModal, 
  getSettingsModal,
  getAboutModal
} from '../ui/modals';

/**
 * CommandHandlers - Implementação dos handlers de todos os comandos
 * 
 * Organizado por categorias:
 * - File: New, Open, Save, Export, Close
 * - Edit: Undo, Redo, Cut, Copy, Paste, Delete, Select
 * - View: Camera, Focus, Frame, Toggle UI
 * - Model: Show/Hide, Isolate, Filter by Class
 * - Tools: Selection, Navigation, Measurement, Layer
 * - Theme: Select theme
 * - Help: Docs, Shortcuts, About
 */

/**
 * Registra todos os handlers de comandos
 */
export function registerAllCommandHandlers(): void {
  registerFileHandlers();
  registerEditHandlers();
  registerViewHandlers();
  registerModelHandlers();
  registerToolHandlers();
  registerXRHandlers();
  registerNetworkHandlers();
  registerThemeHandlers();
  registerHelpHandlers();
  
  console.log('✅ All command handlers registered');
}

// ==================== FILE HANDLERS ====================

function registerFileHandlers(): void {
  // FILE_NEW
  commandRegistry.register(
    {
      id: CommandId.FILE_NEW,
      label: 'New Project',
      category: 'file',
      shortcut: 'Ctrl+N'
    },
    async (payload?: CommandPayload) => {
      console.log('📄 Creating new project...');
      
      // Confirma se há mudanças não salvas
      const currentProject = appController.getState().projectContext;
      if (currentProject.modelLoaded) {
        const confirm = window.confirm('Are you sure? Unsaved changes will be lost.');
        if (!confirm) return;
      }
      
      // Template (empty ou ifc-viewer)
      const template = payload?.template || 'empty';
      
      // Limpa estado via AppController
      appController.projectManager.reset();
      appController.selectionManager.deselectAll();
      appController.layerManager.clearLayers();
      commandHistory.clear();
      
      // Emite evento para engine limpar cena
      eventBus.emit(EventType.PROJECT_RESET, { template });
      
      console.log(`✅ New project created (template: ${template})`);
    }
  );

  // FILE_OPEN
  commandRegistry.register(
    {
      id: CommandId.FILE_OPEN,
      label: 'Open',
      category: 'file',
      shortcut: 'Ctrl+O'
    },
    async () => {
      console.log('📂 Opening file dialog...');
      
      // Cria file picker
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.ifc,.gltf,.glb,.obj,.fbx,.arxis.json';
      
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;
        
        // Detecta tipo pelo nome
        const ext = file.name.split('.').pop()?.toLowerCase();
        let kind: 'ifc' | 'gltf' | 'obj' | 'project' = 'ifc';
        
        if (ext === 'gltf' || ext === 'glb') kind = 'gltf';
        else if (ext === 'obj' || ext === 'fbx') kind = 'obj';
        else if (file.name.includes('.arxis.json')) kind = 'project';
        
        // Emite FILE_SELECTED
        eventBus.emit(EventType.FILE_SELECTED, { file, kind });
        
        // Se for projeto, carrega via ProjectSerializer
        if (kind === 'project') {
          projectSerializer.loadFromFile(file).then(projectData => {
            eventBus.emit(EventType.PROJECT_LOADED, { projectData });
          }).catch(error => {
            console.error('Failed to load project:', error);
            alert('Failed to load project: ' + error.message);
          });
        } else {
          // Se for modelo 3D, emite MODEL_LOAD_REQUESTED
          eventBus.emit(EventType.MODEL_LOAD_REQUESTED, {
            kind,
            source: 'file',
            fileRef: file
          });
        }
      };
      
      input.click();
    }
  );

  // FILE_OPEN_IFC
  commandRegistry.register(
    {
      id: CommandId.FILE_OPEN_IFC,
      label: 'Open IFC',
      category: 'file'
    },
    async () => {
      console.log('🏗️ Opening IFC file...');
      
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.ifc';
      
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;
        
        // Emite FILE_SELECTED
        eventBus.emit(EventType.FILE_SELECTED, { file, kind: 'ifc' });
        
        // Emite MODEL_LOAD_REQUESTED
        eventBus.emit(EventType.MODEL_LOAD_REQUESTED, {
          kind: 'ifc',
          source: 'file',
          fileRef: file
        });
      };
      
      input.click();
    }
  );

  // FILE_OPEN_GLTF
  commandRegistry.register(
    {
      id: CommandId.FILE_OPEN_GLTF,
      label: 'Open GLTF/GLB',
      category: 'file'
    },
    async () => {
      console.log('📦 Opening GLTF file...');
      
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.gltf,.glb';
      
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;
        
        eventBus.emit(EventType.FILE_SELECTED, { file, kind: 'gltf' });
        
        eventBus.emit(EventType.MODEL_LOAD_REQUESTED, {
          kind: 'gltf',
          source: 'file',
          fileRef: file
        });
      };
      
      input.click();
    }
  );

  // FILE_OPEN_OBJ
  commandRegistry.register(
    {
      id: CommandId.FILE_OPEN_OBJ,
      label: 'Open OBJ/FBX',
      category: 'file'
    },
    async () => {
      console.log('🗿 Opening OBJ file...');
      
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.obj,.fbx';
      
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;
        
        eventBus.emit(EventType.FILE_SELECTED, { file, kind: 'obj' });
        
        eventBus.emit(EventType.MODEL_LOAD_REQUESTED, {
          kind: 'obj',
          source: 'file',
          fileRef: file
        });
      };
      
      input.click();
    }
  );

  // FILE_SAVE
  commandRegistry.register(
    {
      id: CommandId.FILE_SAVE,
      label: 'Save',
      category: 'file',
      shortcut: 'Ctrl+S'
    },
    async () => {
      console.log('💾 Saving project...');
      
      // Obtém referências da cena
      const sceneManager = (appController as any).sceneManager;
      const cameraSystem = (appController as any).cameraSystem;
      
      if (!sceneManager || !cameraSystem) {
        console.error('❌ Scene or camera not available');
        return;
      }
      
      // Serializa projeto
      const projectData = projectSerializer.serialize(
        sceneManager.scene,
        cameraSystem.camera,
        'ArxisVR Project'
      );
      
      // Salva em arquivo
      projectSerializer.saveToFile(projectData);
      
      eventBus.emit(EventType.PROJECT_SAVE, {});
      console.log('✅ Project saved successfully');
    }
  );

  // FILE_SAVE_AS
  commandRegistry.register(
    {
      id: CommandId.FILE_SAVE_AS,
      label: 'Save As',
      category: 'file',
      shortcut: 'Ctrl+Shift+S'
    },
    async () => {
      console.log('💾 Save As...');
      
      // Prompt para nome do projeto
      const projectName = prompt('Project name:', 'ArxisVR Project');
      if (!projectName) return;
      
      // Obtém referências da cena
      const sceneManager = (appController as any).sceneManager;
      const cameraSystem = (appController as any).cameraSystem;
      
      if (!sceneManager || !cameraSystem) {
        console.error('❌ Scene or camera not available');
        return;
      }
      
      // Serializa projeto
      const projectData = projectSerializer.serialize(
        sceneManager.scene,
        cameraSystem.camera,
        projectName
      );
      
      // Salva em arquivo
      projectSerializer.saveToFile(projectData, `${projectName}.arxis.json`);
      
      eventBus.emit(EventType.PROJECT_SAVE_AS, {});
      console.log('✅ Project saved as successfully');
    }
  );

  // FILE_EXPORT_GLB
  commandRegistry.register(
    {
      id: CommandId.FILE_EXPORT_GLB,
      label: 'Export Scene as GLB',
      category: 'file'
    },
    async (payload?: CommandPayload) => {
      console.log('📤 Exporting GLB...');
      
      // Emite evento para engine fazer export
      eventBus.emit(EventType.EXPORT_GLB_REQUESTED, {
        selection: payload?.selection || false
      });
      
      // TODO: Engine escuta evento e faz export usando GLTFExporter
      console.log('⚠️ GLB export not fully implemented yet');
    }
  );
  
  // FILE_EXPORT_SELECTION
  commandRegistry.register(
    {
      id: CommandId.FILE_EXPORT_SELECTION,
      label: 'Export Selection',
      category: 'file'
    },
    async () => {
      console.log('📤 Exporting selection...');
      
      eventBus.emit(EventType.EXPORT_GLB_REQUESTED, {
        selection: true
      });
      
      console.log('⚠️ Selection export not fully implemented yet');
    }
  );

  // FILE_EXPORT_SCREENSHOT
  commandRegistry.register(
    {
      id: CommandId.FILE_EXPORT_SCREENSHOT,
      label: 'Export Screenshot',
      category: 'file',
      shortcut: 'Ctrl+P'
    },
    async (payload?: CommandPayload) => {
      console.log('📸 Taking screenshot...');
      
      try {
        // Pega referências via dynamic import para evitar circular deps
        const THREE = await import('three');
        
        // Acessa canvas do renderer
        const canvas = document.querySelector('canvas');
        if (!canvas) {
          throw new Error('Canvas not found');
        }
        
        // Captura em alta resolução
        const width = payload?.width || canvas.width;
        const height = payload?.height || canvas.height;
        
        // Captura do canvas atual
        canvas.toBlob((blob) => {
          if (!blob) {
            console.error('❌ Failed to create blob');
            return;
          }
          
          // Download
          const link = document.createElement('a');
          const filename = `arxisvr-screenshot-${Date.now()}.png`;
          link.download = filename;
          link.href = URL.createObjectURL(blob);
          link.click();
          
          // Cleanup
          setTimeout(() => URL.revokeObjectURL(link.href), 100);
          
          eventBus.emit(EventType.EXPORT_COMPLETED, { 
            type: 'screenshot',
            filename 
          });
          
          console.log(`✅ Screenshot saved: ${filename}`);
        }, 'image/png');
        
      } catch (error) {
        console.error('❌ Screenshot failed:', error);
        eventBus.emit(EventType.EXPORT_FAILED, { 
          type: 'screenshot',
          error: (error as Error).message 
        });
        eventBus.emit(EventType.EXPORT_FAILED, {
          type: 'screenshot',
          error: String(error)
        });
      }
    }
  );

  // FILE_CLOSE
  commandRegistry.register(
    {
      id: CommandId.FILE_CLOSE,
      label: 'Close',
      category: 'file',
      shortcut: 'Ctrl+W'
    },
    async () => {
      console.log('❌ Closing project...');
      eventBus.emit(EventType.PROJECT_CLOSE, {});
      // TODO: Implement close logic
    }
  );
}

// ==================== EDIT HANDLERS ====================

function registerEditHandlers(): void {
  // EDIT_UNDO
  commandRegistry.register(
    {
      id: CommandId.EDIT_UNDO,
      label: 'Undo',
      category: 'edit',
      shortcut: 'Ctrl+Z'
    },
    async () => {
      console.log('↶ Undo');
      const success = await commandHistory.undo();
      if (!success) {
        console.warn('⚠️ Nothing to undo');
      }
    }
  );

  // EDIT_REDO
  commandRegistry.register(
    {
      id: CommandId.EDIT_REDO,
      label: 'Redo',
      category: 'edit',
      shortcut: 'Ctrl+Y'
    },
    async () => {
      console.log('↷ Redo');
      const success = await commandHistory.redo();
      if (!success) {
        console.warn('⚠️ Nothing to redo');
      }
    }
  );

  // EDIT_CUT
  commandRegistry.register(
    {
      id: CommandId.EDIT_CUT,
      label: 'Cut',
      category: 'edit',
      shortcut: 'Ctrl+X'
    },
    async () => {
      console.log('✂️ Cut');
      const state = appController.getState();
      if (state.selectedObjects.length > 0) {
        eventBus.emit(EventType.EDIT_CUT, { objects: state.selectedObjects.map(item => item.object.uuid) });
      }
    }
  );

  // EDIT_COPY
  commandRegistry.register(
    {
      id: CommandId.EDIT_COPY,
      label: 'Copy',
      category: 'edit',
      shortcut: 'Ctrl+C'
    },
    async () => {
      console.log('📋 Copy');
      const state = appController.getState();
      if (state.selectedObjects.length > 0) {
        eventBus.emit(EventType.EDIT_COPY, { objects: state.selectedObjects.map(item => item.object.uuid) });
      }
    }
  );

  // EDIT_PASTE
  commandRegistry.register(
    {
      id: CommandId.EDIT_PASTE,
      label: 'Paste',
      category: 'edit',
      shortcut: 'Ctrl+V'
    },
    async () => {
      console.log('📌 Paste');
      eventBus.emit(EventType.EDIT_PASTE, {});
    }
  );

  // EDIT_DELETE
  commandRegistry.register(
    {
      id: CommandId.EDIT_DELETE,
      label: 'Delete',
      category: 'edit',
      shortcut: 'Delete'
    },
    async () => {
      console.log('🗑️ Delete');
      const state = appController.getState();
      if (state.selectedObjects.length > 0) {
        eventBus.emit(EventType.EDIT_DELETE, { objects: state.selectedObjects.map(item => item.object.uuid) });
      }
    }
  );

  // EDIT_SELECT_ALL
  commandRegistry.register(
    {
      id: CommandId.EDIT_SELECT_ALL,
      label: 'Select All',
      category: 'edit',
      shortcut: 'Ctrl+A'
    },
    async () => {
      console.log('✅ Select All');
      eventBus.emit(EventType.SELECT_ALL, {});
    }
  );

  // EDIT_DESELECT_ALL
  commandRegistry.register(
    {
      id: CommandId.EDIT_DESELECT_ALL,
      label: 'Deselect All',
      category: 'edit',
      shortcut: 'Ctrl+D'
    },
    async () => {
      console.log('⬜ Deselect All');
      eventBus.emit(EventType.DESELECT_ALL, {});
    }
  );
}

// ==================== VIEW HANDLERS ====================

function registerViewHandlers(): void {
  // VIEW_TOP
  commandRegistry.register(
    {
      id: CommandId.VIEW_TOP,
      label: 'Top View',
      category: 'view'
    },
    async () => {
      console.log('⬆️ Top View');
      eventBus.emit(EventType.CAMERA_VIEW_CHANGE, { view: 'top' });
    }
  );

  // VIEW_FRONT
  commandRegistry.register(
    {
      id: CommandId.VIEW_FRONT,
      label: 'Front View',
      category: 'view'
    },
    async () => {
      console.log('➡️ Front View');
      eventBus.emit(EventType.CAMERA_VIEW_CHANGE, { view: 'front' });
    }
  );

  // VIEW_SIDE
  commandRegistry.register(
    {
      id: CommandId.VIEW_SIDE,
      label: 'Side View',
      category: 'view'
    },
    async () => {
      console.log('⬅️ Side View');
      eventBus.emit(EventType.CAMERA_VIEW_CHANGE, { view: 'side' });
    }
  );

  // VIEW_ISOMETRIC
  commandRegistry.register(
    {
      id: CommandId.VIEW_ISOMETRIC,
      label: 'Isometric View',
      category: 'view'
    },
    async () => {
      console.log('📐 Isometric View');
      eventBus.emit(EventType.CAMERA_VIEW_CHANGE, { view: 'isometric' });
    }
  );

  // VIEW_FOCUS_SELECTION
  commandRegistry.register(
    {
      id: CommandId.VIEW_FOCUS_SELECTION,
      label: 'Focus Selection',
      category: 'view',
      shortcut: 'F'
    },
    async () => {
      console.log('🎯 Focus Selection');
      eventBus.emit(EventType.CAMERA_FOCUS_SELECTION, {});
    }
  );

  // VIEW_FRAME_ALL
  commandRegistry.register(
    {
      id: CommandId.VIEW_FRAME_ALL,
      label: 'Frame All',
      category: 'view',
      shortcut: 'H'
    },
    async () => {
      console.log('🖼️ Frame All');
      eventBus.emit(EventType.CAMERA_FRAME_ALL, {});
    }
  );

  // VIEW_TOGGLE_GRID
  commandRegistry.register(
    {
      id: CommandId.VIEW_TOGGLE_GRID,
      label: 'Toggle Grid',
      category: 'view',
      shortcut: 'G'
    },
    async () => {
      console.log('#️⃣ Toggle Grid');
      // Chama função global do main-simple.ts
      const isVisible = (window as any).toggleGrid?.();
      console.log(`Grid ${isVisible ? 'ativado' : 'desativado'}`);
    }
  );

  // VIEW_TOGGLE_AXES
  commandRegistry.register(
    {
      id: CommandId.VIEW_TOGGLE_AXES,
      label: 'Toggle Axes',
      category: 'view',
      shortcut: 'X'
    },
    async () => {
      console.log('📍 Toggle Axes');
      eventBus.emit(EventType.VIEW_TOGGLE_AXES, {});
    }
  );

  // VIEW_TOGGLE_STATS
  commandRegistry.register(
    {
      id: CommandId.VIEW_TOGGLE_STATS,
      label: 'Toggle Stats',
      category: 'view',
      shortcut: 'Shift+S'
    },
    async () => {
      console.log('📊 Toggle Stats');
      const currentState = appController.getState().viewState;
      const newState = !currentState.statsEnabled;
      appController.getState().setStatsEnabled(newState);
      eventBus.emit(EventType.VIEW_TOGGLE_STATS, { enabled: newState });
      appController['notifyStateChange']?.();
    }
  );

  // VIEW_FULLSCREEN
  commandRegistry.register(
    {
      id: CommandId.VIEW_FULLSCREEN,
      label: 'Fullscreen',
      category: 'view',
      shortcut: 'F11'
    },
    async () => {
      console.log('⛶ Toggle Fullscreen');
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  );
  
  // VIEW_SET_RENDER_QUALITY (FASE 5)
  commandRegistry.register(
    {
      id: CommandId.VIEW_SET_RENDER_QUALITY,
      label: 'Set Render Quality',
      category: 'view'
    },
    async (payload?: CommandPayload) => {
      const quality = payload?.quality;
      if (!quality) {
        console.warn('⚠️ No quality specified');
        return;
      }
      
      console.log(`🎨 Setting render quality: ${quality}`);
      appController.setRenderQuality(quality);
      console.log('✅ Render quality updated');
    }
  );
  
  // VIEW_SET_CAMERA_MODE (FASE 5)
  commandRegistry.register(
    {
      id: CommandId.VIEW_SET_CAMERA_MODE,
      label: 'Set Camera Mode',
      category: 'view'
    },
    async (payload?: CommandPayload) => {
      const mode = payload?.mode;
      if (!mode) {
        console.warn('⚠️ No camera mode specified');
        return;
      }
      
      console.log(`📷 Setting camera mode: ${mode}`);
      appController.getState().setCameraMode(mode);
      eventBus.emit(EventType.CAMERA_MODE_CHANGED, { mode });
      console.log('✅ Camera mode updated');
    }
  );
}

// ==================== MODEL HANDLERS ====================

function registerModelHandlers(): void {
  // MODEL_SHOW_ALL
  commandRegistry.register(
    {
      id: CommandId.MODEL_SHOW_ALL,
      label: 'Show All',
      category: 'model'
    },
    async () => {
      console.log('👁️ Show All');
      eventBus.emit(EventType.MODEL_SHOW_ALL, {});
    }
  );

  // MODEL_HIDE_SELECTED
  commandRegistry.register(
    {
      id: CommandId.MODEL_HIDE_SELECTED,
      label: 'Hide Selected',
      category: 'model'
    },
    async () => {
      console.log('🙈 Hide Selected');
      const state = appController.getState();
      if (state.selectedObjects.length > 0) {
        eventBus.emit(EventType.MODEL_HIDE_SELECTED, { objects: state.selectedObjects.map(item => item.object.uuid) });
      }
    }
  );

  // MODEL_ISOLATE_SELECTED
  commandRegistry.register(
    {
      id: CommandId.MODEL_ISOLATE_SELECTED,
      label: 'Isolate Selected',
      category: 'model'
    },
    async () => {
      console.log('🔒 Isolate Selected');
      const state = appController.getState();
      if (state.selectedObjects.length > 0) {
        eventBus.emit(EventType.MODEL_ISOLATE_SELECTED, { objects: state.selectedObjects.map(item => item.object.uuid) });
      }
    }
  );

  // MODEL_HIDE_BY_CLASS
  commandRegistry.register(
    {
      id: CommandId.MODEL_HIDE_BY_CLASS,
      label: 'Hide by Class',
      category: 'model'
    },
    async (payload?: CommandPayload) => {
      console.log('🏗️ Hide by Class:', payload);
      if (payload?.ifcClass) {
        eventBus.emit(EventType.MODEL_HIDE_BY_CLASS, { ifcClass: payload.ifcClass });
      }
    }
  );
}

// ==================== TOOL HANDLERS ====================

function registerToolHandlers(): void {
  // TOOL_SELECT
  commandRegistry.register(
    {
      id: CommandId.TOOL_SELECT,
      label: 'Selection Tool',
      category: 'tool',
      shortcut: 'Q'
    },
    async () => {
      console.log('👆 Selection Tool');
      appController.toolManager?.setActiveTool('selection');
    }
  );

  // TOOL_NAVIGATE - Removido: navegação é global via WASD
  // Não precisa mais de comando/ferramenta separada

  // TOOL_MEASURE
  commandRegistry.register(
    {
      id: CommandId.TOOL_MEASURE,
      label: 'Measurement Tool',
      category: 'tool',
      shortcut: 'E'
    },
    async () => {
      console.log('📏 Measurement Tool');
      appController.toolManager?.setActiveTool('measurement');
    }
  );

  // TOOL_LAYER
  commandRegistry.register(
    {
      id: CommandId.TOOL_LAYER,
      label: 'Layer Tool',
      category: 'tool',
      shortcut: 'R'
    },
    async () => {
      console.log('📚 Layer Tool');
      appController.toolManager?.setActiveTool('layer');
    }
  );
}

// ==================== XR HANDLERS (FASE 5) ====================

function registerXRHandlers(): void {
  // Import XRManager dinamicamente para evitar circular dependencies
  let xrManagerPromise: Promise<any> | null = null;
  
  const getXRManager = async () => {
    if (!xrManagerPromise) {
      xrManagerPromise = import('../xr').then(m => m.xrManager);
    }
    return xrManagerPromise;
  };
  
  // XR_ENTER
  commandRegistry.register(
    {
      id: CommandId.XR_ENTER,
      label: 'Enter VR',
      category: 'xr',
      shortcut: 'V'
    },
    async () => {
      console.log('🥽 Enter VR');
      
      try {
        const xrManager = await getXRManager();
        await xrManager.enterXR('vr');
      } catch (error) {
        console.error('Failed to enter VR:', error);
        alert('Failed to enter VR: ' + (error as Error).message);
      }
    }
  );
  
  // XR_EXIT
  commandRegistry.register(
    {
      id: CommandId.XR_EXIT,
      label: 'Exit VR',
      category: 'xr'
    },
    async () => {
      console.log('🥽 Exit VR');
      
      try {
        const xrManager = await getXRManager();
        await xrManager.exitXR();
      } catch (error) {
        console.error('Failed to exit VR:', error);
      }
    }
  );
  
  // XR_TOGGLE
  commandRegistry.register(
    {
      id: CommandId.XR_TOGGLE,
      label: 'Toggle VR',
      category: 'xr',
      shortcut: 'Shift+V'
    },
    async () => {
      console.log('🥽 Toggle VR');
      
      try {
        const xrManager = await getXRManager();
        
        if (xrManager.isActive) {
          await xrManager.exitXR();
        } else {
          await xrManager.enterXR('vr');
        }
      } catch (error) {
        console.error('Failed to toggle VR:', error);
        alert('Failed to toggle VR: ' + (error as Error).message);
      }
    }
  );
}

// ==================== NETWORK HANDLERS (FASE 5) ====================

function registerNetworkHandlers(): void {
  // Import networkManager dinamicamente
  let networkManagerPromise: Promise<any> | null = null;
  
  const getNetworkManager = async () => {
    if (!networkManagerPromise) {
      networkManagerPromise = import('../network').then(m => m.networkManager);
    }
    return networkManagerPromise;
  };
  
  // NET_CONNECT
  commandRegistry.register(
    {
      id: CommandId.NET_CONNECT,
      label: 'Connect Multiplayer',
      category: 'network'
    },
    async (payload?: CommandPayload) => {
      console.log('🌐 Connect Multiplayer');
      
      // Se payload tem dados, conecta direto (vem do modal)
      if (payload?.serverUrl && payload?.playerName) {
        try {
          const networkManager = await getNetworkManager();
          await networkManager.connect(payload.serverUrl, payload.playerName);
          console.log('✅ Connected to multiplayer');
        } catch (error) {
          console.error('Failed to connect:', error);
          alert('Failed to connect: ' + (error as Error).message);
        }
      } else {
        // Senão, abre modal
        const modal = getNetworkConnectModal();
        modal.open();
      }
    }
  );
  
  // NET_DISCONNECT
  commandRegistry.register(
    {
      id: CommandId.NET_DISCONNECT,
      label: 'Disconnect',
      category: 'network'
    },
    async () => {
      console.log('🌐 Disconnect');
      
      try {
        const networkManager = await getNetworkManager();
        networkManager.disconnect();
        
        console.log('✅ Disconnected from multiplayer');
      } catch (error) {
        console.error('Failed to disconnect:', error);
      }
    }
  );
  
  // NET_CREATE_ROOM
  commandRegistry.register(
    {
      id: CommandId.NET_CREATE_ROOM,
      label: 'Create Room',
      category: 'network'
    },
    async (payload?: CommandPayload) => {
      console.log('🚪 Create Room');
      
      const roomName = payload?.roomName || prompt('Room name:', 'ArxisVR Room');
      if (!roomName) return;
      
      eventBus.emit(EventType.NET_CREATE_ROOM_REQUESTED, { roomName });
    }
  );
  
  // NET_JOIN_ROOM
  commandRegistry.register(
    {
      id: CommandId.NET_JOIN_ROOM,
      label: 'Join Room',
      category: 'network'
    },
    async (payload?: CommandPayload) => {
      console.log('🚪 Join Room');
      
      const roomId = payload?.roomId || prompt('Room ID:');
      if (!roomId) return;
      
      eventBus.emit(EventType.NET_JOIN_ROOM_REQUESTED, { roomId });
    }
  );
  
  // NET_LEAVE_ROOM
  commandRegistry.register(
    {
      id: CommandId.NET_LEAVE_ROOM,
      label: 'Leave Room',
      category: 'network'
    },
    async () => {
      console.log('🚪 Leave Room');
      eventBus.emit(EventType.ROOM_LEFT, {});
    }
  );
}

// ==================== THEME HANDLERS ====================


function registerThemeHandlers(): void {
  // THEME_SELECT
  commandRegistry.register(
    {
      id: CommandId.THEME_SELECT,
      label: 'Select Theme',
      category: 'theme'
    },
    async () => {
      console.log('🎨 Opening theme selector...');
      const modal = getThemeSelectorModal();
      modal.show();
    }
  );
}

// ==================== HELP HANDLERS ====================

function registerHelpHandlers(): void {
  // HELP_DOCS
  commandRegistry.register(
    {
      id: CommandId.HELP_DOCS,
      label: 'Documentation',
      category: 'help',
      shortcut: 'F1'
    },
    async () => {
      console.log('📚 Opening documentation...');
      window.open('https://github.com/avilaops/arxisVR#readme', '_blank');
    }
  );

  // HELP_SHORTCUTS
  commandRegistry.register(
    {
      id: CommandId.HELP_SHORTCUTS,
      label: 'Keyboard Shortcuts',
      category: 'help'
    },
    async () => {
      console.log('⌨️ Showing shortcuts...');
      const modal = getShortcutsModal();
      modal.open();
    }
  );

  // HELP_ABOUT
  commandRegistry.register(
    {
      id: CommandId.HELP_ABOUT,
      label: 'About',
      category: 'help'
    },
    async () => {
      console.log('ℹ️ Showing about...');
      const modal = getAboutModal();
      modal.open();
    }
  );

  // AI_TOGGLE_CHAT
  commandRegistry.register(
    {
      id: CommandId.AI_TOGGLE_CHAT,
      label: 'Toggle AI Chat',
      category: 'ai',
      shortcut: 'Ctrl+K'
    },
    async () => {
      console.log('🤖 Toggle AI Chat');
      eventBus.emit(EventType.AI_CHAT_TOGGLE, {});
    }
  );
}
