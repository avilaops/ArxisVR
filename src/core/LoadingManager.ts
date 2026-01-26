/**
 * LoadingManager - Gerencia estados de carregamento com progresso e timeout
 */

export class LoadingManager {
  private loadingEl: HTMLElement | null;
  private stageEl: HTMLElement | null;
  private detailEl: HTMLElement | null;
  private progressEl: HTMLElement | null;
  private recoveryEl: HTMLElement | null;
  private startTime: number;
  private timeoutId: number | null = null;
  private timeoutDuration = 15000; // 15 segundos

  constructor() {
    this.loadingEl = document.getElementById('loading');
    this.stageEl = document.getElementById('loading-stage');
    this.detailEl = document.getElementById('loading-detail');
    this.progressEl = document.getElementById('loading-progress');
    this.recoveryEl = document.getElementById('loading-recovery');
    this.startTime = Date.now();

    // Inicia timeout
    this.startTimeout();
  }

  /**
   * Atualiza estágio do carregamento
   */
  public setStage(stage: string, detail: string, progress: number): void {
    if (this.stageEl) this.stageEl.textContent = stage;
    if (this.detailEl) this.detailEl.textContent = detail;
    if (this.progressEl) this.progressEl.style.width = `${progress}%`;

    // Reseta timeout a cada progresso
    this.resetTimeout();
  }

  /**
   * Completa carregamento e esconde
   */
  public complete(): void {
    if (this.loadingEl) {
      this.loadingEl.classList.add('hidden');
      setTimeout(() => {
        this.loadingEl?.remove();
      }, 300);
    }

    this.clearTimeout();
    const elapsed = Date.now() - this.startTime;
    console.log(`✅ Loading completed in ${elapsed}ms`);
  }

  /**
   * Mostra ações de recovery
   */
  private showRecovery(): void {
    if (this.recoveryEl) {
      this.recoveryEl.style.display = 'block';
    }
    console.warn('⏱️ Loading timeout - showing recovery actions');
  }

  /**
   * Inicia timeout
   */
  private startTimeout(): void {
    this.timeoutId = window.setTimeout(() => {
      this.showRecovery();
    }, this.timeoutDuration);
  }

  /**
   * Reseta timeout
   */
  private resetTimeout(): void {
    this.clearTimeout();
    this.startTimeout();
  }

  /**
   * Limpa timeout
   */
  private clearTimeout(): void {
    if (this.timeoutId !== null) {
      window.clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}
