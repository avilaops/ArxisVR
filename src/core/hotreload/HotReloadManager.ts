import * as THREE from 'three';
import { FileWatcher } from './FileWatcher';
import { AssetReloader } from './AssetReloader';
import { ShaderReloader } from './ShaderReloader';
import { UIReloader } from './UIReloader';
import { FileType, getFileType } from './events/HotReloadEvents';
import { eventBus, EventType } from '..';

/**
 * HotReloadManager - Gerenciador central de hot-reload (Singleton)
 * Coordena todos os sistemas de reload em tempo real
 * 
 * Features:
 * - Interface única para todo sistema
 * - Coordenação entre reloaders
 * - File watching integrado
 * - Estatísticas globais
 * - Preparado para produção
 */
export class HotReloadManager {
  private static instance: HotReloadManager;
  
  private fileWatcher: FileWatcher;
  private assetReloader: AssetReloader | null = null;
  private shaderReloader: ShaderReloader | null = null;
  private uiReloader: UIReloader;
  
  private isEnabled: boolean = false;
  
  // Estatísticas
  private reloadCount = {
    assets: 0,
    shaders: 0,
    ui: 0,
    total: 0
  };
  
  // Sistema de Dependências
  private dependencies: Map<string, string[]> = new Map();
  
  private constructor() {
    this.fileWatcher = new FileWatcher();
    this.uiReloader = new UIReloader();
    
    console.log('🔥 Hot Reload Manager initialized');
  }
  
  /**
   * Retorna instância singleton
   */
  public static getInstance(): HotReloadManager {
    if (!HotReloadManager.instance) {
      HotReloadManager.instance = new HotReloadManager();
    }
    return HotReloadManager.instance;
  }
  
  /**
   * Inicializa sistema com scene
   */
  public initialize(scene: THREE.Scene): void {
    this.assetReloader = new AssetReloader(scene);
    this.shaderReloader = new ShaderReloader();
    
    console.log('✅ Hot Reload System initialized with scene');
  }
  
  /**
   * Habilita hot-reload
   */
  public enable(watchPaths?: string[]): void {
    if (this.isEnabled) {
      console.warn('⚠️ Hot-reload already enabled');
      return;
    }
    
    this.isEnabled = true;
    
    // Inicia file watching
    if (watchPaths && watchPaths.length > 0) {
      this.fileWatcher.startWatch(watchPaths);
    }
    
    eventBus.emit(EventType.TOOL_ACTIVATED, { toolType: 'HotReload' });
    
    console.log('🔥 Hot-reload enabled');
  }
  
  /**
   * Desabilita hot-reload
   */
  public disable(): void {
    if (!this.isEnabled) {
      console.warn('⚠️ Hot-reload already disabled');
      return;
    }
    
    this.isEnabled = false;
    
    // Para file watching
    this.fileWatcher.stopWatch();
    
    eventBus.emit(EventType.TOOL_DEACTIVATED, { toolType: 'HotReload' });
    
    console.log('❌ Hot-reload disabled');
  }
  
  /**
   * Toggle hot-reload
   */
  public toggle(): void {
    if (this.isEnabled) {
      this.disable();
    } else {
      this.enable();
    }
  }
  
  /**
   * Notifica mudança em arquivo
   */
  public async notifyFileChange(path: string): Promise<void> {
    if (!this.isEnabled) return;
    
    const fileType = getFileType(path);
    
    console.log(`📝 File changed: ${path} (${fileType})`);
    
    try {
      switch (fileType) {
        case FileType.ASSET:
          await this.reloadAssetByPath(path);
          break;
        
        case FileType.SHADER:
          await this.reloadShaderByPath(path);
          break;
        
        case FileType.UI:
        case FileType.THEME:
          await this.reloadUIByPath(path);
          break;
        
        default:
          console.log(`ℹ️ Unsupported file type: ${fileType}`);
      }
    } catch (error) {
      console.error(`❌ Failed to reload file: ${path}`, error);
    }
  }
  
  /**
   * Recarrega asset por caminho
   */
  private async reloadAssetByPath(path: string): Promise<void> {
    if (!this.assetReloader) {
      console.warn('⚠️ Asset reloader not initialized');
      return;
    }
    
    await this.assetReloader.reloadAssetByPath(path);
    this.reloadCount.assets++;
    this.reloadCount.total++;
  }
  
  /**
   * Recarrega shader por caminho
   */
  private async reloadShaderByPath(path: string): Promise<void> {
    if (!this.shaderReloader) {
      console.warn('⚠️ Shader reloader not initialized');
      return;
    }
    
    // Determina se é vertex ou fragment shader
    const isVertex = path.includes('.vert') || path.includes('vertex');
    const isFragment = path.includes('.frag') || path.includes('fragment');
    
    // Extrai shader ID do caminho
    const shaderId = path.split('/').pop()?.replace(/\.(vert|frag|glsl)$/, '') || 'unknown';
    
    if (isVertex) {
      const shader = await this.shaderReloader.loadShaderFromFile(path);
      await this.shaderReloader.reloadVertexShader(shaderId, shader);
    } else if (isFragment) {
      const shader = await this.shaderReloader.loadShaderFromFile(path);
      await this.shaderReloader.reloadFragmentShader(shaderId, shader);
    }
    
    this.reloadCount.shaders++;
    this.reloadCount.total++;
  }
  
  /**
   * Recarrega UI por caminho
   */
  private async reloadUIByPath(path: string): Promise<void> {
    if (path.includes('theme')) {
      // Recarrega tema
      const themeId = path.split('/').pop()?.replace('.json', '') || 'default';
      await this.uiReloader.reloadTheme(themeId);
    } else if (path.endsWith('.css')) {
      // Recarrega CSS
      await this.uiReloader.reloadCSS(path);
    } else {
      // Recarrega painel específico
      const panelId = path.split('/').pop()?.replace(/\.(html|ts)$/, '') || 'unknown';
      await this.uiReloader.reloadPanel(panelId);
    }
    
    this.reloadCount.ui++;
    this.reloadCount.total++;
  }
  
  /**
   * Adiciona dependência entre assets
   * @param assetId Asset que depende de outros
   * @param dependsOn Array de IDs de assets que devem ser carregados primeiro
   */
  public addDependency(assetId: string, dependsOn: string[]): void {
    this.dependencies.set(assetId, dependsOn);
    console.log(`🔗 Added dependencies for ${assetId}:`, dependsOn);
  }
  
  /**
   * Remove dependências de um asset
   */
  public removeDependency(assetId: string): void {
    this.dependencies.delete(assetId);
    console.log(`🔗 Removed dependencies for ${assetId}`);
  }
  
  /**
   * Retorna dependências de um asset
   */
  public getDependencies(assetId: string): string[] {
    return this.dependencies.get(assetId) || [];
  }
  
  /**
   * Recarrega asset com suas dependências
   */
  private async reloadWithDependencies(assetId: string): Promise<void> {
    const deps = this.dependencies.get(assetId) || [];
    
    // Recarrega dependências primeiro
    for (const depId of deps) {
      console.log(`🔗 Loading dependency: ${depId}`);
      await this.reloadAsset(depId);
    }
    
    // Depois recarrega o asset principal
    console.log(`🔗 Loading main asset: ${assetId}`);
    await this.reloadAsset(assetId);
  }
  
  /**
   * Recarrega asset manualmente
   */
  public async reloadAsset(assetId: string): Promise<void> {
    if (!this.assetReloader) {
      console.warn('⚠️ Asset reloader not initialized');
      return;
    }
    
    await this.assetReloader.reloadAsset(assetId);
    this.reloadCount.assets++;
    this.reloadCount.total++;
  }
  
  /**
   * Recarrega shader manualmente
   */
  public async reloadShader(shaderId: string, vertexShader: string, fragmentShader: string): Promise<void> {
    if (!this.shaderReloader) {
      console.warn('⚠️ Shader reloader not initialized');
      return;
    }
    
    await this.shaderReloader.reloadShader(shaderId, vertexShader, fragmentShader);
    this.reloadCount.shaders++;
    this.reloadCount.total++;
  }
  
  /**
   * Recarrega painel UI manualmente
   */
  public async reloadPanel(panelId: string): Promise<void> {
    await this.uiReloader.reloadPanel(panelId);
    this.reloadCount.ui++;
    this.reloadCount.total++;
  }
  
  /**
   * Recarrega tema manualmente
   */
  public async reloadTheme(themeId: string): Promise<void> {
    await this.uiReloader.reloadTheme(themeId);
    this.reloadCount.ui++;
    this.reloadCount.total++;
  }
  
  /**
   * Retorna File Watcher
   */
  public getFileWatcher(): FileWatcher {
    return this.fileWatcher;
  }
  
  /**
   * Retorna Asset Reloader
   */
  public getAssetReloader(): AssetReloader | null {
    return this.assetReloader;
  }
  
  /**
   * Retorna Shader Reloader
   */
  public getShaderReloader(): ShaderReloader | null {
    return this.shaderReloader;
  }
  
  /**
   * Retorna UI Reloader
   */
  public getUIReloader(): UIReloader {
    return this.uiReloader;
  }
  
  /**
   * Retorna se está habilitado
   */
  public getIsEnabled(): boolean {
    return this.isEnabled;
  }
  
  /**
   * Retorna estatísticas globais
   */
  public getStats(): {
    enabled: boolean;
    reloadCount: {
      assets: number;
      shaders: number;
      ui: number;
      total: number;
    };
    fileWatcher: ReturnType<FileWatcher['getStats']>;
    assetReloader: ReturnType<AssetReloader['getStats']> | null;
    shaderReloader: ReturnType<ShaderReloader['getStats']> | null;
    uiReloader: ReturnType<UIReloader['getStats']>;
  } {
    return {
      enabled: this.isEnabled,
      reloadCount: { ...this.reloadCount },
      fileWatcher: this.fileWatcher.getStats(),
      assetReloader: this.assetReloader?.getStats() || null,
      shaderReloader: this.shaderReloader?.getStats() || null,
      uiReloader: this.uiReloader.getStats()
    };
  }
  
  /**
   * Imprime estatísticas completas
   */
  public printStats(): void {
    console.log('═══════════════════════════════════════');
    console.log('🔥 HOT RELOAD MANAGER STATS');
    console.log('═══════════════════════════════════════');
    console.log(`Status: ${this.isEnabled ? '✅ Enabled' : '❌ Disabled'}`);
    console.log('───────────────────────────────────────');
    console.log('Reload Count:');
    console.log(`   Assets: ${this.reloadCount.assets}`);
    console.log(`   Shaders: ${this.reloadCount.shaders}`);
    console.log(`   UI: ${this.reloadCount.ui}`);
    console.log(`   Total: ${this.reloadCount.total}`);
    console.log('───────────────────────────────────────');
    
    if (this.assetReloader) {
      this.assetReloader.printStats();
      console.log('───────────────────────────────────────');
    }
    
    if (this.shaderReloader) {
      this.shaderReloader.printStats();
      console.log('───────────────────────────────────────');
    }
    
    this.uiReloader.printStats();
    console.log('═══════════════════════════════════════');
  }
  
  /**
   * Configura ferramentas de desenvolvedor
   * Expõe comandos globais para debugging no console
   */
  public setupDeveloperTools(): void {
    // Expor globalmente para debugging
    if (typeof window !== 'undefined') {
      (window as any).hotReloadManager = this;
      
      // Comandos úteis
      (window as any).reloadAsset = (assetId: string) => {
        return this.reloadAsset(assetId);
      };
      
      (window as any).reloadShader = (shaderId: string, vertexShader: string, fragmentShader: string) => {
        return this.reloadShader(shaderId, vertexShader, fragmentShader);
      };
      
      (window as any).reloadPanel = (panelId: string) => {
        return this.reloadPanel(panelId);
      };
      
      (window as any).reloadStats = () => {
        this.printStats();
        return this.getStats();
      };
      
      (window as any).hotReloadToggle = () => {
        this.toggle();
      };
      
      console.log('🎮 Hot-reload developer commands registered:');
      console.log('   - reloadAsset(assetId)');
      console.log('   - reloadShader(shaderId, vs, fs)');
      console.log('   - reloadPanel(panelId)');
      console.log('   - reloadStats()');
      console.log('   - hotReloadToggle()');
      console.log('   - hotReloadManager (global instance)');
    }
    
    // Habilita automaticamente em desenvolvimento
    if (import.meta.env?.DEV || process.env.NODE_ENV === 'development') {
      this.enable();
      console.log('🔧 Developer mode: Hot-reload auto-enabled');
    }
  }
}

// Exporta instância global
export const hotReloadManager = HotReloadManager.getInstance();
