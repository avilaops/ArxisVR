class s{container;props;constructor(e={}){this.props={size:"md",variant:"default",overlay:!1,...e},this.container=this.createSpinner(),this.applyStyles()}createSpinner(){const e=document.createElement("div");e.className=this.getContainerClasses();const n=document.createElement("div");if(n.className="arxis-spinner",e.appendChild(n),this.props.text){const i=document.createElement("div");i.className="arxis-spinner-text",i.textContent=this.props.text,e.appendChild(i)}return e}getContainerClasses(){const e=["arxis-spinner-container"];return this.props.size&&e.push(`arxis-spinner--${this.props.size}`),this.props.variant&&e.push(`arxis-spinner--${this.props.variant}`),this.props.overlay&&e.push("arxis-spinner--overlay"),this.props.className&&e.push(this.props.className),e.join(" ")}applyStyles(){if(document.getElementById("arxis-spinner-styles"))return;const e=document.createElement("style");e.id="arxis-spinner-styles",e.textContent=`
      .arxis-spinner-container {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
      }

      .arxis-spinner-container--overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(8px);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
      }

      .arxis-spinner {
        border-radius: 50%;
        border-style: solid;
        border-color: transparent;
        border-top-color: currentColor;
        animation: arxis-spinner-rotate 0.8s linear infinite;
      }

      @keyframes arxis-spinner-rotate {
        to {
          transform: rotate(360deg);
        }
      }

      /* Sizes */
      .arxis-spinner--xs .arxis-spinner {
        width: 16px;
        height: 16px;
        border-width: 2px;
      }

      .arxis-spinner--sm .arxis-spinner {
        width: 24px;
        height: 24px;
        border-width: 2px;
      }

      .arxis-spinner--md .arxis-spinner {
        width: 40px;
        height: 40px;
        border-width: 3px;
      }

      .arxis-spinner--lg .arxis-spinner {
        width: 56px;
        height: 56px;
        border-width: 4px;
      }

      .arxis-spinner--xl .arxis-spinner {
        width: 72px;
        height: 72px;
        border-width: 5px;
      }

      /* Variants */
      .arxis-spinner--default .arxis-spinner {
        color: var(--theme-primary, #667eea);
      }

      .arxis-spinner--accent .arxis-spinner {
        color: var(--theme-accent, #00ff88);
      }

      .arxis-spinner--white .arxis-spinner {
        color: white;
      }

      .arxis-spinner-text {
        font-size: 14px;
        font-weight: 500;
        color: var(--theme-foreground, #fff);
        text-align: center;
      }
    `,document.head.appendChild(e)}setText(e){const n=this.container.querySelector(".arxis-spinner-text");n&&(n.textContent=e)}getElement(){return this.container}destroy(){this.container.remove()}}let r=null;function o(t){r&&a(),r=new s({text:t||"Carregando...",overlay:!0,size:"lg"}),document.body.appendChild(r.getElement())}function a(){r&&(r.destroy(),r=null)}export{a as h,o as s};
