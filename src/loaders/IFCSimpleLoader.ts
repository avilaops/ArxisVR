import * as THREE from 'three';
import { IFCLoader as ThreeIFCLoader } from 'web-ifc-three';
import { eventBus, EventType } from '../core';

/**
 * IFCSimpleLoader - Loader IFC SIMPLES e FUNCIONAL
 * Sem otimizações complexas, apenas carrega e mostra o modelo
 */
export class IFCSimpleLoader {
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private controls: any;
  private loader: ThreeIFCLoader;
  private loadedModel: THREE.Group | null = null;

  constructor(
    scene: THREE.Scene,
    camera: THREE.Camera,
    controls?: any
  ) {
    this.scene = scene;
    this.camera = camera;
    this.controls = controls;
    this.loader = new ThreeIFCLoader();

    this.setupLoader();
  }

  /**
   * Setup básico do loader
   */
  private setupLoader(): void {
    console.log('🔧 Configurando IFC Loader...');
    
    // IMPORTANTE: Desabilitar web workers PRIMEIRO (antes de setWasmPath)
    this.loader.ifcManager.useWebWorkers(false);
    console.log('📍 Web Workers: DESABILITADO (modo single-thread)');
    
    // Caminho absoluto para WASM files
    const wasmPath = '/wasm/';
    console.log('📂 WASM Path:', wasmPath);
    this.loader.ifcManager.setWasmPath(wasmPath);
    
    this.loader.ifcManager.applyWebIfcConfig({
      COORDINATE_TO_ORIGIN: true,
      USE_FAST_BOOLS: true,
    });

    console.log('✅ IFCSimpleLoader configurado');
  }

  /**
   * Carrega arquivo IFC - VERSÃO SIMPLES
   */
  public async load(file: File): Promise<void> {
    console.log(`🚀 Carregando ${file.name}...`);
    console.log(`📦 Tamanho: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`🔧 Loader configurado:`, {
      hasIfcManager: !!this.loader.ifcManager,
      webWorkersEnabled: false,
      wasmPath: '/wasm/'
    });

    eventBus.emit(EventType.MODEL_LOAD_REQUESTED, {
      kind: 'ifc',
      source: 'file',
      fileName: file.name
    });

    const url = URL.createObjectURL(file);
    console.log(`🔗 Blob URL: ${url}`);
    console.log(`⏳ Iniciando carregamento via loader.load()...`);

    return new Promise((resolve, reject) => {
      // Timeout para detectar travamento
      const timeout = setTimeout(() => {
        console.error('⏱️ TIMEOUT: Carregamento travou após 60s');
        console.error('💡 Possíveis causas:');
        console.error('   - Arquivos WASM não carregados');
        console.error('   - Arquivo IFC muito grande ou corrompido');
        console.error('   - Problema de CORS ou headers HTTP');
        URL.revokeObjectURL(url);
        reject(new Error('Timeout: O carregamento está demorando muito. Verifique se os arquivos WASM estão disponíveis.'));
      }, 60000);

      console.log(`📡 Chamando this.loader.load()...`);
      
      this.loader.load(
        url,
        (model) => {
          clearTimeout(timeout);
          console.log('✅ Modelo IFC carregado!');
          console.log('📦 Modelo:', model);
          console.log('📊 Children:', model.children.length);
          
          // Calcular bounding box
          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
          
          console.log('📏 Dimensões:', size);
          console.log('📍 Centro:', center);
          
          // Contar meshes
          let meshCount = 0;
          model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              meshCount++;
              
              // Garantir que tem material visível
              if (child.material) {
                const materials = Array.isArray(child.material) ? child.material : [child.material];
                materials.forEach(mat => {
                  mat.side = THREE.DoubleSide;
                  if (!mat.color) {
                    mat.color = new THREE.Color(0xcccccc);
                  }
                });
              }
            }
          });
          
          console.log(`🔺 Total de meshes: ${meshCount}`);
          
          // Adicionar à cena
          this.scene.add(model);
          this.loadedModel = model;
          
          console.log('✅ Modelo adicionado à cena!');
          console.log('🎬 Cena tem', this.scene.children.length, 'objetos');
          
          // Ajustar câmera
          this.focusCamera(model);
          
          // Liberar URL
          URL.revokeObjectURL(url);
          
          // Emitir evento de sucesso
          eventBus.emit(EventType.MODEL_LOADED, {
            kind: 'ifc',
            fileName: file.name,
            meshCount,
            size,
            center
          });
          
          resolve();
        },
        (progress) => {
          const percent = (progress.loaded / progress.total) * 100;
          console.log(`📊 Progresso: ${percent.toFixed(1)}% (${progress.loaded}/${progress.total} bytes)`);
        },
        (error) => {
          clearTimeout(timeout);
          console.error('❌ Erro ao carregar IFC:', error);
          console.error('💡 Dica: Verifique se os arquivos WASM estão em /wasm/');
          console.error('💡 Esperado: /wasm/web-ifc.wasm e /wasm/web-ifc-mt.wasm');
          
          URL.revokeObjectURL(url);
          
          eventBus.emit(EventType.MODEL_LOAD_FAILED, {
            type: 'load_error',
            message: 'Falha ao carregar arquivo IFC',
            error
          });
          
          reject(error);
        }
      );
    });
  }

  /**
   * Ajusta câmera para focar no modelo
   */
  private focusCamera(model: THREE.Object3D): void {
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = (this.camera as THREE.PerspectiveCamera).fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
    cameraZ *= 2; // Zoom out para ver melhor
    
    // Posicionar câmera
    this.camera.position.set(
      center.x + cameraZ * 0.7,
      center.y + cameraZ * 0.7,
      center.z + cameraZ * 0.7
    );
    
    // Atualizar controls
    if (this.controls && this.controls.target) {
      this.controls.target.copy(center);
      this.controls.update();
    }
    
    console.log('📷 Câmera ajustada');
    console.log('  - Posição:', this.camera.position);
    console.log('  - Target:', center);
  }

  /**
   * Remove modelo da cena
   */
  public dispose(): void {
    if (this.loadedModel) {
      this.scene.remove(this.loadedModel);
      this.loadedModel = null;
    }
  }

  /**
   * Obtém modelo carregado
   */
  public getModel(): THREE.Group | null {
    return this.loadedModel;
  }
}
