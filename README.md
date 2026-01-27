# 🏗️ ArxisVR - Plataforma BIM Imersiva

Visualizador IFC 3D de alta performance com escala 1:1 e navegação imersiva.

## 🚀 Início Rápido

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

Abra: `http://localhost:3001`

## ✨ Recursos Principais

### 🎯 Carregamento IFC Ultra Otimizado
- **70-85% menos memória** com instancing automático
- **3-5x mais rápido** com streaming progressivo
- **LOD adaptativo** mantém 60 FPS constante
- **UI elegante** com estatísticas em tempo real

[📖 Guia Rápido IFC](docs/QUICK_START_IFC.md) | [📚 Documentação Completa](docs/IFC_OPTIMIZED_LOADER.md)

### 🎨 Interface Moderna
- Design minimalista e responsivo
- Painel lateral com camadas e propriedades
- Controles de navegação intuitivos
- Feedback visual em tempo real

### 🔧 Sistemas Core
- Motor de renderização Three.js otimizado
- Sistema ECS (Entity Component System)
- Gerenciamento de LOD inteligente
- Spatial indexing para queries rápidas
- Material pooling e geometry instancing

## 📁 Estrutura do Projeto

```
ArxisVR/
├── src/                    # Código fonte
│   ├── loaders/           # Loaders IFC otimizados
│   ├── ui/                # Componentes de interface
│   ├── engine/            # Motor de renderização
│   ├── systems/           # Sistemas core
│   └── app/               # Aplicação principal
├── demos/                 # Arquivos de demonstração
├── docs/                  # Documentação completa
├── scripts/               # Scripts utilitários
├── public/                # Assets estáticos
└── Examples-files/        # Arquivos IFC de exemplo

```

## 🎮 Demos

### Demo Simples
Interface minimalista para teste rápido do loader otimizado.

```bash
npm run dev
# Abra: http://localhost:3001/demos/test-ifc-simple.html
```

### Demo Completa
Interface completa com controles avançados e visualização de estatísticas.

```bash
npm run dev
# Abra: http://localhost:3001/demos/ifc-optimized-demo.html
```

## 📊 Performance

### Loader Tradicional vs Otimizado

| Métrica | Tradicional | Otimizado | Melhoria |
|---------|-------------|-----------|----------|
| Tempo de carga | 15s | 4s | **3.75x** |
| Uso de memória | 800 MB | 200 MB | **75%** |
| FPS (modelo grande) | 30 | 60 | **2x** |
| Draw calls | 10.000 | 2.500 | **75%** |

## 🛠️ Tecnologias

- **Three.js** - Renderização 3D WebGL
- **web-ifc** - Parser IFC nativo
- **TypeScript** - Type safety
- **Vite** - Build tool ultra-rápido
- **Web Workers** - Processamento paralelo

## 📖 Documentação

- [🚀 Guia Rápido IFC](docs/QUICK_START_IFC.md) - Comece em 2 minutos
- [📚 Documentação IFC Loader](docs/IFC_OPTIMIZED_LOADER.md) - Detalhes técnicos
- [✅ Deploy GitHub Pages](docs/DEPLOY_CHECKLIST.md) - Guia de deploy
- [🏗️ Arquitetura](docs/ARCHITECTURE.md) - Estrutura do sistema

## 🎯 Casos de Uso

- 🏢 **Coordenação BIM** - Visualização de modelos federados
- 🔍 **Inspeção** - Análise detalhada de elementos
- 📊 **Quantitativos** - Extração de dados
- 🎓 **Treinamento** - Apresentações imersivas
- 🤝 **Colaboração** - Revisões de projeto

## 🔧 Configuração

### Variáveis de Ambiente

```env
VITE_API_URL=https://api.exemplo.com
NODE_ENV=production
```

### WASM Files

Os arquivos WASM devem estar em `public/wasm/`:
- `web-ifc.wasm` - Parser IFC
- `web-ifc-mt.wasm` - Versão multi-thread

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes E2E
npm run test:e2e

# Cobertura
npm run test:coverage
```

## 🚀 Deploy

### GitHub Pages

O site é automaticamente deployado em: **https://arxisvr.avila.inc/**

Cada push na branch `main` dispara o deploy automático.

[📋 Ver Checklist de Deploy](docs/DEPLOY_CHECKLIST.md)

### Azure Static Web Apps

```bash
npm run build:azure
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Commit: `git commit -m 'feat: adiciona nova feature'`
4. Push: `git push origin feature/nova-feature`
5. Abra um Pull Request

## 📝 Licença

Veja [LICENSE](LICENSE) para detalhes.

## 🔗 Links Úteis

- **Site**: https://arxisvr.avila.inc/
- **Demo Simples**: https://arxisvr.avila.inc/demos/test-ifc-simple.html
- **Demo Completa**: https://arxisvr.avila.inc/demos/ifc-optimized-demo.html
- **Documentação**: [docs/](docs/)

## 💡 Suporte

- 📧 Email: suporte@avila.inc
- 🐛 Issues: [GitHub Issues](https://github.com/avilaops/ArxisVR/issues)
- 📖 Docs: [Documentação](docs/)

---

**Desenvolvido com ❤️ para a indústria AEC**
