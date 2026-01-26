class s{container;input;props;errorElement=null;hintElement=null;constructor(t){this.props={type:"text",size:"md",...t},this.container=this.createContainer(),this.input=this.createInput(),this.applyStyles()}createContainer(){const t=document.createElement("div");return t.className=this.getContainerClasses(),t}createInput(){if(this.props.label){const i=document.createElement("label");if(i.className="arxis-input-label",i.textContent=this.props.label,this.props.required){const r=document.createElement("span");r.className="arxis-input-required",r.textContent=" *",i.appendChild(r)}this.container.appendChild(i)}const t=document.createElement("div");if(t.className="arxis-input-wrapper",this.props.icon){const i=document.createElement("span");i.className="arxis-input-icon",i.textContent=this.props.icon,t.appendChild(i)}const e=document.createElement("input");if(e.type=this.props.type||"text",e.className="arxis-input",this.props.placeholder&&(e.placeholder=this.props.placeholder),this.props.value&&(e.value=this.props.value),this.props.disabled&&(e.disabled=!0),this.props.readonly&&(e.readOnly=!0),this.props.required&&(e.required=!0),this.props.onChange&&e.addEventListener("input",()=>{this.props.onChange(e.value)}),this.props.onFocus&&e.addEventListener("focus",this.props.onFocus),this.props.onBlur&&e.addEventListener("blur",this.props.onBlur),t.appendChild(e),this.props.suffix){const i=document.createElement("span");i.className="arxis-input-suffix",i.textContent=this.props.suffix,t.appendChild(i)}return this.container.appendChild(t),this.props.hint&&!this.props.error&&(this.hintElement=document.createElement("div"),this.hintElement.className="arxis-input-hint",this.hintElement.textContent=this.props.hint,this.container.appendChild(this.hintElement)),this.props.error&&(this.errorElement=document.createElement("div"),this.errorElement.className="arxis-input-error",this.errorElement.textContent=this.props.error,this.container.appendChild(this.errorElement)),e}getContainerClasses(){const t=["arxis-input-container"];return this.props.size&&t.push(`arxis-input-container--${this.props.size}`),this.props.fullWidth&&t.push("arxis-input-container--full"),this.props.error&&t.push("arxis-input-container--error"),this.props.disabled&&t.push("arxis-input-container--disabled"),this.props.className&&t.push(this.props.className),t.join(" ")}applyStyles(){if(document.getElementById("arxis-input-styles"))return;const t=document.createElement("style");t.id="arxis-input-styles",t.textContent=`
      .arxis-input-container {
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin-bottom: 16px;
      }

      .arxis-input-container--full {
        width: 100%;
      }

      .arxis-input-label {
        font-size: 13px;
        font-weight: 500;
        color: var(--theme-foreground, #fff);
        margin-bottom: 4px;
      }

      .arxis-input-required {
        color: #f5576c;
      }

      .arxis-input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        transition: all 0.2s ease;
      }

      .arxis-input-wrapper:focus-within {
        border-color: var(--theme-primary, #667eea);
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        background: rgba(255, 255, 255, 0.08);
      }

      .arxis-input-container--error .arxis-input-wrapper {
        border-color: #f5576c;
      }

      .arxis-input-container--error .arxis-input-wrapper:focus-within {
        box-shadow: 0 0 0 3px rgba(245, 87, 108, 0.1);
      }

      .arxis-input-container--disabled .arxis-input-wrapper {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .arxis-input {
        flex: 1;
        background: transparent;
        border: none;
        outline: none;
        padding: 10px 14px;
        font-size: 14px;
        color: var(--theme-foreground, #fff);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .arxis-input::placeholder {
        color: rgba(255, 255, 255, 0.4);
      }

      .arxis-input:disabled {
        cursor: not-allowed;
      }

      .arxis-input-icon {
        padding-left: 14px;
        color: rgba(255, 255, 255, 0.5);
        font-size: 16px;
      }

      .arxis-input-suffix {
        padding-right: 14px;
        color: rgba(255, 255, 255, 0.5);
        font-size: 13px;
        font-weight: 500;
      }

      /* Sizes */
      .arxis-input-container--sm .arxis-input {
        padding: 6px 10px;
        font-size: 12px;
      }

      .arxis-input-container--md .arxis-input {
        padding: 10px 14px;
        font-size: 14px;
      }

      .arxis-input-container--lg .arxis-input {
        padding: 14px 18px;
        font-size: 16px;
      }

      /* Hint & Error */
      .arxis-input-hint {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
        margin-top: -2px;
      }

      .arxis-input-error {
        font-size: 12px;
        color: #f5576c;
        margin-top: -2px;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .arxis-input-error::before {
        content: '⚠';
      }
    `,document.head.appendChild(t)}setValue(t){this.input.value=t}getValue(){return this.input.value}setError(t){this.props.error=t||void 0,this.errorElement&&(this.errorElement.remove(),this.errorElement=null),t&&this.hintElement&&(this.hintElement.remove(),this.hintElement=null),t?(this.errorElement=document.createElement("div"),this.errorElement.className="arxis-input-error",this.errorElement.textContent=t,this.container.appendChild(this.errorElement),this.container.classList.add("arxis-input-container--error")):(this.container.classList.remove("arxis-input-container--error"),this.props.hint&&(this.hintElement=document.createElement("div"),this.hintElement.className="arxis-input-hint",this.hintElement.textContent=this.props.hint,this.container.appendChild(this.hintElement)))}focus(){this.input.focus()}clear(){this.input.value="",this.props.onChange&&this.props.onChange("")}getElement(){return this.container}getInputElement(){return this.input}destroy(){this.container.remove()}}export{s as I};
