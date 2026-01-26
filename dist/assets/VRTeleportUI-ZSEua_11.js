class i{container;reticle;arc;isActive=!1;currentTarget;onTeleport;constructor(e){this.onTeleport=e?.onTeleport,this.container=document.createElement("div"),this.container.className="arxis-teleport",this.container.style.display="none",this.reticle=document.createElement("div"),this.reticle.className="arxis-teleport__reticle",this.arc=this.createArc(),this.render()}render(){this.container.innerHTML="",this.container.appendChild(this.arc),this.container.appendChild(this.reticle),document.body.contains(this.container)||document.body.appendChild(this.container),this.injectStyles()}createArc(){const e=document.createElementNS("http://www.w3.org/2000/svg","svg");e.setAttribute("class","arxis-teleport__arc"),e.setAttribute("width","100"),e.setAttribute("height","200"),e.style.position="absolute",e.style.pointerEvents="none";const t=document.createElementNS("http://www.w3.org/2000/svg","path");return t.setAttribute("d","M 50 0 Q 50 100 50 200"),t.setAttribute("stroke","#00d4ff"),t.setAttribute("stroke-width","3"),t.setAttribute("fill","none"),t.setAttribute("opacity","0.8"),e.appendChild(t),e}show(e){this.isActive=!0,this.container.style.display="block",e&&this.updatePosition(e)}hide(){this.isActive=!1,this.container.style.display="none"}updateTarget(e){this.currentTarget=e,e.valid?this.reticle.className="arxis-teleport__reticle arxis-teleport__reticle--valid":this.reticle.className="arxis-teleport__reticle arxis-teleport__reticle--invalid"}updatePosition(e){this.reticle.style.left=`${e.x}px`,this.reticle.style.top=`${e.y}px`}executeTeleport(){this.currentTarget&&this.currentTarget.valid&&(this.onTeleport?.(this.currentTarget),this.playTeleportAnimation())}playTeleportAnimation(){const e=document.createElement("div");e.className="arxis-teleport__flash",document.body.appendChild(e),setTimeout(()=>{e.remove()},300)}isShowing(){return this.isActive}getElement(){return this.container}destroy(){this.container.remove()}injectStyles(){if(document.getElementById("arxis-teleport-styles"))return;const e=document.createElement("style");e.id="arxis-teleport-styles",e.textContent=`
      .arxis-teleport {
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 9999;
      }

      .arxis-teleport__arc {
        filter: drop-shadow(0 0 10px rgba(0, 212, 255, 0.8));
        animation: arc-pulse 1.5s ease-in-out infinite;
      }

      @keyframes arc-pulse {
        0%, 100% {
          opacity: 0.6;
        }
        50% {
          opacity: 1;
        }
      }

      .arxis-teleport__reticle {
        position: fixed;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        border: 4px solid #00d4ff;
        transform: translate(-50%, -50%);
        pointer-events: none;
        animation: reticle-pulse 1s ease-in-out infinite;
        transition: all 0.2s;
      }

      .arxis-teleport__reticle::before {
        content: '';
        position: absolute;
        inset: -12px;
        border-radius: 50%;
        border: 2px solid #00d4ff;
        opacity: 0.4;
      }

      .arxis-teleport__reticle::after {
        content: '';
        position: absolute;
        inset: 50%;
        width: 8px;
        height: 8px;
        background: #00d4ff;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 20px rgba(0, 212, 255, 1);
      }

      .arxis-teleport__reticle--valid {
        border-color: #4caf50;
        box-shadow: 0 0 30px rgba(76, 175, 80, 0.8);
      }

      .arxis-teleport__reticle--valid::before {
        border-color: #4caf50;
      }

      .arxis-teleport__reticle--valid::after {
        background: #4caf50;
        box-shadow: 0 0 20px rgba(76, 175, 80, 1);
      }

      .arxis-teleport__reticle--invalid {
        border-color: #ff4444;
        box-shadow: 0 0 30px rgba(255, 68, 68, 0.8);
      }

      .arxis-teleport__reticle--invalid::before {
        border-color: #ff4444;
      }

      .arxis-teleport__reticle--invalid::after {
        background: #ff4444;
        box-shadow: 0 0 20px rgba(255, 68, 68, 1);
      }

      @keyframes reticle-pulse {
        0%, 100% {
          transform: translate(-50%, -50%) scale(1);
        }
        50% {
          transform: translate(-50%, -50%) scale(1.1);
        }
      }

      .arxis-teleport__flash {
        position: fixed;
        inset: 0;
        background: radial-gradient(circle, rgba(0, 212, 255, 0.5) 0%, transparent 70%);
        animation: flash-fade 0.3s ease-out;
        pointer-events: none;
        z-index: 99999;
      }

      @keyframes flash-fade {
        0% {
          opacity: 1;
        }
        100% {
          opacity: 0;
        }
      }
    `,document.head.appendChild(e)}}export{i as VRTeleportUI};
