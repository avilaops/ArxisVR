# 🌐 GitHub Pages - ArxisVR

## Configuração Atual

O site está configurado para ser publicado em:
**https://arxisvr.avila.inc/**

## ✅ O que já está configurado

### 1. Domínio Customizado
- Arquivo `CNAME` na raiz com: `arxisvr.avila.inc`
- Workflow configurado para copiar CNAME para dist/

### 2. GitHub Actions
- Workflow em `.github/workflows/deploy.yml`
- Deploy automático a cada push na branch `main`
- Build otimizado para produção

### 3. Configurações do Vite
- Base path: `/`
- Build otimizado para produção
- WASM e arquivos estáticos configurados

## 🚀 Como Funciona

### Deploy Automático
Sempre que você faz push na branch `main`:

```bash
git add .
git commit -m "feat: nova funcionalidade"
git push
```

O GitHub Actions automaticamente:
1. ✅ Faz checkout do código
2. ✅ Instala dependências
3. ✅ Executa build (`npm run build`)
4. ✅ Cria arquivo `.nojekyll`
5. ✅ Copia `CNAME` para dist
6. ✅ Faz deploy no GitHub Pages

### Tempo de Deploy
- ⏱️ Processo completo: 2-4 minutos
- 🔄 Status visível na aba "Actions" do GitHub

## 📋 Verificar Configuração DNS

Para o domínio customizado funcionar, configure no seu provedor DNS:

### Opção 1: CNAME (Recomendado)
```
Type: CNAME
Name: arxisvr (ou @)
Value: avilaops.github.io
TTL: 3600
```

### Opção 2: A Record
```
Type: A
Name: @
Value: 185.199.108.153
Value: 185.199.109.153
Value: 185.199.110.153
Value: 185.199.111.153
TTL: 3600
```

## 🔧 Configurações no GitHub

### 1. Habilitar GitHub Pages
1. Vá em: Settings → Pages
2. Source: **GitHub Actions**
3. Custom domain: **arxisvr.avila.inc**
4. ✅ Enforce HTTPS

### 2. Permissões
As permissões já estão configuradas no workflow:
```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

## 🐛 Troubleshooting

### Site não carrega
1. Verifique Actions: https://github.com/avilaops/ArxisVR/actions
2. Confirme se o workflow rodou com sucesso
3. Aguarde 1-2 minutos após deploy

### Domínio customizado não funciona
1. Verifique configuração DNS
2. Aguarde propagação DNS (até 24h)
3. Verifique se CNAME está no dist após build:
   ```bash
   npm run build
   ls dist/CNAME
   ```

### Arquivos WASM não carregam
1. Verifique se pasta `public/wasm/` existe
2. Confirme que arquivos .wasm estão no build:
   ```bash
   ls dist/wasm/
   ```

### 404 em rotas
- O arquivo `public/404.html` já está configurado
- Vite está configurado com SPA fallback

## 📦 Build Local

Para testar o build localmente:

```bash
# Build
npm run build

# Preview do build
npm run preview
# Abra: http://localhost:4173
```

## 🔄 Processo de Deploy Manual

Se precisar fazer deploy manual:

```bash
# 1. Build
npm run build

# 2. Adicionar CNAME e .nojekyll
cp CNAME dist/
touch dist/.nojekyll

# 3. Deploy (GitHub Actions cuida disso automaticamente)
```

## 📊 Status do Deploy

Você pode ver o status do deploy em tempo real:
- **Actions**: https://github.com/avilaops/ArxisVR/actions
- **Environments**: https://github.com/avilaops/ArxisVR/deployments

## 🎯 URLs Disponíveis

Após o deploy, os seguintes arquivos estarão disponíveis:

- **App Principal**: https://arxisvr.avila.inc/
- **Demo Simples**: https://arxisvr.avila.inc/test-ifc-simple.html
- **Demo Completa**: https://arxisvr.avila.inc/ifc-optimized-demo.html
- **Arquivos de Exemplo**: https://arxisvr.avila.inc/Examples-files/

## 🔐 HTTPS

- ✅ GitHub Pages fornece HTTPS automático
- ✅ Certificado SSL gerenciado automaticamente
- ✅ Redirecionamento HTTP → HTTPS habilitado

## 📝 Próximos Passos

1. ✅ Verifique se o workflow está rodando
2. ✅ Configure DNS (se ainda não configurou)
3. ✅ Aguarde propagação DNS
4. ✅ Teste: https://arxisvr.avila.inc/
5. ✅ Compartilhe! 🎉

---

**Site ao vivo em**: https://arxisvr.avila.inc/
**Status do deploy**: [Ver Actions](https://github.com/avilaops/ArxisVR/actions)
