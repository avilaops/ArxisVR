/**
 * ToolsPanel - Ferramentas de medição, seção, etc.
 */

export class ToolsPanel {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.render();
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="panel tools-panel">
        <div class="panel__section">
          <h3 class="panel__section-title">Tools</h3>
          <div class="panel__list">
            <button class="btn btn--block">📏 Measurement</button>
            <button class="btn btn--block">✂️ Section</button>
            <button class="btn btn--block">👁️ Clipping Planes</button>
          </div>
        </div>
      </div>
    `;
  }

  public destroy(): void {
    // Cleanup
  }
}
