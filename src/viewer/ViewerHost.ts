/**
 * ViewerHost - Canvas Three.js + controls
 * Inicializa scene/camera/renderer e expõe API interna
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
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

  private animationFrameId?: number;

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

  private registerServices(): void {
    // Register Three.js objects in DI
    di.register('scene', this.scene);
    di.register('camera', this.camera);
    di.register('renderer', this.renderer);
  }

  private startRenderLoop(): void {
    const animate = () => {
      this.animationFrameId = requestAnimationFrame(animate);

      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };

    animate();
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
    this.renderer.dispose();
  }
}
