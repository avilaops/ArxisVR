import{C as u}from"./Card-DLSvBshn.js";import{B as l}from"./Button-BvNVdej2.js";import{T as x}from"./Toggle-D3VS2hV5.js";class v{card;providers=[];files=[];autoSync=!0;constructor(){this.card=new u({title:"☁️ Armazenamento na Nuvem",variant:"glass"}),this.loadProviders(),this.loadFiles(),this.render()}loadProviders(){this.providers=[{id:"onedrive",name:"OneDrive",icon:"📘",isConnected:!0,email:"usuario@empresa.com",usedSpace:450*1024*1024*1024,totalSpace:1024*1024*1024*1024,lastSync:Date.now()-3e5},{id:"gdrive",name:"Google Drive",icon:"📗",isConnected:!0,email:"usuario@gmail.com",usedSpace:89*1024*1024*1024,totalSpace:200*1024*1024*1024,lastSync:Date.now()-6e5},{id:"dropbox",name:"Dropbox",icon:"📦",isConnected:!1,usedSpace:0,totalSpace:0}]}loadFiles(){const e=Date.now();this.files=[{id:"cf-1",name:"Projeto_Estrutural_Rev08.ifc",path:"/OneDrive/Projetos/",size:145678901,modifiedAt:e-36e5,syncStatus:"synced",provider:"onedrive"},{id:"cf-2",name:"Arquitetura_Executivo.rvt",path:"/GoogleDrive/BIM/",size:234567890,modifiedAt:e-72e5,syncStatus:"syncing",provider:"gdrive"},{id:"cf-3",name:"Plantas_Hidrosanitario.dwg",path:"/OneDrive/Projetos/",size:12345678,modifiedAt:e-864e5,syncStatus:"pending",provider:"onedrive"}]}render(){const e=this.card.getBody();e.innerHTML="";const t=document.createElement("div");t.className="arxis-cloud__sync-control";const c=new x({label:"🔄 Sincronização Automática",checked:this.autoSync,onChange:r=>{this.autoSync=r,r&&this.syncAll()}});t.appendChild(c.getElement()),e.appendChild(t);const n=document.createElement("div");n.className="arxis-cloud__section";const a=document.createElement("h3");a.className="arxis-cloud__title",a.textContent="🔗 Serviços Conectados",n.appendChild(a),this.providers.forEach(r=>{const m=this.createProviderItem(r);n.appendChild(m)}),e.appendChild(n);const o=document.createElement("div");o.className="arxis-cloud__section";const i=document.createElement("div");i.className="arxis-cloud__files-header";const s=document.createElement("h3");s.className="arxis-cloud__title",s.textContent="📁 Arquivos na Nuvem",i.appendChild(s);const d=new l({text:"🔄 Sincronizar",variant:"primary",size:"sm"});d.getElement().addEventListener("click",()=>this.syncAll()),i.appendChild(d.getElement()),o.appendChild(i);const p=document.createElement("div");p.className="arxis-cloud__files",this.files.forEach(r=>{const m=this.createFileItem(r);p.appendChild(m)}),o.appendChild(p),e.appendChild(o),this.injectStyles()}createProviderItem(e){const t=document.createElement("div");t.className=`arxis-cloud__provider ${e.isConnected?"arxis-cloud__provider--connected":""}`;const c=document.createElement("div");c.className="arxis-cloud__provider-icon",c.textContent=e.icon,t.appendChild(c);const n=document.createElement("div");n.className="arxis-cloud__provider-info";const a=document.createElement("h4");a.className="arxis-cloud__provider-name",a.textContent=e.name;const o=document.createElement("div");if(o.className="arxis-cloud__provider-status",e.isConnected){const s=e.usedSpace/e.totalSpace*100;o.innerHTML=`
        <div style="font-size: 11px; color: rgba(255,255,255,0.7);">${e.email}</div>
        <div class="arxis-cloud__storage-bar">
          <div class="arxis-cloud__storage-used" style="width: ${s}%"></div>
        </div>
        <div style="font-size: 11px; color: rgba(255,255,255,0.6);">
          ${this.formatSize(e.usedSpace)} / ${this.formatSize(e.totalSpace)}
        </div>
      `}else o.innerHTML='<span style="color: rgba(255,255,255,0.5);">Não conectado</span>';n.appendChild(a),n.appendChild(o),t.appendChild(n);const i=document.createElement("div");if(i.className="arxis-cloud__provider-actions",e.isConnected){const s=new l({text:"🔄",variant:"secondary",size:"sm"});s.getElement().addEventListener("click",()=>this.syncProvider(e));const d=new l({text:"🔌",variant:"danger",size:"sm"});d.getElement().addEventListener("click",()=>this.disconnectProvider(e)),i.appendChild(s.getElement()),i.appendChild(d.getElement())}else{const s=new l({text:"Conectar",variant:"primary",size:"sm"});s.getElement().addEventListener("click",()=>this.connectProvider(e)),i.appendChild(s.getElement())}return t.appendChild(i),t}createFileItem(e){const t=document.createElement("div");t.className="arxis-cloud__file";const c=document.createElement("div");c.className="arxis-cloud__file-icon",c.textContent=this.getFileIcon(e.name),t.appendChild(c);const n=document.createElement("div");n.className="arxis-cloud__file-info";const a=document.createElement("div");a.className="arxis-cloud__file-name",a.textContent=e.name;const o=document.createElement("div");o.className="arxis-cloud__file-meta",o.innerHTML=`
      <span>${this.getProviderIcon(e.provider)} ${e.path}</span>
      <span>${this.formatSize(e.size)}</span>
    `,n.appendChild(a),n.appendChild(o),t.appendChild(n);const i=document.createElement("div");return i.className=`arxis-cloud__sync-badge arxis-cloud__sync-badge--${e.syncStatus}`,i.textContent=this.getSyncStatusLabel(e.syncStatus),t.appendChild(i),t}getFileIcon(e){const t=e.split(".").pop()?.toLowerCase();return{ifc:"🏗️",rvt:"🏛️",dwg:"📐",pdf:"📄"}[t||""]||"📄"}getProviderIcon(e){return{onedrive:"📘",gdrive:"📗",dropbox:"📦"}[e]||"☁️"}getSyncStatusLabel(e){return{synced:"✓ Sincronizado",syncing:"🔄 Sincronizando...",pending:"⏳ Pendente",error:"❌ Erro"}[e]||e}formatSize(e){return e<1073741824?`${(e/1048576).toFixed(0)} MB`:`${(e/1073741824).toFixed(1)} GB`}connectProvider(e){console.log("Conectando:",e.name),e.isConnected=!0,this.render()}disconnectProvider(e){confirm(`Desconectar ${e.name}?`)&&(e.isConnected=!1,this.render())}syncProvider(e){console.log("Sincronizando:",e.name),e.lastSync=Date.now()}syncAll(){console.log("Sincronizando todos os arquivos..."),this.files.forEach(e=>e.syncStatus="syncing"),this.render(),setTimeout(()=>{this.files.forEach(e=>e.syncStatus="synced"),this.render()},2e3)}getElement(){return this.card.getElement()}destroy(){this.card.destroy()}injectStyles(){if(document.getElementById("arxis-cloud-styles"))return;const e=document.createElement("style");e.id="arxis-cloud-styles",e.textContent=`
      .arxis-cloud__sync-control {
        margin-bottom: 16px;
        padding: 12px;
        background: rgba(255, 255, 255, 0.03);
        border-radius: 8px;
      }

      .arxis-cloud__section {
        margin-bottom: 20px;
      }

      .arxis-cloud__title {
        margin: 0 0 12px 0;
        font-size: 13px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.8);
      }

      .arxis-cloud__files-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      }

      .arxis-cloud__provider {
        display: flex;
        gap: 12px;
        align-items: center;
        padding: 14px;
        background: rgba(255, 255, 255, 0.04);
        border-radius: 8px;
        margin-bottom: 8px;
        transition: all 0.2s;
      }

      .arxis-cloud__provider--connected {
        background: rgba(0, 212, 255, 0.08);
      }

      .arxis-cloud__provider-icon {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
        flex-shrink: 0;
      }

      .arxis-cloud__provider-info {
        flex: 1;
        min-width: 0;
      }

      .arxis-cloud__provider-name {
        margin: 0 0 6px 0;
        font-size: 15px;
        font-weight: 600;
        color: #fff;
      }

      .arxis-cloud__provider-status {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .arxis-cloud__storage-bar {
        width: 100%;
        height: 6px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
        overflow: hidden;
      }

      .arxis-cloud__storage-used {
        height: 100%;
        background: linear-gradient(90deg, #00d4ff, #7b2ff7);
        transition: width 0.3s;
      }

      .arxis-cloud__provider-actions {
        display: flex;
        gap: 4px;
      }

      .arxis-cloud__files {
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-height: 300px;
        overflow-y: auto;
      }

      .arxis-cloud__file {
        display: flex;
        gap: 12px;
        align-items: center;
        padding: 10px;
        background: rgba(255, 255, 255, 0.04);
        border-radius: 6px;
      }

      .arxis-cloud__file-icon {
        font-size: 24px;
        width: 36px;
        text-align: center;
      }

      .arxis-cloud__file-info {
        flex: 1;
        min-width: 0;
      }

      .arxis-cloud__file-name {
        font-size: 13px;
        font-weight: 500;
        color: #fff;
        margin-bottom: 3px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .arxis-cloud__file-meta {
        display: flex;
        gap: 10px;
        font-size: 11px;
        color: rgba(255, 255, 255, 0.6);
      }

      .arxis-cloud__sync-badge {
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 500;
        white-space: nowrap;
      }

      .arxis-cloud__sync-badge--synced {
        background: rgba(76, 175, 80, 0.2);
        color: #4caf50;
      }

      .arxis-cloud__sync-badge--syncing {
        background: rgba(0, 212, 255, 0.2);
        color: #00d4ff;
        animation: pulse 1.5s infinite;
      }

      .arxis-cloud__sync-badge--pending {
        background: rgba(255, 170, 0, 0.2);
        color: #ffaa00;
      }

      .arxis-cloud__sync-badge--error {
        background: rgba(255, 68, 68, 0.2);
        color: #ff4444;
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `,document.head.appendChild(e)}}export{v as CloudStoragePanel};
