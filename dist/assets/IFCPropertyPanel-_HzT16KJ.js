import{C as l}from"./Card-DLSvBshn.js";import{I as d}from"./Input-vZvnrYWf.js";import{B as m}from"./Button-BvNVdej2.js";import{e as i,E as s}from"./index-BuRPltC2.js";class v{container;currentProperties=[];cards=[];constructor(){this.container=this.createContainer(),this.applyStyles(),this.setupEventListeners()}createContainer(){const e=document.createElement("div");e.className="ifc-property-panel";const t=document.createElement("div");t.className="ifc-property-panel-header";const r=document.createElement("h3");r.textContent="Propriedades IFC",t.appendChild(r);const o=new m({text:"Exportar",icon:"📥",variant:"secondary",size:"sm",onClick:()=>this.exportProperties()});t.appendChild(o.getElement()),e.appendChild(t);const n=document.createElement("div");return n.className="ifc-property-panel-content",e.appendChild(n),e}setupEventListeners(){i.on(s.OBJECT_SELECTED,e=>{e.object?this.loadPropertiesForObject(e.object):this.clear()})}loadPropertiesForObject(e){const t=[{category:"📋 Informações Básicas",properties:[{name:"Nome",value:e.name||"Sem nome",type:"string",category:"basic",editable:!0},{name:"Tipo IFC",value:e.userData?.ifcType||"IfcBuildingElement",type:"string",category:"basic"},{name:"GUID",value:e.userData?.guid||"N/A",type:"string",category:"basic"},{name:"Tag",value:e.userData?.tag||"N/A",type:"string",category:"basic",editable:!0}]},{category:"📐 Geometria",properties:[{name:"Posição X",value:e.position?.x.toFixed(2)||"0",type:"number",category:"geometry"},{name:"Posição Y",value:e.position?.y.toFixed(2)||"0",type:"number",category:"geometry"},{name:"Posição Z",value:e.position?.z.toFixed(2)||"0",type:"number",category:"geometry"},{name:"Visível",value:e.visible||!1,type:"boolean",category:"geometry",editable:!0}]},{category:"🏗️ Construção",properties:[{name:"Material",value:"Concreto",type:"string",category:"construction",editable:!0},{name:"Resistência",value:"25 MPa",type:"string",category:"construction",editable:!0},{name:"Fase",value:"Estrutura",type:"string",category:"construction",editable:!0}]},{category:"💰 Quantitativos",properties:[{name:"Volume",value:"1.25 m³",type:"string",category:"quantities"},{name:"Área",value:"5.60 m²",type:"string",category:"quantities"},{name:"Comprimento",value:"3.00 m",type:"string",category:"quantities"},{name:"Peso",value:"3125 kg",type:"string",category:"quantities"}]}];this.setProperties(t)}setProperties(e){this.currentProperties=e,this.render()}render(){const e=this.container.querySelector(".ifc-property-panel-content");e&&(e.innerHTML="",this.cards=[],this.currentProperties.forEach(t=>{const r=new l({title:t.category,variant:"bordered",padding:"sm"}),o=this.createPropertiesTable(t.properties);r.setContent(o),e.appendChild(r.getElement()),this.cards.push(r)}))}createPropertiesTable(e){const t=document.createElement("div");return t.className="ifc-properties-table",e.forEach(r=>{const o=document.createElement("div");o.className="ifc-property-row";const n=document.createElement("div");n.className="ifc-property-label",n.textContent=r.name,o.appendChild(n);const a=document.createElement("div");if(a.className="ifc-property-value",r.editable){const p=new d({value:String(r.value),size:"sm",fullWidth:!0,onChange:c=>this.updateProperty(r,c)});a.appendChild(p.getElement())}else a.textContent=String(r.value);o.appendChild(a),t.appendChild(o)}),t}updateProperty(e,t){e.value=t,console.log(`Property updated: ${e.name} = ${t}`),i.emit(s.PROPERTY_UPDATED,{property:e.name,value:t})}exportProperties(){const e=JSON.stringify(this.currentProperties,null,2),t=new Blob([e],{type:"application/json"}),r=URL.createObjectURL(t),o=document.createElement("a");o.href=r,o.download=`ifc-properties-${Date.now()}.json`,o.click(),URL.revokeObjectURL(r)}clear(){this.currentProperties=[],this.render()}applyStyles(){if(document.getElementById("ifc-property-panel-styles"))return;const e=document.createElement("style");e.id="ifc-property-panel-styles",e.textContent=`
      .ifc-property-panel {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .ifc-property-panel-header {
        padding: 16px;
        background: rgba(0, 0, 0, 0.3);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .ifc-property-panel-header h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: var(--theme-foreground, #fff);
      }

      .ifc-property-panel-content {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .ifc-properties-table {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .ifc-property-row {
        display: grid;
        grid-template-columns: 140px 1fr;
        gap: 12px;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      }

      .ifc-property-row:last-child {
        border-bottom: none;
      }

      .ifc-property-label {
        font-size: 12px;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.7);
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      .ifc-property-value {
        font-size: 13px;
        color: var(--theme-foreground, #fff);
        font-family: 'Courier New', monospace;
      }

      .ifc-property-value .arxis-input-container {
        margin-bottom: 0;
      }
    `,document.head.appendChild(e)}getElement(){return this.container}destroy(){this.cards.forEach(e=>e.destroy()),this.container.remove()}}export{v as IFCPropertyPanel};
