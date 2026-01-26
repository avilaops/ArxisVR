class i{container;selectButton;dropdown;props;isOpen=!1;selectedValue=null;constructor(e){this.props={...e},this.container=this.createContainer(),this.selectButton=this.createSelectButton(),this.dropdown=this.createDropdown(),this.applyStyles(),this.setupEventListeners()}createContainer(){const e=document.createElement("div");if(e.className=this.getContainerClasses(),this.props.label){const t=document.createElement("label");if(t.className="arxis-select-label",t.textContent=this.props.label,this.props.required){const s=document.createElement("span");s.className="arxis-select-required",s.textContent=" *",t.appendChild(s)}e.appendChild(t)}return e}createSelectButton(){const e=document.createElement("div");e.className="arxis-select-button",this.props.disabled&&e.classList.add("arxis-select-button--disabled");const t=document.createElement("span");t.className="arxis-select-text",t.textContent=this.props.placeholder||"Selecione...",e.appendChild(t);const s=document.createElement("span");return s.className="arxis-select-arrow",s.textContent="▼",e.appendChild(s),this.container.appendChild(e),e}createDropdown(){const e=document.createElement("div");if(e.className="arxis-select-dropdown",e.style.display="none",this.props.searchable){const s=document.createElement("div");s.className="arxis-select-search";const o=document.createElement("input");o.type="text",o.placeholder="Buscar...",o.className="arxis-select-search-input",o.addEventListener("input",r=>{this.filterOptions(r.target.value)}),s.appendChild(o),e.appendChild(s)}const t=document.createElement("div");return t.className="arxis-select-options",this.props.options.forEach(s=>{const o=this.createOption(s);t.appendChild(o)}),e.appendChild(t),this.container.appendChild(e),e}createOption(e){const t=document.createElement("div");if(t.className="arxis-select-option",t.dataset.value=e.value,e.disabled&&t.classList.add("arxis-select-option--disabled"),e.icon){const o=document.createElement("span");o.className="arxis-select-option-icon",o.textContent=e.icon,t.appendChild(o)}const s=document.createElement("span");return s.textContent=e.label,t.appendChild(s),e.disabled||t.addEventListener("click",()=>{this.selectOption(e)}),t}filterOptions(e){const t=this.dropdown.querySelector(".arxis-select-options");if(!t)return;const s=t.querySelectorAll(".arxis-select-option"),o=e.toLowerCase();s.forEach(r=>{(r.textContent?.toLowerCase()||"").includes(o)?r.style.display="":r.style.display="none"})}selectOption(e){this.selectedValue=e.value;const t=this.selectButton.querySelector(".arxis-select-text");t&&(t.textContent=e.label),this.dropdown.querySelectorAll(".arxis-select-option").forEach(r=>r.classList.remove("arxis-select-option--selected"));const o=this.dropdown.querySelector(`[data-value="${e.value}"]`);o&&o.classList.add("arxis-select-option--selected"),this.close(),this.props.onChange&&this.props.onChange(e.value)}setupEventListeners(){this.selectButton.addEventListener("click",()=>{this.props.disabled||this.toggle()}),document.addEventListener("click",e=>{this.container.contains(e.target)||this.close()})}getContainerClasses(){const e=["arxis-select-container"];return this.props.fullWidth&&e.push("arxis-select-container--full"),this.props.error&&e.push("arxis-select-container--error"),this.props.disabled&&e.push("arxis-select-container--disabled"),this.props.className&&e.push(this.props.className),e.join(" ")}open(){this.props.disabled||(this.dropdown.style.display="block",this.selectButton.classList.add("arxis-select-button--open"),this.isOpen=!0)}close(){this.dropdown.style.display="none",this.selectButton.classList.remove("arxis-select-button--open"),this.isOpen=!1}toggle(){this.isOpen?this.close():this.open()}setValue(e){const t=this.props.options.find(s=>s.value===e);t&&this.selectOption(t)}getValue(){return this.selectedValue}applyStyles(){if(document.getElementById("arxis-select-styles"))return;const e=document.createElement("style");e.id="arxis-select-styles",e.textContent=`
      .arxis-select-container {
        position: relative;
        margin-bottom: 16px;
      }

      .arxis-select-container--full {
        width: 100%;
      }

      .arxis-select-label {
        display: block;
        font-size: 13px;
        font-weight: 500;
        color: var(--theme-foreground, #fff);
        margin-bottom: 6px;
      }

      .arxis-select-required {
        color: #f5576c;
      }

      .arxis-select-button {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 14px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        color: var(--theme-foreground, #fff);
        cursor: pointer;
        transition: all 0.2s ease;
        user-select: none;
      }

      .arxis-select-button:hover {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.2);
      }

      .arxis-select-button--open {
        border-color: var(--theme-primary, #667eea);
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      .arxis-select-button--open .arxis-select-arrow {
        transform: rotate(180deg);
      }

      .arxis-select-button--disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .arxis-select-text {
        flex: 1;
        font-size: 14px;
      }

      .arxis-select-arrow {
        font-size: 10px;
        transition: transform 0.2s ease;
      }

      .arxis-select-dropdown {
        position: absolute;
        top: calc(100% + 4px);
        left: 0;
        right: 0;
        background: rgba(20, 20, 20, 0.98);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        z-index: 1000;
        max-height: 300px;
        overflow-y: auto;
        animation: arxis-select-dropdown-show 0.2s ease;
      }

      @keyframes arxis-select-dropdown-show {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .arxis-select-search {
        padding: 8px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .arxis-select-search-input {
        width: 100%;
        padding: 8px 12px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        color: var(--theme-foreground, #fff);
        font-size: 13px;
        outline: none;
      }

      .arxis-select-search-input::placeholder {
        color: rgba(255, 255, 255, 0.4);
      }

      .arxis-select-options {
        padding: 4px;
      }

      .arxis-select-option {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 12px;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.15s ease;
        font-size: 14px;
        color: var(--theme-foreground, #fff);
      }

      .arxis-select-option:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      .arxis-select-option--selected {
        background: rgba(102, 126, 234, 0.2);
        color: var(--theme-accent, #00ff88);
      }

      .arxis-select-option--disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .arxis-select-option-icon {
        font-size: 16px;
      }
    `,document.head.appendChild(e)}getElement(){return this.container}destroy(){this.container.remove()}}export{i as S};
