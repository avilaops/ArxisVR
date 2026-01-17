import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { estimateAssetSize, formatBytes } from './AssetUtils';
import { eventBus, EventType } from '../../core';

/**
 * AssetStreamer - Loader de múltiplos formatos
 * Suporta GLTF, GLB, FBX, OBJ e IFC (via IFCLoader)
 * 
 * Features:
 * - Carregamento assíncrono
 * - Suporte a Web Workers (futuro)
 * - Progress tracking
 * - Error handling robusto
 */
export class AssetStreamer {
  private gltfLoader: GLTFLoader;
  private fbxLoader: FBXLoader;
  private objLoader: OBJLoader;
  
  private loadingAssets: Map<string, Promise<any>> = new Map();
  
  constructor() {
    this.gltfLoader = new GLTFLoader();
    this.fbxLoader = new FBXLoader();
    this.objLoader = new OBJLoader();
    
    console.log('📦 Asset Streamer initialized');
  }
  
  /**
   * Carrega asset baseado na extensão
   */
  public async loadAsset(url: string, assetId?: string): Promise<THREE.Object3D> {
    const id = assetId || url;
    const startTime = Date.now();
    
    // Se já está carregando, retorna a promise existente
    if (this.loadingAssets.has(id)) {
      console.log(`⏳ Already loading: ${id}`);
      return this.loadingAssets.get(id)!;
    }
    
    // Emite evento de início de carregamento
    eventBus.emit(EventType.MODEL_LOADING, { fileName: id });
    
    const extension = this.getFileExtension(url);
    
    let loadPromise: Promise<THREE.Object3D>;
    
    switch (extension) {
      case 'gltf':
      case 'glb':
        loadPromise = this.loadGLTF(url);
        break;
      
      case 'fbx':
        loadPromise = this.loadFBX(url);
        break;
      
      case 'obj':
        loadPromise = this.loadOBJ(url);
        break;
      
      default:
        loadPromise = Promise.reject(new Error(`Unsupported format: ${extension}`));
    }
    
    this.loadingAssets.set(id, loadPromise);
    
    try {
      const asset = await loadPromise;
      const duration = Date.now() - startTime;
      const size = estimateAssetSize(asset);
      
      // Emite evento de sucesso
      eventBus.emit(EventType.MODEL_LOADED, {
        object: asset,
        fileName: id
      });
      
      console.log(`✅ Loaded: ${id} (${duration}ms, ${formatBytes(size)})`);
      
      this.loadingAssets.delete(id);
      return asset;
      
    } catch (error) {
      // Emite evento de erro
      eventBus.emit(EventType.MODEL_ERROR, {
        error: error as Error,
        fileName: id
      });
      
      console.error(`❌ Failed to load: ${id}`, error);
      
      this.loadingAssets.delete(id);
      throw error;
    }
  }
  
  /**
   * Carrega GLTF/GLB
   */
  private loadGLTF(url: string): Promise<THREE.Object3D> {
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        url,
        (gltf) => {
          resolve(gltf.scene);
        },
        (progress) => {
          const percent = (progress.loaded / progress.total) * 100;
          console.log(`📥 Loading: ${percent.toFixed(2)}%`);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  
  /**
   * Carrega FBX
   */
  private loadFBX(url: string): Promise<THREE.Object3D> {
    return new Promise((resolve, reject) => {
      this.fbxLoader.load(
        url,
        (fbx) => {
          resolve(fbx);
        },
        (progress) => {
          const percent = (progress.loaded / progress.total) * 100;
          console.log(`📥 Loading: ${percent.toFixed(2)}%`);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  
  /**
   * Carrega OBJ
   */
  private loadOBJ(url: string): Promise<THREE.Object3D> {
    return new Promise((resolve, reject) => {
      this.objLoader.load(
        url,
        (obj) => {
          resolve(obj);
        },
        (progress) => {
          const percent = (progress.loaded / progress.total) * 100;
          console.log(`📥 Loading: ${percent.toFixed(2)}%`);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  
  /**
   * Carrega múltiplos assets em paralelo
   */
  public async loadMultiple(urls: string[]): Promise<THREE.Object3D[]> {
    console.log(`📦 Loading ${urls.length} assets in parallel...`);
    
    const promises = urls.map((url) => this.loadAsset(url));
    return Promise.all(promises);
  }
  
  /**
   * Carrega múltiplos assets sequencialmente
   */
  public async loadSequential(urls: string[]): Promise<THREE.Object3D[]> {
    console.log(`📦 Loading ${urls.length} assets sequentially...`);
    
    const results: THREE.Object3D[] = [];
    
    for (const url of urls) {
      const asset = await this.loadAsset(url);
      results.push(asset);
    }
    
    return results;
  }
  
  /**
   * Retorna extensão do arquivo
   */
  private getFileExtension(url: string): string {
    const match = url.match(/\.(\w+)(\?|$)/);
    return match ? match[1].toLowerCase() : '';
  }
  
  /**
   * Cancela carregamento de asset
   */
  public cancelLoad(assetId: string): void {
    if (this.loadingAssets.has(assetId)) {
      this.loadingAssets.delete(assetId);
      console.log(`🚫 Cancelled loading: ${assetId}`);
    }
  }
  
  /**
   * Retorna se asset está sendo carregado
   */
  public isLoading(assetId: string): boolean {
    return this.loadingAssets.has(assetId);
  }
  
  /**
   * Retorna lista de assets sendo carregados
   */
  public getLoadingAssets(): string[] {
    return Array.from(this.loadingAssets.keys());
  }
}
