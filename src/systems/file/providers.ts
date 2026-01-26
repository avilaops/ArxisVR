/**
 * FileProvider - Abstração de fonte de arquivos
 * Implementações: LocalProvider, ExamplesProvider, S3Provider, etc.
 */

import {
  FileHandle,
  FileProviderType,
  FileListOptions,
  FileListResult,
  FileReadOptions,
  FileWriteOptions
} from './types';

/**
 * File Provider base (interface)
 */
export interface IFileProvider {
  readonly type: FileProviderType;
  readonly name: string;
  readonly capabilities: {
    list: boolean;
    read: boolean;
    write: boolean;
    delete: boolean;
    watch: boolean;
  };

  /**
   * Lista arquivos
   */
  list(options?: FileListOptions): Promise<FileListResult>;

  /**
   * Obtém metadados de arquivo
   */
  getMetadata(id: string): Promise<FileHandle>;

  /**
   * Abre stream de leitura
   */
  openReadStream(handle: FileHandle, options?: FileReadOptions): Promise<ReadableStream<Uint8Array>>;

  /**
   * Lê arquivo completo (conveniência)
   */
  readFile(handle: FileHandle, options?: FileReadOptions): Promise<Blob>;

  /**
   * Obtém URL assinada (quando necessário)
   */
  getSignedUrl?(handle: FileHandle, expiresIn?: number): Promise<string>;

  /**
   * Escreve arquivo
   */
  writeFile?(handle: FileHandle, data: Blob | File, options?: FileWriteOptions): Promise<FileHandle>;

  /**
   * Deleta arquivo
   */
  deleteFile?(handle: FileHandle): Promise<void>;

  /**
   * Watch for changes (live updates)
   */
  watch?(path: string[], callback: (event: FileWatchEvent) => void): () => void;
}

/**
 * File watch event
 */
export interface FileWatchEvent {
  type: 'created' | 'modified' | 'deleted';
  handle: FileHandle;
}

/**
 * Examples Provider (public assets)
 */
export class ExamplesProvider implements IFileProvider {
  public readonly type = FileProviderType.EXAMPLES;
  public readonly name = 'Examples';
  public readonly capabilities = {
    list: true,
    read: true,
    write: false,
    delete: false,
    watch: false
  };

  private baseUrl: string;
  private cache = new Map<string, FileHandle>();

  constructor(baseUrl: string = '/Examples-files') {
    this.baseUrl = baseUrl;
  }

  async list(options?: FileListOptions): Promise<FileListResult> {
    // TODO: Implementar listagem real (API ou manifest.json)
    // Por enquanto retorna mock
    const mockFiles: FileHandle[] = [
      this.createHandle('EDUARDO SAMPA.ifc', 45678000, new Date('2025-01-20')),
      this.createHandle('JEFERSON CARVALHO.ifc', 23456000, new Date('2025-01-15')),
      this.createHandle('VZZ086_25 Magnussão - Res. Heitor - Estrutural Executivo - Rev08 (1).ifc', 67890000, new Date('2025-01-18')),
      this.createHandle('ELE - VZZ086_25 - Magnussão - Res. Heitor - REV01-4.ifc', 34567000, new Date('2025-01-12')),
      this.createHandle('HID - VZZ086_25 - Magnussão - Res. Heitor - REV01-3.ifc', 28900000, new Date('2025-01-10')),
      this.createHandle('FUNDAÇÃO.DWG', 12340000, new Date('2025-01-10'))
    ];

    // Apply filters
    let filtered = mockFiles;
    if (options?.query) {
      const q = options.query.toLowerCase();
      filtered = filtered.filter(f => f.displayName.toLowerCase().includes(q));
    }

    return {
      items: filtered,
      hasMore: false,
      total: filtered.length
    };
  }

  async getMetadata(id: string): Promise<FileHandle> {
    if (this.cache.has(id)) {
      return this.cache.get(id)!;
    }
    throw new Error(`File not found: ${id}`);
  }

  async openReadStream(handle: FileHandle, options?: FileReadOptions): Promise<ReadableStream<Uint8Array>> {
    const url = this.resolveUrl(handle);
    const response = await fetch(url, {
      signal: options?.signal,
      headers: options?.range ? {
        'Range': `bytes=${options.range.start}-${options.range.end}`
      } : undefined
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.body!;
  }

  async readFile(handle: FileHandle, options?: FileReadOptions): Promise<Blob> {
    const url = this.resolveUrl(handle);
    const response = await fetch(url, {
      signal: options?.signal
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.blob();
  }

  /**
   * Resolve URL com encoding correto
   */
  private resolveUrl(handle: FileHandle): string {
    const base = import.meta.env.BASE_URL || '/';
    const parts = handle.displayName.split('/');
    const encoded = parts.map(encodeURIComponent).join('/');
    return `${base}${this.baseUrl.replace(/^\//, '')}/${encoded}`;
  }

  /**
   * Cria FileHandle a partir de nome
   */
  private createHandle(name: string, size: number, modified: Date): FileHandle {
    const ext = name.split('.').pop()?.toLowerCase() || '';
    const id = `examples://${name}`;
    
    const handle: FileHandle = {
      id,
      provider: FileProviderType.EXAMPLES,
      uri: id,
      displayName: name,
      path: ['Examples'],
      mime: this.getMimeType(ext),
      extension: `.${ext}`,
      size,
      hash: '', // TODO: Obter hash real
      createdAt: modified,
      modifiedAt: modified,
      capabilities: {
        read: true,
        write: false,
        delete: false,
        versioning: false,
        locking: false,
        sharing: false,
        commenting: false,
        streaming: true
      },
      metadata: {}
    };

    this.cache.set(id, handle);
    return handle;
  }

  private getMimeType(ext: string): string {
    const mimes: Record<string, string> = {
      'ifc': 'application/x-step',
      'dwg': 'application/acad',
      'rvt': 'application/x-revit',
      'nwd': 'application/x-navisworks'
    };
    return mimes[ext] || 'application/octet-stream';
  }
}

/**
 * Local Provider (drag&drop, file input)
 */
export class LocalProvider implements IFileProvider {
  public readonly type = FileProviderType.LOCAL;
  public readonly name = 'Local Files';
  public readonly capabilities = {
    list: false,  // Não pode listar sistema de arquivos do usuário
    read: true,
    write: false,
    delete: false,
    watch: false
  };

  private handles = new Map<string, { handle: FileHandle; file: File }>();

  async list(): Promise<FileListResult> {
    throw new Error('Local provider does not support listing');
  }

  async getMetadata(id: string): Promise<FileHandle> {
    const entry = this.handles.get(id);
    if (!entry) throw new Error(`File not found: ${id}`);
    return entry.handle;
  }

  async openReadStream(handle: FileHandle): Promise<ReadableStream<Uint8Array>> {
    const entry = this.handles.get(handle.id);
    if (!entry) throw new Error('File not found');
    
    return entry.file.stream() as ReadableStream<Uint8Array>;
  }

  async readFile(handle: FileHandle): Promise<Blob> {
    const entry = this.handles.get(handle.id);
    if (!entry) throw new Error('File not found');
    return entry.file;
  }

  /**
   * Registra arquivo local (chamado pelo drag&drop/file input)
   */
  public async registerFile(file: File): Promise<FileHandle> {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const id = `local://${file.name}-${Date.now()}`;
    
    // Calcula hash (simplificado, idealmente usar Web Crypto API)
    const hash = await this.calculateHash(file);
    
    const handle: FileHandle = {
      id,
      provider: FileProviderType.LOCAL,
      uri: id,
      displayName: file.name,
      path: ['Local'],
      mime: file.type || 'application/octet-stream',
      extension: `.${ext}`,
      size: file.size,
      hash,
      createdAt: new Date(file.lastModified),
      modifiedAt: new Date(file.lastModified),
      capabilities: {
        read: true,
        write: false,
        delete: false,
        versioning: false,
        locking: false,
        sharing: false,
        commenting: false,
        streaming: true
      },
      metadata: {}
    };

    this.handles.set(id, { handle, file });
    return handle;
  }

  private async calculateHash(file: File): Promise<string> {
    // Simplificado: usa tamanho + modified time
    // TODO: Usar Web Crypto API para SHA-256 real
    return `${file.size}-${file.lastModified}`;
  }
}
