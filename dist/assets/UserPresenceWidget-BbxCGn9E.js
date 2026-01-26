import{C as u}from"./Card-DLSvBshn.js";class f{card;users=[];onUserClick;updateInterval;constructor(e){this.onUserClick=e?.onUserClick,this.card=new u({title:"👥 Usuários Online",variant:"glass"}),this.loadMockUsers(),this.render(),this.startAutoUpdate()}loadMockUsers(){this.users=[{id:"user-1",name:"João Silva",status:"online",currentView:"Pavimento 3 - Estrutura",color:"#00d4ff"},{id:"user-2",name:"Maria Santos",status:"online",currentView:"Fachada Sul",color:"#7b2ff7"},{id:"user-3",name:"Carlos Souza",status:"away",currentView:"Planta Baixa",lastSeen:Date.now()-3e5,color:"#ffaa00"},{id:"user-4",name:"Ana Lima",status:"busy",currentView:"Instalações Hidráulicas",color:"#ff4444"},{id:"user-5",name:"Pedro Costa",status:"offline",lastSeen:Date.now()-36e5,color:"#4caf50"}]}render(){const e=this.card.getBody();e.innerHTML="";const s=document.createElement("div");s.className="arxis-presence__summary";const a=this.users.filter(t=>t.status==="online").length,r=this.users.filter(t=>t.status==="away").length,p=this.users.filter(t=>t.status==="busy").length;s.innerHTML=`
      <div class="arxis-presence__count">
        <span class="arxis-presence__count-value">${a}</span>
        <span class="arxis-presence__count-label">Online</span>
      </div>
      <div class="arxis-presence__count arxis-presence__count--away">
        <span class="arxis-presence__count-value">${r}</span>
        <span class="arxis-presence__count-label">Ausente</span>
      </div>
      <div class="arxis-presence__count arxis-presence__count--busy">
        <span class="arxis-presence__count-value">${p}</span>
        <span class="arxis-presence__count-label">Ocupado</span>
      </div>
    `,e.appendChild(s);const o=document.createElement("div");o.className="arxis-presence__list",[...this.users].sort((t,i)=>{const n={online:0,busy:1,away:2,offline:3},c=n[t.status],l=n[i.status];return c!==l?c-l:t.name.localeCompare(i.name)}).forEach(t=>{const i=this.createUserItem(t);o.appendChild(i)}),e.appendChild(o),this.injectStyles()}createUserItem(e){const s=document.createElement("div");s.className=`arxis-presence__user arxis-presence__user--${e.status}`;const a=document.createElement("div");a.className="arxis-presence__avatar-wrapper";const r=document.createElement("div");r.className="arxis-presence__avatar",r.style.background=e.color||"#00d4ff",r.textContent=e.avatar||this.getInitials(e.name);const p=document.createElement("div");p.className=`arxis-presence__status arxis-presence__status--${e.status}`,a.appendChild(r),a.appendChild(p),s.appendChild(a);const o=document.createElement("div");o.className="arxis-presence__info";const d=document.createElement("div");d.className="arxis-presence__name",d.textContent=e.name;const t=document.createElement("div");if(t.className="arxis-presence__status-text",e.status==="online"||e.status==="busy")t.innerHTML=`
        <span class="arxis-presence__view">📍 ${e.currentView||"Navegando"}</span>
      `;else if(e.status==="away"){const n=this.formatTimeAgo(e.lastSeen||Date.now());t.innerHTML=`
        <span class="arxis-presence__away">⏸️ Ausente há ${n}</span>
      `}else{const n=this.formatTimeAgo(e.lastSeen||Date.now());t.innerHTML=`
        <span class="arxis-presence__offline">Visto há ${n}</span>
      `}o.appendChild(d),o.appendChild(t),s.appendChild(o);const i=document.createElement("div");if(i.className="arxis-presence__actions",e.status!=="offline"){const n=document.createElement("button");n.className="arxis-presence__action-btn",n.textContent="👁️",n.title="Seguir usuário",n.addEventListener("click",l=>{l.stopPropagation(),this.followUser(e)}),i.appendChild(n);const c=document.createElement("button");c.className="arxis-presence__action-btn",c.textContent="💬",c.title="Enviar mensagem",c.addEventListener("click",l=>{l.stopPropagation(),this.chatWithUser(e)}),i.appendChild(c)}return s.appendChild(i),s.addEventListener("click",()=>{this.onUserClick?.(e)}),s}getInitials(e){const s=e.split(" ");return s.length>=2?(s[0][0]+s[1][0]).toUpperCase():e.substring(0,2).toUpperCase()}formatTimeAgo(e){const s=Date.now()-e,a=Math.floor(s/6e4),r=Math.floor(s/36e5);return a<1?"agora":a<60?`${a}min`:r<24?`${r}h`:`${Math.floor(r/24)}d`}followUser(e){console.log("Seguindo usuário:",e.name)}chatWithUser(e){console.log("Iniciando chat com:",e.name)}startAutoUpdate(){this.updateInterval=window.setInterval(()=>{const e=this.users[Math.floor(Math.random()*this.users.length)];e.status==="online"&&Math.random()>.7&&(e.currentView=this.getRandomView(),this.render())},1e4)}getRandomView(){const e=["Pavimento Térreo","Pavimento 1","Cobertura","Fachada Norte","Corte AA","Vista 3D","Estrutura","Instalações"];return e[Math.floor(Math.random()*e.length)]}addUser(e){this.users.push(e),this.render()}removeUser(e){this.users=this.users.filter(s=>s.id!==e),this.render()}updateUser(e,s){const a=this.users.find(r=>r.id===e);a&&(Object.assign(a,s),this.render())}getElement(){return this.card.getElement()}destroy(){this.updateInterval&&clearInterval(this.updateInterval),this.card.destroy()}injectStyles(){if(document.getElementById("arxis-presence-styles"))return;const e=document.createElement("style");e.id="arxis-presence-styles",e.textContent=`
      .arxis-presence__summary {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
        padding: 12px;
        background: rgba(255, 255, 255, 0.03);
        border-radius: 6px;
        margin-bottom: 16px;
      }

      .arxis-presence__count {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
      }

      .arxis-presence__count-value {
        font-size: 22px;
        font-weight: 700;
        color: #00d4ff;
      }

      .arxis-presence__count--away .arxis-presence__count-value {
        color: #ffaa00;
      }

      .arxis-presence__count--busy .arxis-presence__count-value {
        color: #ff4444;
      }

      .arxis-presence__count-label {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.6);
        text-transform: uppercase;
      }

      .arxis-presence__list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-height: 400px;
        overflow-y: auto;
      }

      .arxis-presence__user {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px;
        background: rgba(255, 255, 255, 0.04);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .arxis-presence__user:hover {
        background: rgba(255, 255, 255, 0.08);
        transform: translateX(2px);
      }

      .arxis-presence__user--offline {
        opacity: 0.5;
      }

      .arxis-presence__avatar-wrapper {
        position: relative;
        flex-shrink: 0;
      }

      .arxis-presence__avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 14px;
        font-weight: 600;
      }

      .arxis-presence__status {
        position: absolute;
        bottom: -2px;
        right: -2px;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        border: 2px solid rgba(0, 0, 0, 0.8);
      }

      .arxis-presence__status--online {
        background: #4caf50;
        box-shadow: 0 0 8px rgba(76, 175, 80, 0.6);
      }

      .arxis-presence__status--away {
        background: #ffaa00;
      }

      .arxis-presence__status--busy {
        background: #ff4444;
      }

      .arxis-presence__status--offline {
        background: #666;
      }

      .arxis-presence__info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 3px;
        min-width: 0;
      }

      .arxis-presence__name {
        font-size: 14px;
        font-weight: 500;
        color: #fff;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .arxis-presence__status-text {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
      }

      .arxis-presence__view {
        color: rgba(0, 212, 255, 0.8);
      }

      .arxis-presence__away {
        color: rgba(255, 170, 0, 0.8);
      }

      .arxis-presence__offline {
        color: rgba(255, 255, 255, 0.5);
      }

      .arxis-presence__actions {
        display: flex;
        gap: 4px;
        opacity: 0;
        transition: opacity 0.2s;
      }

      .arxis-presence__user:hover .arxis-presence__actions {
        opacity: 1;
      }

      .arxis-presence__action-btn {
        width: 32px;
        height: 32px;
        border: none;
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
      }

      .arxis-presence__action-btn:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: scale(1.1);
      }
    `,document.head.appendChild(e)}}export{f as UserPresenceWidget};
