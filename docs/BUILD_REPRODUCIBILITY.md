# Build Reprodutível - Resolver Dependência `file:`

## 🚨 Problema

```json
{
  "dependencies": {
    "avx-render": "file:../Avx-Core/categories/rendering/avx-render/pkg"
  }
}
```

**Impactos**:
- ❌ Build não é reprodutível (depende de path local)
- ❌ CI/CD vai falhar
- ❌ Outros desenvolvedores não conseguem rodar
- ❌ Não pode ser deployado em produção

## ✅ Soluções

### Opção 1: NPM Registry (Recomendado para Produção)

**Publicar `avx-render` no npm registry**

```bash
cd ../Avx-Core/categories/rendering/avx-render
wasm-pack build --target web
npm publish ./pkg
```

Depois:
```json
{
  "dependencies": {
    "avx-render": "^0.1.0"
  }
}
```

**Prós**:
- ✅ Versionamento semântico
- ✅ Funciona em qualquer máquina
- ✅ CI/CD friendly
- ✅ Padrão da indústria

**Contras**:
- Precisa publicar toda vez que mudar
- Precisa conta npm

---

### Opção 2: GitHub Packages (Privado)

```bash
# Configurar .npmrc
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
@your-org:registry=https://npm.pkg.github.com
```

```json
{
  "dependencies": {
    "avx-render": "github:your-org/avx-core#v0.1.0"
  }
}
```

**Prós**:
- ✅ Privado (se necessário)
- ✅ Integrado com GitHub
- ✅ Reprodutível

**Contras**:
- Requer autenticação
- Mais complexo

---

### Opção 3: Git Submodule + Postinstall (Temporário)

```bash
# Adicionar submodule
git submodule add https://github.com/your-org/avx-core.git vendor/avx-core
```

```json
{
  "scripts": {
    "postinstall": "cd vendor/avx-core/categories/rendering/avx-render && wasm-pack build --target web && cp -r pkg ../../../../node_modules/avx-render"
  },
  "dependencies": {
    "avx-render": "*"
  }
}
```

**Prós**:
- ✅ Funciona sem registry
- ✅ Controle total do source

**Contras**:
- ⚠️ Lento (build toda vez)
- ⚠️ Complexo
- ⚠️ Hack (não é solução limpa)

---

### Opção 4: Monorepo com Workspaces (Melhor para Dev)

**Estrutura**:
```
/
├── packages/
│   ├── avx-core/
│   ├── avx-render/
│   └── arxis-vr/
└── package.json (root)
```

**Root package.json**:
```json
{
  "workspaces": [
    "packages/*"
  ]
}
```

**arxis-vr/package.json**:
```json
{
  "dependencies": {
    "avx-render": "workspace:*"
  }
}
```

**Prós**:
- ✅ Zero config
- ✅ Desenvolvimento local perfeito
- ✅ Symlinks automáticos

**Contras**:
- Requer reestruturar repo
- Só funciona localmente (precisa combinar com Opção 1 ou 2 para CI)

---

## 🎯 Recomendação

### Curto Prazo (1 semana)
**Opção 4 (Monorepo)** para desenvolvimento local

```bash
# Reestruturar
mkdir packages
mv ../Avx-Core packages/avx-core
mv . packages/arxis-vr

# Root package.json
{
  "private": true,
  "workspaces": ["packages/*"]
}
```

### Médio Prazo (1 mês)
**Opção 1 (NPM Publish)** para CI/CD

```bash
cd packages/avx-core/categories/rendering/avx-render
npm publish --access public
```

### Configuração Híbrida
```json
{
  "dependencies": {
    "avx-render": "workspace:* || ^0.1.0"
  }
}
```

- **Local**: usa workspace
- **CI/CD**: baixa do npm

---

## 📋 Checklist de Implementação

### [ ] Fase 1: Monorepo (local)
- [ ] Criar estrutura de workspaces
- [ ] Mover projetos para `packages/`
- [ ] Atualizar imports
- [ ] Testar `npm install`

### [ ] Fase 2: CI Setup
- [ ] Configurar wasm-pack no CI
- [ ] Script de build para avx-render
- [ ] Cache de builds

### [ ] Fase 3: NPM Publish
- [ ] Criar conta npm / GitHub Packages
- [ ] Configurar CI para publish automático
- [ ] Versionamento semântico
- [ ] Changelog

---

## 🧪 Validação

```bash
# Limpar cache
rm -rf node_modules package-lock.json

# Fresh install (deve funcionar em qualquer máquina)
npm install

# Build (deve ser idêntico)
npm run build
sha256sum dist/main.js  # Hash deve ser o mesmo em qualquer máquina
```

---

## 🔗 Referências

- [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces)
- [wasm-pack](https://rustwasm.github.io/wasm-pack/)
- [GitHub Packages](https://docs.github.com/en/packages)
