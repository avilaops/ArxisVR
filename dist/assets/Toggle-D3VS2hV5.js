class o{container;input;props;constructor(e={}){this.props={size:"md",...e},this.container=this.createToggle(),this.input=this.container.querySelector("input"),this.applyStyles()}createToggle(){const e=document.createElement("label");e.className=this.getContainerClasses();const t=document.createElement("input");t.type="checkbox",t.className="arxis-toggle-input",this.props.checked&&(t.checked=!0),this.props.disabled&&(t.disabled=!0),this.props.onChange&&t.addEventListener("change",s=>{this.props.onChange(s.target.checked)}),e.appendChild(t);const i=document.createElement("span");i.className="arxis-toggle-switch";const r=document.createElement("span");if(r.className="arxis-toggle-slider",i.appendChild(r),e.appendChild(i),this.props.label){const s=document.createElement("span");s.className="arxis-toggle-label",s.textContent=this.props.label,e.appendChild(s)}return e}getContainerClasses(){const e=["arxis-toggle"];return this.props.size&&e.push(`arxis-toggle--${this.props.size}`),this.props.disabled&&e.push("arxis-toggle--disabled"),this.props.className&&e.push(this.props.className),e.join(" ")}applyStyles(){if(document.getElementById("arxis-toggle-styles"))return;const e=document.createElement("style");e.id="arxis-toggle-styles",e.textContent=`
      .arxis-toggle {
        display: inline-flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
        user-select: none;
        position: relative;
      }

      .arxis-toggle--disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .arxis-toggle-input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
      }

      .arxis-toggle-switch {
        position: relative;
        display: inline-block;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 100px;
        transition: all 0.3s ease;
        flex-shrink: 0;
      }

      /* Sizes */
      .arxis-toggle--sm .arxis-toggle-switch {
        width: 36px;
        height: 20px;
      }

      .arxis-toggle--md .arxis-toggle-switch {
        width: 44px;
        height: 24px;
      }

      .arxis-toggle--lg .arxis-toggle-switch {
        width: 52px;
        height: 28px;
      }

      .arxis-toggle-slider {
        position: absolute;
        top: 2px;
        left: 2px;
        background: white;
        border-radius: 50%;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }

      .arxis-toggle--sm .arxis-toggle-slider {
        width: 16px;
        height: 16px;
      }

      .arxis-toggle--md .arxis-toggle-slider {
        width: 20px;
        height: 20px;
      }

      .arxis-toggle--lg .arxis-toggle-slider {
        width: 24px;
        height: 24px;
      }

      .arxis-toggle-input:checked ~ .arxis-toggle-switch {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      .arxis-toggle--sm .arxis-toggle-input:checked ~ .arxis-toggle-switch .arxis-toggle-slider {
        transform: translateX(16px);
      }

      .arxis-toggle--md .arxis-toggle-input:checked ~ .arxis-toggle-switch .arxis-toggle-slider {
        transform: translateX(20px);
      }

      .arxis-toggle--lg .arxis-toggle-input:checked ~ .arxis-toggle-switch .arxis-toggle-slider {
        transform: translateX(24px);
      }

      .arxis-toggle:hover .arxis-toggle-switch {
        box-shadow: 0 0 8px rgba(102, 126, 234, 0.4);
      }

      .arxis-toggle-label {
        font-size: 14px;
        color: var(--theme-foreground, #fff);
        font-weight: 500;
      }
    `,document.head.appendChild(e)}setChecked(e){this.input.checked=e}isChecked(){return this.input.checked}toggle(){this.input.checked=!this.input.checked,this.props.onChange&&this.props.onChange(this.input.checked)}getElement(){return this.container}destroy(){this.container.remove()}}export{o as T};
