# ArxisVR - Ollama AI Integration Guide

## 📋 Pré-requisitos

1. **Instalar Ollama**
   - Windows: Baixe em https://ollama.ai/download
   - Ou use: `winget install Ollama.Ollama`

2. **Baixar o modelo recomendado**
   ```bash
   ollama pull llama3.2:3b
   ```

   **Modelos alternativos** (caso sua máquina aguente mais):
   ```bash
   # Modelos de texto menores (recomendado para máquinas com 8-16GB RAM)
   ollama pull llama3.2:3b      # ~2GB - RECOMENDADO
   ollama pull phi3:mini         # ~2.3GB - Rápido
   
   # Modelos maiores (16GB+ RAM)
   ollama pull llama3:8b         # ~4.7GB
   ollama pull mistral:7b        # ~4GB
   
   # Modelos especializados
   ollama pull codellama:7b      # Para código
   ollama pull llama3-uncensored # Sem filtros
   ```

3. **Verificar se o Ollama está rodando**
   ```bash
   ollama list
   ```

## 🚀 Como Usar

### 1. Iniciar o Ollama
O Ollama deve iniciar automaticamente após a instalação. Caso contrário:
```bash
ollama serve
```

### 2. Configurar o ambiente
O arquivo `.env` já está configurado com:
```env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:3b
```

### 3. Usar no código

```csharp
using ArxisVR.AI;

// Carregar configuração
var config = AIConfig.LoadFromEnvironment();

// Criar serviço Ollama
using var ollama = new OllamaService(config);

// Verificar disponibilidade
if (await ollama.IsAvailableAsync())
{
    Console.WriteLine("✅ Ollama está disponível!");
    
    // Listar modelos
    var models = await ollama.GetAvailableModelsAsync();
    Console.WriteLine($"Modelos disponíveis: {string.Join(", ", models)}");
}

// Criar assistente especializado em IFC
var assistant = new IfcAIAssistant(ollama);

// Fazer perguntas
var response = await assistant.AskAsync("Como faço para medir distâncias no modelo?");
Console.WriteLine(response);

// Analisar elementos IFC
var properties = new Dictionary<string, string>
{
    ["Type"] = "IfcWall",
    ["Height"] = "3.0m",
    ["Thickness"] = "0.2m",
    ["Material"] = "Concrete"
};
var analysis = await assistant.AnalyzeElementAsync("Wall", properties);
Console.WriteLine(analysis);
```

## 🎯 Funcionalidades

### OllamaService
- ✅ Verificar disponibilidade do serviço
- ✅ Listar modelos instalados
- ✅ Gerar respostas simples
- ✅ Gerar respostas em streaming
- ✅ Chat com contexto (memória de conversa)

### IfcAIAssistant
- ✅ Assistente especializado em IFC/BIM
- ✅ Análise de elementos e propriedades
- ✅ Ajuda contextual com recursos
- ✅ Sugestões inteligentes
- ✅ Histórico de conversação

## 💡 Exemplos de Uso

### Chat simples
```csharp
var assistant = new IfcAIAssistant(ollama);
var answer = await assistant.AskAsync("O que é um arquivo IFC?");
```

### Streaming (para respostas em tempo real)
```csharp
await foreach (var chunk in ollama.GenerateStreamAsync("Explique BIM"))
{
    Console.Write(chunk);
}
```

### Obter ajuda sobre recursos
```csharp
var help = await assistant.GetFeatureHelpAsync("VR Mode");
```

### Sugestões contextuais
```csharp
var suggestions = await assistant.GetSuggestionsAsync("Usuário abriu um modelo IFC grande");
// Retorna: ["Ative o modo de camadas para melhor performance", ...]
```

## ⚙️ Configurações Avançadas

No `AIConfig`, você pode ajustar:

```csharp
var config = new AIConfig
{
    OllamaBaseUrl = "http://localhost:11434",
    OllamaModel = "llama3.2:3b",
    MaxTokens = 2048,          // Tamanho máximo da resposta
    Temperature = 0.7f         // 0.0 = conservador, 1.0 = criativo
};
```

## 🔧 Solução de Problemas

### Ollama não conecta
```bash
# Verificar se está rodando
curl http://localhost:11434/api/tags

# Reiniciar serviço
ollama serve
```

### Modelo não encontrado
```bash
# Verificar modelos instalados
ollama list

# Baixar modelo
ollama pull llama3.2:3b
```

### Memória insuficiente
- Use modelos menores: `phi3:mini` ou `llama3.2:3b`
- Reduza `MaxTokens` no `AIConfig`
- Feche outros programas

## 📊 Requisitos de Sistema

| Modelo | RAM mínima | Tamanho | Velocidade |
|--------|-----------|---------|------------|
| llama3.2:3b | 8GB | ~2GB | ⭐⭐⭐⭐⭐ |
| phi3:mini | 8GB | ~2.3GB | ⭐⭐⭐⭐⭐ |
| llama3:8b | 16GB | ~4.7GB | ⭐⭐⭐⭐ |
| mistral:7b | 16GB | ~4GB | ⭐⭐⭐⭐ |
| llama3-uncensored | 16GB | ~4.7GB | ⭐⭐⭐⭐ |

## 🔒 Segurança

- ✅ `.env` está no `.gitignore` (API keys não vazam)
- ✅ Ollama roda localmente (dados não saem da máquina)
- ✅ Sem telemetria ou tracking

## 📚 Links Úteis

- [Ollama GitHub](https://github.com/ollama/ollama)
- [Ollama Models Library](https://ollama.ai/library)
- [API Documentation](https://github.com/ollama/ollama/blob/main/docs/api.md)
