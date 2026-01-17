import * as THREE from 'three';

/**
 * Tipos de elementos IFC para categorização automática
 */
export enum IFCElementType {
  WALL = 'IFCWALL',
  SLAB = 'IFCSLAB',
  BEAM = 'IFCBEAM',
  COLUMN = 'IFCCOLUMN',
  DOOR = 'IFCDOOR',
  WINDOW = 'IFCWINDOW',
  ROOF = 'IFCROOF',
  STAIR = 'IFCSTAIR',
  RAILING = 'IFCRAILING',
  FURNITURE = 'IFCFURNISHINGELEMENT',
  SPACE = 'IFCSPACE',
  SITE = 'IFCSITE',
  BUILDING = 'IFCBUILDING',
  FLOOR = 'IFCBUILDINGSTOREY',
  OTHER = 'OTHER'
}

/**
 * Modos de mesclagem (inspirado no Photoshop)
 */
export enum BlendMode {
  NORMAL = 'normal',
  MULTIPLY = 'multiply',
  SCREEN = 'screen',
  OVERLAY = 'overlay',
  ADD = 'add'
}

/**
 * Configuração de cor para layers
 */
export interface LayerColor {
  base: THREE.Color;
  emissive?: THREE.Color;
  selected?: THREE.Color;
}

/**
 * Interface principal de Layer
 * Combina características do AutoCAD e Photoshop
 */
export interface ILayer {
  // Identificação
  id: string;
  name: string;
  description?: string;
  
  // Organização (AutoCAD-style)
  type: IFCElementType | string;
  category?: string; // "Arquitetura", "Estrutura", "MEP", etc
  discipline?: string;
  
  // Propriedades visuais (Photoshop-style)
  color: LayerColor;
  opacity: number; // 0-1
  blendMode: BlendMode;
  
  // Controle de estado (AutoCAD-style)
  visible: boolean;
  frozen: boolean; // Não renderiza (economia de performance)
  locked: boolean; // Não editável/selecionável
  isolated: boolean; // Modo isolado (só este layer visível)
  
  // Impressão/Exportação (AutoCAD-style)
  plotable: boolean; // Imprime/exporta
  
  // Hierarquia (Photoshop-style)
  parentId?: string;
  children?: string[];
  expanded?: boolean; // Para grupos
  
  // Objetos 3D
  objects: THREE.Object3D[];
  objectIds: Set<string>; // UUIDs dos objetos
  
  // Metadados
  count: number; // Número de objetos
  created: Date;
  modified: Date;
  
  // Material override
  materialOverride?: THREE.Material;
  
  // Filtros e seleção
  selectable: boolean;
  highlightable: boolean;
}

/**
 * Configuração para criação de layer
 */
export interface LayerConfig {
  name: string;
  type?: IFCElementType | string;
  category?: string;
  color?: THREE.Color | number;
  opacity?: number;
  visible?: boolean;
  locked?: boolean;
  plotable?: boolean;
  parentId?: string;
}

/**
 * Grupo de layers (como pasta no Photoshop)
 */
export interface LayerGroup extends ILayer {
  isGroup: true;
  children: string[];
}

/**
 * Preset de layer (configurações pré-definidas)
 */
export interface LayerPreset {
  name: string;
  description: string;
  layers: LayerConfig[];
}

/**
 * Filtro de layers
 */
export interface LayerFilter {
  types?: IFCElementType[];
  categories?: string[];
  visible?: boolean;
  locked?: boolean;
  searchTerm?: string;
}

/**
 * Estatísticas de layer
 */
export interface LayerStats {
  totalLayers: number;
  visibleLayers: number;
  frozenLayers: number;
  lockedLayers: number;
  totalObjects: number;
  visibleObjects: number;
  byType: Map<IFCElementType | string, number>;
}

/**
 * Evento de mudança de layer
 */
export interface LayerChangeEvent {
  type: 'visibility' | 'opacity' | 'color' | 'lock' | 'freeze' | 'add' | 'remove' | 'modify';
  layerId: string;
  oldValue?: any;
  newValue?: any;
  timestamp: Date;
}

/**
 * Configuração de salvamento
 */
export interface LayerConfiguration {
  version: string;
  timestamp: Date;
  layers: ILayer[];
  groups: LayerGroup[];
  activeLayerId?: string;
}
