import * as THREE from 'three';
import { eventBus, EventType } from '../core';

/**
 * Tipo de plano de seção
 */
export enum SectionType {
  X_AXIS = 'x-axis',
  Y_AXIS = 'y-axis',
  Z_AXIS = 'z-axis',
  CUSTOM = 'custom'
}

/**
 * Interface de um plano de seção
 */
export interface Section {
  id: string;
  name: string;
  type: SectionType;
  plane: THREE.Plane;
  helper: THREE.PlaneHelper | null;
  visible: boolean;
  enabled: boolean;
}

/**
 * Opções visuais para seções
 */
export interface SectionVisualOptions {
  showSectionLines: boolean;
  showClippingPlanes: boolean;
  sectionLineColor: string;
  sectionLineWidth: number;
  fillColor: string;
  fillOpacity: number;
}

/**
 * SectionManager - Gerencia planos de seção e clipping
 * Implementa SUB-EPIC 1.3 - Seções, Cortes e Clipping
 */
export class SectionManager {
  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer | null;
  
  // Seções ativas
  private sections: Map<string, Section> = new Map();
  private clippingPlanes: THREE.Plane[] = [];
  
  // Opções visuais
  private visualOptions: SectionVisualOptions = {
    showSectionLines: true,
    showClippingPlanes: true,
    sectionLineColor: '#ff0000',
    sectionLineWidth: 2,
    fillColor: '#ffff00',
    fillOpacity: 0.3
  };

  // Seção ativa para edição
  private activeSection: Section | null = null;

  constructor(scene: THREE.Scene, renderer?: THREE.WebGLRenderer | null) {
    this.scene = scene;
    this.renderer = renderer || null;
    
    console.log('✂️ SectionManager initialized');
  }

  /**
   * Cria uma nova seção no eixo especificado
   */
  public createSection(type: SectionType, position: number = 0): Section {
    const id = `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    let plane: THREE.Plane;
    let name: string;
    
    switch (type) {
      case SectionType.X_AXIS:
        plane = new THREE.Plane(new THREE.Vector3(1, 0, 0), -position);
        name = `Section X (${position.toFixed(2)})`;
        break;
      case SectionType.Y_AXIS:
        plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -position);
        name = `Section Y (${position.toFixed(2)})`;
        break;
      case SectionType.Z_AXIS:
        plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -position);
        name = `Section Z (${position.toFixed(2)})`;
        break;
      default:
        plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -position);
        name = `Custom Section`;
    }

    const section: Section = {
      id,
      name,
      type,
      plane,
      helper: null,
      visible: true,
      enabled: true
    };

    // Cria helper visual
    if (this.visualOptions.showClippingPlanes) {
      section.helper = new THREE.PlaneHelper(plane, 20, 0xff0000);
      this.scene.add(section.helper);
    }

    this.sections.set(id, section);
    this.updateClippingPlanes();
    
    eventBus.emit(EventType.SECTION_CREATED, section);
    console.log(`✂️ Section created: ${name}`);
    
    return section;
  }

  /**
   * Remove uma seção
   */
  public removeSection(sectionId: string): void {
    const section = this.sections.get(sectionId);
    if (!section) return;

    // Remove helper da cena
    if (section.helper) {
      this.scene.remove(section.helper);
      section.helper.geometry.dispose();
      (section.helper.material as THREE.Material).dispose();
    }

    this.sections.delete(sectionId);
    this.updateClippingPlanes();
    
    eventBus.emit(EventType.SECTION_REMOVED, sectionId);
    console.log(`✂️ Section removed: ${section.name}`);
  }

  /**
   * Atualiza a posição de uma seção
   */
  public updateSectionPosition(sectionId: string, position: number): void {
    const section = this.sections.get(sectionId);
    if (!section) return;

    section.plane.constant = -position;
    
    // Atualiza helper
    if (section.helper) {
      section.helper.updateMatrixWorld(true);
    }

    this.updateClippingPlanes();
    eventBus.emit(EventType.SECTION_UPDATED, section);
  }

  /**
   * Inverte a direção de uma seção
   */
  public flipSection(sectionId: string): void {
    const section = this.sections.get(sectionId);
    if (!section) return;

    section.plane.normal.negate();
    section.plane.constant = -section.plane.constant;
    
    if (section.helper) {
      this.scene.remove(section.helper);
      section.helper.geometry.dispose();
      (section.helper.material as THREE.Material).dispose();
      
      section.helper = new THREE.PlaneHelper(section.plane, 20, 0xff0000);
      this.scene.add(section.helper);
    }

    this.updateClippingPlanes();
    eventBus.emit(EventType.SECTION_UPDATED, section);
    console.log(`✂️ Section flipped: ${section.name}`);
  }

  /**
   * Ativa/desativa uma seção
   */
  public toggleSection(sectionId: string, enabled: boolean): void {
    const section = this.sections.get(sectionId);
    if (!section) return;

    section.enabled = enabled;
    
    if (section.helper) {
      section.helper.visible = enabled && section.visible;
    }

    this.updateClippingPlanes();
    eventBus.emit(EventType.SECTION_TOGGLED, { sectionId, enabled });
  }

  /**
   * Mostra/oculta o helper visual de uma seção
   */
  public toggleSectionVisibility(sectionId: string, visible: boolean): void {
    const section = this.sections.get(sectionId);
    if (!section) return;

    section.visible = visible;
    
    if (section.helper) {
      section.helper.visible = visible && section.enabled;
    }
  }

  /**
   * Atualiza os planos de clipping do renderer
   */
  private updateClippingPlanes(): void {
    this.clippingPlanes = Array.from(this.sections.values())
      .filter(section => section.enabled)
      .map(section => section.plane);

    // Atualiza renderer se disponível
    if (this.renderer) {
      this.renderer.clippingPlanes = this.clippingPlanes;
      this.renderer.localClippingEnabled = this.clippingPlanes.length > 0;
    }

    // Atualiza materiais dos objetos da cena
    this.scene.traverse((object) => {
      if ((object as THREE.Mesh).isMesh) {
        const mesh = object as THREE.Mesh;
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat) => {
            mat.clippingPlanes = this.clippingPlanes;
          });
        } else if (mesh.material) {
          mesh.material.clippingPlanes = this.clippingPlanes;
        }
      }
    });
  }

  /**
   * Remove todas as seções
   */
  public clearSections(): void {
    this.sections.forEach((section) => {
      if (section.helper) {
        this.scene.remove(section.helper);
        section.helper.geometry.dispose();
        (section.helper.material as THREE.Material).dispose();
      }
    });

    this.sections.clear();
    this.updateClippingPlanes();
    
    eventBus.emit(EventType.SECTIONS_CLEARED);
    console.log('✂️ All sections cleared');
  }

  /**
   * Obtém todas as seções
   */
  public getSections(): Section[] {
    return Array.from(this.sections.values());
  }

  /**
   * Obtém uma seção específica
   */
  public getSection(sectionId: string): Section | undefined {
    return this.sections.get(sectionId);
  }

  /**
   * Atualiza opções visuais
   */
  public updateVisualOptions(options: Partial<SectionVisualOptions>): void {
    this.visualOptions = { ...this.visualOptions, ...options };
    
    // Atualiza helpers
    this.sections.forEach((section) => {
      if (this.visualOptions.showClippingPlanes && !section.helper) {
        section.helper = new THREE.PlaneHelper(section.plane, 20, 0xff0000);
        this.scene.add(section.helper);
      } else if (!this.visualOptions.showClippingPlanes && section.helper) {
        this.scene.remove(section.helper);
        section.helper.geometry.dispose();
        (section.helper.material as THREE.Material).dispose();
        section.helper = null;
      }
    });

    eventBus.emit(EventType.SECTION_VISUAL_OPTIONS_UPDATED, this.visualOptions);
  }

  /**
   * Obtém opções visuais atuais
   */
  public getVisualOptions(): SectionVisualOptions {
    return { ...this.visualOptions };
  }

  /**
   * Define a seção ativa para edição
   */
  public setActiveSection(sectionId: string | null): void {
    if (sectionId === null) {
      this.activeSection = null;
      return;
    }

    const section = this.sections.get(sectionId);
    if (section) {
      this.activeSection = section;
      eventBus.emit(EventType.SECTION_ACTIVATED, section);
    }
  }

  /**
   * Obtém a seção ativa
   */
  public getActiveSection(): Section | null {
    return this.activeSection;
  }

  /**
   * Cria preset de box clipping
   */
  public createBoxClipping(min: THREE.Vector3, max: THREE.Vector3): void {
    this.clearSections();
    
    // Cria 6 planos para formar um box
    this.createSection(SectionType.X_AXIS, max.x);
    this.createSection(SectionType.X_AXIS, -min.x);
    this.createSection(SectionType.Y_AXIS, max.y);
    this.createSection(SectionType.Y_AXIS, -min.y);
    this.createSection(SectionType.Z_AXIS, max.z);
    this.createSection(SectionType.Z_AXIS, -min.z);
    
    console.log('✂️ Box clipping created');
  }

  /**
   * Cleanup
   */
  public dispose(): void {
    this.clearSections();
    console.log('✂️ SectionManager disposed');
  }
}
