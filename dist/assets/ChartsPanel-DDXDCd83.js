import{C as g}from"./Card-DLSvBshn.js";import{S as p}from"./Select-D01wDXMy.js";class v{card;chartType="bar";data=[];canvas;constructor(){this.card=new g({title:"📈 Gráficos",variant:"glass"}),this.loadSampleData(),this.render()}loadSampleData(){this.data=[{label:"Paredes",value:245,color:"#00d4ff"},{label:"Portas",value:128,color:"#7b2ff7"},{label:"Janelas",value:187,color:"#ff9800"},{label:"Vigas",value:342,color:"#4caf50"},{label:"Pilares",value:96,color:"#f44336"},{label:"Lajes",value:24,color:"#9c27b0"}]}render(){const a=this.card.getBody();a.innerHTML="";const d=document.createElement("div");d.className="arxis-charts__controls";const l=new p({options:[{value:"bar",label:"📊 Barras"},{value:"pie",label:"🥧 Pizza"},{value:"line",label:"📈 Linha"}],value:this.chartType,onChange:e=>{this.chartType=e,this.renderChart()}});d.appendChild(l.getElement()),a.appendChild(d);const n=document.createElement("div");n.className="arxis-charts__container",this.canvas=document.createElement("canvas"),this.canvas.className="arxis-charts__canvas",this.canvas.width=500,this.canvas.height=300,n.appendChild(this.canvas),a.appendChild(n);const i=document.createElement("div");i.className="arxis-charts__legend",this.data.forEach(e=>{const t=document.createElement("div");t.className="arxis-charts__legend-item";const s=document.createElement("div");s.className="arxis-charts__legend-color",s.style.background=e.color||"#00d4ff";const r=document.createElement("span");r.className="arxis-charts__legend-label",r.textContent=`${e.label}: ${e.value}`,t.appendChild(s),t.appendChild(r),i.appendChild(t)}),a.appendChild(i),this.renderChart(),this.injectStyles()}renderChart(){if(!this.canvas)return;const a=this.canvas.getContext("2d");if(a)switch(a.clearRect(0,0,this.canvas.width,this.canvas.height),this.chartType){case"bar":this.renderBarChart(a);break;case"pie":this.renderPieChart(a);break;case"line":this.renderLineChart(a);break}}renderBarChart(a){const l=this.canvas.width-80,n=this.canvas.height-80,i=Math.max(...this.data.map(t=>t.value)),e=l/this.data.length-10;this.data.forEach((t,s)=>{const r=t.value/i*n,h=40+s*(l/this.data.length),o=40+n-r;a.fillStyle=t.color||"#00d4ff",a.fillRect(h,o,e,r),a.fillStyle="#fff",a.font="12px sans-serif",a.textAlign="center",a.fillText(t.value.toString(),h+e/2,o-5),a.save(),a.translate(h+e/2,40+n+10),a.rotate(-Math.PI/6),a.fillText(t.label,0,0),a.restore()})}renderPieChart(a){const d=this.canvas.width/2,l=this.canvas.height/2,n=Math.min(d,l)-40,i=this.data.reduce((t,s)=>t+s.value,0);let e=-Math.PI/2;this.data.forEach(t=>{const s=t.value/i*2*Math.PI;a.beginPath(),a.moveTo(d,l),a.arc(d,l,n,e,e+s),a.closePath(),a.fillStyle=t.color||"#00d4ff",a.fill();const r=e+s/2,h=d+Math.cos(r)*(n*.7),o=l+Math.sin(r)*(n*.7),c=(t.value/i*100).toFixed(1);a.fillStyle="#fff",a.font="bold 14px sans-serif",a.textAlign="center",a.textBaseline="middle",a.fillText(`${c}%`,h,o),e+=s})}renderLineChart(a){const l=this.canvas.width-80,n=this.canvas.height-80,i=Math.max(...this.data.map(e=>e.value));a.beginPath(),a.strokeStyle="#00d4ff",a.lineWidth=3,this.data.forEach((e,t)=>{const s=40+t/(this.data.length-1)*l,r=40+n-e.value/i*n;t===0?a.moveTo(s,r):a.lineTo(s,r)}),a.stroke(),this.data.forEach((e,t)=>{const s=40+t/(this.data.length-1)*l,r=40+n-e.value/i*n;a.beginPath(),a.arc(s,r,6,0,2*Math.PI),a.fillStyle=e.color||"#00d4ff",a.fill(),a.strokeStyle="#fff",a.lineWidth=2,a.stroke(),a.fillStyle="#fff",a.font="12px sans-serif",a.textAlign="center",a.fillText(e.value.toString(),s,r-15)})}setData(a){this.data=a,this.renderChart()}getElement(){return this.card.getElement()}destroy(){this.card.destroy()}injectStyles(){if(document.getElementById("arxis-charts-styles"))return;const a=document.createElement("style");a.id="arxis-charts-styles",a.textContent=`
      .arxis-charts__controls {
        margin-bottom: 16px;
      }

      .arxis-charts__container {
        background: rgba(255, 255, 255, 0.03);
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 16px;
        display: flex;
        justify-content: center;
      }

      .arxis-charts__canvas {
        max-width: 100%;
        height: auto;
      }

      .arxis-charts__legend {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 8px;
      }

      .arxis-charts__legend-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px;
        background: rgba(255, 255, 255, 0.04);
        border-radius: 6px;
      }

      .arxis-charts__legend-color {
        width: 16px;
        height: 16px;
        border-radius: 4px;
        flex-shrink: 0;
      }

      .arxis-charts__legend-label {
        font-size: 13px;
        color: rgba(255, 255, 255, 0.8);
      }
    `,document.head.appendChild(a)}}export{v as ChartsPanel};
