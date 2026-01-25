/**
 * LoadFileModal + FileBrowser Component
 * Modal para carregar arquivos IFC/DWG/outros formatos
 */

import { Modal } from '../design-system/components/Modal';
import { Button } from '../design-system/components/Button';
import { Input } from '../design-system/components/Input';
import { ProgressBar, showLoading, hideLoading } from '../components/ProgressBar';

export interface FileItem {
  id: string;
  name: string;
  path: string;
  size: number;
  type: 'ifc' | 'dwg' | 'rvt' | 'nwd' | 'folder';
  modified: Date;
  thumbnail?: string;
}

export interface FileUploadResult {
  file: File;
  url?: string;
  success: boolean;
  error?: string;
}

export class LoadFileModal {
  private modal: Modal;
  private currentPath: string[] = ['Meus Projetos'];
  private files: FileItem[] = [];
  private selectedFiles: Set<string> = new Set();
  private uploadProgress: ProgressBar | null = null;
  private onFilesLoaded?: (files: File[]) => void;

  constructor(onFilesLoaded?: (files: File[]) => void) {
    this.onFilesLoaded = onFilesLoaded;
    
    this.modal = new Modal({
      title: 'Carregar Arquivo',
      size: 'lg',
      closeOnEscape: true,
      onClose: () => this.cleanup()
    });

    this.loadMockFiles();
    this.buildUI();
    this.applyStyles();
  }

  /**
   * Carrega arquivos mock (substituir com dados reais)
   */
  private loadMockFiles(): void {
    this.files = [
      {
        id: '1',
        name: 'EDUARDO SAMPA.ifc',
        path: '/Meus Projetos/EDUARDO SAMPA.ifc',
        size: 45678000,
        type: 'ifc',
        modified: new Date('2025-01-20')
      },
      {
        id: '2',
        name: 'Res. Heitor.ifc',
        path: '/Meus Projetos/Res. Heitor.ifc',
        size: 23456000,
        type: 'ifc',
        modified: new Date('2025-01-15')
      },
      {
        id: '3',
        name: 'FUNDAÇÃO.DWG',
        path: '/Meus Projetos/FUNDAÇÃO.DWG',
        size: 12340000,
        type: 'dwg',
        modified: new Date('2025-01-10')
      },
      {
        id: '4',
        name: 'Magnussão',
        path: '/Meus Projetos/Magnussão',
        size: 0,
        type: 'folder',
        modified: new Date('2025-01-05')
      }
    ];
  }

  /**
   * Constrói a UI
   */
  private buildUI(): void {
    const container = document.createElement('div');
    container.className = 'load-file-modal';

    // Tabs
    const tabs = this.createTabs();
    container.appendChild(tabs);

    // Content areas
    const browserTab = this.createBrowserTab();
    const uploadTab = this.createUploadTab();
    const recentTab = this.createRecentTab();

    browserTab.classList.add('load-file-tab--active');

    container.appendChild(browserTab);
    container.appendChild(uploadTab);
    container.appendChild(recentTab);

    // Footer
    const footer = this.createFooter();
    container.appendChild(footer);

    this.modal.setContent(container);
  }

  /**
   * Cria tabs
   */
  private createTabs(): HTMLElement {
    const tabs = document.createElement('div');
    tabs.className = 'load-file-tabs';

    const tabItems = [
      { id: 'browser', label: '📁 Navegar', icon: '📁' },
      { id: 'upload', label: '📤 Upload', icon: '📤' },
      { id: 'recent', label: '🕒 Recentes', icon: '🕒' }
    ];

    tabItems.forEach((tab, index) => {
      const tabBtn = new Button({
        text: tab.label,
        variant: index === 0 ? 'primary' : 'ghost',
        size: 'sm',
        onClick: () => this.switchTab(tab.id)
      });

      const tabEl = tabBtn.getElement();
      tabEl.setAttribute('data-tab', tab.id);
      tabs.appendChild(tabEl);
    });

    return tabs;
  }

  /**
   * Switch tab
   */
  private switchTab(tabId: string): void {
    // Update tab buttons
    const tabBtns = this.modal.getElement().querySelectorAll('[data-tab]');
    tabBtns.forEach(btn => {
      const btnTabId = btn.getAttribute('data-tab');
      if (btnTabId === tabId) {
        btn.classList.add('arxis-btn--primary');
        btn.classList.remove('arxis-btn--ghost');
      } else {
        btn.classList.add('arxis-btn--ghost');
        btn.classList.remove('arxis-btn--primary');
      }
    });

    // Update content
    const tabs = this.modal.getElement().querySelectorAll('.load-file-tab');
    tabs.forEach(tab => {
      const contentTabId = tab.getAttribute('data-tab-content');
      tab.classList.toggle('load-file-tab--active', contentTabId === tabId);
    });
  }

  /**
   * Cria tab de navegação
   */
  private createBrowserTab(): HTMLElement {
    const tab = document.createElement('div');
    tab.className = 'load-file-tab';
    tab.setAttribute('data-tab-content', 'browser');

    // Breadcrumb
    const breadcrumb = document.createElement('div');
    breadcrumb.className = 'load-file-breadcrumb';
    this.updateBreadcrumb(breadcrumb);
    tab.appendChild(breadcrumb);

    // Search
    const search = new Input({
      placeholder: 'Buscar arquivos...',
      icon: '🔍',
      fullWidth: true,
      onChange: (value) => this.searchFiles(value)
    });
    tab.appendChild(search.getElement());

    // File list
    const fileList = document.createElement('div');
    fileList.className = 'load-file-list';
    this.renderFileList(fileList);
    tab.appendChild(fileList);

    return tab;
  }

  /**
   * Atualiza breadcrumb
   */
  private updateBreadcrumb(container: HTMLElement): void {
    container.innerHTML = '';
    
    this.currentPath.forEach((folder, index) => {
      if (index > 0) {
        const separator = document.createElement('span');
        separator.className = 'load-file-breadcrumb-separator';
        separator.textContent = '/';
        container.appendChild(separator);
      }

      const crumb = document.createElement('span');
      crumb.className = 'load-file-breadcrumb-item';
      crumb.textContent = folder;
      
      if (index < this.currentPath.length - 1) {
        crumb.style.cursor = 'pointer';
        crumb.addEventListener('click', () => {
          this.currentPath = this.currentPath.slice(0, index + 1);
          this.updateBreadcrumb(container);
        });
      }

      container.appendChild(crumb);
    });
  }

  /**
   * Renderiza lista de arquivos
   */
  private renderFileList(container: HTMLElement): void {
    container.innerHTML = '';

    if (this.files.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'load-file-empty';
      empty.textContent = 'Nenhum arquivo encontrado';
      container.appendChild(empty);
      return;
    }

    this.files.forEach(file => {
      const item = this.createFileItem(file);
      container.appendChild(item);
    });
  }

  /**
   * Cria item de arquivo
   */
  private createFileItem(file: FileItem): HTMLElement {
    const item = document.createElement('div');
    item.className = 'load-file-item';
    
    if (this.selectedFiles.has(file.id)) {
      item.classList.add('load-file-item--selected');
    }

    // Icon
    const icon = document.createElement('div');
    icon.className = 'load-file-icon';
    icon.textContent = this.getFileIcon(file.type);
    item.appendChild(icon);

    // Info
    const info = document.createElement('div');
    info.className = 'load-file-info';

    const name = document.createElement('div');
    name.className = 'load-file-name';
    name.textContent = file.name;
    info.appendChild(name);

    const meta = document.createElement('div');
    meta.className = 'load-file-meta';
    meta.textContent = `${this.formatFileSize(file.size)} • ${this.formatDate(file.modified)}`;
    info.appendChild(meta);

    item.appendChild(info);

    // Click handler
    item.addEventListener('click', () => {
      if (file.type === 'folder') {
        this.navigateToFolder(file);
      } else {
        this.toggleFileSelection(file.id);
        item.classList.toggle('load-file-item--selected');
      }
    });

    // Double-click to load
    if (file.type !== 'folder') {
      item.addEventListener('dblclick', () => {
        this.loadSelectedFiles();
      });
    }

    return item;
  }

  /**
   * Retorna ícone do arquivo
   */
  private getFileIcon(type: string): string {
    const icons: Record<string, string> = {
      'ifc': '🏢',
      'dwg': '📐',
      'rvt': '🏗️',
      'nwd': '📊',
      'folder': '📁'
    };
    return icons[type] || '📄';
  }

  /**
   * Formata tamanho do arquivo
   */
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  }

  /**
   * Formata data
   */
  private formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Hoje';
    if (days === 1) return 'Ontem';
    if (days < 7) return `${days} dias atrás`;
    
    return date.toLocaleDateString('pt-BR');
  }

  /**
   * Navega para pasta
   */
  private navigateToFolder(folder: FileItem): void {
    this.currentPath.push(folder.name);
    // Recarregar arquivos da nova pasta
    this.loadMockFiles();
    
    const breadcrumb = this.modal.getElement().querySelector('.load-file-breadcrumb') as HTMLElement;
    if (breadcrumb) {
      this.updateBreadcrumb(breadcrumb);
    }
    
    const fileList = this.modal.getElement().querySelector('.load-file-list') as HTMLElement;
    if (fileList) {
      this.renderFileList(fileList);
    }
  }

  /**
   * Toggle seleção de arquivo
   */
  private toggleFileSelection(fileId: string): void {
    if (this.selectedFiles.has(fileId)) {
      this.selectedFiles.delete(fileId);
    } else {
      this.selectedFiles.add(fileId);
    }
  }

  /**
   * Busca arquivos
   */
  private searchFiles(query: string): void {
    // Implementar busca
    console.log('Buscando:', query);
  }

  /**
   * Cria tab de upload
   */
  private createUploadTab(): HTMLElement {
    const tab = document.createElement('div');
    tab.className = 'load-file-tab';
    tab.setAttribute('data-tab-content', 'upload');

    // Drop zone
    const dropZone = document.createElement('div');
    dropZone.className = 'load-file-dropzone';
    dropZone.innerHTML = `
      <div class="load-file-dropzone-icon">📤</div>
      <div class="load-file-dropzone-text">Arraste arquivos aqui</div>
      <div class="load-file-dropzone-hint">ou clique para selecionar</div>
      <div class="load-file-dropzone-formats">IFC, DWG, RVT, NWD</div>
    `;

    // File input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.accept = '.ifc,.dwg,.rvt,.nwd';
    fileInput.style.display = 'none';

    fileInput.addEventListener('change', (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        this.handleFileUpload(Array.from(files));
      }
    });

    dropZone.addEventListener('click', () => fileInput.click());

    // Drag & drop
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('load-file-dropzone--active');
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('load-file-dropzone--active');
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('load-file-dropzone--active');
      
      const files = Array.from(e.dataTransfer?.files || []);
      this.handleFileUpload(files);
    });

    tab.appendChild(dropZone);
    tab.appendChild(fileInput);

    return tab;
  }

  /**
   * Manipula upload de arquivo
   */
  private async handleFileUpload(files: File[]): Promise<void> {
    if (files.length === 0) return;

    showLoading('Carregando arquivo...');

    try {
      // Use global loadIFCFile function if available
      const loadIFCFile = (window as any).loadIFCFile;
      
      for (const file of files) {
        if (loadIFCFile && typeof loadIFCFile === 'function') {
          await loadIFCFile(file);
        } else if (this.onFilesLoaded) {
          await this.onFilesLoaded([file] as any);
        } else {
          console.warn('⚠️ No IFC loader available');
        }
      }

      hideLoading();
      this.modal.close();
      
      console.log(`✅ ${files.length} arquivo(s) carregado(s)`);
    } catch (error) {
      hideLoading();
      console.error('❌ Erro ao carregar arquivos:', error);
      alert(`Erro ao carregar arquivos: ${error}`);
    }
  }

  /**
   * Simula upload (substituir com implementação real)
   */
  private simulateUpload(file: File): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, 1500);
    });
  }

  /**
   * Cria tab de recentes
   */
  private createRecentTab(): HTMLElement {
    const tab = document.createElement('div');
    tab.className = 'load-file-tab';
    tab.setAttribute('data-tab-content', 'recent');

    const recentFiles = document.createElement('div');
    recentFiles.className = 'load-file-list';
    
    // Mock recent files
    const recent = this.files.slice(0, 3);
    recent.forEach(file => {
      const item = this.createFileItem(file);
      recentFiles.appendChild(item);
    });

    tab.appendChild(recentFiles);

    return tab;
  }

  /**
   * Cria footer
   */
  private createFooter(): HTMLElement {
    const footer = document.createElement('div');
    footer.className = 'load-file-footer';

    const cancelBtn = new Button({
      text: 'Cancelar',
      variant: 'ghost',
      onClick: () => this.modal.close()
    });

    const loadBtn = new Button({
      text: 'Carregar',
      variant: 'primary',
      onClick: () => this.loadSelectedFiles()
    });

    footer.appendChild(cancelBtn.getElement());
    footer.appendChild(loadBtn.getElement());

    return footer;
  }

  /**
   * Carrega arquivos selecionados
   */
  private async loadSelectedFiles(): Promise<void> {
    const selectedFileItems = this.files.filter(f => this.selectedFiles.has(f.id));
    
    if (selectedFileItems.length === 0) {
      alert('Selecione pelo menos um arquivo');
      return;
    }

    showLoading('Carregando arquivos...');
    
    try {
      // For mock files, we need to fetch from Examples-files folder
      const loadIFCFile = (window as any).loadIFCFile;
      
      for (const fileItem of selectedFileItems) {
        if (fileItem.type === 'folder') continue;
        
        // Try to fetch from Examples-files
        const response = await fetch(`/Examples-files/${fileItem.name}`);
        if (response.ok) {
          const blob = await response.blob();
          const file = new File([blob], fileItem.name, { type: 'application/ifc' });
          
          if (loadIFCFile && typeof loadIFCFile === 'function') {
            await loadIFCFile(file);
          } else if (this.onFilesLoaded) {
            await this.onFilesLoaded([file] as any);
          }
        } else {
          console.warn(`⚠️ Arquivo não encontrado: ${fileItem.name}`);
        }
      }
      
      hideLoading();
      this.modal.close();
      console.log(`✅ ${selectedFileItems.length} arquivo(s) carregado(s)`);
    } catch (error) {
      hideLoading();
      console.error('❌ Erro ao carregar arquivos:', error);
      alert(`Erro ao carregar arquivos: ${error}`);
    }
  }

  /**
   * Cleanup
   */
  private cleanup(): void {
    this.selectedFiles.clear();
    this.currentPath = ['Meus Projetos'];
  }

  /**
   * Abre o modal
   */
  public open(): void {
    this.modal.open();
  }

  /**
   * Retorna o elemento (compatibilidade)
   */
  public get element(): HTMLElement {
    return this.modal.getElement();
  }

  /**
   * Aplica estilos CSS
   */
  private applyStyles(): void {
    if (document.getElementById('load-file-modal-styles')) return;

    const style = document.createElement('style');
    style.id = 'load-file-modal-styles';
    style.textContent = `
      .load-file-modal {
        display: flex;
        flex-direction: column;
        gap: 16px;
        min-height: 500px;
      }

      .load-file-tabs {
        display: flex;
        gap: 8px;
        padding-bottom: 12px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .load-file-tab {
        display: none;
        flex-direction: column;
        gap: 16px;
        flex: 1;
      }

      .load-file-tab--active {
        display: flex;
      }

      .load-file-breadcrumb {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.7);
      }

      .load-file-breadcrumb-item {
        transition: color 0.15s ease;
      }

      .load-file-breadcrumb-item:hover {
        color: var(--theme-accent, #00ff88);
      }

      .load-file-breadcrumb-separator {
        color: rgba(255, 255, 255, 0.3);
      }

      .load-file-list {
        display: flex;
        flex-direction: column;
        gap: 4px;
        max-height: 350px;
        overflow-y: auto;
        padding: 4px;
      }

      .load-file-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.15s ease;
        border: 2px solid transparent;
      }

      .load-file-item:hover {
        background: rgba(255, 255, 255, 0.05);
      }

      .load-file-item--selected {
        background: rgba(102, 126, 234, 0.2);
        border-color: var(--theme-accent, #00ff88);
      }

      .load-file-icon {
        font-size: 32px;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
      }

      .load-file-info {
        flex: 1;
        min-width: 0;
      }

      .load-file-name {
        font-size: 14px;
        font-weight: 500;
        color: var(--theme-foreground, #fff);
        margin-bottom: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .load-file-meta {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.5);
      }

      .load-file-empty {
        padding: 60px 20px;
        text-align: center;
        color: rgba(255, 255, 255, 0.5);
        font-size: 14px;
      }

      .load-file-dropzone {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 12px;
        padding: 60px 40px;
        border: 2px dashed rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        min-height: 300px;
      }

      .load-file-dropzone:hover,
      .load-file-dropzone--active {
        border-color: var(--theme-accent, #00ff88);
        background: rgba(0, 255, 136, 0.05);
      }

      .load-file-dropzone-icon {
        font-size: 64px;
        opacity: 0.8;
      }

      .load-file-dropzone-text {
        font-size: 18px;
        font-weight: 600;
        color: var(--theme-foreground, #fff);
      }

      .load-file-dropzone-hint {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.6);
      }

      .load-file-dropzone-formats {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.4);
        margin-top: 8px;
      }

      .load-file-footer {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        padding-top: 16px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Destrói o modal
   */
  public destroy(): void {
    this.modal.destroy();
  }
}

/**
 * Helper para abrir modal de carregamento
 */
export function openLoadFileModal(onFilesLoaded?: (files: File[]) => void): LoadFileModal {
  const modal = new LoadFileModal(onFilesLoaded);
  modal.open();
  return modal;
}
