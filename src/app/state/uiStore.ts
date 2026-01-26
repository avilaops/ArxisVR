/**
 * UIStore - Estado global da UI (tipo Blazor StateContainer)
 * Single source of truth para layout, modal, sidebar, etc.
 */

export type ViewType = 'explorer' | 'search' | 'layers' | 'properties' | 'tools' | 'settings';

export interface ModalState {
  key: 'loadFile' | 'export' | 'settings' | 'about' | 'share' | null;
  props?: any;
}

export interface StatusBarState {
  fileName?: string;
  elements?: number;
  triangles?: number;
  memory?: number;
  fps?: number;
  errors?: number;
}

export interface UIState {
  activeView: ViewType;
  sidebarCollapsed: boolean;
  modal: ModalState;
  statusBar: StatusBarState;
  editorTabs: string[];
  activeTab: string | null;
}

type Listener = (state: UIState) => void;

/**
 * Store simples com pub/sub (tipo Redux micro)
 */
export class UIStore {
  private state: UIState = {
    activeView: 'explorer',
    sidebarCollapsed: false,
    modal: { key: null },
    statusBar: {},
    editorTabs: [],
    activeTab: null
  };

  private listeners: Set<Listener> = new Set();

  /**
   * Subscribe to state changes
   */
  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Get current state (immutable)
   */
  public getState(): Readonly<UIState> {
    return { ...this.state };
  }

  /**
   * Update state (immer-like)
   */
  private setState(updater: (draft: UIState) => void): void {
    const draft = { ...this.state };
    updater(draft);
    this.state = draft;
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state));
  }

  // Actions (tipo Blazor methods)

  public setActiveView(view: ViewType): void {
    this.setState(draft => {
      draft.activeView = view;
      draft.sidebarCollapsed = false; // Auto-open sidebar
    });
  }

  public toggleSidebar(): void {
    this.setState(draft => {
      draft.sidebarCollapsed = !draft.sidebarCollapsed;
    });
  }

  public openModal(key: ModalState['key'], props?: any): void {
    this.setState(draft => {
      draft.modal = { key, props };
    });
  }

  public closeModal(): void {
    this.setState(draft => {
      draft.modal = { key: null };
    });
  }

  public updateStatusBar(update: Partial<StatusBarState>): void {
    this.setState(draft => {
      draft.statusBar = { ...draft.statusBar, ...update };
    });
  }

  public addEditorTab(id: string): void {
    this.setState(draft => {
      if (!draft.editorTabs.includes(id)) {
        draft.editorTabs.push(id);
      }
      draft.activeTab = id;
    });
  }

  public removeEditorTab(id: string): void {
    this.setState(draft => {
      draft.editorTabs = draft.editorTabs.filter(t => t !== id);
      if (draft.activeTab === id) {
        draft.activeTab = draft.editorTabs[0] || null;
      }
    });
  }

  public setActiveTab(id: string): void {
    this.setState(draft => {
      draft.activeTab = id;
    });
  }
}

// Singleton instance (tipo Blazor DI)
export const uiStore = new UIStore();
