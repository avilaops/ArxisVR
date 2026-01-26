import{C as l}from"./Card-DLSvBshn.js";class c{card;languages=[];currentLanguage="pt-BR";onLanguageChange;constructor(a){this.onLanguageChange=a?.onLanguageChange,this.card=new l({title:"🌍 Idioma",variant:"glass"}),this.loadLanguages(),this.render()}loadLanguages(){this.languages=[{code:"pt-BR",name:"Portuguese (Brazil)",nativeName:"Português (Brasil)",flag:"🇧🇷"},{code:"en-US",name:"English (US)",nativeName:"English (US)",flag:"🇺🇸"},{code:"en-GB",name:"English (UK)",nativeName:"English (UK)",flag:"🇬🇧"},{code:"es-ES",name:"Spanish (Spain)",nativeName:"Español (España)",flag:"🇪🇸"},{code:"es-MX",name:"Spanish (Mexico)",nativeName:"Español (México)",flag:"🇲🇽"},{code:"fr-FR",name:"French",nativeName:"Français",flag:"🇫🇷"},{code:"de-DE",name:"German",nativeName:"Deutsch",flag:"🇩🇪"},{code:"it-IT",name:"Italian",nativeName:"Italiano",flag:"🇮🇹"},{code:"ja-JP",name:"Japanese",nativeName:"日本語",flag:"🇯🇵"},{code:"ko-KR",name:"Korean",nativeName:"한국어",flag:"🇰🇷"},{code:"zh-CN",name:"Chinese (Simplified)",nativeName:"简体中文",flag:"🇨🇳"},{code:"zh-TW",name:"Chinese (Traditional)",nativeName:"繁體中文",flag:"🇹🇼"},{code:"ru-RU",name:"Russian",nativeName:"Русский",flag:"🇷🇺"},{code:"ar-SA",name:"Arabic",nativeName:"العربية",flag:"🇸🇦"}]}render(){const a=this.card.getBody();a.innerHTML="";const e=document.createElement("div");e.className="arxis-lang__current";const n=this.languages.find(r=>r.code===this.currentLanguage);n&&(e.innerHTML=`
        <div class="arxis-lang__current-flag">${n.flag}</div>
        <div class="arxis-lang__current-info">
          <div class="arxis-lang__current-native">${n.nativeName}</div>
          <div class="arxis-lang__current-name">${n.name}</div>
        </div>
      `),a.appendChild(e);const t=document.createElement("div");t.className="arxis-lang__list",this.languages.forEach(r=>{const s=this.createLanguageItem(r);t.appendChild(s)}),a.appendChild(t);const i=document.createElement("div");i.className="arxis-lang__info",i.innerHTML=`
      <div class="arxis-lang__info-icon">ℹ️</div>
      <div class="arxis-lang__info-text">
        A alteração do idioma será aplicada imediatamente e afetará toda a interface.
      </div>
    `,a.appendChild(i),this.injectStyles()}createLanguageItem(a){const e=document.createElement("div");e.className=`arxis-lang__item ${a.code===this.currentLanguage?"arxis-lang__item--active":""}`;const n=document.createElement("div");n.className="arxis-lang__flag",n.textContent=a.flag,e.appendChild(n);const t=document.createElement("div");t.className="arxis-lang__item-info";const i=document.createElement("div");i.className="arxis-lang__native",i.textContent=a.nativeName;const r=document.createElement("div");if(r.className="arxis-lang__name",r.textContent=a.name,t.appendChild(i),t.appendChild(r),e.appendChild(t),a.code===this.currentLanguage){const s=document.createElement("div");s.className="arxis-lang__check",s.textContent="✓",e.appendChild(s)}return e.addEventListener("click",()=>this.selectLanguage(a.code)),e}selectLanguage(a){this.currentLanguage=a,this.onLanguageChange?.(a),this.render(),console.log("Idioma alterado para:",a)}getCurrentLanguage(){return this.currentLanguage}getElement(){return this.card.getElement()}destroy(){this.card.destroy()}injectStyles(){if(document.getElementById("arxis-lang-styles"))return;const a=document.createElement("style");a.id="arxis-lang-styles",a.textContent=`
      .arxis-lang__current {
        display: flex;
        gap: 16px;
        align-items: center;
        padding: 20px;
        background: rgba(0, 212, 255, 0.1);
        border-radius: 12px;
        margin-bottom: 20px;
      }

      .arxis-lang__current-flag {
        font-size: 48px;
        line-height: 1;
      }

      .arxis-lang__current-info {
        flex: 1;
      }

      .arxis-lang__current-native {
        font-size: 20px;
        font-weight: 700;
        color: #fff;
        margin-bottom: 4px;
      }

      .arxis-lang__current-name {
        font-size: 13px;
        color: rgba(255, 255, 255, 0.6);
      }

      .arxis-lang__list {
        max-height: 400px;
        overflow-y: auto;
        margin-bottom: 16px;
      }

      .arxis-lang__item {
        display: flex;
        gap: 12px;
        align-items: center;
        padding: 12px;
        background: rgba(255, 255, 255, 0.04);
        border-radius: 8px;
        margin-bottom: 8px;
        cursor: pointer;
        transition: all 0.2s;
        border: 2px solid transparent;
      }

      .arxis-lang__item:hover {
        background: rgba(255, 255, 255, 0.08);
        transform: translateX(3px);
      }

      .arxis-lang__item--active {
        background: rgba(0, 212, 255, 0.15);
        border-color: #00d4ff;
      }

      .arxis-lang__flag {
        font-size: 32px;
        line-height: 1;
        width: 40px;
        text-align: center;
      }

      .arxis-lang__item-info {
        flex: 1;
        min-width: 0;
      }

      .arxis-lang__native {
        font-size: 15px;
        font-weight: 600;
        color: #fff;
        margin-bottom: 2px;
      }

      .arxis-lang__name {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
      }

      .arxis-lang__check {
        font-size: 20px;
        color: #00d4ff;
        font-weight: bold;
      }

      .arxis-lang__info {
        display: flex;
        gap: 12px;
        padding: 12px;
        background: rgba(255, 170, 0, 0.1);
        border-left: 3px solid #ffaa00;
        border-radius: 6px;
      }

      .arxis-lang__info-icon {
        font-size: 20px;
        flex-shrink: 0;
      }

      .arxis-lang__info-text {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.8);
        line-height: 1.5;
      }
    `,document.head.appendChild(a)}}export{c as LanguageSelector};
