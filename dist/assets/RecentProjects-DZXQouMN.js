import{C as p}from"./Card-DLSvBshn.js";import{B as d}from"./Button-BvNVdej2.js";class _{card;projects=[];onProjectOpen;constructor(e){this.onProjectOpen=e?.onProjectOpen,this.card=new p({title:"🕐 Projetos Recentes",variant:"glass"}),this.loadProjects(),this.render()}loadProjects(){const e=Date.now();this.projects=[{id:"proj-1",name:"Residencial Magnussão",description:"Edifício residencial 15 pavimentos",thumbnail:"🏢",lastOpened:e-36e5,location:"cloud",path:"cloud://projetos/magnussao.ifc",size:145678901,isPinned:!0,collaborators:["João Silva","Maria Santos"]},{id:"proj-2",name:"Shopping Center Norte",description:"Complexo comercial 3 blocos",thumbnail:"🏬",lastOpened:e-864e5,location:"local",path:"C:/Projetos/shopping_norte.rvt",size:234567890,isPinned:!0,collaborators:["Carlos Souza"]},{id:"proj-3",name:"Hospital Regional",description:"Hospital 200 leitos",thumbnail:"🏥",lastOpened:e-1728e5,location:"cloud",path:"cloud://projetos/hospital.ifc",size:567890123,isPinned:!1,collaborators:["Ana Lima","Pedro Costa","João Silva"]},{id:"proj-4",name:"Escola Municipal",description:"Escola 12 salas",thumbnail:"🏫",lastOpened:e-2592e5,location:"network",path:"//servidor/projetos/escola.ifc",size:89012345,isPinned:!1},{id:"proj-5",name:"Ponte Metropolitana",description:"Ponte estaiada 450m",thumbnail:"🌉",lastOpened:e-6048e5,location:"local",path:"C:/Projetos/ponte.ifc",size:345678901,isPinned:!1,collaborators:["Maria Santos"]}]}render(){const e=this.card.getBody();e.innerHTML="";const t=document.createElement("div");t.className="arxis-recent__actions";const i=new d({text:"➕ Novo Projeto",variant:"primary",size:"sm"});i.getElement().addEventListener("click",()=>this.createProject());const a=new d({text:"📂 Abrir...",variant:"secondary",size:"sm"});a.getElement().addEventListener("click",()=>this.browseProjects()),t.appendChild(i.getElement()),t.appendChild(a.getElement()),e.appendChild(t);const o=this.projects.filter(n=>n.isPinned);if(o.length>0){const n=document.createElement("div");n.className="arxis-recent__section";const s=document.createElement("h3");s.className="arxis-recent__section-title",s.textContent="📌 Fixados",n.appendChild(s);const c=document.createElement("div");c.className="arxis-recent__grid",o.forEach(l=>{c.appendChild(this.createProjectCard(l))}),n.appendChild(c),e.appendChild(n)}const r=this.projects.filter(n=>!n.isPinned);if(r.length>0){const n=document.createElement("div");n.className="arxis-recent__section";const s=document.createElement("h3");s.className="arxis-recent__section-title",s.textContent="🕐 Recentes",n.appendChild(s);const c=document.createElement("div");c.className="arxis-recent__list",r.forEach(l=>{c.appendChild(this.createProjectRow(l))}),n.appendChild(c),e.appendChild(n)}this.injectStyles()}createProjectCard(e){const t=document.createElement("div");t.className="arxis-recent__card";const i=document.createElement("div");i.className="arxis-recent__thumbnail",i.textContent=e.thumbnail||"📁",t.appendChild(i);const a=document.createElement("div");a.className="arxis-recent__card-info";const o=document.createElement("h4");o.className="arxis-recent__card-name",o.textContent=e.name;const r=document.createElement("div");r.className="arxis-recent__card-meta",r.innerHTML=`
      ${this.getLocationIcon(e.location)}
      <span>${this.formatTime(e.lastOpened)}</span>
    `,a.appendChild(o),a.appendChild(r),t.appendChild(a);const n=document.createElement("div");return n.className="arxis-recent__pin",n.textContent="📌",t.appendChild(n),t.addEventListener("click",()=>this.openProject(e)),t}createProjectRow(e){const t=document.createElement("div");t.className="arxis-recent__row";const i=document.createElement("div");i.className="arxis-recent__icon",i.textContent=e.thumbnail||"📁",t.appendChild(i);const a=document.createElement("div");a.className="arxis-recent__row-info";const o=document.createElement("div");o.className="arxis-recent__row-name",o.textContent=e.name;const r=document.createElement("div");r.className="arxis-recent__row-meta",r.innerHTML=`
      ${this.getLocationIcon(e.location)}
      <span>${this.formatTime(e.lastOpened)}</span>
      ${e.size?`<span>${this.formatSize(e.size)}</span>`:""}
    `,a.appendChild(o),a.appendChild(r),t.appendChild(a);const n=document.createElement("div");n.className="arxis-recent__row-actions";const s=new d({text:e.isPinned?"📌":"📍",variant:"secondary",size:"sm"});s.getElement().addEventListener("click",l=>{l.stopPropagation(),this.togglePin(e)});const c=new d({text:"❌",variant:"danger",size:"sm"});return c.getElement().addEventListener("click",l=>{l.stopPropagation(),this.removeProject(e)}),n.appendChild(s.getElement()),n.appendChild(c.getElement()),t.appendChild(n),t.addEventListener("click",()=>this.openProject(e)),t}getLocationIcon(e){return{local:"💻",cloud:"☁️",network:"🌐"}[e]||"📁"}formatTime(e){const t=Date.now()-e,i=Math.floor(t/36e5),a=Math.floor(t/864e5);return i<1?"Agora":i<24?`${i}h atrás`:a<7?`${a}d atrás`:new Date(e).toLocaleDateString("pt-BR")}formatSize(e){return e<1048576?`${(e/1024).toFixed(0)} KB`:e<1073741824?`${(e/1048576).toFixed(1)} MB`:`${(e/1073741824).toFixed(1)} GB`}openProject(e){e.lastOpened=Date.now(),this.onProjectOpen?.(e),console.log("Abrindo projeto:",e.name)}togglePin(e){e.isPinned=!e.isPinned,this.render()}removeProject(e){confirm(`Remover "${e.name}" dos recentes?`)&&(this.projects=this.projects.filter(t=>t.id!==e.id),this.render())}createProject(){console.log("Criar novo projeto")}browseProjects(){console.log("Navegar projetos")}getElement(){return this.card.getElement()}destroy(){this.card.destroy()}injectStyles(){if(document.getElementById("arxis-recent-styles"))return;const e=document.createElement("style");e.id="arxis-recent-styles",e.textContent=`
      .arxis-recent__actions {
        display: flex;
        gap: 8px;
        margin-bottom: 16px;
      }

      .arxis-recent__section {
        margin-bottom: 20px;
      }

      .arxis-recent__section-title {
        margin: 0 0 12px 0;
        font-size: 13px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.8);
        text-transform: uppercase;
      }

      .arxis-recent__grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 12px;
      }

      .arxis-recent__card {
        position: relative;
        padding: 16px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .arxis-recent__card:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: translateY(-3px);
      }

      .arxis-recent__thumbnail {
        font-size: 48px;
        text-align: center;
        margin-bottom: 12px;
      }

      .arxis-recent__card-info {
        text-align: center;
      }

      .arxis-recent__card-name {
        margin: 0 0 6px 0;
        font-size: 13px;
        font-weight: 500;
        color: #fff;
        line-height: 1.3;
      }

      .arxis-recent__card-meta {
        display: flex;
        justify-content: center;
        gap: 6px;
        font-size: 11px;
        color: rgba(255, 255, 255, 0.6);
      }

      .arxis-recent__pin {
        position: absolute;
        top: 8px;
        right: 8px;
        font-size: 14px;
      }

      .arxis-recent__list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .arxis-recent__row {
        display: flex;
        gap: 12px;
        align-items: center;
        padding: 12px;
        background: rgba(255, 255, 255, 0.04);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .arxis-recent__row:hover {
        background: rgba(255, 255, 255, 0.08);
        transform: translateX(3px);
      }

      .arxis-recent__icon {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        flex-shrink: 0;
      }

      .arxis-recent__row-info {
        flex: 1;
        min-width: 0;
      }

      .arxis-recent__row-name {
        font-size: 14px;
        font-weight: 500;
        color: #fff;
        margin-bottom: 4px;
      }

      .arxis-recent__row-meta {
        display: flex;
        gap: 10px;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
      }

      .arxis-recent__row-actions {
        display: flex;
        gap: 4px;
        opacity: 0;
        transition: opacity 0.2s;
      }

      .arxis-recent__row:hover .arxis-recent__row-actions {
        opacity: 1;
      }
    `,document.head.appendChild(e)}}export{_ as RecentProjects};
