import { appState, eventBus, EventType } from '../core';

/**
 * ISO 19650 BIM Management Classes
 */
export enum BIMStatusCode {
  WIP = 'WIP', // Work in Progress
  SHARED = 'SHARED', // Shared for review
  APPROVED = 'APPROVED', // Approved
  PUBLISHED = 'PUBLISHED', // Published
  ARCHIVED = 'ARCHIVED' // Archived
}

export enum InformationContainerType {
  MODEL = 'MODEL',
  DOCUMENT = 'DOCUMENT',
  DRAWING = 'DRAWING',
  SPECIFICATION = 'SPECIFICATION',
  REPORT = 'REPORT'
}

export interface WorkPackage {
  id: string;
  name: string;
  description: string;
  status: BIMStatusCode;
  created: Date;
  modified: Date;
  dueDate?: Date;
  assignedTo?: string[];
  informationContainers: InformationContainer[];
}

export interface InformationContainer {
  id: string;
  name: string;
  type: InformationContainerType;
  status: BIMStatusCode;
  version: string;
  filePath?: string;
  modelId?: number; // Para containers de modelo IFC
  metadata: Record<string, any>;
  created: Date;
  modified: Date;
}

/**
 * ProjectManager - Gerenciador de projetos BIM
 * Controla carregamento, salvamento e contexto de projetos
 * Suporte a ISO 19650 BIM Management
 */
export class ProjectManager {
  private workPackages: Map<string, WorkPackage> = new Map();
  private informationContainers: Map<string, InformationContainer> = new Map();

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
  public modelLoaded(fileName: string, workPackageId?: string, modelId?: number): void {
    appState.updateProjectContext({
      modelLoaded: true,
      modelName: fileName
    });

    // Se foi especificado um work package, associa o modelo
    if (workPackageId && modelId !== undefined) {
      const container = this.createModelContainer(fileName, modelId);
      if (container) {
        this.addInformationContainerToWorkPackage(workPackageId, container);
      }
    }
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

  // ===== ISO 19650 BIM Management Methods =====

  /**
   * Cria um novo Work Package
   */
  public createWorkPackage(name: string, description: string, dueDate?: Date): WorkPackage {
    const workPackage: WorkPackage = {
      id: this.generateId(),
      name,
      description,
      status: BIMStatusCode.WIP,
      created: new Date(),
      modified: new Date(),
      dueDate,
      informationContainers: []
    };

    this.workPackages.set(workPackage.id, workPackage);
    console.log(`📦 Work Package criado: ${name} (ID: ${workPackage.id})`);
    
    eventBus.emit(EventType.PROJECT_UPDATED, { workPackageCreated: workPackage.id });
    return workPackage;
  }

  /**
   * Atualiza status de um Work Package
   */
  public updateWorkPackageStatus(workPackageId: string, status: BIMStatusCode): boolean {
    const workPackage = this.workPackages.get(workPackageId);
    if (!workPackage) return false;

    workPackage.status = status;
    workPackage.modified = new Date();
    
    console.log(`📦 Work Package ${workPackage.name} status atualizado para: ${status}`);
    eventBus.emit(EventType.PROJECT_UPDATED, { workPackageUpdated: workPackageId });
    return true;
  }

  /**
   * Adiciona Information Container a um Work Package
   */
  public addInformationContainerToWorkPackage(
    workPackageId: string, 
    container: Omit<InformationContainer, 'id' | 'created' | 'modified'>
  ): InformationContainer | null {
    const workPackage = this.workPackages.get(workPackageId);
    if (!workPackage) return null;

    const informationContainer: InformationContainer = {
      ...container,
      id: this.generateId(),
      created: new Date(),
      modified: new Date()
    };

    this.informationContainers.set(informationContainer.id, informationContainer);
    workPackage.informationContainers.push(informationContainer);
    workPackage.modified = new Date();

    console.log(`📄 Information Container adicionado: ${container.name} ao Work Package ${workPackage.name}`);
    eventBus.emit(EventType.PROJECT_UPDATED, { containerAdded: informationContainer.id });
    return informationContainer;
  }

  /**
   * Atualiza status de um Information Container
   */
  public updateInformationContainerStatus(containerId: string, status: BIMStatusCode): boolean {
    const container = this.informationContainers.get(containerId);
    if (!container) return false;

    container.status = status;
    container.modified = new Date();
    
    console.log(`📄 Container ${container.name} status atualizado para: ${status}`);
    eventBus.emit(EventType.PROJECT_UPDATED, { containerUpdated: containerId });
    return true;
  }

  /**
   * Associa modelo IFC a um Information Container
   */
  public associateModelToContainer(containerId: string, modelId: number): boolean {
    const container = this.informationContainers.get(containerId);
    if (!container) return false;

    container.modelId = modelId;
    container.modified = new Date();
    
    console.log(`🔗 Modelo IFC ${modelId} associado ao container ${container.name}`);
    return true;
  }

  /**
   * Obtém todos os Work Packages
   */
  public getWorkPackages(): WorkPackage[] {
    return Array.from(this.workPackages.values());
  }

  /**
   * Obtém Work Package por ID
   */
  public getWorkPackage(id: string): WorkPackage | undefined {
    return this.workPackages.get(id);
  }

  /**
   * Obtém todos os Information Containers
   */
  public getInformationContainers(): InformationContainer[] {
    return Array.from(this.informationContainers.values());
  }

  /**
   * Obtém Information Container por ID
   */
  public getInformationContainer(id: string): InformationContainer | undefined {
    return this.informationContainers.get(id);
  }

  /**
   * Gera ID único
   */
  private generateId(): string {
    return `bim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Cria container para modelo IFC
   */
  private createModelContainer(fileName: string, modelId: number): Omit<InformationContainer, 'id' | 'created' | 'modified'> | null {
    return {
      name: `Modelo: ${fileName}`,
      type: InformationContainerType.MODEL,
      status: BIMStatusCode.WIP,
      version: '1.0',
      modelId,
      metadata: {
        fileName,
        loadedAt: new Date().toISOString()
      }
    };
  }

  // ===== ISO 19650 Export/Import Methods =====

  /**
   * Exporta dados BIM em formato JSON (ISO 19650 compliant)
   */
  public exportBIMData(): string {
    const bimData = {
      schema: 'ISO 19650',
      version: '1.0',
      project: {
        name: this.getProjectName(),
        exportedAt: new Date().toISOString()
      },
      workPackages: this.workPackages,
      informationContainers: this.informationContainers
    };

    return JSON.stringify(bimData, null, 2);
  }

  /**
   * Importa dados BIM de JSON (ISO 19650 compliant)
   */
  public importBIMData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.schema !== 'ISO 19650') {
        throw new Error('Formato não compatível com ISO 19650');
      }

      // Importa work packages
      if (data.workPackages) {
        for (const [id, wp] of Object.entries(data.workPackages)) {
          this.workPackages.set(id, wp as WorkPackage);
        }
      }

      // Importa information containers
      if (data.informationContainers) {
        for (const [id, container] of Object.entries(data.informationContainers)) {
          this.informationContainers.set(id, container as InformationContainer);
        }
      }

      console.log(`📥 BIM data imported: ${this.workPackages.size} work packages, ${this.informationContainers.size} containers`);
      eventBus.emit(EventType.PROJECT_UPDATED, { bimDataImported: true });
      return true;
    } catch (error) {
      console.error('❌ Erro ao importar dados BIM:', error);
      return false;
    }
  }

  /**
   * Exporta dados BIM em formato XML (ISO 19650)
   */
  public exportBIMDataXML(): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<BIMData schema="ISO 19650" version="1.0">\n';
    xml += `  <Project name="${this.getProjectName()}" exportedAt="${new Date().toISOString()}" />\n`;
    
    xml += '  <WorkPackages>\n';
    for (const wp of this.workPackages.values()) {
      xml += `    <WorkPackage id="${wp.id}" name="${wp.name}" status="${wp.status}">\n`;
      xml += `      <Description>${wp.description}</Description>\n`;
      xml += `      <Created>${wp.created.toISOString()}</Created>\n`;
      xml += `      <Modified>${wp.modified.toISOString()}</Modified>\n`;
      if (wp.dueDate) {
        xml += `      <DueDate>${wp.dueDate.toISOString()}</DueDate>\n`;
      }
      xml += '    </WorkPackage>\n';
    }
    xml += '  </WorkPackages>\n';

    xml += '  <InformationContainers>\n';
    for (const container of this.informationContainers.values()) {
      xml += `    <InformationContainer id="${container.id}" name="${container.name}" type="${container.type}" status="${container.status}" version="${container.version}">\n`;
      xml += `      <Created>${container.created.toISOString()}</Created>\n`;
      xml += `      <Modified>${container.modified.toISOString()}</Modified>\n`;
      xml += '      <Metadata>\n';
      for (const [key, value] of Object.entries(container.metadata)) {
        xml += `        <${key}>${value}</${key}>\n`;
      }
      xml += '      </Metadata>\n';
      xml += '    </InformationContainer>\n';
    }
    xml += '  </InformationContainers>\n';

    xml += '</BIMData>\n';
    return xml;
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
