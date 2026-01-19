import { eventBus, EventType } from '../eventBus';

/**
 * UIReloader - Sistema de hot reload para UI panels
 * Permite recarregar componentes da interface sem reiniciar a aplicação
 */
export class UIReloader {
  private panelRegistry: Map<string, PanelEntry> = new Map();

  /**
   * Registra um panel para hot reload
   */
  public registerPanel(panelId: string, element: HTMLElement, originalHTML?: string): void {
    this.panelRegistry.set(panelId, {
      element,
      originalHTML: originalHTML || element.innerHTML,
      state: this.captureState(element)
    });

    console.log(`📝 Registered panel for hot reload: ${panelId}`);
  }

  /**
   * Recarrega um panel específico
   */
  public async reloadPanel(panelId: string, newHTML?: string): Promise<void> {
    const entry = this.panelRegistry.get(panelId);
    if (!entry) {
      throw new Error(`Panel not registered: ${panelId}`);
    }

    const startTime = Date.now();

    try {
      // Captura estado atual
      const currentState = this.captureState(entry.element);

      // Atualiza HTML
      if (newHTML) {
        entry.element.innerHTML = newHTML;
        entry.originalHTML = newHTML;
      } else {
        // Recarrega do DOM original
        entry.element.innerHTML = entry.originalHTML;
      }

      // Restaura estado
      this.restoreState(entry.element, currentState);

      // Atualiza registro
      entry.state = currentState;

      const duration = Date.now() - startTime;

      eventBus.emit(EventType.UI_PANEL_OPENED, { panelName: panelId });

      console.log(`✅ Panel reloaded: ${panelId} (${duration}ms)`);

    } catch (error) {
      console.error(`❌ Failed to reload panel: ${panelId}`, error);
      throw error;
    }
  }

  /**
   * Captura estado dos inputs de um elemento
   */
  private captureState(element: HTMLElement): any {
    const state: any = {
      inputs: {},
      scroll: {
        top: element.scrollTop,
        left: element.scrollLeft
      }
    };

    // Captura inputs
    const inputs = element.querySelectorAll('input, select, textarea');
    inputs.forEach((input: any) => {
      if (input.id || input.name) {
        const key = input.id || input.name;

        if (input.type === 'checkbox' || input.type === 'radio') {
          state.inputs[key] = input.checked;
        } else {
          state.inputs[key] = input.value;
        }
      }
    });

    return state;
  }

  /**
   * Restaura estado dos inputs de um elemento
   */
  private restoreState(element: HTMLElement, state: any): void {
    // Restaura inputs
    if (state.inputs) {
      const inputs = element.querySelectorAll('input, select, textarea');
      inputs.forEach((input: any) => {
        if (input.id || input.name) {
          const key = input.id || input.name;
          const value = state.inputs[key];

          if (value !== undefined) {
            if (input.type === 'checkbox' || input.type === 'radio') {
              input.checked = value;
            } else {
              input.value = value;
            }
          }
        }
      });
    }

    // Restaura scroll position
    if (state.scroll) {
      element.scrollTop = state.scroll.top || 0;
      element.scrollLeft = state.scroll.left || 0;
    }
  }

  /**
   * Recarrega tema
   */
  public async reloadTheme(themeId: string): Promise<void> {
    console.log(`🔄 Reloading theme: ${themeId}`);

    const startTime = Date.now();

    try {
      // Recarrega tema via ThemeManager (simplificado)
      const themeManager = (window as any).themeManager;
      if (themeManager) {
        await themeManager.loadTheme(themeId as any);
      }

      const duration = Date.now() - startTime;
      console.log(`✅ Theme reloaded: ${themeId} (${duration}ms)`);

    } catch (error) {
      console.error(`❌ Failed to reload theme: ${themeId}`, error);
      throw error;
    }
  }

  /**
   * Recarrega CSS
   */
  public async reloadCSS(cssPath: string): Promise<void> {
    console.log(`🔄 Reloading CSS: ${cssPath}`);

    try {
      const links = document.querySelectorAll(`link[href*="${cssPath}"]`);

      links.forEach((link: any) => {
        const href = link.href;
        link.href = href + '?t=' + Date.now();
      });

      console.log(`✅ CSS reloaded: ${cssPath}`);

    } catch (error) {
      console.error(`❌ Failed to reload CSS: ${cssPath}`, error);
      throw error;
    }
  }

  /**
   * Atualiza variável CSS
   */
  public updateCSSVariable(variable: string, value: string): void {
    document.documentElement.style.setProperty(variable, value);
    console.log(`🎨 CSS variable updated: ${variable} = ${value}`);
  }

  /**
   * Recarrega todos os panels
   */
  public async reloadAll(): Promise<void> {
    console.log(`🔄 Reloading all panels (${this.panelRegistry.size})...`);

    const promises = Array.from(this.panelRegistry.keys()).map((panelId) =>
      this.reloadPanel(panelId)
    );

    await Promise.all(promises);

    console.log(`✅ All panels reloaded`);
  }

  /**
   * Remove registro de panel
   */
  public unregisterPanel(panelId: string): void {
    this.panelRegistry.delete(panelId);
    console.log(`🗑️ Unregistered panel: ${panelId}`);
  }

  /**
   * Limpa registro
   */
  public clear(): void {
    this.panelRegistry.clear();
    console.log('🧹 Panel registry cleared');
  }

  /**
   * Obtém estatísticas
   */
  public getStats(): { registeredPanels: number; panels: string[] } {
    return {
      registeredPanels: this.panelRegistry.size,
      panels: Array.from(this.panelRegistry.keys())
    };
  }

  /**
   * Imprime estatísticas
   */
  public printStats(): void {
    const stats = this.getStats();
    console.log('📊 UI Reloader Stats:');
    console.log(`   Registered Panels: ${stats.registeredPanels}`);

    if (stats.panels.length > 0) {
      console.log('   Panels:', stats.panels);
    }
  }
}

// Types
interface PanelEntry {
  element: HTMLElement;
  originalHTML: string;
  state: any;
}
