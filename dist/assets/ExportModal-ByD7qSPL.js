import{M as x}from"./Modal-C4dtqQB0.js";import{B as l}from"./Button-BvNVdej2.js";import{S as m}from"./Select-D01wDXMy.js";import{I as u}from"./Input-vZvnrYWf.js";import{C as f}from"./Checkbox-B0U72DD-.js";import{s as h,h as p}from"./ProgressBar-DSuaIs0W.js";class v{modal;options;onExport;constructor(e){this.onExport=e,this.options={format:"gltf",filename:`projeto_${Date.now()}`,includeMetadata:!0,includeTextures:!0,includeHierarchy:!0,compressFiles:!0,selectedOnly:!1,quality:"high"},this.modal=new x({title:"📤 Exportar Projeto",size:"md",closeOnEscape:!0}),this.buildUI(),this.applyStyles()}buildUI(){const e=document.createElement("div");e.className="export-modal";const t=this.createFormatSection();e.appendChild(t);const o=this.createOptionsSection();e.appendChild(o);const n=this.createAdvancedSection();e.appendChild(n);const i=this.createPreviewSection();e.appendChild(i);const a=this.createFooter();e.appendChild(a),this.modal.setContent(e)}createFormatSection(){const e=document.createElement("div");e.className="export-section";const t=document.createElement("h3");t.className="export-section-title",t.textContent="Formato de Exportação",e.appendChild(t);const o=document.createElement("div");return o.className="export-format-grid",[{value:"gltf",label:"GLTF",icon:"🎨",desc:"Formato 3D web padrão"},{value:"glb",label:"GLB",icon:"📦",desc:"GLTF binário compacto"},{value:"ifc",label:"IFC",icon:"🏢",desc:"Industry Foundation Classes"},{value:"dwg",label:"DWG",icon:"📐",desc:"AutoCAD Drawing"},{value:"bcf",label:"BCF",icon:"⚠️",desc:"BIM Collaboration Format"},{value:"pdf",label:"PDF",icon:"📄",desc:"Relatório em PDF"},{value:"xlsx",label:"Excel",icon:"📊",desc:"Planilha de quantitativos"}].forEach(i=>{const a=document.createElement("div");a.className="export-format-card",this.options.format===i.value&&a.classList.add("export-format-card--selected"),a.innerHTML=`
        <div class="export-format-icon">${i.icon}</div>
        <div class="export-format-label">${i.label}</div>
        <div class="export-format-desc">${i.desc}</div>
      `,a.addEventListener("click",()=>{document.querySelectorAll(".export-format-card").forEach(r=>{r.classList.remove("export-format-card--selected")}),a.classList.add("export-format-card--selected"),this.options.format=i.value,this.updatePreview()}),o.appendChild(a)}),e.appendChild(o),e}createOptionsSection(){const e=document.createElement("div");e.className="export-section";const t=document.createElement("h3");t.className="export-section-title",t.textContent="Opções de Exportação",e.appendChild(t);const o=new u({label:"Nome do Arquivo",placeholder:"projeto_export",value:this.options.filename,fullWidth:!0,onChange:a=>{this.options.filename=a,this.updatePreview()}});e.appendChild(o.getElement());const n=new m({label:"Qualidade",options:[{value:"low",label:"Baixa (rápido)"},{value:"medium",label:"Média"},{value:"high",label:"Alta"},{value:"ultra",label:"Ultra (lento)"}],value:this.options.quality,onChange:a=>{this.options.quality=a,this.updatePreview()}});return e.appendChild(n.getElement()),[{key:"selectedOnly",label:"Apenas elementos selecionados"},{key:"includeMetadata",label:"Incluir metadados IFC"},{key:"includeTextures",label:"Incluir texturas"},{key:"includeHierarchy",label:"Manter hierarquia"},{key:"compressFiles",label:"Comprimir arquivos"}].forEach(({key:a,label:r})=>{const c=new f({label:r,checked:this.options[a],onChange:d=>{this.options[a]=d,this.updatePreview()}});e.appendChild(c.getElement())}),e}createAdvancedSection(){const e=document.createElement("div");e.className="export-section export-section--collapsible";const t=document.createElement("div");t.className="export-section-header",t.innerHTML='<span>⚙️ Opções Avançadas</span><span class="export-section-toggle">▼</span>',t.addEventListener("click",()=>{e.classList.toggle("export-section--expanded")}),e.appendChild(t);const o=document.createElement("div");return o.className="export-section-content",o.innerHTML=`
      <div class="export-advanced-option">
        <label>Coordenadas:</label>
        <select>
          <option>Globais</option>
          <option>Locais</option>
          <option>Projeto</option>
        </select>
      </div>
      <div class="export-advanced-option">
        <label>Unidades:</label>
        <select>
          <option>Metros</option>
          <option>Centímetros</option>
          <option>Milímetros</option>
        </select>
      </div>
      <div class="export-advanced-option">
        <label>Sistema de cores:</label>
        <select>
          <option>Original</option>
          <option>Por tipo</option>
          <option>Por material</option>
        </select>
      </div>
    `,e.appendChild(o),e}createPreviewSection(){const e=document.createElement("div");return e.className="export-preview",e.id="export-preview",this.updatePreview(),e}updatePreview(){const e=document.getElementById("export-preview");if(!e)return;const t=this.estimateFileSize(),o=this.getFileExtension();e.innerHTML=`
      <div class="export-preview-item">
        <span class="export-preview-label">Arquivo:</span>
        <span class="export-preview-value">${this.options.filename}${o}</span>
      </div>
      <div class="export-preview-item">
        <span class="export-preview-label">Formato:</span>
        <span class="export-preview-value">${this.options.format.toUpperCase()}</span>
      </div>
      <div class="export-preview-item">
        <span class="export-preview-label">Tamanho estimado:</span>
        <span class="export-preview-value">${t}</span>
      </div>
      <div class="export-preview-item">
        <span class="export-preview-label">Qualidade:</span>
        <span class="export-preview-value">${this.options.quality}</span>
      </div>
    `}estimateFileSize(){let t={gltf:5.2,glb:3.8,ifc:12.5,dwg:8.3,bcf:.5,pdf:2.1,xlsx:1.2}[this.options.format]||5;return this.options.includeTextures&&(t*=2.5),this.options.quality==="ultra"&&(t*=1.8),this.options.quality==="low"&&(t*=.5),this.options.compressFiles&&(t*=.6),this.options.selectedOnly&&(t*=.3),t<1?`${(t*1024).toFixed(0)} KB`:`${t.toFixed(1)} MB`}getFileExtension(){return{gltf:".gltf",glb:".glb",ifc:".ifc",dwg:".dwg",bcf:".bcfzip",pdf:".pdf",xlsx:".xlsx"}[this.options.format]}createFooter(){const e=document.createElement("div");e.className="export-footer";const t=new l({label:"Cancelar",variant:"ghost",onClick:()=>this.modal.close()}),o=new l({label:"📤 Exportar",variant:"primary",onClick:()=>this.handleExport()});return e.appendChild(t.getElement()),e.appendChild(o.getElement()),e}async handleExport(){h(`Exportando ${this.options.format.toUpperCase()}...`);try{this.onExport?await this.onExport(this.options):await this.simulateExport(),p(),this.modal.close(),console.log("✅ Exportação concluída!")}catch(e){p(),console.error("❌ Erro na exportação:",e)}}async simulateExport(){return new Promise(e=>{setTimeout(e,2e3)})}open(){this.modal.open()}applyStyles(){if(document.getElementById("export-modal-styles"))return;const e=document.createElement("style");e.id="export-modal-styles",e.textContent=`
      .export-modal {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      .export-section {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .export-section-title {
        font-size: 15px;
        font-weight: 600;
        color: var(--theme-foreground, #fff);
        margin: 0 0 8px 0;
      }

      .export-format-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 12px;
      }

      .export-format-card {
        padding: 16px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        border: 2px solid transparent;
        cursor: pointer;
        transition: all 0.2s ease;
        text-align: center;
      }

      .export-format-card:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: translateY(-2px);
      }

      .export-format-card--selected {
        border-color: var(--theme-accent, #00ff88);
        background: rgba(0, 255, 136, 0.1);
      }

      .export-format-icon {
        font-size: 32px;
        margin-bottom: 8px;
      }

      .export-format-label {
        font-size: 14px;
        font-weight: 600;
        color: var(--theme-foreground, #fff);
        margin-bottom: 4px;
      }

      .export-format-desc {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.6);
      }

      .export-section--collapsible .export-section-content {
        display: none;
        margin-top: 12px;
      }

      .export-section--expanded .export-section-content {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .export-section--expanded .export-section-toggle {
        transform: rotate(180deg);
      }

      .export-section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 6px;
        cursor: pointer;
        transition: background 0.15s ease;
      }

      .export-section-header:hover {
        background: rgba(255, 255, 255, 0.08);
      }

      .export-section-toggle {
        font-size: 12px;
        transition: transform 0.3s ease;
      }

      .export-advanced-option {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        background: rgba(255, 255, 255, 0.03);
        border-radius: 4px;
      }

      .export-advanced-option label {
        font-size: 13px;
        color: rgba(255, 255, 255, 0.8);
      }

      .export-advanced-option select {
        padding: 6px 12px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        color: var(--theme-foreground, #fff);
        font-size: 12px;
      }

      .export-preview {
        padding: 16px;
        background: rgba(0, 255, 136, 0.05);
        border: 1px solid rgba(0, 255, 136, 0.2);
        border-radius: 8px;
      }

      .export-preview-item {
        display: flex;
        justify-content: space-between;
        padding: 6px 0;
        font-size: 13px;
      }

      .export-preview-label {
        color: rgba(255, 255, 255, 0.6);
      }

      .export-preview-value {
        color: var(--theme-accent, #00ff88);
        font-weight: 600;
        font-family: 'Courier New', monospace;
      }

      .export-footer {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        padding-top: 16px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }
    `,document.head.appendChild(e)}destroy(){this.modal.destroy()}}function F(s){const e=new v(s);return e.open(),e}export{v as ExportModal,F as openExportModal};
