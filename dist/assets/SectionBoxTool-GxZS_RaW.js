import{C as l}from"./Card-DLSvBshn.js";import{B as x}from"./Button-BvNVdej2.js";import{T as d}from"./Toggle-D3VS2hV5.js";class B{card;sectionBox;onSectionChange;constructor(e){this.onSectionChange=e?.onSectionChange,this.sectionBox={enabled:!1,min:{x:-50,y:-50,z:-50},max:{x:50,y:50,z:50},inverted:!1},this.card=new l({title:"📦 Section Box",variant:"glass"}),this.render()}render(){const e=this.card.getBody();e.innerHTML="";const o=new d({label:"Ativar Section Box",checked:this.sectionBox.enabled,onChange:t=>{this.sectionBox.enabled=t,this.render(),this.notifyChange()}});if(e.appendChild(o.getElement()),this.sectionBox.enabled){const t=new d({label:"Inverter Seleção",checked:this.sectionBox.inverted,onChange:a=>{this.sectionBox.inverted=a,this.notifyChange()}});e.appendChild(t.getElement()),e.appendChild(this.createBoundsSection("Mínimo",this.sectionBox.min)),e.appendChild(this.createBoundsSection("Máximo",this.sectionBox.max));const s=this.createSection("Presets"),n=document.createElement("div");n.className="arxis-section-box__presets",[{name:"🔝 Metade Superior",fn:()=>this.applyPreset("top")},{name:"🔽 Metade Inferior",fn:()=>this.applyPreset("bottom")},{name:"◀️ Metade Esquerda",fn:()=>this.applyPreset("left")},{name:"▶️ Metade Direita",fn:()=>this.applyPreset("right")},{name:"🎯 Centro",fn:()=>this.applyPreset("center")},{name:"🔄 Resetar",fn:()=>this.applyPreset("reset")}].forEach(({name:a,fn:h})=>{const c=new x({text:a,variant:"secondary",size:"sm"});c.getElement().addEventListener("click",h),n.appendChild(c.getElement())}),s.appendChild(n),e.appendChild(s);const i=document.createElement("div");i.className="arxis-section-box__visual",i.innerHTML=this.createVisualRepresentation(),e.appendChild(i)}}createSection(e){const o=document.createElement("div");o.className="arxis-section-box__section";const t=document.createElement("h4");return t.className="arxis-section-box__section-title",t.textContent=e,o.appendChild(t),o}createBoundsSection(e,o){const t=this.createSection(e);return["x","y","z"].forEach(s=>{const n=document.createElement("div");n.className="arxis-section-box__control";const r=document.createElement("label");r.textContent=`${s.toUpperCase()}:`;const i=document.createElement("input");i.type="range",i.className="arxis-section-box__slider",i.min="-100",i.max="100",i.step="1",i.value=String(o[s]);const a=document.createElement("span");a.className="arxis-section-box__value",a.textContent=String(o[s]),i.addEventListener("input",h=>{const c=parseFloat(h.target.value);o[s]=c,a.textContent=String(c),this.notifyChange()}),n.appendChild(r),n.appendChild(i),n.appendChild(a),t.appendChild(n)}),t}createVisualRepresentation(){const{min:e,max:o}=this.sectionBox,t=200,s=200,n=t/2,r=s/2,i=(o.x-e.x)/200*t,a=(o.z-e.z)/200*s,h=n+e.x/100*(t/2),c=r+e.z/100*(s/2);return`
      <svg width="${t}" height="${s}" class="arxis-section-box__svg">
        <!-- Grid background -->
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
          </pattern>
        </defs>
        <rect width="${t}" height="${s}" fill="url(#grid)"/>
        
        <!-- Bounding area -->
        <rect x="10" y="10" width="${t-20}" height="${s-20}" 
              fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1" stroke-dasharray="5,5"/>
        
        <!-- Section box -->
        <rect x="${h}" y="${c}" width="${i}" height="${a}"
              fill="rgba(0, 212, 255, 0.2)" stroke="#00d4ff" stroke-width="2"/>
        
        <!-- Center cross -->
        <line x1="${n-10}" y1="${r}" x2="${n+10}" y2="${r}" 
              stroke="rgba(255,255,255,0.4)" stroke-width="1"/>
        <line x1="${n}" y1="${r-10}" x2="${n}" y2="${r+10}" 
              stroke="rgba(255,255,255,0.4)" stroke-width="1"/>
      </svg>
    `}applyPreset(e){switch(e){case"top":this.sectionBox.min={x:-50,y:0,z:-50},this.sectionBox.max={x:50,y:50,z:50};break;case"bottom":this.sectionBox.min={x:-50,y:-50,z:-50},this.sectionBox.max={x:50,y:0,z:50};break;case"left":this.sectionBox.min={x:-50,y:-50,z:-50},this.sectionBox.max={x:0,y:50,z:50};break;case"right":this.sectionBox.min={x:0,y:-50,z:-50},this.sectionBox.max={x:50,y:50,z:50};break;case"center":this.sectionBox.min={x:-25,y:-25,z:-25},this.sectionBox.max={x:25,y:25,z:25};break;case"reset":this.sectionBox.min={x:-50,y:-50,z:-50},this.sectionBox.max={x:50,y:50,z:50};break}this.render(),this.notifyChange()}notifyChange(){this.onSectionChange?.(this.sectionBox)}getSectionBox(){return this.sectionBox}setSectionBox(e){Object.assign(this.sectionBox,e),this.render()}getElement(){return this.card.getElement()}destroy(){this.card.destroy()}}export{B as SectionBoxTool};
