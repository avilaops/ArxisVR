import * as THREE from 'three';
import { SectionPlane } from './SectionPlane';

/**
 * ClippingGeometry - Gerencia planos de clipping para seções e cortes 3D
 *
 * Suporte a múltiplos planos de clipping simultâneos:
 * - Section planes (X, Y, Z) para visualização de seções
 * - Clipping planes para ocultar partes do modelo
 * - Visual feedback com linhas de seção
 */
export class ClippingGeometry {
  private planes: SectionPlane[] = [];
  private sectionLines: THREE.Group = new THREE.Group();
  private clippingEnabled: boolean = true;

  // Configurações visuais
  private sectionLineMaterial = new THREE.LineBasicMaterial({
    color: 0xff0000,
    linewidth: 2,
    transparent: true,
    opacity: 0.8
  });

  private sectionFillMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    transparent: true,
    opacity: 0.1,
    side: THREE.DoubleSide
  });

  constructor(private scene: THREE.Scene) {
    this.sectionLines.name = 'ClippingSectionLines';
    this.scene.add(this.sectionLines);
  }

  /**
   * Adiciona um plano de seção
   */
  addSectionPlane(axis: 'x' | 'y' | 'z', position: number, showLines: boolean = true): SectionPlane {
    // Remove plano existente no mesmo eixo
    this.removeSectionPlane(axis);

    const plane = new SectionPlane(axis, position);
    this.planes.push(plane);

    if (showLines) {
      this.createSectionLines(plane);
    }

    this.updateSceneClipping();
    console.log(`🎯 Added section plane: ${axis.toUpperCase()} = ${position}`);

    return plane;
  }

  /**
   * Remove um plano de seção
   */
  removeSectionPlane(axis: 'x' | 'y' | 'z'): boolean {
    const index = this.planes.findIndex(p => p.axis === axis);
    if (index === -1) return false;

    const plane = this.planes[index];
    this.planes.splice(index, 1);

    // Remove linhas visuais
    this.removeSectionLines(plane);

    this.updateSceneClipping();
    console.log(`🗑️ Removed section plane: ${axis.toUpperCase()}`);

    return true;
  }

  /**
   * Atualiza posição de um plano existente
   */
  updateSectionPlane(axis: 'x' | 'y' | 'z', position: number): boolean {
    const plane = this.planes.find(p => p.axis === axis);
    if (!plane) return false;

    plane.position = position;
    this.updateSectionLines(plane);
    this.updateSceneClipping();

    return true;
  }

  /**
   * Toggle clipping on/off
   */
  setClippingEnabled(enabled: boolean): void {
    this.clippingEnabled = enabled;
    this.updateSceneClipping();
    console.log(`✂️ Clipping ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Limpa todos os planos
   */
  clearAll(): void {
    this.planes.forEach(plane => this.removeSectionLines(plane));
    this.planes = [];
    this.updateSceneClipping();
    console.log('🧹 Cleared all clipping planes');
  }

  /**
   * Retorna todos os planos ativos
   */
  getPlanes(): SectionPlane[] {
    return [...this.planes];
  }

  /**
   * Verifica se um plano existe
   */
  hasPlane(axis: 'x' | 'y' | 'z'): boolean {
    return this.planes.some(p => p.axis === axis);
  }

  /**
   * Obtém posição de um plano
   */
  getPlanePosition(axis: 'x' | 'y' | 'z'): number | null {
    const plane = this.planes.find(p => p.axis === axis);
    return plane ? plane.position : null;
  }

  // ========== PRIVATE METHODS ==========

  private createSectionLines(plane: SectionPlane): void {
    // Cria geometria de linha infinita no plano
    const geometry = new THREE.BufferGeometry();
    const positions: number[] = [];

    // Define pontos da linha baseado no eixo
    const size = 1000; // Tamanho arbitrário grande
    switch (plane.axis) {
      case 'x':
        positions.push(
          plane.position, -size, -size,
          plane.position, -size, size,
          plane.position, size, size,
          plane.position, size, -size
        );
        break;
      case 'y':
        positions.push(
          -size, plane.position, -size,
          -size, plane.position, size,
          size, plane.position, size,
          size, plane.position, -size
        );
        break;
      case 'z':
        positions.push(
          -size, -size, plane.position,
          -size, size, plane.position,
          size, size, plane.position,
          size, -size, plane.position
        );
        break;
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    const line = new THREE.Line(geometry, this.sectionLineMaterial);
    line.name = `SectionLine_${plane.axis}`;
    line.userData = { plane };

    this.sectionLines.add(line);
  }

  private updateSectionLines(plane: SectionPlane): void {
    const line = this.sectionLines.children.find(
      child => child.name === `SectionLine_${plane.axis}`
    ) as THREE.Line;

    if (line) {
      this.removeSectionLines(plane);
      this.createSectionLines(plane);
    }
  }

  private removeSectionLines(plane: SectionPlane): void {
    const line = this.sectionLines.children.find(
      child => child.name === `SectionLine_${plane.axis}`
    );

    if (line) {
      this.sectionLines.remove(line);
      line.geometry.dispose();
    }
  }

  private updateSceneClipping(): void {
    // Converte SectionPlanes para THREE.Planes
    const threePlanes = this.clippingEnabled
      ? this.planes.map(p => p.toThreePlane())
      : [];

    // Aplica clipping a todos os materiais da cena
    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh && object.material) {
        const materials = Array.isArray(object.material) ? object.material : [object.material];

        materials.forEach(material => {
          if (material instanceof THREE.Material) {
            material.clippingPlanes = threePlanes;
          }
        });
      }
    });

    // Atualiza renderer se disponível
    // (Será feito no RenderSystem)
  }

  /**
   * Cleanup - deve ser chamado antes de destruir
   */
  dispose(): void {
    this.clearAll();
    this.sectionLines.children.forEach(child => {
      if (child instanceof THREE.Line) {
        child.geometry.dispose();
      }
    });
    this.scene.remove(this.sectionLines);
  }
}