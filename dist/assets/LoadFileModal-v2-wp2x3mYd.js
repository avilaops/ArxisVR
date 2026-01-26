import{M as p}from"./Modal-C4dtqQB0.js";import{B as c}from"./Button-BvNVdej2.js";import{I as m}from"./Input-vZvnrYWf.js";import{s,h as n}from"./ProgressBar-DSuaIs0W.js";import{f as l}from"./index-BuRPltC2.js";class f{modal;currentProvider="examples";files=[];selectedFiles=new Set;constructor(){this.modal=new p({title:"Carregar Arquivo",size:"lg",closeOnEscape:!0,onClose:()=>this.cleanup()}),this.buildUI(),this.applyStyles()}async loadFiles(){try{s("Carregando lista de arquivos...");const e=await l.list(this.currentProvider);this.files=e.items,this.refreshFileList()}catch(e){console.error("Failed to load files:",e),alert(`Erro ao carregar arquivos: ${e}`)}finally{n()}}buildUI(){const e=document.createElement("div");e.className="load-file-modal";const t=this.createTabs();e.appendChild(t);const o=this.createBrowserTab(),a=this.createUploadTab(),i=this.createRecentTab();a.classList.add("load-file-tab--active"),e.appendChild(o),e.appendChild(a),e.appendChild(i);const r=this.createFooter();e.appendChild(r),this.modal.setContent(e)}createTabs(){const e=document.createElement("div");return e.className="load-file-tabs",[{id:"upload",label:"📤 Upload",icon:"📤"},{id:"recent",label:"🕒 Recentes",icon:"🕒"},{id:"browser",label:"📁 Navegar",icon:"📁"}].forEach((o,a)=>{const r=new c({text:o.label,variant:a===0?"primary":"ghost",size:"sm",onClick:()=>this.switchTab(o.id)}).getElement();r.setAttribute("data-tab",o.id),e.appendChild(r)}),e}switchTab(e){this.modal.getElement().querySelectorAll("[data-tab]").forEach(a=>{a.getAttribute("data-tab")===e?(a.classList.add("arxis-btn--primary"),a.classList.remove("arxis-btn--ghost")):(a.classList.add("arxis-btn--ghost"),a.classList.remove("arxis-btn--primary"))}),this.modal.getElement().querySelectorAll(".load-file-tab").forEach(a=>{const i=a.getAttribute("data-tab-content");a.classList.toggle("load-file-tab--active",i===e)}),e==="recent"&&this.loadRecents()}createBrowserTab(){const e=document.createElement("div");e.className="load-file-tab",e.setAttribute("data-tab-content","browser");const t=document.createElement("div");t.className="load-file-privacy-info",t.innerHTML=`
      <div style="padding: 2rem; text-align: center; background: rgba(var(--arxis-primary-rgb), 0.1); border-radius: 8px; margin: 2rem 0;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🔒</div>
        <h3 style="margin: 0 0 1rem 0; color: var(--arxis-text);">Política de Privacidade</h3>
        <p style="color: var(--arxis-text-secondary); line-height: 1.6; max-width: 500px; margin: 0 auto;">
          Por questões de <strong>privacidade e segurança</strong>, não fornecemos arquivos de exemplo.<br><br>
          Arquivos BIM/CAD contêm dados confidenciais de projetos e clientes.<br><br>
          <strong>Use a aba "Upload"</strong> para carregar seus próprios arquivos (.ifc, .dwg, .rvt, .nwd).
        </p>
      </div>
    `,e.appendChild(t);const o=new m({placeholder:"Buscar arquivos...",icon:"🔍",fullWidth:!0,onChange:i=>this.searchFiles(i)});o.getElement().style.display="none",e.appendChild(o.getElement());const a=document.createElement("div");return a.className="load-file-list",e.appendChild(a),e}refreshFileList(){const e=this.modal.getElement().querySelector(".load-file-list");e&&this.renderFileList(e)}renderFileList(e){if(e.innerHTML="",this.files.length===0){const t=document.createElement("div");t.className="load-file-empty",t.textContent="Nenhum arquivo encontrado",e.appendChild(t);return}this.files.forEach(t=>{const o=this.createFileItem(t);e.appendChild(o)})}createFileItem(e){const t=document.createElement("div");t.className="load-file-item",this.selectedFiles.has(e.id)&&t.classList.add("load-file-item--selected");const o=document.createElement("div");o.className="load-file-icon",o.textContent=this.getFileIcon(e.extension),t.appendChild(o);const a=document.createElement("div");a.className="load-file-info";const i=document.createElement("div");i.className="load-file-name",i.textContent=e.displayName,a.appendChild(i);const r=document.createElement("div");return r.className="load-file-meta",r.textContent=`${this.formatFileSize(e.size)} • ${this.formatDate(e.modifiedAt)}`,a.appendChild(r),t.appendChild(a),t.addEventListener("click",()=>{this.toggleFileSelection(e.id),t.classList.toggle("load-file-item--selected")}),t.addEventListener("dblclick",()=>{this.loadSelectedFiles()}),t}getFileIcon(e){return{".ifc":"🏢",".dwg":"📐",".rvt":"🏗️",".nwd":"📊"}[e]||"📄"}formatFileSize(e){if(e===0)return"0 B";const t=1024,o=["B","KB","MB","GB"],a=Math.floor(Math.log(e)/Math.log(t));return`${(e/Math.pow(t,a)).toFixed(1)} ${o[a]}`}formatDate(e){const o=new Date().getTime()-e.getTime(),a=Math.floor(o/(1e3*60*60*24));return a===0?"Hoje":a===1?"Ontem":a<7?`${a} dias atrás`:e.toLocaleDateString("pt-BR")}toggleFileSelection(e){this.selectedFiles.has(e)?this.selectedFiles.delete(e):this.selectedFiles.add(e)}async searchFiles(e){if(!e.trim()){this.loadFiles();return}try{s("Buscando...");const t=await l.search(e,[this.currentProvider]);this.files=t,this.refreshFileList()}catch(t){console.error("Search failed:",t)}finally{n()}}createUploadTab(){const e=document.createElement("div");e.className="load-file-tab",e.setAttribute("data-tab-content","upload");const t=document.createElement("div");t.className="load-file-dropzone",t.innerHTML=`
      <div class="load-file-dropzone-icon">📤</div>
      <div class="load-file-dropzone-text">Arraste arquivos aqui</div>
      <div class="load-file-dropzone-hint">ou clique para selecionar</div>
      <div class="load-file-dropzone-formats">IFC, DWG, RVT, NWD</div>
    `;const o=document.createElement("input");return o.type="file",o.multiple=!0,o.accept=".ifc,.dwg,.rvt,.nwd",o.style.display="none",o.addEventListener("change",a=>{const i=a.target.files;i&&this.handleFileUpload(Array.from(i))}),t.addEventListener("click",()=>o.click()),t.addEventListener("dragover",a=>{a.preventDefault(),t.classList.add("load-file-dropzone--active")}),t.addEventListener("dragleave",()=>{t.classList.remove("load-file-dropzone--active")}),t.addEventListener("drop",a=>{a.preventDefault(),t.classList.remove("load-file-dropzone--active");const i=Array.from(a.dataTransfer?.files||[]);this.handleFileUpload(i)}),e.appendChild(t),e.appendChild(o),e}async handleFileUpload(e){if(e.length!==0)try{s(`Carregando ${e.length} arquivo(s)...`);for(const t of e){const o=await l.registerLocalFile(t),a=await l.load(o);if(!a.success)throw new Error(a.error||"Load failed");console.log("📊 Telemetria:",a.metrics)}console.log(`✅ ${e.length} arquivo(s) carregado(s)`),this.modal.close()}catch(t){console.error("❌ Erro ao carregar arquivos:",t),alert(`Erro ao carregar arquivos: ${t}`)}finally{n()}}createRecentTab(){const e=document.createElement("div");e.className="load-file-tab",e.setAttribute("data-tab-content","recent");const t=document.createElement("div");return t.className="load-file-list",e.appendChild(t),e}loadRecents(){const e=l.getRecents(10);this.files=e;const t=this.modal.getElement().querySelector('[data-tab-content="recent"] .load-file-list');t&&this.renderFileList(t)}createFooter(){const e=document.createElement("div");e.className="load-file-footer";const t=new c({text:"Cancelar",variant:"ghost",onClick:()=>this.modal.close()}),o=new c({text:"Carregar",variant:"primary",onClick:()=>this.loadSelectedFiles()});return e.appendChild(t.getElement()),e.appendChild(o.getElement()),e}async loadSelectedFiles(){const e=this.files.filter(t=>this.selectedFiles.has(t.id));if(e.length===0){alert("Selecione pelo menos um arquivo");return}try{s(`Carregando ${e.length} arquivo(s)...`);for(const t of e){const o=await l.load(t);if(!o.success){console.error(`❌ Falha: ${t.displayName}`,o.error),alert(`Erro ao carregar "${t.displayName}": ${o.error}`);continue}console.log(`✅ ${t.displayName} carregado`),console.log("📊 Métricas:",o.metrics)}this.modal.close()}catch(t){console.error("❌ Erro ao carregar arquivos:",t),alert(`Erro ao carregar arquivos: ${t}`)}finally{n()}}cleanup(){this.selectedFiles.clear()}open(){this.modal.open()}get element(){return this.modal.getElement()}destroy(){this.modal.destroy()}applyStyles(){if(document.getElementById("load-file-modal-styles"))return;const e=document.createElement("style");e.id="load-file-modal-styles",e.textContent=`
      .load-file-modal {
        display: flex;
        flex-direction: column;
        gap: 16px;
        min-height: 500px;
      }

      .load-file-tabs {
        display: flex;
        gap: 8px;
        padding-bottom: 12px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .load-file-tab {
        display: none;
        flex-direction: column;
        gap: 16px;
        flex: 1;
      }

      .load-file-tab--active {
        display: flex;
      }

      .load-file-list {
        display: flex;
        flex-direction: column;
        gap: 4px;
        max-height: 350px;
        overflow-y: auto;
        padding: 4px;
      }

      .load-file-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.15s ease;
        border: 2px solid transparent;
      }

      .load-file-item:hover {
        background: rgba(255, 255, 255, 0.05);
      }

      .load-file-item--selected {
        background: rgba(102, 126, 234, 0.2);
        border-color: var(--theme-accent, #00ff88);
      }

      .load-file-icon {
        font-size: 32px;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
      }

      .load-file-info {
        flex: 1;
        min-width: 0;
      }

      .load-file-name {
        font-size: 14px;
        font-weight: 500;
        color: var(--theme-foreground, #fff);
        margin-bottom: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .load-file-meta {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.5);
      }

      .load-file-empty {
        padding: 60px 20px;
        text-align: center;
        color: rgba(255, 255, 255, 0.5);
        font-size: 14px;
      }

      .load-file-dropzone {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 12px;
        padding: 60px 40px;
        border: 2px dashed rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        min-height: 300px;
      }

      .load-file-dropzone:hover,
      .load-file-dropzone--active {
        border-color: var(--theme-accent, #00ff88);
        background: rgba(0, 255, 136, 0.05);
      }

      .load-file-dropzone-icon {
        font-size: 64px;
        opacity: 0.8;
      }

      .load-file-dropzone-text {
        font-size: 18px;
        font-weight: 600;
        color: var(--theme-foreground, #fff);
      }

      .load-file-dropzone-hint {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.6);
      }

      .load-file-dropzone-formats {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.4);
        margin-top: 8px;
      }

      .load-file-footer {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        padding-top: 16px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }
    `,document.head.appendChild(e)}}function x(){const d=new f;return d.open(),d}export{f as LoadFileModal,x as openLoadFileModal};
