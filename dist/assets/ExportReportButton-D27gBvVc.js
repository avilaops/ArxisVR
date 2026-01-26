import{B as p}from"./Button-BvNVdej2.js";class x{container;items=[];isVisible=!1;submenuTimeout;constructor(e=[]){this.items=e,this.container=document.createElement("div"),this.container.className="arxis-context-menu",this.container.style.display="none",this.render(),this.setupEventListeners()}render(){this.container.innerHTML="",this.items.forEach((e,t)=>{if(e.separator){const n=document.createElement("div");n.className="arxis-context-menu__separator",this.container.appendChild(n);return}const i=this.createMenuItem(e);this.container.appendChild(i)}),document.body.contains(this.container)||document.body.appendChild(this.container),this.injectStyles()}createMenuItem(e){const t=document.createElement("div");if(t.className="arxis-context-menu__item",e.disabled&&t.classList.add("arxis-context-menu__item--disabled"),e.submenu&&e.submenu.length>0&&t.classList.add("arxis-context-menu__item--has-submenu"),e.icon){const n=document.createElement("span");n.className="arxis-context-menu__icon",n.textContent=e.icon,t.appendChild(n)}const i=document.createElement("span");if(i.className="arxis-context-menu__label",i.textContent=e.label,t.appendChild(i),e.shortcut){const n=document.createElement("span");n.className="arxis-context-menu__shortcut",n.textContent=e.shortcut,t.appendChild(n)}if(e.submenu&&e.submenu.length>0){const n=document.createElement("span");n.className="arxis-context-menu__arrow",n.textContent="▶",t.appendChild(n);const o=this.createSubmenu(e.submenu);t.appendChild(o),t.addEventListener("mouseenter",()=>{this.submenuTimeout&&window.clearTimeout(this.submenuTimeout),this.submenuTimeout=window.setTimeout(()=>{o.style.display="block",this.positionSubmenu(t,o)},200)}),t.addEventListener("mouseleave",()=>{this.submenuTimeout&&window.clearTimeout(this.submenuTimeout),this.submenuTimeout=window.setTimeout(()=>{o.style.display="none"},300)})}return!e.disabled&&e.onClick&&t.addEventListener("click",n=>{n.stopPropagation(),e.onClick?.(),this.hide()}),t}createSubmenu(e){const t=document.createElement("div");return t.className="arxis-context-menu arxis-context-menu--submenu",t.style.display="none",e.forEach(i=>{if(i.separator){const n=document.createElement("div");n.className="arxis-context-menu__separator",t.appendChild(n)}else{const n=this.createMenuItem(i);t.appendChild(n)}}),t}positionSubmenu(e,t){const i=e.getBoundingClientRect(),n=t.getBoundingClientRect();t.style.left=`${i.width-2}px`,t.style.top="0",setTimeout(()=>{const o=t.getBoundingClientRect();o.right>window.innerWidth&&(t.style.left=`${-n.width+2}px`),o.bottom>window.innerHeight&&(t.style.top=`${window.innerHeight-o.bottom}px`)},0)}setupEventListeners(){document.addEventListener("click",e=>{this.isVisible&&!this.container.contains(e.target)&&this.hide()}),window.addEventListener("scroll",()=>{this.isVisible&&this.hide()}),window.addEventListener("resize",()=>{this.isVisible&&this.hide()})}show(e,t){this.container.style.left=`${e}px`,this.container.style.top=`${t}px`,this.container.style.display="block",this.isVisible=!0,setTimeout(()=>{const i=this.container.getBoundingClientRect();i.right>window.innerWidth&&(this.container.style.left=`${e-i.width}px`),i.bottom>window.innerHeight&&(this.container.style.top=`${t-i.height}px`)},0)}hide(){this.container.style.display="none",this.isVisible=!1}setItems(e){this.items=e,this.render()}getElement(){return this.container}destroy(){this.submenuTimeout&&window.clearTimeout(this.submenuTimeout),this.container.remove()}injectStyles(){if(document.getElementById("arxis-context-menu-styles"))return;const e=document.createElement("style");e.id="arxis-context-menu-styles",e.textContent=`
      .arxis-context-menu {
        position: fixed;
        min-width: 200px;
        background: rgba(20, 20, 30, 0.98);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        padding: 6px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        z-index: 10000;
        font-size: 14px;
      }

      .arxis-context-menu--submenu {
        position: absolute;
        left: 100%;
        top: 0;
      }

      .arxis-context-menu__item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 12px;
        color: rgba(255, 255, 255, 0.9);
        cursor: pointer;
        border-radius: 6px;
        transition: all 0.2s;
        position: relative;
        user-select: none;
      }

      .arxis-context-menu__item:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
      }

      .arxis-context-menu__item--disabled {
        opacity: 0.4;
        cursor: not-allowed;
        pointer-events: none;
      }

      .arxis-context-menu__item--has-submenu {
        padding-right: 24px;
      }

      .arxis-context-menu__icon {
        width: 20px;
        text-align: center;
        font-size: 16px;
        flex-shrink: 0;
      }

      .arxis-context-menu__label {
        flex: 1;
        white-space: nowrap;
      }

      .arxis-context-menu__shortcut {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.5);
        margin-left: auto;
        padding-left: 20px;
      }

      .arxis-context-menu__arrow {
        position: absolute;
        right: 8px;
        font-size: 10px;
        color: rgba(255, 255, 255, 0.6);
      }

      .arxis-context-menu__separator {
        height: 1px;
        background: rgba(255, 255, 255, 0.1);
        margin: 6px 0;
      }
    `,document.head.appendChild(e)}}class h{button;contextMenu;onExport;constructor(e){this.onExport=e?.onExport,this.button=new p({text:e?.text||"📤 Exportar Relatório",variant:"primary",size:"md"}),this.setupEventListeners(),this.injectStyles()}setupEventListeners(){this.button.getElement().addEventListener("click",e=>{this.showExportMenu(e)})}showExportMenu(e){const t=[{id:"pdf",name:"Exportar como PDF",icon:"📄",description:"Documento portátil",action:()=>this.exportAs("pdf")},{id:"excel",name:"Exportar como Excel",icon:"📊",description:"Planilha editável",action:()=>this.exportAs("excel")},{id:"word",name:"Exportar como Word",icon:"📝",description:"Documento editável",action:()=>this.exportAs("word")},{id:"sep1",name:"",separator:!0,action:()=>{}},{id:"csv",name:"Exportar como CSV",icon:"📋",description:"Valores separados por vírgula",action:()=>this.exportAs("csv")},{id:"json",name:"Exportar como JSON",icon:"{}",description:"Formato de dados estruturados",action:()=>this.exportAs("json")},{id:"html",name:"Exportar como HTML",icon:"🌐",description:"Página web",action:()=>this.exportAs("html")},{id:"sep2",name:"",separator:!0,action:()=>{}},{id:"advanced",name:"Opções Avançadas...",icon:"⚙️",action:()=>this.showAdvancedOptions()}];this.contextMenu&&this.contextMenu.destroy(),this.contextMenu=new x(t),this.contextMenu.show(e.clientX,e.clientY)}exportAs(e){const t={format:e,filename:`relatorio_${Date.now()}`,includeImages:!0,includeProperties:!0};this.onExport?.(t),this.showExportProgress(e)}showExportProgress(e){const t=document.createElement("div");t.className="arxis-export__overlay";const i=document.createElement("div");i.className="arxis-export__modal";const n=document.createElement("div");n.className="arxis-export__icon",n.textContent="📤";const o=document.createElement("div");o.className="arxis-export__text",o.textContent=`Exportando relatório como ${e.toUpperCase()}...`;const r=document.createElement("div");r.className="arxis-export__progress";const a=document.createElement("div");a.className="arxis-export__progress-bar",r.appendChild(a),i.appendChild(n),i.appendChild(o),i.appendChild(r),t.appendChild(i),document.body.appendChild(t);let s=0;const c=setInterval(()=>{s+=10,a.style.width=`${s}%`,s>=100&&(clearInterval(c),o.textContent="✓ Exportação concluída!",n.textContent="✅",setTimeout(()=>{t.remove()},1500))},200)}showAdvancedOptions(){const e=document.createElement("div");e.className="arxis-export__overlay";const t=document.createElement("div");t.className="arxis-export__advanced-modal";const i=document.createElement("h3");i.textContent="⚙️ Opções Avançadas de Exportação",i.style.marginTop="0",t.appendChild(i),[{id:"images",label:"Incluir imagens",checked:!0},{id:"properties",label:"Incluir propriedades",checked:!0},{id:"metadata",label:"Incluir metadados",checked:!0},{id:"annotations",label:"Incluir anotações",checked:!0},{id:"history",label:"Incluir histórico",checked:!1}].forEach(s=>{const c=document.createElement("div");c.style.marginBottom="12px";const d=document.createElement("input");d.type="checkbox",d.id=`export-${s.id}`,d.checked=s.checked,d.style.marginRight="8px";const l=document.createElement("label");l.htmlFor=`export-${s.id}`,l.textContent=s.label,l.style.cursor="pointer",l.style.color="rgba(255,255,255,0.9)",c.appendChild(d),c.appendChild(l),t.appendChild(c)});const o=document.createElement("div");o.style.display="flex",o.style.gap="8px",o.style.marginTop="20px";const r=new p({text:"Cancelar",variant:"secondary",size:"sm"});r.getElement().addEventListener("click",()=>e.remove());const a=new p({text:"📤 Exportar",variant:"primary",size:"sm"});a.getElement().addEventListener("click",()=>{e.remove(),this.exportAs("pdf")}),o.appendChild(r.getElement()),o.appendChild(a.getElement()),t.appendChild(o),e.appendChild(t),document.body.appendChild(e),e.addEventListener("click",s=>{s.target===e&&e.remove()})}getElement(){return this.button.getElement()}destroy(){this.contextMenu&&this.contextMenu.destroy(),this.button.destroy()}injectStyles(){if(document.getElementById("arxis-export-styles"))return;const e=document.createElement("style");e.id="arxis-export-styles",e.textContent=`
      .arxis-export__overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(5px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
      }

      .arxis-export__modal {
        background: rgba(20, 20, 30, 0.98);
        border: 1px solid rgba(0, 212, 255, 0.3);
        border-radius: 16px;
        padding: 32px;
        min-width: 300px;
        text-align: center;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
      }

      .arxis-export__advanced-modal {
        background: rgba(20, 20, 30, 0.98);
        border: 1px solid rgba(0, 212, 255, 0.3);
        border-radius: 16px;
        padding: 24px;
        min-width: 400px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
        color: #fff;
      }

      .arxis-export__icon {
        font-size: 64px;
        margin-bottom: 16px;
        animation: float 2s ease-in-out infinite;
      }

      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }

      .arxis-export__text {
        font-size: 16px;
        color: rgba(255, 255, 255, 0.9);
        margin-bottom: 20px;
      }

      .arxis-export__progress {
        width: 100%;
        height: 8px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        overflow: hidden;
      }

      .arxis-export__progress-bar {
        height: 100%;
        width: 0%;
        background: linear-gradient(90deg, #00d4ff, #7b2ff7);
        transition: width 0.3s ease;
      }
    `,document.head.appendChild(e)}}export{h as ExportReportButton};
