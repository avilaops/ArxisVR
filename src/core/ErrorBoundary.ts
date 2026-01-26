/**
 * Global Error Boundary - Enterprise Error Handling
 * 
 * Captura todos os erros não tratados e envia para:
 * - NotificationSystem (UI feedback)
 * - Console estruturado (rastreabilidade)
 * - Telemetria (opcional, futuro)
 */

import { getNotificationSystem } from '../ui/NotificationSystem';

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  sessionId?: string;
  timestamp: number;
  userAgent: string;
  url: string;
}

export interface ErrorReport {
  message: string;
  stack?: string;
  context: ErrorContext;
  type: 'error' | 'unhandledRejection' | 'resourceError';
}

export class ErrorBoundary {
  private static instance: ErrorBoundary | null = null;
  private notifications = getNotificationSystem();
  private errorQueue: ErrorReport[] = [];
  private maxQueueSize = 50;
  private sessionId: string;

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.setupGlobalHandlers();
  }

  public static getInstance(): ErrorBoundary {
    if (!ErrorBoundary.instance) {
      ErrorBoundary.instance = new ErrorBoundary();
    }
    return ErrorBoundary.instance;
  }

  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  private setupGlobalHandlers(): void {
    // Captura erros síncronos
    window.onerror = (message, _source, _lineno, _colno, error) => {
      this.handleError({
        message: error?.message || String(message),
        stack: error?.stack,
        context: this.getContext('window.onerror'),
        type: 'error'
      });
      return true; // Previne log duplicado no console
    };

    // Captura promises rejeitadas sem catch
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        message: event.reason?.message || String(event.reason),
        stack: event.reason?.stack,
        context: this.getContext('unhandledrejection'),
        type: 'unhandledRejection'
      });
      event.preventDefault();
    });

    // Captura erros de carregamento de recursos
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        const target = event.target as HTMLElement;
        this.handleError({
          message: `Resource failed to load: ${target.tagName}`,
          stack: `src: ${(target as any).src || (target as any).href || 'unknown'}`,
          context: this.getContext('resourceError'),
          type: 'resourceError'
        });
      }
    }, true);

    console.info('✅ ErrorBoundary: Global error handlers initialized');
  }

  private getContext(action: string): ErrorContext {
    return {
      action,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      sessionId: this.sessionId
    };
  }

  private handleError(report: ErrorReport): void {
    // Log estruturado no console
    console.error('🚨 [ErrorBoundary]', {
      message: report.message,
      type: report.type,
      stack: report.stack,
      context: report.context,
      timestamp: new Date(report.context.timestamp).toISOString()
    });

    // Adiciona à fila
    this.errorQueue.push(report);
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift();
    }

    // Notifica usuário (apenas erros críticos, não resources)
    if (report.type !== 'resourceError') {
      this.notifications.error(
        'Erro Inesperado',
        this.getUserFriendlyMessage(report.message)
      );
    }

    // TODO: Enviar para telemetria/Sentry (futuro)
    // this.sendToTelemetry(report);
  }

  private getUserFriendlyMessage(technicalMessage: string): string {
    // Mapeia erros técnicos para mensagens amigáveis
    const friendlyMessages: Record<string, string> = {
      'Network request failed': 'Falha na conexão de rede',
      'Cannot read property': 'Erro ao processar dados',
      'undefined is not': 'Erro ao processar dados',
      'Failed to fetch': 'Falha ao carregar recurso'
    };

    for (const [key, message] of Object.entries(friendlyMessages)) {
      if (technicalMessage.includes(key)) {
        return message;
      }
    }

    return 'Ocorreu um erro inesperado';
  }

  /**
   * Wrapper para código síncrono com error boundary
   */
  public wrap<T>(fn: () => T, context?: Partial<ErrorContext>): T | undefined {
    try {
      return fn();
    } catch (error) {
      this.handleError({
        message: (error as Error).message,
        stack: (error as Error).stack,
        context: { ...this.getContext('wrap'), ...context },
        type: 'error'
      });
      return undefined;
    }
  }

  /**
   * Wrapper para código assíncrono com error boundary
   */
  public async wrapAsync<T>(
    fn: () => Promise<T>,
    context?: Partial<ErrorContext>
  ): Promise<T | undefined> {
    try {
      return await fn();
    } catch (error) {
      this.handleError({
        message: (error as Error).message,
        stack: (error as Error).stack,
        context: { ...this.getContext('wrapAsync'), ...context },
        type: 'error'
      });
      return undefined;
    }
  }

  /**
   * Obtém relatório de erros (para debugging/export)
   */
  public getErrorReport(): ErrorReport[] {
    return [...this.errorQueue];
  }

  /**
   * Limpa fila de erros
   */
  public clearErrors(): void {
    this.errorQueue = [];
    console.info('✅ ErrorBoundary: Error queue cleared');
  }
}

/**
 * Singleton accessor
 */
export function getErrorBoundary(): ErrorBoundary {
  return ErrorBoundary.getInstance();
}
