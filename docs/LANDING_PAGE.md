# Landing Page - ArxisVR

Landing page completa para marketing e vendas da plataforma ArxisVR.

## 📋 Estrutura

```
public/
├── landing.html          # Página principal
├── css/
│   └── landing.css       # Estilos responsivos
└── js/
    └── landing.js        # Interatividade (FAQ, formulário)

scripts/
└── landing-server.js     # Servidor Express + Email
```

## 🚀 Como Executar

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Email

Copie o arquivo de exemplo e configure suas credenciais:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais SMTP:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-de-app

SALES_EMAIL=vendas@suaempresa.com
PORT=3001
```

**Para Gmail:**
1. Ative a autenticação de 2 fatores
2. Gere uma senha de app: https://myaccount.google.com/apppasswords
3. Use a senha gerada no `SMTP_PASS`

**Para outros provedores** (SendGrid, Mailgun, AWS SES):
- Atualize `SMTP_HOST` e `SMTP_PORT`
- Configure as credenciais apropriadas

### 3. Iniciar Servidor

```bash
npm run landing
```

A landing page estará disponível em: **http://localhost:3001**

## ✨ Recursos

### Seções da Landing Page

1. **Hero** - Apresentação principal com CTAs
2. **Features** - 6 diferenciais principais
3. **Como Funciona** - 3 passos simples
4. **Planos** - Starter, Professional, Enterprise
5. **Depoimentos** - 3 cases de sucesso
6. **FAQ** - Perguntas frequentes com accordion
7. **Formulário de Contato** - Com validação e envio automático

### Funcionalidades

- ✅ Design responsivo (mobile, tablet, desktop)
- ✅ Smooth scroll entre seções
- ✅ FAQ interativo (accordion)
- ✅ Formulário com validação
- ✅ **Email automático de confirmação** para o cliente
- ✅ **Notificação por email** para equipe de vendas
- ✅ Templates HTML profissionais para emails
- ✅ Efeitos de scroll no navbar

## 📧 Sistema de Email

Quando um usuário preenche o formulário:

1. **Email para o Cliente:**
   - Confirmação de recebimento
   - Resumo da solicitação
   - Próximos passos
   - Links úteis

2. **Email para Vendas:**
   - Notificação de novo lead
   - Todos os dados do formulário
   - Classificação de prioridade
   - Ações recomendadas

## 🎨 Customização

### Cores

Edite as variáveis CSS em `public/css/landing.css`:

```css
:root {
  --primary: #2563eb;
  --secondary: #8b5cf6;
  --success: #10b981;
  /* ... */
}
```

### Conteúdo

Edite diretamente o HTML em `public/landing.html`:
- Textos
- Depoimentos
- Preços
- FAQs

### Templates de Email

Personalize os templates em `scripts/landing-server.js`:
- `createCustomerEmailTemplate()`
- `createInternalNotificationTemplate()`

## 🔒 Segurança

- Validação de campos obrigatórios no backend
- Sanitização de inputs
- Rate limiting recomendado para produção
- Credenciais via variáveis de ambiente
- HTTPS recomendado para produção

## 📦 Deploy

### Azure Static Web Apps

```bash
npm run build:azure
```

### Heroku

```bash
# Adicionar buildpack Node.js
heroku buildpacks:add heroku/nodejs

# Deploy
git push heroku main
```

### Vercel / Netlify

Configure o comando de build:
```
npm run landing
```

## 🛠️ Desenvolvimento

### Adicionar Nova Seção

1. Adicione o HTML em `landing.html`
2. Estilize em `landing.css`
3. Adicione interatividade em `landing.js` se necessário

### Modificar Formulário

1. Atualize campos em `landing.html`
2. Atualize validação em `landing-server.js`
3. Atualize templates de email conforme necessário

## 📊 Analytics (Recomendado)

Adicione ao `<head>` do `landing.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>

<!-- Meta Pixel -->
<script>
  !function(f,b,e,v,n,t,s)...
</script>
```

## 🐛 Troubleshooting

**Email não está enviando:**
- Verifique credenciais no `.env`
- Para Gmail, confirme senha de app
- Verifique logs do servidor no console

**Formulário não submete:**
- Abra DevTools > Console
- Verifique se `/api/contact` está acessível
- Confirme que o servidor está rodando

**Estilos não carregam:**
- Confirme que `public/css/landing.css` existe
- Verifique path do CSS no HTML
- Limpe cache do navegador

## 📝 Licença

Todos os direitos reservados © 2026 ArxisVR
