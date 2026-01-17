import * as THREE from 'three';
import { assetManager } from '../../engine/streaming';
import { eventBus, EventType } from '../EventBus';

/**
 * AssetReloader - Hot-reload de assets 3D
 * Integra com AssetManager para substituir assets sem reiniciar
 * 
 * Features:
 * - Mantém posição, rotação, escala
 * - Preserva LOD e cache
 * - Memory-safe (libera asset antigo)
 * - Mantém referências na cena
 */
export class AssetReloader {
  private scene: THREE.Scene;
  private assetRegistry: Map<string, {
    object: THREE.Object3D;
    originalPath: string;
    parent: THREE.Object3D | null;
  }> = new Map();
  
  // Sistema de versionamento
  private assetVersions: Map<string, number> = new Map();
  
  constructor(scene: THREE.Scene) {
    this.scene = scene;
    console.log('🔄 Asset Reloader initialized');
  }
  
  /**
   * Registra asset para hot-reload
   */
  public registerAsset(assetId: string, object: THREE.Object3D, path: string): void {
    this.assetRegistry.set(assetId, {
      object,
      originalPath: path,
      parent: object.parent
    });
    
    console.log(`📝 Registered for reload: ${assetId}`);
  }
  
  /**
   * Recarrega asset
   */
  public async reloadAsset(assetId: string): Promise<void> {
    const startTime = Date.now();
    
    const entry = this.assetRegistry.get(assetId);
    if (!entry) {
      console.warn(`⚠️ Asset not registered: ${assetId}`);
      return;
    }
    
    console.log(`🔄 Reloading asset: ${assetId}`);
    
    eventBus.emit(EventType.MODEL_LOADING, { fileName: assetId });
    
    try {
      // Incrementa versão para evitar cache do browser
      const version = (this.assetVersions.get(assetId) || 0) + 1;
      this.assetVersions.set(assetId, version);
      
      // Adiciona version ao caminho
      const pathWithVersion = `${entry.originalPath}${entry.originalPath.includes('?') ? '&' : '?'}v=${version}`;
      
      console.log(`📦 Loading version ${version} of ${assetId}`);
      
      // Salva estado atual
      const oldObject = entry.object;
      const position = oldObject.position.clone();
      const rotation = oldObject.rotation.clone();
      const scale = oldObject.scale.clone();
      const visible = oldObject.visible;
      const parent = entry.parent;
      
      // Carrega novo asset com versão
      const newObject = await assetManager.loadAsset(pathWithVersion, `${assetId}_v${version}`, {
        useCache: false, // Força reload
        createLOD: true
      });
      
      // Aplica estado antigo
      newObject.position.copy(position);
      newObject.rotation.copy(rotation);
      newObject.scale.copy(scale);
      newObject.visible = visible;
      newObject.name = oldObject.name;
      
      // Substitui na cena
      if (parent) {
        const index = parent.children.indexOf(oldObject);
        parent.remove(oldObject);
        parent.children.splice(index, 0, newObject);
        newObject.parent = parent;
      } else {
        this.scene.remove(oldObject);
        this.scene.add(newObject);
      }
      
      // Atualiza registro
      entry.object = newObject;
      
      // Dispose do objeto antigo
      this.disposeObject(oldObject);
      
      const duration = Date.now() - startTime;
      
      eventBus.emit(EventType.MODEL_LOADED, {
        object: newObject,
        fileName: assetId
      });
      
      console.log(`✅ Asset reloaded: ${assetId} (${duration}ms)`);
      
    } catch (error) {
      eventBus.emit(EventType.MODEL_ERROR, {
        error: error as Error,
        fileName: assetId
      });
      
      console.error(`❌ Failed to reload asset: ${assetId}`, error);
    }
  }
  
  /**
   * Recarrega asset por caminho
   */
  public async reloadAssetByPath(path: string): Promise<void> {
    // Procura asset pelo caminho
    for (const [assetId, entry] of this.assetRegistry.entries()) {
      if (entry.originalPath === path) {
        await this.reloadAsset(assetId);
        return;
      }
    }
    
    console.warn(`⚠️ No asset found for path: ${path}`);
  }
  
  /**
   * Recarrega múltiplos assets
   */
  public async reloadMultiple(assetIds: string[]): Promise<void> {
    console.log(`🔄 Reloading ${assetIds.length} assets...`);
    
    const promises = assetIds.map((id) => this.reloadAsset(id));
    await Promise.all(promises);
    
    console.log(`✅ Reloaded ${assetIds.length} assets`);
  }
  
  /**
   * Remove asset do registro
   */
  public unregisterAsset(assetId: string): void {
    this.assetRegistry.delete(assetId);
    console.log(`🗑️ Unregistered: ${assetId}`);
  }
  
  /**
   * Dispose de objeto THREE
   */
  private disposeObject(object: THREE.Object3D): void {
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.geometry) {
          child.geometry.dispose();
        }
        
        if (child.material) {
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((material) => {
            material.dispose();
            
            // Dispose texturas
            if (material instanceof THREE.MeshStandardMaterial) {
              const maps = [
                material.map,
                material.normalMap,
                material.roughnessMap,
                material.metalnessMap,
                material.aoMap,
                material.emissiveMap
              ];
              
              maps.forEach((map) => {
                if (map) map.dispose();
              });
            }
          });
        }
      }
    });
  }
  
  /**
   * Limpa todos os registros
   */
  public clear(): void {
    this.assetRegistry.clear();
    this.assetVersions.clear();
    console.log('🧹 Asset registry cleared');
  }
  
  /**
   * Retorna versão de um asset
   */
  public getAssetVersion(assetId: string): number {
    return this.assetVersions.get(assetId) || 0;
  }
  
  /**
   * Retorna todas as versões
   */
  public getAllVersions(): Map<string, number> {
    return new Map(this.assetVersions);
  }
  
  /**
   * Retorna estatísticas
   */
  public getStats(): {
    registeredAssets: number;
    assets: string[];
    versions: Record<string, number>;
  } {
    const versions: Record<string, number> = {};
    this.assetVersions.forEach((version, assetId) => {
      versions[assetId] = version;
    });
    
    return {
      registeredAssets: this.assetRegistry.size,
      assets: Array.from(this.assetRegistry.keys()),
      versions
    };
  }
  
  /**
   * Imprime estatísticas
   */
  public printStats(): void {
    const stats = this.getStats();
    console.log('📊 Asset Reloader Stats:');
    console.log(`   Registered Assets: ${stats.registeredAssets}`);
    if (stats.assets.length > 0) {
      console.log('   Assets:', stats.assets.join(', '));
      console.log('   Versions:');
      Object.entries(stats.versions).forEach(([id, version]) => {
        console.log(`      ${id}: v${version}`);
      });
    }
  }
}
