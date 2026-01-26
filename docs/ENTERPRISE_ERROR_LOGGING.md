# Sistema Enterprise - Error Handling & Logging

## ✅ Implementado (26/01/2026)

### 1. Global Error Boundary

**Arquivo**: `src/core/ErrorBoundary.ts`

**Funcionalidades**:
- Captura erros síncronos (`window.onerror`)
- Captura promises rejeitadas (`unhandledrejection`)
- Captura erros de carregamento de recursos
- Queue de erros para análise posterior
- Integração com NotificationSystem (feedback ao usuário)
- Integração com Logger (rastreabilidade)
- Mensagens amigáveis ao usuário
- Session tracking

**API Pública**:
```typescript
import { getErrorBoundary } from './core';

const errorBoundary = getErrorBoundary();

// Wrapper síncrono
const result = errorBoundary.wrap(() => {
  // código que pode falhar
  return dangerousOperation();
}, { component: 'MyComponent', action: 'loadData' });

// Wrapper assíncrono
const data = await errorBoundary.wrapAsync(async () => {
  return await fetchData();
}, { component: 'API', action: 'fetchUsers' });

// Obter relatório de erros
const errors = errorBoundary.getErrorReport();

// Limpar fila
errorBoundary.clearErrors();
```

---

### 2. Logger Estruturado

**Arquivo**: `src/core/Logger.ts`

**Funcionalidades**:
- 5 níveis de log (DEBUG, INFO, WARN, ERROR, FATAL)
- Contexto estruturado (module, timestamp, correlationId)
- Console output colorido com ícones
- Storage em memória (1000 entradas por padrão)
- Exportação de logs
- Estatísticas de logs
- Transport plugável (para Sentry/Application Insights)
- Correlation ID para rastrear operações relacionadas

**API Pública**:
```typescript
import { getLogger } from './core';

const logger = getLogger();

// Logs básicos
logger.debug('MyComponent', 'Starting initialization');
logger.info('MyComponent', 'User logged in', { userId: '123' });
logger.warn('MyComponent', 'Deprecated API used');
logger.error('MyComponent', 'Failed to load', { error: e.message });
logger.fatal('MyComponent', 'Critical system failure');

// Correlation ID (rastrear operações relacionadas)
logger.setCorrelationId('operation-uuid');
logger.info('API', 'Request started');
// ... outras operações relacionadas
logger.clearCorrelationId();

// Obter logs filtrados
const errorLogs = logger.getLogs({ level: LogLevel.ERROR });
const componentLogs = logger.getLogs({ module: 'MyComponent' });

// Estatísticas
const stats = logger.getStats();
// { total: 1234, debug: 500, info: 400, warn: 200, error: 100, fatal: 34 }

// Exportar logs
const json = logger.exportLogs();

// Limpar logs
logger.clearLogs();
```

---

### 3. Integração no Sistema

**Arquivo**: `src/main.ts`

O ErrorBoundary e Logger são inicializados **antes de qualquer outro componente**:

```typescript
private async initializeApp(): Promise<void> {
  // ENTERPRISE: Initialize Error Boundary & Logger FIRST
  const errorBoundary = getErrorBoundary();
  const logger = getLogger();
  logger.info('ArxisVR', 'Starting initialization...');
  
  // ... resto da inicialização
}
```

Isso garante que **todos os erros** sejam capturados desde o início.

---

## Benefícios Imediatos

### Para Desenvolvimento
- ✅ Bugs reproduzíveis (stack trace + contexto)
- ✅ Rastreabilidade de ações (correlation ID)
- ✅ Console limpo e organizado
- ✅ Debugging facilitado (filtros, exportação)

### Para Produção
- ✅ Erros não matam a aplicação
- ✅ Feedback amigável ao usuário
- ✅ Logs estruturados para análise
- ✅ Preparado para telemetria (Sentry, Application Insights)

### Para QA/Support
- ✅ Exportar logs do usuário
- ✅ Estatísticas de erros
- ✅ Session tracking
- ✅ Fila de erros para análise posterior

---

## Próximos Passos

### 1. Telemetria (Opcional)
Adicionar transport para enviar logs e erros para:
- Sentry
- Application Insights
- LogRocket
- DataDog

```typescript
const logger = Logger.getInstance({
  transport: (entry) => {
    // Enviar para Sentry/Application Insights
    if (entry.level >= LogLevel.ERROR) {
      sendToSentry(entry);
    }
  }
});
```

### 2. Performance Monitoring
Estender o Logger para medir performance:
```typescript
logger.startTimer('IFCLoader.load');
// ... operação
logger.endTimer('IFCLoader.load'); // logs: "IFCLoader.load completed in 1234ms"
```

### 3. User Actions Tracking
Logar ações do usuário para reproduzir bugs:
```typescript
logger.info('UserAction', 'Button clicked', { 
  button: 'loadFile',
  timestamp: Date.now(),
  correlationId: sessionId 
});
```

---

## Como Usar nos Componentes

### Exemplo 1: Component com error handling
```typescript
import { getLogger, getErrorBoundary } from '../core';

export class MyComponent {
  private logger = getLogger();
  private errorBoundary = getErrorBoundary();
  
  constructor() {
    this.logger.info('MyComponent', 'Component created');
  }
  
  public async loadData(): Promise<void> {
    this.logger.setCorrelationId(`load-${Date.now()}`);
    
    const result = await this.errorBoundary.wrapAsync(async () => {
      this.logger.debug('MyComponent', 'Fetching data...');
      const data = await fetch('/api/data');
      this.logger.info('MyComponent', 'Data loaded', { count: data.length });
      return data;
    }, { component: 'MyComponent', action: 'loadData' });
    
    this.logger.clearCorrelationId();
    return result;
  }
}
```

### Exemplo 2: EventBus com logging
```typescript
// Adicionar no EventBus.ts
import { getLogger } from './Logger';

export class EventBus {
  private logger = getLogger();
  
  emit<K extends EventType>(event: K, data: EventPayload[K]): void {
    this.logger.debug('EventBus', `Event emitted: ${event}`, { data });
    // ... resto do código
  }
}
```

---

## Configuração

### Development
```typescript
const logger = Logger.getInstance({
  minLevel: LogLevel.DEBUG,  // Todos os logs
  enableConsole: true,
  enableStorage: true
});
```

### Production
```typescript
const logger = Logger.getInstance({
  minLevel: LogLevel.INFO,   // Apenas INFO+
  enableConsole: false,      // Não poluir console
  enableStorage: true,
  transport: sendToTelemetry // Enviar para servidor
});
```

---

## Checklist de Adoção

- [x] ErrorBoundary implementado
- [x] Logger implementado
- [x] Integrado no main.ts
- [ ] Substituir console.log por logger em components críticos
- [ ] Adicionar error handling em operações assíncronas
- [ ] Configurar telemetria (opcional)
- [ ] Treinar equipe no uso correto

---

## Métricas de Sucesso

Após adoção completa, esperamos:
- 🎯 **0 crashes não-tratados** (capturados pelo ErrorBoundary)
- 🎯 **100% rastreabilidade** (todos os erros logados)
- 🎯 **<5min para reproduzir bugs** (correlation ID + logs)
- 🎯 **Feedback positivo do usuário** (mensagens amigáveis)
