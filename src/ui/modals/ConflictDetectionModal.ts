/**
 * ConflictDetectionModal - Resultados de clash detection
 * Visualiza interferências entre elementos BIM
 */

import { Modal } from '../design-system/components/Modal';
import { Button } from '../design-system/components/Button';
import { Select } from '../design-system/components/Select';

export interface Clash {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  elementA: string;
  elementB: string;
  description: string;
  location: string;
  status: 'open' | 'resolved' | 'ignored';
}

export class ConflictDetectionModal {
  private modal: Modal;
  private clashes: Clash[] = [];
  private filterSeverity: string = 'all';

  constructor() {
    this.modal = new Modal({
      title: '⚠️ Detecção de Conflitos',
      size: 'lg',
      closeOnEscape: true
    });

    this.loadMockClashes();
    this.buildUI();
    this.applyStyles();
  }

  private loadMockClashes(): void {
    this.clashes = [
      {
        id: 'c1',
        severity: 'critical',
        elementA: 'Viga V-12',
        elementB: 'Duto HVAC-05',
        description: 'Interferência entre viga estrutural e duto de ar condicionado',
        location: '2º Pavimento - Eixo D/E',
        status: 'open'
      },
      {
        id: 'c2',
        severity: 'warning',
        elementA: 'Tubulação hidráulica PH-08',
        elementB: 'Eletroduto EL-23',
        description: 'Cruzamento de tubulação com eletroduto',
        location: '1º Pavimento - Banheiro',
        status: 'open'
      },
      {
        id: 'c3',
        severity: 'critical',
        elementA: 'Pilar P-15',
        elementB: 'Parede PAR-42',
        description: 'Sobreposição de pilar com alvenaria',
        location: 'Térreo - Sala 3',
        status: 'resolved'
      }
    ];
  }

  private buildUI(): void {
    const container = document.createElement('div');
    container.className = 'conflict-modal';

    // Stats
    const stats = this.createStats();
    container.appendChild(stats);

    // Filters
    const filters = document.createElement('div');
    filters.className = 'conflict-filters';

    const severityFilter = new Select({
      label: 'Severidade',
      options: [
        { value: 'all', label: 'Todos' },
        { value: 'critical', label: 'Críticos' },
        { value: 'warning', label: 'Avisos' },
        { value: 'info', label: 'Info' }
      ],
      value: this.filterSeverity,
      onChange: (value) => {
        this.filterSeverity = value;
        this.updateList();
      }
    });

    const statusFilter = new Select({
      label: 'Status',
      options: [
        { value: 'all', label: 'Todos' },
        { value: 'open', label: 'Abertos' },
        { value: 'resolved', label: 'Resolvidos' },
        { value: 'ignored', label: 'Ignorados' }
      ],
      value: 'all',
      onChange: () => this.updateList()
    });

    filters.appendChild(severityFilter.getElement());
    filters.appendChild(statusFilter.getElement());
    container.appendChild(filters);

    // Clashes list
    const list = this.createClashList();
    container.appendChild(list);

    // Actions
    const actions = document.createElement('div');
    actions.className = 'conflict-actions';

    const exportBtn = new Button({
      text: '📄 Exportar BCF',
      variant: 'primary',
      onClick: () => this.exportBCF()
    });

    const reportBtn = new Button({
      text: '📊 Gerar Relatório',
      variant: 'secondary',
      onClick: () => this.generateReport()
    });

    actions.appendChild(exportBtn.getElement());
    actions.appendChild(reportBtn.getElement());
    container.appendChild(actions);

    this.modal.setContent(container);
  }

  private createStats(): HTMLElement {
    const stats = document.createElement('div');
    stats.className = 'conflict-stats';

    const total = this.clashes.length;
    const critical = this.clashes.filter(c => c.severity === 'critical').length;
    const open = this.clashes.filter(c => c.status === 'open').length;
    const resolved = this.clashes.filter(c => c.status === 'resolved').length;

    stats.innerHTML = `
      <div class="conflict-stat">
        <div class="conflict-stat-value">${total}</div>
        <div class="conflict-stat-label">Total</div>
      </div>
      <div class="conflict-stat">
        <div class="conflict-stat-value" style="color: #f5576c">${critical}</div>
        <div class="conflict-stat-label">Críticos</div>
      </div>
      <div class="conflict-stat">
        <div class="conflict-stat-value" style="color: #ffd700">${open}</div>
        <div class="conflict-stat-label">Abertos</div>
      </div>
      <div class="conflict-stat">
        <div class="conflict-stat-value" style="color: #00ff88">${resolved}</div>
        <div class="conflict-stat-label">Resolvidos</div>
      </div>
    `;

    return stats;
  }

  private createClashList(): HTMLElement {
    const list = document.createElement('div');
    list.className = 'conflict-list';
    list.id = 'conflict-list';

    this.renderClashes(list);

    return list;
  }

  private renderClashes(container: HTMLElement): void {
    container.innerHTML = '';

    const filtered = this.filterSeverity === 'all' 
      ? this.clashes 
      : this.clashes.filter(c => c.severity === this.filterSeverity);

    filtered.forEach(clash => {
      const item = document.createElement('div');
      item.className = `conflict-item conflict-item--${clash.severity}`;

      const severityIcons: Record<string, string> = {
        critical: '🔴',
        warning: '🟡',
        info: '🔵'
      };

      item.innerHTML = `
        <div class="conflict-item-header">
          <span class="conflict-item-severity">${severityIcons[clash.severity]}</span>
          <span class="conflict-item-id">${clash.id}</span>
          <span class="conflict-item-status conflict-item-status--${clash.status}">${clash.status}</span>
        </div>
        <div class="conflict-item-elements">
          <span>${clash.elementA}</span>
          <span class="conflict-item-vs">⚡</span>
          <span>${clash.elementB}</span>
        </div>
        <div class="conflict-item-desc">${clash.description}</div>
        <div class="conflict-item-location">📍 ${clash.location}</div>
      `;

      item.addEventListener('click', () => this.showClashDetails(clash));

      container.appendChild(item);
    });
  }

  private updateList(): void {
    const list = document.getElementById('conflict-list');
    if (list) {
      this.renderClashes(list);
    }
  }

  private showClashDetails(clash: Clash): void {
    console.log('Clash details:', clash);
  }

  private exportBCF(): void {
    console.log('📄 Exportando BCF...');
  }

  private generateReport(): void {
    console.log('📊 Gerando relatório...');
  }

  public open(): void {
    this.modal.open();
  }

  private applyStyles(): void {
    if (document.getElementById('conflict-modal-styles')) return;

    const style = document.createElement('style');
    style.id = 'conflict-modal-styles';
    style.textContent = `
      .conflict-modal {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .conflict-stats {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;
      }

      .conflict-stat {
        padding: 16px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        text-align: center;
      }

      .conflict-stat-value {
        font-size: 28px;
        font-weight: 700;
        color: #667eea;
        margin-bottom: 4px;
      }

      .conflict-stat-label {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.6);
      }

      .conflict-filters {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }

      .conflict-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-height: 400px;
        overflow-y: auto;
      }

      .conflict-item {
        padding: 16px;
        background: rgba(255, 255, 255, 0.03);
        border-radius: 8px;
        border-left: 4px solid;
        cursor: pointer;
        transition: all 0.15s ease;
      }

      .conflict-item:hover {
        background: rgba(255, 255, 255, 0.08);
      }

      .conflict-item--critical {
        border-color: #f5576c;
      }

      .conflict-item--warning {
        border-color: #ffd700;
      }

      .conflict-item--info {
        border-color: #64b5f6;
      }

      .conflict-item-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
      }

      .conflict-item-id {
        font-family: 'Courier New', monospace;
        font-weight: 600;
        color: var(--theme-accent, #00ff88);
      }

      .conflict-item-status {
        margin-left: auto;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
      }

      .conflict-item-status--open {
        background: rgba(255, 215, 0, 0.2);
        color: #ffd700;
      }

      .conflict-item-status--resolved {
        background: rgba(0, 255, 136, 0.2);
        color: #00ff88;
      }

      .conflict-item-status--ignored {
        background: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.6);
      }

      .conflict-item-elements {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
        font-weight: 600;
        font-size: 14px;
      }

      .conflict-item-vs {
        color: #f5576c;
        font-size: 16px;
      }

      .conflict-item-desc {
        font-size: 13px;
        color: rgba(255, 255, 255, 0.8);
        margin-bottom: 6px;
      }

      .conflict-item-location {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
      }

      .conflict-actions {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        padding-top: 16px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }
    `;
    document.head.appendChild(style);
  }

  public destroy(): void {
    this.modal.destroy();
  }
}

export function openConflictDetectionModal(): ConflictDetectionModal {
  const modal = new ConflictDetectionModal();
  modal.open();
  return modal;
}
