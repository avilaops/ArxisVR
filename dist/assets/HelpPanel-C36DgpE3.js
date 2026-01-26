import{C as l}from"./Card-DLSvBshn.js";import{I as c}from"./Input-vZvnrYWf.js";class d{element;tabListElement;contentElement;options;activeTabId;constructor(e){this.options={tabs:e.tabs,activeTab:e.activeTab||e.tabs[0]?.id||"",variant:e.variant||"default",onTabChange:e.onTabChange,onTabClose:e.onTabClose},this.activeTabId=this.options.activeTab,this.element=this.createElement(),this.tabListElement=this.createTabList(),this.contentElement=this.createContent(),this.element.appendChild(this.tabListElement),this.element.appendChild(this.contentElement),this.showTab(this.activeTabId),this.injectStyles()}createElement(){const e=document.createElement("div");return e.className=`arxis-tabs arxis-tabs--${this.options.variant}`,e}createTabList(){const e=document.createElement("div");return e.className="arxis-tabs__list",e.setAttribute("role","tablist"),this.options.tabs.forEach(t=>{const i=this.createTabButton(t);e.appendChild(i)}),e}createTabButton(e){const t=document.createElement("button");t.className="arxis-tabs__tab",t.setAttribute("role","tab"),t.setAttribute("aria-controls",`tab-panel-${e.id}`),t.setAttribute("aria-selected",e.id===this.activeTabId?"true":"false"),t.dataset.tabId=e.id,e.disabled&&(t.disabled=!0,t.classList.add("arxis-tabs__tab--disabled")),e.id===this.activeTabId&&t.classList.add("arxis-tabs__tab--active");const i=document.createElement("span");if(i.className="arxis-tabs__tab-content",e.icon){const s=document.createElement("span");s.className="arxis-tabs__icon",s.textContent=e.icon,i.appendChild(s)}const r=document.createElement("span");if(r.className="arxis-tabs__label",r.textContent=e.label,i.appendChild(r),t.appendChild(i),e.closeable){const s=document.createElement("button");s.className="arxis-tabs__close",s.textContent="×",s.setAttribute("aria-label","Fechar aba"),s.addEventListener("click",a=>{a.stopPropagation(),this.closeTab(e.id)}),t.appendChild(s)}return t.addEventListener("click",()=>{e.disabled||this.showTab(e.id)}),t}createContent(){const e=document.createElement("div");return e.className="arxis-tabs__content",this.options.tabs.forEach(t=>{const i=this.createTabPanel(t);e.appendChild(i)}),e}createTabPanel(e){const t=document.createElement("div");return t.className="arxis-tabs__panel",t.id=`tab-panel-${e.id}`,t.setAttribute("role","tabpanel"),t.setAttribute("aria-labelledby",e.id),t.dataset.tabId=e.id,e.content&&(typeof e.content=="string"?t.innerHTML=e.content:t.appendChild(e.content)),e.id!==this.activeTabId&&(t.style.display="none"),t}showTab(e){const t=this.options.tabs.find(s=>s.id===e);if(!t||t.disabled)return;this.activeTabId=e,this.tabListElement.querySelectorAll(".arxis-tabs__tab").forEach(s=>{const a=s,n=a.dataset.tabId===e;a.classList.toggle("arxis-tabs__tab--active",n),a.setAttribute("aria-selected",n?"true":"false")}),this.contentElement.querySelectorAll(".arxis-tabs__panel").forEach(s=>{const a=s;a.style.display=a.dataset.tabId===e?"block":"none"}),this.options.onTabChange?.(e)}addTab(e){this.options.tabs.push(e);const t=this.createTabButton(e);this.tabListElement.appendChild(t);const i=this.createTabPanel(e);this.contentElement.appendChild(i)}removeTab(e){const t=this.options.tabs.findIndex(s=>s.id===e);if(t===-1)return;this.options.tabs.splice(t,1);const i=this.tabListElement.querySelector(`[data-tab-id="${e}"]`),r=this.contentElement.querySelector(`[data-tab-id="${e}"]`);i?.remove(),r?.remove(),this.activeTabId===e&&this.options.tabs.length>0&&this.showTab(this.options.tabs[0].id)}closeTab(e){this.options.onTabClose?.(e),this.removeTab(e)}updateTab(e,t){const i=this.options.tabs.find(a=>a.id===e);if(!i)return;Object.assign(i,t);const r=this.tabListElement.querySelector(`[data-tab-id="${e}"]`);if(r&&t.label){const a=r.querySelector(".arxis-tabs__label");a&&(a.textContent=t.label)}const s=this.contentElement.querySelector(`[data-tab-id="${e}"]`);s&&t.content&&(s.innerHTML="",typeof t.content=="string"?s.innerHTML=t.content:s.appendChild(t.content))}getElement(){return this.element}getActiveTab(){return this.activeTabId}destroy(){this.element.remove()}injectStyles(){if(document.getElementById("arxis-tabs-styles"))return;const e=document.createElement("style");e.id="arxis-tabs-styles",e.textContent=`
      .arxis-tabs {
        display: flex;
        flex-direction: column;
        width: 100%;
      }

      .arxis-tabs__list {
        display: flex;
        gap: 4px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        margin-bottom: 16px;
      }

      .arxis-tabs__tab {
        position: relative;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 16px;
        background: transparent;
        border: none;
        color: rgba(255, 255, 255, 0.7);
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
        border-radius: 6px 6px 0 0;
      }

      .arxis-tabs__tab:hover:not(.arxis-tabs__tab--disabled) {
        background: rgba(255, 255, 255, 0.05);
        color: rgba(255, 255, 255, 0.9);
      }

      .arxis-tabs__tab--active {
        color: #fff;
        background: rgba(255, 255, 255, 0.1);
      }

      .arxis-tabs--underline .arxis-tabs__tab--active::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, #00d4ff, #7b2ff7);
      }

      .arxis-tabs--pills .arxis-tabs__list {
        border-bottom: none;
        gap: 8px;
      }

      .arxis-tabs--pills .arxis-tabs__tab {
        border-radius: 20px;
      }

      .arxis-tabs--pills .arxis-tabs__tab--active {
        background: linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(123, 47, 247, 0.2));
        border: 1px solid rgba(255, 255, 255, 0.2);
      }

      .arxis-tabs__tab--disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .arxis-tabs__tab-content {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .arxis-tabs__icon {
        font-size: 16px;
      }

      .arxis-tabs__close {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 18px;
        margin-left: 4px;
        padding: 0;
        background: transparent;
        border: none;
        border-radius: 50%;
        color: rgba(255, 255, 255, 0.5);
        font-size: 18px;
        line-height: 1;
        cursor: pointer;
        transition: all 0.2s;
      }

      .arxis-tabs__close:hover {
        background: rgba(255, 0, 0, 0.2);
        color: #ff4444;
      }

      .arxis-tabs__content {
        flex: 1;
      }

      .arxis-tabs__panel {
        animation: fadeIn 0.2s;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-4px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,document.head.appendChild(e)}}class h{card;articles=[];searchInput;tabs;filteredArticles=[];constructor(){this.card=new l({title:"❓ Ajuda",variant:"glass"}),this.loadArticles(),this.filteredArticles=[...this.articles],this.render()}loadArticles(){this.articles=[{id:"nav-1",title:"Navegação Básica",category:"Navegação",content:"Use o mouse para navegar: Botão direito para orbitar, Scroll para zoom, Shift+Botão esquerdo para pan. Pressione H para voltar à visão inicial.",keywords:["navegação","mouse","orbitar","zoom","pan"]},{id:"nav-2",title:"Câmera e Vistas",category:"Navegação",content:"Crie vistas personalizadas com presets de câmera. Use F para enquadrar a seleção. Salve suas vistas favoritas para acesso rápido.",keywords:["câmera","vistas","presets","enquadrar"]},{id:"sel-1",title:"Selecionando Elementos",category:"Seleção",content:"Clique em elementos para selecionar. Use Ctrl+Clique para seleção múltipla. Ctrl+A seleciona tudo. Esc limpa a seleção.",keywords:["seleção","elementos","múltipla","ctrl"]},{id:"sel-2",title:"Filtros e Busca",category:"Seleção",content:"Use o painel de busca avançada (Ctrl+F) para encontrar elementos por propriedades. Crie filtros personalizados e salve para reutilizar.",keywords:["filtros","busca","propriedades","avançada"]},{id:"viz-1",title:"Modos de Visualização",category:"Visualização",content:"Alterne entre modos: W para wireframe, S para shaded. Ajuste transparência com T. Use o Section Box (B) para cortes.",keywords:["visualização","wireframe","shaded","transparência"]},{id:"viz-2",title:"Section Box e Cortes",category:"Visualização",content:"Ative o Section Box para criar cortes dinâmicos. Ajuste os planos com os controles. Salve posições para documentação.",keywords:["section","box","cortes","planos"]},{id:"meas-1",title:"Ferramentas de Medição",category:"Ferramentas",content:"Pressione M para ativar a medição. Clique em dois pontos para medir distâncias. Medições ficam salvas no painel de anotações.",keywords:["medição","distância","ferramentas"]},{id:"anno-1",title:"Anotações e Comentários",category:"Colaboração",content:"Crie anotações 3D pressionando N. Adicione comentários, tire screenshots, e compartilhe com a equipe. Exporte para BCF.",keywords:["anotações","comentários","3d","bcf"]},{id:"issue-1",title:"Gerenciamento de Issues",category:"Colaboração",content:"Crie issues (I) para rastrear problemas. Defina prioridades, atribua responsáveis. Importe/exporte BCF para compatibilidade.",keywords:["issues","problemas","bcf","rastreamento"]},{id:"export-1",title:"Exportação de Dados",category:"Exportação",content:"Exporte relatórios, planilhas, imagens e modelos. Suporte para PDF, Excel, PNG, IFC e outros formatos.",keywords:["exportar","relatórios","planilhas","pdf"]}]}render(){const e=this.card.getBody();e.innerHTML="";const t=document.createElement("div");t.className="arxis-help__search",this.searchInput=new c({placeholder:"🔍 Buscar na ajuda...",onChange:a=>this.filterArticles(a)}),t.appendChild(this.searchInput.getElement()),e.appendChild(t);const i=["Todos",...Array.from(new Set(this.articles.map(a=>a.category)))];this.tabs=new d({tabs:i.map(a=>({id:a,label:a})),onTabChange:a=>this.filterByCategory(a)}),e.appendChild(this.tabs.getElement());const r=document.createElement("div");if(r.className="arxis-help__articles",this.filteredArticles.length===0){const a=document.createElement("div");a.className="arxis-help__empty",a.textContent="😔 Nenhum artigo encontrado",r.appendChild(a)}else this.filteredArticles.forEach(a=>{const n=this.createArticleItem(a);r.appendChild(n)});e.appendChild(r);const s=document.createElement("div");s.className="arxis-help__footer",s.innerHTML=`
      <div>💬 Precisa de mais ajuda?</div>
      <div>
        <a href="#" class="arxis-help__link">Documentação Completa</a> |
        <a href="#" class="arxis-help__link">Suporte Técnico</a>
      </div>
    `,e.appendChild(s),this.injectStyles()}createArticleItem(e){const t=document.createElement("div");t.className="arxis-help__article";const i=document.createElement("div");i.className="arxis-help__article-header";const r=document.createElement("h4");r.className="arxis-help__article-title",r.textContent=e.title;const s=document.createElement("span");s.className="arxis-help__article-category",s.textContent=e.category,i.appendChild(r),i.appendChild(s);const a=document.createElement("div");return a.className="arxis-help__article-content",a.textContent=e.content,t.appendChild(i),t.appendChild(a),t}filterArticles(e){const t=e.toLowerCase();this.filteredArticles=this.articles.filter(i=>i.title.toLowerCase().includes(t)||i.content.toLowerCase().includes(t)||i.keywords.some(r=>r.includes(t))),this.render()}filterByCategory(e){e==="Todos"?this.filteredArticles=[...this.articles]:this.filteredArticles=this.articles.filter(t=>t.category===e),this.render()}getElement(){return this.card.getElement()}destroy(){this.card.destroy()}injectStyles(){if(document.getElementById("arxis-help-styles"))return;const e=document.createElement("style");e.id="arxis-help-styles",e.textContent=`
      .arxis-help__search {
        margin-bottom: 16px;
      }

      .arxis-help__articles {
        max-height: 400px;
        overflow-y: auto;
        margin-top: 16px;
      }

      .arxis-help__article {
        padding: 16px;
        background: rgba(255, 255, 255, 0.04);
        border-radius: 8px;
        margin-bottom: 12px;
        transition: all 0.2s;
      }

      .arxis-help__article:hover {
        background: rgba(255, 255, 255, 0.08);
      }

      .arxis-help__article-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }

      .arxis-help__article-title {
        margin: 0;
        font-size: 15px;
        font-weight: 600;
        color: #fff;
      }

      .arxis-help__article-category {
        padding: 3px 10px;
        background: rgba(0, 212, 255, 0.2);
        border-radius: 12px;
        font-size: 11px;
        color: #00d4ff;
        font-weight: 500;
      }

      .arxis-help__article-content {
        font-size: 13px;
        color: rgba(255, 255, 255, 0.8);
        line-height: 1.6;
      }

      .arxis-help__empty {
        padding: 40px;
        text-align: center;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.5);
      }

      .arxis-help__footer {
        margin-top: 20px;
        padding-top: 16px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        text-align: center;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.7);
      }

      .arxis-help__link {
        color: #00d4ff;
        text-decoration: none;
        transition: color 0.2s;
      }

      .arxis-help__link:hover {
        color: #7b2ff7;
        text-decoration: underline;
      }
    `,document.head.appendChild(e)}}export{h as HelpPanel};
