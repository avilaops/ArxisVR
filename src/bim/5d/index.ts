/**
 * BIM 5D - Cost Management
 * 
 * Gestão de custos integrada ao modelo:
 * - Quantificação automática (takeoff)
 * - Banco de preços (SINAPI, CYPE, custom)
 * - Vinculação custos ↔ elementos IFC
 * - Orçado vs realizado
 * - Curva de desembolso
 * - Simulação financeira
 */

// TODO: Implementar funcionalidades 5D
// Placeholder para desenvolvimento futuro

export interface CostItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  linkedElements: string[]; // IFC GUIDs
}

export interface Budget {
  id: string;
  name: string;
  items: CostItem[];
  totalCost: number;
}

export class BIM5DManager {
  // Placeholder - será implementado conforme roadmap
}
