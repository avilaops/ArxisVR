/**
 * SettingsPanel - Configurações gerais
 */

export class SettingsPanel {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.render();
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="panel settings-panel">
        <div class="panel__section">
          <h3 class="panel__section-title">Appearance</h3>
          <label class="settings-item">
            <span>Theme</span>
            <select class="input">
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </label>
        </div>

        <div class="panel__section">
          <h3 class="panel__section-title">Performance</h3>
          <label class="settings-item">
            <span>Quality</span>
            <select class="input">
              <option value="ultra">Ultra</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>
        </div>
      </div>
    `;
  }

  public destroy(): void {
    // Cleanup
  }
}
