import{C as E}from"./Card-DLSvBshn.js";import{B as a}from"./Button-BvNVdej2.js";import{T as v}from"./Toggle-D3VS2hV5.js";class w{card;selectionSets=[];onSetSelect;onSetUpdate;constructor(e){this.onSetSelect=e?.onSetSelect,this.onSetUpdate=e?.onSetUpdate,this.card=new E({title:"📑 Conjuntos de Seleção",variant:"glass"}),this.loadMockSets(),this.render()}loadMockSets(){const e=Date.now();this.selectionSets=[{id:"set-1",name:"Vigas Pavimento 3",description:"Todas as vigas do pavimento tipo",elementIds:["V-01","V-02","V-03","V-04","V-05"],color:"#00d4ff",visible:!0,locked:!1,createdAt:e-2592e6,updatedAt:e-864e6},{id:"set-2",name:"Esquadrias Fachada Sul",description:"Portas e janelas da fachada principal",elementIds:["P-01","P-02","J-01","J-02","J-03"],color:"#7b2ff7",visible:!0,locked:!1,createdAt:e-1728e6,updatedAt:e-432e6},{id:"set-3",name:"Elementos com Clash",description:"Elementos com interferências detectadas",elementIds:["V-23","TUB-H-045","DUC-AR-12"],color:"#ff4444",visible:!0,locked:!0,createdAt:e-864e6,updatedAt:e-864e6},{id:"set-4",name:"Paredes Perímetro",description:"Todas as paredes externas",elementIds:["W-01","W-02","W-03","W-04"],color:"#ffaa00",visible:!1,locked:!1,createdAt:e-1296e6,updatedAt:e-1728e5},{id:"set-5",name:"Instalações Elétricas",description:"Quadros, eletrodutos e luminárias",elementIds:["QE-01","QE-02","ELEC-100","ELEC-101"],color:"#4caf50",visible:!0,locked:!1,createdAt:e-432e6,updatedAt:e-864e5}]}render(){const e=this.card.getBody();e.innerHTML="";const t=document.createElement("div");t.className="arxis-selection-sets__toolbar";const i=new a({text:"➕ Novo Conjunto",variant:"primary",size:"sm"});i.getElement().addEventListener("click",()=>this.createSet());const o=new a({text:"📦 Da Seleção",variant:"secondary",size:"sm"});o.getElement().addEventListener("click",()=>this.createFromSelection());const p=new a({text:"🔗 Mesclar",variant:"secondary",size:"sm"});p.getElement().addEventListener("click",()=>this.mergeSets()),t.appendChild(i.getElement()),t.appendChild(o.getElement()),t.appendChild(p.getElement()),e.appendChild(t);const l=document.createElement("div");l.className="arxis-selection-sets__stats";const g=this.selectionSets.reduce((n,d)=>n+d.elementIds.length,0),m=this.selectionSets.filter(n=>n.visible).length;l.innerHTML=`
      <div class="arxis-selection-sets__stat">
        <span class="arxis-selection-sets__stat-value">${this.selectionSets.length}</span>
        <span class="arxis-selection-sets__stat-label">Conjuntos</span>
      </div>
      <div class="arxis-selection-sets__stat">
        <span class="arxis-selection-sets__stat-value">${g}</span>
        <span class="arxis-selection-sets__stat-label">Elementos</span>
      </div>
      <div class="arxis-selection-sets__stat">
        <span class="arxis-selection-sets__stat-value">${m}</span>
        <span class="arxis-selection-sets__stat-label">Visíveis</span>
      </div>
    `,e.appendChild(l);const c=document.createElement("div");c.className="arxis-selection-sets__bulk-actions";const x=new a({text:"👁️ Mostrar Todos",variant:"secondary",size:"sm"});x.getElement().addEventListener("click",()=>this.showAll());const r=new a({text:"🙈 Ocultar Todos",variant:"secondary",size:"sm"});r.getElement().addEventListener("click",()=>this.hideAll()),c.appendChild(x.getElement()),c.appendChild(r.getElement()),e.appendChild(c);const h=document.createElement("div");if(h.className="arxis-selection-sets__list",this.selectionSets.length===0){const n=document.createElement("div");n.className="arxis-selection-sets__empty",n.innerHTML='📂 Nenhum conjunto criado<br><small>Selecione elementos e clique em "Da Seleção"</small>',h.appendChild(n)}else this.selectionSets.forEach(n=>{const d=this.createSetItem(n);h.appendChild(d)});e.appendChild(h),this.injectStyles()}createSetItem(e){const t=document.createElement("div");t.className="arxis-selection-sets__item",e.visible||t.classList.add("arxis-selection-sets__item--hidden");const i=document.createElement("div");i.className="arxis-selection-sets__color",i.style.background=e.color||"#00d4ff",t.appendChild(i);const o=document.createElement("div");o.className="arxis-selection-sets__info";const p=document.createElement("div");p.className="arxis-selection-sets__header";const l=document.createElement("div");l.className="arxis-selection-sets__name-wrapper";const g=document.createElement("h4");g.className="arxis-selection-sets__name",g.textContent=e.name;const m=document.createElement("div");if(m.className="arxis-selection-sets__badges",e.locked){const s=document.createElement("span");s.className="arxis-selection-sets__badge",s.textContent="🔒",s.title="Bloqueado",m.appendChild(s)}const c=document.createElement("span");if(c.className="arxis-selection-sets__badge arxis-selection-sets__badge--count",c.textContent=`${e.elementIds.length}`,m.appendChild(c),l.appendChild(g),l.appendChild(m),p.appendChild(l),e.description){const s=document.createElement("p");s.className="arxis-selection-sets__description",s.textContent=e.description,o.appendChild(s)}const x=document.createElement("div");x.className="arxis-selection-sets__meta",x.innerHTML=`
      <span>📅 ${this.formatDate(e.updatedAt)}</span>
      <span>🎨 ${e.color}</span>
    `,o.appendChild(p),o.appendChild(x),t.appendChild(o);const r=document.createElement("div");r.className="arxis-selection-sets__controls";const h=new v({checked:e.visible,onChange:s=>{e.visible=s,this.onSetUpdate?.(e),this.render()}});r.appendChild(h.getElement());const n=document.createElement("div");n.className="arxis-selection-sets__actions";const d=new a({text:"☑️",variant:"primary",size:"sm"});d.getElement().title="Selecionar elementos",d.getElement().addEventListener("click",s=>{s.stopPropagation(),this.selectSet(e)});const _=new a({text:"🎯",variant:"secondary",size:"sm"});_.getElement().title="Isolar conjunto",_.getElement().addEventListener("click",s=>{s.stopPropagation(),this.isolateSet(e)});const u=new a({text:"✏️",variant:"secondary",size:"sm"});u.getElement().title="Editar",u.getElement().addEventListener("click",s=>{s.stopPropagation(),this.editSet(e)});const f=new a({text:"🗑️",variant:"danger",size:"sm"});return f.getElement().title="Excluir",f.getElement().disabled=e.locked,f.getElement().addEventListener("click",s=>{s.stopPropagation(),this.deleteSet(e)}),n.appendChild(d.getElement()),n.appendChild(_.getElement()),n.appendChild(u.getElement()),n.appendChild(f.getElement()),r.appendChild(n),t.appendChild(r),t.addEventListener("click",()=>{this.selectSet(e)}),t}formatDate(e){return new Date(e).toLocaleDateString("pt-BR",{day:"2-digit",month:"short"})}createSet(){const e=prompt("Nome do conjunto:");if(e){const t={id:`set-${Date.now()}`,name:e,elementIds:[],color:this.getRandomColor(),visible:!0,locked:!1,createdAt:Date.now(),updatedAt:Date.now()};this.selectionSets.unshift(t),this.render()}}createFromSelection(){const e=prompt("Nome do conjunto:");if(e){const t=["ELEM-01","ELEM-02","ELEM-03"],i={id:`set-${Date.now()}`,name:e,description:`${t.length} elementos selecionados`,elementIds:t,color:this.getRandomColor(),visible:!0,locked:!1,createdAt:Date.now(),updatedAt:Date.now()};this.selectionSets.unshift(i),this.render()}}mergeSets(){console.log("Mesclar conjuntos selecionados")}selectSet(e){this.onSetSelect?.(e),console.log("Selecionando conjunto:",e.name,e.elementIds)}isolateSet(e){this.selectionSets.forEach(t=>{t.visible=t.id===e.id}),this.render()}editSet(e){const t=prompt("Novo nome:",e.name);t&&(e.name=t,e.updatedAt=Date.now(),this.render())}deleteSet(e){e.locked||confirm(`Excluir conjunto "${e.name}"?`)&&(this.selectionSets=this.selectionSets.filter(t=>t.id!==e.id),this.render())}showAll(){this.selectionSets.forEach(e=>e.visible=!0),this.render()}hideAll(){this.selectionSets.forEach(e=>e.visible=!1),this.render()}getRandomColor(){const e=["#00d4ff","#7b2ff7","#ff4444","#ffaa00","#4caf50","#ff6ec7"];return e[Math.floor(Math.random()*e.length)]}getElement(){return this.card.getElement()}destroy(){this.card.destroy()}injectStyles(){if(document.getElementById("arxis-selection-sets-styles"))return;const e=document.createElement("style");e.id="arxis-selection-sets-styles",e.textContent=`
      .arxis-selection-sets__toolbar {
        display: flex;
        gap: 8px;
        margin-bottom: 12px;
        flex-wrap: wrap;
      }

      .arxis-selection-sets__stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
        padding: 12px;
        background: rgba(255, 255, 255, 0.03);
        border-radius: 8px;
        margin-bottom: 12px;
      }

      .arxis-selection-sets__stat {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
      }

      .arxis-selection-sets__stat-value {
        font-size: 20px;
        font-weight: 700;
        color: #00d4ff;
      }

      .arxis-selection-sets__stat-label {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.6);
        text-transform: uppercase;
      }

      .arxis-selection-sets__bulk-actions {
        display: flex;
        gap: 8px;
        margin-bottom: 16px;
      }

      .arxis-selection-sets__list {
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-height: 450px;
        overflow-y: auto;
      }

      .arxis-selection-sets__item {
        display: flex;
        gap: 12px;
        padding: 12px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .arxis-selection-sets__item:hover {
        background: rgba(255, 255, 255, 0.08);
        transform: translateX(2px);
      }

      .arxis-selection-sets__item--hidden {
        opacity: 0.5;
      }

      .arxis-selection-sets__color {
        width: 6px;
        border-radius: 3px;
        flex-shrink: 0;
      }

      .arxis-selection-sets__info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 6px;
        min-width: 0;
      }

      .arxis-selection-sets__header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }

      .arxis-selection-sets__name-wrapper {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1;
      }

      .arxis-selection-sets__name {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
        color: #fff;
      }

      .arxis-selection-sets__badges {
        display: flex;
        gap: 6px;
        align-items: center;
      }

      .arxis-selection-sets__badge {
        font-size: 12px;
      }

      .arxis-selection-sets__badge--count {
        padding: 2px 8px;
        background: rgba(0, 212, 255, 0.2);
        color: #00d4ff;
        border-radius: 10px;
        font-weight: 600;
      }

      .arxis-selection-sets__description {
        margin: 0;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
      }

      .arxis-selection-sets__meta {
        display: flex;
        gap: 12px;
        font-size: 11px;
        color: rgba(255, 255, 255, 0.5);
      }

      .arxis-selection-sets__controls {
        display: flex;
        flex-direction: column;
        gap: 8px;
        align-items: flex-end;
      }

      .arxis-selection-sets__actions {
        display: flex;
        gap: 4px;
      }

      .arxis-selection-sets__empty {
        text-align: center;
        padding: 60px 20px;
        color: rgba(255, 255, 255, 0.5);
        font-size: 15px;
        line-height: 1.8;
      }

      .arxis-selection-sets__empty small {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.4);
      }
    `,document.head.appendChild(e)}}export{w as SelectionSetsPanel};
