import { appState, eventBus, EventType } from '../core';

/**
 * ProjectManager - Gerenciador de projetos BIM
 * Controla carregamento, salvamento e contexto de projetos
 */
export class ProjectManager {
  constructor() {
    this.setupEventListeners();
  }

  /**
   * Cria um novo projeto
   */
  public createNewProject(projectName: string): void {
    appState.updateProjectContext({
      projectName,
      projectPath: '',
      modelLoaded: false,
      modelName: ''
    });
  }

  /**
   * Notifica que um modelo foi carregado
   */
  public modelLoaded(fileName: string): void {
    appState.updateProjectContext({
      modelLoaded: true,
      modelName: fileName
    });
  }

  /**
   * Retorna informações do projeto atual
   */
  public getProjectInfo(): {
    name: string;
    path: string;
    hasModel: boolean;
    modelName: string;
  } {
    const context = appState.projectContext;
    return {
      name: context.projectName,
      path: context.projectPath,
      hasModel: context.modelLoaded,
      modelName: context.modelName
    };
  }

  /**
   * Verifica se há um modelo carregado
   */
  public hasModelLoaded(): boolean {
    return appState.projectContext.modelLoaded;
  }

  /**
   * Reseta o projeto atual
   */
  public resetProject(): void {
    appState.updateProjectContext({
      projectName: 'Untitled',
      projectPath: '',
      modelLoaded: false,
      modelName: ''
    });
  }
  
  /**
   * Alias for resetProject
   */
  public reset(): void {
    this.resetProject();
  }
  
  /**
   * Get project name
   */
  public getProjectName(): string {
    return appState.projectContext.projectName;
  }
  
  /**
   * Get loaded assets (stub - will be implemented with AssetManager)
   */
  public getLoadedAssets(): any[] {
    // TODO: Implement with AssetManager
    return [];
  }

  /**
   * Configura listeners de eventos
   */
  private setupEventListeners(): void {
    eventBus.on(EventType.MODEL_LOADED, ({ fileName }) => {
      this.modelLoaded(fileName);
    });

    eventBus.on(EventType.MODEL_ERROR, ({ error, fileName }) => {
      console.error(`Failed to load model ${fileName}:`, error);
      appState.updateProjectContext({
        modelLoaded: false,
        modelName: ''
      });
    });
    
    // FASE 5: Listeners para PROJECT commands
    eventBus.on(EventType.PROJECT_NEW, (data: any) => {
      console.log(`📨 ProjectManager: Received PROJECT_NEW event`, data);
      const template = data.template || 'empty';
      this.createNewProject(`Untitled (${template})`);
    });
    
    eventBus.on(EventType.PROJECT_RESET, () => {
      console.log(`📨 ProjectManager: Received PROJECT_RESET event`);
      this.reset();
    });
  }

  /**
   * Limpa todos os recursos
   */
  public dispose(): void {
    this.resetProject();
  }
}
