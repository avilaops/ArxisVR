class l{container;overlay;palette;searchInput;resultsList;commands=[];filteredCommands=[];selectedIndex=0;isVisible=!1;constructor(e=[]){this.commands=e,this.filteredCommands=[...e],this.container=document.createElement("div"),this.container.className="arxis-palette",this.container.style.display="none",this.overlay=document.createElement("div"),this.overlay.className="arxis-palette__overlay",this.palette=document.createElement("div"),this.palette.className="arxis-palette__container",this.resultsList=document.createElement("div"),this.resultsList.className="arxis-palette__results",this.render(),this.setupEventListeners(),this.loadDefaultCommands()}loadDefaultCommands(){this.commands=[{id:"new",name:"Novo Projeto",icon:"📄",shortcut:"Ctrl+N",category:"Arquivo",action:()=>console.log("Novo projeto")},{id:"open",name:"Abrir Projeto",icon:"📂",shortcut:"Ctrl+O",category:"Arquivo",action:()=>console.log("Abrir")},{id:"save",name:"Salvar",icon:"💾",shortcut:"Ctrl+S",category:"Arquivo",action:()=>console.log("Salvar")},{id:"export",name:"Exportar...",icon:"📤",category:"Arquivo",action:()=>console.log("Exportar")},{id:"select-all",name:"Selecionar Tudo",icon:"☑️",shortcut:"Ctrl+A",category:"Editar",action:()=>console.log("Selecionar tudo")},{id:"deselect",name:"Limpar Seleção",icon:"⬜",shortcut:"Esc",category:"Editar",action:()=>console.log("Limpar")},{id:"undo",name:"Desfazer",icon:"↶",shortcut:"Ctrl+Z",category:"Editar",action:()=>console.log("Desfazer")},{id:"redo",name:"Refazer",icon:"↷",shortcut:"Ctrl+Y",category:"Editar",action:()=>console.log("Refazer")},{id:"home",name:"Vista Inicial",icon:"🏠",shortcut:"H",category:"Visualização",action:()=>console.log("Home")},{id:"fit",name:"Enquadrar Seleção",icon:"🎯",shortcut:"F",category:"Visualização",action:()=>console.log("Fit")},{id:"wireframe",name:"Modo Wireframe",icon:"📐",shortcut:"W",category:"Visualização",action:()=>console.log("Wireframe")},{id:"shaded",name:"Modo Shaded",icon:"🎨",shortcut:"S",category:"Visualização",action:()=>console.log("Shaded")},{id:"transparency",name:"Transparência",icon:"👻",shortcut:"T",category:"Visualização",action:()=>console.log("Transparência")},{id:"section-box",name:"Section Box",icon:"📦",shortcut:"B",category:"Visualização",action:()=>console.log("Section box")},{id:"measure",name:"Medir",icon:"📏",shortcut:"M",category:"Ferramentas",action:()=>console.log("Medir")},{id:"annotate",name:"Anotar",icon:"📝",shortcut:"N",category:"Ferramentas",action:()=>console.log("Anotar")},{id:"issue",name:"Criar Issue",icon:"🐛",shortcut:"I",category:"Ferramentas",action:()=>console.log("Issue")},{id:"clip",name:"Plano de Corte",icon:"✂️",shortcut:"C",category:"Ferramentas",action:()=>console.log("Corte")},{id:"search",name:"Busca Avançada",icon:"🔍",shortcut:"Ctrl+F",category:"Navegação",action:()=>console.log("Buscar")},{id:"filter",name:"Construir Filtro",icon:"🎛️",category:"Navegação",action:()=>console.log("Filtrar")},{id:"properties",name:"Painel Propriedades",icon:"📋",category:"Navegação",action:()=>console.log("Propriedades")},{id:"tree",name:"Árvore de Elementos",icon:"🌳",category:"Navegação",action:()=>console.log("Árvore")},{id:"settings",name:"Configurações",icon:"⚙️",shortcut:"Ctrl+,",category:"Sistema",action:()=>console.log("Configurações")},{id:"shortcuts",name:"Atalhos de Teclado",icon:"⌨️",category:"Sistema",action:()=>console.log("Atalhos")},{id:"help",name:"Ajuda",icon:"❓",category:"Sistema",action:()=>console.log("Ajuda")},{id:"tutorial",name:"Tutorial",icon:"🎓",category:"Sistema",action:()=>console.log("Tutorial")}],this.filteredCommands=[...this.commands]}render(){this.palette.innerHTML="";const e=document.createElement("div");e.className="arxis-palette__search";const a=document.createElement("div");a.style.display="flex",a.style.alignItems="center",a.style.gap="8px";const t=document.createElement("span");t.textContent="🔍",t.style.fontSize="18px";const o=document.createElement("input");o.type="text",o.placeholder="Digite um comando...",o.className="arxis-palette__input",o.addEventListener("input",s=>{this.filterCommands(s.target.value)}),a.appendChild(t),a.appendChild(o),e.appendChild(a),this.palette.appendChild(e),this.palette.appendChild(this.resultsList),this.container.appendChild(this.overlay),this.container.appendChild(this.palette),document.body.contains(this.container)||document.body.appendChild(this.container),this.renderResults(),this.injectStyles()}renderResults(){if(this.resultsList.innerHTML="",this.filteredCommands.length===0){const t=document.createElement("div");t.className="arxis-palette__empty",t.textContent="😔 Nenhum comando encontrado",this.resultsList.appendChild(t);return}const e=new Map;this.filteredCommands.forEach(t=>{const o=t.category||"Outros";e.has(o)||e.set(o,[]),e.get(o).push(t)});let a=0;e.forEach((t,o)=>{const s=document.createElement("div");s.className="arxis-palette__category",s.textContent=o,this.resultsList.appendChild(s),t.forEach(i=>{const n=this.createCommandItem(i,a===this.selectedIndex);this.resultsList.appendChild(n),a++})})}createCommandItem(e,a){const t=document.createElement("div");if(t.className=`arxis-palette__item ${a?"arxis-palette__item--selected":""}`,e.icon){const i=document.createElement("span");i.className="arxis-palette__icon",i.textContent=e.icon,t.appendChild(i)}const o=document.createElement("div");o.className="arxis-palette__info";const s=document.createElement("div");if(s.className="arxis-palette__name",s.textContent=e.name,e.description){const i=document.createElement("div");i.className="arxis-palette__description",i.textContent=e.description,o.appendChild(s),o.appendChild(i)}else o.appendChild(s);if(t.appendChild(o),e.shortcut){const i=document.createElement("kbd");i.className="arxis-palette__shortcut",i.textContent=e.shortcut,t.appendChild(i)}return t.addEventListener("click",()=>{e.action(),this.hide()}),t}setupEventListeners(){this.overlay.addEventListener("click",()=>this.hide()),document.addEventListener("keydown",e=>{e.ctrlKey&&e.key==="k"&&(e.preventDefault(),this.toggle()),this.isVisible&&(e.key==="Escape"?(e.preventDefault(),this.hide()):e.key==="ArrowDown"?(e.preventDefault(),this.selectNext()):e.key==="ArrowUp"?(e.preventDefault(),this.selectPrevious()):e.key==="Enter"&&(e.preventDefault(),this.executeSelected()))})}filterCommands(e){const a=e.toLowerCase();this.filteredCommands=this.commands.filter(t=>t.name.toLowerCase().includes(a)||t.description?.toLowerCase().includes(a)||t.category?.toLowerCase().includes(a)),this.selectedIndex=0,this.renderResults()}selectNext(){this.selectedIndex=Math.min(this.selectedIndex+1,this.filteredCommands.length-1),this.renderResults()}selectPrevious(){this.selectedIndex=Math.max(this.selectedIndex-1,0),this.renderResults()}executeSelected(){const e=this.filteredCommands[this.selectedIndex];e&&(e.action(),this.hide())}show(){this.container.style.display="block",this.isVisible=!0,setTimeout(()=>{this.palette.querySelector(".arxis-palette__input")?.focus()},100)}hide(){this.container.style.display="none",this.isVisible=!1}toggle(){this.isVisible?this.hide():this.show()}addCommand(e){this.commands.push(e),this.filteredCommands=[...this.commands]}getElement(){return this.container}destroy(){this.container.remove()}injectStyles(){if(document.getElementById("arxis-palette-styles"))return;const e=document.createElement("style");e.id="arxis-palette-styles",e.textContent=`
      .arxis-palette {
        position: fixed;
        inset: 0;
        z-index: 99999;
      }

      .arxis-palette__overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(3px);
      }

      .arxis-palette__container {
        position: fixed;
        left: 50%;
        top: 20%;
        transform: translateX(-50%);
        width: 600px;
        max-width: 90vw;
        background: rgba(20, 20, 30, 0.98);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(0, 212, 255, 0.3);
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
        overflow: hidden;
      }

      .arxis-palette__search {
        padding: 16px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .arxis-palette__input {
        flex: 1;
        background: transparent;
        border: none;
        outline: none;
        font-size: 16px;
        color: #fff;
        font-family: inherit;
      }

      .arxis-palette__input::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }

      .arxis-palette__results {
        max-height: 400px;
        overflow-y: auto;
        padding: 8px;
      }

      .arxis-palette__category {
        padding: 8px 12px 4px;
        font-size: 11px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.5);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .arxis-palette__item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 12px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .arxis-palette__item:hover,
      .arxis-palette__item--selected {
        background: rgba(0, 212, 255, 0.15);
      }

      .arxis-palette__icon {
        font-size: 20px;
        width: 28px;
        text-align: center;
      }

      .arxis-palette__info {
        flex: 1;
        min-width: 0;
      }

      .arxis-palette__name {
        font-size: 14px;
        font-weight: 500;
        color: #fff;
      }

      .arxis-palette__description {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
      }

      .arxis-palette__shortcut {
        padding: 4px 8px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.7);
        font-family: 'Courier New', monospace;
      }

      .arxis-palette__empty {
        padding: 40px;
        text-align: center;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.5);
      }
    `,document.head.appendChild(e)}}export{l as CommandPalette};
