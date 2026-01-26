/**
 * LayersPanel - Gerenciamento de camadas/layers
 */

export class LayersPanel {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.render();
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="panel layers-panel">
        <div class="panel__section">
          <h3 class="panel__section-title">Layers</h3>
          <div class="panel__list" id="layers-list">
            <div class="panel__empty">No layers</div>
          </div>
        </div>
      </div>
    `;
  }

  public destroy(): void {
    // Cleanup
  }
}
