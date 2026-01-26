/**
 * SearchPanel - Busca global em modelos/elementos
 */

export class SearchPanel {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.render();
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="panel search-panel">
        <div class="panel__section">
          <input 
            type="text" 
            class="input input--block" 
            placeholder="Search elements..."
            id="search-input"
          />
        </div>

        <div class="panel__section">
          <h3 class="panel__section-title">Results</h3>
          <div class="panel__list" id="search-results">
            <div class="panel__empty">No results</div>
          </div>
        </div>
      </div>
    `;
  }

  public destroy(): void {
    // Cleanup
  }
}
