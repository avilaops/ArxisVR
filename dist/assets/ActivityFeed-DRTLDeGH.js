import{C as m}from"./Card-DLSvBshn.js";import{S as l}from"./Select-D01wDXMy.js";class x{card;activities=[];filterType="all";filterUser="all";autoScroll=!0;updateInterval;constructor(){this.card=new m({title:"📋 Feed de Atividades",variant:"glass"}),this.loadMockActivities(),this.render(),this.startAutoUpdate()}loadMockActivities(){const t=Date.now();this.activities=[{id:"act-1",type:"edit",user:"João Silva",userId:"user-1",action:"editou",target:"Viga V-23",timestamp:t-6e4},{id:"act-2",type:"comment",user:"Maria Santos",userId:"user-2",action:"comentou em",target:"Issue #42",timestamp:t-18e4},{id:"act-3",type:"issue",user:"Carlos Souza",userId:"user-3",action:"criou",target:"Issue #43: Interferência hidráulica",timestamp:t-3e5},{id:"act-4",type:"upload",user:"Ana Lima",userId:"user-4",action:"enviou",target:"Planta Estrutural Rev.08",timestamp:t-6e5},{id:"act-5",type:"view",user:"Pedro Costa",userId:"user-5",action:"visualizou",target:"Pavimento 3",timestamp:t-9e5},{id:"act-6",type:"export",user:"João Silva",userId:"user-1",action:"exportou",target:"Relatório BCF",timestamp:t-12e5},{id:"act-7",type:"share",user:"Maria Santos",userId:"user-2",action:"compartilhou",target:"Vista 3D com equipe",timestamp:t-18e5},{id:"act-8",type:"delete",user:"Carlos Souza",userId:"user-3",action:"removeu",target:"Anotação #15",timestamp:t-36e5}]}render(){const t=this.card.getBody();t.innerHTML="";const e=document.createElement("div");e.className="arxis-activity__controls";const i=new l({label:"Tipo:",options:[{value:"all",label:"Todas"},{value:"edit",label:"Edições"},{value:"comment",label:"Comentários"},{value:"issue",label:"Issues"},{value:"upload",label:"Uploads"},{value:"export",label:"Exportações"}],value:this.filterType,onChange:s=>{this.filterType=s,this.render()}}),a=new l({label:"Usuário:",options:[{value:"all",label:"Todos"},...this.getUniqueUsers().map(s=>({value:s.userId,label:s.userName}))],value:this.filterUser,onChange:s=>{this.filterUser=s,this.render()}});e.appendChild(i.getElement()),e.appendChild(a.getElement()),t.appendChild(e);const r=document.createElement("div");r.className="arxis-activity__timeline";const o=this.getFilteredActivities();if(o.length===0){const s=document.createElement("div");s.className="arxis-activity__empty",s.innerHTML="📭 Nenhuma atividade recente",r.appendChild(s)}else{const s=this.groupByDate(o);Object.entries(s).forEach(([n,c])=>{const d=document.createElement("div");d.className="arxis-activity__date-header",d.textContent=n,r.appendChild(d),c.forEach(u=>{const p=this.createActivityItem(u);r.appendChild(p)})})}t.appendChild(r),this.injectStyles(),this.autoScroll&&setTimeout(()=>{r.scrollTop=0},0)}getFilteredActivities(){return this.activities.filter(t=>!(this.filterType!=="all"&&t.type!==this.filterType||this.filterUser!=="all"&&t.userId!==this.filterUser))}groupByDate(t){const e={};return t.forEach(i=>{const a=this.getDateLabel(i.timestamp);e[a]||(e[a]=[]),e[a].push(i)}),e}getDateLabel(t){const e=new Date(t),i=new Date,a=new Date(i);return a.setDate(a.getDate()-1),e.toDateString()===i.toDateString()?"Hoje":e.toDateString()===a.toDateString()?"Ontem":e.toLocaleDateString("pt-BR",{day:"2-digit",month:"long",year:e.getFullYear()!==i.getFullYear()?"numeric":void 0})}getUniqueUsers(){const t=new Map;return this.activities.forEach(e=>{t.set(e.userId,e.user)}),Array.from(t.entries()).map(([e,i])=>({userId:e,userName:i}))}createActivityItem(t){const e=document.createElement("div");e.className="arxis-activity__item";const i=document.createElement("div");i.className=`arxis-activity__icon arxis-activity__icon--${t.type}`,i.textContent=this.getTypeIcon(t.type),e.appendChild(i);const a=document.createElement("div");a.className="arxis-activity__content";const r=document.createElement("div");r.className="arxis-activity__text";const o=document.createElement("strong");o.textContent=t.user;const s=document.createTextNode(` ${t.action} `);if(r.appendChild(o),r.appendChild(s),t.target){const c=document.createElement("span");c.className="arxis-activity__target",c.textContent=t.target,r.appendChild(c)}const n=document.createElement("div");return n.className="arxis-activity__time",n.textContent=this.formatTime(t.timestamp),a.appendChild(r),a.appendChild(n),e.appendChild(a),e}getTypeIcon(t){return{edit:"✏️",comment:"💬",issue:"⚠️",upload:"📤",delete:"🗑️",share:"🔗",view:"👁️",export:"📥"}[t]||"📌"}formatTime(t){const e=new Date(t),a=new Date().getTime()-e.getTime(),r=Math.floor(a/6e4),o=Math.floor(a/36e5);return r<1?"Agora":r<60?`${r} min atrás`:o<24?`${o}h atrás`:e.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}startAutoUpdate(){this.updateInterval=window.setInterval(()=>{if(Math.random()>.7){const t=["edit","comment","view","share"],e=this.getUniqueUsers(),i=e[Math.floor(Math.random()*e.length)],a=t[Math.floor(Math.random()*t.length)],r={id:`act-${Date.now()}`,type:a,user:i.userName,userId:i.userId,action:this.getActionVerb(a),target:this.getRandomTarget(a),timestamp:Date.now()};this.activities.unshift(r),this.render()}},15e3)}getActionVerb(t){return{edit:"editou",comment:"comentou em",issue:"criou",upload:"enviou",delete:"removeu",share:"compartilhou",view:"visualizou",export:"exportou"}[t]}getRandomTarget(t){const i={edit:["Viga V-15","Pilar P-23","Laje L-08"],comment:["Issue #42","Anotação #18","Revisão estrutural"],issue:["Interferência detectada","Erro de dimensão","Verificação necessária"],upload:["Planta Rev.09","Corte AA","Memorial descritivo"],delete:["Anotação #12","Comentário antigo","Versão anterior"],share:["Vista 3D","Relatório de clash","Modelo BIM"],view:["Pavimento 2","Fachada Norte","Cobertura"],export:["Relatório PDF","Modelo IFC","Imagens renderizadas"]}[t]||["Elemento"];return i[Math.floor(Math.random()*i.length)]}addActivity(t){this.activities.unshift(t),this.render()}clearActivities(){confirm("Limpar histórico de atividades?")&&(this.activities=[],this.render())}getElement(){return this.card.getElement()}destroy(){this.updateInterval&&clearInterval(this.updateInterval),this.card.destroy()}injectStyles(){if(document.getElementById("arxis-activity-styles"))return;const t=document.createElement("style");t.id="arxis-activity-styles",t.textContent=`
      .arxis-activity__controls {
        display: flex;
        gap: 12px;
        margin-bottom: 16px;
      }

      .arxis-activity__timeline {
        max-height: 500px;
        overflow-y: auto;
        padding-right: 4px;
      }

      .arxis-activity__date-header {
        position: sticky;
        top: 0;
        padding: 8px 12px;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(10px);
        border-radius: 6px;
        font-size: 12px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.8);
        text-transform: uppercase;
        margin-bottom: 12px;
        margin-top: 8px;
        z-index: 1;
      }

      .arxis-activity__date-header:first-child {
        margin-top: 0;
      }

      .arxis-activity__item {
        display: flex;
        gap: 12px;
        padding: 12px;
        margin-left: 8px;
        border-left: 2px solid rgba(255, 255, 255, 0.1);
        position: relative;
        animation: slideIn 0.3s;
      }

      .arxis-activity__item::before {
        content: '';
        position: absolute;
        left: -5px;
        top: 20px;
        width: 8px;
        height: 8px;
        background: rgba(0, 212, 255, 0.5);
        border-radius: 50%;
      }

      .arxis-activity__item:hover {
        background: rgba(255, 255, 255, 0.03);
        border-radius: 8px;
      }

      .arxis-activity__icon {
        width: 36px;
        height: 36px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.05);
      }

      .arxis-activity__icon--edit {
        background: rgba(0, 212, 255, 0.15);
      }

      .arxis-activity__icon--comment {
        background: rgba(123, 47, 247, 0.15);
      }

      .arxis-activity__icon--issue {
        background: rgba(255, 68, 68, 0.15);
      }

      .arxis-activity__icon--upload {
        background: rgba(76, 175, 80, 0.15);
      }

      .arxis-activity__icon--delete {
        background: rgba(255, 68, 68, 0.15);
      }

      .arxis-activity__icon--share {
        background: rgba(255, 170, 0, 0.15);
      }

      .arxis-activity__icon--view {
        background: rgba(0, 212, 255, 0.15);
      }

      .arxis-activity__icon--export {
        background: rgba(76, 175, 80, 0.15);
      }

      .arxis-activity__content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .arxis-activity__text {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.9);
        line-height: 1.4;
      }

      .arxis-activity__text strong {
        color: #00d4ff;
        font-weight: 600;
      }

      .arxis-activity__target {
        color: rgba(255, 255, 255, 0.7);
        font-style: italic;
      }

      .arxis-activity__time {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.5);
      }

      .arxis-activity__empty {
        text-align: center;
        padding: 60px 20px;
        color: rgba(255, 255, 255, 0.5);
        font-size: 15px;
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateX(-10px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
    `,document.head.appendChild(t)}}export{x as ActivityFeed};
