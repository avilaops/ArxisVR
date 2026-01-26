import{C as f}from"./Card-DLSvBshn.js";import{B as x}from"./Button-BvNVdej2.js";import{S as u}from"./Select-D01wDXMy.js";class E{card;annotations=[];filterStatus="all";filterType="all";onAnnotationClick;onAnnotationAdd;constructor(t){this.onAnnotationClick=t?.onAnnotationClick,this.onAnnotationAdd=t?.onAnnotationAdd,this.card=new f({title:"📍 Anotações",variant:"glass"}),this.loadMockAnnotations(),this.render()}loadMockAnnotations(){const t=Date.now();this.annotations=[{id:"ann-1",type:"issue",title:"Interferência hidráulica",description:"Tubulação passando pela viga V-15",author:"João Silva",timestamp:t-864e5,position:{x:10,y:5,z:8},status:"open",priority:"high",assignedTo:"Maria Santos"},{id:"ann-2",type:"comment",title:"Verificar acabamento",description:"Confirmar tipo de revestimento especificado",author:"Maria Santos",timestamp:t-432e5,position:{x:-5,y:2,z:3},status:"open",priority:"medium"},{id:"ann-3",type:"warning",title:"Atenção estrutural",description:"Sobrecarga detectada no pavimento",author:"Carlos Souza",timestamp:t-216e5,position:{x:0,y:10,z:0},status:"open",priority:"high"},{id:"ann-4",type:"measurement",title:"Medição de área",description:"Área total: 450m²",author:"Ana Lima",timestamp:t-72e5,position:{x:5,y:0,z:-5},status:"closed",priority:"low"}]}render(){const t=this.card.getBody();t.innerHTML="";const e=document.createElement("div");e.className="arxis-annotations__toolbar";const r=new x({text:"➕ Nova Anotação",variant:"primary",size:"sm"});r.getElement().addEventListener("click",()=>{this.onAnnotationAdd?.()});const i=new x({text:"📤 Exportar BCF",variant:"secondary",size:"sm"});i.getElement().addEventListener("click",()=>this.exportBCF()),e.appendChild(r.getElement()),e.appendChild(i.getElement()),t.appendChild(e);const a=document.createElement("div");a.className="arxis-annotations__filters";const c=new u({label:"Status:",options:[{value:"all",label:"Todos"},{value:"open",label:"Abertos"},{value:"resolved",label:"Resolvidos"},{value:"closed",label:"Fechados"}],value:this.filterStatus,onChange:n=>{this.filterStatus=n,this.render()}}),d=new u({label:"Tipo:",options:[{value:"all",label:"Todos"},{value:"comment",label:"Comentários"},{value:"issue",label:"Problemas"},{value:"warning",label:"Avisos"},{value:"measurement",label:"Medições"}],value:this.filterType,onChange:n=>{this.filterType=n,this.render()}});a.appendChild(c.getElement()),a.appendChild(d.getElement()),t.appendChild(a);const l=document.createElement("div");l.className="arxis-annotations__stats";const p=this.annotations.filter(n=>n.status==="open").length,m=this.annotations.filter(n=>n.priority==="high"&&n.status==="open").length;l.innerHTML=`
      <span class="arxis-annotations__stat">📊 ${this.annotations.length} total</span>
      <span class="arxis-annotations__stat">🔓 ${p} abertos</span>
      <span class="arxis-annotations__stat">⚠️ ${m} alta prioridade</span>
    `,t.appendChild(l);const o=document.createElement("div");o.className="arxis-annotations__list";const s=this.getFilteredAnnotations();if(s.length===0){const n=document.createElement("div");n.className="arxis-annotations__empty",n.textContent="Nenhuma anotação encontrada",o.appendChild(n)}else s.forEach(n=>{const g=this.createAnnotationItem(n);o.appendChild(g)});t.appendChild(o),this.injectStyles()}getFilteredAnnotations(){return this.annotations.filter(t=>!(this.filterStatus!=="all"&&t.status!==this.filterStatus||this.filterType!=="all"&&t.type!==this.filterType))}createAnnotationItem(t){const e=document.createElement("div");e.className=`arxis-annotations__item arxis-annotations__item--${t.priority}`,t.status==="closed"&&e.classList.add("arxis-annotations__item--closed");const r=document.createElement("div");r.className="arxis-annotations__icon",r.textContent=this.getIcon(t.type),e.appendChild(r);const i=document.createElement("div");i.className="arxis-annotations__content";const a=document.createElement("div");a.className="arxis-annotations__header";const c=document.createElement("h4");c.className="arxis-annotations__title",c.textContent=t.title;const d=document.createElement("div");d.className="arxis-annotations__badges";const l=document.createElement("span");l.className=`arxis-annotations__badge arxis-annotations__badge--${t.priority}`,l.textContent=this.getPriorityLabel(t.priority);const p=document.createElement("span");p.className=`arxis-annotations__badge arxis-annotations__badge--${t.status}`,p.textContent=this.getStatusLabel(t.status),d.appendChild(l),d.appendChild(p),a.appendChild(c),a.appendChild(d);const m=document.createElement("p");m.className="arxis-annotations__description",m.textContent=t.description;const o=document.createElement("div");o.className="arxis-annotations__meta",o.innerHTML=`
      <span>👤 ${t.author}</span>
      <span>📅 ${this.formatDate(t.timestamp)}</span>
      ${t.assignedTo?`<span>👥 ${t.assignedTo}</span>`:""}
    `,i.appendChild(a),i.appendChild(m),i.appendChild(o),e.appendChild(i);const s=document.createElement("div");s.className="arxis-annotations__actions";const n=new x({text:"👁️",variant:"secondary",size:"sm"});n.getElement().addEventListener("click",()=>{this.onAnnotationClick?.(t)});const g=new x({text:"✏️",variant:"secondary",size:"sm"});g.getElement().addEventListener("click",()=>this.editAnnotation(t));const h=new x({text:"🗑️",variant:"danger",size:"sm"});return h.getElement().addEventListener("click",()=>this.deleteAnnotation(t.id)),s.appendChild(n.getElement()),s.appendChild(g.getElement()),s.appendChild(h.getElement()),e.appendChild(s),e.addEventListener("click",_=>{_.target.closest("button")||this.onAnnotationClick?.(t)}),e}getIcon(t){return{comment:"💬",issue:"⚠️",measurement:"📏",warning:"🚨"}[t]||"📍"}getPriorityLabel(t){return{low:"Baixa",medium:"Média",high:"Alta"}[t]||t}getStatusLabel(t){return{open:"Aberto",resolved:"Resolvido",closed:"Fechado"}[t]||t}formatDate(t){const e=new Date(t),i=new Date().getTime()-e.getTime(),a=Math.floor(i/864e5);return a===0?"Hoje":a===1?"Ontem":a<7?`${a} dias atrás`:e.toLocaleDateString("pt-BR")}editAnnotation(t){console.log("Editar:",t)}deleteAnnotation(t){confirm("Excluir esta anotação?")&&(this.annotations=this.annotations.filter(e=>e.id!==t),this.render())}exportBCF(){console.log("Exportando BCF...")}addAnnotation(t){this.annotations.unshift(t),this.render()}getAnnotations(){return this.annotations}getElement(){return this.card.getElement()}destroy(){this.card.destroy()}injectStyles(){if(document.getElementById("arxis-annotations-styles"))return;const t=document.createElement("style");t.id="arxis-annotations-styles",t.textContent=`
      .arxis-annotations__toolbar {
        display: flex;
        gap: 8px;
        margin-bottom: 12px;
      }

      .arxis-annotations__filters {
        display: flex;
        gap: 12px;
        margin-bottom: 12px;
      }

      .arxis-annotations__stats {
        display: flex;
        gap: 16px;
        padding: 12px;
        background: rgba(255, 255, 255, 0.03);
        border-radius: 6px;
        margin-bottom: 12px;
      }

      .arxis-annotations__stat {
        font-size: 13px;
        color: rgba(255, 255, 255, 0.8);
      }

      .arxis-annotations__list {
        display: flex;
        flex-direction: column;
        gap: 12px;
        max-height: 500px;
        overflow-y: auto;
      }

      .arxis-annotations__item {
        display: flex;
        gap: 12px;
        padding: 12px;
        background: rgba(255, 255, 255, 0.05);
        border-left: 3px solid transparent;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .arxis-annotations__item:hover {
        background: rgba(255, 255, 255, 0.08);
      }

      .arxis-annotations__item--high {
        border-left-color: #ff4444;
      }

      .arxis-annotations__item--medium {
        border-left-color: #ffaa00;
      }

      .arxis-annotations__item--low {
        border-left-color: #00d4ff;
      }

      .arxis-annotations__item--closed {
        opacity: 0.6;
      }

      .arxis-annotations__icon {
        font-size: 24px;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        flex-shrink: 0;
      }

      .arxis-annotations__content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .arxis-annotations__header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
      }

      .arxis-annotations__title {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
        color: #fff;
      }

      .arxis-annotations__badges {
        display: flex;
        gap: 6px;
        flex-shrink: 0;
      }

      .arxis-annotations__badge {
        padding: 3px 8px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 500;
        white-space: nowrap;
      }

      .arxis-annotations__badge--high {
        background: rgba(255, 68, 68, 0.2);
        color: #ff4444;
      }

      .arxis-annotations__badge--medium {
        background: rgba(255, 170, 0, 0.2);
        color: #ffaa00;
      }

      .arxis-annotations__badge--low {
        background: rgba(0, 212, 255, 0.2);
        color: #00d4ff;
      }

      .arxis-annotations__badge--open {
        background: rgba(0, 212, 255, 0.2);
        color: #00d4ff;
      }

      .arxis-annotations__badge--resolved {
        background: rgba(76, 175, 80, 0.2);
        color: #4caf50;
      }

      .arxis-annotations__badge--closed {
        background: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.6);
      }

      .arxis-annotations__description {
        margin: 0;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.8);
        line-height: 1.4;
      }

      .arxis-annotations__meta {
        display: flex;
        gap: 12px;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
      }

      .arxis-annotations__actions {
        display: flex;
        flex-direction: column;
        gap: 4px;
        flex-shrink: 0;
      }

      .arxis-annotations__empty {
        text-align: center;
        padding: 40px 20px;
        color: rgba(255, 255, 255, 0.5);
      }
    `,document.head.appendChild(t)}}export{E as AnnotationsPanel};
