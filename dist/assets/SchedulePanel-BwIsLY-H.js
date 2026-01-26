import{C as p}from"./Card-DLSvBshn.js";import{I as m}from"./Input-vZvnrYWf.js";import{S as u}from"./Select-D01wDXMy.js";class y{card;activities=[];filteredActivities=[];sortBy="startDate";filterStatus="all";constructor(){this.card=new p({title:"📅 Cronograma (4D)",collapsible:!0}),this.loadMockActivities(),this.applyFilters(),this.buildUI(),this.applyStyles()}loadMockActivities(){const e=new Date("2025-01-01");this.activities=[{id:"1",name:"Mobilização de canteiro",code:"A-001",startDate:new Date(e),endDate:new Date(e.getTime()+7200*60*1e3),duration:5,progress:100,predecessors:[],resources:[{type:"labor",name:"Operários",quantity:4,unit:"pessoas",cost:200},{type:"equipment",name:"Containers",quantity:2,unit:"un",cost:500}],elementIds:[],status:"completed",criticality:"critical"},{id:"2",name:"Escavação",code:"A-002",startDate:new Date(e.getTime()+7200*60*1e3),endDate:new Date(e.getTime()+14400*60*1e3),duration:5,progress:100,predecessors:["1"],resources:[{type:"labor",name:"Operadores",quantity:2,unit:"pessoas",cost:300},{type:"equipment",name:"Retroescavadeira",quantity:1,unit:"un",cost:800}],elementIds:["excavation-1"],status:"completed",criticality:"critical"},{id:"3",name:"Fundação - Estacas",code:"A-003",startDate:new Date(e.getTime()+14400*60*1e3),endDate:new Date(e.getTime()+432*60*60*1e3),duration:8,progress:80,predecessors:["2"],resources:[{type:"labor",name:"Especialistas",quantity:6,unit:"pessoas",cost:450},{type:"equipment",name:"Bate-estaca",quantity:1,unit:"un",cost:1200},{type:"material",name:"Concreto",quantity:15,unit:"m³",cost:350}],elementIds:["pile-1","pile-2","pile-3"],status:"active",criticality:"critical"},{id:"4",name:"Fundação - Blocos",code:"A-004",startDate:new Date(e.getTime()+432*60*60*1e3),endDate:new Date(e.getTime()+552*60*60*1e3),duration:5,progress:30,predecessors:["3"],resources:[{type:"labor",name:"Pedreiros",quantity:8,unit:"pessoas",cost:320},{type:"material",name:"Concreto",quantity:25,unit:"m³",cost:350},{type:"material",name:"Aço",quantity:1.5,unit:"ton",cost:4500}],elementIds:["foundation-1","foundation-2"],status:"active",criticality:"critical"},{id:"5",name:"Estrutura - 1º Pavimento",code:"A-005",startDate:new Date(e.getTime()+552*60*60*1e3),endDate:new Date(e.getTime()+840*60*60*1e3),duration:12,progress:0,predecessors:["4"],resources:[{type:"labor",name:"Equipe estrutura",quantity:12,unit:"pessoas",cost:400},{type:"equipment",name:"Betoneira",quantity:1,unit:"un",cost:300},{type:"material",name:"Concreto",quantity:45,unit:"m³",cost:350}],elementIds:["column-1","beam-1","slab-1"],status:"planned",criticality:"critical"}]}applyFilters(){this.filteredActivities=this.activities.filter(e=>this.filterStatus==="all"?!0:e.status===this.filterStatus),this.filteredActivities.sort((e,t)=>{switch(this.sortBy){case"startDate":return e.startDate.getTime()-t.startDate.getTime();case"code":return e.code.localeCompare(t.code);case"duration":return t.duration-e.duration;case"progress":return t.progress-e.progress;default:return 0}})}buildUI(){const e=document.createElement("div");e.className="schedule-panel";const t=this.createControls();e.appendChild(t);const a=this.createStats();e.appendChild(a);const i=this.createActivityList();e.appendChild(i);const c=this.createCriticalPath();e.appendChild(c),this.card.setBody(e)}createControls(){const e=document.createElement("div");e.className="schedule-controls";const t=new m({placeholder:"Buscar atividade...",icon:"🔍",size:"sm",onChange:l=>this.searchActivities(l)});e.appendChild(t.getElement());const a=document.createElement("div");a.className="schedule-filter-row";const i=new u({options:[{value:"all",label:"Todos os status"},{value:"planned",label:"Planejadas"},{value:"active",label:"Em andamento"},{value:"completed",label:"Concluídas"},{value:"delayed",label:"Atrasadas"}],value:this.filterStatus,size:"sm",onChange:l=>{this.filterStatus=l,this.applyFilters(),this.buildUI()}});a.appendChild(i.getElement());const c=new u({options:[{value:"startDate",label:"Data de início"},{value:"code",label:"Código"},{value:"duration",label:"Duração"},{value:"progress",label:"Progresso"}],value:this.sortBy,size:"sm",onChange:l=>{this.sortBy=l,this.applyFilters(),this.buildUI()}});return a.appendChild(c.getElement()),e.appendChild(a),e}createStats(){const e=document.createElement("div");e.className="schedule-stats";const t=this.activities.length,a=this.activities.filter(s=>s.status==="completed").length,i=this.activities.filter(s=>s.status==="active").length,c=this.activities.filter(s=>s.status==="planned").length,l=this.activities.reduce((s,n)=>s+n.progress,0)/t;return[{label:"Total",value:t,color:"#667eea"},{label:"Concluídas",value:a,color:"#00ff88"},{label:"Em andamento",value:i,color:"#ffd700"},{label:"Planejadas",value:c,color:"#64b5f6"},{label:"Progresso médio",value:`${l.toFixed(0)}%`,color:"#f093fb"}].forEach(s=>{const n=document.createElement("div");n.className="schedule-stat",n.innerHTML=`
        <div class="schedule-stat-value" style="color: ${s.color}">${s.value}</div>
        <div class="schedule-stat-label">${s.label}</div>
      `,e.appendChild(n)}),e}createActivityList(){const e=document.createElement("div");e.className="schedule-activity-list";const t=document.createElement("div");return t.className="schedule-activity-header",t.innerHTML=`
      <div>Código</div>
      <div>Atividade</div>
      <div>Início</div>
      <div>Duração</div>
      <div>Progresso</div>
      <div>Status</div>
    `,e.appendChild(t),this.filteredActivities.forEach(a=>{const i=this.createActivityItem(a);e.appendChild(i)}),e}createActivityItem(e){const t=document.createElement("div");t.className="schedule-activity-item",e.criticality==="critical"&&t.classList.add("schedule-activity-item--critical");const a=document.createElement("div");a.className="schedule-activity-code",a.textContent=e.code,t.appendChild(a);const i=document.createElement("div");i.className="schedule-activity-name",i.textContent=e.name,t.appendChild(i);const c=document.createElement("div");c.className="schedule-activity-date",c.textContent=e.startDate.toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"}),t.appendChild(c);const l=document.createElement("div");l.className="schedule-activity-duration",l.textContent=`${e.duration}d`,t.appendChild(l);const r=document.createElement("div");r.className="schedule-activity-progress";const s=document.createElement("div");s.className="schedule-progress-bar";const n=document.createElement("div");n.className="schedule-progress-fill",n.style.width=`${e.progress}%`,s.appendChild(n);const d=document.createElement("span");d.textContent=`${e.progress}%`,r.appendChild(s),r.appendChild(d),t.appendChild(r);const o=document.createElement("div");return o.className=`schedule-activity-status schedule-activity-status--${e.status}`,o.textContent=this.getStatusLabel(e.status),t.appendChild(o),t.addEventListener("click",()=>{this.showActivityDetails(e)}),t}createCriticalPath(){const e=document.createElement("div");e.className="schedule-critical-section";const t=document.createElement("div");t.className="schedule-critical-header",t.innerHTML=`
      <span>⚠️ Caminho Crítico</span>
      <span class="schedule-critical-count">${this.activities.filter(c=>c.criticality==="critical").length} atividades</span>
    `,e.appendChild(t);const a=this.activities.filter(c=>c.criticality==="critical"),i=document.createElement("div");return i.className="schedule-critical-chain",a.forEach((c,l)=>{const r=document.createElement("div");if(r.className="schedule-critical-node",r.textContent=c.code,i.appendChild(r),l<a.length-1){const s=document.createElement("div");s.className="schedule-critical-arrow",s.textContent="→",i.appendChild(s)}}),e.appendChild(i),e}searchActivities(e){if(!e.trim())this.applyFilters();else{const a=e.toLowerCase();this.filteredActivities=this.activities.filter(i=>i.name.toLowerCase().includes(a)||i.code.toLowerCase().includes(a))}const t=this.card.getElement().querySelector(".schedule-activity-list");if(t){t.innerHTML="";const a=document.createElement("div");a.className="schedule-activity-header",a.innerHTML=`
        <div>Código</div>
        <div>Atividade</div>
        <div>Início</div>
        <div>Duração</div>
        <div>Progresso</div>
        <div>Status</div>
      `,t.appendChild(a),this.filteredActivities.forEach(i=>{t.appendChild(this.createActivityItem(i))})}}showActivityDetails(e){console.log("Atividade:",e)}getStatusLabel(e){return{planned:"Planejada",active:"Em andamento",completed:"Concluída",delayed:"Atrasada"}[e]||e}applyStyles(){if(document.getElementById("schedule-panel-styles"))return;const e=document.createElement("style");e.id="schedule-panel-styles",e.textContent=`
      .schedule-panel {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .schedule-controls {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .schedule-filter-row {
        display: flex;
        gap: 8px;
      }

      .schedule-filter-row > * {
        flex: 1;
      }

      .schedule-stats {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 12px;
        padding: 12px;
        background: rgba(255, 255, 255, 0.03);
        border-radius: 8px;
      }

      .schedule-stat {
        text-align: center;
      }

      .schedule-stat-value {
        font-size: 20px;
        font-weight: 700;
        margin-bottom: 4px;
      }

      .schedule-stat-label {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.6);
      }

      .schedule-activity-list {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .schedule-activity-header {
        display: grid;
        grid-template-columns: 80px 2fr 80px 80px 140px 100px;
        gap: 12px;
        padding: 8px 12px;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.5);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .schedule-activity-item {
        display: grid;
        grid-template-columns: 80px 2fr 80px 80px 140px 100px;
        gap: 12px;
        padding: 12px;
        background: rgba(255, 255, 255, 0.03);
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.15s ease;
        font-size: 13px;
        align-items: center;
      }

      .schedule-activity-item:hover {
        background: rgba(255, 255, 255, 0.08);
      }

      .schedule-activity-item--critical {
        border-left: 3px solid #f5576c;
      }

      .schedule-activity-code {
        font-weight: 600;
        font-family: 'Courier New', monospace;
        color: var(--theme-accent, #00ff88);
      }

      .schedule-activity-name {
        color: var(--theme-foreground, #fff);
      }

      .schedule-activity-date {
        color: rgba(255, 255, 255, 0.7);
      }

      .schedule-activity-duration {
        font-family: 'Courier New', monospace;
        color: rgba(255, 255, 255, 0.7);
      }

      .schedule-activity-progress {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .schedule-progress-bar {
        flex: 1;
        height: 6px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
        overflow: hidden;
      }

      .schedule-progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #00ff88 0%, #00d9ff 100%);
        transition: width 0.3s ease;
      }

      .schedule-activity-progress span {
        font-size: 11px;
        font-weight: 600;
        font-family: 'Courier New', monospace;
        color: var(--theme-accent, #00ff88);
        min-width: 35px;
      }

      .schedule-activity-status {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
        text-align: center;
      }

      .schedule-activity-status--planned {
        background: rgba(100, 181, 246, 0.2);
        color: #64b5f6;
      }

      .schedule-activity-status--active {
        background: rgba(255, 215, 0, 0.2);
        color: #ffd700;
      }

      .schedule-activity-status--completed {
        background: rgba(0, 255, 136, 0.2);
        color: #00ff88;
      }

      .schedule-activity-status--delayed {
        background: rgba(245, 87, 108, 0.2);
        color: #f5576c;
      }

      .schedule-critical-section {
        padding: 16px;
        background: rgba(245, 87, 108, 0.05);
        border: 1px solid rgba(245, 87, 108, 0.2);
        border-radius: 8px;
      }

      .schedule-critical-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        font-size: 14px;
        font-weight: 600;
      }

      .schedule-critical-count {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
      }

      .schedule-critical-chain {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }

      .schedule-critical-node {
        padding: 8px 12px;
        background: rgba(245, 87, 108, 0.2);
        border: 1px solid #f5576c;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;
        font-family: 'Courier New', monospace;
        color: #f5576c;
      }

      .schedule-critical-arrow {
        font-size: 16px;
        color: #f5576c;
      }
    `,document.head.appendChild(e)}getElement(){return this.card.getElement()}destroy(){this.card.destroy()}}export{y as SchedulePanel};
