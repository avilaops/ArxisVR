/**
 * IFC Property Panel - Painel de propriedades IFC
 * Exibe e permite editar propriedades de elementos IFC
 */

import { Card } from '../design-system/components/Card';
import { Input } from '../design-system/components/Input';
import { Button } from '../design-system/components/Button';
import { eventBus, EventType } from '../../core';

export interface IFCProperty {
  name: string;
  value: string | number | boolean;
  type: string;
  category: string;
  editable?: boolean;
}

export interface IFCPropertyGroup {
  category: string;
  icon?: string;
  properties: IFCProperty[];
}

export class IFCPropertyPanel {
  private container: HTMLElement;
  private currentProperties: IFCPropertyGroup[] = [];
  private cards: Card[] = [];

  constructor() {
    this.container = this.createContainer();
    this.applyStyles();
    this.setupEventListeners();
  }

  /**
   * Cria o container
   */
  private createContainer(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'ifc-property-panel';
    
    // Header
    const header = document.createElement('div');
    header.className = 'ifc-property-panel-header';
    
    const title = document.createElement('h3');
    title.textContent = 'Propriedades IFC';
    header.appendChild(title);

    // Export button
    const exportBtn = new Button({
      text: 'Exportar',
      icon: '📥',
      variant: 'secondary',
      size: 'sm',
      onClick: () => this.exportProperties()
    });
    header.appendChild(exportBtn.getElement());

    container.appendChild(header);

    // Content
    const content = document.createElement('div');
    content.className = 'ifc-property-panel-content';
    container.appendChild(content);

    return container;
  }

  /**
   * Configura event listeners
   */
  private setupEventListeners(): void {
    // Atualiza quando um objeto é selecionado
    eventBus.on(EventType.OBJECT_SELECTED, (data: any) => {
      if (data.object) {
        this.loadPropertiesForObject(data.object);
      } else {
        this.clear();
      }
    });
  }

  /**
   * Carrega propriedades de um objeto
   */
  private loadPropertiesForObject(object: any): void {
    // TODO: Integrar com IFCPropertyService
    // Por enquanto, dados mock
    const mockProperties: IFCPropertyGroup[] = [
      {
        category: '📋 Informações Básicas',
        properties: [
          { name: 'Nome', value: object.name || 'Sem nome', type: 'string', category: 'basic', editable: true },
          { name: 'Tipo IFC', value: object.userData?.ifcType || 'IfcBuildingElement', type: 'string', category: 'basic' },
          { name: 'GUID', value: object.userData?.guid || 'N/A', type: 'string', category: 'basic' },
          { name: 'Tag', value: object.userData?.tag || 'N/A', type: 'string', category: 'basic', editable: true },
        ]
      },
      {
        category: '📐 Geometria',
        properties: [
          { name: 'Posição X', value: object.position?.x.toFixed(2) || '0', type: 'number', category: 'geometry' },
          { name: 'Posição Y', value: object.position?.y.toFixed(2) || '0', type: 'number', category: 'geometry' },
          { name: 'Posição Z', value: object.position?.z.toFixed(2) || '0', type: 'number', category: 'geometry' },
          { name: 'Visível', value: object.visible || false, type: 'boolean', category: 'geometry', editable: true },
        ]
      },
      {
        category: '🏗️ Construção',
        properties: [
          { name: 'Material', value: 'Concreto', type: 'string', category: 'construction', editable: true },
          { name: 'Resistência', value: '25 MPa', type: 'string', category: 'construction', editable: true },
          { name: 'Fase', value: 'Estrutura', type: 'string', category: 'construction', editable: true },
        ]
      },
      {
        category: '💰 Quantitativos',
        properties: [
          { name: 'Volume', value: '1.25 m³', type: 'string', category: 'quantities' },
          { name: 'Área', value: '5.60 m²', type: 'string', category: 'quantities' },
          { name: 'Comprimento', value: '3.00 m', type: 'string', category: 'quantities' },
          { name: 'Peso', value: '3125 kg', type: 'string', category: 'quantities' },
        ]
      }
    ];

    this.setProperties(mockProperties);
  }

  /**
   * Define propriedades a exibir
   */
  public setProperties(propertyGroups: IFCPropertyGroup[]): void {
    this.currentProperties = propertyGroups;
    this.render();
  }

  /**
   * Renderiza o painel
   */
  private render(): void {
    const content = this.container.querySelector('.ifc-property-panel-content');
    if (!content) return;

    // Limpa conteúdo anterior
    content.innerHTML = '';
    this.cards = [];

    // Renderiza cada grupo
    this.currentProperties.forEach(group => {
      const card = new Card({
        title: group.category,
        variant: 'bordered',
        padding: 'sm'
      });

      const table = this.createPropertiesTable(group.properties);
      card.setContent(table);

      content.appendChild(card.getElement());
      this.cards.push(card);
    });
  }

  /**
   * Cria tabela de propriedades
   */
  private createPropertiesTable(properties: IFCProperty[]): HTMLElement {
    const table = document.createElement('div');
    table.className = 'ifc-properties-table';

    properties.forEach(prop => {
      const row = document.createElement('div');
      row.className = 'ifc-property-row';

      const label = document.createElement('div');
      label.className = 'ifc-property-label';
      label.textContent = prop.name;
      row.appendChild(label);

      const valueEl = document.createElement('div');
      valueEl.className = 'ifc-property-value';
      
      if (prop.editable) {
        const input = new Input({
          value: String(prop.value),
          size: 'sm',
          fullWidth: true,
          onChange: (value) => this.updateProperty(prop, value)
        });
        valueEl.appendChild(input.getElement());
      } else {
        valueEl.textContent = String(prop.value);
      }

      row.appendChild(valueEl);
      table.appendChild(row);
    });

    return table;
  }

  /**
   * Atualiza uma propriedade
   */
  private updateProperty(property: IFCProperty, newValue: string): void {
    property.value = newValue;
    console.log(`Property updated: ${property.name} = ${newValue}`);
    
    // TODO: Emitir evento de atualização
    eventBus.emit(EventType.PROPERTY_UPDATED, {
      property: property.name,
      value: newValue
    });
  }

  /**
   * Exporta propriedades
   */
  private exportProperties(): void {
    const data = JSON.stringify(this.currentProperties, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `ifc-properties-${Date.now()}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
  }

  /**
   * Limpa o painel
   */
  public clear(): void {
    this.currentProperties = [];
    this.render();
  }

  /**
   * Aplica estilos CSS
   */
  private applyStyles(): void {
    if (document.getElementById('ifc-property-panel-styles')) return;

    const style = document.createElement('style');
    style.id = 'ifc-property-panel-styles';
    style.textContent = `
      .ifc-property-panel {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .ifc-property-panel-header {
        padding: 16px;
        background: rgba(0, 0, 0, 0.3);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .ifc-property-panel-header h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: var(--theme-foreground, #fff);
      }

      .ifc-property-panel-content {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .ifc-properties-table {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .ifc-property-row {
        display: grid;
        grid-template-columns: 140px 1fr;
        gap: 12px;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      }

      .ifc-property-row:last-child {
        border-bottom: none;
      }

      .ifc-property-label {
        font-size: 12px;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.7);
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      .ifc-property-value {
        font-size: 13px;
        color: var(--theme-foreground, #fff);
        font-family: 'Courier New', monospace;
      }

      .ifc-property-value .arxis-input-container {
        margin-bottom: 0;
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
    this.cards.forEach(card => card.destroy());
    this.container.remove();
  }
}
