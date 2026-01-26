import{C as d}from"./Card-DLSvBshn.js";import{B as s}from"./Button-BvNVdej2.js";class m{card;quantities=[];constructor(){this.card=new d({title:"📊 Quantitativos (5D)"}),this.loadMockQuantities(),this.buildUI(),this.applyStyles()}loadMockQuantities(){this.quantities=[{category:"Estrutura",type:"Pilares",count:24,volume:12.5,unit:"m³"},{category:"Estrutura",type:"Vigas",count:48,volume:28.3,unit:"m³"},{category:"Estrutura",type:"Lajes",count:6,area:450,unit:"m²"},{category:"Alvenaria",type:"Paredes",count:120,area:680,unit:"m²"},{category:"Esquadrias",type:"Portas",count:32,unit:"un"},{category:"Esquadrias",type:"Janelas",count:45,area:85,unit:"m²"}]}buildUI(){const e=document.createElement("div");e.className="quantities-panel";const o=new s({text:"📤 Exportar Excel",variant:"primary",size:"sm",fullWidth:!0,onClick:()=>this.exportToExcel()});e.appendChild(o.getElement());const i=document.createElement("div");i.className="quantities-table";const a=document.createElement("div");a.className="quantities-header",a.innerHTML=`
      <div>Categoria</div>
      <div>Tipo</div>
      <div>Qtd</div>
      <div>Medida</div>
    `,i.appendChild(a),this.quantities.forEach(t=>{const n=document.createElement("div");n.className="quantities-row";const r=t.volume?`${t.volume.toFixed(2)} m³`:t.area?`${t.area.toFixed(2)} m²`:t.length?`${t.length.toFixed(2)} m`:"-";n.innerHTML=`
        <div>${t.category}</div>
        <div>${t.type}</div>
        <div>${t.count}</div>
        <div>${r}</div>
      `,i.appendChild(n)}),e.appendChild(i),this.card.getBody().appendChild(e)}exportToExcel(){console.log("📊 Exportando quantitativos para Excel...")}applyStyles(){if(document.getElementById("quantities-panel-styles"))return;const e=document.createElement("style");e.id="quantities-panel-styles",e.textContent=`
      .quantities-panel {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .quantities-table {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .quantities-header {
        display: grid;
        grid-template-columns: 120px 1fr 80px 120px;
        gap: 12px;
        padding: 8px 12px;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.5);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .quantities-row {
        display: grid;
        grid-template-columns: 120px 1fr 80px 120px;
        gap: 12px;
        padding: 10px 12px;
        background: rgba(255, 255, 255, 0.03);
        border-radius: 6px;
        font-size: 13px;
      }

      .quantities-row div:nth-child(1) {
        font-weight: 600;
        color: var(--theme-accent, #00ff88);
      }

      .quantities-row div:nth-child(3) {
        font-family: 'Courier New', monospace;
        font-weight: 600;
      }

      .quantities-row div:nth-child(4) {
        color: #ffd700;
        font-weight: 600;
      }
    `,document.head.appendChild(e)}getElement(){return this.card.getElement()}destroy(){this.card.destroy()}}export{m as QuantitiesPanel};
