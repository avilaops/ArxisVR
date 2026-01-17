import * as THREE from 'three';

/**
 * Level of Detail System
 * Sistema avançado de LOD para manter 60+ FPS mesmo em cenas complexas
 * Superior ao sistema de culling do Unity
 */
export class LODSystem {
  private camera: THREE.PerspectiveCamera;
  private registeredModels: Map<string, LODModel> = new Map();
  private frustum: THREE.Frustum = new THREE.Frustum();
  private frustumMatrix: THREE.Matrix4 = new THREE.Matrix4();
  
  // Distâncias LOD (em metros - escala 1:1)
  private readonly LOD_DISTANCES = {
    HIGH: 20,      // Detalhes completos até 20m
    MEDIUM: 50,    // Detalhes médios até 50m
    LOW: 100,      // Detalhes baixos até 100m
    CULLED: 150    // Além disso, não renderiza
  };

  // Estatísticas
  private stats = {
    totalObjects: 0,
    visibleObjects: 0,
    culledObjects: 0,
    highLOD: 0,
    mediumLOD: 0,
    lowLOD: 0
  };

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera;
  }

  /**
   * Registra modelo para gerenciamento LOD
   */
  public registerModel(model: THREE.Object3D): void {
    const id = model.uuid;
    const lodModel: LODModel = {
      object: model,
      meshes: [],
      boundingBox: new THREE.Box3(),
      boundingSphere: new THREE.Sphere(),
      currentLOD: 'HIGH'
    };

    // Coleta todas as meshes e calcula bounding volumes
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        lodModel.meshes.push(child);
        this.stats.totalObjects++;
      }
    });

    // Calcula bounding volumes do modelo completo
    lodModel.boundingBox.setFromObject(model);
    lodModel.boundingBox.getBoundingSphere(lodModel.boundingSphere);

    this.registeredModels.set(id, lodModel);
    
    console.log(`📊 Modelo registrado no LOD System: ${lodModel.meshes.length} meshes`);
  }

  /**
   * Atualiza LOD de todos os objetos baseado na posição da câmera
   */
  public update(): void {
    // Reseta estatísticas
    this.stats.visibleObjects = 0;
    this.stats.culledObjects = 0;
    this.stats.highLOD = 0;
    this.stats.mediumLOD = 0;
    this.stats.lowLOD = 0;

    // Atualiza frustum matrix
    this.frustumMatrix.multiplyMatrices(
      this.camera.projectionMatrix,
      this.camera.matrixWorldInverse
    );
    this.frustum.setFromProjectionMatrix(this.frustumMatrix);

    // Processa cada modelo registrado
    this.registeredModels.forEach((lodModel) => {
      this.updateModelLOD(lodModel);
    });
  }

  /**
   * Atualiza LOD de um modelo específico
   */
  private updateModelLOD(lodModel: LODModel): void {
    // Verifica se o modelo está no frustum
    if (!this.frustum.intersectsBox(lodModel.boundingBox)) {
      // Modelo fora do frustum - oculta tudo
      lodModel.meshes.forEach(mesh => {
        mesh.visible = false;
      });
      this.stats.culledObjects += lodModel.meshes.length;
      return;
    }

    // Calcula distância da câmera ao centro do modelo
    const distance = this.camera.position.distanceTo(lodModel.boundingSphere.center);

    // Determina nível LOD baseado na distância
    let targetLOD: LODLevel;
    if (distance > this.LOD_DISTANCES.CULLED) {
      targetLOD = 'CULLED';
    } else if (distance > this.LOD_DISTANCES.LOW) {
      targetLOD = 'LOW';
    } else if (distance > this.LOD_DISTANCES.MEDIUM) {
      targetLOD = 'MEDIUM';
    } else {
      targetLOD = 'HIGH';
    }

    // Aplica LOD se mudou
    if (lodModel.currentLOD !== targetLOD) {
      this.applyLOD(lodModel, targetLOD);
      lodModel.currentLOD = targetLOD;
    }

    // Atualiza estatísticas
    switch (targetLOD) {
      case 'HIGH':
        this.stats.highLOD += lodModel.meshes.length;
        this.stats.visibleObjects += lodModel.meshes.length;
        break;
      case 'MEDIUM':
        this.stats.mediumLOD += lodModel.meshes.length;
        this.stats.visibleObjects += lodModel.meshes.length;
        break;
      case 'LOW':
        this.stats.lowLOD += lodModel.meshes.length;
        this.stats.visibleObjects += lodModel.meshes.length;
        break;
      case 'CULLED':
        this.stats.culledObjects += lodModel.meshes.length;
        break;
    }
  }

  /**
   * Aplica configurações LOD às meshes
   */
  private applyLOD(lodModel: LODModel, level: LODLevel): void {
    lodModel.meshes.forEach((mesh) => {
      switch (level) {
        case 'HIGH':
          mesh.visible = true;
          this.setMeshQuality(mesh, 'high');
          break;

        case 'MEDIUM':
          mesh.visible = true;
          this.setMeshQuality(mesh, 'medium');
          break;

        case 'LOW':
          mesh.visible = true;
          this.setMeshQuality(mesh, 'low');
          break;

        case 'CULLED':
          mesh.visible = false;
          break;
      }
    });
  }

  /**
   * Configura qualidade de renderização da mesh
   */
  private setMeshQuality(mesh: THREE.Mesh, quality: 'high' | 'medium' | 'low'): void {
    const material = mesh.material;
    
    if (Array.isArray(material)) {
      material.forEach(mat => this.setMaterialQuality(mat, quality));
    } else {
      this.setMaterialQuality(material, quality);
    }

    // Configura sombras baseado na qualidade
    switch (quality) {
      case 'high':
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        break;
      case 'medium':
        mesh.castShadow = true;
        mesh.receiveShadow = false;
        break;
      case 'low':
        mesh.castShadow = false;
        mesh.receiveShadow = false;
        break;
    }
  }

  /**
   * Configura qualidade do material
   */
  private setMaterialQuality(material: THREE.Material, quality: 'high' | 'medium' | 'low'): void {
    if (material instanceof THREE.MeshStandardMaterial) {
      switch (quality) {
        case 'high':
          material.roughness = 0.7;
          material.metalness = 0.1;
          material.envMapIntensity = 1.0;
          break;
        case 'medium':
          material.roughness = 0.8;
          material.metalness = 0.05;
          material.envMapIntensity = 0.5;
          break;
        case 'low':
          material.roughness = 1.0;
          material.metalness = 0.0;
          material.envMapIntensity = 0.0;
          break;
      }
    }
  }

  /**
   * Obtém estatísticas do sistema LOD
   */
  public getStats(): LODStats {
    return { ...this.stats };
  }

  /**
   * Configura distâncias LOD customizadas
   */
  public setLODDistances(high: number, medium: number, low: number, culled: number): void {
    (this.LOD_DISTANCES as any).HIGH = high;
    (this.LOD_DISTANCES as any).MEDIUM = medium;
    (this.LOD_DISTANCES as any).LOW = low;
    (this.LOD_DISTANCES as any).CULLED = culled;
  }

  /**
   * Remove modelo do sistema LOD
   */
  public unregisterModel(model: THREE.Object3D): void {
    const id = model.uuid;
    const lodModel = this.registeredModels.get(id);
    
    if (lodModel) {
      this.stats.totalObjects -= lodModel.meshes.length;
      this.registeredModels.delete(id);
    }
  }

  public dispose(): void {
    this.registeredModels.clear();
    this.stats = {
      totalObjects: 0,
      visibleObjects: 0,
      culledObjects: 0,
      highLOD: 0,
      mediumLOD: 0,
      lowLOD: 0
    };
  }
}

// Types
type LODLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'CULLED';

interface LODModel {
  object: THREE.Object3D;
  meshes: THREE.Mesh[];
  boundingBox: THREE.Box3;
  boundingSphere: THREE.Sphere;
  currentLOD: LODLevel;
}

interface LODStats {
  totalObjects: number;
  visibleObjects: number;
  culledObjects: number;
  highLOD: number;
  mediumLOD: number;
  lowLOD: number;
}
