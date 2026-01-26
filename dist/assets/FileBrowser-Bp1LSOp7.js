import{C as v}from"./Card-DLSvBshn.js";import{B as d}from"./Button-BvNVdej2.js";import{S as _}from"./Select-D01wDXMy.js";class F{card;currentPath="/";files=[];viewMode="list";sortBy="name";onFileOpen;constructor(e){this.onFileOpen=e?.onFileOpen,this.card=new v({title:"📁 Navegador de Arquivos",variant:"glass"}),this.loadFiles(),this.render()}loadFiles(){const e=Date.now();this.files=[{id:"folder-1",name:"Estrutura",type:"folder",path:"/Estrutura",modifiedAt:e-864e5,createdAt:e-2592e6},{id:"folder-2",name:"Arquitetura",type:"folder",path:"/Arquitetura",modifiedAt:e-1728e5,createdAt:e-2592e6},{id:"folder-3",name:"Instalações",type:"folder",path:"/Instalações",modifiedAt:e-2592e5,createdAt:e-2592e6},{id:"file-1",name:"Projeto_Estrutural_Rev08.ifc",type:"file",extension:"ifc",size:45678901,path:"/Projeto_Estrutural_Rev08.ifc",modifiedAt:e-864e5,createdAt:e-1296e6,isFavorite:!0},{id:"file-2",name:"Arquitetura_Executivo.rvt",type:"file",extension:"rvt",size:123456789,path:"/Arquitetura_Executivo.rvt",modifiedAt:e-1728e5,createdAt:e-2592e6,isFavorite:!0},{id:"file-3",name:"Hidraulico_Pavimento_Tipo.dwg",type:"file",extension:"dwg",size:8765432,path:"/Hidraulico_Pavimento_Tipo.dwg",modifiedAt:e-432e6,createdAt:e-1728e6,isFavorite:!1},{id:"file-4",name:"Memorial_Descritivo.pdf",type:"file",extension:"pdf",size:2345678,path:"/Memorial_Descritivo.pdf",modifiedAt:e-6048e5,createdAt:e-1728e6,isFavorite:!1},{id:"file-5",name:"Render_Fachada_Sul.jpg",type:"file",extension:"jpg",size:1234567,path:"/Render_Fachada_Sul.jpg",modifiedAt:e-864e6,createdAt:e-864e6,isFavorite:!1}]}render(){const e=this.card.getBody();e.innerHTML="";const t=document.createElement("div");t.className="arxis-filebrowser__toolbar";const i=document.createElement("div");i.className="arxis-filebrowser__breadcrumb";const a=this.currentPath.split("/").filter(Boolean),r=document.createElement("span");r.className="arxis-filebrowser__breadcrumb-item",r.textContent="🏠",r.addEventListener("click",()=>this.navigateTo("/")),i.appendChild(r),a.forEach((l,x)=>{const u=document.createElement("span");u.textContent=" / ",u.style.color="rgba(255, 255, 255, 0.3)",i.appendChild(u);const f=document.createElement("span");f.className="arxis-filebrowser__breadcrumb-item",f.textContent=l,f.addEventListener("click",()=>{const g="/"+a.slice(0,x+1).join("/");this.navigateTo(g)}),i.appendChild(f)}),t.appendChild(i),e.appendChild(t);const n=document.createElement("div");n.className="arxis-filebrowser__controls";const s=new d({text:"📤 Upload",variant:"primary",size:"sm"});s.getElement().addEventListener("click",()=>this.uploadFile());const c=new d({text:"📁 Nova Pasta",variant:"secondary",size:"sm"});c.getElement().addEventListener("click",()=>this.createFolder());const m=new _({label:"Ordenar:",options:[{value:"name",label:"Nome"},{value:"date",label:"Data"},{value:"size",label:"Tamanho"}],value:this.sortBy,onChange:l=>{this.sortBy=l,this.render()}}),p=new d({text:"📄",variant:this.viewMode==="list"?"primary":"secondary",size:"sm"});p.getElement().addEventListener("click",()=>{this.viewMode="list",this.render()});const o=new d({text:"▦",variant:this.viewMode==="grid"?"primary":"secondary",size:"sm"});o.getElement().addEventListener("click",()=>{this.viewMode="grid",this.render()}),n.appendChild(s.getElement()),n.appendChild(c.getElement()),n.appendChild(m.getElement()),n.appendChild(p.getElement()),n.appendChild(o.getElement()),e.appendChild(n);const h=document.createElement("div");h.className=this.viewMode==="list"?"arxis-filebrowser__list":"arxis-filebrowser__grid",this.getSortedFiles().forEach(l=>{const x=this.viewMode==="list"?this.createListItem(l):this.createGridItem(l);h.appendChild(x)}),e.appendChild(h),this.injectStyles()}getSortedFiles(){const e=[...this.files];return e.sort((t,i)=>{if(t.type!==i.type)return t.type==="folder"?-1:1;switch(this.sortBy){case"name":return t.name.localeCompare(i.name);case"date":return i.modifiedAt-t.modifiedAt;case"size":return(i.size||0)-(t.size||0);default:return 0}}),e}createListItem(e){const t=document.createElement("div");t.className="arxis-filebrowser__list-item";const i=document.createElement("div");i.className="arxis-filebrowser__icon",i.textContent=this.getFileIcon(e),t.appendChild(i);const a=document.createElement("div");a.className="arxis-filebrowser__info";const r=document.createElement("div");if(r.className="arxis-filebrowser__name",e.isFavorite){const o=document.createElement("span");o.textContent="⭐ ",r.appendChild(o)}r.appendChild(document.createTextNode(e.name));const n=document.createElement("div");n.className="arxis-filebrowser__meta",n.innerHTML=`
      ${e.size?`<span>${this.formatSize(e.size)}</span>`:""}
      <span>${this.formatDate(e.modifiedAt)}</span>
    `,a.appendChild(r),a.appendChild(n),t.appendChild(a);const s=document.createElement("div");s.className="arxis-filebrowser__actions";const c=new d({text:e.isFavorite?"⭐":"☆",variant:"secondary",size:"sm"});c.getElement().addEventListener("click",o=>{o.stopPropagation(),this.toggleFavorite(e)});const m=new d({text:"⬇️",variant:"secondary",size:"sm"});m.getElement().addEventListener("click",o=>{o.stopPropagation(),this.downloadFile(e)});const p=new d({text:"🗑️",variant:"danger",size:"sm"});return p.getElement().addEventListener("click",o=>{o.stopPropagation(),this.deleteFile(e)}),s.appendChild(c.getElement()),e.type==="file"&&s.appendChild(m.getElement()),s.appendChild(p.getElement()),t.appendChild(s),t.addEventListener("click",()=>this.openFile(e)),t}createGridItem(e){const t=document.createElement("div");t.className="arxis-filebrowser__grid-item";const i=document.createElement("div");i.className="arxis-filebrowser__thumbnail",i.textContent=this.getFileIcon(e),t.appendChild(i);const a=document.createElement("div");if(a.className="arxis-filebrowser__grid-name",a.textContent=e.name,t.appendChild(a),e.isFavorite){const r=document.createElement("div");r.className="arxis-filebrowser__favorite-badge",r.textContent="⭐",t.appendChild(r)}return t.addEventListener("click",()=>this.openFile(e)),t}getFileIcon(e){return e.type==="folder"?"📁":{ifc:"🏗️",rvt:"🏛️",dwg:"📐",pdf:"📄",jpg:"🖼️",png:"🖼️",zip:"📦",txt:"📝"}[e.extension||""]||"📄"}formatSize(e){return e<1024?`${e} B`:e<1048576?`${(e/1024).toFixed(1)} KB`:e<1073741824?`${(e/1048576).toFixed(1)} MB`:`${(e/1073741824).toFixed(1)} GB`}formatDate(e){return new Date(e).toLocaleDateString("pt-BR",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"})}navigateTo(e){this.currentPath=e,this.render()}openFile(e){e.type==="folder"?this.navigateTo(e.path):(this.onFileOpen?.(e),console.log("Abrindo arquivo:",e.name))}toggleFavorite(e){e.isFavorite=!e.isFavorite,this.render()}uploadFile(){const e=document.createElement("input");e.type="file",e.accept=".ifc,.rvt,.dwg,.pdf,.jpg,.png",e.addEventListener("change",t=>{const i=t.target.files?.[0];i&&console.log("Uploading:",i.name)}),e.click()}createFolder(){const e=prompt("Nome da pasta:");e&&console.log("Criando pasta:",e)}downloadFile(e){console.log("Baixando:",e.name)}deleteFile(e){confirm(`Excluir "${e.name}"?`)&&(this.files=this.files.filter(t=>t.id!==e.id),this.render())}getElement(){return this.card.getElement()}destroy(){this.card.destroy()}injectStyles(){if(document.getElementById("arxis-filebrowser-styles"))return;const e=document.createElement("style");e.id="arxis-filebrowser-styles",e.textContent=`
      .arxis-filebrowser__toolbar {
        margin-bottom: 12px;
      }

      .arxis-filebrowser__breadcrumb {
        padding: 8px 12px;
        background: rgba(255, 255, 255, 0.03);
        border-radius: 6px;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.8);
        overflow-x: auto;
        white-space: nowrap;
      }

      .arxis-filebrowser__breadcrumb-item {
        cursor: pointer;
        transition: color 0.2s;
      }

      .arxis-filebrowser__breadcrumb-item:hover {
        color: #00d4ff;
      }

      .arxis-filebrowser__controls {
        display: flex;
        gap: 8px;
        align-items: center;
        margin-bottom: 16px;
        flex-wrap: wrap;
      }

      .arxis-filebrowser__list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-height: 500px;
        overflow-y: auto;
      }

      .arxis-filebrowser__list-item {
        display: flex;
        gap: 12px;
        align-items: center;
        padding: 12px;
        background: rgba(255, 255, 255, 0.04);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .arxis-filebrowser__list-item:hover {
        background: rgba(255, 255, 255, 0.08);
        transform: translateX(3px);
      }

      .arxis-filebrowser__icon {
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

      .arxis-filebrowser__info {
        flex: 1;
        min-width: 0;
      }

      .arxis-filebrowser__name {
        font-size: 14px;
        font-weight: 500;
        color: #fff;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .arxis-filebrowser__meta {
        display: flex;
        gap: 12px;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
        margin-top: 4px;
      }

      .arxis-filebrowser__actions {
        display: flex;
        gap: 4px;
        flex-shrink: 0;
      }

      .arxis-filebrowser__grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 12px;
        max-height: 500px;
        overflow-y: auto;
      }

      .arxis-filebrowser__grid-item {
        position: relative;
        padding: 16px;
        background: rgba(255, 255, 255, 0.04);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
        text-align: center;
      }

      .arxis-filebrowser__grid-item:hover {
        background: rgba(255, 255, 255, 0.08);
        transform: translateY(-3px);
      }

      .arxis-filebrowser__thumbnail {
        font-size: 48px;
        margin-bottom: 8px;
      }

      .arxis-filebrowser__grid-name {
        font-size: 12px;
        color: #fff;
        word-break: break-word;
        line-height: 1.3;
      }

      .arxis-filebrowser__favorite-badge {
        position: absolute;
        top: 8px;
        right: 8px;
        font-size: 16px;
      }
    `,document.head.appendChild(e)}}export{F as FileBrowser};
