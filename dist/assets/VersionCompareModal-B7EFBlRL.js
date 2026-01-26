import{M as d}from"./Modal-C4dtqQB0.js";import{S as a}from"./Select-D01wDXMy.js";class l{modal;versions=[];versionA="";versionB="";constructor(){this.modal=new d({title:"🔄 Comparar Versões",size:"lg",closeOnEscape:!0}),this.loadMockVersions(),this.buildUI(),this.applyStyles()}loadMockVersions(){this.versions=[{id:"v3",name:"Versão 3.0 - Final",date:new Date("2026-01-20"),author:"João Silva",changes:45},{id:"v2",name:"Versão 2.5 - Revisão",date:new Date("2026-01-15"),author:"Maria Santos",changes:28},{id:"v1",name:"Versão 2.0 - Base",date:new Date("2026-01-10"),author:"João Silva",changes:0}],this.versionA=this.versions[0].id,this.versionB=this.versions[1].id}buildUI(){const e=document.createElement("div");e.className="version-compare-modal";const o=document.createElement("div");o.className="version-selectors";const n=new a({label:"Versão A",options:this.versions.map(s=>({value:s.id,label:s.name})),value:this.versionA,onChange:s=>{this.versionA=s,this.updateComparison()}}),t=new a({label:"Versão B",options:this.versions.map(s=>({value:s.id,label:s.name})),value:this.versionB,onChange:s=>{this.versionB=s,this.updateComparison()}});o.appendChild(n.getElement()),o.appendChild(t.getElement()),e.appendChild(o);const i=document.createElement("div");i.className="version-comparison",i.id="version-comparison",this.renderComparison(i),e.appendChild(i);const m=this.createSummary();e.appendChild(m),this.modal.setContent(e)}renderComparison(e){e.innerHTML=`
      <div class="version-view">
        <div class="version-view-header">Versão A</div>
        <div class="version-view-content">🏗️ Modelo carregado</div>
      </div>
      <div class="version-view">
        <div class="version-view-header">Versão B</div>
        <div class="version-view-content">🏗️ Modelo carregado</div>
      </div>
    `}createSummary(){const e=document.createElement("div");return e.className="version-summary",e.innerHTML=`
      <div class="version-summary-title">📊 Resumo de Alterações</div>
      <div class="version-summary-items">
        <div class="version-summary-item version-summary-item--added">
          <span class="version-summary-count">12</span>
          <span class="version-summary-label">Adicionados</span>
        </div>
        <div class="version-summary-item version-summary-item--modified">
          <span class="version-summary-count">8</span>
          <span class="version-summary-label">Modificados</span>
        </div>
        <div class="version-summary-item version-summary-item--removed">
          <span class="version-summary-count">3</span>
          <span class="version-summary-label">Removidos</span>
        </div>
      </div>
    `,e}updateComparison(){console.log(`Comparando ${this.versionA} com ${this.versionB}`)}open(){this.modal.open()}applyStyles(){if(document.getElementById("version-compare-styles"))return;const e=document.createElement("style");e.id="version-compare-styles",e.textContent=`
      .version-compare-modal {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .version-selectors {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }

      .version-comparison {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        min-height: 400px;
      }

      .version-view {
        display: flex;
        flex-direction: column;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .version-view-header {
        padding: 12px;
        background: rgba(255, 255, 255, 0.05);
        font-weight: 600;
        text-align: center;
      }

      .version-view-content {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.3);
        font-size: 48px;
      }

      .version-summary {
        padding: 16px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
      }

      .version-summary-title {
        font-weight: 600;
        margin-bottom: 12px;
      }

      .version-summary-items {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
      }

      .version-summary-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 12px;
        border-radius: 6px;
      }

      .version-summary-item--added {
        background: rgba(0, 255, 136, 0.1);
      }

      .version-summary-item--modified {
        background: rgba(255, 215, 0, 0.1);
      }

      .version-summary-item--removed {
        background: rgba(245, 87, 108, 0.1);
      }

      .version-summary-count {
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 4px;
      }

      .version-summary-item--added .version-summary-count {
        color: #00ff88;
      }

      .version-summary-item--modified .version-summary-count {
        color: #ffd700;
      }

      .version-summary-item--removed .version-summary-count {
        color: #f5576c;
      }

      .version-summary-label {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
      }
    `,document.head.appendChild(e)}destroy(){this.modal.destroy()}}function p(){const r=new l;return r.open(),r}export{l as VersionCompareModal,p as openVersionCompareModal};
