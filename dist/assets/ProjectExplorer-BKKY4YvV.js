import{I as h}from"./Input-vZvnrYWf.js";import{B as l}from"./Button-BvNVdej2.js";import{C as m}from"./Checkbox-B0U72DD-.js";import{e as d,E as p}from"./index-BuRPltC2.js";class b{container;rootNodes=[];expandedNodes=new Set;searchQuery="";searchInput=null;constructor(){this.container=this.createContainer(),this.applyStyles(),this.setupEventListeners(),this.loadMockProject()}createContainer(){const e=document.createElement("div");e.className="project-explorer";const n=document.createElement("div");n.className="project-explorer-header";const t=document.createElement("h3");t.textContent="📁 Projeto",n.appendChild(t);const o=document.createElement("div");o.className="project-explorer-actions";const s=new l({icon:"⤢",variant:"ghost",size:"sm",tooltip:"Expandir tudo",onClick:()=>this.expandAll()});o.appendChild(s.getElement());const c=new l({icon:"⤡",variant:"ghost",size:"sm",tooltip:"Colapsar tudo",onClick:()=>this.collapseAll()});o.appendChild(c.getElement()),n.appendChild(o),e.appendChild(n),this.searchInput=new h({placeholder:"Buscar elemento...",icon:"🔍",size:"sm",fullWidth:!0,onChange:r=>this.search(r)}),e.appendChild(this.searchInput.getElement());const i=document.createElement("div");return i.className="project-explorer-content",e.appendChild(i),e}loadMockProject(){this.rootNodes=[{id:"project-1",name:"Edifício Residencial",type:"project",icon:"🏗️",visible:!0,children:[{id:"site-1",name:"Site Principal",type:"site",icon:"🗺️",visible:!0,children:[{id:"building-1",name:"Torre A",type:"building",icon:"🏢",visible:!0,children:[{id:"storey-1",name:"Térreo",type:"storey",icon:"📐",visible:!0,children:[{id:"element-1",name:"Pilar P1",type:"element",icon:"⬜",visible:!0},{id:"element-2",name:"Pilar P2",type:"element",icon:"⬜",visible:!0},{id:"element-3",name:"Viga V1",type:"element",icon:"▬",visible:!0},{id:"element-4",name:"Viga V2",type:"element",icon:"▬",visible:!0},{id:"element-5",name:"Laje L1",type:"element",icon:"⬛",visible:!0}]},{id:"storey-2",name:"1° Pavimento",type:"storey",icon:"📐",visible:!0,children:[{id:"element-6",name:"Pilar P1",type:"element",icon:"⬜",visible:!0},{id:"element-7",name:"Parede W1",type:"element",icon:"🧱",visible:!0},{id:"element-8",name:"Porta D1",type:"element",icon:"🚪",visible:!0},{id:"element-9",name:"Janela W1",type:"element",icon:"🪟",visible:!0}]},{id:"storey-3",name:"2° Pavimento",type:"storey",icon:"📐",visible:!0}]}]}]}],this.render()}render(){const e=this.container.querySelector(".project-explorer-content");e&&(e.innerHTML="",this.rootNodes.forEach(n=>{const t=this.renderNode(n,0);e.appendChild(t)}))}renderNode(e,n){if(this.searchQuery&&!this.matchesSearch(e,this.searchQuery)){const r=document.createElement("div");return r.style.display="none",r}const t=document.createElement("div");if(t.className="project-node",t.style.paddingLeft=`${n*20}px`,e.selected&&t.classList.add("project-node--selected"),e.children&&e.children.length>0){const r=document.createElement("span");r.className="project-node-expand",r.textContent=this.expandedNodes.has(e.id)?"▼":"▶",r.onclick=a=>{a.stopPropagation(),this.toggleNode(e.id)},t.appendChild(r)}else{const r=document.createElement("span");r.className="project-node-spacer",t.appendChild(r)}const o=new m({checked:e.visible,onChange:r=>this.toggleVisibility(e,r)});if(o.getElement().onclick=r=>r.stopPropagation(),t.appendChild(o.getElement()),e.icon){const r=document.createElement("span");r.className="project-node-icon",r.textContent=e.icon,t.appendChild(r)}const s=document.createElement("span");s.className="project-node-label",s.textContent=e.name,t.appendChild(s);const c=document.createElement("span");c.className="project-node-badge",c.textContent=e.type,t.appendChild(c),t.onclick=()=>this.selectNode(e);const i=document.createElement("div");return i.appendChild(t),e.children&&this.expandedNodes.has(e.id)&&e.children.forEach(r=>{const a=this.renderNode(r,n+1);i.appendChild(a)}),i}matchesSearch(e,n){const t=n.toLowerCase();return e.name.toLowerCase().includes(t)||e.type.toLowerCase().includes(t)}toggleNode(e){this.expandedNodes.has(e)?this.expandedNodes.delete(e):this.expandedNodes.add(e),this.render()}selectNode(e){this.clearSelection(this.rootNodes),e.selected=!0,this.render(),d.emit(p.OBJECT_SELECTED,{object:e.userData,nodeId:e.id,nodeName:e.name,nodeType:e.type})}clearSelection(e){e.forEach(n=>{n.selected=!1,n.children&&this.clearSelection(n.children)})}toggleVisibility(e,n){e.visible=n,e.children&&e.children.forEach(t=>{this.toggleVisibility(t,n)}),d.emit(p.VISIBILITY_CHANGED,{nodeId:e.id,visible:n})}search(e){this.searchQuery=e,this.render()}expandAll(){this.getAllNodeIds(this.rootNodes).forEach(e=>{this.expandedNodes.add(e)}),this.render()}collapseAll(){this.expandedNodes.clear(),this.render()}getAllNodeIds(e){const n=[];return e.forEach(t=>{n.push(t.id),t.children&&n.push(...this.getAllNodeIds(t.children))}),n}setupEventListeners(){}applyStyles(){if(document.getElementById("project-explorer-styles"))return;const e=document.createElement("style");e.id="project-explorer-styles",e.textContent=`
      .project-explorer {
        height: 100%;
        display: flex;
        flex-direction: column;
        background: rgba(20, 20, 20, 0.95);
      }

      .project-explorer-header {
        padding: 16px;
        background: rgba(0, 0, 0, 0.3);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .project-explorer-header h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: var(--theme-foreground, #fff);
      }

      .project-explorer-actions {
        display: flex;
        gap: 4px;
      }

      .project-explorer-content {
        flex: 1;
        overflow-y: auto;
        padding: 8px;
      }

      .project-node {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 8px;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.15s ease;
        user-select: none;
      }

      .project-node:hover {
        background: rgba(255, 255, 255, 0.05);
      }

      .project-node--selected {
        background: rgba(102, 126, 234, 0.2);
        border-left: 3px solid var(--theme-accent, #00ff88);
      }

      .project-node-expand {
        width: 16px;
        text-align: center;
        font-size: 10px;
        cursor: pointer;
        color: rgba(255, 255, 255, 0.6);
      }

      .project-node-spacer {
        width: 16px;
      }

      .project-node .arxis-checkbox {
        margin: 0;
      }

      .project-node-icon {
        font-size: 14px;
      }

      .project-node-label {
        flex: 1;
        font-size: 13px;
        color: var(--theme-foreground, #fff);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .project-node-badge {
        font-size: 10px;
        padding: 2px 6px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
        color: rgba(255, 255, 255, 0.6);
        text-transform: uppercase;
      }
    `,document.head.appendChild(e)}getElement(){return this.container}destroy(){this.searchInput&&this.searchInput.destroy(),this.container.remove()}}export{b as ProjectExplorer};
