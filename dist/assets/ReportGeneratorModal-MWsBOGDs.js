import{M as m}from"./Modal-C4dtqQB0.js";import{B as l}from"./Button-BvNVdej2.js";import{S as u}from"./Select-D01wDXMy.js";import{C as c}from"./Checkbox-B0U72DD-.js";import{I as h}from"./Input-vZvnrYWf.js";import{s as f,h as d}from"./ProgressBar-DSuaIs0W.js";class g{modal;options;constructor(){this.options={type:"executive",format:"pdf",title:"Relatório de Projeto",sections:["summary","progress","costs"],includeImages:!0,includeCharts:!0,includeTables:!0},this.modal=new m({title:"📄 Gerar Relatório",size:"md",closeOnEscape:!0}),this.buildUI(),this.applyStyles()}buildUI(){const e=document.createElement("div");e.className="report-modal";const o=this.createTypeSection();e.appendChild(o);const t=this.createFormatSection();e.appendChild(t);const a=this.createOptionsSection();e.appendChild(a);const r=this.createSectionsSection();e.appendChild(r);const s=this.createFooter();e.appendChild(s),this.modal.setContent(e)}createTypeSection(){const e=document.createElement("div");e.className="report-section";const o=new u({label:"Tipo de Relatório",options:[{value:"executive",label:"👔 Executivo - Visão geral do projeto"},{value:"technical",label:"🔧 Técnico - Detalhes de engenharia"},{value:"cost",label:"💰 Custos - Orçamento e despesas"},{value:"schedule",label:"📅 Cronograma - Progresso temporal"},{value:"quality",label:"✅ Qualidade - Inspeções e não-conformidades"},{value:"custom",label:"⚙️ Personalizado"}],value:this.options.type,onChange:t=>{this.options.type=t,this.updateSections()}});return e.appendChild(o.getElement()),e}createFormatSection(){const e=document.createElement("div");e.className="report-section";const o=document.createElement("div");o.className="report-section-title",o.textContent="Formato de Saída",e.appendChild(o);const t=document.createElement("div");return t.className="report-format-grid",[{value:"pdf",icon:"📄",label:"PDF",desc:"Documento portátil"},{value:"xlsx",icon:"📊",label:"Excel",desc:"Planilha editável"},{value:"docx",icon:"📝",label:"Word",desc:"Documento editável"}].forEach(r=>{const s=document.createElement("div");s.className="report-format-card",this.options.format===r.value&&s.classList.add("report-format-card--selected"),s.innerHTML=`
        <div class="report-format-icon">${r.icon}</div>
        <div class="report-format-label">${r.label}</div>
        <div class="report-format-desc">${r.desc}</div>
      `,s.addEventListener("click",()=>{document.querySelectorAll(".report-format-card").forEach(i=>{i.classList.remove("report-format-card--selected")}),s.classList.add("report-format-card--selected"),this.options.format=r.value}),t.appendChild(s)}),e.appendChild(t),e}createOptionsSection(){const e=document.createElement("div");e.className="report-section";const o=new h({label:"Título do Relatório",value:this.options.title,fullWidth:!0,onChange:r=>{this.options.title=r}});e.appendChild(o.getElement());const t=document.createElement("div");return t.className="report-section-title",t.textContent="Opções de Conteúdo",e.appendChild(t),[{key:"includeImages",label:"🖼️ Incluir imagens e capturas"},{key:"includeCharts",label:"📊 Incluir gráficos"},{key:"includeTables",label:"📋 Incluir tabelas de dados"}].forEach(({key:r,label:s})=>{const i=new c({label:s,checked:this.options[r],onChange:p=>{this.options[r]=p}});e.appendChild(i.getElement())}),e}createSectionsSection(){const e=document.createElement("div");e.className="report-section";const o=document.createElement("div");o.className="report-section-title",o.textContent="Seções do Relatório",e.appendChild(o);const t=document.createElement("div");return t.className="report-sections-list",t.id="report-sections",this.renderSections(t),e.appendChild(t),e}renderSections(e){const o=[{id:"summary",label:"Resumo Executivo"},{id:"progress",label:"Progresso da Obra"},{id:"costs",label:"Análise de Custos"},{id:"schedule",label:"Cronograma"},{id:"quantities",label:"Quantitativos"},{id:"quality",label:"Controle de Qualidade"},{id:"conflicts",label:"Interferências"},{id:"photos",label:"Registro Fotográfico"}];e.innerHTML="",o.forEach(t=>{const a=new c({label:t.label,checked:this.options.sections.includes(t.id),onChange:r=>{r?this.options.sections.push(t.id):this.options.sections=this.options.sections.filter(s=>s!==t.id)}});e.appendChild(a.getElement())})}updateSections(){const e={executive:["summary","progress","costs"],technical:["progress","quantities","conflicts","quality"],cost:["costs","quantities"],schedule:["schedule","progress"],quality:["quality","conflicts","photos"],custom:this.options.sections};this.options.sections=e[this.options.type]||[];const o=document.getElementById("report-sections");o&&this.renderSections(o)}createFooter(){const e=document.createElement("div");e.className="report-footer";const o=new l({text:"Cancelar",variant:"ghost",onClick:()=>this.modal.close()}),t=new l({text:"📄 Gerar Relatório",variant:"primary",onClick:()=>this.generateReport()});return e.appendChild(o.getElement()),e.appendChild(t.getElement()),e}async generateReport(){f("Gerando relatório...");try{await new Promise(e=>setTimeout(e,2e3)),d(),this.modal.close(),console.log("✅ Relatório gerado!",this.options)}catch(e){d(),console.error("❌ Erro ao gerar relatório:",e)}}open(){this.modal.open()}applyStyles(){if(document.getElementById("report-modal-styles"))return;const e=document.createElement("style");e.id="report-modal-styles",e.textContent=`
      .report-modal {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .report-section {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .report-section-title {
        font-size: 14px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.9);
        margin-top: 8px;
      }

      .report-format-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
      }

      .report-format-card {
        padding: 16px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        border: 2px solid transparent;
        cursor: pointer;
        transition: all 0.2s ease;
        text-align: center;
      }

      .report-format-card:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      .report-format-card--selected {
        border-color: var(--theme-accent, #00ff88);
        background: rgba(0, 255, 136, 0.1);
      }

      .report-format-icon {
        font-size: 32px;
        margin-bottom: 8px;
      }

      .report-format-label {
        font-size: 14px;
        font-weight: 600;
        color: var(--theme-foreground, #fff);
        margin-bottom: 4px;
      }

      .report-format-desc {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.6);
      }

      .report-sections-list {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
      }

      .report-footer {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        padding-top: 16px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }
    `,document.head.appendChild(e)}destroy(){this.modal.destroy()}}function S(){const n=new g;return n.open(),n}export{g as ReportGeneratorModal,S as openReportGeneratorModal};
