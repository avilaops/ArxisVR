# Vizzio - Guia Rápido de Uso

## 🚀 Início Rápido

### 1. Executar o Aplicativo
```bash
cd C:\Users\Administrador\source\repos\Vizzio
dotnet run
```

### 2. **Carregar Arquivo IFC**
**Opção 1: Menu File** (Recomendado) 🆕
- Click em **File > Open IFC...**, OU
- Pressione **Ctrl+O**
- Selecione o arquivo .ifc no diálogo

**Opção 2: Arrastar e Soltar**
- **Arraste e solte** um arquivo `.ifc` na janela do Vizzio

### 2. **Navegar no Modelo**
```
W / S       - Mover para frente/trás
A / D       - Mover para esquerda/direita
Space       - Subir
Shift       - Descer
Mouse Direito - Capturar/Liberar mouse para olhar
Mouse Scroll  - Zoom in/out
+ / -       - Aumentar/Diminuir velocidade
```

### Seleção
```
Mouse Hover    - Destacar elemento
Click Esquerdo - Selecionar elemento
Delete         - Limpar seleção
```

### Visualização
```
F  - Focar câmera no modelo
R  - Reset câmera
L  - Ligar/Desligar iluminação
F11 - Fullscreen
```

### Interface
```
F1 - Ajuda
F2 - Toggle modo VR
F3 - Toggle modo AR
```

## 📋 Painéis da Interface

### 1. Lista de Elementos (Esquerda)
- **Busca**: Digite para filtrar elementos
- **Filtros**: Checkboxes por tipo (Paredes, Vigas, etc.)
- **Seleção**: Click em elemento para ver propriedades

### 2. Propriedades (Direita)
Aparece quando elemento está selecionado:
- Nome e tipo do elemento
- Editor de cor
- Toggle de visibilidade
- Tabela de propriedades IFC
- Informações de geometria

### 3. Estatísticas (Inferior)
- Nome do arquivo
- Total de elementos
- Tipos de elementos
- Vértices e triângulos
- Centro e tamanho do modelo

### 4. Menu Principal (Topo)
- **File**: Abrir, Sair
- **View**: Toggle painéis, Foco, Reset
- **VR/AR**: Ativar VR/AR, Configurações
- **Help**: Controles, Sobre

## 🥽 Modo VR

### Ativar VR
1. Pressione **F2** ou Menu > VR/AR > Enable VR
2. Se OpenXR estiver disponível, usará headset
3. Caso contrário, modo estereoscópico simulado

### Configurar VR
Menu > VR/AR > VR Settings
- Ajustar **IPD** (distância entre olhos)
- Ajustar **Altura da Cabeça**
- Ver status do dispositivo

## 🎨 Trabalhando com Elementos

### Visualizar Propriedades
1. Click esquerdo no elemento 3D
2. Veja propriedades no painel direito
3. Propriedades IFC organizadas por grupo

### Filtrar por Tipo
1. No painel de elementos
2. Desmarque tipos que não quer ver
3. Elementos ocultados em tempo real

### Buscar Elementos
1. Digite no campo de busca
2. Busca por nome ou tipo
3. Lista filtra automaticamente

### Editar Cor
1. Selecione elemento
2. Click no color picker
3. Escolha nova cor

### Ocultar/Mostrar
1. Selecione elemento
2. Toggle checkbox "Visible"
3. Elemento oculto/mostrado

## 💡 Dicas

### Performance
- Use filtros para ocultar tipos não necessários
- Modelos grandes podem ter frame rate reduzido
- Ajuste velocidade da câmera com +/-

### Navegação
- Use Right-Click + Mouse para olhar livremente
- Pressione ESC para liberar o mouse
- Use F para focar automaticamente no modelo

### Seleção
- Hover mostra informações rápidas
- Click seleciona e abre propriedades completas
- Delete limpa seleção atual

### Interface
- Painéis podem ser movidos e redimensionados
- Use F2/F3/F4 para toggle rápido
- Menu principal sempre visível

## 📦 Tipos de Elementos Suportados

O Vizzio reconhece e coloriza automaticamente:
- 🧱 **Paredes** (IfcWall) - Bege claro
- 🏗️ **Lajes** (IfcSlab) - Cinza
- 🏠 **Telhados** (IfcRoof) - Vermelho escuro
- ⚙️ **Vigas** (IfcBeam) - Azul
- 🏛️ **Colunas** (IfcColumn) - Rosa
- 🪟 **Janelas** (IfcWindow) - Azul claro
- 🚪 **Portas** (IfcDoor) - Marrom
- 🪜 **Escadas** (IfcStair) - Cinza escuro
- 🛡️ **Guarda-corpos** (IfcRailing) - Preto
- 🪑 **Mobiliário** (IfcFurniture) - Bege

## 🔧 Solução de Problemas

### Arquivo não carrega
- Verifique se é arquivo .ifc válido
- Veja mensagens no console
- Tente arquivo IFC de exemplo

### Performance baixa
- Oculte tipos não necessários
- Feche outros aplicativos
- Verifique drivers de vídeo

### Interface não aparece
- Verifique se OpenGL 3.3+ está disponível
- Atualize drivers gráficos

### VR não funciona
- Instale runtime OpenXR (SteamVR, Oculus)
- Conecte headset VR
- Modo simulado funciona sem headset

## 📞 Suporte

- **Issues**: https://github.com/avilaops/vizzio2/issues
- **Documentação**: README.md
- **Melhorias**: MELHORIAS.md

## 🎯 Atalhos de Teclado - Resumo

```
┌─────────────────────────────────────┐
│      NAVEGAÇÃO                      │
├─────────────────────────────────────┤
│ WASD          - Mover               │
│ Space/Shift   - Cima/Baixo          │
│ Mouse R-Click - Olhar               │
│ Scroll        - Zoom                │
│ +/-           - Velocidade          │
├─────────────────────────────────────┤
│      VISUALIZAÇÃO                   │
├─────────────────────────────────────┤
│ F             - Focar modelo        │
│ R             - Reset câmera        │
│ L             - Toggle luz          │
│ F11           - Fullscreen          │
├─────────────────────────────────────┤
│      INTERFACE                      │
├─────────────────────────────────────┤
│ F1            - Ajuda               │
│ F2            - VR Mode             │
│ F3            - AR Mode             │
│ Ctrl+O        - Abrir arquivo IFC   │
│ Delete        - Limpar seleção      │
│ ESC           - Sair/Liberar mouse  │
└─────────────────────────────────────┘
```

---

**Pronto para explorar seus modelos IFC! 🏗️🚀**
