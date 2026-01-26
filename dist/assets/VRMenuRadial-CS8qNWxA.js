class l{container;centerButton;items=[];isVisible=!1;selectedIndex=-1;radius=120;constructor(e=[]){this.items=e,this.container=document.createElement("div"),this.container.className="arxis-radial",this.container.style.display="none",this.centerButton=document.createElement("div"),this.centerButton.className="arxis-radial__center",this.render()}render(){this.container.innerHTML="",this.centerButton.innerHTML="☰",this.container.appendChild(this.centerButton),this.items.length===0&&this.loadDefaultItems();const e=2*Math.PI/this.items.length;this.items.forEach((a,t)=>{a.angle=t*e-Math.PI/2}),this.items.forEach((a,t)=>{const i=this.createMenuItem(a,t);this.container.appendChild(i)}),document.body.contains(this.container)||document.body.appendChild(this.container),this.injectStyles()}loadDefaultItems(){this.items=[{id:"select",label:"Selecionar",icon:"👆",angle:0,action:()=>console.log("Selecionar")},{id:"measure",label:"Medir",icon:"📏",angle:0,action:()=>console.log("Medir")},{id:"annotate",label:"Anotar",icon:"📝",angle:0,action:()=>console.log("Anotar")},{id:"section",label:"Corte",icon:"✂️",angle:0,action:()=>console.log("Corte")},{id:"transparency",label:"Transparência",icon:"👻",angle:0,action:()=>console.log("Transparência")},{id:"teleport",label:"Teleporte",icon:"📍",angle:0,action:()=>console.log("Teleporte")},{id:"home",label:"Início",icon:"🏠",angle:0,action:()=>console.log("Início")},{id:"help",label:"Ajuda",icon:"❓",angle:0,action:()=>console.log("Ajuda")}]}createMenuItem(e,a){const t=document.createElement("div");t.className=`arxis-radial__item ${this.selectedIndex===a?"arxis-radial__item--selected":""}`;const i=Math.cos(e.angle)*this.radius,o=Math.sin(e.angle)*this.radius;t.style.left=`calc(50% + ${i}px)`,t.style.top=`calc(50% + ${o}px)`;const n=document.createElement("div");n.className="arxis-radial__icon",n.textContent=e.icon;const s=document.createElement("div");return s.className="arxis-radial__label",s.textContent=e.label,t.appendChild(n),t.appendChild(s),t.addEventListener("click",()=>{this.selectItem(a)}),t}selectItem(e){this.selectedIndex=e;const a=this.items[e];a&&(a.action(),this.hide())}show(e){this.isVisible=!0,this.container.style.display="block",e?(this.container.style.left=`${e.x}px`,this.container.style.top=`${e.y}px`):(this.container.style.left="50%",this.container.style.top="50%"),this.container.querySelectorAll(".arxis-radial__item").forEach((t,i)=>{t.style.animationDelay=`${i*.05}s`})}hide(){this.isVisible=!1,this.container.style.display="none",this.selectedIndex=-1}toggle(e){this.isVisible?this.hide():this.show(e)}setItems(e){this.items=e,this.render()}getElement(){return this.container}destroy(){this.container.remove()}injectStyles(){if(document.getElementById("arxis-radial-styles"))return;const e=document.createElement("style");e.id="arxis-radial-styles",e.textContent=`
      .arxis-radial {
        position: fixed;
        transform: translate(-50%, -50%);
        width: 300px;
        height: 300px;
        z-index: 99999;
      }

      .arxis-radial__center {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 60px;
        height: 60px;
        background: rgba(0, 212, 255, 0.2);
        border: 3px solid #00d4ff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        color: #fff;
        box-shadow: 0 0 30px rgba(0, 212, 255, 0.6);
        animation: center-pulse 2s ease-in-out infinite;
      }

      @keyframes center-pulse {
        0%, 100% {
          transform: translate(-50%, -50%) scale(1);
          box-shadow: 0 0 30px rgba(0, 212, 255, 0.6);
        }
        50% {
          transform: translate(-50%, -50%) scale(1.1);
          box-shadow: 0 0 40px rgba(0, 212, 255, 0.8);
        }
      }

      .arxis-radial__item {
        position: absolute;
        transform: translate(-50%, -50%);
        width: 70px;
        height: 70px;
        background: rgba(20, 20, 30, 0.95);
        border: 2px solid rgba(0, 212, 255, 0.4);
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s;
        animation: item-appear 0.3s ease-out;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
      }

      @keyframes item-appear {
        from {
          transform: translate(-50%, -50%) scale(0);
          opacity: 0;
        }
        to {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
        }
      }

      .arxis-radial__item:hover {
        transform: translate(-50%, -50%) scale(1.2);
        background: rgba(0, 212, 255, 0.2);
        border-color: #00d4ff;
        box-shadow: 0 0 25px rgba(0, 212, 255, 0.8);
      }

      .arxis-radial__item--selected {
        background: rgba(0, 212, 255, 0.3);
        border-color: #00d4ff;
        transform: translate(-50%, -50%) scale(1.15);
      }

      .arxis-radial__icon {
        font-size: 28px;
        margin-bottom: 4px;
      }

      .arxis-radial__label {
        font-size: 10px;
        font-weight: 600;
        color: #fff;
        text-align: center;
        white-space: nowrap;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
      }
    `,document.head.appendChild(e)}}export{l as VRMenuRadial};
