/**
 * Sistema de IA para Análise BIM
 * 
 * Funcionalidades:
 * - Análise de colisões (Clash Detection)
 * - Estimativa de custos
 * - Análise de quantitativos
 * - Sugestões de otimização
 * - Detecção de anomalias
 * - Chatbot de projeto
 */

import * as THREE from 'three';

export interface IFCElement {
  expressID: number;
  type: string;
  geometry: THREE.BufferGeometry;
  matrix: THREE.Matrix4;
  properties: Record<string, any>;
  boundingBox: THREE.Box3;
}

export interface ClashResult {
  elementA: IFCElement;
  elementB: IFCElement;
  severity: 'critical' | 'major' | 'minor';
  intersectionVolume: number;
  location: THREE.Vector3;
  description: string;
  suggestedFix?: string;
}

export interface CostAnalysis {
  totalEstimated: number;
  breakdown: {
    category: string;
    description: string;
    quantity: number;
    unitCost: number;
    total: number;
  }[];
  confidenceLevel: number;
  warnings: string[];
}

export interface Quantitative {
  category: string;
  material: string;
  quantity: number;
  unit: string;
  elements: number[];
}

export interface OptimizationSuggestion {
  id: string;
  type: 'material' | 'structure' | 'layout' | 'cost';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  potentialSaving: number;
  impactedElements: number[];
  action: string;
}

export class BIMAIEngine {
  private static instance: BIMAIEngine;
  private elements: Map<number, IFCElement> = new Map();
  private spatialIndex: Map<string, number[]> = new Map();
  
  // Configurações
  private readonly CLASH_TOLERANCE = 0.01; // 1cm
  private readonly GRID_SIZE = 1.0; // 1 metro para spatial hashing
  
  // Cache de análises
  private clashCache: ClashResult[] = [];
  private costCache: CostAnalysis | null = null;
  private quantitativeCache: Quantitative[] = [];

  private constructor() {
    console.log('🤖 BIM AI Engine initialized');
  }

  static getInstance(): BIMAIEngine {
    if (!BIMAIEngine.instance) {
      BIMAIEngine.instance = new BIMAIEngine();
    }
    return BIMAIEngine.instance;
  }

  /**
   * Registra elementos IFC para análise
   */
  registerElements(elements: IFCElement[]): void {
    console.log(`📦 Registrando ${elements.length} elementos para análise...`);
    
    this.elements.clear();
    this.spatialIndex.clear();
    
    elements.forEach(elem => {
      this.elements.set(elem.expressID, elem);
      this.indexElement(elem);
    });
    
    console.log('✅ Elementos registrados e indexados');
  }

  /**
   * Indexação espacial para otimizar buscas
   */
  private indexElement(elem: IFCElement): void {
    const bbox = elem.boundingBox;
    const center = new THREE.Vector3();
    bbox.getCenter(center);
    
    // Spatial hash baseado em grid
    const gridX = Math.floor(center.x / this.GRID_SIZE);
    const gridY = Math.floor(center.y / this.GRID_SIZE);
    const gridZ = Math.floor(center.z / this.GRID_SIZE);
    
    const key = `${gridX},${gridY},${gridZ}`;
    
    if (!this.spatialIndex.has(key)) {
      this.spatialIndex.set(key, []);
    }
    
    this.spatialIndex.get(key)!.push(elem.expressID);
  }

  /**
   * CLASH DETECTION - Detecta colisões entre elementos
   */
  async detectClashes(options?: {
    ignoreTypes?: string[];
    minVolume?: number;
    progressCallback?: (progress: number) => void;
  }): Promise<ClashResult[]> {
    console.log('🔍 Iniciando detecção de colisões...');
    
    const ignoreTypes = options?.ignoreTypes || [];
    const minVolume = options?.minVolume || 0.001; // 1 litro mínimo
    
    const clashes: ClashResult[] = [];
    const elementsArray = Array.from(this.elements.values());
    const total = elementsArray.length;
    
    for (let i = 0; i < total; i++) {
      const elemA = elementsArray[i];
      
      // Ignorar tipos específicos
      if (ignoreTypes.includes(elemA.type)) continue;
      
      // Buscar elementos próximos usando spatial index
      const candidates = this.getNearbyElements(elemA);
      
      for (const elemBId of candidates) {
        const elemB = this.elements.get(elemBId)!;
        
        // Não verificar consigo mesmo
        if (elemA.expressID === elemB.expressID) continue;
        
        // Ignorar tipos
        if (ignoreTypes.includes(elemB.type)) continue;
        
        // Verificar interseção de bounding boxes
        if (elemA.boundingBox.intersectsBox(elemB.boundingBox)) {
          const clash = this.analyzeClash(elemA, elemB);
          
          if (clash && clash.intersectionVolume >= minVolume) {
            clashes.push(clash);
          }
        }
      }
      
      // Report progress
      if (options?.progressCallback && i % 10 === 0) {
        options.progressCallback((i / total) * 100);
      }
    }
    
    // Classificar por severidade
    clashes.sort((a, b) => {
      const severityOrder = { critical: 0, major: 1, minor: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
    
    this.clashCache = clashes;
    
    console.log(`✅ Encontradas ${clashes.length} colisões`);
    return clashes;
  }

  /**
   * Busca elementos próximos usando spatial index
   */
  private getNearbyElements(elem: IFCElement): number[] {
    const bbox = elem.boundingBox;
    const center = new THREE.Vector3();
    bbox.getCenter(center);
    
    const gridX = Math.floor(center.x / this.GRID_SIZE);
    const gridY = Math.floor(center.y / this.GRID_SIZE);
    const gridZ = Math.floor(center.z / this.GRID_SIZE);
    
    const nearby: number[] = [];
    
    // Verificar célula atual e adjacentes (27 células no total)
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dz = -1; dz <= 1; dz++) {
          const key = `${gridX + dx},${gridY + dy},${gridZ + dz}`;
          const cellElements = this.spatialIndex.get(key);
          
          if (cellElements) {
            nearby.push(...cellElements);
          }
        }
      }
    }
    
    return nearby;
  }

  /**
   * Analisa colisão específica entre dois elementos
   */
  private analyzeClash(elemA: IFCElement, elemB: IFCElement): ClashResult | null {
    const bboxA = elemA.boundingBox.clone();
    const bboxB = elemB.boundingBox.clone();
    
    // Calcular interseção
    const intersection = bboxA.clone();
    intersection.intersect(bboxB);
    
    if (intersection.isEmpty()) {
      return null;
    }
    
    // Volume de interseção (aproximado pela bbox)
    const size = new THREE.Vector3();
    intersection.getSize(size);
    const volume = size.x * size.y * size.z;
    
    // Centro da colisão
    const location = new THREE.Vector3();
    intersection.getCenter(location);
    
    // Determinar severidade
    let severity: 'critical' | 'major' | 'minor' = 'minor';
    
    if (this.isCriticalClash(elemA, elemB, volume)) {
      severity = 'critical';
    } else if (volume > 0.1) { // 100 litros
      severity = 'major';
    }
    
    // Gerar descrição
    const description = this.generateClashDescription(elemA, elemB, volume);
    
    // Sugestão de correção
    const suggestedFix = this.suggestClashFix(elemA, elemB, severity);
    
    return {
      elementA: elemA,
      elementB: elemB,
      severity,
      intersectionVolume: volume,
      location,
      description,
      suggestedFix
    };
  }

  /**
   * Determina se é colisão crítica baseado em tipos
   */
  private isCriticalClash(elemA: IFCElement, elemB: IFCElement, volume: number): boolean {
    const criticalTypes = ['IFCWALL', 'IFCCOLUMN', 'IFCBEAM', 'IFCSLAB'];
    
    const bothCritical = 
      criticalTypes.includes(elemA.type) && 
      criticalTypes.includes(elemB.type);
    
    return bothCritical && volume > 0.05; // 50 litros
  }

  /**
   * Gera descrição da colisão
   */
  private generateClashDescription(elemA: IFCElement, elemB: IFCElement, volume: number): string {
    const volumeLiters = (volume * 1000).toFixed(2);
    return `Colisão entre ${elemA.type} (ID: ${elemA.expressID}) e ${elemB.type} (ID: ${elemB.expressID}). Volume: ${volumeLiters}L`;
  }

  /**
   * Sugere correção para colisão
   */
  private suggestClashFix(elemA: IFCElement, elemB: IFCElement, severity: string): string {
    if (severity === 'critical') {
      return `Reposicionar ${elemB.type} ou ajustar ${elemA.type}. Revisar projeto estrutural.`;
    }
    
    if (severity === 'major') {
      return `Verificar compatibilidade. Considerar ajuste de altura ou posicionamento.`;
    }
    
    return `Revisar detalhamento. Colisão menor pode ser resolvida em campo.`;
  }

  /**
   * COST ESTIMATION - Estima custos do projeto
   */
  async estimateCosts(priceTable?: Map<string, number>): Promise<CostAnalysis> {
    console.log('💰 Calculando estimativa de custos...');
    
    const breakdown: CostAnalysis['breakdown'] = [];
    const warnings: string[] = [];
    let totalEstimated = 0;
    
    // Preços padrão (R$ por unidade)
    const defaultPrices: Record<string, { unit: string, price: number }> = {
      'IFCWALL': { unit: 'm²', price: 350 },
      'IFCSLAB': { unit: 'm²', price: 280 },
      'IFCCOLUMN': { unit: 'm³', price: 1200 },
      'IFCBEAM': { unit: 'm³', price: 1100 },
      'IFCWINDOW': { unit: 'un', price: 800 },
      'IFCDOOR': { unit: 'un', price: 650 },
      'IFCROOF': { unit: 'm²', price: 180 }
    };
    
    // Agrupar por tipo
    const byType = new Map<string, IFCElement[]>();
    
    this.elements.forEach(elem => {
      if (!byType.has(elem.type)) {
        byType.set(elem.type, []);
      }
      byType.get(elem.type)!.push(elem);
    });
    
    // Calcular por categoria
    byType.forEach((elements, type) => {
      const config = defaultPrices[type];
      
      if (!config) {
        warnings.push(`Sem preço cadastrado para ${type}`);
        return;
      }
      
      // Calcular quantidade total
      let quantity = 0;
      
      elements.forEach(elem => {
        const size = new THREE.Vector3();
        elem.boundingBox.getSize(size);
        
        if (config.unit === 'm²') {
          // Área aproximada
          quantity += (size.x * size.z) + (size.y * size.z);
        } else if (config.unit === 'm³') {
          // Volume
          quantity += size.x * size.y * size.z;
        } else {
          // Unidade
          quantity += 1;
        }
      });
      
      const unitCost = priceTable?.get(type) || config.price;
      const total = quantity * unitCost;
      
      breakdown.push({
        category: type,
        description: this.getTypeDescription(type),
        quantity: Math.round(quantity * 100) / 100,
        unitCost,
        total
      });
      
      totalEstimated += total;
    });
    
    // Adicionar margem de segurança (10%)
    const safetyMargin = totalEstimated * 0.1;
    breakdown.push({
      category: 'CONTINGENCY',
      description: 'Margem de Segurança (10%)',
      quantity: 1,
      unitCost: safetyMargin,
      total: safetyMargin
    });
    
    totalEstimated += safetyMargin;
    
    this.costCache = {
      totalEstimated,
      breakdown,
      confidenceLevel: warnings.length === 0 ? 0.85 : 0.65,
      warnings
    };
    
    console.log(`✅ Custo estimado: R$ ${totalEstimated.toLocaleString('pt-BR')}`);
    return this.costCache;
  }

  /**
   * QUANTITATIVOS - Levantamento de quantidades
   */
  calculateQuantitatives(): Quantitative[] {
    console.log('📊 Calculando quantitativos...');
    
    const quantitatives: Map<string, Quantitative> = new Map();
    
    this.elements.forEach(elem => {
      const material = elem.properties?.Material || 'Concreto';
      const key = `${elem.type}_${material}`;
      
      if (!quantitatives.has(key)) {
        quantitatives.set(key, {
          category: elem.type,
          material,
          quantity: 0,
          unit: this.getUnitForType(elem.type),
          elements: []
        });
      }
      
      const quant = quantitatives.get(key)!;
      quant.elements.push(elem.expressID);
      
      // Calcular quantidade
      const size = new THREE.Vector3();
      elem.boundingBox.getSize(size);
      
      if (quant.unit === 'm²') {
        quant.quantity += (size.x * size.z) + (size.y * size.z);
      } else if (quant.unit === 'm³') {
        quant.quantity += size.x * size.y * size.z;
      } else {
        quant.quantity += 1;
      }
    });
    
    this.quantitativeCache = Array.from(quantitatives.values());
    
    console.log(`✅ ${this.quantitativeCache.length} categorias de quantitativos`);
    return this.quantitativeCache;
  }

  /**
   * OTIMIZAÇÃO - Sugestões de melhoria
   */
  generateOptimizationSuggestions(): OptimizationSuggestion[] {
    console.log('💡 Gerando sugestões de otimização...');
    
    const suggestions: OptimizationSuggestion[] = [];
    
    // Analisar elementos duplicados próximos
    const duplicates = this.findPotentialDuplicates();
    if (duplicates.length > 0) {
      suggestions.push({
        id: 'duplicate-elements',
        type: 'structure',
        priority: 'high',
        title: 'Elementos Potencialmente Duplicados',
        description: `Encontrados ${duplicates.length} grupos de elementos que podem estar duplicados`,
        potentialSaving: duplicates.length * 500,
        impactedElements: duplicates.flat(),
        action: 'Revisar e remover elementos duplicados'
      });
    }
    
    // Analisar materiais caros
    if (this.costCache) {
      const expensiveItems = this.costCache.breakdown
        .filter(item => item.total > this.costCache!.totalEstimated * 0.2)
        .map(item => item.category);
      
      if (expensiveItems.length > 0) {
        suggestions.push({
          id: 'expensive-materials',
          type: 'cost',
          priority: 'medium',
          title: 'Materiais de Alto Custo',
          description: `Categorias ${expensiveItems.join(', ')} representam mais de 20% do custo total`,
          potentialSaving: this.costCache.totalEstimated * 0.15,
          impactedElements: [],
          action: 'Considerar materiais alternativos ou fornecedores diferentes'
        });
      }
    }
    
    // Analisar colisões
    if (this.clashCache.length > 10) {
      const criticalClashes = this.clashCache.filter(c => c.severity === 'critical').length;
      
      suggestions.push({
        id: 'many-clashes',
        type: 'structure',
        priority: criticalClashes > 5 ? 'high' : 'medium',
        title: 'Múltiplas Colisões Detectadas',
        description: `${this.clashCache.length} colisões encontradas (${criticalClashes} críticas)`,
        potentialSaving: this.clashCache.length * 2000,
        impactedElements: this.clashCache.flatMap(c => [c.elementA.expressID, c.elementB.expressID]),
        action: 'Resolver colisões antes de iniciar obra para evitar retrabalho'
      });
    }
    
    console.log(`✅ ${suggestions.length} sugestões geradas`);
    return suggestions;
  }

  /**
   * Encontra elementos potencialmente duplicados
   */
  private findPotentialDuplicates(): number[][] {
    const duplicates: number[][] = [];
    const checked = new Set<number>();
    
    this.elements.forEach((elemA, idA) => {
      if (checked.has(idA)) return;
      
      const similar: number[] = [idA];
      
      this.elements.forEach((elemB, idB) => {
        if (idA === idB || checked.has(idB)) return;
        if (elemA.type !== elemB.type) return;
        
        // Verificar se estão muito próximos
        const distSq = elemA.boundingBox.getCenter(new THREE.Vector3())
          .distanceToSquared(elemB.boundingBox.getCenter(new THREE.Vector3()));
        
        if (distSq < 0.01) { // Menos de 10cm
          similar.push(idB);
          checked.add(idB);
        }
      });
      
      if (similar.length > 1) {
        duplicates.push(similar);
      }
      
      checked.add(idA);
    });
    
    return duplicates;
  }

  /**
   * Helpers
   */
  private getTypeDescription(type: string): string {
    const descriptions: Record<string, string> = {
      'IFCWALL': 'Paredes',
      'IFCSLAB': 'Lajes',
      'IFCCOLUMN': 'Pilares',
      'IFCBEAM': 'Vigas',
      'IFCWINDOW': 'Janelas',
      'IFCDOOR': 'Portas',
      'IFCROOF': 'Cobertura'
    };
    return descriptions[type] || type;
  }

  private getUnitForType(type: string): string {
    const units: Record<string, string> = {
      'IFCWALL': 'm²',
      'IFCSLAB': 'm²',
      'IFCCOLUMN': 'm³',
      'IFCBEAM': 'm³',
      'IFCWINDOW': 'un',
      'IFCDOOR': 'un',
      'IFCROOF': 'm²'
    };
    return units[type] || 'un';
  }

  /**
   * Obter resultados em cache
   */
  getCachedClashes(): ClashResult[] {
    return this.clashCache;
  }

  getCachedCosts(): CostAnalysis | null {
    return this.costCache;
  }

  getCachedQuantitatives(): Quantitative[] {
    return this.quantitativeCache;
  }

  /**
   * Limpar cache
   */
  clearCache(): void {
    this.clashCache = [];
    this.costCache = null;
    this.quantitativeCache = [];
  }
}

// Singleton export
export const bimAI = BIMAIEngine.getInstance();
