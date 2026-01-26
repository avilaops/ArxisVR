import{C as o}from"./Card-DLSvBshn.js";class y{card;assets=[];constructor(){this.card=new o({title:"🏢 Facilities (6D)"}),this.loadMockAssets(),this.buildUI(),this.applyStyles()}loadMockAssets(){this.assets=[{id:"1",name:"Sistema HVAC - 1º Pav",type:"HVAC",location:"1º Pavimento",status:"operational",lastMaintenance:new Date("2025-12-01"),nextMaintenance:new Date("2026-03-01"),energyConsumption:1250},{id:"2",name:"Elevador Principal",type:"Elevador",location:"Central",status:"operational",lastMaintenance:new Date("2026-01-10"),nextMaintenance:new Date("2026-02-10"),energyConsumption:380}]}buildUI(){const t=document.createElement("div");t.className="facility-panel";const e=document.createElement("div");e.className="facility-summary";const l=this.assets.filter(i=>i.status==="operational").length,n=this.assets.reduce((i,a)=>i+a.energyConsumption,0);e.innerHTML=`
      <div class="facility-summary-item">
        <div class="facility-summary-value">${this.assets.length}</div>
        <div class="facility-summary-label">Ativos Totais</div>
      </div>
      <div class="facility-summary-item">
        <div class="facility-summary-value" style="color: #00ff88">${l}</div>
        <div class="facility-summary-label">Operacionais</div>
      </div>
      <div class="facility-summary-item">
        <div class="facility-summary-value" style="color: #ffd700">${n}</div>
        <div class="facility-summary-label">kWh/mês</div>
      </div>
    `,t.appendChild(e);const s=document.createElement("div");s.className="facility-list",this.assets.forEach(i=>{const a=document.createElement("div");a.className="facility-item";const c=i.status==="operational"?"✅":"⚠️";a.innerHTML=`
        <div class="facility-item-header">
          <span class="facility-item-status">${c}</span>
          <span class="facility-item-name">${i.name}</span>
        </div>
        <div class="facility-item-info">
          <div>📍 ${i.location}</div>
          <div>⚡ ${i.energyConsumption} kWh/mês</div>
          <div>🔧 Próxima: ${i.nextMaintenance.toLocaleDateString("pt-BR")}</div>
        </div>
      `,s.appendChild(a)}),t.appendChild(s),this.card.getBody().appendChild(t)}applyStyles(){if(document.getElementById("facility-panel-styles"))return;const t=document.createElement("style");t.id="facility-panel-styles",t.textContent=`
      .facility-panel {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .facility-summary {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
      }

      .facility-summary-item {
        padding: 16px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        text-align: center;
      }

      .facility-summary-value {
        font-size: 24px;
        font-weight: 700;
        color: #667eea;
        margin-bottom: 4px;
      }

      .facility-summary-label {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.6);
      }

      .facility-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .facility-item {
        padding: 12px;
        background: rgba(255, 255, 255, 0.03);
        border-radius: 8px;
      }

      .facility-item-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
      }

      .facility-item-name {
        font-weight: 600;
        color: var(--theme-foreground, #fff);
      }

      .facility-item-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
      }
    `,document.head.appendChild(t)}getElement(){return this.card.getElement()}destroy(){this.card.destroy()}}export{y as FacilityPanel};
