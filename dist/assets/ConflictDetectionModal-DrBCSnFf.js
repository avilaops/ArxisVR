import{M as m}from"./Modal-C4dtqQB0.js";import{B as c}from"./Button-BvNVdej2.js";import{S as r}from"./Select-D01wDXMy.js";class v{modal;clashes=[];filterSeverity="all";constructor(){this.modal=new m({title:"⚠️ Detecção de Conflitos",size:"lg",closeOnEscape:!0}),this.loadMockClashes(),this.buildUI(),this.applyStyles()}loadMockClashes(){this.clashes=[{id:"c1",severity:"critical",elementA:"Viga V-12",elementB:"Duto HVAC-05",description:"Interferência entre viga estrutural e duto de ar condicionado",location:"2º Pavimento - Eixo D/E",status:"open"},{id:"c2",severity:"warning",elementA:"Tubulação hidráulica PH-08",elementB:"Eletroduto EL-23",description:"Cruzamento de tubulação com eletroduto",location:"1º Pavimento - Banheiro",status:"open"},{id:"c3",severity:"critical",elementA:"Pilar P-15",elementB:"Parede PAR-42",description:"Sobreposição de pilar com alvenaria",location:"Térreo - Sala 3",status:"resolved"}]}buildUI(){const t=document.createElement("div");t.className="conflict-modal";const s=this.createStats();t.appendChild(s);const e=document.createElement("div");e.className="conflict-filters";const i=new r({label:"Severidade",options:[{value:"all",label:"Todos"},{value:"critical",label:"Críticos"},{value:"warning",label:"Avisos"},{value:"info",label:"Info"}],value:this.filterSeverity,onChange:p=>{this.filterSeverity=p,this.updateList()}}),o=new r({label:"Status",options:[{value:"all",label:"Todos"},{value:"open",label:"Abertos"},{value:"resolved",label:"Resolvidos"},{value:"ignored",label:"Ignorados"}],value:"all",onChange:()=>this.updateList()});e.appendChild(i.getElement()),e.appendChild(o.getElement()),t.appendChild(e);const l=this.createClashList();t.appendChild(l);const a=document.createElement("div");a.className="conflict-actions";const d=new c({text:"📄 Exportar BCF",variant:"primary",onClick:()=>this.exportBCF()}),f=new c({text:"📊 Gerar Relatório",variant:"secondary",onClick:()=>this.generateReport()});a.appendChild(d.getElement()),a.appendChild(f.getElement()),t.appendChild(a),this.modal.setContent(t)}createStats(){const t=document.createElement("div");t.className="conflict-stats";const s=this.clashes.length,e=this.clashes.filter(l=>l.severity==="critical").length,i=this.clashes.filter(l=>l.status==="open").length,o=this.clashes.filter(l=>l.status==="resolved").length;return t.innerHTML=`
      <div class="conflict-stat">
        <div class="conflict-stat-value">${s}</div>
        <div class="conflict-stat-label">Total</div>
      </div>
      <div class="conflict-stat">
        <div class="conflict-stat-value" style="color: #f5576c">${e}</div>
        <div class="conflict-stat-label">Críticos</div>
      </div>
      <div class="conflict-stat">
        <div class="conflict-stat-value" style="color: #ffd700">${i}</div>
        <div class="conflict-stat-label">Abertos</div>
      </div>
      <div class="conflict-stat">
        <div class="conflict-stat-value" style="color: #00ff88">${o}</div>
        <div class="conflict-stat-label">Resolvidos</div>
      </div>
    `,t}createClashList(){const t=document.createElement("div");return t.className="conflict-list",t.id="conflict-list",this.renderClashes(t),t}renderClashes(t){t.innerHTML="",(this.filterSeverity==="all"?this.clashes:this.clashes.filter(e=>e.severity===this.filterSeverity)).forEach(e=>{const i=document.createElement("div");i.className=`conflict-item conflict-item--${e.severity}`;const o={critical:"🔴",warning:"🟡",info:"🔵"};i.innerHTML=`
        <div class="conflict-item-header">
          <span class="conflict-item-severity">${o[e.severity]}</span>
          <span class="conflict-item-id">${e.id}</span>
          <span class="conflict-item-status conflict-item-status--${e.status}">${e.status}</span>
        </div>
        <div class="conflict-item-elements">
          <span>${e.elementA}</span>
          <span class="conflict-item-vs">⚡</span>
          <span>${e.elementB}</span>
        </div>
        <div class="conflict-item-desc">${e.description}</div>
        <div class="conflict-item-location">📍 ${e.location}</div>
      `,i.addEventListener("click",()=>this.showClashDetails(e)),t.appendChild(i)})}updateList(){const t=document.getElementById("conflict-list");t&&this.renderClashes(t)}showClashDetails(t){console.log("Clash details:",t)}exportBCF(){console.log("📄 Exportando BCF...")}generateReport(){console.log("📊 Gerando relatório...")}open(){this.modal.open()}applyStyles(){if(document.getElementById("conflict-modal-styles"))return;const t=document.createElement("style");t.id="conflict-modal-styles",t.textContent=`
      .conflict-modal {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .conflict-stats {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;
      }

      .conflict-stat {
        padding: 16px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        text-align: center;
      }

      .conflict-stat-value {
        font-size: 28px;
        font-weight: 700;
        color: #667eea;
        margin-bottom: 4px;
      }

      .conflict-stat-label {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.6);
      }

      .conflict-filters {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }

      .conflict-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-height: 400px;
        overflow-y: auto;
      }

      .conflict-item {
        padding: 16px;
        background: rgba(255, 255, 255, 0.03);
        border-radius: 8px;
        border-left: 4px solid;
        cursor: pointer;
        transition: all 0.15s ease;
      }

      .conflict-item:hover {
        background: rgba(255, 255, 255, 0.08);
      }

      .conflict-item--critical {
        border-color: #f5576c;
      }

      .conflict-item--warning {
        border-color: #ffd700;
      }

      .conflict-item--info {
        border-color: #64b5f6;
      }

      .conflict-item-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
      }

      .conflict-item-id {
        font-family: 'Courier New', monospace;
        font-weight: 600;
        color: var(--theme-accent, #00ff88);
      }

      .conflict-item-status {
        margin-left: auto;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
      }

      .conflict-item-status--open {
        background: rgba(255, 215, 0, 0.2);
        color: #ffd700;
      }

      .conflict-item-status--resolved {
        background: rgba(0, 255, 136, 0.2);
        color: #00ff88;
      }

      .conflict-item-status--ignored {
        background: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.6);
      }

      .conflict-item-elements {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
        font-weight: 600;
        font-size: 14px;
      }

      .conflict-item-vs {
        color: #f5576c;
        font-size: 16px;
      }

      .conflict-item-desc {
        font-size: 13px;
        color: rgba(255, 255, 255, 0.8);
        margin-bottom: 6px;
      }

      .conflict-item-location {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
      }

      .conflict-actions {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        padding-top: 16px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }
    `,document.head.appendChild(t)}destroy(){this.modal.destroy()}}function b(){const n=new v;return n.open(),n}export{v as ConflictDetectionModal,b as openConflictDetectionModal};
