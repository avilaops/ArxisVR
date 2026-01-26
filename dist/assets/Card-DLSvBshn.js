class i{container;header=null;body;footer=null;props;constructor(e={}){this.props={variant:"default",padding:"md",...e},this.container=this.createCard(),this.body=this.createBody(),this.applyStyles()}createCard(){const e=document.createElement("div");return e.className=this.getCardClasses(),(this.props.title||this.props.headerActions)&&(this.header=this.createHeader(),e.appendChild(this.header)),this.props.onClick&&(e.style.cursor="pointer",e.addEventListener("click",this.props.onClick)),e}createHeader(){const e=document.createElement("div");e.className="arxis-card-header";const t=document.createElement("div");if(t.className="arxis-card-title-section",this.props.title){const r=document.createElement("h3");r.className="arxis-card-title",r.textContent=this.props.title,t.appendChild(r)}if(this.props.subtitle){const r=document.createElement("p");r.className="arxis-card-subtitle",r.textContent=this.props.subtitle,t.appendChild(r)}if(e.appendChild(t),this.props.headerActions&&this.props.headerActions.length>0){const r=document.createElement("div");r.className="arxis-card-header-actions",this.props.headerActions.forEach(a=>{r.appendChild(a)}),e.appendChild(r)}return e}createBody(){const e=document.createElement("div");return e.className="arxis-card-body",this.container.appendChild(e),e}createFooter(){const e=document.createElement("div");return e.className="arxis-card-footer",typeof this.props.footer=="string"?e.textContent=this.props.footer:this.props.footer instanceof HTMLElement&&e.appendChild(this.props.footer),e}getCardClasses(){const e=["arxis-card"];return this.props.variant&&e.push(`arxis-card--${this.props.variant}`),this.props.padding&&e.push(`arxis-card--padding-${this.props.padding}`),this.props.hoverable&&e.push("arxis-card--hoverable"),this.props.clickable&&e.push("arxis-card--clickable"),this.props.fullWidth&&e.push("arxis-card--full"),this.props.className&&e.push(this.props.className),e.join(" ")}applyStyles(){if(document.getElementById("arxis-card-styles"))return;const e=document.createElement("style");e.id="arxis-card-styles",e.textContent=`
      .arxis-card {
        background: rgba(30, 30, 30, 0.95);
        border-radius: 8px;
        transition: all 0.3s ease;
        overflow: hidden;
      }

      .arxis-card--full {
        width: 100%;
      }

      /* Variants */
      .arxis-card--default {
        background: rgba(30, 30, 30, 0.95);
      }

      .arxis-card--bordered {
        background: rgba(30, 30, 30, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .arxis-card--elevated {
        background: rgba(30, 30, 30, 0.95);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
      }

      .arxis-card--glass {
        background: rgba(30, 30, 30, 0.7);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      /* Hoverable */
      .arxis-card--hoverable:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
      }

      .arxis-card--clickable {
        cursor: pointer;
      }

      .arxis-card--clickable:active {
        transform: scale(0.98);
      }

      /* Header */
      .arxis-card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        gap: 16px;
      }

      .arxis-card-title-section {
        flex: 1;
      }

      .arxis-card-title {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: var(--theme-foreground, #fff);
      }

      .arxis-card-subtitle {
        margin: 4px 0 0 0;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.6);
      }

      .arxis-card-header-actions {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      /* Body */
      .arxis-card-body {
        color: var(--theme-foreground, #fff);
      }

      .arxis-card--padding-none .arxis-card-body {
        padding: 0;
      }

      .arxis-card--padding-sm .arxis-card-body {
        padding: 12px;
      }

      .arxis-card--padding-md .arxis-card-body {
        padding: 20px;
      }

      .arxis-card--padding-lg .arxis-card-body {
        padding: 28px;
      }

      /* Footer */
      .arxis-card-footer {
        padding: 16px 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(0, 0, 0, 0.2);
        font-size: 13px;
        color: rgba(255, 255, 255, 0.7);
      }
    `,document.head.appendChild(e)}setContent(e){this.body.innerHTML="",typeof e=="string"?this.body.innerHTML=e:this.body.appendChild(e)}appendChild(e){this.body.appendChild(e)}setFooter(e){this.props.footer=e,this.footer&&(this.footer.remove(),this.footer=null),this.footer=this.createFooter(),this.container.appendChild(this.footer)}getBody(){return this.body}getElement(){return this.container}destroy(){this.props.onClick&&this.container.removeEventListener("click",this.props.onClick),this.container.remove()}}export{i as C};
