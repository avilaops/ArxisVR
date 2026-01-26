import{I as y}from"./Input-vZvnrYWf.js";import{B as i}from"./Button-BvNVdej2.js";import{C as u}from"./Checkbox-B0U72DD-.js";import{M as g}from"./Modal-C4dtqQB0.js";import{e as s,E as c}from"./index-BuRPltC2.js";class v{container;layers=[];createModal=null;constructor(){this.container=this.createContainer(),this.applyStyles(),this.loadMockLayers(),this.render()}createContainer(){const e=document.createElement("div");e.className="layers-panel";const t=document.createElement("div");t.className="layers-panel-header";const a=document.createElement("h3");a.textContent="🎨 Layers",t.appendChild(a);const o=new i({icon:"+",variant:"primary",size:"sm",tooltip:"Nova Layer",onClick:()=>this.showCreateModal()});t.appendChild(o.getElement()),e.appendChild(t);const l=document.createElement("div");return l.className="layers-panel-content",e.appendChild(l),e}loadMockLayers(){this.layers=[{id:"layer-1",name:"Estrutura",color:"#667eea",visible:!0,locked:!1,opacity:1,elements:[]},{id:"layer-2",name:"Arquitetura",color:"#00ff88",visible:!0,locked:!1,opacity:1,elements:[]},{id:"layer-3",name:"Hidráulica",color:"#00d9ff",visible:!0,locked:!1,opacity:.8,elements:[]},{id:"layer-4",name:"Elétrica",color:"#ffd700",visible:!0,locked:!1,opacity:.8,elements:[]},{id:"layer-5",name:"HVAC",color:"#ff6b6b",visible:!1,locked:!1,opacity:.6,elements:[]},{id:"layer-6",name:"Terreno",color:"#8b4513",visible:!0,locked:!0,opacity:.5,elements:[]}]}render(){const e=this.container.querySelector(".layers-panel-content");e&&(e.innerHTML="",this.layers.forEach(t=>{const a=this.createLayerElement(t);e.appendChild(a)}))}createLayerElement(e){const t=document.createElement("div");t.className="layer-item",e.locked&&t.classList.add("layer-item--locked");const a=new u({checked:e.visible,onChange:m=>this.toggleLayerVisibility(e,m)});a.getElement().onclick=m=>m.stopPropagation(),t.appendChild(a.getElement());const o=document.createElement("span");o.className="layer-color-indicator",o.style.background=e.color,t.appendChild(o);const l=document.createElement("span");l.className="layer-name",l.textContent=e.name,t.appendChild(l);const r=document.createElement("span");r.className="layer-count",r.textContent=`(${e.elements.length})`,t.appendChild(r);const n=document.createElement("div");n.className="layer-actions";const d=new i({icon:e.locked?"🔒":"🔓",variant:"ghost",size:"xs",tooltip:e.locked?"Desbloquear":"Bloquear",onClick:()=>this.toggleLayerLock(e)});n.appendChild(d.getElement());const h=new i({icon:"🗑️",variant:"ghost",size:"xs",tooltip:"Deletar",onClick:()=>this.deleteLayer(e)});n.appendChild(h.getElement()),t.appendChild(n);const p=document.createElement("div");return p.className="layer-opacity-control",p.innerHTML=`
      <label>Opacidade: ${Math.round(e.opacity*100)}%</label>
      <input type="range" min="0" max="100" value="${e.opacity*100}" 
             onchange="this.previousElementSibling.textContent = 'Opacidade: ' + this.value + '%'" />
    `,t.appendChild(p),t}toggleLayerVisibility(e,t){e.visible=t,s.emit(c.LAYER_VISIBILITY_CHANGED,{layerId:e.id,visible:t}),console.log(`Layer ${e.name} visibility: ${t}`)}toggleLayerLock(e){e.locked=!e.locked,this.render(),s.emit(c.LAYER_LOCKED_CHANGED,{layerId:e.id,locked:e.locked})}deleteLayer(e){confirm(`Deseja realmente deletar a layer "${e.name}"?`)&&(this.layers=this.layers.filter(t=>t.id!==e.id),this.render(),s.emit(c.LAYER_DELETED,{layerId:e.id}))}showCreateModal(){this.createModal=new g({title:"Nova Layer",size:"sm",onClose:()=>{this.createModal&&(this.createModal.destroy(),this.createModal=null)}});const e=document.createElement("div");e.style.display="flex",e.style.flexDirection="column",e.style.gap="16px";const t=new y({label:"Nome",placeholder:"Nome da layer...",required:!0,fullWidth:!0});e.appendChild(t.getElement());const a=new y({label:"Cor",type:"text",value:"#667eea",fullWidth:!0});e.appendChild(a.getElement()),this.createModal.setContent(e);const o=document.createElement("div");o.style.display="flex",o.style.gap="8px";const l=new i({text:"Cancelar",variant:"secondary",onClick:()=>this.createModal?.close()});o.appendChild(l.getElement());const r=new i({text:"Criar",variant:"primary",onClick:()=>{const n=t.getValue(),d=a.getValue();n&&(this.createLayer(n,d),this.createModal?.close())}});o.appendChild(r.getElement()),this.createModal.setFooter(o),this.createModal.open()}createLayer(e,t){const a={id:`layer-${Date.now()}`,name:e,color:t,visible:!0,locked:!1,opacity:1,elements:[]};this.layers.push(a),this.render(),s.emit(c.LAYER_CREATED,{layer:a})}applyStyles(){if(document.getElementById("layers-panel-styles"))return;const e=document.createElement("style");e.id="layers-panel-styles",e.textContent=`
      .layers-panel {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 320px;
        height: calc(100vh - 40px);
        max-height: 800px;
        display: flex;
        flex-direction: column;
        background: rgba(15, 15, 25, 0.98);
        backdrop-filter: blur(20px);
        border: 2px solid rgba(0, 212, 255, 0.4);
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
        z-index: 1000;
        overflow: hidden;
      }

      .layers-panel-header {
        padding: 16px;
        background: rgba(0, 0, 0, 0.3);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .layers-panel-header h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: var(--theme-foreground, #fff);
      }

      .layers-panel-content {
        flex: 1;
        overflow-y: auto;
        padding: 8px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .layer-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        background: rgba(255, 255, 255, 0.03);
        border-radius: 6px;
        border: 1px solid rgba(255, 255, 255, 0.05);
        transition: all 0.2s ease;
      }

      .layer-item:hover {
        background: rgba(255, 255, 255, 0.06);
        border-color: rgba(255, 255, 255, 0.1);
      }

      .layer-item--locked {
        opacity: 0.7;
      }

      .layer-item .arxis-checkbox {
        margin: 0;
      }

      .layer-color-indicator {
        width: 20px;
        height: 20px;
        border-radius: 4px;
        border: 2px solid rgba(255, 255, 255, 0.2);
        flex-shrink: 0;
      }

      .layer-name {
        flex: 1;
        font-size: 14px;
        font-weight: 500;
        color: var(--theme-foreground, #fff);
      }

      .layer-count {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.5);
      }

      .layer-actions {
        display: flex;
        gap: 4px;
        opacity: 0;
        transition: opacity 0.2s ease;
      }

      .layer-item:hover .layer-actions {
        opacity: 1;
      }

      .layer-opacity-control {
        display: none;
        margin-top: 8px;
        padding-top: 8px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }

      .layer-opacity-control label {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
        display: block;
        margin-bottom: 6px;
      }

      .layer-opacity-control input[type="range"] {
        width: 100%;
      }
    `,document.head.appendChild(e)}getElement(){return this.container}destroy(){this.createModal&&this.createModal.destroy(),this.container.remove()}}export{v as LayersPanel};
