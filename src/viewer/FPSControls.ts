import * as THREE from 'three';

/**
 * FPSControls - Controles estilo Counter-Strike + Google Earth
 * 
 * WASD: Movimento (Forward, Left, Back, Right)
 * Setas: Rotação da câmera
 * Mouse: Look around (opcional)
 */
export class FPSControls {
  private camera: THREE.Camera;
  private domElement: HTMLElement;
  
  // Estado das teclas
  private keys = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    rotateUp: false,
    rotateDown: false,
    rotateLeft: false,
    rotateRight: false
  };

  // Configurações
  public moveSpeed = 10.0; // unidades por segundo
  public rotateSpeed = 1.5; // radianos por segundo
  public enabled = true;

  // Vetor de movimento
  private velocity = new THREE.Vector3();
  private direction = new THREE.Vector3();
  
  // Euler para rotação
  private euler = new THREE.Euler(0, 0, 0, 'YXZ');

  constructor(camera: THREE.Camera, domElement: HTMLElement) {
    this.camera = camera;
    this.domElement = domElement;

    this.setupEventListeners();
    
    console.log('🎮 FPS Controls initialized');
    console.log('  WASD: Move');
    console.log('  Arrow Keys: Rotate camera');
  }

  private setupEventListeners(): void {
    document.addEventListener('keydown', this.onKeyDown.bind(this));
    document.addEventListener('keyup', this.onKeyUp.bind(this));
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (!this.enabled) return;

    switch (event.code) {
      // WASD Movement
      case 'KeyW':
        this.keys.forward = true;
        break;
      case 'KeyS':
        this.keys.backward = true;
        break;
      case 'KeyA':
        this.keys.left = true;
        break;
      case 'KeyD':
        this.keys.right = true;
        break;

      // Arrow Keys Rotation
      case 'ArrowUp':
        this.keys.rotateUp = true;
        event.preventDefault();
        break;
      case 'ArrowDown':
        this.keys.rotateDown = true;
        event.preventDefault();
        break;
      case 'ArrowLeft':
        this.keys.rotateLeft = true;
        event.preventDefault();
        break;
      case 'ArrowRight':
        this.keys.rotateRight = true;
        event.preventDefault();
        break;
    }
  }

  private onKeyUp(event: KeyboardEvent): void {
    switch (event.code) {
      case 'KeyW':
        this.keys.forward = false;
        break;
      case 'KeyS':
        this.keys.backward = false;
        break;
      case 'KeyA':
        this.keys.left = false;
        break;
      case 'KeyD':
        this.keys.right = false;
        break;
      case 'ArrowUp':
        this.keys.rotateUp = false;
        break;
      case 'ArrowDown':
        this.keys.rotateDown = false;
        break;
      case 'ArrowLeft':
        this.keys.rotateLeft = false;
        break;
      case 'ArrowRight':
        this.keys.rotateRight = false;
        break;
    }
  }

  /**
   * Update deve ser chamado no loop de animação
   */
  public update(delta: number): void {
    if (!this.enabled) return;

    // Atualizar rotação baseado nas setas
    this.updateRotation(delta);

    // Atualizar movimento baseado no WASD
    this.updateMovement(delta);
  }

  private updateRotation(delta: number): void {
    const rotationAmount = this.rotateSpeed * delta;

    // Obter rotação atual da câmera
    this.euler.setFromQuaternion(this.camera.quaternion);

    // Rotação vertical (pitch) - Setas Up/Down
    if (this.keys.rotateUp) {
      this.euler.x += rotationAmount;
    }
    if (this.keys.rotateDown) {
      this.euler.x -= rotationAmount;
    }

    // Rotação horizontal (yaw) - Setas Left/Right
    if (this.keys.rotateLeft) {
      this.euler.y += rotationAmount;
    }
    if (this.keys.rotateRight) {
      this.euler.y -= rotationAmount;
    }

    // Limitar pitch para evitar gimbal lock
    this.euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.euler.x));

    // Aplicar rotação
    this.camera.quaternion.setFromEuler(this.euler);
  }

  private updateMovement(delta: number): void {
    // Resetar velocidade
    this.velocity.set(0, 0, 0);

    // Obter direções baseadas na orientação da câmera
    const forward = new THREE.Vector3();
    const right = new THREE.Vector3();
    
    this.camera.getWorldDirection(forward);
    forward.y = 0; // Manter movimento no plano horizontal
    forward.normalize();
    
    right.crossVectors(this.camera.up, forward).normalize();

    // Calcular movimento
    if (this.keys.forward) {
      this.velocity.add(forward.multiplyScalar(this.moveSpeed * delta));
    }
    if (this.keys.backward) {
      this.velocity.add(forward.multiplyScalar(-this.moveSpeed * delta));
    }
    if (this.keys.left) {
      this.velocity.add(right.multiplyScalar(this.moveSpeed * delta));
    }
    if (this.keys.right) {
      this.velocity.add(right.multiplyScalar(-this.moveSpeed * delta));
    }

    // Aplicar movimento
    this.camera.position.add(this.velocity);
  }

  /**
   * Rotação instantânea de 180 graus
   */
  public rotate180(): void {
    this.euler.setFromQuaternion(this.camera.quaternion);
    this.euler.y += Math.PI; // 180 graus em radianos
    this.camera.quaternion.setFromEuler(this.euler);
    
    console.log('🔄 Rotação 180° executada');
  }

  /**
   * Ativar/desativar controles
   */
  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    
    if (!enabled) {
      // Resetar estado das teclas
      Object.keys(this.keys).forEach(key => {
        (this.keys as any)[key] = false;
      });
    }
  }

  /**
   * Dispose
   */
  public dispose(): void {
    document.removeEventListener('keydown', this.onKeyDown.bind(this));
    document.removeEventListener('keyup', this.onKeyUp.bind(this));
  }
}
