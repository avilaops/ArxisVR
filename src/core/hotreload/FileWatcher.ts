import { eventBus, EventType } from '../EventBus';
import { FileType, getFileType } from './events/HotReloadEvents';

/**
 * FileWatcher - Monitor de mudanças em arquivos
 * 
 * Em ambiente web, usa Vite HMR (Hot Module Replacement)
 * Em desktop/Electron, usaria fs.watch ou chokidar
 * 
 * Features:
 * - Debounce para evitar múltiplos reloads
 * - Filtro de tipos de arquivo
 * - Cross-platform ready
 */
export class FileWatcher {
  private isWatching: boolean = false;
  private watchedPaths: Set<string> = new Set();
  
  // Debounce
  private debounceTimers: Map<string, number> = new Map();
  private debounceDelay: number = 300; // ms
  
  // Filtros
  private allowedTypes: Set<FileType> = new Set([
    FileType.ASSET,
    FileType.SHADER,
    FileType.SCRIPT,
    FileType.UI,
    FileType.THEME
  ]);
  
  // Padrões globbing (regex)
  private patterns: Map<string, { regex: RegExp; fileType: FileType }> = new Map();
  
  constructor() {
    console.log('👀 File Watcher initialized (web mode)');
  }
  
  /**
   * Inicia monitoramento de caminhos
   */
  public startWatch(paths: string[]): void {
    if (this.isWatching) {
      console.warn('⚠️ Already watching files');
      return;
    }
    
    paths.forEach((path) => this.watchedPaths.add(path));
    this.isWatching = true;
    
    // Em ambiente web com Vite, integra com HMR
    if (import.meta.hot) {
      this.setupViteHMR();
    }
    
    eventBus.emit(EventType.TOOL_ACTIVATED, { toolType: 'FileWatcher' });
    console.log(`✅ Watching ${paths.length} paths`);
  }
  
  /**
   * Para monitoramento
   */
  public stopWatch(): void {
    if (!this.isWatching) {
      console.warn('⚠️ Not watching files');
      return;
    }
    
    this.isWatching = false;
    this.watchedPaths.clear();
    
    // Limpa timers
    this.debounceTimers.forEach((timer) => clearTimeout(timer));
    this.debounceTimers.clear();
    
    eventBus.emit(EventType.TOOL_DEACTIVATED, { toolType: 'FileWatcher' });
    console.log('⏹️ Stopped watching files');
  }
  
  /**
   * Configura integração com Vite HMR
   */
  private setupViteHMR(): void {
    if (!import.meta.hot) return;
    
    // Aceita hot updates
    import.meta.hot.accept((newModule) => {
      console.log('🔥 HMR update received:', newModule);
    });
    
    // Escuta mudanças em assets
    import.meta.hot.on('vite:beforeUpdate', (payload) => {
      console.log('📝 Before update:', payload);
    });
    
    console.log('🔥 Vite HMR integration enabled');
  }
  
  /**
   * Notifica mudança em arquivo (chamado manualmente ou por sistema externo)
   */
  public notifyFileChanged(path: string): void {
    if (!this.isWatching) return;
    
    // Verifica se deve monitorar este path
    if (!this.shouldWatch(path)) {
      return;
    }
    
    const fileType = getFileType(path);
    
    // Filtra tipos não permitidos
    if (!this.allowedTypes.has(fileType)) {
      return;
    }
    
    // Debounce
    if (this.debounceTimers.has(path)) {
      clearTimeout(this.debounceTimers.get(path)!);
    }
    
    const timer = setTimeout(() => {
      this.handleFileChange(path, fileType);
      this.debounceTimers.delete(path);
    }, this.debounceDelay);
    
    this.debounceTimers.set(path, timer);
  }
  
  /**
   * Verifica se deve monitorar um path baseado em patterns
   */
  private shouldWatch(path: string): boolean {
    // Se está na lista de paths monitorados
    if (this.watchedPaths.has(path)) {
      return true;
    }
    
    // Verifica patterns
    for (const [pattern, config] of this.patterns.entries()) {
      if (config.regex.test(path)) {
        console.log(`✅ Path matches pattern "${pattern}": ${path}`);
        return true;
      }
    }
    
    return false;
  }
  
  /**
   * Adiciona um padrão glob para monitoramento
   * @param pattern Padrão regex ou glob (será convertido para regex)
   * @param fileType Tipo de arquivo que este padrão representa
   * 
   * Exemplos:
   * - "*.glsl" -> todos arquivos .glsl
   * - "assets/**\/*.gltf" -> todos GLTFs em assets/
   * - "src/shaders/.*\\.frag$" -> todos fragment shaders
   */
  public addPattern(pattern: string, fileType: FileType): void {
    // Converte glob para regex se necessário
    let regexPattern = pattern;
    
    // Conversões simples de glob para regex
    if (!pattern.startsWith('^')) {
      regexPattern = pattern
        .replace(/\./g, '\\.')           // Escapa pontos
        .replace(/\*\*/g, '§§§')         // Placeholder para **
        .replace(/\*/g, '[^/]*')         // * -> qualquer caractere exceto /
        .replace(/§§§/g, '.*')           // ** -> qualquer caractere incluindo /
        .replace(/\?/g, '.')             // ? -> um caractere
        .replace(/\//g, '[/\\\\]');      // / -> / ou \
      
      // Adiciona âncoras se não estiverem presentes
      if (!regexPattern.startsWith('^')) {
        regexPattern = '.*' + regexPattern;
      }
      if (!regexPattern.endsWith('$')) {
        regexPattern = regexPattern + '$';
      }
    }
    
    try {
      const regex = new RegExp(regexPattern, 'i'); // case insensitive
      this.patterns.set(pattern, { regex, fileType });
      console.log(`🎯 Added pattern: "${pattern}" for ${fileType}`);
    } catch (error) {
      console.error(`❌ Invalid pattern: "${pattern}"`, error);
    }
  }
  
  /**
   * Remove um padrão
   */
  public removePattern(pattern: string): void {
    if (this.patterns.delete(pattern)) {
      console.log(`🗑️ Removed pattern: "${pattern}"`);
    }
  }
  
  /**
   * Lista todos os padrões ativos
   */
  public getPatterns(): string[] {
    return Array.from(this.patterns.keys());
  }
  
  /**
   * Processa mudança de arquivo
   */
  private handleFileChange(path: string, fileType: FileType): void {
    console.log(`📝 File changed: ${path} (${fileType})`);
    
    // Emite evento genérico
    eventBus.emit(EventType.TOOL_ACTIVATED, {
      toolType: `FileChanged:${fileType}`
    });
    
    // Notifica sistema de hot-reload
    this.notifyHotReload(path);
  }
  
  /**
   * Notifica sistema de hot-reload
   */
  private notifyHotReload(path: string): void {
    // Evento específico será capturado pelo HotReloadManager
    eventBus.emit(EventType.TOOL_ACTIVATED, {
      toolType: 'HotReload:FileChanged'
    });
    
    console.log(`🔄 Hot-reload triggered for: ${path}`);
  }
  
  /**
   * Adiciona caminho para monitoramento
   */
  public addPath(path: string): void {
    this.watchedPaths.add(path);
    console.log(`➕ Added to watch: ${path}`);
  }
  
  /**
   * Remove caminho do monitoramento
   */
  public removePath(path: string): void {
    this.watchedPaths.delete(path);
    console.log(`➖ Removed from watch: ${path}`);
  }
  
  /**
   * Define delay do debounce
   */
  public setDebounceDelay(delay: number): void {
    this.debounceDelay = delay;
    console.log(`⏱️ Debounce delay set to ${delay}ms`);
  }
  
  /**
   * Adiciona tipo de arquivo permitido
   */
  public allowFileType(type: FileType): void {
    this.allowedTypes.add(type);
  }
  
  /**
   * Remove tipo de arquivo permitido
   */
  public disallowFileType(type: FileType): void {
    this.allowedTypes.delete(type);
  }
  
  /**
   * Retorna se está monitorando
   */
  public getIsWatching(): boolean {
    return this.isWatching;
  }
  
  /**
   * Retorna caminhos monitorados
   */
  public getWatchedPaths(): string[] {
    return Array.from(this.watchedPaths);
  }
  
  /**
   * Retorna estatísticas
   */
  public getStats(): {
    isWatching: boolean;
    pathsCount: number;
    pendingDebounces: number;
    allowedTypes: string[];
    patterns: string[];
  } {
    return {
      isWatching: this.isWatching,
      pathsCount: this.watchedPaths.size,
      pendingDebounces: this.debounceTimers.size,
      allowedTypes: Array.from(this.allowedTypes),
      patterns: Array.from(this.patterns.keys())
    };
  }
}
