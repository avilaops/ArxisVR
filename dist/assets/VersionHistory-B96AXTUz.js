import{C as x}from"./Card-DLSvBshn.js";import{B as g}from"./Button-BvNVdej2.js";class f{card;versions=[];onVersionRestore;onVersionCompare;constructor(e){this.onVersionRestore=e?.onVersionRestore,this.onVersionCompare=e?.onVersionCompare,this.card=new x({title:"📜 Histórico de Versões",variant:"glass"}),this.loadVersions(),this.render()}loadVersions(){const e=Date.now();this.versions=[{id:"v-8",number:"v8.0",description:"Ajustes finais estrutura pavimento tipo",author:"João Silva",timestamp:e-36e5,isCurrent:!0,changes:[{type:"modified",category:"Vigas",count:8},{type:"added",category:"Pilares",count:2}],tags:["aprovado","estrutura"]},{id:"v-7",number:"v7.2",description:"Correção interferências hidráulicas",author:"Maria Santos",timestamp:e-864e5,isCurrent:!1,changes:[{type:"modified",category:"Tubulações",count:12},{type:"deleted",category:"Conexões",count:3}],tags:["hidráulica"]},{id:"v-6",number:"v7.1",description:"Atualização plantas arquitetônicas",author:"Carlos Souza",timestamp:e-1728e5,isCurrent:!1,changes:[{type:"modified",category:"Paredes",count:15},{type:"added",category:"Esquadrias",count:8},{type:"modified",category:"Pisos",count:4}],tags:["arquitetura","aprovado"]},{id:"v-5",number:"v7.0",description:"Revisão estrutural completa",author:"João Silva",timestamp:e-2592e5,isCurrent:!1,changes:[{type:"added",category:"Vigas",count:24},{type:"modified",category:"Lajes",count:6},{type:"added",category:"Pilares",count:12}],tags:["estrutura","marco"]},{id:"v-4",number:"v6.5",description:"Ajustes fachada sul",author:"Ana Lima",timestamp:e-432e6,isCurrent:!1,changes:[{type:"modified",category:"Fachada",count:18}]},{id:"v-3",number:"v6.0",description:"Modelo inicial completo",author:"João Silva",timestamp:e-6048e5,isCurrent:!1,changes:[{type:"added",category:"Estrutura",count:150},{type:"added",category:"Arquitetura",count:200}],tags:["marco","baseline"]}]}render(){const e=this.card.getBody();e.innerHTML="";const i=document.createElement("div");i.className="arxis-version__summary";const c=this.versions.find(d=>d.isCurrent);i.innerHTML=`
      <div class="arxis-version__current">
        <span class="arxis-version__current-label">Versão Atual:</span>
        <span class="arxis-version__current-number">${c?.number||"N/A"}</span>
      </div>
      <div class="arxis-version__stats">
        <span>📊 ${this.versions.length} versões</span>
        <span>👥 ${new Set(this.versions.map(d=>d.author)).size} colaboradores</span>
      </div>
    `,e.appendChild(i);const a=document.createElement("div");a.className="arxis-version__actions";const s=new g({text:"➕ Nova Versão",variant:"primary",size:"sm"});s.getElement().addEventListener("click",()=>this.createVersion());const r=new g({text:"⚖️ Comparar",variant:"secondary",size:"sm"});r.getElement().addEventListener("click",()=>this.compareVersions()),a.appendChild(s.getElement()),a.appendChild(r.getElement()),e.appendChild(a);const o=document.createElement("div");o.className="arxis-version__timeline",this.versions.forEach((d,p)=>{const l=this.createVersionItem(d,p===0);o.appendChild(l)}),e.appendChild(o),this.injectStyles()}createVersionItem(e,i){const c=document.createElement("div");c.className=`arxis-version__item ${e.isCurrent?"arxis-version__item--current":""}`;const a=document.createElement("div");a.className="arxis-version__connector";const s=document.createElement("div");if(s.className="arxis-version__dot",e.isCurrent&&s.classList.add("arxis-version__dot--current"),a.appendChild(s),!i){const t=document.createElement("div");t.className="arxis-version__line",a.appendChild(t)}c.appendChild(a);const r=document.createElement("div");r.className="arxis-version__content";const o=document.createElement("div");o.className="arxis-version__header";const d=document.createElement("h4");d.className="arxis-version__number",d.textContent=e.number;const p=document.createElement("div");if(p.className="arxis-version__badges",e.isCurrent){const t=document.createElement("span");t.className="arxis-version__badge arxis-version__badge--current",t.textContent="✓ Atual",p.appendChild(t)}e.tags?.forEach(t=>{const n=document.createElement("span");n.className="arxis-version__badge",n.textContent=t,p.appendChild(n)}),o.appendChild(d),o.appendChild(p);const l=document.createElement("p");l.className="arxis-version__description",l.textContent=e.description;const u=document.createElement("div");if(u.className="arxis-version__meta",u.innerHTML=`
      <span>👤 ${e.author}</span>
      <span>📅 ${this.formatDate(e.timestamp)}</span>
    `,e.changes.length>0){const t=document.createElement("div");t.className="arxis-version__changes",e.changes.forEach(n=>{const m=document.createElement("div");m.className=`arxis-version__change arxis-version__change--${n.type}`,m.innerHTML=`
          ${this.getChangeIcon(n.type)}
          <span>${n.count} ${n.category}</span>
        `,t.appendChild(m)}),r.appendChild(o),r.appendChild(l),r.appendChild(u),r.appendChild(t)}else r.appendChild(o),r.appendChild(l),r.appendChild(u);if(c.appendChild(r),!e.isCurrent){const t=document.createElement("div");t.className="arxis-version__item-actions";const n=new g({text:"👁️",variant:"secondary",size:"sm"});n.getElement().addEventListener("click",()=>this.viewVersion(e));const m=new g({text:"↶",variant:"primary",size:"sm"});m.getElement().addEventListener("click",()=>this.restoreVersion(e)),t.appendChild(n.getElement()),t.appendChild(m.getElement()),c.appendChild(t)}return c}getChangeIcon(e){return{added:"➕",modified:"✏️",deleted:"🗑️"}[e]||"•"}formatDate(e){const i=new Date(e),a=new Date().getTime()-i.getTime(),s=Math.floor(a/36e5),r=Math.floor(a/864e5);return s<1?"Agora":s<24?`${s}h atrás`:r<7?`${r}d atrás`:i.toLocaleDateString("pt-BR",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"})}createVersion(){const e=prompt("Descrição da nova versão:");e&&console.log("Criando versão:",e)}compareVersions(){console.log("Comparar versões")}viewVersion(e){console.log("Visualizar versão:",e.number)}restoreVersion(e){confirm(`Restaurar para versão ${e.number}? Esta ação criará uma nova versão.`)&&(this.onVersionRestore?.(e),console.log("Restaurando versão:",e.number))}getElement(){return this.card.getElement()}destroy(){this.card.destroy()}injectStyles(){if(document.getElementById("arxis-version-styles"))return;const e=document.createElement("style");e.id="arxis-version-styles",e.textContent=`
      .arxis-version__summary {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        background: rgba(0, 212, 255, 0.1);
        border-radius: 8px;
        margin-bottom: 16px;
      }

      .arxis-version__current {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .arxis-version__current-label {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.7);
        text-transform: uppercase;
      }

      .arxis-version__current-number {
        font-size: 20px;
        font-weight: 700;
        color: #00d4ff;
      }

      .arxis-version__stats {
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
        text-align: right;
      }

      .arxis-version__actions {
        display: flex;
        gap: 8px;
        margin-bottom: 20px;
      }

      .arxis-version__timeline {
        position: relative;
        max-height: 500px;
        overflow-y: auto;
      }

      .arxis-version__item {
        display: flex;
        gap: 16px;
        margin-bottom: 24px;
        position: relative;
      }

      .arxis-version__item--current {
        background: rgba(0, 212, 255, 0.05);
        padding: 12px;
        border-radius: 8px;
        margin-left: -12px;
        margin-right: -12px;
      }

      .arxis-version__connector {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 20px;
        flex-shrink: 0;
      }

      .arxis-version__dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        border: 2px solid rgba(255, 255, 255, 0.5);
        z-index: 1;
      }

      .arxis-version__dot--current {
        width: 16px;
        height: 16px;
        background: #00d4ff;
        border-color: #00d4ff;
        box-shadow: 0 0 12px rgba(0, 212, 255, 0.6);
      }

      .arxis-version__line {
        width: 2px;
        flex: 1;
        background: rgba(255, 255, 255, 0.1);
        margin-top: 4px;
      }

      .arxis-version__content {
        flex: 1;
        min-width: 0;
      }

      .arxis-version__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        margin-bottom: 8px;
      }

      .arxis-version__number {
        margin: 0;
        font-size: 16px;
        font-weight: 700;
        color: #fff;
      }

      .arxis-version__badges {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
      }

      .arxis-version__badge {
        padding: 3px 10px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        font-size: 11px;
        color: rgba(255, 255, 255, 0.8);
      }

      .arxis-version__badge--current {
        background: rgba(0, 212, 255, 0.2);
        color: #00d4ff;
        font-weight: 600;
      }

      .arxis-version__description {
        margin: 0 0 8px 0;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.9);
        line-height: 1.4;
      }

      .arxis-version__meta {
        display: flex;
        gap: 12px;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
        margin-bottom: 8px;
      }

      .arxis-version__changes {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 10px;
      }

      .arxis-version__change {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
      }

      .arxis-version__change--added {
        background: rgba(76, 175, 80, 0.15);
        color: #4caf50;
      }

      .arxis-version__change--modified {
        background: rgba(0, 212, 255, 0.15);
        color: #00d4ff;
      }

      .arxis-version__change--deleted {
        background: rgba(255, 68, 68, 0.15);
        color: #ff4444;
      }

      .arxis-version__item-actions {
        display: flex;
        gap: 4px;
        flex-shrink: 0;
      }
    `,document.head.appendChild(e)}}export{f as VersionHistory};
