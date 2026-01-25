# 🎨 ArxisVR Frontend Components - Guia Completo

## 📋 Visão Geral

Este documento descreve **todos os componentes de frontend** criados para o ArxisVR, um visualizador BIM/IFC profissional com suporte WebXR.

---

## 🧩 Sistema de Design (Design System)

### Componentes Base Reutilizáveis

Localizados em `src/ui/design-system/components/`

#### 1. **Button** (`Button.ts`)
Botão reutilizável com múltiplas variantes e tamanhos.

**Funcionalidades:**
- ✅ 6 variantes: `primary`, `secondary`, `danger`, `success`, `ghost`, `link`
- ✅ 5 tamanhos: `xs`, `sm`, `md`, `lg`, `xl`
- ✅ Suporte a ícones
- ✅ Estado de loading com spinner
- ✅ Estado disabled
- ✅ Tooltip
- ✅ Full width option
- ✅ Gradientes e animações

**Uso:**
```typescript
const button = new Button({
  text: 'Salvar',
  icon: '💾',
  variant: 'primary',
  size: 'md',
  onClick: () => console.log('Clicked!')
});
```

---

#### 2. **Input** (`Input.ts`)
Campo de entrada com validação e estados visuais.

**Funcionalidades:**
- ✅ Múltiplos tipos: `text`, `number`, `email`, `password`, `search`, `tel`, `url`
- ✅ Label e placeholder
- ✅ Ícone e sufixo
- ✅ Validação com mensagens de erro
- ✅ Hint text
- ✅ Estados: normal, focus, error, disabled, readonly
- ✅ 3 tamanhos: `sm`, `md`, `lg`

**Uso:**
```typescript
const input = new Input({
  label: 'Nome do Projeto',
  placeholder: 'Digite o nome...',
  icon: '📁',
  required: true,
  onChange: (value) => console.log(value)
});
```

---

#### 3. **Card** (`Card.ts`)
Container de conteúdo com header, body e footer.

**Funcionalidades:**
- ✅ 4 variantes: `default`, `bordered`, `elevated`, `glass`
- ✅ 4 tamanhos de padding: `none`, `sm`, `md`, `lg`
- ✅ Header com título, subtítulo e ações
- ✅ Footer personalizável
- ✅ Hoverable e clickable
- ✅ Animações suaves

**Uso:**
```typescript
const card = new Card({
  title: 'Propriedades',
  subtitle: 'Informações do elemento',
  variant: 'glass',
  padding: 'md'
});
card.setContent('<p>Conteúdo aqui</p>');
```

---

#### 4. **Modal** (`Modal.ts`)
Modal/Dialog com overlay e animações.

**Funcionalidades:**
- ✅ 5 tamanhos: `sm`, `md`, `lg`, `xl`, `full`
- ✅ Header com título, subtítulo e botão fechar
- ✅ Body com scroll
- ✅ Footer personalizável
- ✅ Fechar ao clicar no overlay (opcional)
- ✅ Fechar com ESC (opcional)
- ✅ Animações de entrada/saída
- ✅ Backdrop blur

**Uso:**
```typescript
const modal = new Modal({
  title: 'Configurações',
  size: 'md',
  closeOnEscape: true
});
modal.setContent('Conteúdo do modal');
modal.open();
```

---

#### 5. **Select/Dropdown** (`Select.ts`)
Seletor dropdown com busca.

**Funcionalidades:**
- ✅ Label e placeholder
- ✅ Opções com ícones
- ✅ Busca/filtro (searchable)
- ✅ Estados: disabled, error
- ✅ Animações
- ✅ Full width option

**Uso:**
```typescript
const select = new Select({
  label: 'Unidade',
  options: [
    { value: 'm', label: 'Metros', icon: '📏' },
    { value: 'cm', label: 'Centímetros' }
  ],
  searchable: true,
  onChange: (value) => console.log(value)
});
```

---

#### 6. **Checkbox** (`Checkbox.ts`)
Checkbox com estados checked e indeterminate.

**Funcionalidades:**
- ✅ Label
- ✅ Estados: checked, indeterminate, disabled
- ✅ Animações smooth
- ✅ Custom styling

**Uso:**
```typescript
const checkbox = new Checkbox({
  label: 'Visível',
  checked: true,
  onChange: (checked) => console.log(checked)
});
```

---

#### 7. **Toggle/Switch** (`Toggle.ts`)
Toggle switch animado.

**Funcionalidades:**
- ✅ 3 tamanhos: `sm`, `md`, `lg`
- ✅ Label
- ✅ Animação suave do slider
- ✅ Gradiente quando ativo

**Uso:**
```typescript
const toggle = new Toggle({
  label: 'Alta precisão',
  checked: true,
  size: 'md',
  onChange: (checked) => console.log(checked)
});
```

---

#### 8. **Slider** (`Slider.ts`)
Slider/Range com valor visual.

**Funcionalidades:**
- ✅ Label e display de valor
- ✅ Min, max, step customizáveis
- ✅ Unidade (suffix)
- ✅ Fill visual do progresso
- ✅ Callbacks: onChange e onInput
- ✅ Disabled state

**Uso:**
```typescript
const slider = new Slider({
  label: 'Opacidade',
  min: 0,
  max: 100,
  value: 80,
  unit: '%',
  onChange: (value) => console.log(value)
});
```

---

## 🎯 Painéis Especializados BIM

### Painéis Completos

Localizados em `src/ui/panels-v2/`

#### 1. **IFC Property Panel** (`IFCPropertyPanel.ts`)
Painel profissional para exibir e editar propriedades IFC.

**Funcionalidades:**
- ✅ Grupos de propriedades por categoria:
  - 📋 Informações Básicas
  - 📐 Geometria
  - 🏗️ Construção
  - 💰 Quantitativos
- ✅ Propriedades editáveis e somente leitura
- ✅ Integração com EventBus (atualiza ao selecionar objeto)
- ✅ Export para JSON
- ✅ UI profissional com Cards
- ✅ Tabela responsiva de propriedades

**Dados Exibidos:**
- Nome, Tipo IFC, GUID, Tag
- Posição (X, Y, Z), Visibilidade
- Material, Resistência, Fase
- Volume, Área, Comprimento, Peso

---

#### 2. **Project Explorer** (`ProjectExplorer.ts`)
Navegação hierárquica do projeto BIM (árvore).

**Funcionalidades:**
- ✅ Hierarquia completa: Project → Site → Building → Storey → Element
- ✅ Ícones por tipo de elemento
- ✅ Checkbox de visibilidade em cada nó
- ✅ Expand/Collapse recursivo
- ✅ Busca/filtro em tempo real
- ✅ Seleção de elementos
- ✅ Badges de tipo
- ✅ Botões: Expandir tudo, Colapsar tudo
- ✅ Integração com EventBus

**Tipos de Nós:**
- 🏗️ Projeto
- 🗺️ Site
- 🏢 Edifício
- 📐 Pavimento
- 🧱 Espaço
- ⬜ Elemento (Pilar, Viga, Laje, Parede, Porta, Janela)

---

#### 3. **Layers Panel** (`LayersPanel.ts`)
Gerenciamento de camadas com controle de visibilidade.

**Funcionalidades:**
- ✅ Lista de layers com cor e nome
- ✅ Toggle visibilidade (checkbox)
- ✅ Lock/Unlock layer
- ✅ Delete layer
- ✅ Criar nova layer (modal)
- ✅ Contador de elementos por layer
- ✅ Controle de opacidade (slider)
- ✅ Indicador visual de cor
- ✅ Integração com EventBus

**Layers Padrão:**
- Estrutura
- Arquitetura
- Hidráulica
- Elétrica
- HVAC
- Terreno

---

#### 4. **Measurement Panel** (`MeasurementPanel.ts`)
Ferramentas de medição profissionais.

**Funcionalidades:**
- ✅ 4 tipos de medição:
  - 📏 Distância
  - 📐 Área
  - 📦 Volume
  - 📐 Ângulo
- ✅ Seletor de unidades (mm, cm, m, km, in, ft)
- ✅ Toggle de alta precisão
- ✅ Lista de medições realizadas
- ✅ Deletar medições individuais
- ✅ Limpar todas
- ✅ Visualização com ícones
- ✅ Valores formatados

---

#### 5. **Settings Panel** (`SettingsPanel.ts`)
Configurações completas do aplicativo.

**Funcionalidades:**
- ✅ 4 abas:
  - 🎨 **Visual**: Tema, Qualidade, Antialiasing, Sombras, AO
  - ⚡ **Performance**: FPS Limit, LOD, Frustum Culling
  - 🎮 **Navegação**: Sensibilidade, Inverter Y, Velocidade
  - 📐 **Unidades**: Comprimento, Área, Volume
- ✅ Salvamento em localStorage
- ✅ Botão Reset (restaurar padrões)
- ✅ Integração com EventBus
- ✅ Presets de qualidade

---

## 🔧 Componentes de UI Especializados

Localizados em `src/ui/components/`

#### 1. **Toolbar** (`Toolbar.ts`)
Barra de ferramentas flutuante.

**Funcionalidades:**
- ✅ 12+ ferramentas:
  - 🔍 Seleção (V)
  - 🧭 Navegação (N)
  - 📏 Medição (M)
  - ✂️ Seção (S)
  - 👆 Pan (P)
  - 🔄 Rotação (R)
  - 🔍 Zoom (Z)
  - 🎯 Isolar (I)
  - 👁️ Ocultar (H)
  - 👻 Transparência (T)
- ✅ Hotkeys (atalhos de teclado)
- ✅ Visual feedback da ferramenta ativa
- ✅ Separadores visuais
- ✅ Design glass morphism
- ✅ Animações de hover

---

#### 2. **Minimap** (`Minimap.ts`)
Minimapa 2D do projeto.

**Funcionalidades:**
- ✅ Vista superior 2D
- ✅ Grid de referência
- ✅ Outline do edifício
- ✅ Posição da câmera
- ✅ Direção da câmera (seta)
- ✅ Bússola com Norte
- ✅ Toggle show/hide
- ✅ Canvas 2D rendering

---

#### 3. **Quick Stats** (`QuickStats.ts`)
Estatísticas rápidas do projeto.

**Funcionalidades:**
- ✅ 6 métricas:
  - 🧱 Total de Elementos
  - 👁️ Elementos Visíveis
  - 🔍 Elementos Selecionados
  - 📐 Pavimentos
  - 🏠 Espaços
  - ▲ Contagem de Polígonos
- ✅ Atualização em tempo real
- ✅ Formatação de números (K, M)
- ✅ Grid 2x3 responsivo
- ✅ Hover effects
- ✅ Glass card design

---

## 🎨 Estilo Visual

### Tema Padrão

```css
--theme-primary: #667eea (Purple/Blue)
--theme-accent: #00ff88 (Neon Green)
--theme-background: rgba(20, 20, 20, 0.95)
--theme-foreground: #fff
```

### Efeitos Visuais

- ✅ Glass Morphism (backdrop-filter blur)
- ✅ Gradientes animados
- ✅ Smooth transitions (0.2s - 0.3s)
- ✅ Box shadows com cores do tema
- ✅ Hover effects (translateY, scale)
- ✅ Animações de entrada (slide-up, fade-in)
- ✅ Border radius consistente (4px - 16px)

---

## 📂 Estrutura de Arquivos

```
src/ui/
├── design-system/
│   └── components/
│       ├── Button.ts          # ✅ Botão reutilizável
│       ├── Input.ts           # ✅ Campo de entrada
│       ├── Card.ts            # ✅ Container
│       ├── Modal.ts           # ✅ Dialog
│       ├── Select.ts          # ✅ Dropdown
│       ├── Checkbox.ts        # ✅ Checkbox
│       ├── Toggle.ts          # ✅ Switch
│       ├── Slider.ts          # ✅ Range slider
│       └── index.ts           # Export all
│
├── panels-v2/
│   ├── IFCPropertyPanel.ts   # ✅ Propriedades IFC
│   ├── ProjectExplorer.ts    # ✅ Árvore de projeto
│   ├── LayersPanel.ts        # ✅ Gerenciamento de layers
│   ├── MeasurementPanel.ts   # ✅ Medições
│   ├── SettingsPanel.ts      # ✅ Configurações
│   └── index.ts              # Export all
│
└── components/
    ├── Toolbar.ts            # ✅ Barra de ferramentas
    ├── Minimap.ts            # ✅ Minimapa
    ├── QuickStats.ts         # ✅ Estatísticas
    └── index.ts              # Export all
```

---

## 🚀 Como Usar

### Exemplo: Criando um Painel Completo

```typescript
import { 
  IFCPropertyPanel, 
  ProjectExplorer, 
  LayersPanel,
  MeasurementPanel,
  SettingsPanel 
} from './ui/panels-v2';

import { Toolbar, Minimap, QuickStats } from './ui/components';

// Inicializar painéis
const propertyPanel = new IFCPropertyPanel();
const explorer = new ProjectExplorer();
const layersPanel = new LayersPanel();
const measurementPanel = new MeasurementPanel();
const settingsPanel = new SettingsPanel();

// Inicializar componentes
const toolbar = new Toolbar();
const minimap = new Minimap();
const stats = new QuickStats();

// Adicionar ao DOM
document.getElementById('right-panel').appendChild(propertyPanel.getElement());
document.getElementById('left-panel').appendChild(explorer.getElement());

// Atualizar estatísticas
stats.updateStats({
  totalElements: 1250,
  visibleElements: 1100,
  floors: 12,
  polycount: 2500000
});
```

### Exemplo: Usando Componentes do Design System

```typescript
import { 
  Button, 
  Input, 
  Card, 
  Modal, 
  Select,
  Checkbox,
  Toggle,
  Slider 
} from './ui/design-system/components';

// Criar formulário
const form = new Card({ 
  title: 'Novo Projeto',
  padding: 'md'
});

const nameInput = new Input({
  label: 'Nome',
  placeholder: 'Digite o nome...',
  required: true
});

const unitSelect = new Select({
  label: 'Unidade',
  options: [
    { value: 'm', label: 'Metros' },
    { value: 'cm', label: 'Centímetros' }
  ]
});

const precisionToggle = new Toggle({
  label: 'Alta Precisão',
  checked: true
});

const submitBtn = new Button({
  text: 'Criar',
  variant: 'primary',
  onClick: () => console.log('Submit!')
});

form.appendChild(nameInput.getElement());
form.appendChild(unitSelect.getElement());
form.appendChild(precisionToggle.getElement());
form.appendChild(submitBtn.getElement());
```

---

## ✨ Funcionalidades Implementadas

### ✅ Sistema de Design Completo
- 8 componentes base reutilizáveis
- Totalmente tipado (TypeScript)
- Temas customizáveis
- Animações suaves
- Acessibilidade

### ✅ Painéis BIM Profissionais
- 5 painéis especializados
- Integração com EventBus
- Mock data para testes
- Export/Import de dados
- Busca e filtros

### ✅ Componentes Especializados
- Toolbar com hotkeys
- Minimap 2D
- Dashboard de estatísticas
- Todos responsivos

### ✅ Integrações
- EventBus para comunicação
- localStorage para persistência
- TypeScript strict mode
- ESM modules

---

## 🎯 Próximos Passos

Para integrar com o backend/engine existente:

1. **Conectar IFCPropertyPanel** com `IFCPropertyService`
2. **Conectar ProjectExplorer** com IFC model hierarchy
3. **Conectar LayersPanel** com `LayerManager`
4. **Conectar MeasurementPanel** com `MeasurementTool`
5. **Conectar SettingsPanel** com `appState.graphicsSettings`
6. **Conectar Toolbar** com `ToolManager`
7. **Conectar Minimap** com Scene camera position
8. **Conectar QuickStats** com Scene statistics

---

## 📝 Notas Importantes

- Todos os componentes usam **vanilla TypeScript** (sem frameworks)
- Design system independente e reutilizável
- Fácil de integrar com Three.js
- Performance otimizada (DOM manipulation mínima)
- Mobile-friendly (touch events considerados)

---

## 🎨 Créditos

Sistema de design inspirado em:
- Material Design
- Ant Design  
- Chakra UI
- Tailwind CSS

Desenvolvido para **ArxisVR** - High-performance BIM/IFC Viewer
