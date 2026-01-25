# Tests

Infraestrutura de testes para ArxisVR usando Vitest.

## 🧪 Executando Testes

```bash
# Executar testes em modo watch
npm test

# Executar testes uma vez
npm run test:run

# Executar testes com UI interativa
npm run test:ui

# Executar testes com cobertura
npm run test:coverage
```

## 📁 Estrutura

```
__tests__/
├── setup.ts           # Configuração global dos testes
├── core.test.ts       # Testes do módulo core
├── engine.test.ts     # Testes do engine
└── bim.test.ts        # Testes do módulo BIM (futuro)
```

## ✅ Convenções

- **Naming**: `*.test.ts` para arquivos de teste
- **Location**: Co-located com código ou em `__tests__/`
- **Coverage**: Mínimo 70% para módulos críticos
- **Mocking**: Usar `vi.mock()` do Vitest

## 📊 Status Atual

- ✅ Infraestrutura configurada
- ✅ Testes de exemplo criados
- ✅ EventBus testado
- 🚧 Engine tests (básico)
- 🚧 BIM tests (placeholder)
- ❌ Integration tests (TODO)
- ❌ E2E tests (TODO)

## 🎯 Próximos Passos

1. Adicionar testes para todos os managers (SelectionManager, ProjectManager, etc)
2. Testes de integração entre módulos
3. E2E tests com Playwright
4. Aumentar cobertura para 80%+

## 📚 Referências

- [Vitest Docs](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
