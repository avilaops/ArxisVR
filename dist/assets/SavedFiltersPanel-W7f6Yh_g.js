import{C as x}from"./Card-DLSvBshn.js";import{B as c}from"./Button-BvNVdej2.js";import{S as g}from"./Select-D01wDXMy.js";class E{card;filters=[];filterCategory="all";searchTerm="";onFilterApply;constructor(e){this.onFilterApply=e?.onFilterApply,this.card=new x({title:"💾 Filtros Salvos",variant:"glass"}),this.loadFilters(),this.render()}loadFilters(){const e=Date.now();this.filters=[{id:"filter-1",name:"Estrutura Principal",description:"Vigas e pilares do pavimento tipo",icon:"🏗️",category:"structure",query:{type:"structural",level:"tipo"},createdAt:e-2592e6,updatedAt:e-2592e6,useCount:45,isFavorite:!0,isShared:!1},{id:"filter-2",name:"Esquadrias Externas",description:"Portas e janelas da fachada",icon:"🚪",category:"architecture",query:{category:"openings",location:"external"},createdAt:e-1728e6,updatedAt:e-864e6,useCount:32,isFavorite:!0,isShared:!1},{id:"filter-3",name:"Instalações Hidráulicas",description:"Tubulações e conexões água fria/quente",icon:"💧",category:"mep",query:{system:"plumbing"},createdAt:e-1296e6,updatedAt:e-432e6,useCount:28,isFavorite:!1,isShared:!1},{id:"filter-4",name:"Elementos com Clash",description:"Compartilhado por João Silva",icon:"⚠️",category:"custom",query:{hasClash:!0},createdAt:e-864e6,updatedAt:e-864e6,useCount:15,isFavorite:!1,isShared:!0,sharedBy:"João Silva"},{id:"filter-5",name:"Paredes Externas",description:"Todas as paredes de fachada",icon:"🧱",category:"architecture",query:{type:"wall",function:"exterior"},createdAt:e-432e6,updatedAt:e-1728e5,useCount:22,isFavorite:!0,isShared:!1},{id:"filter-6",name:"Sistema Elétrico",description:"Quadros, circuitos e luminárias",icon:"⚡",category:"mep",query:{system:"electrical"},createdAt:e-2592e5,updatedAt:e-864e5,useCount:18,isFavorite:!1,isShared:!1}]}render(){const e=this.card.getBody();e.innerHTML="";const t=document.createElement("div");t.className="arxis-saved-filters__search";const s=document.createElement("input");s.type="text",s.className="arxis-saved-filters__search-input",s.placeholder="🔍 Buscar filtros...",s.value=this.searchTerm,s.addEventListener("input",i=>{this.searchTerm=i.target.value.toLowerCase(),this.render()}),t.appendChild(s),e.appendChild(t);const o=new g({label:"Categoria:",options:[{value:"all",label:"📁 Todos"},{value:"structure",label:"🏗️ Estrutura"},{value:"architecture",label:"🏛️ Arquitetura"},{value:"mep",label:"⚙️ MEP"},{value:"custom",label:"🎨 Personalizados"}],value:this.filterCategory,onChange:i=>{this.filterCategory=i,this.render()}});e.appendChild(o.getElement());const r=document.createElement("div");r.className="arxis-saved-filters__quick";const p=new c({text:"⭐ Favoritos",variant:"secondary",size:"sm"});p.getElement().addEventListener("click",()=>this.showFavorites());const d=new c({text:"🔗 Compartilhados",variant:"secondary",size:"sm"});d.getElement().addEventListener("click",()=>this.showShared());const m=new c({text:"➕ Novo Filtro",variant:"primary",size:"sm"});m.getElement().addEventListener("click",()=>this.createFilter()),r.appendChild(p.getElement()),r.appendChild(d.getElement()),r.appendChild(m.getElement()),e.appendChild(r);const l=document.createElement("div");l.className="arxis-saved-filters__list";const n=this.getFilteredFilters();if(n.length===0){const i=document.createElement("div");i.className="arxis-saved-filters__empty",i.textContent="📂 Nenhum filtro encontrado",l.appendChild(i)}else n.forEach(i=>{const h=this.createFilterItem(i);l.appendChild(h)});e.appendChild(l),this.injectStyles()}getFilteredFilters(){let e=this.filters;return this.filterCategory!=="all"&&(e=e.filter(t=>t.category===this.filterCategory)),this.searchTerm&&(e=e.filter(t=>t.name.toLowerCase().includes(this.searchTerm)||t.description?.toLowerCase().includes(this.searchTerm))),e.sort((t,s)=>t.isFavorite!==s.isFavorite?t.isFavorite?-1:1:s.useCount-t.useCount)}createFilterItem(e){const t=document.createElement("div");t.className="arxis-saved-filters__item";const s=document.createElement("div");s.className="arxis-saved-filters__icon",s.textContent=e.icon||"📋",t.appendChild(s);const o=document.createElement("div");o.className="arxis-saved-filters__info";const r=document.createElement("div");r.className="arxis-saved-filters__header";const p=document.createElement("h4");p.className="arxis-saved-filters__name",p.textContent=e.name;const d=document.createElement("div");if(d.className="arxis-saved-filters__badges",e.isFavorite){const a=document.createElement("span");a.className="arxis-saved-filters__badge",a.textContent="⭐",d.appendChild(a)}if(e.isShared){const a=document.createElement("span");a.className="arxis-saved-filters__badge",a.textContent="🔗",d.appendChild(a)}r.appendChild(p),r.appendChild(d);const m=document.createElement("p");m.className="arxis-saved-filters__description",m.textContent=e.description||"Sem descrição";const l=document.createElement("div");l.className="arxis-saved-filters__meta",l.innerHTML=`
      <span>📊 ${e.useCount} usos</span>
      <span>📅 ${this.formatDate(e.updatedAt)}</span>
      ${e.sharedBy?`<span>👤 ${e.sharedBy}</span>`:""}
    `,o.appendChild(r),o.appendChild(m),o.appendChild(l),t.appendChild(o);const n=document.createElement("div");n.className="arxis-saved-filters__actions";const i=new c({text:"✅",variant:"primary",size:"sm"});i.getElement().addEventListener("click",a=>{a.stopPropagation(),this.applyFilter(e)});const h=new c({text:"✏️",variant:"secondary",size:"sm"});h.getElement().addEventListener("click",a=>{a.stopPropagation(),this.editFilter(e)});const u=new c({text:e.isFavorite?"⭐":"☆",variant:"secondary",size:"sm"});u.getElement().addEventListener("click",a=>{a.stopPropagation(),this.toggleFavorite(e)});const f=new c({text:"🗑️",variant:"danger",size:"sm"});return f.getElement().addEventListener("click",a=>{a.stopPropagation(),this.deleteFilter(e)}),n.appendChild(i.getElement()),n.appendChild(h.getElement()),n.appendChild(u.getElement()),n.appendChild(f.getElement()),t.appendChild(n),t.addEventListener("click",()=>{this.applyFilter(e)}),t}formatDate(e){return new Date(e).toLocaleDateString("pt-BR",{day:"2-digit",month:"short"})}applyFilter(e){e.useCount++,e.updatedAt=Date.now(),this.onFilterApply?.(e),console.log("Aplicando filtro:",e.name)}editFilter(e){console.log("Editando filtro:",e)}toggleFavorite(e){e.isFavorite=!e.isFavorite,this.render()}deleteFilter(e){confirm(`Excluir filtro "${e.name}"?`)&&(this.filters=this.filters.filter(t=>t.id!==e.id),this.render())}showFavorites(){this.filterCategory="all",this.render()}showShared(){this.filterCategory="all",this.render()}createFilter(){console.log("Criar novo filtro")}getElement(){return this.card.getElement()}destroy(){this.card.destroy()}injectStyles(){if(document.getElementById("arxis-saved-filters-styles"))return;const e=document.createElement("style");e.id="arxis-saved-filters-styles",e.textContent=`
      .arxis-saved-filters__search {
        margin-bottom: 12px;
      }

      .arxis-saved-filters__search-input {
        width: 100%;
        padding: 10px 14px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        color: #fff;
        font-size: 14px;
        outline: none;
        transition: all 0.2s;
      }

      .arxis-saved-filters__search-input:focus {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(0, 212, 255, 0.5);
      }

      .arxis-saved-filters__quick {
        display: flex;
        gap: 8px;
        margin: 12px 0;
        flex-wrap: wrap;
      }

      .arxis-saved-filters__list {
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-height: 500px;
        overflow-y: auto;
      }

      .arxis-saved-filters__item {
        display: flex;
        gap: 12px;
        padding: 14px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .arxis-saved-filters__item:hover {
        background: rgba(255, 255, 255, 0.08);
        transform: translateX(3px);
      }

      .arxis-saved-filters__icon {
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
        flex-shrink: 0;
      }

      .arxis-saved-filters__info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 6px;
        min-width: 0;
      }

      .arxis-saved-filters__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
      }

      .arxis-saved-filters__name {
        margin: 0;
        font-size: 15px;
        font-weight: 600;
        color: #fff;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .arxis-saved-filters__badges {
        display: flex;
        gap: 4px;
        flex-shrink: 0;
      }

      .arxis-saved-filters__badge {
        font-size: 14px;
      }

      .arxis-saved-filters__description {
        margin: 0;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.7);
        line-height: 1.4;
      }

      .arxis-saved-filters__meta {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.5);
      }

      .arxis-saved-filters__actions {
        display: flex;
        flex-direction: column;
        gap: 4px;
        flex-shrink: 0;
      }

      .arxis-saved-filters__empty {
        text-align: center;
        padding: 60px 20px;
        color: rgba(255, 255, 255, 0.5);
        font-size: 15px;
      }
    `,document.head.appendChild(e)}}export{E as SavedFiltersPanel};
