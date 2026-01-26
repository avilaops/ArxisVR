class s{element;props;spinner=null;constructor(t){this.props=t,this.element=this.createButton(),this.applyStyles()}createButton(){const t=document.createElement("button");if(t.className=this.getClassNames(),this.props.icon){const e=document.createElement("span");e.className="button-icon",e.textContent=this.props.icon,t.appendChild(e)}if(this.props.text){const e=document.createElement("span");e.className="button-text",e.textContent=this.props.text,t.appendChild(e)}return this.props.loading&&(this.spinner=this.createSpinner(),t.appendChild(this.spinner)),this.props.disabled&&(t.disabled=!0),this.props.tooltip&&(t.title=this.props.tooltip),this.props.onClick&&t.addEventListener("click",this.props.onClick),t}createSpinner(){const t=document.createElement("span");return t.className="button-spinner",t.innerHTML="⟳",t}getClassNames(){const t=["arxis-button"];return this.props.variant&&t.push(`arxis-button--${this.props.variant}`),this.props.size&&t.push(`arxis-button--${this.props.size}`),this.props.fullWidth&&t.push("arxis-button--full"),this.props.loading&&t.push("arxis-button--loading"),this.props.className&&t.push(this.props.className),t.join(" ")}applyStyles(){if(document.getElementById("arxis-button-styles"))return;const t=document.createElement("style");t.id="arxis-button-styles",t.textContent=`
      .arxis-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 10px 20px;
        border: none;
        border-radius: 6px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        outline: none;
        position: relative;
        white-space: nowrap;
      }

      .arxis-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none;
      }

      /* Variants */
      .arxis-button--primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      }

      .arxis-button--primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
      }

      .arxis-button--primary:active {
        transform: translateY(0);
      }

      .arxis-button--secondary {
        background: rgba(255, 255, 255, 0.1);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.2);
      }

      .arxis-button--secondary:hover {
        background: rgba(255, 255, 255, 0.15);
        border-color: rgba(255, 255, 255, 0.3);
      }

      .arxis-button--danger {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        color: white;
        box-shadow: 0 4px 12px rgba(245, 87, 108, 0.4);
      }

      .arxis-button--danger:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(245, 87, 108, 0.6);
      }

      .arxis-button--success {
        background: linear-gradient(135deg, #00ff88 0%, #00d9ff 100%);
        color: #1a1a1a;
        box-shadow: 0 4px 12px rgba(0, 255, 136, 0.4);
      }

      .arxis-button--success:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 255, 136, 0.6);
      }

      .arxis-button--ghost {
        background: transparent;
        color: white;
        border: none;
      }

      .arxis-button--ghost:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      .arxis-button--link {
        background: transparent;
        color: #667eea;
        border: none;
        padding: 4px 8px;
      }

      .arxis-button--link:hover {
        color: #00ff88;
        text-decoration: underline;
      }

      /* Sizes */
      .arxis-button--xs {
        padding: 4px 8px;
        font-size: 11px;
        border-radius: 4px;
      }

      .arxis-button--sm {
        padding: 6px 12px;
        font-size: 12px;
        border-radius: 4px;
      }

      .arxis-button--md {
        padding: 10px 20px;
        font-size: 14px;
      }

      .arxis-button--lg {
        padding: 14px 28px;
        font-size: 16px;
        border-radius: 8px;
      }

      .arxis-button--xl {
        padding: 18px 36px;
        font-size: 18px;
        border-radius: 10px;
      }

      /* Full width */
      .arxis-button--full {
        width: 100%;
      }

      /* Loading state */
      .arxis-button--loading {
        pointer-events: none;
      }

      .button-spinner {
        animation: button-spin 1s linear infinite;
      }

      @keyframes button-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      .arxis-button--loading .button-text,
      .arxis-button--loading .button-icon {
        opacity: 0.5;
      }
    `,document.head.appendChild(t)}update(t){if(this.props={...this.props,...t},t.text!==void 0){const e=this.element.querySelector(".button-text");e&&(e.textContent=t.text)}t.disabled!==void 0&&(this.element.disabled=t.disabled),t.loading!==void 0&&(t.loading&&!this.spinner?(this.spinner=this.createSpinner(),this.element.appendChild(this.spinner)):!t.loading&&this.spinner&&(this.spinner.remove(),this.spinner=null)),this.element.className=this.getClassNames()}setLoading(t){this.update({loading:t})}setDisabled(t){this.update({disabled:t})}getElement(){return this.element}destroy(){this.props.onClick&&this.element.removeEventListener("click",this.props.onClick),this.element.remove()}}export{s as B};
