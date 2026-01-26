import{C as v}from"./Card-DLSvBshn.js";import{B as c}from"./Button-BvNVdej2.js";import{I as _}from"./Input-vZvnrYWf.js";import{S as x}from"./Select-D01wDXMy.js";class w{card;queries=[];results=[];onSearch;onResultSelect;constructor(e){this.onSearch=e?.onSearch,this.onResultSelect=e?.onResultSelect,this.card=new v({title:"🔍 Busca Avançada",variant:"glass"}),this.addDefaultQuery(),this.render()}addDefaultQuery(){this.queries.push({field:"Name",operator:"contains",value:"",logic:"AND"})}render(){const e=this.card.getBody();e.innerHTML="";const s=document.createElement("div");s.className="arxis-search__builder";const a=document.createElement("div");a.className="arxis-search__section-title",a.textContent="🏗️ Construtor de Consulta",s.appendChild(a),this.queries.forEach((u,m)=>{const g=this.createQueryRow(u,m);s.appendChild(g)});const n=new c({text:"➕ Adicionar Condição",variant:"secondary",size:"sm"});n.getElement().addEventListener("click",()=>{this.queries.push({field:"Name",operator:"contains",value:"",logic:"AND"}),this.render()}),s.appendChild(n.getElement()),e.appendChild(s);const r=document.createElement("div");r.className="arxis-search__quick";const i=document.createElement("div");i.className="arxis-search__section-title",i.textContent="⚡ Buscas Rápidas",r.appendChild(i);const t=document.createElement("div");t.className="arxis-search__quick-buttons",[{label:"Vigas",query:"Type = Beam"},{label:"Pilares",query:"Type = Column"},{label:"Paredes",query:"Type = Wall"},{label:"Portas",query:"Type = Door"},{label:"Janelas",query:"Type = Window"}].forEach(u=>{const m=new c({text:u.label,variant:"secondary",size:"sm"});m.getElement().addEventListener("click",()=>this.runQuickSearch(u.query)),t.appendChild(m.getElement())}),r.appendChild(t),e.appendChild(r);const l=document.createElement("div");l.className="arxis-search__actions";const d=new c({text:"🔎 Buscar",variant:"primary",size:"sm"});d.getElement().addEventListener("click",()=>this.executeSearch());const p=new c({text:"🗑️ Limpar",variant:"secondary",size:"sm"});p.getElement().addEventListener("click",()=>this.clearQueries());const h=new c({text:"💾 Salvar Filtro",variant:"secondary",size:"sm"});if(h.getElement().addEventListener("click",()=>this.saveFilter()),l.appendChild(d.getElement()),l.appendChild(p.getElement()),l.appendChild(h.getElement()),e.appendChild(l),this.results.length>0){const u=this.renderResults();e.appendChild(u)}this.injectStyles()}createQueryRow(e,s){const a=document.createElement("div");if(a.className="arxis-search__query-row",s>0){const t=new x({options:[{value:"AND",label:"E"},{value:"OR",label:"OU"}],value:e.logic||"AND",onChange:o=>{e.logic=o}});t.getElement().style.width="80px",a.appendChild(t.getElement())}else{const t=document.createElement("div");t.style.width="80px",a.appendChild(t)}const n=new x({options:[{value:"Name",label:"Nome"},{value:"Type",label:"Tipo"},{value:"Category",label:"Categoria"},{value:"Level",label:"Nível"},{value:"Material",label:"Material"},{value:"Mark",label:"Marca"},{value:"Comments",label:"Comentários"}],value:e.field,onChange:t=>{e.field=t}});a.appendChild(n.getElement());const r=new x({options:[{value:"equals",label:"="},{value:"contains",label:"contém"},{value:"startsWith",label:"começa com"},{value:"endsWith",label:"termina com"},{value:"greater",label:">"},{value:"less",label:"<"}],value:e.operator,onChange:t=>{e.operator=t}});a.appendChild(r.getElement());const i=new _({value:String(e.value),placeholder:"Valor...",onChange:t=>{e.value=t}});if(a.appendChild(i.getElement()),this.queries.length>1){const t=new c({text:"❌",variant:"danger",size:"sm"});t.getElement().addEventListener("click",()=>{this.queries.splice(s,1),this.render()}),a.appendChild(t.getElement())}return a}executeSearch(){this.onSearch?this.results=this.onSearch(this.queries):this.results=this.generateMockResults(),this.render()}generateMockResults(){const e=[],s=["Beam","Column","Wall","Door","Window"],a=Math.floor(Math.random()*20)+5;for(let n=0;n<a;n++){const r=s[Math.floor(Math.random()*s.length)];e.push({id:`elem-${n}`,type:r,name:`${r}-${n+1}`,properties:{Level:`Pavimento ${Math.floor(Math.random()*5)+1}`,Material:"Concreto",Category:r},matchedFields:["Name"]})}return e}renderResults(){const e=document.createElement("div");e.className="arxis-search__results";const s=document.createElement("div");s.className="arxis-search__results-header",s.innerHTML=`
      <span class="arxis-search__section-title">📊 Resultados</span>
      <span class="arxis-search__count">${this.results.length} elementos encontrados</span>
    `,e.appendChild(s);const a=document.createElement("div");a.className="arxis-search__results-list",this.results.forEach(t=>{const o=document.createElement("div");o.className="arxis-search__result-item";const l=document.createElement("div");l.className="arxis-search__result-icon",l.textContent=this.getTypeIcon(t.type);const d=document.createElement("div");d.className="arxis-search__result-info";const p=document.createElement("div");p.className="arxis-search__result-name",p.textContent=t.name;const h=document.createElement("div");h.className="arxis-search__result-meta",h.textContent=`${t.type} • ${t.properties.Level||"N/A"}`,d.appendChild(p),d.appendChild(h),o.appendChild(l),o.appendChild(d),o.addEventListener("click",()=>{this.onResultSelect?.(t)}),a.appendChild(o)}),e.appendChild(a);const n=document.createElement("div");n.className="arxis-search__result-actions";const r=new c({text:"☑️ Selecionar Todos",variant:"secondary",size:"sm"});r.getElement().addEventListener("click",()=>this.selectAllResults());const i=new c({text:"📤 Exportar",variant:"secondary",size:"sm"});return i.getElement().addEventListener("click",()=>this.exportResults()),n.appendChild(r.getElement()),n.appendChild(i.getElement()),e.appendChild(n),e}getTypeIcon(e){return{Beam:"🏗️",Column:"🏛️",Wall:"🧱",Door:"🚪",Window:"🪟",Slab:"⬛"}[e]||"📦"}runQuickSearch(e){console.log("Quick search:",e),this.executeSearch()}clearQueries(){this.queries=[],this.results=[],this.addDefaultQuery(),this.render()}saveFilter(){const e=prompt("Nome do filtro:");e&&(console.log("Salvando filtro:",e,this.queries),alert("Filtro salvo com sucesso!"))}selectAllResults(){console.log("Selecionando todos os resultados:",this.results)}exportResults(){console.log("Exportando resultados:",this.results)}getElement(){return this.card.getElement()}destroy(){this.card.destroy()}injectStyles(){if(document.getElementById("arxis-search-styles"))return;const e=document.createElement("style");e.id="arxis-search-styles",e.textContent=`
      .arxis-search__section-title {
        font-size: 13px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.9);
        margin-bottom: 12px;
        display: block;
      }

      .arxis-search__builder {
        margin-bottom: 16px;
      }

      .arxis-search__query-row {
        display: flex;
        gap: 8px;
        align-items: center;
        margin-bottom: 8px;
      }

      .arxis-search__quick {
        margin-bottom: 16px;
        padding: 12px;
        background: rgba(255, 255, 255, 0.03);
        border-radius: 8px;
      }

      .arxis-search__quick-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }

      .arxis-search__actions {
        display: flex;
        gap: 8px;
        margin-bottom: 16px;
      }

      .arxis-search__results {
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }

      .arxis-search__results-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      }

      .arxis-search__count {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
      }

      .arxis-search__results-list {
        max-height: 300px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin-bottom: 12px;
      }

      .arxis-search__result-item {
        display: flex;
        gap: 10px;
        align-items: center;
        padding: 10px;
        background: rgba(255, 255, 255, 0.04);
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .arxis-search__result-item:hover {
        background: rgba(255, 255, 255, 0.08);
        transform: translateX(3px);
      }

      .arxis-search__result-icon {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 6px;
        flex-shrink: 0;
      }

      .arxis-search__result-info {
        flex: 1;
        min-width: 0;
      }

      .arxis-search__result-name {
        font-size: 14px;
        font-weight: 500;
        color: #fff;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .arxis-search__result-meta {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
      }

      .arxis-search__result-actions {
        display: flex;
        gap: 8px;
      }
    `,document.head.appendChild(e)}}export{w as AdvancedSearchPanel};
