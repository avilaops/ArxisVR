import{e as n,E as l,a as d,R as t,c as r,C as c}from"./index-CbM4LVOM.js";class m{modal=null;isVisible=!1;constructor(){this.init()}init(){this.applyStyles(),this.listenEvents()}listenEvents(){n.on(l.UI_SETTINGS_OPEN,()=>{this.open()})}applyStyles(){const e=document.createElement("style");e.textContent=`
      .settings-modal-overlay {
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
      
      .settings-modal-container {
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
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideIn {
        from { transform: translateY(-50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      
      .settings-modal-header {
        padding: 20px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .settings-modal-title {
        font-size: 18px;
        font-weight: bold;
      }
      
      .settings-modal-close {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 20px;
        transition: all 0.2s;
      }
      
      .settings-modal-close:hover {
        background: rgba(255, 0, 0, 0.6);
      }
      
      .settings-modal-body {
        padding: 24px;
        max-height: calc(80vh - 140px);
        overflow-y: auto;
      }
      
      .settings-section {
        margin-bottom: 20px;
      }
      
      .settings-label {
        display: block;
        color: var(--theme-text, #fff);
        font-weight: bold;
        margin-bottom: 8px;
      }
      
      .settings-select {
        width: 100%;
        padding: 10px;
        background: var(--theme-backgroundSecondary, #1e1e1e);
        border: 2px solid var(--theme-border, #333);
        border-radius: 6px;
        color: var(--theme-text, #fff);
      }
      
      .settings-modal-footer {
        padding: 16px 24px;
        background: var(--theme-backgroundSecondary, #1e1e1e);
        border-top: 1px solid var(--theme-border, #333);
        display: flex;
        justify-content: flex-end;
        gap: 12px;
      }
      
      .settings-modal-btn {
        padding: 10px 20px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: bold;
      }
      
      .settings-modal-btn-primary {
        background: var(--theme-primary, #667eea);
        color: white;
      }
    `,document.getElementById("settings-modal-styles")||(e.id="settings-modal-styles",document.head.appendChild(e))}open(){this.isVisible||(this.render(),this.isVisible=!0)}close(){this.isVisible&&(this.modal?.parentElement&&this.modal.parentElement.removeChild(this.modal),this.modal=null,this.isVisible=!1)}render(){const e=d.graphicsSettings.quality;this.modal=document.createElement("div"),this.modal.className="settings-modal-overlay",this.modal.innerHTML=`
      <div class="settings-modal-container">
        <div class="settings-modal-header">
          <div class="settings-modal-title">⚙️ Settings</div>
          <button class="settings-modal-close" data-action="close">✕</button>
        </div>
        <div class="settings-modal-body">
          <div class="settings-section">
            <label class="settings-label">Render Quality</label>
            <select class="settings-select" id="quality-select">
              <option value="${t.LOW}" ${e===t.LOW?"selected":""}>Low (Performance)</option>
              <option value="${t.MEDIUM}" ${e===t.MEDIUM?"selected":""}>Medium</option>
              <option value="${t.HIGH}" ${e===t.HIGH?"selected":""}>High</option>
              <option value="${t.ULTRA}" ${e===t.ULTRA?"selected":""}>Ultra (Quality)</option>
            </select>
          </div>
        </div>
        <div class="settings-modal-footer">
          <button class="settings-modal-btn settings-modal-btn-primary" data-action="save">
            💾 Save
          </button>
        </div>
      </div>
    `,document.body.appendChild(this.modal),this.modal.querySelector('[data-action="close"]')?.addEventListener("click",()=>this.close()),this.modal.querySelector('[data-action="save"]')?.addEventListener("click",()=>{const a=document.getElementById("quality-select").value;r.execute(c.VIEW_SET_RENDER_QUALITY,{quality:a}),console.log("✅ Settings saved"),this.close()}),this.modal.addEventListener("click",s=>{s.target===this.modal&&this.close()});const o=s=>{s.key==="Escape"&&(this.close(),document.removeEventListener("keydown",o))};document.addEventListener("keydown",o)}}let i=null;function h(){return i||(i=new m),i}export{m as SettingsModal,h as getSettingsModal};
