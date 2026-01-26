/**
 * ActivityBar - Barra lateral esquerda (tipo VS Code)
 * Navegação entre views (Explorer, Search, Layers, Properties, Tools, Settings)
 */

import { uiStore } from '../../app/state/uiStore';
import type { ViewType } from '../../app/state/uiStore';

interface ActivityBarItem {
  id: ViewType;
  icon: string;
  label: string;
  shortcut?: string;
}

const ACTIVITY_ITEMS: ActivityBarItem[] = [
  { id: 'explorer', icon: '📁', label: 'Explorer', shortcut: 'Ctrl+Shift+E' },
  { id: 'search', icon: '🔍', label: 'Search', shortcut: 'Ctrl+Shift+F' },
  { id: 'layers', icon: '📚', label: 'Layers', shortcut: 'Ctrl+Shift+L' },
  { id: 'properties', icon: '📋', label: 'Properties', shortcut: 'Ctrl+Shift+P' },
  { id: 'tools', icon: '🔧', label: 'Tools', shortcut: 'Ctrl+Shift+T' },
  { id: 'settings', icon: '⚙️', label: 'Settings', shortcut: 'Ctrl+,' }
];

/**
 * ActivityBar component
 */
export class ActivityBar {
  private container: HTMLElement;
  private unsubscribe?: () => void;

  constructor(container: HTMLElement) {
    this.container = container;
    this.render();
    this.subscribeToState();
  }

  private render(): void {
    this.container.innerHTML = '';
    this.container.className = 'activity-bar';

    const list = document.createElement('ul');
    list.className = 'activity-bar__list';

    ACTIVITY_ITEMS.forEach(item => {
      const li = document.createElement('li');
      li.className = 'activity-bar__item';
      li.dataset.view = item.id;
      li.title = `${item.label} (${item.shortcut || ''})`;

      const button = document.createElement('button');
      button.className = 'activity-bar__button';
      button.setAttribute('aria-label', item.label);
      button.innerHTML = `
        <span class="activity-bar__icon">${item.icon}</span>
      `;

      button.addEventListener('click', () => {
        uiStore.setActiveView(item.id);
      });

      li.appendChild(button);
      list.appendChild(li);
    });

    this.container.appendChild(list);

    // Update active state
    this.updateActiveState(uiStore.getState().activeView);
  }

  private subscribeToState(): void {
    this.unsubscribe = uiStore.subscribe((state) => {
      this.updateActiveState(state.activeView);
    });
  }

  private updateActiveState(activeView: ViewType): void {
    const items = this.container.querySelectorAll('.activity-bar__item');
    items.forEach(item => {
      if (item.getAttribute('data-view') === activeView) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  public destroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}
