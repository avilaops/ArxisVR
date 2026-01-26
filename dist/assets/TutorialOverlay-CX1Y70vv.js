import{B as p}from"./Button-BvNVdej2.js";class x{container;overlay;tooltip;highlight;steps;currentStepIndex=0;onComplete;onSkip;constructor(t){this.steps=t.steps,this.onComplete=t.onComplete,this.onSkip=t.onSkip,this.container=document.createElement("div"),this.container.className="arxis-tutorial",this.overlay=document.createElement("div"),this.overlay.className="arxis-tutorial__overlay",this.tooltip=document.createElement("div"),this.tooltip.className="arxis-tutorial__tooltip",this.render()}render(){const t=this.steps[this.currentStepIndex];if(!t)return;if(this.clearHighlight(),t.targetElement&&t.highlightElement!==!1){const o=document.querySelector(t.targetElement);o&&this.createHighlight(o)}this.tooltip.innerHTML="";const i=document.createElement("div");i.className="arxis-tutorial__header";const e=document.createElement("h3");e.className="arxis-tutorial__title",e.textContent=t.title;const s=document.createElement("div");s.className="arxis-tutorial__progress",s.textContent=`${this.currentStepIndex+1}/${this.steps.length}`,i.appendChild(e),i.appendChild(s);const n=document.createElement("p");if(n.className="arxis-tutorial__description",n.textContent=t.description,t.action){const o=document.createElement("div");o.className="arxis-tutorial__action",o.innerHTML=`💡 <strong>Ação:</strong> ${t.action}`,this.tooltip.appendChild(i),this.tooltip.appendChild(n),this.tooltip.appendChild(o)}else this.tooltip.appendChild(i),this.tooltip.appendChild(n);const l=document.createElement("div");l.className="arxis-tutorial__progress-bar";const a=document.createElement("div");a.className="arxis-tutorial__progress-fill",a.style.width=`${(this.currentStepIndex+1)/this.steps.length*100}%`,l.appendChild(a),this.tooltip.appendChild(l);const r=document.createElement("div");r.className="arxis-tutorial__actions";const h=new p({text:"Pular",variant:"secondary",size:"sm"});if(h.getElement().addEventListener("click",()=>this.skip()),this.currentStepIndex>0){const o=new p({text:"◀ Anterior",variant:"secondary",size:"sm"});o.getElement().addEventListener("click",()=>this.previous()),r.appendChild(o.getElement())}const d=new p({text:this.currentStepIndex<this.steps.length-1?"Próximo ▶":"✓ Concluir",variant:"primary",size:"sm"});d.getElement().addEventListener("click",()=>this.next()),r.appendChild(h.getElement()),r.appendChild(d.getElement()),this.tooltip.appendChild(r),this.positionTooltip(t),this.container.appendChild(this.overlay),this.container.appendChild(this.tooltip),document.body.contains(this.container)||document.body.appendChild(this.container),this.injectStyles()}createHighlight(t){const i=t.getBoundingClientRect();this.highlight=document.createElement("div"),this.highlight.className="arxis-tutorial__highlight",this.highlight.style.left=`${i.left}px`,this.highlight.style.top=`${i.top}px`,this.highlight.style.width=`${i.width}px`,this.highlight.style.height=`${i.height}px`,this.container.appendChild(this.highlight)}clearHighlight(){this.highlight&&(this.highlight.remove(),this.highlight=void 0)}positionTooltip(t){if(!t.targetElement){this.tooltip.style.position="fixed",this.tooltip.style.left="50%",this.tooltip.style.top="50%",this.tooltip.style.transform="translate(-50%, -50%)";return}const i=document.querySelector(t.targetElement);if(!i){this.tooltip.style.position="fixed",this.tooltip.style.left="50%",this.tooltip.style.top="50%",this.tooltip.style.transform="translate(-50%, -50%)";return}const e=i.getBoundingClientRect(),s=t.position||"bottom";switch(this.tooltip.style.position="fixed",s){case"top":this.tooltip.style.left=`${e.left+e.width/2}px`,this.tooltip.style.top=`${e.top-10}px`,this.tooltip.style.transform="translate(-50%, -100%)";break;case"bottom":this.tooltip.style.left=`${e.left+e.width/2}px`,this.tooltip.style.top=`${e.bottom+10}px`,this.tooltip.style.transform="translateX(-50%)";break;case"left":this.tooltip.style.left=`${e.left-10}px`,this.tooltip.style.top=`${e.top+e.height/2}px`,this.tooltip.style.transform="translate(-100%, -50%)";break;case"right":this.tooltip.style.left=`${e.right+10}px`,this.tooltip.style.top=`${e.top+e.height/2}px`,this.tooltip.style.transform="translateY(-50%)";break}}next(){this.currentStepIndex<this.steps.length-1?(this.currentStepIndex++,this.render()):this.complete()}previous(){this.currentStepIndex>0&&(this.currentStepIndex--,this.render())}skip(){this.onSkip?.(),this.destroy()}complete(){this.onComplete?.(),this.destroy()}getElement(){return this.container}destroy(){this.clearHighlight(),this.container.remove()}injectStyles(){if(document.getElementById("arxis-tutorial-styles"))return;const t=document.createElement("style");t.id="arxis-tutorial-styles",t.textContent=`
      .arxis-tutorial {
        position: fixed;
        inset: 0;
        z-index: 99999;
        pointer-events: none;
      }

      .arxis-tutorial__overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(3px);
        pointer-events: all;
      }

      .arxis-tutorial__highlight {
        position: fixed;
        border: 3px solid #00d4ff;
        border-radius: 8px;
        box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.7),
                    0 0 20px rgba(0, 212, 255, 0.8);
        pointer-events: none;
        z-index: 100000;
        animation: pulse-border 2s ease-in-out infinite;
      }

      @keyframes pulse-border {
        0%, 100% {
          border-color: #00d4ff;
          box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.7),
                      0 0 20px rgba(0, 212, 255, 0.8);
        }
        50% {
          border-color: #7b2ff7;
          box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.7),
                      0 0 30px rgba(123, 47, 247, 0.8);
        }
      }

      .arxis-tutorial__tooltip {
        min-width: 320px;
        max-width: 400px;
        background: rgba(20, 20, 30, 0.98);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(0, 212, 255, 0.3);
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
        pointer-events: all;
        z-index: 100001;
      }

      .arxis-tutorial__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      }

      .arxis-tutorial__title {
        margin: 0;
        font-size: 18px;
        font-weight: 700;
        color: #fff;
      }

      .arxis-tutorial__progress {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
        font-weight: 600;
      }

      .arxis-tutorial__description {
        margin: 0 0 12px 0;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.85);
        line-height: 1.6;
      }

      .arxis-tutorial__action {
        padding: 12px;
        background: rgba(0, 212, 255, 0.1);
        border-left: 3px solid #00d4ff;
        border-radius: 6px;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.9);
        margin-bottom: 16px;
      }

      .arxis-tutorial__progress-bar {
        width: 100%;
        height: 4px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
        overflow: hidden;
        margin-bottom: 16px;
      }

      .arxis-tutorial__progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #00d4ff, #7b2ff7);
        transition: width 0.3s;
      }

      .arxis-tutorial__actions {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
      }
    `,document.head.appendChild(t)}}export{x as TutorialOverlay};
