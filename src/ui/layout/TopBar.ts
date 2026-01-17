import { appController } from '../../app/AppController';
import { eventBus, EventType } from '../../core';
import { commandRegistry } from '../../commands';
import { CommandId } from '../../commands/Command';
import { menuManager } from '../../menu/MenuManager';
import { DEFAULT_MENUS } from '../../menu/DefaultMenus';

/**
 * TopBar - Barra de menu superior
 * File / Edit / View / Help / Settings / Theme
 */
export class TopBar {
private container: HTMLElement;

  constructor(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container ${containerId} not found`);
    }
    
    this.container = container;
    this.init();
  }

  /**
   * Inicializa a barra
   */
  private init(): void {
    this.container.className = 'top-bar';
    this.applyStyles();
    this.setupEventListeners();
    // Registra menus padrão no MenuManager (uma vez)
    DEFAULT_MENUS.forEach(m => menuManager.registerTopLevelMenu(m));
    this.render();
    
    console.log('✅ TopBar initialized');
  }

  /**
   * Aplica estilos CSS
   */
  private applyStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      .top-bar {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 50px;
        background: rgba(0, 0, 0, 0.95);
        backdrop-filter: blur(20px);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        padding: 0 20px;
        gap: 20px;
        z-index: 200;
        color: white;
      }
      
      .top-bar-logo {
        font-size: 18px;
        font-weight: bold;
        background: linear-gradient(135deg, var(--theme-primary, #667eea), var(--theme-accent, #00ff88));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-right: 20px;
        cursor: pointer;
        transition: all 0.3s;
      }
      
      .top-bar-logo:hover {
        transform: scale(1.05);
      }
      
      .top-bar-menus {
        display: flex;
        gap: 5px;
        flex: 1;
      }
      
      .top-bar-menu {
        position: relative;
      }
      
      .top-bar-menu-btn {
        background: transparent;
        border: none;
        color: white;
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      
      .top-bar-menu-btn:hover {
        background: rgba(255, 255, 255, 0.1);
      }
      
      .top-bar-menu-btn.active {
        background: var(--theme-primary, #667eea);
        color: white;
      }
      
      .top-bar-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        min-width: 200px;
        background: rgba(20, 20, 20, 0.98);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        margin-top: 5px;
        padding: 8px 0;
        display: none;
        z-index: 300;
      }
      
      .top-bar-dropdown.visible {
        display: block;
        animation: dropdownFadeIn 0.2s ease;
      }
      
      @keyframes dropdownFadeIn {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .top-bar-dropdown-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 16px;
        color: white;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
        border: none;
        background: transparent;
        width: 100%;
        text-align: left;
      }
      
      .top-bar-dropdown-item:hover {
        background: var(--theme-primary, #667eea);
      }
      
      .top-bar-dropdown-item.disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
      
      .top-bar-dropdown-item.disabled:hover {
        background: transparent;
      }
      
      .top-bar-dropdown-separator {
        height: 1px;
        background: rgba(255, 255, 255, 0.1);
        margin: 8px 0;
      }
      
      .top-bar-dropdown-shortcut {
        font-size: 12px;
        opacity: 0.6;
        margin-left: 20px;
      }
      
      .top-bar-right {
        display: flex;
        gap: 10px;
        align-items: center;
        margin-left: auto;
      }
      
      .top-bar-icon-btn {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        width: 36px;
        height: 36px;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        transition: all 0.3s;
      }
      
      .top-bar-icon-btn:hover:not(:disabled) {
        background: var(--theme-primary, #667eea);
        border-color: var(--theme-accent, #00ff88);
        transform: scale(1.1);
      }
      
      .top-bar-icon-btn:disabled {
        cursor: not-allowed;
        opacity: 0.4;
      }
      
      .top-bar-theme-indicator {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--theme-primary, #667eea), var(--theme-accent, #00ff88));
        box-shadow: 0 0 10px var(--theme-accent, #00ff88);
      }
    `;
    
    if (!document.getElementById('top-bar-styles')) {
      style.id = 'top-bar-styles';
      document.head.appendChild(style);
    }
  }

  /**
   * Configura event listeners
   */
  private setupEventListeners(): void {
    // Fecha dropdowns ao clicar fora
    document.addEventListener('click', (e) => {
      if (!this.container.contains(e.target as Node)) {
        this.closeAllDropdowns();
      }
    });
    
    // ESC fecha dropdowns
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllDropdowns();
      }
    });
  }

  /**
   * Renderiza o conteúdo
   */
  private render(): void {
    this.container.innerHTML = `
      <div class="top-bar-logo" data-action="home">ArxisVR</div>
      
      <div class="top-bar-menus">
        <div class="top-bar-menu" data-menu="file">
          <button class="top-bar-menu-btn" data-action="toggle-menu" data-menu="file">
            📁 File
          </button>
          <div class="top-bar-dropdown">
            ${this.renderFileMenu()}
          </div>
        </div>
        
        <div class="top-bar-menu" data-menu="edit">
          <button class="top-bar-menu-btn" data-action="toggle-menu" data-menu="edit">
            ✏️ Edit
          </button>
          <div class="top-bar-dropdown">
            ${this.renderEditMenu()}
          </div>
        </div>
        
        <div class="top-bar-menu" data-menu="view">
          <button class="top-bar-menu-btn" data-action="toggle-menu" data-menu="view">
            👁️ View
          </button>
          <div class="top-bar-dropdown">
            ${this.renderViewMenu()}
          </div>
        </div>
        
        <div class="top-bar-menu" data-menu="help">
          <button class="top-bar-menu-btn" data-action="toggle-menu" data-menu="help">
            ❓ Help
          </button>
          <div class="top-bar-dropdown">
            ${this.renderHelpMenu()}
          </div>
        </div>
      </div>
      
      <div class="top-bar-right">
        <div class="top-bar-theme-indicator" title="Current theme"></div>
        <button class="top-bar-icon-btn" id="network-btn" data-action="network" title="Connect Multiplayer">
          🌐
        </button>
        <button class="top-bar-icon-btn" id="xr-btn" data-action="xr" title="Enter VR">
          🥽
        </button>
        <button class="top-bar-icon-btn" data-action="theme" title="Change theme">
          🎨
        </button>
        <button class="top-bar-icon-btn" data-action="settings" title="Settings">
          ⚙️
        </button>
      </div>
    `;
    
    this.attachEventListeners();
  }

  /**
   * Renderiza menu File
   */
  private renderFileMenu(): string {
    return `
      <button class="top-bar-dropdown-item" data-command="${CommandId.FILE_NEW}">
        <span>🆕 New Project</span>
        <span class="top-bar-dropdown-shortcut">Ctrl+N</span>
      </button>
      <button class="top-bar-dropdown-item" data-command="${CommandId.FILE_OPEN}">
        <span>📂 Open...</span>
        <span class="top-bar-dropdown-shortcut">Ctrl+O</span>
      </button>
      <div class="top-bar-dropdown-separator"></div>
      <button class="top-bar-dropdown-item" data-command="${CommandId.FILE_OPEN_IFC}">
        <span>📦 Import IFC</span>
      </button>
      <button class="top-bar-dropdown-item" data-command="${CommandId.FILE_OPEN_GLTF}">
        <span>🎭 Import glTF</span>
      </button>
      <button class="top-bar-dropdown-item" data-command="${CommandId.FILE_OPEN_OBJ}">
        <span>🗿 Import OBJ</span>
      </button>
      <div class="top-bar-dropdown-separator"></div>
      <button class="top-bar-dropdown-item" data-command="${CommandId.FILE_SAVE}">
        <span>💾 Save</span>
        <span class="top-bar-dropdown-shortcut">Ctrl+S</span>
      </button>
      <button class="top-bar-dropdown-item" data-command="${CommandId.FILE_SAVE_AS}">
        <span>💾 Save As...</span>
        <span class="top-bar-dropdown-shortcut">Ctrl+Shift+S</span>
      </button>
      <div class="top-bar-dropdown-separator"></div>
      <button class="top-bar-dropdown-item" data-command="${CommandId.FILE_EXPORT_SCREENSHOT}">
        <span>📸 Export Screenshot</span>
      </button>
      <button class="top-bar-dropdown-item" data-command="${CommandId.FILE_CLOSE}">
        <span>❌ Close</span>
      </button>
    `;
  }

  /**
   * Renderiza menu Edit
   */
  private renderEditMenu(): string {
    return `
      <button class="top-bar-dropdown-item" data-command="${CommandId.EDIT_UNDO}">
        <span>↶ Undo</span>
        <span class="top-bar-dropdown-shortcut">Ctrl+Z</span>
      </button>
      <button class="top-bar-dropdown-item" data-command="${CommandId.EDIT_REDO}">
        <span>↷ Redo</span>
        <span class="top-bar-dropdown-shortcut">Ctrl+Y</span>
      </button>
      <div class="top-bar-dropdown-separator"></div>
      <button class="top-bar-dropdown-item" data-command="${CommandId.EDIT_CUT}">
        <span>✂️ Cut</span>
        <span class="top-bar-dropdown-shortcut">Ctrl+X</span>
      </button>
      <button class="top-bar-dropdown-item" data-command="${CommandId.EDIT_COPY}">
        <span>📋 Copy</span>
        <span class="top-bar-dropdown-shortcut">Ctrl+C</span>
      </button>
      <button class="top-bar-dropdown-item" data-command="${CommandId.EDIT_PASTE}">
        <span>📌 Paste</span>
        <span class="top-bar-dropdown-shortcut">Ctrl+V</span>
      </button>
      <button class="top-bar-dropdown-item" data-command="${CommandId.EDIT_DELETE}">
        <span>🗑️ Delete</span>
        <span class="top-bar-dropdown-shortcut">Del</span>
      </button>
      <div class="top-bar-dropdown-separator"></div>
      <button class="top-bar-dropdown-item" data-command="${CommandId.EDIT_SELECT_ALL}">
        <span>✅ Select All</span>
        <span class="top-bar-dropdown-shortcut">Ctrl+A</span>
      </button>
      <button class="top-bar-dropdown-item" data-command="${CommandId.EDIT_DESELECT_ALL}">
        <span>⬜ Deselect All</span>
        <span class="top-bar-dropdown-shortcut">Ctrl+D</span>
      </button>
    `;
  }

  /**
   * Renderiza menu View
   */
  private renderViewMenu(): string {
    return `
      <button class="top-bar-dropdown-item" data-command="${CommandId.VIEW_TOP}">
        <span>⬆️ Top View</span>
        <span class="top-bar-dropdown-shortcut">7</span>
      </button>
      <button class="top-bar-dropdown-item" data-command="${CommandId.VIEW_FRONT}">
        <span>➡️ Front View</span>
        <span class="top-bar-dropdown-shortcut">1</span>
      </button>
      <button class="top-bar-dropdown-item" data-command="${CommandId.VIEW_SIDE}">
        <span>⬅️ Side View</span>
        <span class="top-bar-dropdown-shortcut">3</span>
      </button>
      <button class="top-bar-dropdown-item" data-command="${CommandId.VIEW_ISOMETRIC}">
        <span>📐 Isometric</span>
        <span class="top-bar-dropdown-shortcut">5</span>
      </button>
      <div class="top-bar-dropdown-separator"></div>
      <button class="top-bar-dropdown-item" data-command="${CommandId.VIEW_FOCUS_SELECTION}">
        <span>🎯 Focus Selection</span>
        <span class="top-bar-dropdown-shortcut">F</span>
      </button>
      <button class="top-bar-dropdown-item" data-command="${CommandId.VIEW_FRAME_ALL}">
        <span>🖼️ Frame All</span>
        <span class="top-bar-dropdown-shortcut">Home</span>
      </button>
      <div class="top-bar-dropdown-separator"></div>
      <button class="top-bar-dropdown-item" data-command="${CommandId.VIEW_TOGGLE_GRID}">
        <span># Toggle Grid</span>
        <span class="top-bar-dropdown-shortcut">G</span>
      </button>
      <button class="top-bar-dropdown-item" data-command="${CommandId.VIEW_TOGGLE_AXES}">
        <span>📍 Toggle Axes</span>
      </button>
      <button class="top-bar-dropdown-item" data-command="${CommandId.VIEW_FULLSCREEN}">
        <span>⛶ Fullscreen</span>
        <span class="top-bar-dropdown-shortcut">F11</span>
      </button>
    `;
  }

  /**
   * Renderiza menu Help
   */
  private renderHelpMenu(): string {
    return `
      <button class="top-bar-dropdown-item" data-command="${CommandId.HELP_DOCS}">
        <span>📖 Documentation</span>
      </button>
      <button class="top-bar-dropdown-item" data-command="${CommandId.HELP_SHORTCUTS}">
        <span>⌨️ Keyboard Shortcuts</span>
      </button>
      <div class="top-bar-dropdown-separator"></div>
      <button class="top-bar-dropdown-item" data-command="${CommandId.HELP_ABOUT}">
        <span>ℹ️ About ArxisVR</span>
      </button>
    `;
  }

  /**
   * Anexa event listeners aos elementos
   */
  private attachEventListeners(): void {
    // Toggle menus
    this.container.querySelectorAll('[data-action="toggle-menu"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const menuId = (btn as HTMLElement).dataset.menu;
        this.toggleMenu(menuId!);
      });
    });
    
    // Comandos
    this.container.querySelectorAll('[data-command]').forEach(btn => {
      btn.addEventListener('click', () => {
        const commandId = (btn as HTMLElement).dataset.command as CommandId;
        this.executeCommand(commandId);
        this.closeAllDropdowns();
      });
    });
    
    // Ações especiais
    this.container.querySelector('[data-action="home"]')?.addEventListener('click', () => {
      this.executeCommand(CommandId.VIEW_FRAME_ALL);
    });
    
    this.container.querySelector('[data-action="theme"]')?.addEventListener('click', () => {
      this.executeCommand(CommandId.THEME_SELECT);
    });
    
    this.container.querySelector('[data-action="settings"]')?.addEventListener('click', () => {
      eventBus.emit(EventType.UI_SETTINGS_OPEN, {});
    });
    
    // FASE 5: Network button
    this.container.querySelector('[data-action="network"]')?.addEventListener('click', () => {
      const state = appController.getState();
      if (state.networkState.status === 'disconnected' || state.networkState.status === 'error') {
        this.executeCommand(CommandId.NET_CONNECT);
      } else if (state.networkState.status === 'connected') {
        // TODO: Show room join/create modal
        this.executeCommand(CommandId.NET_CREATE_ROOM);
      } else if (state.networkState.status === 'inRoom') {
        this.executeCommand(CommandId.NET_DISCONNECT);
      }
    });
    
    // FASE 5: XR button
    this.container.querySelector('[data-action="xr"]')?.addEventListener('click', () => {
      const state = appController.getState();
      if (!state.xrState.supported) {
        alert('WebXR not supported on this device/browser');
        return;
      }
      
      if (state.xrState.active) {
        this.executeCommand(CommandId.XR_EXIT);
      } else {
        this.executeCommand(CommandId.XR_ENTER);
      }
    });
    
    // Listen to state changes to update button states
    eventBus.on(EventType.XR_SESSION_STARTED, () => this.updateButtonStates());
    eventBus.on(EventType.XR_SESSION_ENDED, () => this.updateButtonStates());
    // TODO: Add proper network events when defined
    // eventBus.on(EventType.NET_CONNECTED, () => this.updateButtonStates());
    // eventBus.on(EventType.NET_DISCONNECTED, () => this.updateButtonStates());
  }

  /**
   * Toggle menu dropdown
   */
  private toggleMenu(menuId: string): void {
    const menu = this.container.querySelector(`[data-menu="${menuId}"]`);
    if (!menu) return;
    
    const dropdown = menu.querySelector('.top-bar-dropdown') as HTMLElement;
    const btn = menu.querySelector('.top-bar-menu-btn') as HTMLElement;
    
    if (dropdown.classList.contains('visible')) {
      this.closeAllDropdowns();
      menuManager.closeMenu();
    } else {
      this.closeAllDropdowns();
      menuManager.openMenu(menuId);
      dropdown.classList.add('visible');
      btn.classList.add('active');
    }
  }

  /**
   * Fecha todos os dropdowns
   */
  private closeAllDropdowns(): void {
    this.container.querySelectorAll('.top-bar-dropdown').forEach(dropdown => {
      dropdown.classList.remove('visible');
    });
    
    this.container.querySelectorAll('.top-bar-menu-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    // Sincroniza estado com MenuManager
    menuManager.closeMenu();
  }

  /**
   * Executa comando
   */
  private executeCommand(commandId: CommandId): void {
    try {
      commandRegistry.execute(commandId);
      // Fecha menu ativo após executar comando
      menuManager.closeMenu();
    } catch (error) {
      console.error(`Failed to execute command ${commandId}:`, error);
    }
  }

  /**
   * Atualiza estado visual
   */
  public update(): void {
    this.updateButtonStates();
  }
  
  /**
   * Atualiza estados dos botões XR e Network baseado no AppState
   */
  private updateButtonStates(): void {
    const state = appController.getState();
    
    // XR Button
    const xrBtn = this.container.querySelector('#xr-btn') as HTMLButtonElement;
    if (xrBtn) {
      if (!state.xrState.supported) {
        xrBtn.disabled = true;
        xrBtn.style.opacity = '0.4';
        xrBtn.title = 'WebXR not supported';
      } else if (state.xrState.active) {
        xrBtn.textContent = '🚪'; // Exit icon
        xrBtn.title = 'Exit VR';
        xrBtn.style.backgroundColor = 'rgba(255, 68, 68, 0.3)'; // Red tint
      } else {
        xrBtn.textContent = '🥽';
        xrBtn.title = 'Enter VR';
        xrBtn.style.backgroundColor = 'rgba(68, 68, 255, 0.3)'; // Blue tint
        xrBtn.disabled = false;
        xrBtn.style.opacity = '1';
      }
    }
    
    // Network Button
    const netBtn = this.container.querySelector('#network-btn') as HTMLButtonElement;
    if (netBtn) {
      const netState = state.networkState;
      
      switch (netState.status) {
        case 'disconnected':
        case 'error':
          netBtn.textContent = '🌐';
          netBtn.title = 'Connect Multiplayer';
          netBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
          break;
          
        case 'connecting':
          netBtn.textContent = '⏳';
          netBtn.title = 'Connecting...';
          netBtn.style.backgroundColor = 'rgba(255, 165, 0, 0.3)'; // Orange
          netBtn.disabled = true;
          break;
          
        case 'connected':
          netBtn.textContent = '🏠';
          netBtn.title = 'Create/Join Room';
          netBtn.style.backgroundColor = 'rgba(68, 255, 68, 0.3)'; // Green
          netBtn.disabled = false;
          break;
          
        case 'inRoom':
          netBtn.textContent = '🚪';
          netBtn.title = `Leave Room (${netState.peersCount} peers)`;
          netBtn.style.backgroundColor = 'rgba(255, 68, 68, 0.3)'; // Red
          netBtn.disabled = false;
          break;
      }
    }
  }

  /**
   * Mostra/esconde a barra
   */
  public setVisible(visible: boolean): void {
    this.container.style.display = visible ? 'flex' : 'none';
  }
  
  /**
   * Atualiza estado dos botões (FASE 5)
   */
  public update(): void {
    this.updateButtonStates();
  }

  /**
   * Cleanup
   */
  public dispose(): void {
    this.closeAllDropdowns();
  }
}
