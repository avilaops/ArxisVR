/**
 * Button Component - Sistema de Design ArxisVR
 * Botão reutilizável com variantes, tamanhos e estados
 */

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'ghost' | 'link';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps {
  text?: string;
  icon?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
  tooltip?: string;
  onClick?: (event: MouseEvent) => void;
  className?: string;
}

export class Button {
  private element: HTMLButtonElement;
  private props: ButtonProps;
  private spinner: HTMLElement | null = null;

  constructor(props: ButtonProps) {
    this.props = props;
    this.element = this.createButton();
    this.applyStyles();
  }

  /**
   * Cria o elemento button
   */
  private createButton(): HTMLButtonElement {
    const button = document.createElement('button');
    button.className = this.getClassNames();
    
    // Icon
    if (this.props.icon) {
      const icon = document.createElement('span');
      icon.className = 'button-icon';
      icon.textContent = this.props.icon;
      button.appendChild(icon);
    }

    // Text
    if (this.props.text) {
      const text = document.createElement('span');
      text.className = 'button-text';
      text.textContent = this.props.text;
      button.appendChild(text);
    }

    // Loading spinner
    if (this.props.loading) {
      this.spinner = this.createSpinner();
      button.appendChild(this.spinner);
    }

    // Disabled
    if (this.props.disabled) {
      button.disabled = true;
    }

    // Tooltip
    if (this.props.tooltip) {
      button.title = this.props.tooltip;
    }

    // Click handler
    if (this.props.onClick) {
      button.addEventListener('click', this.props.onClick);
    }

    return button;
  }

  /**
   * Cria spinner de loading
   */
  private createSpinner(): HTMLElement {
    const spinner = document.createElement('span');
    spinner.className = 'button-spinner';
    spinner.innerHTML = '⟳';
    return spinner;
  }

  /**
   * Gera class names baseado nas props
   */
  private getClassNames(): string {
    const classes = ['arxis-button'];
    
    if (this.props.variant) {
      classes.push(`arxis-button--${this.props.variant}`);
    }
    
    if (this.props.size) {
      classes.push(`arxis-button--${this.props.size}`);
    }
    
    if (this.props.fullWidth) {
      classes.push('arxis-button--full');
    }
    
    if (this.props.loading) {
      classes.push('arxis-button--loading');
    }
    
    if (this.props.className) {
      classes.push(this.props.className);
    }

    return classes.join(' ');
  }

  /**
   * Aplica estilos CSS
   */
  private applyStyles(): void {
    if (document.getElementById('arxis-button-styles')) return;

    const style = document.createElement('style');
    style.id = 'arxis-button-styles';
    style.textContent = `
      .arxis-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 10px 20px;
        border: none;
        border-radius: 6px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        outline: none;
        position: relative;
        white-space: nowrap;
      }

      .arxis-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none;
      }

      /* Variants */
      .arxis-button--primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      }

      .arxis-button--primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
      }

      .arxis-button--primary:active {
        transform: translateY(0);
      }

      .arxis-button--secondary {
        background: rgba(255, 255, 255, 0.1);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.2);
      }

      .arxis-button--secondary:hover {
        background: rgba(255, 255, 255, 0.15);
        border-color: rgba(255, 255, 255, 0.3);
      }

      .arxis-button--danger {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        color: white;
        box-shadow: 0 4px 12px rgba(245, 87, 108, 0.4);
      }

      .arxis-button--danger:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(245, 87, 108, 0.6);
      }

      .arxis-button--success {
        background: linear-gradient(135deg, #00ff88 0%, #00d9ff 100%);
        color: #1a1a1a;
        box-shadow: 0 4px 12px rgba(0, 255, 136, 0.4);
      }

      .arxis-button--success:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 255, 136, 0.6);
      }

      .arxis-button--ghost {
        background: transparent;
        color: white;
        border: none;
      }

      .arxis-button--ghost:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      .arxis-button--link {
        background: transparent;
        color: #667eea;
        border: none;
        padding: 4px 8px;
      }

      .arxis-button--link:hover {
        color: #00ff88;
        text-decoration: underline;
      }

      /* Sizes */
      .arxis-button--xs {
        padding: 4px 8px;
        font-size: 11px;
        border-radius: 4px;
      }

      .arxis-button--sm {
        padding: 6px 12px;
        font-size: 12px;
        border-radius: 4px;
      }

      .arxis-button--md {
        padding: 10px 20px;
        font-size: 14px;
      }

      .arxis-button--lg {
        padding: 14px 28px;
        font-size: 16px;
        border-radius: 8px;
      }

      .arxis-button--xl {
        padding: 18px 36px;
        font-size: 18px;
        border-radius: 10px;
      }

      /* Full width */
      .arxis-button--full {
        width: 100%;
      }

      /* Loading state */
      .arxis-button--loading {
        pointer-events: none;
      }

      .button-spinner {
        animation: button-spin 1s linear infinite;
      }

      @keyframes button-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      .arxis-button--loading .button-text,
      .arxis-button--loading .button-icon {
        opacity: 0.5;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Atualiza propriedades do botão
   */
  public update(props: Partial<ButtonProps>): void {
    this.props = { ...this.props, ...props };
    
    // Atualiza texto
    if (props.text !== undefined) {
      const textEl = this.element.querySelector('.button-text');
      if (textEl) {
        textEl.textContent = props.text;
      }
    }

    // Atualiza disabled
    if (props.disabled !== undefined) {
      this.element.disabled = props.disabled;
    }

    // Atualiza loading
    if (props.loading !== undefined) {
      if (props.loading && !this.spinner) {
        this.spinner = this.createSpinner();
        this.element.appendChild(this.spinner);
      } else if (!props.loading && this.spinner) {
        this.spinner.remove();
        this.spinner = null;
      }
    }

    // Atualiza classes
    this.element.className = this.getClassNames();
  }

  /**
   * Define estado de loading
   */
  public setLoading(loading: boolean): void {
    this.update({ loading });
  }

  /**
   * Define estado disabled
   */
  public setDisabled(disabled: boolean): void {
    this.update({ disabled });
  }

  /**
   * Retorna o elemento DOM
   */
  public getElement(): HTMLButtonElement {
    return this.element;
  }

  /**
   * Destrói o botão
   */
  public destroy(): void {
    if (this.props.onClick) {
      this.element.removeEventListener('click', this.props.onClick);
    }
    this.element.remove();
  }
}

/**
 * Helper para criar botão rapidamente
 */
export function createButton(props: ButtonProps): Button {
  return new Button(props);
}
