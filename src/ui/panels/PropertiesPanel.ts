/**
 * PropertiesPanel - Propriedades do elemento selecionado
 */

export class PropertiesPanel {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.render();
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="panel properties-panel">
        <div class="panel__section">
          <h3 class="panel__section-title">Properties</h3>
          <div class="panel__list" id="properties-list">
            <div class="panel__empty">No selection</div>
          </div>
        </div>
      </div>
    `;
  }

  public destroy(): void {
    // Cleanup
  }
}
