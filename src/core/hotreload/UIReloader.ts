import { themeManager } from '../theme';
import { eventBus, EventType } from '../EventBus';

/**
 * UIReloader - Hot-reload de UI panels e temas
 * Recarrega elementos de interface sem perder estado
 * 
 * Features:
 * - Mantém estado de inputs e forms
 * - Recarrega temas em tempo real
 * - Atualiza CSS sem refresh
 * - Preserva event listeners
 */
export class UIReloader {
  private panelRegistry: Map<string, {
    element: HTMLElement;
    originalHTML: string;
    state: any;
  }> = new Map();
  
  constructor() {
    console.log('🎨 UI Reloader initialized');
  }
  
  /**
   * Registra painel para hot-reload
   */
  public registerPanel(panelId: string, element: HTMLElement): void {
    this.panelRegistry.set(panelId, {
      element,
      originalHTML: element.innerHTML,
      state: this.captureState(element)
    });
    
    console.log(`📝 Registered panel: ${panelId}`);
  }
  
  /**
   * Recarrega painel mantendo estado
   */
  public async reloadPanel(panelId: string, newHTML?: string): Promise<void> {
    const entry = this.panelRegistry.get(panelId);
    if (!entry) {
      console.warn(`⚠️ Panel not registered: ${panelId}`);
      return;
    }
    
    console.log(`🔄 Reloading panel: ${panelId}`);
    
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
      },
      dimensions: {
        width: element.offsetWidth,
        height: element.offsetHeight
      },
      classes: Array.from(element.classList),
      visibility: {
        visible: element.style.display !== 'none',
        opacity: element.style.opacity || '1'
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
    
    // Captura componentes customizados
    this.captureCustomComponents(element, state);
    
    return state;
  }
  
  /**
   * Captura estado de componentes customizados
   */
  private captureCustomComponents(element: HTMLElement, state: any): void {
    state.customComponents = {};
    
    // Busca elementos com atributo data-component-state
    const customElements = element.querySelectorAll('[data-component-state]');
    customElements.forEach((el: Element) => {
      const componentId = el.id || el.getAttribute('data-component-id');
      if (componentId) {
        try {
          const stateData = el.getAttribute('data-component-state');
          if (stateData) {
            state.customComponents[componentId] = JSON.parse(stateData);
          }
        } catch (error) {
          console.warn(`Failed to parse component state for ${componentId}`, error);
        }
      }
    });
    
    // Captura estado de elementos expansíveis
    const expandables = element.querySelectorAll('[data-expanded]');
    state.expandedElements = Array.from(expandables).map((el: Element) => ({
      id: el.id,
      expanded: el.getAttribute('data-expanded') === 'true'
    }));
    
    // Captura tabs ativos
    const activeTabs = element.querySelectorAll('[data-tab].active, [data-tab][aria-selected="true"]');
    state.activeTabs = Array.from(activeTabs).map((tab: Element) => tab.getAttribute('data-tab'));
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
    
    // Restaura scroll
    if (state.scroll) {
      element.scrollTop = state.scroll.top || 0;
      element.scrollLeft = state.scroll.left || 0;
    }
    
    // Restaura classes
    if (state.classes && Array.isArray(state.classes)) {
      // Remove classes antigas que não estavam no estado capturado
      const currentClasses = Array.from(element.classList);
      currentClasses.forEach(cls => {
        if (!state.classes.includes(cls)) {
          element.classList.remove(cls);
        }
      });
      
      // Adiciona classes do estado
      state.classes.forEach((cls: string) => {
        if (!element.classList.contains(cls)) {
          element.classList.add(cls);
        }
      });
    }
    
    // Restaura visibilidade
    if (state.visibility) {
      if (!state.visibility.visible) {
        element.style.display = 'none';
      }
      if (state.visibility.opacity) {
        element.style.opacity = state.visibility.opacity;
      }
    }
    
    // Restaura componentes customizados
    if (state.customComponents) {
      Object.entries(state.customComponents).forEach(([componentId, componentState]) => {
        const component = element.querySelector(`#${componentId}, [data-component-id="${componentId}"]`);
        if (component) {
          component.setAttribute('data-component-state', JSON.stringify(componentState));
        }
      });
    }
    
    // Restaura elementos expansíveis
    if (state.expandedElements && Array.isArray(state.expandedElements)) {
      state.expandedElements.forEach((item: any) => {
        const expandable = element.querySelector(`#${item.id}`);
        if (expandable) {
          expandable.setAttribute('data-expanded', String(item.expanded));
          if (item.expanded) {
            expandable.classList.add('expanded');
          } else {
            expandable.classList.remove('expanded');
          }
        }
      });
    }
    
    // Restaura tabs ativos
    if (state.activeTabs && Array.isArray(state.activeTabs)) {
      state.activeTabs.forEach((tabName: string) => {
        const tab = element.querySelector(`[data-tab="${tabName}"]`);
        if (tab) {
          tab.classList.add('active');
          tab.setAttribute('aria-selected', 'true');
        }
      });
    }
  }
        
        if (value !== undefined) {
          if (input.type === 'checkbox' || input.type === 'radio') {
            input.checked = value;
          } else {
            input.value = value;
          }
        }
      }
    });
    
    // Restaura scroll position
    if (state._scrollTop !== undefined) {
      element.scrollTop = state._scrollTop;
    }
    if (state._scrollLeft !== undefined) {
      element.scrollLeft = state._scrollLeft;
    }
  }
  
  /**
   * Recarrega tema
   */
  public async reloadTheme(themeId: string): Promise<void> {
    console.log(`🔄 Reloading theme: ${themeId}`);
    
    const startTime = Date.now();
    
    try {
      // Recarrega tema via ThemeManager
      await themeManager.loadTheme(themeId as any);
      
      const duration = Date.now() - startTime;
      
      console.log(`✅ Theme reloaded: ${themeId} (${duration}ms)`);
      
    } catch (error) {
      console.error(`❌ Failed to reload theme: ${themeId}`, error);
      throw error;
    }
  }
  
  /**
   * Recarrega CSS em tempo real
   */
  public async reloadCSS(cssPath: string): Promise<void> {
    console.log(`🔄 Reloading CSS: ${cssPath}`);
    
    try {
      // Encontra link do CSS
      const links = document.querySelectorAll(`link[href*="${cssPath}"]`);
      
      links.forEach((link: any) => {
        const newLink = link.cloneNode();
        newLink.href = `${cssPath}?t=${Date.now()}`;
        
        newLink.onload = () => {
          link.remove();
          console.log(`✅ CSS reloaded: ${cssPath}`);
        };
        
        link.parentNode.insertBefore(newLink, link.nextSibling);
      });
      
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
   * Recarrega todas as panels registradas
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
   * Remove painel do registro
   */
  public unregisterPanel(panelId: string): void {
    this.panelRegistry.delete(panelId);
    console.log(`🗑️ Unregistered panel: ${panelId}`);
  }
  
  /**
   * Limpa todos os registros
   */
  public clear(): void {
    this.panelRegistry.clear();
    console.log('🧹 Panel registry cleared');
  }
  
  /**
   * Retorna estatísticas
   */
  public getStats(): {
    registeredPanels: number;
    panels: string[];
  } {
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
      console.log('   Panels:', stats.panels.join(', '));
    }
  }
}
