class s{modal=null;isVisible=!1;constructor(){this.init()}init(){this.applyStyles()}applyStyles(){const e=document.createElement("style");e.textContent=`
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
    `,document.getElementById("about-modal-styles")||(e.id="about-modal-styles",document.head.appendChild(e))}open(){this.isVisible||(this.render(),this.isVisible=!0)}close(){this.isVisible&&(this.modal?.parentElement&&this.modal.parentElement.removeChild(this.modal),this.modal=null,this.isVisible=!1)}render(){const e=document.createElement("canvas").getContext("webgl2")||document.createElement("canvas").getContext("webgl"),t=e?.getExtension("WEBGL_debug_renderer_info"),d=t?e?.getParameter(t.UNMASKED_RENDERER_WEBGL):"Unknown",r=t?e?.getParameter(t.UNMASKED_VENDOR_WEBGL):"Unknown";this.modal=document.createElement("div"),this.modal.className="about-modal-overlay",this.modal.innerHTML=`
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
            <div class="about-value">${d}</div>
          </div>
          
          <div class="about-section">
            <div class="about-label">Vendor</div>
            <div class="about-value">${r}</div>
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
    `,document.body.appendChild(this.modal),this.modal.querySelector('[data-action="close"]')?.addEventListener("click",()=>this.close()),this.modal.querySelector('[data-action="github"]')?.addEventListener("click",()=>{window.open("https://github.com/avilaops/ArxisVR","_blank")});const i=a=>{a.key==="Escape"&&(this.close(),document.removeEventListener("keydown",i))};document.addEventListener("keydown",i),this.modal.addEventListener("click",a=>{a.target===this.modal&&this.close()})}getCommitSHA(){return"d3844ce"}}let o=null;function l(){return o||(o=new s),o}export{s as AboutModal,l as getAboutModal};
