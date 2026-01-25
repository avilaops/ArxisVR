/**
 * Layers Panel - Gerenciamento de camadas/layers
 * Controle de visibilidade e organização por camadas
 */

import { Card } from '../design-system/components/Card';
import { Input } from '../design-system/components/Input';
import { Button } from '../design-system/components/Button';
import { Checkbox } from '../design-system/components/Checkbox';
import { Modal } from '../design-system/components/Modal';
import { eventBus, EventType } from '../../core';

export interface Layer {
  id: string;
  name: string;
  color: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  elements: string[];  // IDs dos elementos
}

export class LayersPanel {
  private container: HTMLElement;
  private layers: Layer[] = [];
  private createModal: Modal | null = null;

  constructor() {
    this.container = this.createContainer();
    this.applyStyles();
    this.loadMockLayers();
    this.render();
  }

  /**
   * Cria o container
   */
  private createContainer(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'layers-panel';
    
    // Header
    const header = document.createElement('div');
    header.className = 'layers-panel-header';
    
    const title = document.createElement('h3');
    title.textContent = '🎨 Layers';
    header.appendChild(title);

    // New layer button
    const newBtn = new Button({
      icon: '+',
      variant: 'primary',
      size: 'sm',
      tooltip: 'Nova Layer',
      onClick: () => this.showCreateModal()
    });
    header.appendChild(newBtn.getElement());

    container.appendChild(header);

    // Content
    const content = document.createElement('div');
    content.className = 'layers-panel-content';
    container.appendChild(content);

    return container;
  }

  /**
   * Carrega layers mock
   */
  private loadMockLayers(): void {
    this.layers = [
      { id: 'layer-1', name: 'Estrutura', color: '#667eea', visible: true, locked: false, opacity: 1.0, elements: [] },
      { id: 'layer-2', name: 'Arquitetura', color: '#00ff88', visible: true, locked: false, opacity: 1.0, elements: [] },
      { id: 'layer-3', name: 'Hidráulica', color: '#00d9ff', visible: true, locked: false, opacity: 0.8, elements: [] },
      { id: 'layer-4', name: 'Elétrica', color: '#ffd700', visible: true, locked: false, opacity: 0.8, elements: [] },
      { id: 'layer-5', name: 'HVAC', color: '#ff6b6b', visible: false, locked: false, opacity: 0.6, elements: [] },
      { id: 'layer-6', name: 'Terreno', color: '#8b4513', visible: true, locked: true, opacity: 0.5, elements: [] },
    ];
  }

  /**
   * Renderiza o painel
   */
  private render(): void {
    const content = this.container.querySelector('.layers-panel-content');
    if (!content) return;

    content.innerHTML = '';

    this.layers.forEach(layer => {
      const layerEl = this.createLayerElement(layer);
      content.appendChild(layerEl);
    });
  }

  /**
   * Cria elemento de layer
   */
  private createLayerElement(layer: Layer): HTMLElement {
    const layerEl = document.createElement('div');
    layerEl.className = 'layer-item';
    
    if (layer.locked) {
      layerEl.classList.add('layer-item--locked');
    }

    // Visibility checkbox
    const visibilityCheck = new Checkbox({
      checked: layer.visible,
      onChange: (checked) => this.toggleLayerVisibility(layer, checked)
    });
    visibilityCheck.getElement().onclick = (e) => e.stopPropagation();
    layerEl.appendChild(visibilityCheck.getElement());

    // Color indicator
    const colorIndicator = document.createElement('span');
    colorIndicator.className = 'layer-color-indicator';
    colorIndicator.style.background = layer.color;
    layerEl.appendChild(colorIndicator);

    // Name
    const name = document.createElement('span');
    name.className = 'layer-name';
    name.textContent = layer.name;
    layerEl.appendChild(name);

    // Element count
    const count = document.createElement('span');
    count.className = 'layer-count';
    count.textContent = `(${layer.elements.length})`;
    layerEl.appendChild(count);

    // Actions
    const actions = document.createElement('div');
    actions.className = 'layer-actions';

    // Lock button
    const lockBtn = new Button({
      icon: layer.locked ? '🔒' : '🔓',
      variant: 'ghost',
      size: 'xs',
      tooltip: layer.locked ? 'Desbloquear' : 'Bloquear',
      onClick: () => this.toggleLayerLock(layer)
    });
    actions.appendChild(lockBtn.getElement());

    // Delete button
    const deleteBtn = new Button({
      icon: '🗑️',
      variant: 'ghost',
      size: 'xs',
      tooltip: 'Deletar',
      onClick: () => this.deleteLayer(layer)
    });
    actions.appendChild(deleteBtn.getElement());

    layerEl.appendChild(actions);

    // Opacity slider (aparece ao expandir)
    const opacityControl = document.createElement('div');
    opacityControl.className = 'layer-opacity-control';
    opacityControl.innerHTML = `
      <label>Opacidade: ${Math.round(layer.opacity * 100)}%</label>
      <input type="range" min="0" max="100" value="${layer.opacity * 100}" 
             onchange="this.previousElementSibling.textContent = 'Opacidade: ' + this.value + '%'" />
    `;
    layerEl.appendChild(opacityControl);

    return layerEl;
  }

  /**
   * Toggle visibilidade da layer
   */
  private toggleLayerVisibility(layer: Layer, visible: boolean): void {
    layer.visible = visible;
    
    eventBus.emit(EventType.LAYER_VISIBILITY_CHANGED, {
      layerId: layer.id,
      visible
    });

    console.log(`Layer ${layer.name} visibility: ${visible}`);
  }

  /**
   * Toggle lock da layer
   */
  private toggleLayerLock(layer: Layer): void {
    layer.locked = !layer.locked;
    this.render();
    
    eventBus.emit(EventType.LAYER_LOCKED_CHANGED, {
      layerId: layer.id,
      locked: layer.locked
    });
  }

  /**
   * Deleta layer
   */
  private deleteLayer(layer: Layer): void {
    if (confirm(`Deseja realmente deletar a layer "${layer.name}"?`)) {
      this.layers = this.layers.filter(l => l.id !== layer.id);
      this.render();
      
      eventBus.emit(EventType.LAYER_DELETED, { layerId: layer.id });
    }
  }

  /**
   * Mostra modal de criar layer
   */
  private showCreateModal(): void {
    this.createModal = new Modal({
      title: 'Nova Layer',
      size: 'sm',
      onClose: () => {
        if (this.createModal) {
          this.createModal.destroy();
          this.createModal = null;
        }
      }
    });

    // Form
    const form = document.createElement('div');
    form.style.display = 'flex';
    form.style.flexDirection = 'column';
    form.style.gap = '16px';

    const nameInput = new Input({
      label: 'Nome',
      placeholder: 'Nome da layer...',
      required: true,
      fullWidth: true
    });
    form.appendChild(nameInput.getElement());

    const colorInput = new Input({
      label: 'Cor',
      type: 'text',
      value: '#667eea',
      fullWidth: true
    });
    form.appendChild(colorInput.getElement());

    this.createModal.setContent(form);

    // Footer
    const footer = document.createElement('div');
    footer.style.display = 'flex';
    footer.style.gap = '8px';

    const cancelBtn = new Button({
      text: 'Cancelar',
      variant: 'secondary',
      onClick: () => this.createModal?.close()
    });
    footer.appendChild(cancelBtn.getElement());

    const createBtn = new Button({
      text: 'Criar',
      variant: 'primary',
      onClick: () => {
        const name = nameInput.getValue();
        const color = colorInput.getValue();
        
        if (name) {
          this.createLayer(name, color);
          this.createModal?.close();
        }
      }
    });
    footer.appendChild(createBtn.getElement());

    this.createModal.setFooter(footer);
    this.createModal.open();
  }

  /**
   * Cria uma nova layer
   */
  private createLayer(name: string, color: string): void {
    const newLayer: Layer = {
      id: `layer-${Date.now()}`,
      name,
      color,
      visible: true,
      locked: false,
      opacity: 1.0,
      elements: []
    };

    this.layers.push(newLayer);
    this.render();

    eventBus.emit(EventType.LAYER_CREATED, { layer: newLayer });
  }

  /**
   * Aplica estilos CSS
   */
  private applyStyles(): void {
    if (document.getElementById('layers-panel-styles')) return;

    const style = document.createElement('style');
    style.id = 'layers-panel-styles';
    style.textContent = `
      .layers-panel {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 320px;
        height: calc(100vh - 40px);
        max-height: 800px;
        display: flex;
        flex-direction: column;
        background: rgba(15, 15, 25, 0.98);
        backdrop-filter: blur(20px);
        border: 2px solid rgba(0, 212, 255, 0.4);
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
        z-index: 1000;
        overflow: hidden;
      }

      .layers-panel-header {
        padding: 16px;
        background: rgba(0, 0, 0, 0.3);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .layers-panel-header h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: var(--theme-foreground, #fff);
      }

      .layers-panel-content {
        flex: 1;
        overflow-y: auto;
        padding: 8px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .layer-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        background: rgba(255, 255, 255, 0.03);
        border-radius: 6px;
        border: 1px solid rgba(255, 255, 255, 0.05);
        transition: all 0.2s ease;
      }

      .layer-item:hover {
        background: rgba(255, 255, 255, 0.06);
        border-color: rgba(255, 255, 255, 0.1);
      }

      .layer-item--locked {
        opacity: 0.7;
      }

      .layer-item .arxis-checkbox {
        margin: 0;
      }

      .layer-color-indicator {
        width: 20px;
        height: 20px;
        border-radius: 4px;
        border: 2px solid rgba(255, 255, 255, 0.2);
        flex-shrink: 0;
      }

      .layer-name {
        flex: 1;
        font-size: 14px;
        font-weight: 500;
        color: var(--theme-foreground, #fff);
      }

      .layer-count {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.5);
      }

      .layer-actions {
        display: flex;
        gap: 4px;
        opacity: 0;
        transition: opacity 0.2s ease;
      }

      .layer-item:hover .layer-actions {
        opacity: 1;
      }

      .layer-opacity-control {
        display: none;
        margin-top: 8px;
        padding-top: 8px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }

      .layer-opacity-control label {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
        display: block;
        margin-bottom: 6px;
      }

      .layer-opacity-control input[type="range"] {
        width: 100%;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Retorna o elemento
   */
  public getElement(): HTMLElement {
    return this.container;
  }

  /**
   * Destrói o painel
   */
  public destroy(): void {
    if (this.createModal) {
      this.createModal.destroy();
    }
    this.container.remove();
  }
}
