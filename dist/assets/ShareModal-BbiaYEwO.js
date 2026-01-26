import{M as u}from"./Modal-C4dtqQB0.js";import{B as l}from"./Button-BvNVdej2.js";import{I as p}from"./Input-vZvnrYWf.js";import{T as g}from"./Toggle-D3VS2hV5.js";import{S as h}from"./Select-D01wDXMy.js";class v{modal;shareLink="";embedCode="";settings;constructor(){this.settings={allowComments:!0,allowMeasurements:!0,allowDownload:!1,expiresIn:30,password:"",accessLevel:"private"},this.modal=new u({title:"🔗 Compartilhar Projeto",size:"md",closeOnEscape:!0}),this.generateShareLink(),this.buildUI(),this.applyStyles()}generateShareLink(){const e=Math.random().toString(36).substring(2,10),a=window.location.origin;this.shareLink=`${a}/view/${e}`,this.embedCode=`<iframe 
  src="${this.shareLink}?embed=true" 
  width="800" 
  height="600" 
  frameborder="0" 
  allowfullscreen>
</iframe>`}buildUI(){const e=document.createElement("div");e.className="share-modal";const a=this.createTabs();e.appendChild(a);const t=this.createLinkTab(),s=this.createEmbedTab(),n=this.createSettingsTab();t.classList.add("share-tab--active"),e.appendChild(t),e.appendChild(s),e.appendChild(n),this.modal.setContent(e)}createTabs(){const e=document.createElement("div");return e.className="share-tabs",[{id:"link",label:"🔗 Link",icon:"🔗"},{id:"embed",label:"📦 Embed",icon:"📦"},{id:"settings",label:"⚙️ Configurações",icon:"⚙️"}].forEach((t,s)=>{const i=new l({label:t.label,variant:s===0?"primary":"ghost",size:"sm",onClick:()=>this.switchTab(t.id)}).getElement();i.setAttribute("data-tab",t.id),e.appendChild(i)}),e}switchTab(e){this.modal.getElement().querySelectorAll("[data-tab]").forEach(s=>{s.getAttribute("data-tab")===e?(s.classList.add("arxis-btn--primary"),s.classList.remove("arxis-btn--ghost")):(s.classList.add("arxis-btn--ghost"),s.classList.remove("arxis-btn--primary"))}),this.modal.getElement().querySelectorAll(".share-tab").forEach(s=>{const n=s.getAttribute("data-tab-content");s.classList.toggle("share-tab--active",n===e)})}createLinkTab(){const e=document.createElement("div");e.className="share-tab",e.setAttribute("data-tab-content","link");const a=document.createElement("p");a.className="share-description",a.textContent="Compartilhe este link para visualização do projeto:",e.appendChild(a);const t=document.createElement("div");t.className="share-link-container";const s=new p({value:this.shareLink,fullWidth:!0,readonly:!0}),n=new l({label:"📋",variant:"primary",onClick:()=>this.copyToClipboard(this.shareLink,"Link copiado!")});t.appendChild(s.getElement()),t.appendChild(n.getElement()),e.appendChild(t);const i=document.createElement("div");i.className="share-quick-buttons",[{label:"Email",icon:"📧",action:()=>this.shareViaEmail()},{label:"WhatsApp",icon:"💬",action:()=>this.shareViaWhatsApp()},{label:"Teams",icon:"👥",action:()=>this.shareViaTeams()},{label:"Slack",icon:"💼",action:()=>this.shareViaSlack()}].forEach(r=>{const d=new l({label:`${r.icon} ${r.label}`,variant:"ghost",size:"sm",onClick:r.action});i.appendChild(d.getElement())}),e.appendChild(i);const o=document.createElement("div");return o.className="share-qr-section",o.innerHTML=`
      <div class="share-qr-title">QR Code</div>
      <div class="share-qr-code">
        <div class="share-qr-placeholder">📱</div>
        <div class="share-qr-text">Escaneie para visualizar</div>
      </div>
    `,e.appendChild(o),e}createEmbedTab(){const e=document.createElement("div");e.className="share-tab",e.setAttribute("data-tab-content","embed");const a=document.createElement("p");a.className="share-description",a.textContent="Incorpore o visualizador em seu site:",e.appendChild(a);const t=document.createElement("div");t.className="share-code-container";const s=document.createElement("textarea");s.className="share-code-textarea",s.value=this.embedCode,s.readOnly=!0,t.appendChild(s);const n=new l({label:"📋 Copiar Código",variant:"primary",fullWidth:!0,onClick:()=>this.copyToClipboard(this.embedCode,"Código copiado!")});t.appendChild(n.getElement()),e.appendChild(t);const i=document.createElement("div");return i.className="share-preview-section",i.innerHTML=`
      <div class="share-preview-title">Preview</div>
      <div class="share-preview-frame">
        <div class="share-preview-mockup">
          <div class="share-preview-header"></div>
          <div class="share-preview-content">🏗️ Visualizador BIM</div>
        </div>
      </div>
    `,e.appendChild(i),e}createSettingsTab(){const e=document.createElement("div");e.className="share-tab",e.setAttribute("data-tab-content","settings");const a=document.createElement("p");a.className="share-description",a.textContent="Configure as permissões de visualização:",e.appendChild(a);const t=new h({label:"Nível de Acesso",options:[{value:"public",label:"🌐 Público - Qualquer pessoa com o link"},{value:"private",label:"🔒 Privado - Apenas usuários autorizados"},{value:"restricted",label:"🔐 Restrito - Requer senha"}],value:this.settings.accessLevel,onChange:o=>{this.settings.accessLevel=o}});e.appendChild(t.getElement());const s=new h({label:"Expiração do Link",options:[{value:"1",label:"1 dia"},{value:"7",label:"7 dias"},{value:"30",label:"30 dias"},{value:"90",label:"90 dias"},{value:"0",label:"Nunca expira"}],value:this.settings.expiresIn.toString(),onChange:o=>{this.settings.expiresIn=parseInt(o)}});e.appendChild(s.getElement());const n=new p({label:"Senha (opcional)",type:"password",placeholder:"Digite uma senha",fullWidth:!0,onChange:o=>{this.settings.password=o}});e.appendChild(n.getElement());const i=document.createElement("div");return i.className="share-section-title",i.textContent="Permissões",e.appendChild(i),[{key:"allowComments",label:"Permitir comentários"},{key:"allowMeasurements",label:"Permitir medições"},{key:"allowDownload",label:"Permitir download"}].forEach(({key:o,label:r})=>{const d=new g({label:r,checked:this.settings[o],onChange:b=>{this.settings[o]=b}});e.appendChild(d.getElement())}),e}copyToClipboard(e,a){navigator.clipboard.writeText(e).then(()=>{console.log(`✅ ${a}`);const t=document.createElement("div");t.className="share-notification",t.textContent=a,document.body.appendChild(t),setTimeout(()=>t.remove(),2e3)})}shareViaEmail(){const e=encodeURIComponent("Visualize este projeto BIM"),a=encodeURIComponent(`Confira este projeto: ${this.shareLink}`);window.open(`mailto:?subject=${e}&body=${a}`)}shareViaWhatsApp(){const e=encodeURIComponent(`Visualize este projeto BIM: ${this.shareLink}`);window.open(`https://wa.me/?text=${e}`)}shareViaTeams(){const e=encodeURIComponent(this.shareLink);window.open(`https://teams.microsoft.com/share?url=${e}`)}shareViaSlack(){const e=encodeURIComponent(this.shareLink);window.open(`https://slack.com/intl/pt-br/share?url=${e}`)}open(){this.modal.open()}applyStyles(){if(document.getElementById("share-modal-styles"))return;const e=document.createElement("style");e.id="share-modal-styles",e.textContent=`
      .share-modal {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .share-tabs {
        display: flex;
        gap: 8px;
        padding-bottom: 12px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .share-tab {
        display: none;
        flex-direction: column;
        gap: 16px;
      }

      .share-tab--active {
        display: flex;
      }

      .share-description {
        font-size: 13px;
        color: rgba(255, 255, 255, 0.7);
        margin: 0;
      }

      .share-link-container {
        display: flex;
        gap: 8px;
      }

      .share-link-container .arxis-input-container {
        flex: 1;
      }

      .share-quick-buttons {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
      }

      .share-qr-section {
        margin-top: 8px;
      }

      .share-qr-title {
        font-size: 13px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.8);
        margin-bottom: 12px;
      }

      .share-qr-code {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 24px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        border: 2px dashed rgba(255, 255, 255, 0.2);
      }

      .share-qr-placeholder {
        font-size: 64px;
        margin-bottom: 8px;
      }

      .share-qr-text {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
      }

      .share-code-container {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .share-code-textarea {
        width: 100%;
        height: 120px;
        padding: 12px;
        background: rgba(20, 20, 20, 0.9);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 6px;
        color: var(--theme-accent, #00ff88);
        font-family: 'Courier New', monospace;
        font-size: 11px;
        resize: vertical;
      }

      .share-preview-section {
        margin-top: 8px;
      }

      .share-preview-title {
        font-size: 13px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.8);
        margin-bottom: 12px;
      }

      .share-preview-frame {
        padding: 16px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
      }

      .share-preview-mockup {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        overflow: hidden;
      }

      .share-preview-header {
        height: 30px;
        background: rgba(255, 255, 255, 0.05);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .share-preview-content {
        padding: 40px;
        text-align: center;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.6);
      }

      .share-section-title {
        font-size: 14px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.9);
        margin-top: 8px;
      }

      .share-notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 12px 24px;
        background: rgba(0, 255, 136, 0.9);
        color: #000;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 600;
        z-index: 10001;
        animation: share-notification-show 0.3s ease;
      }

      @keyframes share-notification-show {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,document.head.appendChild(e)}destroy(){this.modal.destroy()}}function E(){const c=new v;return c.open(),c}export{v as ShareModal,E as openShareModal};
