import{C as l}from"./Card-DLSvBshn.js";import{I as m}from"./Input-vZvnrYWf.js";class y{card;shortcuts=[];searchInput;filteredShortcuts=[];constructor(){this.card=new l({title:"⌨️ Atalhos de Teclado",variant:"glass"}),this.loadShortcuts(),this.filteredShortcuts=[...this.shortcuts],this.render()}loadShortcuts(){this.shortcuts=[{id:"s1",name:"Panorâmica",keys:["Shift","Mouse"],description:"Mover câmera",category:"Navegação"},{id:"s2",name:"Zoom",keys:["Mouse Wheel"],description:"Zoom in/out",category:"Navegação"},{id:"s3",name:"Orbitar",keys:["Mouse Right"],description:"Girar câmera",category:"Navegação"},{id:"s4",name:"Home",keys:["H"],description:"Voltar visão inicial",category:"Navegação"},{id:"s5",name:"Fit View",keys:["F"],description:"Enquadrar seleção",category:"Navegação"},{id:"s6",name:"Selecionar Tudo",keys:["Ctrl","A"],description:"Selecionar todos elementos",category:"Seleção"},{id:"s7",name:"Inverter Seleção",keys:["Ctrl","I"],description:"Inverter elementos selecionados",category:"Seleção"},{id:"s8",name:"Limpar Seleção",keys:["Esc"],description:"Desselecionar tudo",category:"Seleção"},{id:"s9",name:"Seleção por Tipo",keys:["Ctrl","Shift","T"],description:"Selecionar elementos do mesmo tipo",category:"Seleção"},{id:"s10",name:"Wireframe",keys:["W"],description:"Modo aramado",category:"Visualização"},{id:"s11",name:"Shaded",keys:["S"],description:"Modo sombreado",category:"Visualização"},{id:"s12",name:"Transparência",keys:["T"],description:"Toggle transparência",category:"Visualização"},{id:"s13",name:"Seção Box",keys:["B"],description:"Ativar section box",category:"Visualização"},{id:"s14",name:"Explode View",keys:["E"],description:"Vista explodida",category:"Visualização"},{id:"s15",name:"Medição",keys:["M"],description:"Ferramenta de medição",category:"Ferramentas"},{id:"s16",name:"Anotação",keys:["N"],description:"Criar anotação",category:"Ferramentas"},{id:"s17",name:"Corte",keys:["C"],description:"Plano de corte",category:"Ferramentas"},{id:"s18",name:"Issue",keys:["I"],description:"Criar issue",category:"Ferramentas"},{id:"s19",name:"Desfazer",keys:["Ctrl","Z"],description:"Desfazer última ação",category:"Geral"},{id:"s20",name:"Refazer",keys:["Ctrl","Y"],description:"Refazer última ação",category:"Geral"},{id:"s21",name:"Salvar",keys:["Ctrl","S"],description:"Salvar projeto",category:"Geral"},{id:"s22",name:"Buscar",keys:["Ctrl","F"],description:"Busca avançada",category:"Geral"},{id:"s23",name:"Paleta Comandos",keys:["Ctrl","K"],description:"Abrir paleta de comandos",category:"Geral"},{id:"s24",name:"Configurações",keys:["Ctrl",","],description:"Abrir configurações",category:"Geral"}]}render(){const e=this.card.getBody();e.innerHTML="";const t=document.createElement("div");t.className="arxis-shortcuts__search",this.searchInput=new m({placeholder:"🔍 Buscar atalhos...",onChange:s=>this.filterShortcuts(s)}),t.appendChild(this.searchInput.getElement()),e.appendChild(t),Array.from(new Set(this.filteredShortcuts.map(s=>s.category))).forEach(s=>{const i=this.filteredShortcuts.filter(o=>o.category===s);if(i.length===0)return;const a=document.createElement("div");a.className="arxis-shortcuts__section";const n=document.createElement("h3");n.className="arxis-shortcuts__category",n.textContent=s,a.appendChild(n);const c=document.createElement("div");c.className="arxis-shortcuts__list",i.forEach(o=>{const d=this.createShortcutItem(o);c.appendChild(d)}),a.appendChild(c),e.appendChild(a)}),this.injectStyles()}createShortcutItem(e){const t=document.createElement("div");t.className="arxis-shortcuts__item";const r=document.createElement("div");r.className="arxis-shortcuts__info";const s=document.createElement("div");s.className="arxis-shortcuts__name",s.textContent=e.name;const i=document.createElement("div");i.className="arxis-shortcuts__description",i.textContent=e.description,r.appendChild(s),r.appendChild(i);const a=document.createElement("div");return a.className="arxis-shortcuts__keys",e.keys.forEach((n,c)=>{const o=document.createElement("kbd");if(o.className="arxis-shortcuts__key",o.textContent=n,a.appendChild(o),c<e.keys.length-1){const d=document.createElement("span");d.textContent="+",d.style.margin="0 4px",a.appendChild(d)}}),t.appendChild(r),t.appendChild(a),t}filterShortcuts(e){const t=e.toLowerCase();this.filteredShortcuts=this.shortcuts.filter(r=>r.name.toLowerCase().includes(t)||r.description.toLowerCase().includes(t)||r.category.toLowerCase().includes(t)||r.keys.some(s=>s.toLowerCase().includes(t))),this.render()}getElement(){return this.card.getElement()}destroy(){this.card.destroy()}injectStyles(){if(document.getElementById("arxis-shortcuts-styles"))return;const e=document.createElement("style");e.id="arxis-shortcuts-styles",e.textContent=`
      .arxis-shortcuts__search {
        margin-bottom: 20px;
      }

      .arxis-shortcuts__section {
        margin-bottom: 24px;
      }

      .arxis-shortcuts__category {
        margin: 0 0 12px 0;
        font-size: 13px;
        font-weight: 600;
        color: #00d4ff;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .arxis-shortcuts__list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .arxis-shortcuts__item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
        padding: 12px;
        background: rgba(255, 255, 255, 0.04);
        border-radius: 8px;
        transition: background 0.2s;
      }

      .arxis-shortcuts__item:hover {
        background: rgba(255, 255, 255, 0.08);
      }

      .arxis-shortcuts__info {
        flex: 1;
        min-width: 0;
      }

      .arxis-shortcuts__name {
        font-size: 14px;
        font-weight: 500;
        color: #fff;
        margin-bottom: 3px;
      }

      .arxis-shortcuts__description {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
      }

      .arxis-shortcuts__keys {
        display: flex;
        align-items: center;
        flex-shrink: 0;
      }

      .arxis-shortcuts__key {
        display: inline-block;
        padding: 4px 10px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 6px;
        font-size: 12px;
        font-weight: 600;
        color: #fff;
        font-family: 'Courier New', monospace;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        box-shadow: 0 2px 0 rgba(0, 0, 0, 0.2);
      }
    `,document.head.appendChild(e)}}export{y as KeyboardShortcutsPanel};
