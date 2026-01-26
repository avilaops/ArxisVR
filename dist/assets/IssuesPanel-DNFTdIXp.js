import{C as E}from"./Card-DLSvBshn.js";import{B as g}from"./Button-BvNVdej2.js";import{S as h}from"./Select-D01wDXMy.js";class B{card;issues=[];filterStatus="all";filterPriority="all";sortBy="date";onIssueSelect;constructor(e){this.onIssueSelect=e?.onIssueSelect,this.card=new E({title:"🐛 Issues",variant:"glass"}),this.loadMockIssues(),this.render()}loadMockIssues(){const e=Date.now();this.issues=[{id:"issue-1",title:"Clash entre estrutura e hidráulica",description:"Tubulação de 150mm passa através da viga V-23. Necessário ajuste de projeto.",type:"error",status:"open",priority:"critical",reporter:"Sistema",assignee:"João Silva",createdAt:e-864e5,updatedAt:e-432e5,elementIds:["V-23","TUB-H-045"],comments:[{id:"c1",author:"João Silva",content:"Analisando opções de desvio",timestamp:e-432e5}],labels:["clash","estrutura","hidráulica"]},{id:"issue-2",title:"Altura de pé-direito insuficiente",description:"Sala 205 com pé-direito de 2.35m, abaixo do mínimo de 2.50m",type:"warning",status:"in-progress",priority:"high",reporter:"Maria Santos",assignee:"Carlos Souza",dueDate:e+6048e5,createdAt:e-1728e5,updatedAt:e-216e5,elementIds:["SALA-205"],comments:[],labels:["arquitetura","norma"]},{id:"issue-3",title:"Verificar especificação de vidro",description:"Confirmar se vidro temperado 8mm é adequado para fachada sul",type:"question",status:"open",priority:"medium",reporter:"Ana Lima",createdAt:e-2592e5,updatedAt:e-2592e5,elementIds:["FAC-SUL-01"],comments:[],labels:["fachada","especificação"]},{id:"issue-4",title:"Documentação atualizada",description:"Plantas estruturais revisadas conforme solicitação",type:"info",status:"resolved",priority:"low",reporter:"Pedro Costa",assignee:"Maria Santos",createdAt:e-6048e5,updatedAt:e-864e5,elementIds:[],comments:[{id:"c2",author:"Maria Santos",content:"Documentação aprovada",timestamp:e-864e5}],labels:["documentação"]}]}render(){const e=this.card.getBody();e.innerHTML="";const s=document.createElement("div");s.className="arxis-issues__toolbar";const t=new g({text:"➕ Nova Issue",variant:"primary",size:"sm"});t.getElement().addEventListener("click",()=>this.createIssue());const r=new g({text:"📥 Importar BCF",variant:"secondary",size:"sm"});r.getElement().addEventListener("click",()=>this.importBCF());const n=new g({text:"📤 Exportar BCF",variant:"secondary",size:"sm"});n.getElement().addEventListener("click",()=>this.exportBCF()),s.appendChild(t.getElement()),s.appendChild(r.getElement()),s.appendChild(n.getElement()),e.appendChild(s);const i=document.createElement("div");i.className="arxis-issues__controls";const d=new h({label:"Status:",options:[{value:"all",label:"Todos"},{value:"open",label:"Abertos"},{value:"in-progress",label:"Em Progresso"},{value:"resolved",label:"Resolvidos"},{value:"closed",label:"Fechados"}],value:this.filterStatus,onChange:a=>{this.filterStatus=a,this.render()}}),m=new h({label:"Prioridade:",options:[{value:"all",label:"Todas"},{value:"critical",label:"Crítica"},{value:"high",label:"Alta"},{value:"medium",label:"Média"},{value:"low",label:"Baixa"}],value:this.filterPriority,onChange:a=>{this.filterPriority=a,this.render()}}),x=new h({label:"Ordenar:",options:[{value:"date",label:"Data"},{value:"priority",label:"Prioridade"},{value:"status",label:"Status"},{value:"title",label:"Título"}],value:this.sortBy,onChange:a=>{this.sortBy=a,this.render()}});i.appendChild(d.getElement()),i.appendChild(m.getElement()),i.appendChild(x.getElement()),e.appendChild(i);const c=this.renderSummary();e.appendChild(c);const o=document.createElement("div");o.className="arxis-issues__list";const p=this.getFilteredIssues();if(p.length===0){const a=document.createElement("div");a.className="arxis-issues__empty",a.innerHTML="📋 Nenhuma issue encontrada",o.appendChild(a)}else p.forEach(a=>{const u=this.createIssueItem(a);o.appendChild(u)});e.appendChild(o),this.injectStyles()}renderSummary(){const e=document.createElement("div");e.className="arxis-issues__summary";const s={total:this.issues.length,open:this.issues.filter(t=>t.status==="open").length,inProgress:this.issues.filter(t=>t.status==="in-progress").length,critical:this.issues.filter(t=>t.priority==="critical"&&t.status!=="closed").length};return e.innerHTML=`
      <div class="arxis-issues__summary-item">
        <span class="arxis-issues__summary-value">${s.total}</span>
        <span class="arxis-issues__summary-label">Total</span>
      </div>
      <div class="arxis-issues__summary-item">
        <span class="arxis-issues__summary-value" style="color: #00d4ff;">${s.open}</span>
        <span class="arxis-issues__summary-label">Abertos</span>
      </div>
      <div class="arxis-issues__summary-item">
        <span class="arxis-issues__summary-value" style="color: #ffaa00;">${s.inProgress}</span>
        <span class="arxis-issues__summary-label">Em Progresso</span>
      </div>
      <div class="arxis-issues__summary-item">
        <span class="arxis-issues__summary-value" style="color: #ff4444;">${s.critical}</span>
        <span class="arxis-issues__summary-label">Críticos</span>
      </div>
    `,e}getFilteredIssues(){let e=this.issues.filter(s=>!(this.filterStatus!=="all"&&s.status!==this.filterStatus||this.filterPriority!=="all"&&s.priority!==this.filterPriority));return e.sort((s,t)=>{switch(this.sortBy){case"date":return t.createdAt-s.createdAt;case"priority":const r={critical:0,high:1,medium:2,low:3};return r[s.priority]-r[t.priority];case"status":return s.status.localeCompare(t.status);case"title":return s.title.localeCompare(t.title);default:return 0}}),e}createIssueItem(e){const s=document.createElement("div");s.className=`arxis-issues__item arxis-issues__item--${e.priority}`;const t=document.createElement("div");t.className="arxis-issues__icon-container";const r=document.createElement("div");r.className=`arxis-issues__icon arxis-issues__icon--${e.type}`,r.textContent=this.getTypeIcon(e.type),t.appendChild(r),s.appendChild(t);const n=document.createElement("div");n.className="arxis-issues__content";const i=document.createElement("div");i.className="arxis-issues__header";const d=document.createElement("div");d.className="arxis-issues__title-wrapper";const m=document.createElement("h4");m.className="arxis-issues__title",m.textContent=e.title;const x=document.createElement("span");x.className="arxis-issues__id",x.textContent=e.id,d.appendChild(m),d.appendChild(x);const c=document.createElement("div");c.className="arxis-issues__badges";const o=document.createElement("span");o.className=`arxis-issues__badge arxis-issues__badge--${e.priority}`,o.textContent=this.getPriorityLabel(e.priority);const p=document.createElement("span");p.className=`arxis-issues__badge arxis-issues__badge--${e.status}`,p.textContent=this.getStatusLabel(e.status),c.appendChild(o),c.appendChild(p),i.appendChild(d),i.appendChild(c);const a=document.createElement("p");a.className="arxis-issues__description",a.textContent=e.description;const u=document.createElement("div");u.className="arxis-issues__meta";const v=[`👤 ${e.reporter}`,`📅 ${this.formatDate(e.createdAt)}`,e.assignee?`👥 ${e.assignee}`:null,e.dueDate?`⏰ ${this.formatDate(e.dueDate)}`:null,e.comments.length>0?`💬 ${e.comments.length}`:null,e.elementIds.length>0?`🔗 ${e.elementIds.length} elementos`:null].filter(Boolean);if(u.innerHTML=v.join('<span class="arxis-issues__separator">•</span>'),e.labels.length>0){const l=document.createElement("div");l.className="arxis-issues__labels",e.labels.forEach(C=>{const f=document.createElement("span");f.className="arxis-issues__label",f.textContent=`#${C}`,l.appendChild(f)}),u.appendChild(l)}n.appendChild(i),n.appendChild(a),n.appendChild(u),s.appendChild(n);const _=document.createElement("div");_.className="arxis-issues__actions";const b=new g({text:"👁️",variant:"secondary",size:"sm"});b.getElement().addEventListener("click",l=>{l.stopPropagation(),this.viewIssue(e)});const y=new g({text:"✏️",variant:"secondary",size:"sm"});return y.getElement().addEventListener("click",l=>{l.stopPropagation(),this.editIssue(e)}),_.appendChild(b.getElement()),_.appendChild(y.getElement()),s.appendChild(_),s.addEventListener("click",()=>{this.onIssueSelect?.(e)}),s}getTypeIcon(e){return{error:"❌",warning:"⚠️",info:"ℹ️",question:"❓"}[e]||"📌"}getPriorityLabel(e){return{critical:"Crítica",high:"Alta",medium:"Média",low:"Baixa"}[e]||e}getStatusLabel(e){return{open:"Aberto","in-progress":"Em Progresso",resolved:"Resolvido",closed:"Fechado",rejected:"Rejeitado"}[e]||e}formatDate(e){return new Date(e).toLocaleDateString("pt-BR",{day:"2-digit",month:"short"})}createIssue(){console.log("Criar nova issue")}viewIssue(e){this.onIssueSelect?.(e)}editIssue(e){console.log("Editar issue:",e)}importBCF(){const e=document.createElement("input");e.type="file",e.accept=".bcf,.bcfzip",e.addEventListener("change",s=>{const t=s.target.files?.[0];t&&console.log("Importando BCF:",t.name)}),e.click()}exportBCF(){console.log("Exportando issues como BCF...")}getElement(){return this.card.getElement()}destroy(){this.card.destroy()}injectStyles(){if(document.getElementById("arxis-issues-styles"))return;const e=document.createElement("style");e.id="arxis-issues-styles",e.textContent=`
      .arxis-issues__toolbar {
        display: flex;
        gap: 8px;
        margin-bottom: 12px;
        flex-wrap: wrap;
      }

      .arxis-issues__controls {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 12px;
        margin-bottom: 12px;
      }

      .arxis-issues__summary {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;
        padding: 16px;
        background: rgba(255, 255, 255, 0.03);
        border-radius: 8px;
        margin-bottom: 16px;
      }

      .arxis-issues__summary-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
      }

      .arxis-issues__summary-value {
        font-size: 24px;
        font-weight: 700;
        color: #fff;
      }

      .arxis-issues__summary-label {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
      }

      .arxis-issues__list {
        display: flex;
        flex-direction: column;
        gap: 12px;
        max-height: 500px;
        overflow-y: auto;
      }

      .arxis-issues__item {
        display: flex;
        gap: 12px;
        padding: 16px;
        background: rgba(255, 255, 255, 0.05);
        border-left: 4px solid transparent;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .arxis-issues__item:hover {
        background: rgba(255, 255, 255, 0.08);
        transform: translateX(2px);
      }

      .arxis-issues__item--critical {
        border-left-color: #ff0000;
      }

      .arxis-issues__item--high {
        border-left-color: #ff4444;
      }

      .arxis-issues__item--medium {
        border-left-color: #ffaa00;
      }

      .arxis-issues__item--low {
        border-left-color: #00d4ff;
      }

      .arxis-issues__icon-container {
        display: flex;
        align-items: flex-start;
        padding-top: 4px;
      }

      .arxis-issues__icon {
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        border-radius: 8px;
        flex-shrink: 0;
      }

      .arxis-issues__icon--error {
        background: rgba(255, 68, 68, 0.2);
      }

      .arxis-issues__icon--warning {
        background: rgba(255, 170, 0, 0.2);
      }

      .arxis-issues__icon--info {
        background: rgba(0, 212, 255, 0.2);
      }

      .arxis-issues__icon--question {
        background: rgba(123, 47, 247, 0.2);
      }

      .arxis-issues__content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .arxis-issues__header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
      }

      .arxis-issues__title-wrapper {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1;
      }

      .arxis-issues__title {
        margin: 0;
        font-size: 15px;
        font-weight: 600;
        color: #fff;
      }

      .arxis-issues__id {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.5);
        font-family: monospace;
      }

      .arxis-issues__badges {
        display: flex;
        gap: 6px;
        flex-shrink: 0;
      }

      .arxis-issues__badge {
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 600;
        white-space: nowrap;
      }

      .arxis-issues__badge--critical {
        background: rgba(255, 0, 0, 0.2);
        color: #ff0000;
      }

      .arxis-issues__badge--high {
        background: rgba(255, 68, 68, 0.2);
        color: #ff4444;
      }

      .arxis-issues__badge--medium {
        background: rgba(255, 170, 0, 0.2);
        color: #ffaa00;
      }

      .arxis-issues__badge--low {
        background: rgba(0, 212, 255, 0.2);
        color: #00d4ff;
      }

      .arxis-issues__badge--open {
        background: rgba(0, 212, 255, 0.2);
        color: #00d4ff;
      }

      .arxis-issues__badge--in-progress {
        background: rgba(255, 170, 0, 0.2);
        color: #ffaa00;
      }

      .arxis-issues__badge--resolved {
        background: rgba(76, 175, 80, 0.2);
        color: #4caf50;
      }

      .arxis-issues__badge--closed {
        background: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.6);
      }

      .arxis-issues__description {
        margin: 0;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.8);
        line-height: 1.5;
      }

      .arxis-issues__meta {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
      }

      .arxis-issues__separator {
        color: rgba(255, 255, 255, 0.3);
      }

      .arxis-issues__labels {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 4px;
      }

      .arxis-issues__label {
        padding: 2px 8px;
        background: rgba(123, 47, 247, 0.2);
        border-radius: 10px;
        font-size: 11px;
        color: #7b2ff7;
      }

      .arxis-issues__actions {
        display: flex;
        gap: 6px;
        flex-shrink: 0;
      }

      .arxis-issues__empty {
        text-align: center;
        padding: 60px 20px;
        color: rgba(255, 255, 255, 0.5);
        font-size: 15px;
      }
    `,document.head.appendChild(e)}}export{B as IssuesPanel};
