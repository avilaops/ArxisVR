import{B as o}from"./Button-BvNVdej2.js";class u{container;hud;measurements=[];currentMeasurement;mode="distance";onMeasurementComplete;constructor(e){this.onMeasurementComplete=e?.onMeasurementComplete,this.container=document.createElement("div"),this.container.className="arxis-ar-measure",this.hud=document.createElement("div"),this.hud.className="arxis-ar-measure__hud",this.render()}render(){this.container.innerHTML="";const e=document.createElement("div");e.className="arxis-ar-measure__modes",[{type:"distance",icon:"📏",label:"Distância"},{type:"area",icon:"▭",label:"Área"},{type:"volume",icon:"📦",label:"Volume"},{type:"angle",icon:"📐",label:"Ângulo"}].forEach(r=>{const i=document.createElement("div");i.className=`arxis-ar-measure__mode ${this.mode===r.type?"arxis-ar-measure__mode--active":""}`,i.innerHTML=`
        <div class="arxis-ar-measure__mode-icon">${r.icon}</div>
        <div class="arxis-ar-measure__mode-label">${r.label}</div>
      `,i.addEventListener("click",()=>{this.mode=r.type,this.render()}),e.appendChild(i)}),this.container.appendChild(e),this.renderHUD(),this.container.appendChild(this.hud);const a=document.createElement("div");a.className="arxis-ar-measure__list";const s=document.createElement("h4");if(s.textContent="Medições",s.style.margin="0 0 12px 0",s.style.color="#fff",s.style.fontSize="14px",a.appendChild(s),this.measurements.length===0){const r=document.createElement("div");r.className="arxis-ar-measure__empty",r.textContent="Nenhuma medição realizada",a.appendChild(r)}else this.measurements.forEach(r=>{const i=this.createMeasurementItem(r);a.appendChild(i)});this.container.appendChild(a),document.body.contains(this.container)||document.body.appendChild(this.container),this.injectStyles()}renderHUD(){if(this.hud.innerHTML="",!this.currentMeasurement){this.hud.innerHTML=`
        <div class="arxis-ar-measure__hud-icon">🎯</div>
        <div class="arxis-ar-measure__hud-text">
          <div>Aponte para iniciar medição</div>
          <div style="font-size: 12px; opacity: 0.7; margin-top: 4px;">
            Modo: ${this.getModeLabel()}
          </div>
        </div>
      `;return}const e=this.formatValue(this.currentMeasurement.value,this.currentMeasurement.unit);this.hud.innerHTML=`
      <div class="arxis-ar-measure__hud-value">${e}</div>
      <div class="arxis-ar-measure__hud-type">${this.getModeLabel()}</div>
      <div class="arxis-ar-measure__hud-points">
        ${this.currentMeasurement.points.length} pontos
      </div>
    `}createMeasurementItem(e){const t=document.createElement("div");t.className="arxis-ar-measure__item";const a=document.createElement("div");a.className="arxis-ar-measure__item-icon",a.textContent=this.getModeIcon(e.type),t.appendChild(a);const s=document.createElement("div");s.className="arxis-ar-measure__item-info";const r=document.createElement("div");r.className="arxis-ar-measure__item-value",r.textContent=this.formatValue(e.value,e.unit);const i=document.createElement("div");i.className="arxis-ar-measure__item-type",i.textContent=this.getModeLabel(e.type),s.appendChild(r),s.appendChild(i),t.appendChild(s);const n=new o({text:"🗑️",variant:"danger",size:"sm"});return n.getElement().addEventListener("click",()=>{this.removeMeasurement(e.id)}),t.appendChild(n.getElement()),t}getModeIcon(e){return{distance:"📏",area:"▭",volume:"📦",angle:"📐"}[e||this.mode]||"📏"}getModeLabel(e){return{distance:"Distância",area:"Área",volume:"Volume",angle:"Ângulo"}[e||this.mode]||"Distância"}formatValue(e,t){return`${e.toFixed(2)} ${t}`}startMeasurement(){this.currentMeasurement={id:`m-${Date.now()}`,type:this.mode,value:0,unit:this.getUnitForMode(),points:[],timestamp:Date.now()},this.renderHUD()}addPoint(e){this.currentMeasurement||this.startMeasurement(),this.currentMeasurement.points.push(e),this.updateMeasurementValue(),this.renderHUD()}completeMeasurement(){this.currentMeasurement&&this.currentMeasurement.points.length>0&&(this.measurements.push(this.currentMeasurement),this.onMeasurementComplete?.(this.currentMeasurement),this.currentMeasurement=void 0,this.render())}cancelMeasurement(){this.currentMeasurement=void 0,this.renderHUD()}updateMeasurementValue(){if(!this.currentMeasurement||this.currentMeasurement.points.length<2)return;const e=this.currentMeasurement.points;switch(this.mode){case"distance":const t=e[0],a=e[e.length-1];this.currentMeasurement.value=Math.sqrt(Math.pow(a.x-t.x,2)+Math.pow(a.y-t.y,2)+Math.pow(a.z-t.z,2));break;case"area":case"volume":case"angle":this.currentMeasurement.value=e.length*2.5;break}}getUnitForMode(){return{distance:"m",area:"m²",volume:"m³",angle:"°"}[this.mode]||"m"}removeMeasurement(e){this.measurements=this.measurements.filter(t=>t.id!==e),this.render()}clearAll(){this.measurements=[],this.currentMeasurement=void 0,this.render()}getElement(){return this.container}destroy(){this.container.remove()}injectStyles(){if(document.getElementById("arxis-ar-measure-styles"))return;const e=document.createElement("style");e.id="arxis-ar-measure-styles",e.textContent=`
      .arxis-ar-measure {
        position: fixed;
        bottom: 20px;
        left: 20px;
        right: 20px;
        max-width: 400px;
        background: rgba(20, 20, 30, 0.95);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(0, 212, 255, 0.3);
        border-radius: 16px;
        padding: 16px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
        z-index: 9999;
      }

      .arxis-ar-measure__modes {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;
        margin-bottom: 16px;
      }

      .arxis-ar-measure__mode {
        padding: 12px 8px;
        background: rgba(255, 255, 255, 0.05);
        border: 2px solid transparent;
        border-radius: 8px;
        text-align: center;
        cursor: pointer;
        transition: all 0.2s;
      }

      .arxis-ar-measure__mode:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(0, 212, 255, 0.3);
      }

      .arxis-ar-measure__mode--active {
        background: rgba(0, 212, 255, 0.15);
        border-color: #00d4ff;
      }

      .arxis-ar-measure__mode-icon {
        font-size: 24px;
        margin-bottom: 4px;
      }

      .arxis-ar-measure__mode-label {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.8);
        font-weight: 600;
      }

      .arxis-ar-measure__hud {
        padding: 16px;
        background: rgba(0, 212, 255, 0.1);
        border-radius: 8px;
        margin-bottom: 16px;
        text-align: center;
      }

      .arxis-ar-measure__hud-icon {
        font-size: 40px;
        margin-bottom: 8px;
      }

      .arxis-ar-measure__hud-text {
        color: rgba(255, 255, 255, 0.9);
        font-size: 14px;
      }

      .arxis-ar-measure__hud-value {
        font-size: 32px;
        font-weight: 700;
        color: #00d4ff;
        margin-bottom: 6px;
      }

      .arxis-ar-measure__hud-type {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.7);
        margin-bottom: 4px;
      }

      .arxis-ar-measure__hud-points {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.5);
      }

      .arxis-ar-measure__list {
        max-height: 200px;
        overflow-y: auto;
      }

      .arxis-ar-measure__item {
        display: flex;
        gap: 12px;
        align-items: center;
        padding: 10px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        margin-bottom: 8px;
      }

      .arxis-ar-measure__item-icon {
        font-size: 24px;
        width: 32px;
        text-align: center;
      }

      .arxis-ar-measure__item-info {
        flex: 1;
      }

      .arxis-ar-measure__item-value {
        font-size: 16px;
        font-weight: 700;
        color: #fff;
        margin-bottom: 2px;
      }

      .arxis-ar-measure__item-type {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.6);
      }

      .arxis-ar-measure__empty {
        padding: 20px;
        text-align: center;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.5);
      }
    `,document.head.appendChild(e)}}export{u as ARMeasurementUI};
