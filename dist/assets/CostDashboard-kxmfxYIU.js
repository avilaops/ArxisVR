import{C as d}from"./Card-DLSvBshn.js";class m{card;costs=[];totalBudget=0;spent=0;constructor(){this.card=new d({title:"💰 Custos (5D)"}),this.loadMockCosts(),this.buildUI(),this.applyStyles()}loadMockCosts(){this.costs=[{id:"1",category:"Fundação",description:"Concreto estrutural",quantity:45,unit:"m³",unitCost:350,totalCost:15750,elementIds:["foundation-1"]},{id:"2",category:"Estrutura",description:"Aço CA-50",quantity:2.5,unit:"ton",unitCost:4500,totalCost:11250,elementIds:["column-1"]}],this.totalBudget=5e5,this.spent=this.costs.reduce((t,s)=>t+s.totalCost,0)}buildUI(){const t=document.createElement("div");t.className="cost-dashboard";const s=document.createElement("div");s.className="cost-summary";const i=this.totalBudget-this.spent,c=this.spent/this.totalBudget*100;s.innerHTML=`
      <div class="cost-summary-item">
        <div class="cost-summary-value">R$ ${this.formatMoney(this.totalBudget)}</div>
        <div class="cost-summary-label">Orçamento Total</div>
      </div>
      <div class="cost-summary-item">
        <div class="cost-summary-value cost-summary-value--spent">R$ ${this.formatMoney(this.spent)}</div>
        <div class="cost-summary-label">Gasto (${c.toFixed(1)}%)</div>
      </div>
      <div class="cost-summary-item">
        <div class="cost-summary-value cost-summary-value--remaining">R$ ${this.formatMoney(i)}</div>
        <div class="cost-summary-label">Restante</div>
      </div>
    `,t.appendChild(s);const o=document.createElement("div");o.className="cost-list",this.costs.forEach(e=>{const a=document.createElement("div");a.className="cost-item",a.innerHTML=`
        <div class="cost-item-category">${e.category}</div>
        <div class="cost-item-desc">${e.description}</div>
        <div class="cost-item-qty">${e.quantity} ${e.unit}</div>
        <div class="cost-item-total">R$ ${this.formatMoney(e.totalCost)}</div>
      `,o.appendChild(a)}),t.appendChild(o),this.card.getBody().appendChild(t)}formatMoney(t){return t.toLocaleString("pt-BR",{minimumFractionDigits:2})}applyStyles(){if(document.getElementById("cost-dashboard-styles"))return;const t=document.createElement("style");t.id="cost-dashboard-styles",t.textContent=`
      .cost-dashboard {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .cost-summary {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
      }

      .cost-summary-item {
        padding: 16px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        text-align: center;
      }

      .cost-summary-value {
        font-size: 24px;
        font-weight: 700;
        color: #667eea;
        margin-bottom: 4px;
      }

      .cost-summary-value--spent {
        color: #ffd700;
      }

      .cost-summary-value--remaining {
        color: #00ff88;
      }

      .cost-summary-label {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
      }

      .cost-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .cost-item {
        display: grid;
        grid-template-columns: 120px 2fr 100px 120px;
        gap: 12px;
        padding: 12px;
        background: rgba(255, 255, 255, 0.03);
        border-radius: 6px;
        font-size: 13px;
        align-items: center;
      }

      .cost-item-category {
        font-weight: 600;
        color: var(--theme-accent, #00ff88);
      }

      .cost-item-total {
        font-weight: 700;
        color: #ffd700;
        text-align: right;
      }
    `,document.head.appendChild(t)}getElement(){return this.card.getElement()}destroy(){this.card.destroy()}}export{m as CostDashboard};
