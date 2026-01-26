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
 * FileProvider Error - Enterprise error handling
 */
export class FileProviderError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'FileProviderError';
  }
}

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

  async list(_options?: FileListOptions): Promise<FileListResult> {
    // ✅ POLÍTICA DE PRIVACIDADE: Não fornecemos arquivos de exemplo
    // Arquivos IFC/DWG/RVT contêm dados confidenciais de projetos e clientes.
    // O usuário deve fazer upload dos seus próprios arquivos.
    
    console.info(
      '📋 ExamplesProvider: Nenhum arquivo público disponível.\n' +
      'ℹ️  Por questões de privacidade e segurança, não fornecemos arquivos de exemplo.\n' +
      '📤 Use a aba "Upload" para carregar seus próprios arquivos IFC/DWG/RVT.'
    );
    
    return {
      items: [],
      hasMore: false,
      total: 0
    };
  }

  async getMetadata(id: string): Promise<FileHandle> {
    if (this.cache.has(id)) {
      return this.cache.get(id)!;
    }
    
    throw new FileProviderError(
      'Arquivo não encontrado. Use a aba Upload para carregar seus arquivos.',
      'FILE_NOT_FOUND',
      { id }
    );
  }

  async openReadStream(_handle: FileHandle, _options?: FileReadOptions): Promise<ReadableStream<Uint8Array>> {
    throw new FileProviderError(
      'ExamplesProvider não oferece arquivos para download. Use Upload local.',
      'NOT_SUPPORTED',
      { operation: 'openReadStream' }
    );
  }

  async readFile(handle: FileHandle, options?: FileReadOptions): Promise<Blob> {
    const url = this.resolveUrl(handle);
    
    try {
      const response = await fetch(url, {
        signal: options?.signal
      });

      if (!response.ok) {
        // ✅ Enterprise error handling
        const errorDetails = {
          status: response.status,
          statusText: response.statusText,
          url: url,
          fileName: handle.displayName,
          provider: this.type
        };
        
        console.error('❌ ExamplesProvider.readFile failed:', errorDetails);
        
        // Lança erro específico para UI tratar
        throw new FileProviderError(
          `Arquivo não encontrado: "${handle.displayName}". ` +
          `Verifique se o arquivo existe em ${this.baseUrl}/ ou use Upload.`,
          'FILE_NOT_FOUND',
          errorDetails
        );
      }

      return response.blob();
    } catch (error) {
      // Network errors, CORS, etc
      if (error instanceof FileProviderError) throw error;
      
      console.error('❌ ExamplesProvider.readFile network error:', error);
      
      throw new FileProviderError(
        `Erro de rede ao carregar "${handle.displayName}". ` +
        `Verifique sua conexão ou use Upload local.`,
        'NETWORK_ERROR',
        { originalError: error, fileName: handle.displayName }
      );
    }
  }

  /**
   * Resolve URL com encoding correto (legacy - não usado)
   */
  private resolveUrl(handle: FileHandle): string {
    const base = import.meta.env.BASE_URL || '/';
    const parts = handle.displayName.split('/');
    const encoded = parts.map(encodeURIComponent).join('/');
    return `${base}${this.baseUrl.replace(/^\//, '')}/${encoded}`;
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
