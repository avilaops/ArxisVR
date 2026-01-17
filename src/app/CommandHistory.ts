import { eventBus, EventType } from '../core';

/**
 * CommandHistory - Sistema de Undo/Redo
 * 
 * Gerencia histórico de ações reversíveis.
 * Implementa padrão Command com undo/redo.
 */

/**
 * Interface para comandos reversíveis
 */
export interface ReversibleCommand {
  id: string;
  type: string;
  timestamp: number;
  
  // Executa o comando
  execute(): Promise<void> | void;
  
  // Desfaz o comando
  undo(): Promise<void> | void;
  
  // Refaz o comando
  redo(): Promise<void> | void;
  
  // Descrição do comando
  description(): string;
}

/**
 * Snapshot de estado para undo/redo
 */
export interface StateSnapshot {
  id: string;
  timestamp: number;
  data: any;
  type: string;
}

/**
 * CommandHistory - Gerenciador de histórico
 */
export class CommandHistory {
  private static instance: CommandHistory;
  
  private history: ReversibleCommand[] = [];
  private currentIndex: number = -1;
  private maxHistorySize: number = 100;
  
  private snapshots: Map<string, StateSnapshot> = new Map();
  
  private isUndoing: boolean = false;
  private isRedoing: boolean = false;
  
  private constructor() {
    console.log('↩️ CommandHistory initialized');
  }
  
  /**
   * Singleton instance
   */
  public static getInstance(): CommandHistory {
    if (!CommandHistory.instance) {
      CommandHistory.instance = new CommandHistory();
    }
    return CommandHistory.instance;
  }
  
  /**
   * Executa e adiciona comando ao histórico
   */
  public async execute(command: ReversibleCommand): Promise<void> {
    try {
      // Executa o comando
      await command.execute();
      
      // Remove comandos após o índice atual (branch nova)
      if (this.currentIndex < this.history.length - 1) {
        this.history.splice(this.currentIndex + 1);
      }
      
      // Adiciona ao histórico
      this.history.push(command);
      this.currentIndex++;
      
      // Limita tamanho do histórico
      if (this.history.length > this.maxHistorySize) {
        this.history.shift();
        this.currentIndex--;
      }
      
      // Emite evento
      eventBus.emit(EventType.COMMAND_EXECUTE_SUCCESS, {
        id: command.id,
        payload: { command: command.type },
        duration: 0
      });
      
      console.log(`✅ Command executed: ${command.description()}`);
      this.logState();
      
    } catch (error) {
      console.error('❌ Command execution failed:', error);
      throw error;
    }
  }
  
  /**
   * Desfaz último comando
   */
  public async undo(): Promise<boolean> {
    if (!this.canUndo()) {
      console.warn('⚠️ Nothing to undo');
      return false;
    }
    
    this.isUndoing = true;
    
    try {
      const command = this.history[this.currentIndex];
      
      console.log(`↶ Undoing: ${command.description()}`);
      
      await command.undo();
      
      this.currentIndex--;
      
      eventBus.emit(EventType.EDIT_UNDO, {});
      
      console.log(`✅ Undo complete`);
      this.logState();
      
      return true;
      
    } catch (error) {
      console.error('❌ Undo failed:', error);
      return false;
      
    } finally {
      this.isUndoing = false;
    }
  }
  
  /**
   * Refaz próximo comando
   */
  public async redo(): Promise<boolean> {
    if (!this.canRedo()) {
      console.warn('⚠️ Nothing to redo');
      return false;
    }
    
    this.isRedoing = true;
    
    try {
      this.currentIndex++;
      const command = this.history[this.currentIndex];
      
      console.log(`↷ Redoing: ${command.description()}`);
      
      await command.redo();
      
      eventBus.emit(EventType.EDIT_REDO, {});
      
      console.log(`✅ Redo complete`);
      this.logState();
      
      return true;
      
    } catch (error) {
      console.error('❌ Redo failed:', error);
      this.currentIndex--;
      return false;
      
    } finally {
      this.isRedoing = false;
    }
  }
  
  /**
   * Verifica se pode desfazer
   */
  public canUndo(): boolean {
    return this.currentIndex >= 0;
  }
  
  /**
   * Verifica se pode refazer
   */
  public canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }
  
  /**
   * Retorna descrição do próximo undo
   */
  public getUndoDescription(): string | null {
    if (!this.canUndo()) return null;
    return this.history[this.currentIndex].description();
  }
  
  /**
   * Retorna descrição do próximo redo
   */
  public getRedoDescription(): string | null {
    if (!this.canRedo()) return null;
    return this.history[this.currentIndex + 1].description();
  }
  
  /**
   * Retorna histórico completo
   */
  public getHistory(): ReversibleCommand[] {
    return [...this.history];
  }
  
  /**
   * Retorna índice atual
   */
  public getCurrentIndex(): number {
    return this.currentIndex;
  }
  
  /**
   * Salva snapshot de estado
   */
  public saveSnapshot(type: string, data: any): string {
    const snapshot: StateSnapshot = {
      id: `snapshot_${Date.now()}_${Math.random()}`,
      timestamp: Date.now(),
      data: JSON.parse(JSON.stringify(data)), // Deep clone
      type
    };
    
    this.snapshots.set(snapshot.id, snapshot);
    
    // Limita número de snapshots (mantém últimos 50)
    if (this.snapshots.size > 50) {
      const oldest = Array.from(this.snapshots.keys())[0];
      this.snapshots.delete(oldest);
    }
    
    return snapshot.id;
  }
  
  /**
   * Recupera snapshot de estado
   */
  public getSnapshot(id: string): StateSnapshot | null {
    return this.snapshots.get(id) || null;
  }
  
  /**
   * Limpa histórico
   */
  public clear(): void {
    this.history = [];
    this.currentIndex = -1;
    this.snapshots.clear();
    
    console.log('🧹 Command history cleared');
  }
  
  /**
   * Define tamanho máximo do histórico
   */
  public setMaxHistorySize(size: number): void {
    this.maxHistorySize = Math.max(1, size);
    
    // Ajusta histórico atual se necessário
    if (this.history.length > this.maxHistorySize) {
      const excess = this.history.length - this.maxHistorySize;
      this.history.splice(0, excess);
      this.currentIndex -= excess;
    }
  }
  
  /**
   * Verifica se está em operação de undo/redo
   */
  public get isOperating(): boolean {
    return this.isUndoing || this.isRedoing;
  }
  
  /**
   * Log do estado atual
   */
  private logState(): void {
    const canUndo = this.canUndo();
    const canRedo = this.canRedo();
    const undoDesc = this.getUndoDescription();
    const redoDesc = this.getRedoDescription();
    
    console.log(`📊 History: ${this.currentIndex + 1}/${this.history.length}`);
    console.log(`   Undo: ${canUndo ? `✅ ${undoDesc}` : '❌ Nothing'}`);
    console.log(`   Redo: ${canRedo ? `✅ ${redoDesc}` : '❌ Nothing'}`);
  }
  
  /**
   * Retorna estatísticas
   */
  public getStats(): {
    totalCommands: number;
    currentIndex: number;
    canUndo: boolean;
    canRedo: boolean;
    undoStackSize: number;
    redoStackSize: number;
    snapshotsCount: number;
  } {
    return {
      totalCommands: this.history.length,
      currentIndex: this.currentIndex,
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
      undoStackSize: this.currentIndex + 1,
      redoStackSize: this.history.length - this.currentIndex - 1,
      snapshotsCount: this.snapshots.size
    };
  }
}

// Export singleton instance
export const commandHistory = CommandHistory.getInstance();
