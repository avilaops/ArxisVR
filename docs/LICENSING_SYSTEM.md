# Sistema de Licenciamento e Liberação de Módulos

Sistema completo de controle de acesso baseado em planos de assinatura para o ArxisVR.

## 📋 Visão Geral

O sistema controla o acesso a funcionalidades (features) e limites de uso baseado no plano contratado:

- **Free Trial** - Teste gratuito de 14 dias com recursos básicos
- **Starter (R$899/mês)** - Para pequenas equipes (até 5 usuários)
- **Professional (R$2.490/mês)** - Recursos avançados, usuários ilimitados
- **Enterprise (sob consulta)** - Customizações e suporte dedicado

## 🏗️ Arquitetura

```
src/systems/licensing/
├── LicenseManager.ts      # Core: gerenciamento de licenças e features
├── LicenseMiddleware.ts   # Backend: validação em rotas Express
├── LicenseHooks.ts        # Frontend: hooks React/TS para UI
└── LicenseComponents.ts   # UI: componentes visuais de upgrade
```

## 🔑 Features Disponíveis

### Por Plano

#### Free Trial
- ✅ Visualizador IFC básico
- ✅ Navegação básica
- ✅ Ambiente floresta
- ✅ Avatares básicos
- ✅ Ferramentas de medição
- ✅ 2 usuários, 3 projetos, 5GB

#### Starter (R$899)
- ✅ Tudo do Free, mais:
- ✅ Colaboração em tempo real
- ✅ Avatares de engenheiro
- ✅ Ambientes múltiplos (floresta, campo, urbano)
- ✅ Anotações e seções
- ✅ Modo VR
- ✅ 5 usuários, 10 projetos, 50GB

#### Professional (R$2.490)
- ✅ Tudo do Starter, mais:
- ✅ Ambientes personalizados
- ✅ Vídeo conferência + voice chat
- ✅ Avatares customizados + família
- ✅ Detecção de colisões
- ✅ Estimativa de custos
- ✅ Schedule 4D
- ✅ API completa
- ✅ Usuários ilimitados, 500GB

#### Enterprise (sob consulta)
- ✅ Tudo do Professional, mais:
- ✅ SSO integration
- ✅ Custom branding
- ✅ Suporte dedicado
- ✅ Armazenamento ilimitado
- ✅ Implantação on-premise

## 🚀 Como Usar

### Backend - Proteger Rotas

```typescript
import { requireFeature, checkLimit } from './systems/licensing/LicenseMiddleware';
import { Feature } from './systems/licensing/LicenseManager';

// Proteger endpoint que requer feature específica
app.post('/api/projects/clash-detection', 
  requireFeature(Feature.CLASH_DETECTION),
  async (req, res) => {
    // Lógica da detecção de colisões
  }
);

// Verificar limite antes de criar recurso
app.post('/api/projects',
  checkLimit('maxProjects'),
  async (req, res) => {
    // Criar novo projeto
  }
);

// Múltiplas features requeridas
app.post('/api/collaboration/video',
  requireFeature(
    Feature.REAL_TIME_COLLABORATION,
    Feature.VIDEO_CONFERENCING
  ),
  startVideoCall
);
```

### Frontend - Verificar Features

```typescript
import { useFeature, usePlan, useLimit } from './systems/licensing/LicenseHooks';
import { Feature } from './systems/licensing/LicenseManager';

// Verificar feature única
function ClashDetectionButton() {
  const { isAvailable, requiredPlan } = useFeature(Feature.CLASH_DETECTION);
  
  if (!isAvailable) {
    return (
      <button onClick={() => showUpgradePrompt(requiredPlan)}>
        🔒 Clash Detection (Requer upgrade)
      </button>
    );
  }
  
  return <button onClick={runClashDetection}>Detectar Colisões</button>;
}

// Verificar limites
function ProjectList() {
  const projects = useProjects();
  const limit = useLimit('maxProjects', projects.length);
  
  return (
    <div>
      <h2>Projetos ({limit.current}/{limit.limit})</h2>
      
      {limit.isNearLimit && (
        <Warning>
          Você está próximo do limite de projetos.
          <a href="/pricing">Fazer upgrade</a>
        </Warning>
      )}
      
      {!limit.isWithinLimit && (
        <Error>
          Limite de projetos atingido.
          <a href="/pricing">Aumentar limite</a>
        </Error>
      )}
    </div>
  );
}

// Informações do plano
function PlanStatus() {
  const plan = usePlan();
  
  return (
    <div>
      <h3>{plan.name}</h3>
      {plan.isTrial && (
        <p>Trial • {plan.daysRemaining} dias restantes</p>
      )}
    </div>
  );
}
```

### UI - Componentes Visuais

```typescript
import { 
  PlanBadge, 
  FeatureBlockOverlay,
  LimitWarningToast 
} from './ui/components/LicenseComponents';

// Exibir badge do plano atual
const badge = new PlanBadge(document.body);

// Bloquear feature e mostrar upgrade
FeatureBlockOverlay.show(Feature.CUSTOM_AVATARS);

// Notificar limite atingido
LimitWarningToast.show('maxProjects', 10, 10);
```

## 🔄 Fluxo de Inicialização

### 1. Login do Usuário

```typescript
import { initializeLicense } from './systems/licensing/LicenseHooks';

async function handleLogin(userId: string, orgId: string) {
  // ... autenticação ...
  
  // Inicializar licença
  await initializeLicense(userId, orgId);
  
  // Licença está carregada e pronta
}
```

### 2. API Endpoint de Licença

Crie endpoint no backend:

```typescript
app.get('/api/license/:organizationId', async (req, res) => {
  const { organizationId } = req.params;
  
  // Buscar licença do banco de dados
  const license = await db.licenses.findOne({ organizationId });
  
  res.json({
    userId: license.userId,
    organizationId: license.organizationId,
    plan: license.plan,
    startDate: license.startDate,
    endDate: license.endDate,
    isActive: license.isActive,
    isTrial: license.isTrial,
    customFeatures: license.customFeatures || [],
    customLimits: license.customLimits || {}
  });
});
```

### 3. Verificação Automática

O middleware verifica automaticamente:

```typescript
// No servidor Express
app.use(attachLicenseInfo); // Adiciona info de licença em todas as respostas

// Respostas incluem:
{
  "data": { ... },
  "license": {
    "plan": "professional",
    "planName": "Professional",
    "isTrial": false,
    "daysRemaining": 345
  }
}
```

## 📊 Banco de Dados

### Schema de Licença

```sql
CREATE TABLE licenses (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  organization_id UUID NOT NULL,
  plan VARCHAR(50) NOT NULL, -- 'starter', 'professional', 'enterprise'
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT true,
  is_trial BOOLEAN DEFAULT false,
  custom_features JSONB DEFAULT '[]',
  custom_limits JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_licenses_org ON licenses(organization_id);
CREATE INDEX idx_licenses_active ON licenses(is_active, end_date);
```

### Uso de Recursos

```sql
CREATE TABLE resource_usage (
  id UUID PRIMARY KEY,
  organization_id UUID NOT NULL,
  resource_type VARCHAR(50), -- 'projects', 'users', 'storage'
  current_value INTEGER,
  last_updated TIMESTAMP DEFAULT NOW()
);
```

## 🔐 Segurança

### Validação em Camadas

1. **Frontend** - UX e feedback imediato
2. **Backend** - Validação real (não pode ser burlada)
3. **Database** - Constraints e limites

### Exemplo Completo

```typescript
// 1. Frontend - Check antes de tentar
if (!hasFeature(Feature.CLASH_DETECTION)) {
  FeatureBlockOverlay.show(Feature.CLASH_DETECTION);
  return;
}

// 2. Fazer request
const response = await fetch('/api/projects/clash-detection', {
  method: 'POST',
  body: JSON.stringify(data)
});

// 3. Backend valida novamente
if (response.status === 403) {
  const error = await response.json();
  // { error: 'Feature not available', upgradeUrl: '/pricing' }
  showUpgradeModal(error);
}
```

## 🎯 Exemplos de Uso Real

### Bloquear Botão

```typescript
function CustomAvatarButton() {
  const { isAvailable } = useFeature(Feature.CUSTOM_AVATARS);
  
  return (
    <button 
      disabled={!isAvailable}
      onClick={isAvailable ? openAvatarEditor : showUpgrade}
    >
      {isAvailable ? 'Editar Avatar' : '🔒 Customizar Avatar (Pro)'}
    </button>
  );
}
```

### Verificar Antes de Upload

```typescript
async function uploadProject(file: File) {
  const projectCount = await getProjectCount();
  const limit = useLimit('maxProjects', projectCount);
  
  if (!limit.isWithinLimit) {
    LimitWarningToast.show('projetos', projectCount, limit.limit);
    return;
  }
  
  // Verificar tamanho do arquivo
  const fileSizeMB = file.size / (1024 * 1024);
  const maxSize = licenseManager.getLimit('maxFileSize');
  
  if (fileSizeMB > maxSize) {
    alert(`Arquivo muito grande. Limite: ${maxSize}MB`);
    return;
  }
  
  // Prosseguir com upload
  await uploadFile(file);
}
```

### Condicionar Menu

```typescript
function NavigationMenu() {
  const features = usePlan().features;
  
  return (
    <nav>
      <MenuItem href="/viewer">Visualizador</MenuItem>
      
      {hasFeature(Feature.CLASH_DETECTION) && (
        <MenuItem href="/clash">Detecção Colisões</MenuItem>
      )}
      
      {hasFeature(Feature.SCHEDULE_4D) && (
        <MenuItem href="/schedule">4D Schedule</MenuItem>
      )}
      
      {hasFeature(Feature.API_ACCESS) && (
        <MenuItem href="/api">API</MenuItem>
      )}
    </nav>
  );
}
```

## 📈 Métricas e Analytics

Rastreie uso de features para otimizar planos:

```typescript
// Logs de tentativas de acesso a features bloqueadas
app.post('/api/analytics/feature-blocked', (req, res) => {
  const { feature, plan } = req.body;
  
  // Salvar no analytics
  analytics.track('feature_blocked', {
    feature,
    currentPlan: plan,
    timestamp: new Date()
  });
  
  res.status(200).send();
});
```

## 🔄 Processo de Upgrade

```typescript
async function upgradePlan(newTier: PlanTier) {
  // 1. Processar pagamento
  const payment = await processPayment(newTier);
  
  // 2. Atualizar licença no banco
  await updateLicense({
    plan: newTier,
    endDate: addMonths(new Date(), 1)
  });
  
  // 3. Refresh licença no cliente
  await refreshLicense();
  
  // 4. Recarregar UI com novas features
  window.location.reload();
}
```

## 🐛 Troubleshooting

**Feature aparece disponível mas API bloqueia:**
- Verifique se `initializeLicense()` foi chamado após login
- Confirme que licença no DB está atualizada
- Check logs do middleware no backend

**Limites não estão sendo respeitados:**
- Verifique implementação de `getCurrentUsage()` no middleware
- Confirme queries no banco de dados
- Valide que limites customizados estão sendo aplicados

**Badge do plano não aparece:**
- Confirme que `PlanBadge` foi instanciado após DOM ready
- Verifique se licença foi inicializada
- Check console para erros JavaScript

## 📝 Checklist de Implementação

- [ ] Criar tabela `licenses` no banco de dados
- [ ] Criar tabela `resource_usage` no banco
- [ ] Implementar endpoint `/api/license/:orgId`
- [ ] Chamar `initializeLicense()` após login
- [ ] Proteger rotas backend com `requireFeature()`
- [ ] Adicionar checks no frontend antes de ações
- [ ] Implementar UI de upgrade (modals, toasts)
- [ ] Configurar analytics de features bloqueadas
- [ ] Testar fluxo completo de upgrade
- [ ] Documentar features customizadas para Enterprise

## 🚀 Deploy

O sistema funciona automaticamente após:
1. Licenças configuradas no banco
2. Endpoints de API implementados
3. `initializeLicense()` chamado no login

Não requer configuração adicional no ambiente.
