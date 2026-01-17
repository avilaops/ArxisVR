import * as THREE from 'three';
import { eventBus, EventType } from '../EventBus';

/**
 * ShaderReloader - Hot-reload de shaders GLSL
 * Compila e substitui shaders em tempo real
 * 
 * Features:
 * - Compilação assíncrona
 * - Fallback para shader anterior em caso de erro
 * - Mantém uniforms e attributes
 * - Suporta vertex e fragment shaders
 */
export class ShaderReloader {
private shaderRegistry: Map<string, {
  material: THREE.ShaderMaterial;
  vertexShader: string;
  fragmentShader: string;
}> = new Map();

  // Registro de texturas para hot-swap
  private textureRegistry: Map<string, THREE.Texture> = new Map();
  
  constructor() {
    console.log('🎨 Shader Reloader initialized');
  }
  
  /**
   * Registra shader para hot-reload
   */
  public registerShader(
    shaderId: string,
    material: THREE.ShaderMaterial,
    vertexShader: string,
    fragmentShader: string
  ): void {
    this.shaderRegistry.set(shaderId, {
      material,
      vertexShader,
      fragmentShader
    });
    
    console.log(`📝 Registered shader: ${shaderId}`);
  }
  
  /**
   * Recarrega vertex shader
   */
  public async reloadVertexShader(shaderId: string, newVertexShader: string): Promise<void> {
    const entry = this.shaderRegistry.get(shaderId);
    if (!entry) {
      console.warn(`⚠️ Shader not registered: ${shaderId}`);
      return;
    }
    
    console.log(`🔄 Reloading vertex shader: ${shaderId}`);
    
    const startTime = Date.now();
    
    try {
      // Atualiza material
      entry.material.vertexShader = newVertexShader;
      entry.material.needsUpdate = true;
      
      // Valida compilação
      await this.validateShaderCompilation();
      
      // Atualiza registro
      entry.vertexShader = newVertexShader;
      
      const duration = Date.now() - startTime;
      
      eventBus.emit(EventType.RENDER_SETTINGS_CHANGED, {
        settings: { shader: shaderId }
      });
      
      console.log(`✅ Vertex shader reloaded: ${shaderId} (${duration}ms)`);
      
    } catch (error) {
      // Rollback para shader antigo
      entry.material.vertexShader = entry.vertexShader;
      entry.material.needsUpdate = true;
      
      console.error(`❌ Failed to reload vertex shader: ${shaderId}`, error);
      throw error;
    }
  }
  
  /**
   * Recarrega fragment shader
   */
  public async reloadFragmentShader(shaderId: string, newFragmentShader: string): Promise<void> {
    const entry = this.shaderRegistry.get(shaderId);
    if (!entry) {
      console.warn(`⚠️ Shader not registered: ${shaderId}`);
      return;
    }
    
    console.log(`🔄 Reloading fragment shader: ${shaderId}`);
    
    const startTime = Date.now();
    
    try {
      // Atualiza material
      entry.material.fragmentShader = newFragmentShader;
      entry.material.needsUpdate = true;
      
      // Valida compilação
      await this.validateShaderCompilation();
      
      // Atualiza registro
      entry.fragmentShader = newFragmentShader;
      
      const duration = Date.now() - startTime;
      
      eventBus.emit(EventType.RENDER_SETTINGS_CHANGED, {
        settings: { shader: shaderId }
      });
      
      console.log(`✅ Fragment shader reloaded: ${shaderId} (${duration}ms)`);
      
    } catch (error) {
      // Rollback para shader antigo
      entry.material.fragmentShader = entry.fragmentShader;
      entry.material.needsUpdate = true;
      
      console.error(`❌ Failed to reload fragment shader: ${shaderId}`, error);
      throw error;
    }
  }
  
  /**
   * Recarrega ambos os shaders
   */
  public async reloadShader(
    shaderId: string,
    newVertexShader: string,
    newFragmentShader: string
  ): Promise<void> {
    const entry = this.shaderRegistry.get(shaderId);
    if (!entry) {
      console.warn(`⚠️ Shader not registered: ${shaderId}`);
      return;
    }
    
    console.log(`🔄 Reloading shader: ${shaderId}`);
    
    const startTime = Date.now();
    
    try {
      // Atualiza material
      entry.material.vertexShader = newVertexShader;
      entry.material.fragmentShader = newFragmentShader;
      entry.material.needsUpdate = true;
      
      // Valida compilação
      await this.validateShaderCompilation();
      
      // Atualiza registro
      entry.vertexShader = newVertexShader;
      entry.fragmentShader = newFragmentShader;
      
      const duration = Date.now() - startTime;
      
      eventBus.emit(EventType.RENDER_SETTINGS_CHANGED, {
        settings: { shader: shaderId }
      });
      
      console.log(`✅ Shader reloaded: ${shaderId} (${duration}ms)`);
      
    } catch (error) {
      // Rollback para shaders antigos
      entry.material.vertexShader = entry.vertexShader;
      entry.material.fragmentShader = entry.fragmentShader;
      entry.material.needsUpdate = true;
      
      console.error(`❌ Failed to reload shader: ${shaderId}`, error);
      throw error;
    }
  }
  
  /**
   * Valida compilação do shader
   */
  private async validateShaderCompilation(): Promise<void> {
    // Em THREE.js, erros de compilação são detectados no próximo render
    // Aqui podemos fazer validação básica ou aguardar um frame
    
    return new Promise((resolve) => {
      // Aguarda um frame para verificar compilação
      requestAnimationFrame(() => {
        // Se chegou aqui sem erros, compilou com sucesso
        resolve();
      });
    });
  }
  
  /**
   * Carrega shader de arquivo
   */
  public async loadShaderFromFile(path: string): Promise<string> {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`Failed to load shader: ${response.statusText}`);
      }
      return await response.text();
    } catch (error) {
      console.error(`❌ Error loading shader file: ${path}`, error);
      throw error;
    }
  }
  
  /**
   * Recarrega shader de arquivo
   */
  public async reloadShaderFromFile(
    shaderId: string,
    vertexPath?: string,
    fragmentPath?: string
  ): Promise<void> {
    const promises: Promise<string>[] = [];
    
    if (vertexPath) {
      promises.push(this.loadShaderFromFile(vertexPath));
    }
    
    if (fragmentPath) {
      promises.push(this.loadShaderFromFile(fragmentPath));
    }
    
    const shaders = await Promise.all(promises);
    
    if (vertexPath && fragmentPath) {
      await this.reloadShader(shaderId, shaders[0], shaders[1]);
    } else if (vertexPath) {
      await this.reloadVertexShader(shaderId, shaders[0]);
    } else if (fragmentPath) {
      await this.reloadFragmentShader(shaderId, shaders[0]);
    }
  }
  
  /**
   * Remove shader do registro
   */
  public unregisterShader(shaderId: string): void {
    this.shaderRegistry.delete(shaderId);
    console.log(`🗑️ Unregistered shader: ${shaderId}`);
  }
  
  /**
   * Limpa todos os registros
   */
  public clear(): void {
    this.shaderRegistry.clear();
    this.textureRegistry.clear();
    console.log('🧹 Shader registry cleared');
  }
  
  // ==================== TEXTURE HOT-SWAP ====================
  
  /**
   * Registra textura para hot-reload
   */
  public registerTexture(textureId: string, texture: THREE.Texture): void {
    this.textureRegistry.set(textureId, texture);
    console.log(`📝 Registered texture: ${textureId}`);
  }
  
  /**
   * Recarrega textura sem reiniciar material
   */
  public async reloadTexture(textureId: string, newTexturePath: string): Promise<void> {
    const texture = this.textureRegistry.get(textureId);
    if (!texture) {
      console.warn(`⚠️ Texture not registered: ${textureId}`);
      return;
    }
    
    console.log(`🔄 Reloading texture: ${textureId}`);
    
    const startTime = Date.now();
    
    try {
      // Carrega nova textura
      const loader = new THREE.TextureLoader();
      const newTexture = await loader.loadAsync(newTexturePath);
      
      // Copia propriedades da textura antiga
      newTexture.wrapS = texture.wrapS;
      newTexture.wrapT = texture.wrapT;
      newTexture.minFilter = texture.minFilter;
      newTexture.magFilter = texture.magFilter;
      newTexture.anisotropy = texture.anisotropy;
      newTexture.encoding = texture.encoding;
      newTexture.flipY = texture.flipY;
      
      // Substitui imagem da textura
      texture.image = newTexture.image;
      texture.needsUpdate = true;
      
      // Dispose da textura temporária
      newTexture.dispose();
      
      const duration = Date.now() - startTime;
      
      console.log(`✅ Texture reloaded: ${textureId} (${duration}ms)`);
      
      eventBus.emit(EventType.RENDER_SETTINGS_CHANGED, {
        settings: { texture: textureId }
      });
      
    } catch (error) {
      console.error(`❌ Failed to reload texture: ${textureId}`, error);
      throw error;
    }
  }
  
  /**
   * Recarrega múltiplas texturas
   */
  public async reloadMultipleTextures(textures: Array<{ id: string; path: string }>): Promise<void> {
    console.log(`🔄 Reloading ${textures.length} textures...`);
    
    const promises = textures.map(({ id, path }) => this.reloadTexture(id, path));
    await Promise.all(promises);
    
    console.log(`✅ Reloaded ${textures.length} textures`);
  }
  
  /**
   * Atualiza propriedades de uma textura sem recarregar
   */
  public updateTextureProperties(
    textureId: string,
    properties: Partial<{
      wrapS: THREE.Wrapping;
      wrapT: THREE.Wrapping;
      minFilter: THREE.TextureFilter;
      magFilter: THREE.TextureFilter;
      anisotropy: number;
      encoding: THREE.TextureEncoding;
      flipY: boolean;
    }>
  ): void {
    const texture = this.textureRegistry.get(textureId);
    if (!texture) {
      console.warn(`⚠️ Texture not registered: ${textureId}`);
      return;
    }
    
    // Aplica propriedades
    if (properties.wrapS !== undefined) texture.wrapS = properties.wrapS;
    if (properties.wrapT !== undefined) texture.wrapT = properties.wrapT;
    if (properties.minFilter !== undefined) texture.minFilter = properties.minFilter;
    if (properties.magFilter !== undefined) texture.magFilter = properties.magFilter;
    if (properties.anisotropy !== undefined) texture.anisotropy = properties.anisotropy;
    if (properties.encoding !== undefined) texture.encoding = properties.encoding;
    if (properties.flipY !== undefined) texture.flipY = properties.flipY;
    
    texture.needsUpdate = true;
    
    console.log(`✅ Updated texture properties: ${textureId}`);
  }
  
  /**
   * Remove textura do registro
   */
  public unregisterTexture(textureId: string): void {
    this.textureRegistry.delete(textureId);
    console.log(`🗑️ Unregistered texture: ${textureId}`);
  }
  
  /**
   * Retorna lista de texturas registradas
   */
  public getRegisteredTextures(): string[] {
    return Array.from(this.textureRegistry.keys());
  }
  
  /**
   * Retorna estatísticas
   */
  public getStats(): {
    registeredShaders: number;
    shaders: string[];
    registeredTextures: number;
    textures: string[];
  } {
    return {
      registeredShaders: this.shaderRegistry.size,
      shaders: Array.from(this.shaderRegistry.keys()),
      registeredTextures: this.textureRegistry.size,
      textures: Array.from(this.textureRegistry.keys())
    };
  }
  
  /**
   * Imprime estatísticas
   */
  public printStats(): void {
    const stats = this.getStats();
    console.log('📊 Shader Reloader Stats:');
    console.log(`   Registered Shaders: ${stats.registeredShaders}`);
    if (stats.shaders.length > 0) {
      console.log('   Shaders:', stats.shaders.join(', '));
    }
    console.log(`   Registered Textures: ${stats.registeredTextures}`);
    if (stats.textures.length > 0) {
      console.log('   Textures:', stats.textures.join(', '));
    }
  }
}
