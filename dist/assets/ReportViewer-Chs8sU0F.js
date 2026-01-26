import{C as p}from"./Card-DLSvBshn.js";import{B as n}from"./Button-BvNVdej2.js";class h{card;reports=[];currentReport;constructor(){this.card=new p({title:"📄 Relatórios",variant:"glass"}),this.loadReports(),this.render()}loadReports(){const e=Date.now();this.reports=[{id:"r1",title:"Relatório de Elementos Estruturais",type:"pdf",date:e-36e5,author:"João Silva",pages:24,url:"#"},{id:"r2",title:"Análise de Interferências",type:"pdf",date:e-864e5,author:"Maria Santos",pages:12,url:"#"},{id:"r3",title:"Planilha de Quantitativos",type:"excel",date:e-1728e5,author:"Carlos Souza",url:"#"},{id:"r4",title:"Resumo do Projeto",type:"html",date:e-2592e5,author:"Ana Lima",content:"<h1>Resumo do Projeto</h1><p>Este é um relatório HTML de exemplo...</p>",url:"#"}]}render(){const e=this.card.getBody();if(e.innerHTML="",this.currentReport)this.renderReportViewer(e);else{const t=document.createElement("div");t.className="arxis-reports__list",this.reports.forEach(a=>{const i=this.createReportItem(a);t.appendChild(i)}),e.appendChild(t)}this.injectStyles()}createReportItem(e){const t=document.createElement("div");t.className="arxis-reports__item";const a=document.createElement("div");a.className="arxis-reports__icon",a.textContent=this.getTypeIcon(e.type),a.style.color=this.getTypeColor(e.type),t.appendChild(a);const i=document.createElement("div");i.className="arxis-reports__info";const o=document.createElement("h4");o.className="arxis-reports__title",o.textContent=e.title;const s=document.createElement("div");s.className="arxis-reports__meta",s.innerHTML=`
      <span>👤 ${e.author}</span>
      <span>📅 ${this.formatDate(e.date)}</span>
      ${e.pages?`<span>📄 ${e.pages} páginas</span>`:""}
    `,i.appendChild(o),i.appendChild(s),t.appendChild(i);const r=document.createElement("div");r.className="arxis-reports__actions";const l=new n({text:"👁️",variant:"primary",size:"sm"});l.getElement().addEventListener("click",()=>this.viewReport(e));const d=new n({text:"⬇️",variant:"secondary",size:"sm"});return d.getElement().addEventListener("click",()=>this.downloadReport(e)),r.appendChild(l.getElement()),r.appendChild(d.getElement()),t.appendChild(r),t}renderReportViewer(e){const t=document.createElement("div");t.className="arxis-reports__viewer-header";const a=new n({text:"◀ Voltar",variant:"secondary",size:"sm"});a.getElement().addEventListener("click",()=>{this.currentReport=void 0,this.render()});const i=document.createElement("h3");i.className="arxis-reports__viewer-title",i.textContent=this.currentReport.title;const o=new n({text:"⬇️ Baixar",variant:"primary",size:"sm"});o.getElement().addEventListener("click",()=>this.downloadReport(this.currentReport)),t.appendChild(a.getElement()),t.appendChild(i),t.appendChild(o.getElement()),e.appendChild(t);const s=document.createElement("div");if(s.className="arxis-reports__viewer",this.currentReport.type==="pdf"){const r=document.createElement("div");r.className="arxis-reports__pdf-placeholder",r.innerHTML=`
        <div class="arxis-reports__pdf-icon">📄</div>
        <div class="arxis-reports__pdf-text">
          <div>Visualizador de PDF</div>
          <div style="font-size: 13px; color: rgba(255,255,255,0.6); margin-top: 8px;">
            ${this.currentReport.pages} páginas
          </div>
          <div style="font-size: 12px; color: rgba(255,255,255,0.5); margin-top: 12px;">
            Em produção, aqui seria renderizado o PDF usando PDF.js ou similar
          </div>
        </div>
      `,s.appendChild(r)}else if(this.currentReport.type==="html"){const r=document.createElement("div");r.className="arxis-reports__html-content",r.innerHTML=this.currentReport.content||"<p>Conteúdo HTML</p>",s.appendChild(r)}else if(this.currentReport.type==="excel"){const r=document.createElement("div");r.className="arxis-reports__pdf-placeholder",r.innerHTML=`
        <div class="arxis-reports__pdf-icon">📊</div>
        <div class="arxis-reports__pdf-text">
          <div>Planilha Excel</div>
          <div style="font-size: 12px; color: rgba(255,255,255,0.5); margin-top: 12px;">
            Clique em "Baixar" para abrir no Excel
          </div>
        </div>
      `,s.appendChild(r)}e.appendChild(s)}getTypeIcon(e){return{pdf:"📄",html:"🌐",excel:"📊"}[e]||"📄"}getTypeColor(e){return{pdf:"#ff4444",html:"#00d4ff",excel:"#4caf50"}[e]||"#fff"}formatDate(e){return new Date(e).toLocaleDateString("pt-BR",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"})}viewReport(e){this.currentReport=e,this.render()}downloadReport(e){console.log("Baixando relatório:",e.title);const t=document.createElement("a");t.href=e.url||"#",t.download=`${e.title}.${e.type}`,t.click()}getElement(){return this.card.getElement()}destroy(){this.card.destroy()}injectStyles(){if(document.getElementById("arxis-reports-styles"))return;const e=document.createElement("style");e.id="arxis-reports-styles",e.textContent=`
      .arxis-reports__list {
        display: flex;
        flex-direction: column;
        gap: 12px;
        max-height: 500px;
        overflow-y: auto;
      }

      .arxis-reports__item {
        display: flex;
        gap: 12px;
        align-items: center;
        padding: 14px;
        background: rgba(255, 255, 255, 0.04);
        border-radius: 8px;
        transition: all 0.2s;
      }

      .arxis-reports__item:hover {
        background: rgba(255, 255, 255, 0.08);
        transform: translateX(3px);
      }

      .arxis-reports__icon {
        font-size: 32px;
        width: 48px;
        text-align: center;
        flex-shrink: 0;
      }

      .arxis-reports__info {
        flex: 1;
        min-width: 0;
      }

      .arxis-reports__title {
        margin: 0 0 6px 0;
        font-size: 15px;
        font-weight: 600;
        color: #fff;
      }

      .arxis-reports__meta {
        display: flex;
        gap: 12px;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
      }

      .arxis-reports__actions {
        display: flex;
        gap: 4px;
        flex-shrink: 0;
      }

      .arxis-reports__viewer-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .arxis-reports__viewer-title {
        flex: 1;
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: #fff;
      }

      .arxis-reports__viewer {
        background: rgba(255, 255, 255, 0.03);
        border-radius: 8px;
        padding: 20px;
        min-height: 400px;
      }

      .arxis-reports__pdf-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 400px;
        gap: 20px;
      }

      .arxis-reports__pdf-icon {
        font-size: 64px;
        opacity: 0.5;
      }

      .arxis-reports__pdf-text {
        text-align: center;
        font-size: 16px;
        color: rgba(255, 255, 255, 0.8);
      }

      .arxis-reports__html-content {
        color: rgba(255, 255, 255, 0.9);
        line-height: 1.6;
      }

      .arxis-reports__html-content h1,
      .arxis-reports__html-content h2,
      .arxis-reports__html-content h3 {
        color: #fff;
      }
    `,document.head.appendChild(e)}}export{h as ReportViewer};
