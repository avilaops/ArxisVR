import{M as c}from"./Modal-C4dtqQB0.js";import{B as s}from"./Button-BvNVdej2.js";import{I as p}from"./Input-vZvnrYWf.js";import{s as n,h as d}from"./ProgressBar-DSuaIs0W.js";import{f as m}from"./index-BzHkYcHB.js";class f{modal;currentProvider="examples";files=[];selectedFiles=new Set;currentPath=["Examples"];constructor(){this.modal=new c({title:"Carregar Arquivo",size:"lg",closeOnEscape:!0,onClose:()=>this.cleanup()}),this.loadFiles(),this.buildUI(),this.applyStyles()}async loadFiles(){try{const e=await m.list(this.currentProvider);this.files=e.items,this.refreshFileList()}catch(e){console.error("Failed to load files:",e)}}buildUI(){const e=document.createElement("div");e.className="load-file-modal";const t=this.createTabs();e.appendChild(t);const o=this.createBrowserTab(),a=this.createUploadTab(),l=this.createRecentTab();o.classList.add("load-file-tab--active"),e.appendChild(o),e.appendChild(a),e.appendChild(l);const i=this.createFooter();e.appendChild(i),this.modal.setContent(e)}createTabs(){const e=document.createElement("div");return e.className="load-file-tabs",[{id:"browser",label:"📁 Navegar",icon:"📁"},{id:"upload",label:"📤 Upload",icon:"📤"},{id:"recent",label:"🕒 Recentes",icon:"🕒"}].forEach((o,a)=>{const i=new s({text:o.label,variant:a===0?"primary":"ghost",size:"sm",onClick:()=>this.switchTab(o.id)}).getElement();i.setAttribute("data-tab",o.id),e.appendChild(i)}),e}switchTab(e){this.modal.getElement().querySelectorAll("[data-tab]").forEach(a=>{a.getAttribute("data-tab")===e?(a.classList.add("arxis-btn--primary"),a.classList.remove("arxis-btn--ghost")):(a.classList.add("arxis-btn--ghost"),a.classList.remove("arxis-btn--primary"))}),this.modal.getElement().querySelectorAll(".load-file-tab").forEach(a=>{const l=a.getAttribute("data-tab-content");a.classList.toggle("load-file-tab--active",l===e)})}createBrowserTab(){const e=document.createElement("div");e.className="load-file-tab",e.setAttribute("data-tab-content","browser");const t=document.createElement("div");t.className="load-file-breadcrumb",this.updateBreadcrumb(t),e.appendChild(t);const o=new p({placeholder:"Buscar arquivos...",icon:"🔍",fullWidth:!0,onChange:l=>this.searchFiles(l)});e.appendChild(o.getElement());const a=document.createElement("div");return a.className="load-file-list",this.renderFileList(a),e.appendChild(a),e}updateBreadcrumb(e){e&&(e.innerHTML="",(!this.currentPath||!Array.isArray(this.currentPath))&&(this.currentPath=["Examples"]),this.currentPath.forEach((t,o)=>{if(o>0){const l=document.createElement("span");l.className="load-file-breadcrumb-separator",l.textContent="/",e.appendChild(l)}const a=document.createElement("span");a.className="load-file-breadcrumb-item",a.textContent=t,o<this.currentPath.length-1&&(a.style.cursor="pointer",a.addEventListener("click",()=>{this.currentPath=this.currentPath.slice(0,o+1),this.updateBreadcrumb(e)})),e.appendChild(a)}))}renderFileList(e){if(e.innerHTML="",this.files.length===0){const t=document.createElement("div");t.className="load-file-empty",t.textContent="Nenhum arquivo encontrado",e.appendChild(t);return}this.files.forEach(t=>{const o=this.createFileItem(t);e.appendChild(o)})}refreshFileList(){const e=this.modal.getElement().querySelector(".load-file-list");e&&this.renderFileList(e)}createFileItem(e){const t=document.createElement("div");t.className="load-file-item",this.selectedFiles.has(e.id)&&t.classList.add("load-file-item--selected");const o=document.createElement("div");o.className="load-file-icon",o.textContent=this.getFileIcon(e.extension),t.appendChild(o);const a=document.createElement("div");a.className="load-file-info";const l=document.createElement("div");l.className="load-file-name",l.textContent=e.displayName,a.appendChild(l);const i=document.createElement("div");return i.className="load-file-meta",i.textContent=`${this.formatFileSize(e.size)} • ${this.formatDate(e.modifiedAt)}`,a.appendChild(i),t.appendChild(a),t.addEventListener("click",()=>{this.toggleFileSelection(e.id),t.classList.toggle("load-file-item--selected")}),t.addEventListener("dblclick",()=>{this.loadSelectedFiles()}),t}getFileIcon(e){return{".ifc":"🏢",".dwg":"📐",".rvt":"🏗️",".nwd":"📊"}[e]||"📄"}formatFileSize(e){if(e===0)return"0 B";const t=1024,o=["B","KB","MB","GB"],a=Math.floor(Math.log(e)/Math.log(t));return`${(e/Math.pow(t,a)).toFixed(1)} ${o[a]}`}formatDate(e){const o=new Date().getTime()-e.getTime(),a=Math.floor(o/(1e3*60*60*24));return a===0?"Hoje":a===1?"Ontem":a<7?`${a} dias atrás`:e.toLocaleDateString("pt-BR")}toggleFileSelection(e){this.selectedFiles.has(e)?this.selectedFiles.delete(e):this.selectedFiles.add(e)}searchFiles(e){console.log("Buscando:",e)}createUploadTab(){const e=document.createElement("div");e.className="load-file-tab",e.setAttribute("data-tab-content","upload");const t=document.createElement("div");t.className="load-file-dropzone",t.innerHTML=`
      <div class="load-file-dropzone-icon">📤</div>
      <div class="load-file-dropzone-text">Arraste arquivos aqui</div>
      <div class="load-file-dropzone-hint">ou clique para selecionar</div>
      <div class="load-file-dropzone-formats">IFC, DWG, RVT, NWD</div>
    `;const o=document.createElement("input");return o.type="file",o.multiple=!0,o.accept=".ifc,.dwg,.rvt,.nwd",o.style.display="none",o.addEventListener("change",a=>{const l=a.target.files;l&&this.handleFileUpload(Array.from(l))}),t.addEventListener("click",()=>o.click()),t.addEventListener("dragover",a=>{a.preventDefault(),t.classList.add("load-file-dropzone--active")}),t.addEventListener("dragleave",()=>{t.classList.remove("load-file-dropzone--active")}),t.addEventListener("drop",a=>{a.preventDefault(),t.classList.remove("load-file-dropzone--active");const l=Array.from(a.dataTransfer?.files||[]);this.handleFileUpload(l)}),e.appendChild(t),e.appendChild(o),e}async handleFileUpload(e){if(e.length!==0){n("Carregando arquivo...");try{for(const t of e)await this.loadFileIntoViewer(t);console.log(`✅ ${e.length} arquivo(s) carregado(s)`),this.modal.close()}catch(t){console.error("❌ Erro ao carregar arquivos:",t),alert(`Erro ao carregar arquivos: ${t}`)}finally{d()}}}createRecentTab(){const e=document.createElement("div");e.className="load-file-tab",e.setAttribute("data-tab-content","recent");const t=document.createElement("div");return t.className="load-file-list",this.files.slice(0,3).forEach(a=>{const l=this.createFileItem(a);t.appendChild(l)}),e.appendChild(t),e}createFooter(){const e=document.createElement("div");e.className="load-file-footer";const t=new s({text:"Cancelar",variant:"ghost",onClick:()=>this.modal.close()}),o=new s({text:"Carregar",variant:"primary",onClick:()=>this.loadSelectedFiles()});return e.appendChild(t.getElement()),e.appendChild(o.getElement()),e}resolveExampleFileUrl(e){const t=e.path.join("/");return t?`/${t.replace(/^\//,"").split("/").map(encodeURIComponent).join("/")}`:`/Examples-files/${encodeURIComponent(e.displayName)}`}async loadFileIntoViewer(e){const t=window.loadIFCFile;if(typeof t=="function"){await t(e);return}throw new Error("Nenhum loader disponível (window.loadIFCFile).")}async loadSelectedFiles(){const e=this.files.filter(t=>this.selectedFiles.has(t.id)&&t.extension&&t.extension.startsWith("."));if(e.length===0){alert("Selecione pelo menos um arquivo");return}n("Carregando arquivos...");try{for(const t of e){const o=this.resolveExampleFileUrl(t);console.log(`📥 Carregando: ${t.displayName} (${o})`);const a=await fetch(o);if(!a.ok)throw new Error(`Falha ao buscar "${t.displayName}": ${a.status} ${a.statusText}`);const l=await a.blob(),i=new File([l],t.displayName,{type:"application/octet-stream"});await this.loadFileIntoViewer(i)}console.log(`✅ ${e.length} arquivo(s) carregado(s)`),this.modal.close()}catch(t){console.error("❌ Erro ao carregar arquivos:",t),alert(`Erro ao carregar arquivos: ${t}`)}finally{d()}}cleanup(){this.selectedFiles.clear(),this.currentPath=["Meus Projetos"]}open(){this.modal.open()}get element(){return this.modal.getElement()}applyStyles(){if(document.getElementById("load-file-modal-styles"))return;const e=document.createElement("style");e.id="load-file-modal-styles",e.textContent=`
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

      .load-file-breadcrumb {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.7);
      }

      .load-file-breadcrumb-item {
        transition: color 0.15s ease;
      }

      .load-file-breadcrumb-item:hover {
        color: var(--theme-accent, #00ff88);
      }

      .load-file-breadcrumb-separator {
        color: rgba(255, 255, 255, 0.3);
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
    `,document.head.appendChild(e)}destroy(){this.modal.destroy()}}function v(){const r=new f;return r.open(),r}export{f as LoadFileModal,v as openLoadFileModal};
