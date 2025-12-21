# 🤖 VIZZIO AI Assistant - Quick Start

## 🚀 Setup Rápido (3 passos)

### 1️⃣ Instalar Ollama
```bash
# Windows (escolha uma opção)
winget install Ollama.Ollama
# OU baixe em: https://ollama.ai/download
```

### 2️⃣ Instalar modelo recomendado
```bash
# Execute o script de setup (RECOMENDADO)
.\setup-ollama.bat

# OU manualmente:
ollama pull llama3.2:3b
```

### 3️⃣ Rodar a aplicação
```bash
.\run.bat
```

Pronto! O AI Assistant será carregado automaticamente se o Ollama estiver disponível. ✅

## 💻 Requisitos Mínimos

- **RAM**: 8GB (recomendado 16GB)
- **Espaço**: ~2GB para o modelo básico
- **Internet**: Para download inicial do modelo

## 🎯 Modelos Disponíveis

### Leves (8GB RAM) ⭐ RECOMENDADO
```bash
ollama pull llama3.2:3b    # ~2GB - Balanceado (PADRÃO)
ollama pull phi3:mini       # ~2.3GB - Mais rápido
```

### Médios (16GB RAM)
```bash
ollama pull llama3:8b       # ~4.7GB - Melhor qualidade
ollama pull mistral:7b      # ~4GB - Bom para português
```

### Especializados
```bash
ollama pull codellama:7b       # Para análise de código
ollama pull llama3-uncensored  # Sem filtros de conteúdo
```

## 🎨 Funcionalidades

### ✅ Já Implementado
- 🤖 Chat inteligente sobre IFC/BIM
- 🔍 Análise de elementos e propriedades
- 💡 Sugestões contextuais
- 📚 Ajuda sobre recursos do viewer
- 🧠 Memória de conversação
- ⚡ Respostas em streaming

### 🎯 Exemplos de Uso

```csharp
// Criar assistente
var config = AIConfig.LoadFromEnvironment();
using var ollama = new OllamaService(config);
var assistant = new IfcAIAssistant(ollama);

// Fazer perguntas
var help = await assistant.AskAsync("Como usar o modo VR?");

// Analisar elementos
var properties = new Dictionary<string, string>
{
    ["Type"] = "IfcWall",
    ["Height"] = "3.0m"
};
var analysis = await assistant.AnalyzeElementAsync("Wall", properties);

// Obter sugestões
var suggestions = await assistant.GetSuggestionsAsync("Modelo grande carregado");
```

## 🔧 Configuração Avançada

### Arquivo `.env`
```env
# Ollama Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:3b

# Outras APIs (opcional)
OPENAI_API_KEY=sua_chave_aqui
DEEPSEEK_API_KEY=sua_chave_aqui
```

### Alterar modelo
Edite o `.env`:
```env
OLLAMA_MODEL=phi3:mini  # Ou qualquer modelo instalado
```

### Ajustar performance
```csharp
var config = new AIConfig
{
    MaxTokens = 1024,      // Reduzir para respostas mais curtas
    Temperature = 0.5f     // 0.0-1.0 (menor = mais conservador)
};
```

## 🐛 Solução de Problemas

### ❌ "AI Assistant not available"
```bash
# Verificar se Ollama está rodando
curl http://localhost:11434/api/tags

# Se não estiver, iniciar:
ollama serve
```

### ❌ "Model not found"
```bash
# Listar modelos instalados
ollama list

# Baixar modelo padrão
ollama pull llama3.2:3b
```

### ❌ Memória insuficiente
1. Use modelo menor: `phi3:mini` (2.3GB)
2. Feche outros programas
3. Ajuste `MaxTokens` para 512 ou menos

### ❌ Respostas lentas
1. Use GPU se disponível (NVIDIA/AMD)
2. Troque para modelo menor
3. Reduza `MaxTokens`

## 📊 Performance Esperada

| Modelo | Tamanho | RAM | Velocidade | Qualidade |
|--------|---------|-----|------------|-----------|
| llama3.2:3b | 2GB | 8GB | ⚡⚡⚡⚡⚡ | ⭐⭐⭐⭐ |
| phi3:mini | 2.3GB | 8GB | ⚡⚡⚡⚡⚡ | ⭐⭐⭐ |
| llama3:8b | 4.7GB | 16GB | ⚡⚡⚡⚡ | ⭐⭐⭐⭐⭐ |
| mistral:7b | 4GB | 16GB | ⚡⚡⚡⚡ | ⭐⭐⭐⭐⭐ |

## 🔒 Segurança & Privacidade

- ✅ Roda 100% local (dados não saem da máquina)
- ✅ Sem telemetria ou tracking
- ✅ `.env` no `.gitignore` (API keys seguras)
- ✅ Código open source

## 📚 Documentação Completa

Ver: [docs/OLLAMA_SETUP.md](docs/OLLAMA_SETUP.md)

## 🆘 Precisa de Ajuda?

1. **Documentação**: [docs/OLLAMA_SETUP.md](docs/OLLAMA_SETUP.md)
2. **Ollama Docs**: https://github.com/ollama/ollama/blob/main/docs/api.md
3. **Issues**: https://github.com/avilaops/vizzio2/issues
4. **Suporte**: https://support.avila.inc

---

**Feito com ❤️ pela [Avila Development](https://avilaops.com)**
