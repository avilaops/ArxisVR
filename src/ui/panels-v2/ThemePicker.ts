/**
 * Theme Picker
 * Seletor de temas com preview
 */

import { Card } from '../design-system/components/Card';

export interface Theme {
  id: string;
  name: string;
  description: string;
  preview: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
  };
}

export class ThemePicker {
  private card: Card;
  private themes: Theme[] = [];
  private currentTheme: string = 'dark';
  private onThemeChange?: (themeId: string) => void;

  constructor(options?: {
    onThemeChange?: (themeId: string) => void;
  }) {
    this.onThemeChange = options?.onThemeChange;
    
    this.card = new Card({
      title: '🎨 Temas',
      variant: 'glass'
    });

    this.loadThemes();
    this.render();
  }

  private loadThemes(): void {
    this.themes = [
      {
        id: 'dark',
        name: 'Escuro Neon',
        description: 'Tema escuro com acentos neon',
        preview: {
          primary: '#00d4ff',
          secondary: '#7b2ff7',
          background: '#0a0a0f',
          surface: '#14141e'
        }
      },
      {
        id: 'light',
        name: 'Claro Profissional',
        description: 'Tema claro para ambientes bem iluminados',
        preview: {
          primary: '#0088cc',
          secondary: '#5a1fb3',
          background: '#f5f5f5',
          surface: '#ffffff'
        }
      },
      {
        id: 'blue',
        name: 'Azul Oceano',
        description: 'Tons de azul suaves',
        preview: {
          primary: '#4fc3f7',
          secondary: '#29b6f6',
          background: '#0d1b2a',
          surface: '#1b263b'
        }
      },
      {
        id: 'purple',
        name: 'Roxo Místico',
        description: 'Gradientes roxos elegantes',
        preview: {
          primary: '#ab47bc',
          secondary: '#7b1fa2',
          background: '#1a0a1f',
          surface: '#2a1a2f'
        }
      },
      {
        id: 'green',
        name: 'Verde Matrix',
        description: 'Inspirado em código',
        preview: {
          primary: '#00ff41',
          secondary: '#00cc33',
          background: '#0a0f0a',
          surface: '#0f1a0f'
        }
      },
      {
        id: 'orange',
        name: 'Laranja Sunset',
        description: 'Tons quentes de pôr do sol',
        preview: {
          primary: '#ff9800',
          secondary: '#ff5722',
          background: '#1a0f0a',
          surface: '#2a1a0f'
        }
      }
    ];
  }

  private render(): void {
    const body = this.card.getBody();
    body.innerHTML = '';

    // Current theme
    const current = document.createElement('div');
    current.className = 'arxis-theme__current';
    
    const currentTheme = this.themes.find(t => t.id === this.currentTheme);
    current.innerHTML = `
      <div class="arxis-theme__current-label">Tema Atual</div>
      <div class="arxis-theme__current-name">${currentTheme?.name || 'Padrão'}</div>
    `;
    body.appendChild(current);

    // Themes grid
    const grid = document.createElement('div');
    grid.className = 'arxis-theme__grid';

    this.themes.forEach(theme => {
      const card = this.createThemeCard(theme);
      grid.appendChild(card);
    });

    body.appendChild(grid);
    this.injectStyles();
  }

  private createThemeCard(theme: Theme): HTMLDivElement {
    const card = document.createElement('div');
    card.className = `arxis-theme__card ${theme.id === this.currentTheme ? 'arxis-theme__card--active' : ''}`;

    // Preview
    const preview = document.createElement('div');
    preview.className = 'arxis-theme__preview';
    preview.style.background = theme.preview.background;

    const colors = document.createElement('div');
    colors.className = 'arxis-theme__colors';

    const primary = document.createElement('div');
    primary.className = 'arxis-theme__color';
    primary.style.background = theme.preview.primary;

    const secondary = document.createElement('div');
    secondary.className = 'arxis-theme__color';
    secondary.style.background = theme.preview.secondary;

    const surface = document.createElement('div');
    surface.className = 'arxis-theme__color arxis-theme__color--large';
    surface.style.background = theme.preview.surface;

    colors.appendChild(primary);
    colors.appendChild(secondary);
    colors.appendChild(surface);
    preview.appendChild(colors);

    card.appendChild(preview);

    // Info
    const info = document.createElement('div');
    info.className = 'arxis-theme__info';

    const name = document.createElement('h4');
    name.className = 'arxis-theme__name';
    name.textContent = theme.name;

    const description = document.createElement('p');
    description.className = 'arxis-theme__description';
    description.textContent = theme.description;

    info.appendChild(name);
    info.appendChild(description);
    card.appendChild(info);

    // Active badge
    if (theme.id === this.currentTheme) {
      const badge = document.createElement('div');
      badge.className = 'arxis-theme__badge';
      badge.textContent = '✓ Ativo';
      card.appendChild(badge);
    }

    card.addEventListener('click', () => this.selectTheme(theme.id));

    return card;
  }

  public selectTheme(themeId: string): void {
    this.currentTheme = themeId;
    this.onThemeChange?.(themeId);
    this.render();
    console.log('Tema alterado para:', themeId);
  }

  public getCurrentTheme(): string {
    return this.currentTheme;
  }

  public getElement(): HTMLElement {
    return this.card.getElement();
  }

  public destroy(): void {
    this.card.destroy();
  }

  private injectStyles(): void {
    if (document.getElementById('arxis-theme-styles')) return;

    const style = document.createElement('style');
    style.id = 'arxis-theme-styles';
    style.textContent = `
      .arxis-theme__current {
        padding: 16px;
        background: rgba(0, 212, 255, 0.1);
        border-radius: 8px;
        margin-bottom: 20px;
        text-align: center;
      }

      .arxis-theme__current-label {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.6);
        text-transform: uppercase;
        margin-bottom: 4px;
      }

      .arxis-theme__current-name {
        font-size: 18px;
        font-weight: 700;
        color: #00d4ff;
      }

      .arxis-theme__grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 16px;
      }

      .arxis-theme__card {
        position: relative;
        border-radius: 12px;
        overflow: hidden;
        cursor: pointer;
        transition: all 0.3s;
        background: rgba(255, 255, 255, 0.04);
        border: 2px solid transparent;
      }

      .arxis-theme__card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        border-color: rgba(255, 255, 255, 0.1);
      }

      .arxis-theme__card--active {
        border-color: #00d4ff;
        box-shadow: 0 0 20px rgba(0, 212, 255, 0.4);
      }

      .arxis-theme__preview {
        height: 120px;
        padding: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .arxis-theme__colors {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .arxis-theme__color {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        border: 2px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }

      .arxis-theme__color--large {
        width: 48px;
        height: 48px;
      }

      .arxis-theme__info {
        padding: 12px;
        background: rgba(255, 255, 255, 0.03);
      }

      .arxis-theme__name {
        margin: 0 0 4px 0;
        font-size: 14px;
        font-weight: 600;
        color: #fff;
      }

      .arxis-theme__description {
        margin: 0;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
        line-height: 1.4;
      }

      .arxis-theme__badge {
        position: absolute;
        top: 8px;
        right: 8px;
        padding: 4px 10px;
        background: #00d4ff;
        color: #0a0a0f;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 700;
      }
    `;
    document.head.appendChild(style);
  }
}
