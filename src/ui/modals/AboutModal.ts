import { eventBus, EventType } from '../../core';

/**
 * AboutModal - Modal "Sobre" com informações do app
 */
export class AboutModal {
  private modal: HTMLElement | null = null;
  private isVisible: boolean = false;

  constructor() {
    this.init();
  }

  private init(): void {
    this.applyStyles();
  }

  private applyStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      .about-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.2s ease;
      }
      
      .about-modal-container {
        background: var(--theme-background, #141414);
        border: 2px solid var(--theme-primary, #667eea);
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        max-width: 500px;
        width: 90%;
        animation: slideIn 0.3s ease;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideIn {
        from { transform: translateY(-50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      
      .about-modal-header {
        padding: 24px;
        background: linear-gradient(135deg, var(--theme-primary, #667eea), var(--theme-accent, #00ff88));
        text-align: center;
      }
      
      .about-logo {
        font-size: 48px;
        margin-bottom: 12px;
      }
      
      .about-title {
        font-size: 24px;
        font-weight: bold;
        color: white;
        margin-bottom: 4px;
      }
      
      .about-subtitle {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.8);
      }
      
      .about-modal-body {
        padding: 24px;
      }
      
      .about-section {
        margin-bottom: 20px;
      }
      
      .about-label {
        font-size: 12px;
        font-weight: bold;
        color: var(--theme-textSecondary, #999);
        text-transform: uppercase;
        margin-bottom: 4px;
      }
      
      .about-value {
        font-size: 14px;
        color: var(--theme-text, #fff);
        font-family: 'Courier New', monospace;
        background: var(--theme-backgroundSecondary, #1e1e1e);
        padding: 8px 12px;
        border-radius: 4px;
        word-break: break-all;
      }
      
      .about-features {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
        margin-top: 16px;
      }
      
      .about-feature {
        background: var(--theme-backgroundSecondary, #1e1e1e);
        padding: 12px;
        border-radius: 6px;
        text-align: center;
      }
      
      .about-feature-icon {
        font-size: 24px;
        margin-bottom: 4px;
      }
      
      .about-feature-label {
        font-size: 12px;
        color: var(--theme-text, #fff);
      }
      
      .about-modal-footer {
        padding: 16px 24px;
        background: var(--theme-backgroundSecondary, #1e1e1e);
        border-top: 1px solid var(--theme-border, #333);
        display: flex;
        justify-content: center;
        gap: 12px;
      }
      
      .about-modal-btn {
        padding: 10px 20px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: bold;
        transition: all 0.2s;
      }
      
      .about-modal-btn-primary {
        background: var(--theme-primary, #667eea);
        color: white;
      }
      
      .about-modal-btn-primary:hover {
        background: var(--theme-accent, #00ff88);
        color: black;
        transform: translateY(-2px);
      }
      
      .about-modal-btn-secondary {
        background: transparent;
        border: 2px solid var(--theme-border, #333);
        color: var(--theme-text, #fff);
      }
      
      .about-modal-btn-secondary:hover {
        background: var(--theme-border, #333);
      }
    `;
    
    if (!document.getElementById('about-modal-styles')) {
      style.id = 'about-modal-styles';
      document.head.appendChild(style);
    }
  }

  public open(): void {
    if (this.isVisible) return;
    this.render();
    this.isVisible = true;
  }

  public close(): void {
    if (!this.isVisible) return;
    if (this.modal?.parentElement) {
      this.modal.parentElement.removeChild(this.modal);
    }
    this.modal = null;
    this.isVisible = false;
  }

  private render(): void {
    // Get system info
    const gl = document.createElement('canvas').getContext('webgl2') || 
               document.createElement('canvas').getContext('webgl');
    const debugInfo = gl?.getExtension('WEBGL_debug_renderer_info');
    const renderer = debugInfo ? gl?.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown';
    const vendor = debugInfo ? gl?.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'Unknown';

    this.modal = document.createElement('div');
    this.modal.className = 'about-modal-overlay';

    this.modal.innerHTML = `
      <div class="about-modal-container">
        <div class="about-modal-header">
          <div class="about-logo">🏗️</div>
          <div class="about-title">ArxisVR</div>
          <div class="about-subtitle">Professional BIM Viewer + VR Editor</div>
        </div>
        
        <div class="about-modal-body">
          <div class="about-section">
            <div class="about-label">Version</div>
            <div class="about-value">1.0.0-beta (Build ${this.getCommitSHA()})</div>
          </div>
          
          <div class="about-section">
            <div class="about-label">Renderer</div>
            <div class="about-value">${renderer}</div>
          </div>
          
          <div class="about-section">
            <div class="about-label">Vendor</div>
            <div class="about-value">${vendor}</div>
          </div>
          
          <div class="about-features">
            <div class="about-feature">
              <div class="about-feature-icon">📦</div>
              <div class="about-feature-label">IFC Support</div>
            </div>
            <div class="about-feature">
              <div class="about-feature-icon">🥽</div>
              <div class="about-feature-label">WebXR VR</div>
            </div>
            <div class="about-feature">
              <div class="about-feature-icon">🌐</div>
              <div class="about-feature-label">Multiplayer</div>
            </div>
            <div class="about-feature">
              <div class="about-feature-icon">🎨</div>
              <div class="about-feature-label">6 Themes</div>
            </div>
          </div>
          
          <div class="about-section" style="margin-top: 20px; text-align: center;">
            <div class="about-subtitle">© 2024 ArxisVR Team</div>
            <div class="about-subtitle">Licensed under MIT</div>
          </div>
        </div>
        
        <div class="about-modal-footer">
          <button class="about-modal-btn about-modal-btn-secondary" data-action="github">
            <span style="margin-right: 6px;">🐙</span> GitHub
          </button>
          <button class="about-modal-btn about-modal-btn-primary" data-action="close">
            Close
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(this.modal);

    // Event listeners
    this.modal.querySelector('[data-action="close"]')?.addEventListener('click', () => this.close());
    
    this.modal.querySelector('[data-action="github"]')?.addEventListener('click', () => {
      window.open('https://github.com/avilaops/ArxisVR', '_blank');
    });

    // ESC fecha
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.close();
        document.removeEventListener('keydown', handleKeyDown);
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    // Clica fora fecha
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });
  }

  private getCommitSHA(): string {
    // Em produção, isso vem do CI/CD via env var
    return import.meta.env.VITE_COMMIT_SHA || 'd3844ce';
  }
}

// Singleton
let aboutModal: AboutModal | null = null;

export function getAboutModal(): AboutModal {
  if (!aboutModal) {
    aboutModal = new AboutModal();
  }
  return aboutModal;
}
