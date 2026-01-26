import{C as M}from"./Card-DLSvBshn.js";import{T as p}from"./Toggle-D3VS2hV5.js";import{S as g}from"./Slider-DjmBSdi5.js";import{S as T}from"./Select-D01wDXMy.js";import{B as x}from"./Button-BvNVdej2.js";class R{card;settings;onSettingsChange;constructor(t){this.onSettingsChange=t?.onSettingsChange,this.settings={locomotionMode:"teleport",snapAngle:45,movementSpeed:1.5,handTracking:!0,controllerVibration:!0,comfortMode:!1,ipd:63},this.card=new M({title:"🥽 Controles VR",variant:"glass"}),this.render()}render(){const t=this.card.getBody();t.innerHTML="";const l=document.createElement("div");l.className="arxis-vr__status",l.innerHTML=`
      <div class="arxis-vr__status-icon">🥽</div>
      <div class="arxis-vr__status-text">
        <div class="arxis-vr__status-label">Status VR</div>
        <div class="arxis-vr__status-value">Dispositivo detectado</div>
      </div>
    `,t.appendChild(l);const s=document.createElement("div");s.className="arxis-vr__section";const r=document.createElement("label");r.className="arxis-vr__label",r.textContent="Modo de Locomoção";const u=new T({options:[{value:"teleport",label:"📍 Teleporte"},{value:"smooth",label:"🚶 Movimento Suave"},{value:"snap",label:"↪️ Giro em Ângulos"}],value:this.settings.locomotionMode,onChange:e=>{this.settings.locomotionMode=e,this.notifyChange(),this.render()}});if(s.appendChild(r),s.appendChild(u.getElement()),t.appendChild(s),this.settings.locomotionMode==="snap"){const e=document.createElement("div");e.className="arxis-vr__section";const m=document.createElement("label");m.className="arxis-vr__label",m.textContent=`Ângulo de Giro: ${this.settings.snapAngle}°`;const S=new g({min:15,max:90,step:15,value:this.settings.snapAngle,onChange:y=>{this.settings.snapAngle=y,this.notifyChange(),this.render()}});e.appendChild(m),e.appendChild(S.getElement()),t.appendChild(e)}const i=document.createElement("div");i.className="arxis-vr__section";const d=document.createElement("label");d.className="arxis-vr__label",d.textContent=`Velocidade: ${this.settings.movementSpeed.toFixed(1)}x`;const C=new g({min:.5,max:3,step:.5,value:this.settings.movementSpeed,onChange:e=>{this.settings.movementSpeed=e,this.notifyChange(),this.render()}});i.appendChild(d),i.appendChild(C.getElement()),t.appendChild(i);const a=document.createElement("div");a.className="arxis-vr__section";const c=document.createElement("label");c.className="arxis-vr__label",c.textContent=`Distância Interpupilar: ${this.settings.ipd}mm`;const _=new g({min:55,max:75,step:1,value:this.settings.ipd,onChange:e=>{this.settings.ipd=e,this.notifyChange(),this.render()}});a.appendChild(c),a.appendChild(_.getElement()),t.appendChild(a);const n=document.createElement("div");n.className="arxis-vr__toggles";const b=new p({label:"✋ Rastreamento de Mãos",checked:this.settings.handTracking,onChange:e=>{this.settings.handTracking=e,this.notifyChange()}}),f=new p({label:"📳 Vibração dos Controles",checked:this.settings.controllerVibration,onChange:e=>{this.settings.controllerVibration=e,this.notifyChange()}}),E=new p({label:"🛡️ Modo Conforto (Reduz Náusea)",checked:this.settings.comfortMode,onChange:e=>{this.settings.comfortMode=e,this.notifyChange()}});n.appendChild(b.getElement()),n.appendChild(f.getElement()),n.appendChild(E.getElement()),t.appendChild(n);const o=document.createElement("div");o.className="arxis-vr__actions";const h=new x({text:"🔄 Resetar Padrões",variant:"secondary",size:"sm"});h.getElement().addEventListener("click",()=>this.resetDefaults());const v=new x({text:"🎯 Calibrar",variant:"primary",size:"sm"});v.getElement().addEventListener("click",()=>this.calibrate()),o.appendChild(h.getElement()),o.appendChild(v.getElement()),t.appendChild(o),this.injectStyles()}notifyChange(){this.onSettingsChange?.(this.settings)}resetDefaults(){this.settings={locomotionMode:"teleport",snapAngle:45,movementSpeed:1.5,handTracking:!0,controllerVibration:!0,comfortMode:!1,ipd:63},this.render(),this.notifyChange()}calibrate(){console.log("Iniciando calibração VR...")}getSettings(){return{...this.settings}}getElement(){return this.card.getElement()}destroy(){this.card.destroy()}injectStyles(){if(document.getElementById("arxis-vr-styles"))return;const t=document.createElement("style");t.id="arxis-vr-styles",t.textContent=`
      .arxis-vr__status {
        display: flex;
        gap: 16px;
        align-items: center;
        padding: 16px;
        background: rgba(0, 212, 255, 0.1);
        border-radius: 8px;
        margin-bottom: 20px;
      }

      .arxis-vr__status-icon {
        font-size: 40px;
      }

      .arxis-vr__status-text {
        flex: 1;
      }

      .arxis-vr__status-label {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.6);
        text-transform: uppercase;
        margin-bottom: 4px;
      }

      .arxis-vr__status-value {
        font-size: 16px;
        font-weight: 600;
        color: #00d4ff;
      }

      .arxis-vr__section {
        margin-bottom: 20px;
      }

      .arxis-vr__label {
        display: block;
        margin-bottom: 8px;
        font-size: 13px;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.8);
      }

      .arxis-vr__toggles {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: 20px;
      }

      .arxis-vr__actions {
        display: flex;
        gap: 8px;
      }
    `,document.head.appendChild(t)}}export{R as VRControlsPanel};
