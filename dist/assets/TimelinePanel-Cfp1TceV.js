import{C as x}from"./Card-DLSvBshn.js";import{B as h}from"./Button-BvNVdej2.js";import{S as y}from"./Select-D01wDXMy.js";class T{card;tasks=[];currentDate=new Date;isPlaying=!1;playbackSpeed=1;animationFrame=null;timelineCanvas;ctx;constructor(){this.card=new x({title:"⏱️ Timeline (4D)",collapsible:!0}),this.timelineCanvas=document.createElement("canvas"),this.timelineCanvas.width=800,this.timelineCanvas.height=400,this.ctx=this.timelineCanvas.getContext("2d"),this.loadMockTasks(),this.buildUI(),this.applyStyles(),this.renderTimeline()}loadMockTasks(){const e=new Date("2025-01-01");this.tasks=[{id:"1",name:"Fundação",startDate:new Date(e.getTime()),endDate:new Date(e.getTime()+360*60*60*1e3),duration:15,progress:100,dependencies:[],elementIds:["foundation-1","foundation-2"],color:"#8B4513",status:"completed"},{id:"2",name:"Estrutura",startDate:new Date(e.getTime()+360*60*60*1e3),endDate:new Date(e.getTime()+1080*60*60*1e3),duration:30,progress:65,dependencies:["1"],elementIds:["column-1","column-2","beam-1"],color:"#708090",status:"in-progress"},{id:"3",name:"Alvenaria",startDate:new Date(e.getTime()+1080*60*60*1e3),endDate:new Date(e.getTime()+1560*60*60*1e3),duration:20,progress:0,dependencies:["2"],elementIds:["wall-1","wall-2"],color:"#CD853F",status:"not-started"},{id:"4",name:"Instalações",startDate:new Date(e.getTime()+1200*60*60*1e3),endDate:new Date(e.getTime()+1680*60*60*1e3),duration:20,progress:0,dependencies:["2"],elementIds:["pipe-1","electrical-1"],color:"#4169E1",status:"not-started"},{id:"5",name:"Acabamento",startDate:new Date(e.getTime()+1560*60*60*1e3),endDate:new Date(e.getTime()+2040*60*60*1e3),duration:20,progress:0,dependencies:["3","4"],elementIds:["floor-1","ceiling-1"],color:"#32CD32",status:"not-started"}],this.currentDate=this.tasks[1].startDate}buildUI(){const e=document.createElement("div");e.className="timeline-panel";const n=this.createControls();e.appendChild(n),this.timelineCanvas.className="timeline-canvas",e.appendChild(this.timelineCanvas);const a=this.createTaskList();e.appendChild(a);const i=this.createStats();e.appendChild(i),this.card.setBody(e)}createControls(){const e=document.createElement("div");e.className="timeline-controls";const n=document.createElement("div");n.className="timeline-date",n.textContent=this.formatDate(this.currentDate),e.appendChild(n);const a=document.createElement("div");a.className="timeline-playback";const i=new h({label:"⏮️",size:"sm",variant:"ghost",onClick:()=>this.skipToStart()}),d=new h({label:"⏪",size:"sm",variant:"ghost",onClick:()=>this.previousDay()}),r=new h({label:this.isPlaying?"⏸️":"▶️",size:"sm",variant:"primary",onClick:()=>this.togglePlayback()}),t=new h({label:"⏩",size:"sm",variant:"ghost",onClick:()=>this.nextDay()}),s=new h({label:"⏭️",size:"sm",variant:"ghost",onClick:()=>this.skipToEnd()});a.appendChild(i.getElement()),a.appendChild(d.getElement()),a.appendChild(r.getElement()),a.appendChild(t.getElement()),a.appendChild(s.getElement()),e.appendChild(a);const l=document.createElement("div");l.className="timeline-speed";const c=document.createElement("span");c.textContent="Velocidade:",l.appendChild(c);const o=new y({options:[{value:"0.5",label:"0.5x"},{value:"1",label:"1x"},{value:"2",label:"2x"},{value:"5",label:"5x"},{value:"10",label:"10x"}],value:"1",onChange:g=>{this.playbackSpeed=parseFloat(g)}});return l.appendChild(o.getElement()),e.appendChild(l),e}renderTimeline(){const e=this.ctx,n=this.timelineCanvas.width,a=this.timelineCanvas.height;e.fillStyle="rgba(20, 20, 20, 0.95)",e.fillRect(0,0,n,a);const i=Math.min(...this.tasks.map(o=>o.startDate.getTime())),r=Math.max(...this.tasks.map(o=>o.endDate.getTime()))-i,t=50,s=30,l=10;this.tasks.forEach((o,g)=>{const m=t+g*(s+l),p=t+(o.startDate.getTime()-i)/r*(n-2*t),f=t+(o.endDate.getTime()-i)/r*(n-2*t),u=f-p;e.fillStyle=o.color,e.globalAlpha=.3,e.fillRect(p,m,u,s),e.globalAlpha=1,e.fillRect(p,m,u*(o.progress/100),s),e.strokeStyle=o.color,e.lineWidth=2,e.strokeRect(p,m,u,s),e.fillStyle="#fff",e.font="12px Arial",e.fillText(o.name,p+5,m+20);const D=this.getStatusIcon(o.status);e.fillText(D,f+10,m+20)});const c=t+(this.currentDate.getTime()-i)/r*(n-2*t);e.strokeStyle="#00ff88",e.lineWidth=2,e.beginPath(),e.moveTo(c,t),e.lineTo(c,a-t),e.stroke(),e.fillStyle="#00ff88",e.font="bold 12px Arial",e.fillText(this.formatDate(this.currentDate),c+5,t-10),e.globalAlpha=1}createTaskList(){const e=document.createElement("div");e.className="timeline-task-list";const n=document.createElement("div");return n.className="timeline-task-list-header",n.textContent="Tarefas",e.appendChild(n),this.tasks.forEach(a=>{const i=document.createElement("div");i.className="timeline-task-item";const d=document.createElement("div");d.className="timeline-task-color",d.style.background=a.color,i.appendChild(d);const r=document.createElement("div");r.className="timeline-task-info";const t=document.createElement("div");t.className="timeline-task-name",t.textContent=a.name,r.appendChild(t);const s=document.createElement("div");s.className="timeline-task-dates",s.textContent=`${this.formatDate(a.startDate)} - ${this.formatDate(a.endDate)}`,r.appendChild(s),i.appendChild(r);const l=document.createElement("div");l.className="timeline-task-progress",l.textContent=`${a.progress}%`,i.appendChild(l),e.appendChild(i)}),e}createStats(){const e=document.createElement("div");e.className="timeline-stats";const n=this.tasks.length,a=this.tasks.filter(t=>t.status==="completed").length,i=this.tasks.filter(t=>t.status==="in-progress").length,d=this.tasks.filter(t=>t.status==="delayed").length;return[{label:"Total",value:n,color:"#667eea"},{label:"Concluídas",value:a,color:"#00ff88"},{label:"Em progresso",value:i,color:"#ffd700"},{label:"Atrasadas",value:d,color:"#f5576c"}].forEach(t=>{const s=document.createElement("div");s.className="timeline-stat";const l=document.createElement("div");l.className="timeline-stat-value",l.textContent=t.value.toString(),l.style.color=t.color,s.appendChild(l);const c=document.createElement("div");c.className="timeline-stat-label",c.textContent=t.label,s.appendChild(c),e.appendChild(s)}),e}togglePlayback(){this.isPlaying=!this.isPlaying,this.isPlaying?this.startPlayback():this.stopPlayback();const e=this.card.getElement().querySelector(".timeline-playback .arxis-btn--primary");e&&(e.textContent=this.isPlaying?"⏸️":"▶️")}startPlayback(){const e=()=>{if(!this.isPlaying)return;this.currentDate=new Date(this.currentDate.getTime()+864e5*this.playbackSpeed);const n=Math.max(...this.tasks.map(a=>a.endDate.getTime()));if(this.currentDate.getTime()>n){this.isPlaying=!1;return}this.renderTimeline(),this.updateDateDisplay(),this.animationFrame=window.setTimeout(e,100/this.playbackSpeed)};e()}stopPlayback(){this.animationFrame!==null&&(clearTimeout(this.animationFrame),this.animationFrame=null)}nextDay(){this.currentDate=new Date(this.currentDate.getTime()+1440*60*1e3),this.renderTimeline(),this.updateDateDisplay()}previousDay(){this.currentDate=new Date(this.currentDate.getTime()-1440*60*1e3),this.renderTimeline(),this.updateDateDisplay()}skipToStart(){this.currentDate=new Date(Math.min(...this.tasks.map(e=>e.startDate.getTime()))),this.renderTimeline(),this.updateDateDisplay()}skipToEnd(){this.currentDate=new Date(Math.max(...this.tasks.map(e=>e.endDate.getTime()))),this.renderTimeline(),this.updateDateDisplay()}updateDateDisplay(){const e=this.card.getElement().querySelector(".timeline-date");e&&(e.textContent=this.formatDate(this.currentDate))}formatDate(e){return e.toLocaleDateString("pt-BR")}getStatusIcon(e){return{completed:"✅","in-progress":"🔄","not-started":"⏳",delayed:"⚠️"}[e]||"❓"}applyStyles(){if(document.getElementById("timeline-panel-styles"))return;const e=document.createElement("style");e.id="timeline-panel-styles",e.textContent=`
      .timeline-panel {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .timeline-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
      }

      .timeline-date {
        font-size: 16px;
        font-weight: 600;
        color: var(--theme-accent, #00ff88);
        font-family: 'Courier New', monospace;
      }

      .timeline-playback {
        display: flex;
        gap: 4px;
      }

      .timeline-speed {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
      }

      .timeline-canvas {
        width: 100%;
        height: 400px;
        border-radius: 8px;
        background: rgba(20, 20, 20, 0.95);
      }

      .timeline-task-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .timeline-task-list-header {
        font-size: 14px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.7);
        padding: 8px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .timeline-task-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px;
        background: rgba(255, 255, 255, 0.03);
        border-radius: 6px;
        transition: background 0.15s ease;
      }

      .timeline-task-item:hover {
        background: rgba(255, 255, 255, 0.08);
      }

      .timeline-task-color {
        width: 4px;
        height: 40px;
        border-radius: 2px;
      }

      .timeline-task-info {
        flex: 1;
      }

      .timeline-task-name {
        font-size: 13px;
        font-weight: 500;
        color: var(--theme-foreground, #fff);
        margin-bottom: 4px;
      }

      .timeline-task-dates {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.5);
      }

      .timeline-task-progress {
        font-size: 13px;
        font-weight: 600;
        color: var(--theme-accent, #00ff88);
        font-family: 'Courier New', monospace;
      }

      .timeline-stats {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;
        padding: 16px 0;
      }

      .timeline-stat {
        text-align: center;
        padding: 12px;
        background: rgba(255, 255, 255, 0.03);
        border-radius: 6px;
      }

      .timeline-stat-value {
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 4px;
      }

      .timeline-stat-label {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.6);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    `,document.head.appendChild(e)}getElement(){return this.card.getElement()}destroy(){this.stopPlayback(),this.card.destroy()}}export{T as TimelinePanel};
