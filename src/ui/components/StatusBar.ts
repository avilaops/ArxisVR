/**
 * StatusBar - Barra de status inferior (tipo VS Code)
 * Mostra: arquivo atual, triangles, memória, FPS, erros
 */

import { uiStore } from '../../app/state/uiStore';
import type { StatusBarState } from '../../app/state/uiStore';

/**
 * StatusBar component
 */
export class StatusBar {
  private container: HTMLElement;
  private unsubscribe?: () => void;

  constructor(container: HTMLElement) {
    this.container = container;
    this.render();
    this.subscribeToState();
  }

  private render(): void {
    this.container.innerHTML = '';
    this.container.className = 'statusbar';

    // Left section
    const left = document.createElement('div');
    left.className = 'statusbar__left';

    const fileName = document.createElement('span');
    fileName.className = 'statusbar__item statusbar__filename';
    fileName.id = 'statusbar-filename';
    fileName.textContent = 'No file open';

    const elements = document.createElement('span');
    elements.className = 'statusbar__item statusbar__elements';
    elements.id = 'statusbar-elements';

    left.appendChild(fileName);
    left.appendChild(elements);

    // Right section
    const right = document.createElement('div');
    right.className = 'statusbar__right';

    const triangles = document.createElement('span');
    triangles.className = 'statusbar__item statusbar__triangles';
    triangles.id = 'statusbar-triangles';

    const memory = document.createElement('span');
    memory.className = 'statusbar__item statusbar__memory';
    memory.id = 'statusbar-memory';

    const fps = document.createElement('span');
    fps.className = 'statusbar__item statusbar__fps';
    fps.id = 'statusbar-fps';

    const errors = document.createElement('span');
    errors.className = 'statusbar__item statusbar__errors';
    errors.id = 'statusbar-errors';

    right.appendChild(triangles);
    right.appendChild(memory);
    right.appendChild(fps);
    right.appendChild(errors);

    this.container.appendChild(left);
    this.container.appendChild(right);

    // Update initial state
    this.updateStatusBar(uiStore.getState().statusBar);
  }

  private subscribeToState(): void {
    this.unsubscribe = uiStore.subscribe((state) => {
      this.updateStatusBar(state.statusBar);
    });
  }

  private updateStatusBar(status: StatusBarState): void {
    const fileName = this.container.querySelector('#statusbar-filename') as HTMLElement;
    if (fileName) {
      fileName.textContent = status.fileName || 'No file open';
    }

    const elements = this.container.querySelector('#statusbar-elements') as HTMLElement;
    if (elements) {
      elements.textContent = status.elements ? `${status.elements} elements` : '';
    }

    const triangles = this.container.querySelector('#statusbar-triangles') as HTMLElement;
    if (triangles) {
      triangles.textContent = status.triangles 
        ? `△ ${this.formatNumber(status.triangles)}`
        : '';
    }

    const memory = this.container.querySelector('#statusbar-memory') as HTMLElement;
    if (memory) {
      memory.textContent = status.memory 
        ? `⚡ ${status.memory.toFixed(1)} MB`
        : '';
    }

    const fps = this.container.querySelector('#statusbar-fps') as HTMLElement;
    if (fps) {
      fps.textContent = status.fps 
        ? `${status.fps} FPS`
        : '';
    }

    const errors = this.container.querySelector('#statusbar-errors') as HTMLElement;
    if (errors) {
      errors.textContent = status.errors 
        ? `⚠️ ${status.errors} errors`
        : '';
      errors.style.display = status.errors ? 'block' : 'none';
    }
  }

  private formatNumber(num: number): string {
    if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(1)}M`;
    }
    if (num >= 1_000) {
      return `${(num / 1_000).toFixed(1)}K`;
    }
    return num.toString();
  }

  public destroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}
