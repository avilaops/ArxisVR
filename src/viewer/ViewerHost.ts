/**
 * ViewerHost - Canvas Three.js + controls
 * Inicializa scene/camera/renderer e expõe API interna
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FPSControls } from './FPSControls';
import { di } from '../app/di';

/**
 * ViewerHost component
 */
export class ViewerHost {
  private container: HTMLElement;
  
  public scene!: THREE.Scene;
  public camera!: THREE.PerspectiveCamera;
  public renderer!: THREE.WebGLRenderer;
  public controls!: OrbitControls;
  public fpsControls!: FPSControls;

  private animationFrameId?: number;
  private clock = new THREE.Clock();
  private controlMode: 'orbit' | 'fps' = 'orbit'; // Modo padrão: orbit

  constructor(container: HTMLElement) {
    this.container = container;
    this.init();
    this.registerServices();
    this.startRenderLoop();
  }

  private init(): void {
    // Canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'viewer-canvas';
    canvas.className = 'viewer-host__canvas';
    this.container.appendChild(canvas);

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1e1e1e);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(10, 10, 10);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.target.set(0, 0, 0);

    // FPS Controls
    this.fpsControls = new FPSControls(this.camera, this.container);
    this.fpsControls.setEnabled(false); // Desabilitado por padrão

    // Tecla 'C' para alternar entre modos (evita conflito com V de VR)
    document.addEventListener('keydown', (e) => {
      if (e.code === 'KeyC' && !this.isTypingInInput()) {
        this.toggleControlMode();
      }
    });
    
    console.log('💡 Pressione C para alternar Orbit/FPS');

    // Lights (básicos)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);

    // Grid helper
    const gridHelper = new THREE.GridHelper(100, 100);
    this.scene.add(gridHelper);

    // Resize observer
    const resizeObserver = new ResizeObserver(() => {
      this.onResize();
    });
    resizeObserver.observe(this.container);
  }
  
  /**
   * Verifica se está digitando em input
   */
  private isTypingInInput(): boolean {
    const activeElement = document.activeElement;
    if (!activeElement) return false;
    
    const tagName = activeElement.tagName.toLowerCase();
    return tagName === 'input' || tagName === 'textarea';
  }

  private registerServices(): void {
    // Register Three.js objects in DI
    di.register('scene', this.scene);
    di.register('camera', this.camera);
    di.register('renderer', this.renderer);
  }

  private startRenderLoop(): void {
    const animate = () => {
      this.animationFrameId = requestAnimationFrame(animate);

      const delta = this.clock.getDelta();

      // Atualizar controles baseado no modo
      if (this.controlMode === 'orbit') {
        this.controls.update();
      } else {
        this.fpsControls.update(delta);
      }

      this.renderer.render(this.scene, this.camera);
    };

    animate();
  }

  /**
   * Alterna entre modo Orbit e FPS
   */
  public toggleControlMode(): void {
    if (this.controlMode === 'orbit') {
      this.controlMode = 'fps';
      this.controls.enabled = false;
      this.fpsControls.setEnabled(true);
      console.log('🎮 Modo FPS ativado');
      console.log('  - WASD: Mover');
      console.log('  - Setas: Rotacionar câmera');
      console.log('  - Pressione C novamente para voltar ao modo Orbit');
    } else {
      this.controlMode = 'orbit';
      this.controls.enabled = true;
      this.fpsControls.setEnabled(false);
      console.log('🖱️ Modo Orbit ativado (Mouse)');
    }
  }

  /**
   * Obtém modo de controle atual
   */
  public getControlMode(): 'orbit' | 'fps' {
    return this.controlMode;
  }

  private onResize(): void {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  public destroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    this.controls.dispose();
    this.fpsControls.dispose();
    this.renderer.dispose();
  }
}
