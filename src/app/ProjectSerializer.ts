import * as THREE from 'three';
import { appController } from './AppController';

/**
 * ProjectSerializer - Serialização e deserialização de projetos
 * 
 * Salva e carrega projetos em formato JSON com suporte a:
 * - Cena 3D (objetos, materiais, geometrias)
 * - Estado da câmera
 * - Layers
 * - Configurações
 * - Metadados
 */

export interface ProjectData {
  meta: {
    version: string;
    name: string;
    description: string;
    created: number;
    modified: number;
    author?: string;
  };
  
  camera: {
    position: [number, number, number];
    rotation: [number, number, number];
    fov: number;
  };
  
  scene: {
    background: number;
    fog?: {
      color: number;
      near: number;
      far: number;
    };
  };
  
  objects: SerializedObject[];
  
  layers: SerializedLayer[];
  
  settings: {
    renderQuality: string;
    shadowsEnabled: boolean;
    navigationMode: string;
  };
  
  state: {
    selectedObjects: string[];
    activeTool: string;
    uiVisible: boolean;
    leftPanelOpen: boolean;
    rightInspectorOpen: boolean;
    bottomDockOpen: boolean;
  };
}

export interface SerializedObject {
  uuid: string;
  type: string;
  name: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  visible: boolean;
  userData: any;
  
  // Para meshes
  geometry?: {
    type: string;
    parameters?: any;
  };
  
  material?: {
    type: string;
    properties: any;
  };
  
  children: SerializedObject[];
}

export interface SerializedLayer {
  id: string;
  name: string;
  type: string;
  category: string;
  color: number;
  visible: boolean;
  locked: boolean;
  plotable: boolean;
  objectIds: string[];
}

/**
 * ProjectSerializer - Classe principal
 */
export class ProjectSerializer {
  private static instance: ProjectSerializer;
  
  private constructor() {
    console.log('💾 ProjectSerializer initialized');
  }
  
  public static getInstance(): ProjectSerializer {
    if (!ProjectSerializer.instance) {
      ProjectSerializer.instance = new ProjectSerializer();
    }
    return ProjectSerializer.instance;
  }
  
  /**
   * Serializa projeto atual
   */
  public serialize(
    scene: THREE.Scene,
    camera: THREE.Camera,
    projectName: string = 'Untitled'
  ): ProjectData {
    console.log('📦 Serializing project...');
    
    const state = appController.getState();
    
    // Serializa objetos da cena (exceto helpers)
    const objects = this.serializeSceneObjects(scene);
    
    // Serializa layers
    const layers = this.serializeLayers();
    
    // Cria estrutura do projeto
    const projectData: ProjectData = {
      meta: {
        version: '1.0.0',
        name: projectName,
        description: '',
        created: Date.now(),
        modified: Date.now(),
        author: 'ArxisVR'
      },
      
      camera: {
        position: [camera.position.x, camera.position.y, camera.position.z],
        rotation: [camera.rotation.x, camera.rotation.y, camera.rotation.z],
        fov: (camera as THREE.PerspectiveCamera).fov || 75
      },
      
      scene: {
        background: (scene.background as THREE.Color)?.getHex() || 0x87ceeb,
        fog: scene.fog ? {
          color: (scene.fog as THREE.Fog).color.getHex(),
          near: (scene.fog as THREE.Fog).near,
          far: (scene.fog as THREE.Fog).far
        } : undefined
      },
      
      objects,
      layers,
      
      settings: {
        renderQuality: state.graphicsSettings.quality,
        shadowsEnabled: state.graphicsSettings.shadowsEnabled,
        navigationMode: state.navigationMode
      },
      
      state: {
        selectedObjects: state.selectedObjects.map(item => item.object.uuid),
        activeTool: state.activeTool,
        uiVisible: state.uiVisible,
        leftPanelOpen: state.leftPanelOpen,
        rightInspectorOpen: state.rightInspectorOpen,
        bottomDockOpen: state.bottomDockOpen
      }
    };
    
    console.log(`✅ Project serialized: ${objects.length} objects, ${layers.length} layers`);
    
    return projectData;
  }
  
  /**
   * Deserializa projeto
   */
  public async deserialize(
    projectData: ProjectData,
    scene: THREE.Scene,
    camera: THREE.Camera
  ): Promise<void> {
    console.log(`📂 Deserializing project: ${projectData.meta.name}...`);
    
    try {
      // 1. Limpa cena atual (exceto luzes e helpers essenciais)
      this.clearScene(scene);
      
      // 2. Restaura configurações da cena
      if (projectData.scene.background !== undefined) {
        scene.background = new THREE.Color(projectData.scene.background);
      }
      
      if (projectData.scene.fog) {
        scene.fog = new THREE.Fog(
          projectData.scene.fog.color,
          projectData.scene.fog.near,
          projectData.scene.fog.far
        );
      }
      
      // 3. Restaura câmera
      camera.position.set(...projectData.camera.position);
      camera.rotation.set(...projectData.camera.rotation);
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.fov = projectData.camera.fov;
        camera.updateProjectionMatrix();
      }
      
      // 4. Restaura objetos
      for (const objData of projectData.objects) {
        const obj = this.deserializeObject(objData);
        if (obj) {
          scene.add(obj);
        }
      }
      
      // 5. Restaura layers
      this.deserializeLayers(projectData.layers);
      
      // 6. Restaura configurações
      appController.setRenderQuality(projectData.settings.renderQuality as any);
      appController.setNavigationMode(projectData.settings.navigationMode as any);
      
      // 7. Restaura estado da UI
      appController.setUIVisible(projectData.state.uiVisible);
      
      console.log('✅ Project loaded successfully');
      
    } catch (error) {
      console.error('❌ Failed to deserialize project:', error);
      throw error;
    }
  }
  
  /**
   * Serializa objetos da cena
   */
  private serializeSceneObjects(scene: THREE.Scene): SerializedObject[] {
    const objects: SerializedObject[] = [];
    
    scene.children.forEach(child => {
      // Ignora helpers e luzes (por enquanto)
      if (this.shouldSerializeObject(child)) {
        const serialized = this.serializeObject(child);
        if (serialized) {
          objects.push(serialized);
        }
      }
    });
    
    return objects;
  }
  
  /**
   * Verifica se objeto deve ser serializado
   */
  private shouldSerializeObject(object: THREE.Object3D): boolean {
    // Ignora helpers
    const ignoredTypes = ['GridHelper', 'AxesHelper', 'DirectionalLightHelper', 'PointLightHelper'];
    if (ignoredTypes.includes(object.type)) return false;
    
    // Ignora objetos com nomes específicos
    if (object.name && (object.name.includes('Helper') || object.name.includes('Grid'))) {
      return false;
    }
    
    return true;
  }
  
  /**
   * Serializa um objeto
   */
  private serializeObject(object: THREE.Object3D): SerializedObject | null {
    try {
      const serialized: SerializedObject = {
        uuid: object.uuid,
        type: object.type,
        name: object.name,
        position: [object.position.x, object.position.y, object.position.z],
        rotation: [object.rotation.x, object.rotation.y, object.rotation.z],
        scale: [object.scale.x, object.scale.y, object.scale.z],
        visible: object.visible,
        userData: JSON.parse(JSON.stringify(object.userData)), // Deep clone
        children: []
      };
      
      // Serializa geometria e material se for mesh
      if (object instanceof THREE.Mesh) {
        serialized.geometry = {
          type: object.geometry.type,
          parameters: (object.geometry as any).parameters
        };
        
        if (object.material) {
          serialized.material = {
            type: (object.material as THREE.Material).type,
            properties: this.serializeMaterial(object.material as THREE.Material)
          };
        }
      }
      
      // Serializa filhos recursivamente
      object.children.forEach(child => {
        if (this.shouldSerializeObject(child)) {
          const childSerialized = this.serializeObject(child);
          if (childSerialized) {
            serialized.children.push(childSerialized);
          }
        }
      });
      
      return serialized;
      
    } catch (error) {
      console.warn(`⚠️ Failed to serialize object ${object.name}:`, error);
      return null;
    }
  }
  
  /**
   * Serializa material
   */
  private serializeMaterial(material: THREE.Material): any {
    const props: any = {
      color: (material as any).color?.getHex(),
      opacity: material.opacity,
      transparent: material.transparent,
      visible: material.visible
    };
    
    if (material instanceof THREE.MeshStandardMaterial) {
      props.metalness = material.metalness;
      props.roughness = material.roughness;
      props.emissive = material.emissive.getHex();
      props.emissiveIntensity = material.emissiveIntensity;
    }
    
    return props;
  }
  
  /**
   * Deserializa objeto
   */
  private deserializeObject(data: SerializedObject): THREE.Object3D | null {
    try {
      let object: THREE.Object3D;
      
      // Cria objeto baseado no tipo
      if (data.type === 'Mesh' && data.geometry && data.material) {
        // Cria geometria
        const geometry = this.createGeometry(data.geometry);
        
        // Cria material
        const material = this.createMaterial(data.material);
        
        object = new THREE.Mesh(geometry, material);
      } else {
        // Objeto genérico
        object = new THREE.Object3D();
      }
      
      // Restaura propriedades
      object.uuid = data.uuid;
      object.name = data.name;
      object.position.set(...data.position);
      object.rotation.set(...data.rotation);
      object.scale.set(...data.scale);
      object.visible = data.visible;
      object.userData = JSON.parse(JSON.stringify(data.userData));
      
      // Deserializa filhos recursivamente
      data.children.forEach(childData => {
        const child = this.deserializeObject(childData);
        if (child) {
          object.add(child);
        }
      });
      
      return object;
      
    } catch (error) {
      console.warn(`⚠️ Failed to deserialize object ${data.name}:`, error);
      return null;
    }
  }
  
  /**
   * Cria geometria a partir de dados serializados
   */
  private createGeometry(data: any): THREE.BufferGeometry {
    // Por enquanto, cria geometria padrão
    // TODO: Implementar deserialização completa de geometrias
    return new THREE.BoxGeometry(1, 1, 1);
  }
  
  /**
   * Cria material a partir de dados serializados
   */
  private createMaterial(data: any): THREE.Material {
    const props = data.properties;
    
    if (data.type === 'MeshStandardMaterial') {
      return new THREE.MeshStandardMaterial({
        color: props.color,
        metalness: props.metalness,
        roughness: props.roughness,
        emissive: props.emissive,
        emissiveIntensity: props.emissiveIntensity,
        opacity: props.opacity,
        transparent: props.transparent
      });
    }
    
    // Material padrão
    return new THREE.MeshStandardMaterial({
      color: props.color || 0xffffff
    });
  }
  
  /**
   * Serializa layers
   */
  private serializeLayers(): SerializedLayer[] {
    const layers = appController.getLayers();
    
    return layers.map(layer => ({
      id: layer.id,
      name: layer.name,
      type: 'default', // Layer type não existe no tipo Layer atual
      category: 'general', // Category não existe no tipo Layer atual
      color: layer.color || '#ffffff',
      visible: layer.visible,
      locked: layer.locked,
      plotable: true, // Plotable não existe no tipo Layer atual
      objectIds: [] // Objects não existe no tipo Layer atual
    }));
  }
  
  /**
   * Deserializa layers
   */
  private deserializeLayers(layersData: SerializedLayer[]): void {
    // TODO: Implementar deserialização de layers
    console.log(`ℹ️ Layer deserialization not fully implemented yet`);
  }
  
  /**
   * Limpa cena (mantém apenas essenciais)
   */
  private clearScene(scene: THREE.Scene): void {
    const toRemove: THREE.Object3D[] = [];
    
    scene.children.forEach(child => {
      if (this.shouldSerializeObject(child)) {
        toRemove.push(child);
      }
    });
    
    toRemove.forEach(obj => scene.remove(obj));
    
    console.log(`🧹 Cleared ${toRemove.length} objects from scene`);
  }
  
  /**
   * Salva projeto em arquivo JSON
   */
  public saveToFile(projectData: ProjectData, filename?: string): void {
    const json = JSON.stringify(projectData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `${projectData.meta.name}.arxis.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    
    console.log(`💾 Project saved: ${a.download}`);
  }
  
  /**
   * Carrega projeto de arquivo JSON
   */
  public async loadFromFile(file: File): Promise<ProjectData> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const json = e.target?.result as string;
          const projectData = JSON.parse(json) as ProjectData;
          
          // Valida estrutura básica
          if (!projectData.meta || !projectData.meta.version) {
            throw new Error('Invalid project file format');
          }
          
          console.log(`📂 Project loaded from file: ${projectData.meta.name}`);
          resolve(projectData);
          
        } catch (error) {
          console.error('❌ Failed to parse project file:', error);
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsText(file);
    });
  }
}

// Export singleton
export const projectSerializer = ProjectSerializer.getInstance();
