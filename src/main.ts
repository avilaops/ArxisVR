import { RenderSystem } from './engine/systems/RenderSystem';

/**
 * Simple test application for AVX renderer
 */
class SimpleApp {
  private canvas!: HTMLCanvasElement;
  private renderSystem!: RenderSystem;

  constructor() {
    console.log('🚀 SimpleApp: Starting...');
    this.initializeCanvas();
    this.initializeRenderSystem();
  }

  private initializeCanvas(): void {
    // Create canvas element
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'avx-canvas';
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.display = 'block';

    // Add to DOM
    const container = document.getElementById('canvas-container');
    if (container) {
      container.appendChild(this.canvas);
      console.log('🎨 Canvas initialized and added to DOM');
    } else {
      console.error('❌ Canvas container not found!');
    }
  }

  private async initializeRenderSystem(): Promise<void> {
    console.log('🎨 Initializing RenderSystem...');
    this.renderSystem = new RenderSystem(this.canvas);
    await this.renderSystem.initialize();
    console.log('✅ RenderSystem initialized');
  }
}

// Initialize application
const app = new SimpleApp();

// Export para debug
if (typeof window !== 'undefined') {
  (window as any).app = app;
}

export default app;
