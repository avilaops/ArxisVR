# 🚀 QUICK START - IFC Loader Otimizado

## Teste Rápido (1 minuto)

### Opção 1: Demo HTML (mais fácil)

1. Abra um terminal na pasta do projeto
2. Rode o servidor:
   ```bash
   npm run dev
   ```
3. Abra: `http://localhost:5173/demos/ifc-optimized-demo.html`
4. Arraste um arquivo IFC da pasta `Examples-files/`
5. 🎉 Pronto! Veja as estatísticas em tempo real

### Opção 2: App Principal

1. Rode o servidor:
   ```bash
   npm run dev
   ```
2. Abra: `http://localhost:5173/`
3. Use o botão "📂 Open IFC File" no menu
4. Selecione qualquer `.ifc` da pasta `Examples-files/`
5. 🎉 O loader otimizado já está ativo por padrão!

## 📂 Arquivos de Teste

Use qualquer IFC da pasta `Examples-files/`:

- ✅ `EDUARDO SAMPA.ifc` - Modelo pequeno (teste rápido)
- ✅ `VZZ086_25 Magnussão - Res. Heitor.ifc` - Modelo médio
- ✅ `ELE - VZZ086_25.ifc` - Elétrico
- ✅ `HID - VZZ086_25.ifc` - Hidráulico

## 🎯 O que você vai ver

### Durante o Carregamento:
- 🎨 Overlay animado com progresso
- 📊 Estatísticas em tempo real:
  - Elementos carregados
  - FPS atual
  - Memória usada
  - Tempo restante

### Depois do Carregamento:
```
📊 ESTATÍSTICAS DE CARREGAMENTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏱️  Tempo total: 3.45s
📦 Elementos carregados: 4.523
🎯 Elementos instanciados: 3.891 (86%)
💾 Memória economizada: 247 MB
🎨 Draw calls economizados: 3.234
📍 Células espaciais: 156
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 💡 Dicas Rápidas

1. **Modelo não aparece?**
   - Use o scroll do mouse para dar zoom out
   - O modelo pode estar muito grande/pequeno

2. **Carregamento lento?**
   - Normal para arquivos > 50 MB
   - O preview aparece em segundos, o resto carrega progressivamente

3. **FPS baixo?**
   - O LOD automático deve estabilizar em 55-60 FPS
   - Se não, pode ser que seu GPU seja limitado

4. **Quer ver o código?**
   - Veja `src/loaders/exemplo-uso-loader.ts` com 8 exemplos práticos
   - Documentação completa em `docs/IFC_OPTIMIZED_LOADER.md`

## 🔧 Desenvolvimento

### Estrutura de Arquivos:
```
src/loaders/
├── IFCOptimizedLoader.ts       ⭐ Loader principal
├── InstanceManager.ts          🎯 Sistema de instancing
├── exemplo-uso-loader.ts       📚 Exemplos de uso
└── workers/
    └── ifc-parser-worker.ts    🔧 Web Worker

src/ui/
└── LoadingOverlay.ts           🎨 UI de progresso

docs/
└── IFC_OPTIMIZED_LOADER.md     📖 Documentação completa
```

### Integração no seu Código:

```typescript
import { IFCOptimizedLoader } from './loaders/IFCOptimizedLoader';

// Setup
const loader = new IFCOptimizedLoader(scene, camera, lodSystem, entityManager);

// Carregar
await loader.loadOptimized(file);

// Ver stats
console.log(loader.getStats());
```

## 📊 Performance Esperada

| Tamanho | Tempo | Memória Salva | FPS |
|---------|-------|---------------|-----|
| < 1K elementos | 0.5-2s | 10-30 MB | 60 |
| 1K-10K elementos | 2-10s | 50-200 MB | 55-60 |
| > 10K elementos | 10-30s | 200-800 MB | 50-60 |

## 🐛 Problemas Comuns

### "WASM not found"
→ Verifique que existe a pasta `/public/wasm/` com `web-ifc.wasm`

### "Worker error"
→ Normal, o loader usa fallback automático

### "Out of memory"
→ Arquivo muito grande (> 500 MB), considere simplificar o modelo

## 📚 Próximos Passos

1. ✅ Teste o demo HTML
2. ✅ Veja as estatísticas
3. ✅ Leia `docs/IFC_OPTIMIZED_LOADER.md`
4. ✅ Adapte para seu projeto usando `exemplo-uso-loader.ts`

---

**🚀 Carregue IFCs de forma INCRÍVEL! Qualquer dúvida, veja a documentação completa.**
