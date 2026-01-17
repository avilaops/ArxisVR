import * as THREE from 'three';
// @ts-ignore - web-ifc-three pode não ter tipos completos
import { IFCLoader as ThreeIFCLoader } from 'web-ifc-three';
import { LODSystem } from '../systems/LODSystem';
import { LayerManager } from '../systems/layers/LayerManager';
import { IFCElementType } from '../systems/layers/LayerTypes';

/**
 * IFC Loader otimizado
 * Carrega arquivos IFC com otimizações de performance e LOD
 */
export class IFCLoader {
  private scene: THREE.Scene;
  private loader: ThreeIFCLoader;
  private lodSystem: LODSystem;
  private layerManager: LayerManager | null = null;
  private loadedModels: THREE.Object3D[] = [];
  private loadingCallbacks: Map<string, (progress: number) => void> = new Map();
  private currentModelID: number = 0; // Armazena o ID do modelo atual

  constructor(scene: THREE.Scene, lodSystem: LODSystem, layerManager?: LayerManager) {
    this.scene = scene;
    this.lodSystem = lodSystem;
    this.layerManager = layerManager || null;
    this.loader = new ThreeIFCLoader();
    
    this.setupLoader();
  }

  private setupLoader(): void {
    // Define o caminho dos arquivos WASM - usando CDN para garantir que funcione
    this.loader.ifcManager.setWasmPath('https://cdn.jsdelivr.net/npm/web-ifc@0.0.52/');
    
    // Otimizações de memória
    this.loader.ifcManager.applyWebIfcConfig({
      COORDINATE_TO_ORIGIN: true, // Centraliza modelo na origem
      USE_FAST_BOOLS: true, // Usa operações booleanas rápidas
    });
  }

  /**
   * Carrega arquivo IFC
   */
  public async loadIFC(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      
      // Callback de progresso
      const onProgress = (event: ProgressEvent) => {
        const progress = (event.loaded / event.total) * 100;
        this.updateLoadingProgress(progress);
        
        const callback = this.loadingCallbacks.get(file.name);
        if (callback) callback(progress);
      };

      // Callback de erro
      const onError = (error: ErrorEvent) => {
        console.error('❌ Erro ao carregar IFC:', error);
        URL.revokeObjectURL(url);
        reject(error);
      };

      // Carrega o modelo
      this.loader.load(
        url,
        (model) => {
          console.log('✅ IFC carregado com sucesso!');
          this.processLoadedModel(model);
          URL.revokeObjectURL(url);
          resolve();
        },
        onProgress,
        onError
      );
    });
  }

  /**
   * Processa modelo carregado aplicando otimizações
   */
  private processLoadedModel(model: THREE.Object3D): void {
    // Obtém o modelID do modelo carregado
    const modelID = (model as any).modelID || this.currentModelID;
    console.log(`📋 Modelo IFC carregado - ID: ${modelID}`);
    
    // Cria layers automáticos por tipo IFC se LayerManager disponível
    const layersByType = new Map<string, string>();
    
    // Armazena modelID e expressID em todos os meshes
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Armazena IDs no userData para acesso posterior
        child.userData.modelID = modelID;
        
        // Copia expressID se existir
        if ((child as any).expressID) {
          child.userData.expressID = (child as any).expressID;
          
          // Se tem LayerManager, organiza por tipo
          if (this.layerManager) {
            const ifcType = this.detectIFCType(child);
            
            // Cria layer para este tipo se não existe
            if (!layersByType.has(ifcType)) {
              const layer = this.layerManager.createLayer({
                name: ifcType,
                type: ifcType,
                category: this.getCategoryForType(ifcType),
                color: LayerManager.getDefaultColorForType(ifcType as IFCElementType),
                visible: true,
                locked: false,
                plotable: true
              });
              layersByType.set(ifcType, layer.id);
              console.log(`   ✅ Layer criado: ${ifcType}`);
            }
            
            // Adiciona objeto ao layer
            const layerId = layersByType.get(ifcType)!;
            this.layerManager.addObjectToLayer(child, layerId);
          }
          
          console.log(`   Mesh ${child.name || 'sem nome'} - expressID: ${child.userData.expressID}`);
        }
      }
    });
    
    // Otimiza geometrias
    this.optimizeGeometries(model);
    
    // Adiciona à cena
    this.scene.add(model);
    this.loadedModels.push(model);
    
    // Incrementa modelID para próximo modelo
    this.currentModelID++;
    
    // Registra no sistema LOD
    this.lodSystem.registerModel(model);
    
    // Calcula bounding box para centralizar visualização
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    
    console.log('📦 Dimensões do modelo (escala 1:1):');
    console.log(`   Largura: ${size.x.toFixed(2)}m`);
    console.log(`   Altura: ${size.y.toFixed(2)}m`);
    console.log(`   Profundidade: ${size.z.toFixed(2)}m`);
    console.log(`   Centro: (${center.x.toFixed(2)}, ${center.y.toFixed(2)}, ${center.z.toFixed(2)})`);
    
    if (this.layerManager) {
      console.log(`📚 ${layersByType.size} layers criados automaticamente`);
    }
    
    // Atualiza UI
    this.updateModelInfo(model);
  }

  /**
   * Detecta tipo IFC do objeto
   */
  private detectIFCType(object: THREE.Object3D): string {
    // Tenta detectar pelo nome
    const name = object.name.toUpperCase();
    
    for (const type of Object.values(IFCElementType)) {
      if (name.includes(type)) {
        return type;
      }
    }
    
    // Tenta detectar pelo userData
    if (object.userData.ifcType) {
      return object.userData.ifcType;
    }
    
    return IFCElementType.OTHER;
  }

  /**
   * Obtém categoria para tipo IFC
   */
  private getCategoryForType(type: string): string {
    const structural = [IFCElementType.WALL, IFCElementType.SLAB, IFCElementType.BEAM, IFCElementType.COLUMN, IFCElementType.ROOF];
    const openings = [IFCElementType.DOOR, IFCElementType.WINDOW];
    const circulation = [IFCElementType.STAIR, IFCElementType.RAILING];
    
    if (structural.includes(type as IFCElementType)) return 'Estrutura';
    if (openings.includes(type as IFCElementType)) return 'Aberturas';
    if (circulation.includes(type as IFCElementType)) return 'Circulação';
    if (type === IFCElementType.FURNITURE) return 'Mobiliário';
    if (type === IFCElementType.SPACE) return 'Espaços';
    
    return 'Outros';
  }

  /**
   * Otimiza geometrias para melhor performance
   */
  private optimizeGeometries(model: THREE.Object3D): void {
    let meshCount = 0;
    let triangleCount = 0;

    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        meshCount++;

        // Computa normais se necessário
        if (!child.geometry.attributes.normal) {
          child.geometry.computeVertexNormals();
        }

        // Computa bounding sphere para culling
        child.geometry.computeBoundingSphere();
        child.geometry.computeBoundingBox();

        // Conta triângulos
        if (child.geometry.index) {
          triangleCount += child.geometry.index.count / 3;
        }

        // Habilita frustum culling
        child.frustumCulled = true;

        // Configura recepção e projeção de sombras
        child.castShadow = true;
        child.receiveShadow = true;

        // Otimiza material
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => this.optimizeMaterial(mat));
          } else {
            this.optimizeMaterial(child.material);
          }
        }
      }
    });

    console.log(`🔧 Otimização concluída:`);
    console.log(`   Meshes: ${meshCount}`);
    console.log(`   Triângulos: ${triangleCount.toLocaleString()}`);
  }

  /**
   * Otimiza material para PBR realista
   */
  private optimizeMaterial(material: THREE.Material): void {
    if (material instanceof THREE.MeshStandardMaterial) {
      // Configurações PBR
      material.roughness = 0.7;
      material.metalness = 0.1;
      material.envMapIntensity = 1.0;
      
      // Habilita flat shading para objetos arquitetônicos (opcional)
      // material.flatShading = true;
    }
  }

  /**
   * Obtém propriedades de um elemento IFC
   */
  public async getProperties(modelID: number, expressID: number): Promise<any> {
    try {
      console.log(`🔍 Buscando propriedades - ModelID: ${modelID}, ExpressID: ${expressID}`);
      const properties = await this.loader.ifcManager.getItemProperties(modelID, expressID);
      console.log('✅ Propriedades encontradas:', properties);
      return properties;
    } catch (error) {
      console.error('❌ Erro ao buscar propriedades:', error);
      throw error;
    }
  }

  /**
   * Obtém todas as propriedades de um elemento (incluindo Psets)
   */
  public async getAllProperties(modelID: number, expressID: number): Promise<any> {
    try {
      console.log(`🔍 Buscando TODAS propriedades - ModelID: ${modelID}, ExpressID: ${expressID}`);
      
      // Obtém propriedades básicas
      const properties = await this.loader.ifcManager.getItemProperties(modelID, expressID, true);
      
      // Tenta obter Psets (Property Sets)
      try {
        const psets = await this.loader.ifcManager.getPropertySets(modelID, expressID, true);
        if (psets && psets.length > 0) {
          properties.psets = psets;
          console.log(`📊 ${psets.length} Property Sets encontrados`);
        }
      } catch (e) {
        console.warn('Nenhum Pset encontrado para este elemento');
      }
      
      // Tenta obter tipo do elemento
      try {
        const type = await this.loader.ifcManager.getTypeProperties(modelID, expressID, true);
        if (type) {
          properties.type = type;
          console.log('🏗️ Tipo do elemento encontrado');
        }
      } catch (e) {
        console.warn('Tipo do elemento não encontrado');
      }
      
      console.log('✅ Todas propriedades carregadas:', properties);
      return properties;
    } catch (error) {
      console.error('❌ Erro ao buscar todas propriedades:', error);
      throw error;
    }
  }

  /**
   * Obtém propriedades espaciais de um elemento
   */
  public async getSpatialStructure(modelID: number): Promise<any> {
    return await this.loader.ifcManager.getSpatialStructure(modelID);
  }

  /**
   * Obtém o IFC Manager para uso avançado
   */
  public getIfcManager(): any {
    return this.loader.ifcManager;
  }

  /**
   * Obtém modelos carregados
   */
  public getLoadedModels(): THREE.Object3D[] {
    return this.loadedModels;
  }

  /**
   * Atualiza progresso do carregamento
   */
  private updateLoadingProgress(progress: number): void {
    const progressBar = document.getElementById('loading-progress');
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }
  }

  /**
   * Atualiza informações do modelo na UI
   */
  private updateModelInfo(model: THREE.Object3D): void {
    let meshCount = 0;
    let triangleCount = 0;

    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        meshCount++;
        if (child.geometry.index) {
          triangleCount += child.geometry.index.count / 3;
        }
      }
    });

    const objectsElement = document.getElementById('objects-count');
    const trianglesElement = document.getElementById('triangles-count');

    if (objectsElement) {
      objectsElement.textContent = `Objetos: ${meshCount.toLocaleString()}`;
    }
    if (trianglesElement) {
      trianglesElement.textContent = `Triângulos: ${Math.floor(triangleCount).toLocaleString()}`;
    }
  }

  /**
   * Registra callback de progresso
   */
  public onLoadProgress(filename: string, callback: (progress: number) => void): void {
    this.loadingCallbacks.set(filename, callback);
  }

  /**
   * Remove modelo da cena
   */
  public removeModel(model: THREE.Object3D): void {
    this.scene.remove(model);
    const index = this.loadedModels.indexOf(model);
    if (index > -1) {
      this.loadedModels.splice(index, 1);
    }
    
    // Limpa recursos
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach(mat => mat.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
  }

  /**
   * Remove todos os modelos
   */
  public clear(): void {
    this.loadedModels.forEach(model => this.removeModel(model));
    this.loadedModels = [];
  }

  public dispose(): void {
    this.clear();
    this.loader.ifcManager.dispose();
    this.loadingCallbacks.clear();
  }
}
