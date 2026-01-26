import{C as x}from"./Card-DLSvBshn.js";import{B as d}from"./Button-BvNVdej2.js";import{S as u}from"./Select-D01wDXMy.js";import{T as f}from"./Toggle-D3VS2hV5.js";class w{card;rootGroup;onFilterChange;previewEnabled=!0;constructor(e){this.onFilterChange=e?.onFilterChange,this.card=new x({title:"🎯 Construtor de Filtros",variant:"glass"}),this.rootGroup=this.createDefaultGroup(),this.render()}createDefaultGroup(){return{id:"group-0",logic:"AND",rules:[]}}render(){const e=this.card.getBody();e.innerHTML="";const t=document.createElement("div");t.className="arxis-filter__toolbar";const a=new d({text:"➕ Regra",variant:"primary",size:"sm"});a.getElement().addEventListener("click",()=>{this.addRule(this.rootGroup),this.render()});const r=new d({text:"📦 Grupo",variant:"secondary",size:"sm"});r.getElement().addEventListener("click",()=>{this.addGroup(this.rootGroup),this.render()});const n=new d({text:"🗑️ Limpar",variant:"danger",size:"sm"});n.getElement().addEventListener("click",()=>{this.rootGroup=this.createDefaultGroup(),this.render()}),t.appendChild(a.getElement()),t.appendChild(r.getElement()),t.appendChild(n.getElement());const l=new f({label:"Preview",checked:this.previewEnabled,onChange:m=>{this.previewEnabled=m,this.render()}});t.appendChild(l.getElement()),e.appendChild(t);const s=this.renderTemplates();e.appendChild(s);const o=document.createElement("div");o.className="arxis-filter__builder";const i=this.renderGroup(this.rootGroup);if(o.appendChild(i),e.appendChild(o),this.previewEnabled&&this.hasRules(this.rootGroup)){const m=this.renderPreview();e.appendChild(m)}const p=document.createElement("div");p.className="arxis-filter__actions";const c=new d({text:"✅ Aplicar Filtro",variant:"primary",size:"sm"});c.getElement().addEventListener("click",()=>{this.applyFilter()});const g=new d({text:"💾 Salvar",variant:"secondary",size:"sm"});g.getElement().addEventListener("click",()=>{this.saveFilter()});const h=new d({text:"📤 Exportar",variant:"secondary",size:"sm"});h.getElement().addEventListener("click",()=>{this.exportFilter()}),p.appendChild(c.getElement()),p.appendChild(g.getElement()),p.appendChild(h.getElement()),e.appendChild(p),this.injectStyles()}renderTemplates(){const e=document.createElement("div");e.className="arxis-filter__templates";const t=document.createElement("div");t.className="arxis-filter__section-title",t.textContent="📋 Templates",e.appendChild(t);const a=document.createElement("div");return a.className="arxis-filter__template-list",[{name:"Estrutura",icon:"🏗️",desc:"Vigas e pilares"},{name:"Portas/Janelas",icon:"🚪",desc:"Esquadrias"},{name:"MEP",icon:"⚙️",desc:"Instalações"},{name:"Arquitetura",icon:"🏛️",desc:"Elementos arquitetônicos"}].forEach(n=>{const l=document.createElement("div");l.className="arxis-filter__template-item",l.innerHTML=`
        <div class="arxis-filter__template-icon">${n.icon}</div>
        <div class="arxis-filter__template-info">
          <div class="arxis-filter__template-name">${n.name}</div>
          <div class="arxis-filter__template-desc">${n.desc}</div>
        </div>
      `,l.addEventListener("click",()=>this.loadTemplate(n.name)),a.appendChild(l)}),e.appendChild(a),e}renderGroup(e,t=0){const a=document.createElement("div");a.className="arxis-filter__group",a.style.marginLeft=`${t*20}px`;const r=document.createElement("div");r.className="arxis-filter__group-header";const n=new u({options:[{value:"AND",label:"E (AND)"},{value:"OR",label:"OU (OR)"}],value:e.logic,onChange:i=>{e.logic=i,this.render()}}),l=new d({text:"+ Regra",variant:"secondary",size:"xs"});l.getElement().addEventListener("click",()=>{this.addRule(e),this.render()});const s=new d({text:"+ Grupo",variant:"secondary",size:"xs"});if(s.getElement().addEventListener("click",()=>{this.addGroup(e),this.render()}),r.appendChild(n.getElement()),r.appendChild(l.getElement()),r.appendChild(s.getElement()),t>0){const i=new d({text:"❌",variant:"danger",size:"xs"});i.getElement().addEventListener("click",()=>{this.removeGroup(e),this.render()}),r.appendChild(i.getElement())}a.appendChild(r);const o=document.createElement("div");return o.className="arxis-filter__group-content",e.rules.forEach((i,p)=>{if("rules"in i){const c=this.renderGroup(i,t+1);o.appendChild(c)}else{const c=this.renderRule(i,e,p);o.appendChild(c)}}),a.appendChild(o),a}renderRule(e,t,a){const r=document.createElement("div");r.className="arxis-filter__rule";const n=new u({options:[{value:"Name",label:"Nome"},{value:"Type",label:"Tipo"},{value:"Category",label:"Categoria"},{value:"Level",label:"Nível"},{value:"Material",label:"Material"},{value:"Mark",label:"Marca"},{value:"Volume",label:"Volume"},{value:"Area",label:"Área"}],value:e.field,onChange:i=>{e.field=i,this.render()}}),l=new u({options:[{value:"equals",label:"igual a"},{value:"not_equals",label:"diferente de"},{value:"contains",label:"contém"},{value:"starts_with",label:"começa com"},{value:"ends_with",label:"termina com"},{value:"greater_than",label:"maior que"},{value:"less_than",label:"menor que"},{value:"between",label:"entre"},{value:"in_list",label:"na lista"}],value:e.operator,onChange:i=>{e.operator=i,this.render()}}),s=document.createElement("input");s.type="text",s.className="arxis-filter__rule-value",s.value=e.value||"",s.placeholder="Valor...",s.addEventListener("input",i=>{e.value=i.target.value});const o=new d({text:"❌",variant:"danger",size:"xs"});return o.getElement().addEventListener("click",()=>{t.rules.splice(a,1),this.render()}),r.appendChild(n.getElement()),r.appendChild(l.getElement()),r.appendChild(s),r.appendChild(o.getElement()),r}renderPreview(){const e=document.createElement("div");e.className="arxis-filter__preview";const t=document.createElement("div");t.className="arxis-filter__section-title",t.textContent="👁️ Preview SQL",e.appendChild(t);const a=document.createElement("pre");return a.className="arxis-filter__sql",a.textContent=this.generateSQL(this.rootGroup),e.appendChild(a),e}generateSQL(e){return e.rules.length===0?"SELECT * FROM Elements":`SELECT * FROM Elements WHERE ${e.rules.map(r=>{if("rules"in r)return`(${this.generateSQL(r)})`;{const n=r;return`${n.field} ${this.getOperatorSQL(n.operator)} '${n.value}'`}}).join(` ${e.logic} `)}`}getOperatorSQL(e){return{equals:"=",not_equals:"!=",contains:"LIKE",starts_with:"LIKE",ends_with:"LIKE",greater_than:">",less_than:"<",between:"BETWEEN",in_list:"IN"}[e]||"="}hasRules(e){return e.rules.length>0}addRule(e){e.rules.push({id:`rule-${Date.now()}`,field:"Name",operator:"contains",value:"",type:"property"})}addGroup(e){e.rules.push({id:`group-${Date.now()}`,logic:"AND",rules:[]})}removeGroup(e){console.log("Remove group:",e.id)}loadTemplate(e){console.log("Loading template:",e)}applyFilter(){this.onFilterChange?.(this.rootGroup)}saveFilter(){const e=prompt("Nome do filtro:");if(e){const t=JSON.stringify(this.rootGroup,null,2);console.log("Saving filter:",e,t),alert("Filtro salvo com sucesso!")}}exportFilter(){const e=JSON.stringify(this.rootGroup,null,2),t=new Blob([e],{type:"application/json"}),a=URL.createObjectURL(t),r=document.createElement("a");r.href=a,r.download=`filter-${Date.now()}.json`,r.click()}getElement(){return this.card.getElement()}destroy(){this.card.destroy()}injectStyles(){if(document.getElementById("arxis-filter-builder-styles"))return;const e=document.createElement("style");e.id="arxis-filter-builder-styles",e.textContent=`
      .arxis-filter__toolbar {
        display: flex;
        gap: 8px;
        align-items: center;
        margin-bottom: 12px;
        flex-wrap: wrap;
      }

      .arxis-filter__section-title {
        font-size: 13px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.9);
        margin-bottom: 12px;
      }

      .arxis-filter__templates {
        margin-bottom: 16px;
        padding: 12px;
        background: rgba(255, 255, 255, 0.03);
        border-radius: 8px;
      }

      .arxis-filter__template-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 8px;
      }

      .arxis-filter__template-item {
        padding: 10px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .arxis-filter__template-item:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: translateY(-2px);
      }

      .arxis-filter__template-icon {
        font-size: 24px;
      }

      .arxis-filter__template-info {
        flex: 1;
      }

      .arxis-filter__template-name {
        font-size: 13px;
        font-weight: 500;
        color: #fff;
      }

      .arxis-filter__template-desc {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.6);
      }

      .arxis-filter__builder {
        margin-bottom: 16px;
      }

      .arxis-filter__group {
        padding: 12px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        margin-bottom: 8px;
      }

      .arxis-filter__group-header {
        display: flex;
        gap: 8px;
        align-items: center;
        margin-bottom: 12px;
      }

      .arxis-filter__group-content {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .arxis-filter__rule {
        display: flex;
        gap: 8px;
        align-items: center;
        padding: 8px;
        background: rgba(255, 255, 255, 0.04);
        border-radius: 6px;
      }

      .arxis-filter__rule-value {
        flex: 1;
        padding: 8px 12px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        color: #fff;
        font-size: 13px;
        outline: none;
      }

      .arxis-filter__rule-value:focus {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(0, 212, 255, 0.5);
      }

      .arxis-filter__preview {
        padding: 12px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 8px;
        margin-bottom: 16px;
      }

      .arxis-filter__sql {
        margin: 0;
        padding: 12px;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 6px;
        color: #00d4ff;
        font-family: 'Courier New', monospace;
        font-size: 12px;
        line-height: 1.5;
        overflow-x: auto;
        white-space: pre-wrap;
      }

      .arxis-filter__actions {
        display: flex;
        gap: 8px;
      }
    `,document.head.appendChild(e)}}export{w as FilterBuilder};
