# BIM 4D/5D/6D

## **🧱 EPIC 0 — FUNDAMENTAÇÃO (BASE MUNDIAL)**

### Core Técnico

- [ ]  Engine 3D própria (Three.js / WebGPU / WebGL2)
- [ ]  Loader IFC  (streaming + lazy loading)
- [ ]  ECS (Entity Component System)
- [ ]  Scene Graph desacoplado
- [ ]  Multithread (Web Workers)
- [ ]  GPU Instancing
- [ ]  Frustum + Occlusion Culling
- [ ]  LOD automático por distância / relevância
- [ ]  Precisão métrica 1:1 real
- [ ]  Sistema de coordenadas global (georreferenciado)

### Padrões

- [ ]  IFC 2x3 / IFC4 / IFC4.3
- [ ]  ISO 19650 (BIM Management)
- [ ]  OpenBIM compliance
- [ ]  Versionamento de modelos

## **🧩 EPIC 1 — BIM 3D (BASE VISUAL + DADOS)**

### Visualização

- [ ]  Navegação FPS / Orbital / Walkthrough
- [ ]  Clipping planes avançados
- [ ]  Explode view por sistemas
- [ ]  Isolamento por disciplina
- [ ]  Filtros por propriedades IFC
- [ ]  Temas visuais (disciplinas, status, risco)

### Dados

- [ ]  Inspector IFC completo
- [ ]  Query engine (SQL-like sobre IFC)
- [ ]  Seleção por regra (ex: todos os IfcWall do pavimento X)
- [ ]  Exportação CSV / JSON

## **⏱️ EPIC 2 — BIM 4D (PLANEJAMENTO & TEMPO)**

### Integração de Cronograma

- [ ]  Import MS Project
- [ ]  Import Primavera P6
- [ ]  Import Excel (custom mapping)
- [ ]  API para cronogramas externos

### Vinculação Obra ↔ Modelo

- [ ]  Link tarefa ↔ elemento IFC
- [ ]  Link por GUID
- [ ]  Link por regra (ex: paredes por pavimento)
- [ ]  Múltiplas tarefas por elemento

### Simulação 4D

- [ ]  Timeline interativa
- [ ]  Play / Pause / Scrub
- [ ]  Visualização por fases
- [ ]  Estados: planejado / em execução / concluído / atraso
- [ ]  Comparação planejado vs realizado
- [ ]  Simulação de cenários (what-if)

### Controle

- [ ]  Curva S automática
- [ ]  Caminho crítico visual
- [ ]  Alertas de conflito temporal
- [ ]  Logs de alteração de cronograma

## **💰 EPIC 3 — BIM 5D (CUSTOS & ORÇAMENTO)**

### Quantificação

- [ ]  Takeoff automático por IFC
- [ ]  Quantificação por regra
- [ ]  Quantificação manual assistida
- [ ]  Versionamento de medições

### Custos

- [ ]  Banco de preços (local/global)
- [ ]  Integração SINAPI / CYPE / custom
- [ ]  Custos por elemento
- [ ]  Custos por tarefa (4D ↔ 5D)
- [ ]  Custos indiretos
- [ ]  Curva de desembolso

### Simulação Financeira

- [ ]  Orçado vs realizado
- [ ]  Impacto de atraso no custo
- [ ]  Simulação de inflação
- [ ]  Simulação de cenário (troca de material)

### Relatórios

- [ ]  DRE da obra
- [ ]  Fluxo de caixa
- [ ]  Export PDF / Excel
- [ ]  Dashboards executivos

## **🏢 EPIC 4 — BIM 6D (OPERAÇÃO & CICLO DE VIDA)**

### Ativos

- [ ]  Cadastro de ativos por IFC
- [ ]  Dados de fabricante
- [ ]  Vida útil
- [ ]  Manuais vinculados
- [ ]  Garantias

### Manutenção

- [ ]  Planos preventivos
- [ ]  Ordens de serviço
- [ ]  Histórico por elemento
- [ ]  Custo de manutenção acumulado

### Operação

- [ ]  Consumo energético
- [ ]  Simulação de eficiência
- [ ]  Integração IoT (sensores)
- [ ]  Digital Twin operacional

## **🔐 EPIC 5 — GOVERNANÇA & SEGURANÇA**

- [ ]  Multi-tenant
- [ ]  RBAC (roles)
- [ ]  Auditoria completa
- [ ]  Logs imutáveis
- [ ]  Versionamento de decisões
- [ ]  Trilhas ISO 19650
- [ ]  Assinatura digital de entregáveis

## **🌍 EPIC 6 — COLABORAÇÃO GLOBAL**

- [ ]  Comentários ancorados no modelo
- [ ]  Issues por elemento
- [ ]  Aprovações de fase
- [ ]  Markups 3D
- [ ]  Histórico de revisões
- [ ]  Comparação visual entre versões
- [ ]  Modo apresentação executiva

## **🤖 EPIC 7 — IA APLICADA AO BIM**

> Diferencial brutal.
> 
- [ ]  Detecção automática de conflitos 4D
- [ ]  Previsão de atraso
- [ ]  Previsão de estouro de custo
- [ ]  Sugestão de replanejamento
- [ ]  Leitura de IFC “em linguagem natural”
- [ ]  Copiloto BIM (pergunte ao modelo)

## **📦 EPIC 8 — ECOSSISTEMA & ESCALA**

- [ ]  API pública
- [ ]  SDK para parceiros
- [ ]  Plugins (Revit, Archicad, Navisworks)
- [ ]  White-label
- [ ]  Cloud + On-prem
- [ ]  Licenciamento por módulo

