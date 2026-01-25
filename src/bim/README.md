# BIM Module

Módulo dedicado para funcionalidades BIM (Building Information Modeling) no ArxisVR.

## 📁 Estrutura

```
bim/
├── inspector/     # IFC Inspector (propriedades, geometria, relações)
├── 4d/            # Temporal Planning (cronogramas, timeline)
├── 5d/            # Cost Management (custos, orçamento)
├── 6d/            # Facilities Management (O&M, ativos)
└── index.ts       # Barrel export
```

## 🎯 Status de Implementação

### ✅ Inspector (Básico)
- Interface definida
- Placeholder para migração do IFC Inspector da UI

### 🚧 BIM 4D (Planejamento)
- Estrutura de dados definida (Task, Schedule)
- TODO: Implementar importação MS Project/Primavera
- TODO: Simulação de timeline
- TODO: Curva S e caminho crítico

### 🚧 BIM 5D (Custos)
- Estrutura de dados definida (CostItem, Budget)
- TODO: Quantificação automática
- TODO: Integração com SINAPI/CYPE
- TODO: Curva de desembolso

### 🚧 BIM 6D (Facilities)
- Estrutura de dados definida (Asset, MaintenanceRecord)
- TODO: Gestão de ativos
- TODO: Manutenção preventiva/corretiva
- TODO: Integração com sistemas prediais

## 📋 Roadmap

### Curto Prazo (1-2 meses)
1. Migrar IFC Inspector da UI para `bim/inspector/`
2. Implementar IFCInspector completo

### Médio Prazo (3-6 meses)
1. BIM 4D: Importação de cronogramas
2. BIM 4D: Simulação de timeline
3. BIM 5D: Quantificação automática

### Longo Prazo (6-12 meses)
1. BIM 5D: Sistema completo de custos
2. BIM 6D: Facilities Management

## 🔗 Integração

```typescript
import { IFCInspector, BIM4DManager, BIM5DManager, BIM6DManager } from './bim';

// Uso futuro
const inspector = new IFCInspector();
const scheduleManager = new BIM4DManager();
const costManager = new BIM5DManager();
const fmManager = new BIM6DManager();
```

## 📚 Referências

- **IFC Standards**: BuildingSMART International
- **ISO 19650**: BIM Management Standards
- **BIM Dimensions**: 3D (Geometry), 4D (Time), 5D (Cost), 6D (Facilities)
