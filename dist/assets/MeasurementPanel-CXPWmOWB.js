import{B as m}from"./Button-BvNVdej2.js";import{T as d}from"./Toggle-D3VS2hV5.js";import{S as u}from"./Select-D01wDXMy.js";import{e as l,E as i,T as p}from"./index-CqlxQ_W-.js";class y{container;measurements=[];activeTool=null;constructor(){this.container=this.createContainer(),this.applyStyles(),this.setupEventListeners(),this.render()}createContainer(){const e=document.createElement("div");e.className="measurement-panel";const t=document.createElement("div");t.className="measurement-panel-header";const n=document.createElement("h3");n.textContent="📏 Medições",t.appendChild(n);const s=new m({icon:"🗑️",variant:"danger",size:"sm",tooltip:"Limpar todas",onClick:()=>this.clearAll()});t.appendChild(s.getElement()),e.appendChild(t);const a=this.createToolsSection();e.appendChild(a);const o=document.createElement("div");return o.className="measurement-list",e.appendChild(o),e}createToolsSection(){const e=document.createElement("div");e.className="measurement-tools",[{type:"distance",icon:"📏",label:"Distância"},{type:"area",icon:"📐",label:"Área"},{type:"volume",icon:"📦",label:"Volume"},{type:"angle",icon:"📐",label:"Ângulo"}].forEach(a=>{const o=new m({text:a.label,icon:a.icon,variant:this.activeTool===a.type?"primary":"secondary",size:"md",fullWidth:!0,onClick:()=>this.activateTool(a.type)});e.appendChild(o.getElement())});const n=new u({label:"Unidade",options:[{value:"mm",label:"Milímetros (mm)"},{value:"cm",label:"Centímetros (cm)"},{value:"m",label:"Metros (m)"},{value:"km",label:"Quilômetros (km)"},{value:"in",label:"Polegadas (in)"},{value:"ft",label:"Pés (ft)"}],value:"m",fullWidth:!0,onChange:a=>console.log("Unit changed:",a)});e.appendChild(n.getElement());const s=new d({label:"Alta precisão",checked:!0,onChange:a=>console.log("Precision:",a)});return e.appendChild(s.getElement()),e}activateTool(e){this.activeTool=e,this.container.querySelectorAll(".measurement-tools button").forEach((n,s)=>{s===["distance","area","volume","angle"].indexOf(e)?(n.classList.add("arxis-button--primary"),n.classList.remove("arxis-button--secondary")):(n.classList.remove("arxis-button--primary"),n.classList.add("arxis-button--secondary"))}),l.emit(i.TOOL_ACTIVATED,{tool:p.MEASUREMENT,measurementType:e}),console.log(`Measurement tool activated: ${e}`)}addMeasurement(e){const t={...e,id:`measurement-${Date.now()}`,timestamp:Date.now()};this.measurements.push(t),this.render(),l.emit(i.MEASUREMENT_ADDED,{measurement:t})}removeMeasurement(e){this.measurements=this.measurements.filter(t=>t.id!==e),this.render(),l.emit(i.MEASUREMENT_REMOVED,{measurementId:e})}clearAll(){confirm("Deseja realmente limpar todas as medições?")&&(this.measurements=[],this.render(),l.emit(i.MEASUREMENTS_CLEARED,{}))}render(){const e=this.container.querySelector(".measurement-list");if(e){if(e.innerHTML="",this.measurements.length===0){const t=document.createElement("div");t.className="measurement-empty",t.innerHTML=`
        <p>Nenhuma medição</p>
        <small>Selecione uma ferramenta acima para começar</small>
      `,e.appendChild(t);return}this.measurements.forEach(t=>{const n=this.createMeasurementItem(t);e.appendChild(n)})}}createMeasurementItem(e){const t=document.createElement("div");t.className="measurement-item";const n=document.createElement("span");n.className="measurement-icon",n.textContent=this.getIconForType(e.type),t.appendChild(n);const s=document.createElement("div");s.className="measurement-info";const a=document.createElement("div");a.className="measurement-label",a.textContent=e.label||this.getLabelForType(e.type),s.appendChild(a);const o=document.createElement("div");o.className="measurement-value",o.textContent=`${e.value.toFixed(2)} ${e.unit}`,s.appendChild(o),t.appendChild(s);const r=document.createElement("div");r.className="measurement-actions";const c=new m({icon:"🗑️",variant:"ghost",size:"xs",onClick:()=>this.removeMeasurement(e.id)});return r.appendChild(c.getElement()),t.appendChild(r),t}getIconForType(e){return{distance:"📏",area:"📐",volume:"📦",angle:"📐"}[e]}getLabelForType(e){return{distance:"Distância",area:"Área",volume:"Volume",angle:"Ângulo"}[e]}setupEventListeners(){setTimeout(()=>{this.addMeasurement({type:"distance",value:12.45,unit:"m",label:"Distância 1",points:[[0,0,0],[12.45,0,0]]}),this.addMeasurement({type:"area",value:156.32,unit:"m²",label:"Área da Sala",points:[[0,0,0],[12,0,0],[12,13,0],[0,13,0]]}),this.addMeasurement({type:"volume",value:468.96,unit:"m³",label:"Volume do Cômodo",points:[]})},2e3)}applyStyles(){if(document.getElementById("measurement-panel-styles"))return;const e=document.createElement("style");e.id="measurement-panel-styles",e.textContent=`
      .measurement-panel {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .measurement-panel-header {
        padding: 16px;
        background: rgba(0, 0, 0, 0.3);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .measurement-panel-header h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: var(--theme-foreground, #fff);
      }

      .measurement-tools {
        padding: 16px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .measurement-list {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .measurement-empty {
        text-align: center;
        padding: 40px 20px;
        color: rgba(255, 255, 255, 0.5);
      }

      .measurement-empty p {
        margin: 0 0 8px 0;
        font-size: 14px;
      }

      .measurement-empty small {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.3);
      }

      .measurement-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: rgba(255, 255, 255, 0.03);
        border-radius: 6px;
        border: 1px solid rgba(255, 255, 255, 0.05);
        transition: all 0.2s ease;
      }

      .measurement-item:hover {
        background: rgba(255, 255, 255, 0.06);
        border-color: rgba(255, 255, 255, 0.1);
      }

      .measurement-icon {
        font-size: 24px;
        flex-shrink: 0;
      }

      .measurement-info {
        flex: 1;
        min-width: 0;
      }

      .measurement-label {
        font-size: 13px;
        font-weight: 500;
        color: var(--theme-foreground, #fff);
        margin-bottom: 4px;
      }

      .measurement-value {
        font-size: 16px;
        font-weight: 600;
        color: var(--theme-accent, #00ff88);
        font-family: 'Courier New', monospace;
      }

      .measurement-actions {
        opacity: 0;
        transition: opacity 0.2s ease;
      }

      .measurement-item:hover .measurement-actions {
        opacity: 1;
      }
    `,document.head.appendChild(e)}getElement(){return this.container}destroy(){this.container.remove()}}export{y as MeasurementPanel};
