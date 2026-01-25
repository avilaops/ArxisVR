/**
 * BIM 4D - Temporal Planning
 * 
 * Integração de cronogramas com modelo 3D:
 * - Importação de MS Project, Primavera P6
 * - Vinculação tarefa ↔ elemento IFC
 * - Simulação de construção (timeline)
 * - Curva S, caminho crítico
 * - Comparação planejado vs realizado
 */

// TODO: Implementar funcionalidades 4D
// Placeholder para desenvolvimento futuro

export interface Task {
  id: string;
  name: string;
  start: Date;
  end: Date;
  duration: number;
  dependencies: string[];
  linkedElements: string[]; // IFC GUIDs
}

export interface Schedule {
  id: string;
  name: string;
  tasks: Task[];
}

export class BIM4DManager {
  // Placeholder - será implementado conforme roadmap
}
