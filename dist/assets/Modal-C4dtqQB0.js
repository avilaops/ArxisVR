class i{overlay;modal;header=null;body;footer=null;props;isOpen=!1;constructor(e={}){this.props={size:"md",closeOnOverlay:!0,closeOnEscape:!0,showCloseButton:!0,...e},this.overlay=this.createOverlay(),this.modal=this.createModal(),this.body=this.createBody(),this.applyStyles(),this.setupEventListeners()}createOverlay(){const e=document.createElement("div");return e.className="arxis-modal-overlay",e.style.display="none",document.body.appendChild(e),e}createModal(){const e=document.createElement("div");return e.className=this.getModalClasses(),(this.props.title||this.props.showCloseButton)&&(this.header=this.createHeader(),e.appendChild(this.header)),this.overlay.appendChild(e),e}createHeader(){const e=document.createElement("div");if(e.className="arxis-modal-header",this.props.title){const t=document.createElement("div");t.className="arxis-modal-title-section";const s=document.createElement("h2");if(s.className="arxis-modal-title",s.textContent=this.props.title,t.appendChild(s),this.props.subtitle){const o=document.createElement("p");o.className="arxis-modal-subtitle",o.textContent=this.props.subtitle,t.appendChild(o)}e.appendChild(t)}if(this.props.showCloseButton){const t=document.createElement("button");t.className="arxis-modal-close",t.innerHTML="✕",t.onclick=()=>this.close(),e.appendChild(t)}return e}createBody(){const e=document.createElement("div");return e.className="arxis-modal-body",this.modal.appendChild(e),e}createFooter(){const e=document.createElement("div");return e.className="arxis-modal-footer",typeof this.props.footer=="string"?e.innerHTML=this.props.footer:this.props.footer instanceof HTMLElement&&e.appendChild(this.props.footer),e}getModalClasses(){const e=["arxis-modal"];return this.props.size&&e.push(`arxis-modal--${this.props.size}`),this.props.className&&e.push(this.props.className),e.join(" ")}setupEventListeners(){this.props.closeOnOverlay&&this.overlay.addEventListener("click",e=>{e.target===this.overlay&&this.close()}),this.props.closeOnEscape&&(this.handleEscape=this.handleEscape.bind(this))}handleEscape(e){e.key==="Escape"&&this.isOpen&&this.close()}applyStyles(){if(document.getElementById("arxis-modal-styles"))return;const e=document.createElement("style");e.id="arxis-modal-styles",e.textContent=`
      .arxis-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: arxis-modal-fade-in 0.2s ease;
        padding: 20px;
      }

      @keyframes arxis-modal-fade-in {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      .arxis-modal {
        background: rgba(20, 20, 20, 0.98);
        backdrop-filter: blur(20px);
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        flex-direction: column;
        max-height: 90vh;
        animation: arxis-modal-slide-up 0.3s ease;
      }

      @keyframes arxis-modal-slide-up {
        from {
          opacity: 0;
          transform: translateY(20px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      /* Sizes */
      .arxis-modal--sm {
        width: 400px;
      }

      .arxis-modal--md {
        width: 600px;
      }

      .arxis-modal--lg {
        width: 800px;
      }

      .arxis-modal--xl {
        width: 1000px;
      }

      .arxis-modal--full {
        width: calc(100vw - 40px);
        height: calc(100vh - 40px);
      }

      /* Header */
      .arxis-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 24px 28px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        gap: 16px;
      }

      .arxis-modal-title-section {
        flex: 1;
      }

      .arxis-modal-title {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
        color: var(--theme-foreground, #fff);
      }

      .arxis-modal-subtitle {
        margin: 6px 0 0 0;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.6);
      }

      .arxis-modal-close {
        background: rgba(255, 255, 255, 0.1);
        border: none;
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 18px;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .arxis-modal-close:hover {
        background: rgba(255, 0, 0, 0.6);
        transform: rotate(90deg);
      }

      /* Body */
      .arxis-modal-body {
        padding: 28px;
        overflow-y: auto;
        flex: 1;
        color: var(--theme-foreground, #fff);
      }

      .arxis-modal-body::-webkit-scrollbar {
        width: 8px;
      }

      .arxis-modal-body::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 4px;
      }

      .arxis-modal-body::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 4px;
      }

      .arxis-modal-body::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.3);
      }

      /* Footer */
      .arxis-modal-footer {
        padding: 20px 28px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(0, 0, 0, 0.2);
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        align-items: center;
      }
    `,document.head.appendChild(e)}open(){this.overlay.style.display="flex",this.isOpen=!0,document.body.style.overflow="hidden",this.props.closeOnEscape&&document.addEventListener("keydown",this.handleEscape),this.props.onOpen&&this.props.onOpen()}close(){this.overlay.style.display="none",this.isOpen=!1,document.body.style.overflow="",this.props.closeOnEscape&&document.removeEventListener("keydown",this.handleEscape),this.props.onClose&&this.props.onClose()}toggle(){this.isOpen?this.close():this.open()}setContent(e){this.body.innerHTML="",typeof e=="string"?this.body.innerHTML=e:this.body.appendChild(e)}appendChild(e){this.body.appendChild(e)}setFooter(e){this.props.footer=e,this.footer&&(this.footer.remove(),this.footer=null),this.footer=this.createFooter(),this.modal.appendChild(this.footer)}getBody(){return this.body}getElement(){return this.modal}isModalOpen(){return this.isOpen}destroy(){this.close(),this.props.closeOnEscape&&document.removeEventListener("keydown",this.handleEscape),this.overlay.remove()}}export{i as M};
