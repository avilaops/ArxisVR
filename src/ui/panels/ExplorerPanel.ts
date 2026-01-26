/**
 * ExplorerPanel - Lista de arquivos e projetos
 */

import { uiStore } from '../../app/state/uiStore';
import { fileService } from '../../systems/file';

export class ExplorerPanel {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.render();
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="panel explorer-panel">
        <div class="panel__section">
          <button class="btn btn--primary btn--block" id="open-file-btn">
            📂 Open IFC File
          </button>
        </div>

        <div class="panel__section">
          <h3 class="panel__section-title">Recent Files</h3>
          <div class="panel__list" id="recent-files-list">
            <div class="panel__empty">No recent files</div>
          </div>
        </div>

        <div class="panel__section">
          <h3 class="panel__section-title">Favorites</h3>
          <div class="panel__list" id="favorites-list">
            <div class="panel__empty">No favorites</div>
          </div>
        </div>
      </div>
    `;

    this.setupEventListeners();
    this.loadRecentFiles();
  }

  private setupEventListeners(): void {
    const openBtn = this.container.querySelector('#open-file-btn');
    openBtn?.addEventListener('click', () => {
      uiStore.openModal('loadFile');
    });
  }

  private async loadRecentFiles(): Promise<void> {
    const recents = fileService.getRecents(10);
    const listEl = this.container.querySelector('#recent-files-list');
    
    if (listEl && recents.length > 0) {
      listEl.innerHTML = recents.map(file => `
        <div class="panel__list-item">
          <span class="panel__list-icon">📄</span>
          <span class="panel__list-text">${file.metadata.name}</span>
        </div>
      `).join('');
    }
  }

  public destroy(): void {
    // Cleanup
  }
}
