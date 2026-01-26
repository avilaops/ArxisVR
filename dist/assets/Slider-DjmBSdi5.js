class i{container;input;valueDisplay=null;props;constructor(e={}){this.props={min:0,max:100,step:1,value:50,showValue:!0,...e},this.container=this.createSlider(),this.input=this.container.querySelector("input"),this.applyStyles(),this.updateValueDisplay()}createSlider(){const e=document.createElement("div");if(e.className=this.getContainerClasses(),this.props.label||this.props.showValue){const s=document.createElement("div");if(s.className="arxis-slider-header",this.props.label){const a=document.createElement("label");a.className="arxis-slider-label",a.textContent=this.props.label,s.appendChild(a)}this.props.showValue&&(this.valueDisplay=document.createElement("span"),this.valueDisplay.className="arxis-slider-value",s.appendChild(this.valueDisplay)),e.appendChild(s)}const t=document.createElement("input");return t.type="range",t.className="arxis-slider-input",t.min=this.props.min.toString(),t.max=this.props.max.toString(),t.step=this.props.step.toString(),t.value=this.props.value.toString(),this.props.disabled&&(t.disabled=!0),t.addEventListener("input",s=>{const a=parseFloat(s.target.value);this.updateValueDisplay(),this.props.onInput&&this.props.onInput(a)}),t.addEventListener("change",s=>{const a=parseFloat(s.target.value);this.props.onChange&&this.props.onChange(a)}),e.appendChild(t),e}updateValueDisplay(){if(this.valueDisplay){const e=this.input.value,t=this.props.unit||"";this.valueDisplay.textContent=`${e}${t}`}}getContainerClasses(){const e=["arxis-slider-container"];return this.props.disabled&&e.push("arxis-slider-container--disabled"),this.props.className&&e.push(this.props.className),e.join(" ")}applyStyles(){if(document.getElementById("arxis-slider-styles"))return;const e=document.createElement("style");e.id="arxis-slider-styles",e.textContent=`
      .arxis-slider-container {
        margin-bottom: 16px;
      }

      .arxis-slider-container--disabled {
        opacity: 0.5;
        pointer-events: none;
      }

      .arxis-slider-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }

      .arxis-slider-label {
        font-size: 13px;
        font-weight: 500;
        color: var(--theme-foreground, #fff);
      }

      .arxis-slider-value {
        font-size: 13px;
        font-weight: 600;
        color: var(--theme-accent, #00ff88);
        font-family: 'Courier New', monospace;
      }

      .arxis-slider-input {
        width: 100%;
        height: 6px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
        outline: none;
        -webkit-appearance: none;
        appearance: none;
        cursor: pointer;
      }

      /* Track */
      .arxis-slider-input::-webkit-slider-track {
        width: 100%;
        height: 6px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
      }

      .arxis-slider-input::-moz-range-track {
        width: 100%;
        height: 6px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
      }

      /* Thumb */
      .arxis-slider-input::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 18px;
        height: 18px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
        transition: all 0.2s ease;
      }

      .arxis-slider-input::-moz-range-thumb {
        width: 18px;
        height: 18px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 50%;
        cursor: pointer;
        border: none;
        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
        transition: all 0.2s ease;
      }

      .arxis-slider-input::-webkit-slider-thumb:hover {
        transform: scale(1.2);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.6);
      }

      .arxis-slider-input::-moz-range-thumb:hover {
        transform: scale(1.2);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.6);
      }

      /* Progress effect (fill) */
      .arxis-slider-input {
        background: linear-gradient(
          to right,
          var(--theme-primary, #667eea) 0%,
          var(--theme-primary, #667eea) var(--slider-progress, 50%),
          rgba(255, 255, 255, 0.1) var(--slider-progress, 50%),
          rgba(255, 255, 255, 0.1) 100%
        );
      }
    `,document.head.appendChild(e),this.updateProgress(),this.input.addEventListener("input",()=>this.updateProgress())}updateProgress(){const e=parseFloat(this.input.min),t=parseFloat(this.input.max),a=(parseFloat(this.input.value)-e)/(t-e)*100;this.input.style.setProperty("--slider-progress",`${a}%`)}setValue(e){this.input.value=e.toString(),this.updateValueDisplay(),this.updateProgress()}getValue(){return parseFloat(this.input.value)}getElement(){return this.container}destroy(){this.container.remove()}}export{i as S};
