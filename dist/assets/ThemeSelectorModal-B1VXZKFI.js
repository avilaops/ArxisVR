import{b as h,e as s,E as l}from"./index-CqlxQ_W-.js";class m{manager;container;themeButtons=new Map;constructor(e){this.manager=h.getInstance();const t=document.getElementById(e);if(!t)throw new Error(`Container ${e} not found`);this.container=t,this.init()}init(){this.container.innerHTML="",this.container.className="theme-selector",this.applyStyles(),this.renderThemes(),console.log("✅ ThemeSelector initialized")}applyStyles(){const e=document.createElement("style");e.textContent=`
      .theme-selector {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        padding: 16px;
        background: var(--theme-backgroundSecondary, #1e1e1e);
        border-radius: 8px;
      }
      
      .theme-button {
        padding: 12px 24px;
        border: 2px solid transparent;
        border-radius: 6px;
        cursor: pointer;
        font-weight: bold;
        font-size: 14px;
        transition: all 0.2s ease;
        position: relative;
        overflow: hidden;
      }
      
      .theme-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }
      
      .theme-button.active {
        border-color: var(--theme-accent, #00ff88);
        box-shadow: 0 0 12px var(--theme-accent, #00ff88);
      }
      
      .theme-button::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        opacity: 0.6;
      }
      
      .theme-preview {
        display: flex;
        gap: 4px;
        margin-top: 8px;
      }
      
      .theme-preview-color {
        width: 20px;
        height: 20px;
        border-radius: 4px;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
    `,document.getElementById("theme-selector-styles")||(e.id="theme-selector-styles",document.head.appendChild(e))}renderThemes(){const e=this.manager.getAvailableThemes(),t=this.manager.getCurrentTheme();this.themeButtons.clear(),e.forEach(o=>{const a=this.createThemeButton(o,o.id===t?.id);this.container.appendChild(a),this.themeButtons.set(o.id,a)})}createThemeButton(e,t){const o=document.createElement("button");o.className=`theme-button ${t?"active":""}`,o.style.backgroundColor=e.colors.primary,o.style.color=e.colors.foreground;const a=document.createElement("div");if(a.textContent=e.name,o.appendChild(a),e.description){const n=this.createColorPreview(e);o.appendChild(n)}return o.onclick=()=>this.selectTheme(e.id),o}createColorPreview(e){const t=document.createElement("div");return t.className="theme-preview",[e.colors.primary,e.colors.secondary,e.colors.accent,e.colors.success].forEach(a=>{const n=document.createElement("div");n.className="theme-preview-color",n.style.backgroundColor=a,t.appendChild(n)}),t}selectTheme(e){this.manager.applyTheme(e),this.themeButtons.forEach((t,o)=>{o===e?t.classList.add("active"):t.classList.remove("active")})}refresh(){this.renderThemes()}show(){this.container.style.display="flex"}hide(){this.container.style.display="none"}toggle(){this.container.style.display==="none"?this.show():this.hide()}dispose(){this.container.innerHTML="",this.themeButtons.clear()}}class p{modal=null;selector=null;isVisible=!1;constructor(){this.init()}init(){this.applyStyles()}applyStyles(){const e=document.createElement("style");e.textContent=`
      .theme-modal-overlay {
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
      
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      
      .theme-modal-container {
        background: var(--theme-background, #141414);
        border: 2px solid var(--theme-primary, #667eea);
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow: hidden;
        animation: slideIn 0.3s ease;
      }
      
      @keyframes slideIn {
        from {
          transform: translateY(-50px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
      
      .theme-modal-header {
        padding: 20px;
        background: var(--theme-primary, #667eea);
        color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .theme-modal-title {
        font-size: 18px;
        font-weight: bold;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      .theme-modal-close {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
      }
      
      .theme-modal-close:hover {
        background: rgba(255, 0, 0, 0.6);
        transform: scale(1.1);
      }
      
      .theme-modal-body {
        padding: 20px;
        max-height: calc(80vh - 100px);
        overflow-y: auto;
      }
      
      .theme-modal-footer {
        padding: 16px 20px;
        background: var(--theme-backgroundSecondary, #1e1e1e);
        border-top: 1px solid var(--theme-border, #333);
        display: flex;
        justify-content: flex-end;
        gap: 12px;
      }
      
      .theme-modal-btn {
        padding: 10px 20px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: bold;
        transition: all 0.2s;
      }
      
      .theme-modal-btn-primary {
        background: var(--theme-primary, #667eea);
        color: white;
      }
      
      .theme-modal-btn-primary:hover {
        background: var(--theme-accent, #00ff88);
        color: black;
        transform: translateY(-2px);
      }
      
      .theme-modal-btn-secondary {
        background: rgba(255, 255, 255, 0.1);
        color: var(--theme-foreground, #fff);
      }
      
      .theme-modal-btn-secondary:hover {
        background: rgba(255, 255, 255, 0.2);
      }
    `,document.getElementById("theme-modal-styles")||(e.id="theme-modal-styles",document.head.appendChild(e))}show(){if(this.isVisible)return;const e=document.createElement("div");e.className="theme-modal-overlay";const t=document.createElement("div");t.className="theme-modal-container";const o=document.createElement("div");o.className="theme-modal-header",o.innerHTML=`
      <div class="theme-modal-title">
        <span>🎨</span>
        <span>Select Theme</span>
      </div>
      <button class="theme-modal-close">×</button>
    `;const a=document.createElement("div");a.className="theme-modal-body";const n=document.createElement("div");n.id="theme-selector-modal-content",a.appendChild(n);const r=document.createElement("div");r.className="theme-modal-footer",r.innerHTML=`
      <button class="theme-modal-btn theme-modal-btn-secondary" data-action="close">
        Cancel
      </button>
      <button class="theme-modal-btn theme-modal-btn-primary" data-action="apply">
        Apply Theme
      </button>
    `,t.appendChild(o),t.appendChild(a),t.appendChild(r),e.appendChild(t),o.querySelector(".theme-modal-close")?.addEventListener("click",()=>this.hide()),r.querySelector('[data-action="close"]')?.addEventListener("click",()=>this.hide()),r.querySelector('[data-action="apply"]')?.addEventListener("click",()=>this.hide()),e.addEventListener("click",c=>{c.target===e&&this.hide()}),document.body.appendChild(e),this.modal=e,this.selector=new m("theme-selector-modal-content"),this.selector.show(),this.isVisible=!0,document.addEventListener("keydown",this.handleEscape),s.emit(l.UI_MODAL_OPEN,{modalId:"theme-selector"})}hide(){this.isVisible&&(this.selector&&(this.selector.dispose(),this.selector=null),this.modal&&(this.modal.remove(),this.modal=null),this.isVisible=!1,document.removeEventListener("keydown",this.handleEscape),s.emit(l.UI_MODAL_CLOSE,{modalId:"theme-selector"}))}toggle(){this.isVisible?this.hide():this.show()}handleEscape=e=>{e.key==="Escape"&&this.hide()};get visible(){return this.isVisible}dispose(){this.hide()}}let i=null;function b(){return i||(i=new p),i}export{p as ThemeSelectorModal,b as getThemeSelectorModal};
