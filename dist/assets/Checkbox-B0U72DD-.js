class s{container;input;props;constructor(e={}){this.props={...e},this.container=this.createCheckbox(),this.input=this.container.querySelector("input"),this.applyStyles()}createCheckbox(){const e=document.createElement("label");e.className=this.getContainerClasses();const t=document.createElement("input");t.type="checkbox",t.className="arxis-checkbox-input",this.props.checked&&(t.checked=!0),this.props.disabled&&(t.disabled=!0),this.props.indeterminate&&(t.indeterminate=!0),this.props.onChange&&t.addEventListener("change",c=>{this.props.onChange(c.target.checked)}),e.appendChild(t);const i=document.createElement("span");if(i.className="arxis-checkbox-checkmark",e.appendChild(i),this.props.label){const c=document.createElement("span");c.className="arxis-checkbox-label",c.textContent=this.props.label,e.appendChild(c)}return e}getContainerClasses(){const e=["arxis-checkbox"];return this.props.disabled&&e.push("arxis-checkbox--disabled"),this.props.className&&e.push(this.props.className),e.join(" ")}applyStyles(){if(document.getElementById("arxis-checkbox-styles"))return;const e=document.createElement("style");e.id="arxis-checkbox-styles",e.textContent=`
      .arxis-checkbox {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        user-select: none;
        position: relative;
      }

      .arxis-checkbox--disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .arxis-checkbox-input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
      }

      .arxis-checkbox-checkmark {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        background: rgba(255, 255, 255, 0.05);
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 4px;
        transition: all 0.2s ease;
        flex-shrink: 0;
      }

      .arxis-checkbox:hover .arxis-checkbox-checkmark {
        border-color: var(--theme-primary, #667eea);
        background: rgba(102, 126, 234, 0.1);
      }

      .arxis-checkbox-input:checked ~ .arxis-checkbox-checkmark {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-color: #667eea;
      }

      .arxis-checkbox-input:checked ~ .arxis-checkbox-checkmark::after {
        content: '✓';
        color: white;
        font-size: 14px;
        font-weight: bold;
      }

      .arxis-checkbox-input:indeterminate ~ .arxis-checkbox-checkmark {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-color: #667eea;
      }

      .arxis-checkbox-input:indeterminate ~ .arxis-checkbox-checkmark::after {
        content: '−';
        color: white;
        font-size: 16px;
        font-weight: bold;
      }

      .arxis-checkbox-label {
        font-size: 14px;
        color: var(--theme-foreground, #fff);
      }
    `,document.head.appendChild(e)}setChecked(e){this.input.checked=e,this.input.indeterminate=!1}isChecked(){return this.input.checked}setIndeterminate(e){this.input.indeterminate=e}getElement(){return this.container}destroy(){this.container.remove()}}export{s as C};
