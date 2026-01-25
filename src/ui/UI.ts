import { TopBar } from './layout/TopBar';
import { LeftPanel } from './layout/LeftPanel';
import { BottomDock } from './layout/BottomDock';
import { RightInspector } from './layout/RightInspector';
import { eventBus, EventType } from '../core';
import { getNotificationSystem } from './NotificationSystem';

/**
 * UI System - Orquestra todos os componentes de interface
 * 
 * Layout:
 * - TopBar: Menu superior (File, Edit, View, Help)
 * - LeftPanel: Project / Layers / Hierarchy
 * - RightInspector: Propriedades do objeto selecionado
 * - BottomDock: Ferramentas principais
 * - Viewport: Canvas 3D (gerenciado pelo SceneManager)
 */
export class UI {
  // Layout Components
  private topBar: TopBar | null = null;
  private leftPanel: LeftPanel | null = null;
  private rightInspector: RightInspector | null = null;
  private bottomDock: BottomDock | null = null;

  // Stats elements (legacy)
  private fpsElement: HTMLElement | null;
  private positionElement: HTMLElement | null;

  // Visibility state
  private uiVisible: boolean = true;

  constructor() {
    console.log('🎨 Initializing UI System...');
    
    // Stats elements (legacy - pode ser migrado depois)
    this.fpsElement = document.getElementById('fps-counter');
    this.positionElement = document.getElementById('position-info');

    this.initializeComponents();
    this.setupEventListeners();
    
    // FASE 5: Initialize NotificationSystem
    getNotificationSystem();
    
    console.log('✅ UI System initialized');
  }

  /**
   * Inicializa todos os componentes de UI
   */
  private initializeComponents(): void {
    try {
      // TopBar
      const topBarContainer = document.getElementById('top-bar');
      if (topBarContainer) {
        this.topBar = new TopBar('top-bar');
      }
      
      // LeftPanel
      const leftPanelContainer = document.getElementById('left-panel');
      if (leftPanelContainer) {
        this.leftPanel = new LeftPanel('left-panel');
      }
      
      // RightInspector
      const rightInspectorContainer = document.getElementById('right-inspector');
      if (rightInspectorContainer) {
        this.rightInspector = new RightInspector('right-inspector');
      }
      
      // BottomDock
      const bottomDockContainer = document.getElementById('bottom-dock');
      if (bottomDockContainer) {
        this.bottomDock = new BottomDock('bottom-dock');
      }
      
      console.log('✅ All UI components initialized');
    } catch (error) {
      console.warn('⚠️ Some UI components failed to initialize:', error);
    }
  }

  /**
   * Configura event listeners globais
   */
  private setupEventListeners(): void {
    // Atalhos de teclado
    document.addEventListener('keydown', (event) => {
      switch (event.code) {
        case 'KeyH':
          if (!event.ctrlKey && !event.altKey) {
            this.toggleUI();
          }
          break;
        case 'Escape':
          document.exitPointerLock();
          break;
        case 'F1':
          event.preventDefault();
          this.toggleLeftPanel();
          break;
        case 'F2':
          event.preventDefault();
          this.toggleRightInspector();
          break;
      }
    });
    
    // Event bus subscriptions
    eventBus.on(EventType.UI_TOGGLE, this.toggleUI.bind(this));
    eventBus.on(EventType.UI_LEFT_PANEL_TOGGLE, this.toggleLeftPanel.bind(this));
    eventBus.on(EventType.UI_RIGHT_PANEL_TOGGLE, this.toggleRightInspector.bind(this));
  }

  /**
   * Update UI components (FASE 5)
   * Deve ser chamado no render loop
   */
  public update(_delta?: number): void {
    // Atualiza FPS (legacy) se delta for fornecido
    if (_delta && this.fpsElement) {
      const fps = Math.round(1 / _delta);
      this.fpsElement.textContent = `${fps} FPS`;
    }

    // Atualiza posição (desabilitado por enquanto)
    if (this.positionElement) {
      this.positionElement.textContent = `Position tracking disabled`;
    }
    
    // Atualiza componentes
    if (this.topBar) {
      this.topBar.update();
    }
  }

  /**
   * Cleanup
   */
  public dispose(): void {
    if (this.topBar) {
      this.topBar.dispose();
    }
    
    if (this.leftPanel) {
      this.leftPanel.dispose();
    }
    
    if (this.rightInspector) {
      this.rightInspector.dispose();
    }
    
    if (this.bottomDock) {
      this.bottomDock.dispose();
    }
    
    console.log('🗑️ UI System disposed');
  }
}
