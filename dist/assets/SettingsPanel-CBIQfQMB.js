import{C as c}from"./Card-DLSvBshn.js";import{T as o}from"./Toggle-D3VS2hV5.js";import{S as d}from"./Slider-DjmBSdi5.js";import{S as r}from"./Select-D01wDXMy.js";import{B as m}from"./Button-BvNVdej2.js";import{e as h,E as u}from"./index-BuRPltC2.js";class E{container;settings;constructor(){this.settings=this.loadSettings(),this.container=this.createContainer(),this.applyStyles()}loadSettings(){const e=localStorage.getItem("arxis-settings");return e?JSON.parse(e):{theme:"dark",quality:"high",antialiasing:!0,shadows:!0,ambientOcclusion:!1,fps_limit:60,lod_enabled:!0,frustum_culling:!0,mouse_sensitivity:50,invert_y:!1,fly_speed:10,length_unit:"m",area_unit:"m²",volume_unit:"m³"}}saveSettings(){localStorage.setItem("arxis-settings",JSON.stringify(this.settings)),h.emit(u.SETTINGS_CHANGED,{settings:this.settings}),console.log("Settings saved:",this.settings)}createContainer(){const e=document.createElement("div");e.className="settings-panel";const t=document.createElement("div");t.className="settings-panel-header";const a=document.createElement("h3");a.textContent="⚙️ Configurações",t.appendChild(a);const i=new m({text:"Resetar",icon:"🔄",variant:"secondary",size:"sm",onClick:()=>this.resetSettings()});t.appendChild(i.getElement()),e.appendChild(t);const n=this.createTabs();e.appendChild(n);const s=document.createElement("div");return s.className="settings-content",s.appendChild(this.createVisualSettings()),s.appendChild(this.createPerformanceSettings()),s.appendChild(this.createNavigationSettings()),s.appendChild(this.createUnitsSettings()),e.appendChild(s),e}createTabs(){const e=document.createElement("div");return e.className="settings-tabs",["🎨 Visual","⚡ Performance","🎮 Navegação","📐 Unidades"].forEach((a,i)=>{const n=document.createElement("button");n.className="settings-tab",n.textContent=a,i===0&&n.classList.add("active"),n.onclick=()=>this.switchTab(i),e.appendChild(n)}),e}switchTab(e){this.container.querySelectorAll(".settings-tab").forEach((i,n)=>{i.classList.toggle("active",n===e)}),this.container.querySelectorAll(".settings-section").forEach((i,n)=>{i.style.display=n===e?"block":"none"})}createVisualSettings(){const e=document.createElement("div");e.className="settings-section";const t=new c({title:"Qualidade Visual",padding:"md"}),a=new r({label:"Tema",options:[{value:"dark",label:"Escuro",icon:"🌙"},{value:"light",label:"Claro",icon:"☀️"}],value:this.settings.theme,fullWidth:!0,onChange:l=>{this.settings.theme=l,this.saveSettings()}});t.appendChild(a.getElement());const i=new r({label:"Preset de Qualidade",options:[{value:"low",label:"Baixa"},{value:"medium",label:"Média"},{value:"high",label:"Alta"},{value:"ultra",label:"Ultra"}],value:this.settings.quality,fullWidth:!0,onChange:l=>{this.settings.quality=l,this.saveSettings()}});t.appendChild(i.getElement());const n=new o({label:"Antialiasing",checked:this.settings.antialiasing,onChange:l=>{this.settings.antialiasing=l,this.saveSettings()}});t.appendChild(n.getElement());const s=new o({label:"Sombras",checked:this.settings.shadows,onChange:l=>{this.settings.shadows=l,this.saveSettings()}});t.appendChild(s.getElement());const g=new o({label:"Ambient Occlusion",checked:this.settings.ambientOcclusion,onChange:l=>{this.settings.ambientOcclusion=l,this.saveSettings()}});return t.appendChild(g.getElement()),e.appendChild(t.getElement()),e}createPerformanceSettings(){const e=document.createElement("div");e.className="settings-section",e.style.display="none";const t=new c({title:"Performance",padding:"md"}),a=new d({label:"Limite de FPS",min:30,max:144,step:1,value:this.settings.fps_limit,showValue:!0,onChange:s=>{this.settings.fps_limit=s,this.saveSettings()}});t.appendChild(a.getElement());const i=new o({label:"Level of Detail (LOD)",checked:this.settings.lod_enabled,onChange:s=>{this.settings.lod_enabled=s,this.saveSettings()}});t.appendChild(i.getElement());const n=new o({label:"Frustum Culling",checked:this.settings.frustum_culling,onChange:s=>{this.settings.frustum_culling=s,this.saveSettings()}});return t.appendChild(n.getElement()),e.appendChild(t.getElement()),e}createNavigationSettings(){const e=document.createElement("div");e.className="settings-section",e.style.display="none";const t=new c({title:"Controles",padding:"md"}),a=new d({label:"Sensibilidade do Mouse",min:1,max:100,step:1,value:this.settings.mouse_sensitivity,showValue:!0,unit:"%",onChange:s=>{this.settings.mouse_sensitivity=s,this.saveSettings()}});t.appendChild(a.getElement());const i=new o({label:"Inverter Eixo Y",checked:this.settings.invert_y,onChange:s=>{this.settings.invert_y=s,this.saveSettings()}});t.appendChild(i.getElement());const n=new d({label:"Velocidade de Voo",min:1,max:50,step:1,value:this.settings.fly_speed,showValue:!0,unit:"m/s",onChange:s=>{this.settings.fly_speed=s,this.saveSettings()}});return t.appendChild(n.getElement()),e.appendChild(t.getElement()),e}createUnitsSettings(){const e=document.createElement("div");e.className="settings-section",e.style.display="none";const t=new c({title:"Unidades de Medida",padding:"md"}),a=new r({label:"Comprimento",options:[{value:"mm",label:"Milímetros (mm)"},{value:"cm",label:"Centímetros (cm)"},{value:"m",label:"Metros (m)"},{value:"km",label:"Quilômetros (km)"}],value:this.settings.length_unit,fullWidth:!0,onChange:s=>{this.settings.length_unit=s,this.saveSettings()}});t.appendChild(a.getElement());const i=new r({label:"Área",options:[{value:"m²",label:"Metros quadrados (m²)"},{value:"cm²",label:"Centímetros quadrados (cm²)"},{value:"ha",label:"Hectares (ha)"}],value:this.settings.area_unit,fullWidth:!0,onChange:s=>{this.settings.area_unit=s,this.saveSettings()}});t.appendChild(i.getElement());const n=new r({label:"Volume",options:[{value:"m³",label:"Metros cúbicos (m³)"},{value:"cm³",label:"Centímetros cúbicos (cm³)"},{value:"L",label:"Litros (L)"}],value:this.settings.volume_unit,fullWidth:!0,onChange:s=>{this.settings.volume_unit=s,this.saveSettings()}});return t.appendChild(n.getElement()),e.appendChild(t.getElement()),e}resetSettings(){confirm("Deseja restaurar as configurações padrão?")&&(localStorage.removeItem("arxis-settings"),location.reload())}applyStyles(){if(document.getElementById("settings-panel-styles"))return;const e=document.createElement("style");e.id="settings-panel-styles",e.textContent=`
      .settings-panel {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .settings-panel-header {
        padding: 16px;
        background: rgba(0, 0, 0, 0.3);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .settings-panel-header h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: var(--theme-foreground, #fff);
      }

      .settings-tabs {
        display: flex;
        background: rgba(0, 0, 0, 0.2);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .settings-tab {
        flex: 1;
        padding: 12px;
        background: transparent;
        border: none;
        color: rgba(255, 255, 255, 0.6);
        font-size: 13px;
        cursor: pointer;
        transition: all 0.2s;
        border-bottom: 3px solid transparent;
      }

      .settings-tab:hover {
        background: rgba(255, 255, 255, 0.05);
        color: var(--theme-foreground, #fff);
      }

      .settings-tab.active {
        color: var(--theme-accent, #00ff88);
        border-bottom-color: var(--theme-accent, #00ff88);
        background: rgba(0, 255, 136, 0.1);
      }

      .settings-content {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
      }

      .settings-section {
        animation: settings-fade-in 0.3s ease;
      }

      @keyframes settings-fade-in {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,document.head.appendChild(e)}getElement(){return this.container}getSettings(){return{...this.settings}}destroy(){this.container.remove()}}export{E as SettingsPanel};
