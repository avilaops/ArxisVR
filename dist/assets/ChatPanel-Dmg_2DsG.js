import{C as l}from"./Card-DLSvBshn.js";import{B as m}from"./Button-BvNVdej2.js";class u{card;messages=[];currentUser;onMessageSend;messagesContainer;inputElement;constructor(e){this.currentUser=e?.currentUser||{id:"user-1",name:"Você",status:"online"},this.onMessageSend=e?.onMessageSend,this.card=new l({title:"💬 Chat",variant:"glass"}),this.loadMockMessages(),this.render()}loadMockMessages(){const e=Date.now();this.messages=[{id:"msg-1",userId:"user-2",userName:"João Silva",message:"Olá! Alguém pode verificar a estrutura do pavimento 3?",timestamp:e-3e5,type:"text"},{id:"msg-2",userId:"user-3",userName:"Maria Santos",message:"Eu verifico, pode deixar!",timestamp:e-24e4,type:"text"},{id:"msg-3",userId:"system",userName:"Sistema",message:"João Silva marcou um ponto de atenção",timestamp:e-18e4,type:"system"},{id:"msg-4",userId:"user-3",userName:"Maria Santos",message:"Encontrei um problema de interferência",timestamp:e-12e4,type:"text"}]}render(){const e=this.card.getBody();e.innerHTML="",e.style.cssText="display: flex; flex-direction: column; height: 500px; padding: 0;",this.messagesContainer=document.createElement("div"),this.messagesContainer.className="arxis-chat__messages",this.renderMessages(),e.appendChild(this.messagesContainer);const t=document.createElement("div");t.className="arxis-chat__input-area";const s=document.createElement("div");s.className="arxis-chat__input-wrapper",this.inputElement=document.createElement("input"),this.inputElement.type="text",this.inputElement.className="arxis-chat__input",this.inputElement.placeholder="Digite uma mensagem...",this.inputElement.addEventListener("keydown",n=>{n.key==="Enter"&&this.inputElement?.value.trim()&&this.sendMessage(this.inputElement.value)});const a=new m({text:"📤",variant:"primary",size:"sm"});a.getElement().addEventListener("click",()=>{this.inputElement?.value.trim()&&this.sendMessage(this.inputElement.value)});const i=new m({text:"📎",variant:"secondary",size:"sm"});i.getElement().addEventListener("click",()=>this.attachFile()),s.appendChild(this.inputElement),s.appendChild(i.getElement()),s.appendChild(a.getElement()),t.appendChild(s),e.appendChild(t),this.injectStyles()}renderMessages(){this.messagesContainer&&(this.messagesContainer.innerHTML="",this.messages.forEach(e=>{const t=this.createMessageElement(e);this.messagesContainer.appendChild(t)}),setTimeout(()=>{this.messagesContainer&&(this.messagesContainer.scrollTop=this.messagesContainer.scrollHeight)},0))}createMessageElement(e){const t=document.createElement("div");if(t.className="arxis-chat__message",e.type==="system")return t.classList.add("arxis-chat__message--system"),t.innerHTML=`
        <div class="arxis-chat__system-text">${e.message}</div>
      `,t;const s=e.userId===this.currentUser.id;s&&t.classList.add("arxis-chat__message--own");const a=document.createElement("div");a.className="arxis-chat__avatar",a.textContent=e.avatar||e.userName.charAt(0);const i=document.createElement("div");i.className="arxis-chat__content";const n=document.createElement("div");n.className="arxis-chat__header";const r=document.createElement("span");r.className="arxis-chat__username",r.textContent=e.userName;const o=document.createElement("span");o.className="arxis-chat__time",o.textContent=this.formatTime(e.timestamp),n.appendChild(r),n.appendChild(o);const d=document.createElement("div");if(d.className="arxis-chat__text",d.textContent=e.message,i.appendChild(n),i.appendChild(d),e.type==="file"&&e.fileName){const c=document.createElement("div");c.className="arxis-chat__file",c.innerHTML=`📎 ${e.fileName}`,i.appendChild(c)}return s||t.appendChild(a),t.appendChild(i),s&&t.appendChild(a),t}formatTime(e){const t=new Date(e),s=new Date;return t.toDateString()===s.toDateString()?t.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}):t.toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"})}sendMessage(e){const t={id:`msg-${Date.now()}`,userId:this.currentUser.id,userName:this.currentUser.name,message:e,timestamp:Date.now(),type:"text"};this.messages.push(t),this.renderMessages(),this.inputElement&&(this.inputElement.value=""),this.onMessageSend?.(e)}attachFile(){const e=document.createElement("input");e.type="file",e.accept=".ifc,.rvt,.dwg,.pdf,.jpg,.png",e.addEventListener("change",t=>{const s=t.target.files?.[0];if(s){const a={id:`msg-${Date.now()}`,userId:this.currentUser.id,userName:this.currentUser.name,message:"Enviou um arquivo",timestamp:Date.now(),type:"file",fileName:s.name};this.messages.push(a),this.renderMessages()}}),e.click()}addMessage(e){this.messages.push(e),this.renderMessages()}getMessages(){return this.messages}clearMessages(){this.messages=[],this.renderMessages()}getElement(){return this.card.getElement()}destroy(){this.card.destroy()}injectStyles(){if(document.getElementById("arxis-chat-styles"))return;const e=document.createElement("style");e.id="arxis-chat-styles",e.textContent=`
      .arxis-chat__messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .arxis-chat__message {
        display: flex;
        gap: 8px;
        align-items: flex-start;
        animation: slideIn 0.2s;
      }

      .arxis-chat__message--own {
        flex-direction: row-reverse;
      }

      .arxis-chat__message--system {
        justify-content: center;
      }

      .arxis-chat__system-text {
        padding: 6px 12px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
        text-align: center;
      }

      .arxis-chat__avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: linear-gradient(135deg, #00d4ff, #7b2ff7);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 14px;
        font-weight: 600;
        flex-shrink: 0;
      }

      .arxis-chat__content {
        max-width: 70%;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .arxis-chat__message--own .arxis-chat__content {
        align-items: flex-end;
      }

      .arxis-chat__header {
        display: flex;
        gap: 8px;
        align-items: center;
        font-size: 12px;
      }

      .arxis-chat__username {
        color: rgba(255, 255, 255, 0.9);
        font-weight: 500;
      }

      .arxis-chat__time {
        color: rgba(255, 255, 255, 0.5);
      }

      .arxis-chat__text {
        padding: 10px 14px;
        background: rgba(255, 255, 255, 0.08);
        border-radius: 12px;
        color: #fff;
        font-size: 14px;
        line-height: 1.4;
        word-wrap: break-word;
      }

      .arxis-chat__message--own .arxis-chat__text {
        background: rgba(0, 212, 255, 0.2);
      }

      .arxis-chat__file {
        padding: 8px 12px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.8);
        cursor: pointer;
        transition: all 0.2s;
      }

      .arxis-chat__file:hover {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.2);
      }

      .arxis-chat__input-area {
        padding: 12px 16px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(0, 0, 0, 0.2);
      }

      .arxis-chat__input-wrapper {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .arxis-chat__input {
        flex: 1;
        padding: 10px 14px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        color: #fff;
        font-size: 14px;
        outline: none;
        transition: all 0.2s;
      }

      .arxis-chat__input:focus {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(0, 212, 255, 0.5);
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,document.head.appendChild(e)}}export{u as ChatPanel};
