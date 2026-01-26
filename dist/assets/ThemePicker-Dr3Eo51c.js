import{C as l}from"./Card-DLSvBshn.js";class x{card;themes=[];currentTheme="dark";onThemeChange;constructor(e){this.onThemeChange=e?.onThemeChange,this.card=new l({title:"🎨 Temas",variant:"glass"}),this.loadThemes(),this.render()}loadThemes(){this.themes=[{id:"dark",name:"Escuro Neon",description:"Tema escuro com acentos neon",preview:{primary:"#00d4ff",secondary:"#7b2ff7",background:"#0a0a0f",surface:"#14141e"}},{id:"light",name:"Claro Profissional",description:"Tema claro para ambientes bem iluminados",preview:{primary:"#0088cc",secondary:"#5a1fb3",background:"#f5f5f5",surface:"#ffffff"}},{id:"blue",name:"Azul Oceano",description:"Tons de azul suaves",preview:{primary:"#4fc3f7",secondary:"#29b6f6",background:"#0d1b2a",surface:"#1b263b"}},{id:"purple",name:"Roxo Místico",description:"Gradientes roxos elegantes",preview:{primary:"#ab47bc",secondary:"#7b1fa2",background:"#1a0a1f",surface:"#2a1a2f"}},{id:"green",name:"Verde Matrix",description:"Inspirado em código",preview:{primary:"#00ff41",secondary:"#00cc33",background:"#0a0f0a",surface:"#0f1a0f"}},{id:"orange",name:"Laranja Sunset",description:"Tons quentes de pôr do sol",preview:{primary:"#ff9800",secondary:"#ff5722",background:"#1a0f0a",surface:"#2a1a0f"}}]}render(){const e=this.card.getBody();e.innerHTML="";const r=document.createElement("div");r.className="arxis-theme__current";const i=this.themes.find(t=>t.id===this.currentTheme);r.innerHTML=`
      <div class="arxis-theme__current-label">Tema Atual</div>
      <div class="arxis-theme__current-name">${i?.name||"Padrão"}</div>
    `,e.appendChild(r);const a=document.createElement("div");a.className="arxis-theme__grid",this.themes.forEach(t=>{const n=this.createThemeCard(t);a.appendChild(n)}),e.appendChild(a),this.injectStyles()}createThemeCard(e){const r=document.createElement("div");r.className=`arxis-theme__card ${e.id===this.currentTheme?"arxis-theme__card--active":""}`;const i=document.createElement("div");i.className="arxis-theme__preview",i.style.background=e.preview.background;const a=document.createElement("div");a.className="arxis-theme__colors";const t=document.createElement("div");t.className="arxis-theme__color",t.style.background=e.preview.primary;const n=document.createElement("div");n.className="arxis-theme__color",n.style.background=e.preview.secondary;const o=document.createElement("div");o.className="arxis-theme__color arxis-theme__color--large",o.style.background=e.preview.surface,a.appendChild(t),a.appendChild(n),a.appendChild(o),i.appendChild(a),r.appendChild(i);const s=document.createElement("div");s.className="arxis-theme__info";const d=document.createElement("h4");d.className="arxis-theme__name",d.textContent=e.name;const c=document.createElement("p");if(c.className="arxis-theme__description",c.textContent=e.description,s.appendChild(d),s.appendChild(c),r.appendChild(s),e.id===this.currentTheme){const m=document.createElement("div");m.className="arxis-theme__badge",m.textContent="✓ Ativo",r.appendChild(m)}return r.addEventListener("click",()=>this.selectTheme(e.id)),r}selectTheme(e){this.currentTheme=e,this.onThemeChange?.(e),this.render(),console.log("Tema alterado para:",e)}getCurrentTheme(){return this.currentTheme}getElement(){return this.card.getElement()}destroy(){this.card.destroy()}injectStyles(){if(document.getElementById("arxis-theme-styles"))return;const e=document.createElement("style");e.id="arxis-theme-styles",e.textContent=`
      .arxis-theme__current {
        padding: 16px;
        background: rgba(0, 212, 255, 0.1);
        border-radius: 8px;
        margin-bottom: 20px;
        text-align: center;
      }

      .arxis-theme__current-label {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.6);
        text-transform: uppercase;
        margin-bottom: 4px;
      }

      .arxis-theme__current-name {
        font-size: 18px;
        font-weight: 700;
        color: #00d4ff;
      }

      .arxis-theme__grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 16px;
      }

      .arxis-theme__card {
        position: relative;
        border-radius: 12px;
        overflow: hidden;
        cursor: pointer;
        transition: all 0.3s;
        background: rgba(255, 255, 255, 0.04);
        border: 2px solid transparent;
      }

      .arxis-theme__card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        border-color: rgba(255, 255, 255, 0.1);
      }

      .arxis-theme__card--active {
        border-color: #00d4ff;
        box-shadow: 0 0 20px rgba(0, 212, 255, 0.4);
      }

      .arxis-theme__preview {
        height: 120px;
        padding: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .arxis-theme__colors {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .arxis-theme__color {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        border: 2px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }

      .arxis-theme__color--large {
        width: 48px;
        height: 48px;
      }

      .arxis-theme__info {
        padding: 12px;
        background: rgba(255, 255, 255, 0.03);
      }

      .arxis-theme__name {
        margin: 0 0 4px 0;
        font-size: 14px;
        font-weight: 600;
        color: #fff;
      }

      .arxis-theme__description {
        margin: 0;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
        line-height: 1.4;
      }

      .arxis-theme__badge {
        position: absolute;
        top: 8px;
        right: 8px;
        padding: 4px 10px;
        background: #00d4ff;
        color: #0a0a0f;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 700;
      }
    `,document.head.appendChild(e)}}export{x as ThemePicker};
