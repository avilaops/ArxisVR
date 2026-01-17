import { appController } from '../../app/AppController';
import { eventBus, EventType } from '../../core';
import { LayerPanel } from './LayerPanel';

/**
 * LeftPanel - Painel esquerdo
 * Contém: Project tree, Layers, Scene hierarchy
 */
export class LeftPanel {
  private container: HTMLElement;
  private layerPanel: LayerPanel | null = null;
  private currentTab: 'project' | 'layers' | 'hierarchy' = 'layers';
  private isVisible: boolean = true;

  constructor(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container ${containerId} not found`);
    }
    
    this.container = container;
    this.init();
  }

  /**
   * Inicializa o painel
   */
  private init(): void {
    this.container.className = 'left-panel';
    this.applyStyles();
    this.setupEventListeners();
    this.render();
    
    console.log('✅ LeftPanel initialized');
  }

  /**
   * Aplica estilos CSS
   */
  private applyStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      .left-panel {
        position: absolute;
        left: 0;
        top: 50px;
        width: 320px;
        height: calc(100vh - 50px);
        background: rgba(20, 20, 20, 0.95);
        backdrop-filter: blur(20px);
        box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
        display: flex;
        flex-direction: column;
        z-index: 100;
        transition: transform 0.3s ease;
      }
      
      .left-panel.hidden {
        transform: translateX(-100%);
      }
      
      .left-panel-header {
        padding: 16px;
        background: var(--theme-primary, #667eea);
        color: white;
        font-weight: bold;
        font-size: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2px solid var(--theme-accent, #00ff88);
      }
      
      .left-panel-close {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        width: 28px;
        height: 28px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
        transition: all 0.2s;
      }
      
      .left-panel-close:hover {
        background: rgba(255, 0, 0, 0.6);
      }
      
      .left-panel-tabs {
        display: flex;
        background: var(--theme-backgroundSecondary, #1e1e1e);
        border-bottom: 1px solid var(--theme-border, #333);
      }
      
      .left-panel-tab {
        flex: 1;
        padding: 12px;
        background: transparent;
        border: none;
        color: var(--theme-foregroundMuted, #999);
        font-size: 13px;
        cursor: pointer;
        transition: all 0.2s;
        border-bottom: 3px solid transparent;
      }
      
      .left-panel-tab:hover {
        background: rgba(255, 255, 255, 0.05);
        color: var(--theme-foreground, #fff);
      }
      
      .left-panel-tab.active {
        color: var(--theme-accent, #00ff88);
        border-bottom-color: var(--theme-accent, #00ff88);
        background: rgba(0, 255, 136, 0.1);
      }
      
      .left-panel-content {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
      }
      
      .left-panel-tab-content {
        display: none;
        height: 100%;
      }
      
      .left-panel-tab-content.active {
        display: block;
      }
      
      /* Project Tab */
      .project-tree {
        padding: 16px;
      }
      
      .project-tree-item {
        padding: 8px 12px;
        cursor: pointer;
        border-radius: 4px;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--theme-foreground, #fff);
      }
      
      .project-tree-item:hover {
        background: var(--theme-hover, #2a2a2a);
      }
      
      .project-tree-item.selected {
        background: var(--theme-primary, #667eea);
      }
      
      .project-tree-icon {
        font-size: 16px;
      }
      
      .project-empty {
        padding: 40px 20px;
        text-align: center;
        color: var(--theme-foregroundMuted, #999);
        font-size: 14px;
      }
      
      /* Hierarchy Tab */
      .hierarchy-tree {
        padding: 16px;
      }
      
      .hierarchy-item {
        padding: 8px 12px;
        cursor: pointer;
        border-radius: 4px;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--theme-foreground, #fff);
      }
      
      .hierarchy-item:hover {
        background: var(--theme-hover, #2a2a2a);
      }
      
      .hierarchy-item.selected {
        background: var(--theme-primary, #667eea);
      }
      
      .hierarchy-expand {
        width: 16px;
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: var(--theme-foregroundMuted, #999);
      }
      
      .hierarchy-icon {
        font-size: 14px;
      }
      
      /* Toggle Button (float) */
      .left-panel-toggle {
        position: absolute;
        left: 320px;
        top: 70px;
        width: 24px;
        height: 48px;
        background: var(--theme-primary, #667eea);
        border: none;
        border-radius: 0 8px 8px 0;
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        transition: all 0.3s;
        z-index: 101;
      }
      
      .left-panel-toggle:hover {
        background: var(--theme-accent, #00ff88);
        color: black;
        width: 28px;
      }
      
      .left-panel.hidden + .left-panel-toggle {
        left: 0;
      }
    `;
    
    if (!document.getElementById('left-panel-styles')) {
      style.id = 'left-panel-styles';
      document.head.appendChild(style);
    }
  }

  /**
   * Configura event listeners
   */
  private setupEventListeners(): void {
    eventBus.on(EventType.LAYER_CREATED, this.handleLayerChange.bind(this));
    eventBus.on(EventType.LAYER_UPDATED, this.handleLayerChange.bind(this));
    eventBus.on(EventType.LAYER_DELETED, this.handleLayerChange.bind(this));
    
    eventBus.on(EventType.SCENE_LOADED, this.handleSceneChange.bind(this));
    eventBus.on(EventType.OBJECT_ADDED, this.handleSceneChange.bind(this));
    eventBus.on(EventType.OBJECT_REMOVED, this.handleSceneChange.bind(this));
  }

  /**
   * Renderiza o conteúdo
   */
  private render(): void {
    this.container.innerHTML = `
      <div class="left-panel-header">
        <span>📁 Project</span>
        <button class="left-panel-close" data-action="close">×</button>
      </div>
      
      <div class="left-panel-tabs">
        <button class="left-panel-tab ${this.currentTab === 'project' ? 'active' : ''}" data-tab="project">
          📂 Files
        </button>
        <button class="left-panel-tab ${this.currentTab === 'layers' ? 'active' : ''}" data-tab="layers">
          🗂️ Layers
        </button>
        <button class="left-panel-tab ${this.currentTab === 'hierarchy' ? 'active' : ''}" data-tab="hierarchy">
          🌳 Scene
        </button>
      </div>
      
      <div class="left-panel-content">
        <div class="left-panel-tab-content ${this.currentTab === 'project' ? 'active' : ''}" data-content="project">
          ${this.renderProjectTab()}
        </div>
        
        <div class="left-panel-tab-content ${this.currentTab === 'layers' ? 'active' : ''}" data-content="layers" id="layers-container">
          <!-- LayerPanel será inserido aqui -->
        </div>
        
        <div class="left-panel-tab-content ${this.currentTab === 'hierarchy' ? 'active' : ''}" data-content="hierarchy">
          ${this.renderHierarchyTab()}
        </div>
      </div>
    `;
    
    // Criar toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'left-panel-toggle';
    toggleBtn.innerHTML = '◀';
    toggleBtn.dataset.action = 'toggle';
    this.container.parentElement?.appendChild(toggleBtn);
    
    this.attachEventListeners();
    this.initializeLayerPanel();
  }

  /**
   * Renderiza aba de projeto
   */
  private renderProjectTab(): string {
    const state = appController.getState();
    
    if (!state.currentProject) {
      return `
        <div class="project-empty">
          <p>No project loaded</p>
          <p style="font-size: 12px; margin-top: 8px;">
            Open a file to start
          </p>
        </div>
      `;
    }
    
    return `
      <div class="project-tree">
        <div class="project-tree-item selected">
          <span class="project-tree-icon">📦</span>
          <span>${state.currentProject.name || 'Untitled Project'}</span>
        </div>
        ${state.loadedModels.map(model => `
          <div class="project-tree-item" data-model="${model.id}">
            <span class="project-tree-icon">🏗️</span>
            <span>${model.name || model.id}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  /**
   * Renderiza aba de hierarquia
   */
  private renderHierarchyTab(): string {
    const state = appController.getState();
    
    if (state.loadedModels.length === 0) {
      return `
        <div class="project-empty">
          <p>No objects in scene</p>
          <p style="font-size: 12px; margin-top: 8px;">
            Load a model to see hierarchy
          </p>
        </div>
      `;
    }
    
    return `
      <div class="hierarchy-tree">
        ${this.renderHierarchyItems()}
      </div>
    `;
  }

  /**
   * Renderiza items da hierarquia
   */
  private renderHierarchyItems(): string {
    const state = appController.getState();
    
    return state.loadedModels.map(model => `
      <div class="hierarchy-item" data-object="${model.id}">
        <span class="hierarchy-expand">▼</span>
        <span class="hierarchy-icon">📦</span>
        <span>${model.name || model.id}</span>
      </div>
    `).join('');
  }

  /**
   * Anexa event listeners aos elementos
   */
  private attachEventListeners(): void {
    // Fechar painel
    this.container.querySelector('[data-action="close"]')?.addEventListener('click', () => {
      this.setVisible(false);
    });
    
    // Toggle painel
    document.querySelector('.left-panel-toggle')?.addEventListener('click', () => {
      this.toggleVisibility();
    });
    
    // Tabs
    this.container.querySelectorAll('.left-panel-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const tabName = (tab as HTMLElement).dataset.tab as typeof this.currentTab;
        this.switchTab(tabName);
      });
    });
    
    // Project items
    this.container.querySelectorAll('[data-model]').forEach(item => {
      item.addEventListener('click', () => {
        const modelId = (item as HTMLElement).dataset.model;
        eventBus.emit(EventType.MODEL_SELECTED, { modelId });
      });
    });
    
    // Hierarchy items
    this.container.querySelectorAll('[data-object]').forEach(item => {
      item.addEventListener('click', () => {
        const objectId = (item as HTMLElement).dataset.object;
        eventBus.emit(EventType.OBJECT_SELECTED, { objectId });
      });
    });
  }

  /**
   * Inicializa o LayerPanel dentro da tab
   */
  private initializeLayerPanel(): void {
    const layersContainer = this.container.querySelector('#layers-container');
    if (layersContainer && appController.layerManager) {
      // Criar um div interno para o LayerPanel
      const layerDiv = document.createElement('div');
      layerDiv.id = 'layer-panel-content';
      layerDiv.style.height = '100%';
      layersContainer.appendChild(layerDiv);
      
      this.layerPanel = new LayerPanel('layer-panel-content', appController.layerManager);
    }
  }

  /**
   * Troca de tab
   */
  private switchTab(tabName: typeof this.currentTab): void {
    this.currentTab = tabName;
    
    // Atualiza tabs
    this.container.querySelectorAll('.left-panel-tab').forEach(tab => {
      if ((tab as HTMLElement).dataset.tab === tabName) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
    
    // Atualiza conteúdo
    this.container.querySelectorAll('.left-panel-tab-content').forEach(content => {
      if ((content as HTMLElement).dataset.content === tabName) {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });
  }

  /**
   * Handler para mudança de layers
   */
  private handleLayerChange(): void {
    if (this.currentTab === 'layers' && this.layerPanel) {
      // LayerPanel já gerencia sua própria atualização via eventos
    }
  }

  /**
   * Handler para mudança de scene
   */
  private handleSceneChange(): void {
    if (this.currentTab === 'hierarchy' || this.currentTab === 'project') {
      this.updateContent();
    }
  }

  /**
   * Atualiza conteúdo
   */
  private updateContent(): void {
    const projectContent = this.container.querySelector('[data-content="project"]');
    const hierarchyContent = this.container.querySelector('[data-content="hierarchy"]');
    
    if (projectContent) {
      projectContent.innerHTML = this.renderProjectTab();
    }
    
    if (hierarchyContent) {
      hierarchyContent.innerHTML = this.renderHierarchyTab();
    }
    
    // Re-anexar listeners
    this.attachEventListeners();
  }

  /**
   * Toggle visibilidade
   */
  public toggleVisibility(): void {
    this.isVisible = !this.isVisible;
    this.setVisible(this.isVisible);
  }

  /**
   * Define visibilidade
   */
  public setVisible(visible: boolean): void {
    this.isVisible = visible;
    
    if (visible) {
      this.container.classList.remove('hidden');
      const toggleBtn = document.querySelector('.left-panel-toggle');
      if (toggleBtn) {
        (toggleBtn as HTMLElement).innerHTML = '◀';
      }
    } else {
      this.container.classList.add('hidden');
      const toggleBtn = document.querySelector('.left-panel-toggle');
      if (toggleBtn) {
        (toggleBtn as HTMLElement).innerHTML = '▶';
      }
    }
  }

  /**
   * Cleanup
   */
  public dispose(): void {
    if (this.layerPanel) {
      this.layerPanel.dispose();
    }
    
    const toggleBtn = document.querySelector('.left-panel-toggle');
    if (toggleBtn) {
      toggleBtn.remove();
    }
  }
}
