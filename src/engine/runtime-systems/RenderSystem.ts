import { EngineSystem } from '../EngineLoop';
import * as THREE from 'three';

/**
 * RenderSystem - Sistema de renderização final
 * SEMPRE executado por último no loop
 */
export class RenderSystem implements EngineSystem {
  readonly name = 'RenderSystem';
  enabled = true;

  constructor(
    private renderer: THREE.WebGLRenderer,
    private scene: THREE.Scene,
    private camera: THREE.Camera
  ) {}

  update(_dt: number): void {
    this.renderer.render(this.scene, this.camera);
  }

  dispose(): void {
    // Renderer é gerenciado pelo ArxisVR
  }
}
