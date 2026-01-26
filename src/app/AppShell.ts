/**
 * AppShell - Layout principal (tipo Blazor MainLayout)
 * ActivityBar + Sidebar + Editor + StatusBar
 */

import { uiStore } from './state/uiStore';
import { eventBus } from './state/eventBus';
import { ActivityBar } from '../ui/components/ActivityBar';
import { Sidebar } from '../ui/components/Sidebar';
import { StatusBar } from '../ui/components/StatusBar';
import { ModalHost } from '../ui/components/ModalHost';
import { ViewerHost } from '../viewer/ViewerHost';
import type { UIState } from './state/uiStore';

/**
 * AppShell = Composition root da UI
 */
export class AppShell {
  private container: HTMLElement;
  private activityBar!: ActivityBar;
  private sidebar!: Sidebar;
  private viewerHost!: ViewerHost;
  private statusBar!: StatusBar;
  private modalHost!: ModalHost;

  private unsubscribe?: () => void;

  constructor(container: HTMLElement) {
    this.container = container;
    this.render();
    this.subscribeToState();
    this.setupEventListeners();
  }

  /**
   * Renderiza estrutura do AppShell
   */
  private render(): void {
    // Limpa container
    this.container.innerHTML = '';
    this.container.className = 'app-shell';

    // Grid layout: ActivityBar | Sidebar | Editor
    const grid = document.createElement('div');
    grid.className = 'app-shell__grid';

    // 1. ActivityBar (esquerda fixa)
    const activityBarEl = document.createElement('div');
    activityBarEl.className = 'app-shell__activity-bar';
    this.activityBar = new ActivityBar(activityBarEl);

    // 2. Sidebar (colapsável)
    const sidebarEl = document.createElement('div');
    sidebarEl.className = 'app-shell__sidebar';
    this.sidebar = new Sidebar(sidebarEl);

    // 3. Editor Area (canvas Three.js)
    const editorEl = document.createElement('div');
    editorEl.className = 'app-shell__editor';
    this.viewerHost = new ViewerHost(editorEl);

    // 4. StatusBar (footer fixo)
    const statusBarEl = document.createElement('div');
    statusBarEl.className = 'app-shell__statusbar';
    this.statusBar = new StatusBar(statusBarEl);

    // 5. ModalHost (overlay)
    const modalHostEl = document.createElement('div');
    modalHostEl.className = 'app-shell__modal-host';
    this.modalHost = new ModalHost(modalHostEl);

    // Mount
    grid.appendChild(activityBarEl);
    grid.appendChild(sidebarEl);
    grid.appendChild(editorEl);

    this.container.appendChild(grid);
    this.container.appendChild(statusBarEl);
    this.container.appendChild(modalHostEl);

    // Apply initial state
    this.updateLayout(uiStore.getState());
  }

  /**
   * Subscribe to UIStore changes
   */
  private subscribeToState(): void {
    this.unsubscribe = uiStore.subscribe((state) => {
      this.updateLayout(state);
    });
  }

  /**
   * Update layout based on state
   */
  private updateLayout(state: UIState): void {
    const grid = this.container.querySelector('.app-shell__grid') as HTMLElement;
    if (!grid) return;

    // Toggle sidebar collapsed
    if (state.sidebarCollapsed) {
      grid.classList.add('sidebar-collapsed');
    } else {
      grid.classList.remove('sidebar-collapsed');
    }

    // Update data-active-view for theming
    grid.setAttribute('data-active-view', state.activeView);
  }

  /**
   * Setup global event listeners
   */
  private setupEventListeners(): void {
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + B: Toggle sidebar
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        uiStore.toggleSidebar();
      }

      // Ctrl/Cmd + P: Command palette (future)
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        // uiStore.openModal('commandPalette');
      }

      // Escape: Close modal
      if (e.key === 'Escape') {
        const state = uiStore.getState();
        if (state.modal.key) {
          uiStore.closeModal();
        }
      }
    });

    // Listen to app events for StatusBar updates
    eventBus.on('ModelLoaded', (event) => {
      uiStore.updateStatusBar({
        fileName: event.payload.fileName,
        triangles: event.payload.triangles,
        memory: event.payload.memory
      });
    });

    eventBus.on('ErrorRaised', (event) => {
      console.error('[AppShell] Error:', event.payload.message, event.payload.error);
      // TODO: Show toast notification
    });
  }

  /**
   * Get ViewerHost (para acessar scene/camera/renderer)
   */
  public getViewerHost(): ViewerHost {
    return this.viewerHost;
  }

  /**
   * Destroy
   */
  public destroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }

    this.activityBar?.destroy();
    this.sidebar?.destroy();
    this.viewerHost?.destroy();
    this.statusBar?.destroy();
    this.modalHost?.destroy();
  }
}
