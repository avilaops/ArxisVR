/**
 * HotReloadEvents - Eventos tipados do Hot-Reload System
 * Integração com EventBus corporativo
 */

export enum HotReloadEventType {
  // File Watch Events
  FILE_CHANGED = 'FILE_CHANGED',
  FILE_ADDED = 'FILE_ADDED',
  FILE_REMOVED = 'FILE_REMOVED',
  
  // Reload Events
  RELOAD_STARTED = 'RELOAD_STARTED',
  RELOAD_SUCCESS = 'RELOAD_SUCCESS',
  RELOAD_FAILED = 'RELOAD_FAILED',
  RELOAD_CANCELLED = 'RELOAD_CANCELLED',
  
  // Asset Reload Events
  ASSET_RELOAD_STARTED = 'ASSET_RELOAD_STARTED',
  ASSET_RELOAD_SUCCESS = 'ASSET_RELOAD_SUCCESS',
  ASSET_RELOAD_FAILED = 'ASSET_RELOAD_FAILED',
  
  // Shader Reload Events
  SHADER_RELOAD_STARTED = 'SHADER_RELOAD_STARTED',
  SHADER_RELOAD_SUCCESS = 'SHADER_RELOAD_SUCCESS',
  SHADER_RELOAD_FAILED = 'SHADER_RELOAD_FAILED',
  
  // Script Reload Events
  SCRIPT_RELOAD_STARTED = 'SCRIPT_RELOAD_STARTED',
  SCRIPT_RELOAD_SUCCESS = 'SCRIPT_RELOAD_SUCCESS',
  SCRIPT_RELOAD_FAILED = 'SCRIPT_RELOAD_FAILED',
  
  // UI Reload Events
  UI_RELOAD_STARTED = 'UI_RELOAD_STARTED',
  UI_RELOAD_SUCCESS = 'UI_RELOAD_SUCCESS',
  UI_RELOAD_FAILED = 'UI_RELOAD_FAILED',
  
  // System Events
  HOT_RELOAD_ENABLED = 'HOT_RELOAD_ENABLED',
  HOT_RELOAD_DISABLED = 'HOT_RELOAD_DISABLED',
  WATCH_STARTED = 'WATCH_STARTED',
  WATCH_STOPPED = 'WATCH_STOPPED'
}

export interface HotReloadEventData {
  [HotReloadEventType.FILE_CHANGED]: { path: string; type: string };
  [HotReloadEventType.FILE_ADDED]: { path: string; type: string };
  [HotReloadEventType.FILE_REMOVED]: { path: string; type: string };
  
  [HotReloadEventType.RELOAD_STARTED]: { target: string; type: string };
  [HotReloadEventType.RELOAD_SUCCESS]: { target: string; type: string; duration: number };
  [HotReloadEventType.RELOAD_FAILED]: { target: string; type: string; error: Error };
  [HotReloadEventType.RELOAD_CANCELLED]: { target: string; type: string; reason: string };
  
  [HotReloadEventType.ASSET_RELOAD_STARTED]: { assetId: string; path: string };
  [HotReloadEventType.ASSET_RELOAD_SUCCESS]: { assetId: string; path: string; duration: number };
  [HotReloadEventType.ASSET_RELOAD_FAILED]: { assetId: string; path: string; error: Error };
  
  [HotReloadEventType.SHADER_RELOAD_STARTED]: { shaderId: string; path: string };
  [HotReloadEventType.SHADER_RELOAD_SUCCESS]: { shaderId: string; path: string; duration: number };
  [HotReloadEventType.SHADER_RELOAD_FAILED]: { shaderId: string; path: string; error: Error };
  
  [HotReloadEventType.SCRIPT_RELOAD_STARTED]: { scriptId: string; path: string };
  [HotReloadEventType.SCRIPT_RELOAD_SUCCESS]: { scriptId: string; path: string; duration: number };
  [HotReloadEventType.SCRIPT_RELOAD_FAILED]: { scriptId: string; path: string; error: Error };
  
  [HotReloadEventType.UI_RELOAD_STARTED]: { panelId: string; path: string };
  [HotReloadEventType.UI_RELOAD_SUCCESS]: { panelId: string; path: string; duration: number };
  [HotReloadEventType.UI_RELOAD_FAILED]: { panelId: string; path: string; error: Error };
  
  [HotReloadEventType.HOT_RELOAD_ENABLED]: { timestamp: number };
  [HotReloadEventType.HOT_RELOAD_DISABLED]: { timestamp: number };
  [HotReloadEventType.WATCH_STARTED]: { paths: string[] };
  [HotReloadEventType.WATCH_STOPPED]: { timestamp: number };
}

/**
 * Tipos de arquivos suportados
 */
export enum FileType {
  ASSET = 'asset',
  SHADER = 'shader',
  SCRIPT = 'script',
  UI = 'ui',
  THEME = 'theme',
  CONFIG = 'config',
  UNKNOWN = 'unknown'
}

/**
 * Determina tipo de arquivo pela extensão
 */
export function getFileType(path: string): FileType {
  const ext = path.split('.').pop()?.toLowerCase();
  
  switch (ext) {
    case 'gltf':
    case 'glb':
    case 'fbx':
    case 'obj':
    case 'ifc':
      return FileType.ASSET;
    
    case 'glsl':
    case 'vert':
    case 'frag':
    case 'shader':
      return FileType.SHADER;
    
    case 'ts':
    case 'js':
    case 'tsx':
    case 'jsx':
      return FileType.SCRIPT;
    
    case 'html':
    case 'css':
      return FileType.UI;
    
    case 'json':
      if (path.includes('theme')) {
        return FileType.THEME;
      }
      return FileType.CONFIG;
    
    default:
      return FileType.UNKNOWN;
  }
}
