import{C as s}from"./Card-DLSvBshn.js";class p{card;kpis=[];constructor(){this.card=new s({title:"📊 Dashboard",variant:"glass"}),this.loadKPIs(),this.render()}loadKPIs(){this.kpis=[{id:"elements",label:"Total de Elementos",value:"12,543",icon:"🧱",trend:"up",trendValue:"+2.5%",color:"#00d4ff"},{id:"categories",label:"Categorias",value:24,icon:"📂",color:"#7b2ff7"},{id:"issues",label:"Issues Abertas",value:15,icon:"🐛",trend:"down",trendValue:"-8",color:"#ff4444"},{id:"annotations",label:"Anotações",value:47,icon:"📝",trend:"up",trendValue:"+12",color:"#ffaa00"},{id:"model-size",label:"Tamanho do Modelo",value:"248",unit:"MB",icon:"💾",color:"#4caf50"},{id:"collaborators",label:"Colaboradores",value:8,icon:"👥",trend:"up",trendValue:"+2",color:"#00d4ff"}]}render(){const e=this.card.getBody();e.innerHTML="";const t=document.createElement("div");t.className="arxis-dashboard__grid",this.kpis.forEach(d=>{const r=this.createKPIWidget(d);t.appendChild(r)}),e.appendChild(t),this.injectStyles()}createKPIWidget(e){const t=document.createElement("div");t.className="arxis-dashboard__kpi",t.style.borderLeftColor=e.color||"#00d4ff";const d=document.createElement("div");if(d.className="arxis-dashboard__kpi-header",e.icon){const a=document.createElement("div");a.className="arxis-dashboard__kpi-icon",a.textContent=e.icon,a.style.color=e.color||"#00d4ff",d.appendChild(a)}const r=document.createElement("div");r.className="arxis-dashboard__kpi-label",r.textContent=e.label,d.appendChild(r),t.appendChild(d);const o=document.createElement("div");o.className="arxis-dashboard__kpi-value-container";const n=document.createElement("div");if(n.className="arxis-dashboard__kpi-value",n.textContent=e.value.toString(),e.unit){const a=document.createElement("span");a.className="arxis-dashboard__kpi-unit",a.textContent=` ${e.unit}`,n.appendChild(a)}if(o.appendChild(n),e.trend&&e.trendValue){const a=document.createElement("div");a.className=`arxis-dashboard__kpi-trend arxis-dashboard__kpi-trend--${e.trend}`;const i=e.trend==="up"?"▲":e.trend==="down"?"▼":"●";a.textContent=`${i} ${e.trendValue}`,o.appendChild(a)}return t.appendChild(o),t}updateKPI(e,t,d){const r=this.kpis.find(o=>o.id===e);r&&(r.value=t,d!==void 0&&(r.trendValue=d),this.render())}getElement(){return this.card.getElement()}destroy(){this.card.destroy()}injectStyles(){if(document.getElementById("arxis-dashboard-styles"))return;const e=document.createElement("style");e.id="arxis-dashboard-styles",e.textContent=`
      .arxis-dashboard__grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 16px;
      }

      .arxis-dashboard__kpi {
        padding: 16px;
        background: rgba(255, 255, 255, 0.04);
        border-radius: 8px;
        border-left: 4px solid #00d4ff;
        transition: all 0.2s;
      }

      .arxis-dashboard__kpi:hover {
        background: rgba(255, 255, 255, 0.08);
        transform: translateY(-3px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
      }

      .arxis-dashboard__kpi-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
      }

      .arxis-dashboard__kpi-icon {
        font-size: 20px;
      }

      .arxis-dashboard__kpi-label {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
        font-weight: 500;
      }

      .arxis-dashboard__kpi-value-container {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .arxis-dashboard__kpi-value {
        font-size: 28px;
        font-weight: 700;
        color: #fff;
        line-height: 1;
      }

      .arxis-dashboard__kpi-unit {
        font-size: 16px;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.6);
      }

      .arxis-dashboard__kpi-trend {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 600;
        align-self: flex-start;
      }

      .arxis-dashboard__kpi-trend--up {
        background: rgba(76, 175, 80, 0.2);
        color: #4caf50;
      }

      .arxis-dashboard__kpi-trend--down {
        background: rgba(255, 68, 68, 0.2);
        color: #ff4444;
      }

      .arxis-dashboard__kpi-trend--neutral {
        background: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.6);
      }
    `,document.head.appendChild(e)}}export{p as DashboardWidget};
