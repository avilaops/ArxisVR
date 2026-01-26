import{e as i,E as d,a as c,c as m,C as p}from"./index-BVa4CFf7.js";class u{modal=null;isVisible=!1;constructor(){this.init()}init(){this.applyStyles(),this.listenEvents()}listenEvents(){i.on(d.UI_MODAL_OPEN,e=>{e.modal==="network-connect"&&this.open()})}applyStyles(){const e=document.createElement("style");e.textContent=`
      .network-modal-overlay {
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
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      .network-modal-container {
        background: var(--theme-background, #141414);
        border: 2px solid var(--theme-primary, #667eea);
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        max-width: 500px;
        width: 90%;
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
      
      .network-modal-header {
        padding: 20px;
        background: linear-gradient(135deg, #44ff44, #00cc00);
        color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .network-modal-title {
        font-size: 18px;
        font-weight: bold;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      .network-modal-close {
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
      
      .network-modal-close:hover {
        background: rgba(255, 0, 0, 0.6);
        transform: scale(1.1);
      }
      
      .network-modal-body {
        padding: 24px;
      }
      
      .network-form-group {
        margin-bottom: 20px;
      }
      
      .network-form-label {
        display: block;
        color: var(--theme-text, #fff);
        font-weight: bold;
        margin-bottom: 8px;
        font-size: 14px;
      }
      
      .network-form-input {
        width: 100%;
        padding: 12px;
        background: var(--theme-backgroundSecondary, #1e1e1e);
        border: 2px solid var(--theme-border, #333);
        border-radius: 6px;
        color: var(--theme-text, #fff);
        font-size: 14px;
        transition: all 0.2s;
      }
      
      .network-form-input:focus {
        outline: none;
        border-color: var(--theme-accent, #00ff88);
        box-shadow: 0 0 10px var(--theme-accent, #00ff88);
      }
      
      .network-form-hint {
        font-size: 12px;
        color: var(--theme-textSecondary, #999);
        margin-top: 4px;
      }
      
      .network-modal-footer {
        padding: 16px 24px;
        background: var(--theme-backgroundSecondary, #1e1e1e);
        border-top: 1px solid var(--theme-border, #333);
        display: flex;
        justify-content: flex-end;
        gap: 12px;
      }
      
      .network-modal-btn {
        padding: 10px 20px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: bold;
        transition: all 0.2s;
      }
      
      .network-modal-btn-secondary {
        background: var(--theme-backgroundSecondary, #1e1e1e);
        border: 2px solid var(--theme-border, #333);
        color: var(--theme-text, #fff);
      }
      
      .network-modal-btn-secondary:hover {
        background: var(--theme-border, #333);
      }
      
      .network-modal-btn-primary {
        background: linear-gradient(135deg, #44ff44, #00cc00);
        color: white;
      }
      
      .network-modal-btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(68, 255, 68, 0.4);
      }
      
      .network-modal-btn-primary:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
      }
      
      .network-status {
        padding: 12px;
        background: rgba(68, 255, 68, 0.1);
        border: 1px solid rgba(68, 255, 68, 0.3);
        border-radius: 6px;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 10px;
        color: var(--theme-text, #fff);
        font-size: 14px;
      }
      
      .network-status.error {
        background: rgba(255, 68, 68, 0.1);
        border-color: rgba(255, 68, 68, 0.3);
      }
    `,document.getElementById("network-modal-styles")||(e.id="network-modal-styles",document.head.appendChild(e))}open(){this.isVisible||(this.render(),this.isVisible=!0)}close(){this.isVisible&&(this.modal&&this.modal.parentElement&&this.modal.parentElement.removeChild(this.modal),this.modal=null,this.isVisible=!1)}render(){const e=c.networkState,n="ws://localhost:3000",t="Player_"+Math.floor(Math.random()*1e3);this.modal=document.createElement("div"),this.modal.className="network-modal-overlay",this.modal.innerHTML=`
      <div class="network-modal-container">
        <div class="network-modal-header">
          <div class="network-modal-title">
            🌐 Connect Multiplayer
          </div>
          <button class="network-modal-close" data-action="close">✕</button>
        </div>
        
        <div class="network-modal-body">
          ${e.status==="error"?`
            <div class="network-status error">
              ⚠️ ${e.errorMessage||"Connection failed"}
            </div>
          `:""}
          
          <div class="network-form-group">
            <label class="network-form-label">Server URL</label>
            <input 
              type="text" 
              class="network-form-input" 
              id="network-server-url" 
              value="${n}"
              placeholder="ws://localhost:3000"
            />
            <div class="network-form-hint">WebSocket URL (ws:// or wss://)</div>
          </div>
          
          <div class="network-form-group">
            <label class="network-form-label">Player Name</label>
            <input 
              type="text" 
              class="network-form-input" 
              id="network-player-name" 
              value="${t}"
              placeholder="Your name"
              maxlength="20"
            />
            <div class="network-form-hint">Your display name (max 20 characters)</div>
          </div>
        </div>
        
        <div class="network-modal-footer">
          <button class="network-modal-btn network-modal-btn-secondary" data-action="close">
            Cancel
          </button>
          <button class="network-modal-btn network-modal-btn-primary" data-action="connect">
            🌐 Connect
          </button>
        </div>
      </div>
    `,document.body.appendChild(this.modal),this.modal.querySelector('[data-action="close"]')?.addEventListener("click",()=>{this.close()}),this.modal.querySelector('[data-action="connect"]')?.addEventListener("click",()=>{this.handleConnect()});const r=o=>{o.key==="Escape"&&(this.close(),document.removeEventListener("keydown",r))};document.addEventListener("keydown",r),this.modal.querySelectorAll(".network-form-input").forEach(o=>{o.addEventListener("keydown",l=>{l.key==="Enter"&&this.handleConnect()})}),this.modal.addEventListener("click",o=>{o.target===this.modal&&this.close()}),setTimeout(()=>{this.modal?.querySelector("#network-server-url")?.focus()},100)}async handleConnect(){const e=document.getElementById("network-server-url"),n=document.getElementById("network-player-name");if(!e||!n)return;const t=e.value.trim(),r=n.value.trim();if(!t||!r){alert("Please fill all fields");return}if(!t.startsWith("ws://")&&!t.startsWith("wss://")){alert("Server URL must start with ws:// or wss://");return}this.close();try{await m.execute(p.NET_CONNECT,{serverUrl:t,playerName:r})}catch(s){console.error("Failed to connect:",s),setTimeout(()=>this.open(),500)}}get visible(){return this.isVisible}}let a=null;function b(){return a||(a=new u),a}export{u as NetworkConnectModal,b as getNetworkConnectModal};
