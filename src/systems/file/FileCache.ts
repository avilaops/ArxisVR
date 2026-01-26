/**
 * FileCache - Cache de arquivos com IndexedDB
 * Permite trabalhar offline e reduz downloads repetidos
 */

/**
 * Simple file cache usando IndexedDB
 */
export class FileCache {
  private dbName = 'arxis-file-cache';
  private storeName = 'files';
  private db: IDBDatabase | null = null;
  private initPromise: Promise<void>;

  constructor() {
    this.initPromise = this.init();
  }

  /**
   * Inicializa IndexedDB
   */
  private async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'hash' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('size', 'size', { unique: false });
        }
      };
    });
  }

  /**
   * Obtém arquivo do cache
   */
  public async get(hash: string): Promise<Blob | null> {
    await this.initPromise;
    if (!this.db) return null;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(hash);

      request.onsuccess = () => {
        const record = request.result;
        if (record) {
          // Atualiza timestamp de acesso
          this.updateAccessTime(hash);
          resolve(record.blob);
        } else {
          resolve(null);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Armazena arquivo no cache
   */
  public async set(hash: string, blob: Blob): Promise<void> {
    await this.initPromise;
    if (!this.db) return;

    // Limita tamanho individual (max 100MB por arquivo)
    if (blob.size > 100 * 1024 * 1024) {
      console.warn('File too large for cache:', blob.size);
      return;
    }

    // Verifica espaço disponível
    const estimate = await navigator.storage?.estimate();
    if (estimate) {
      const usage = estimate.usage || 0;
      const quota = estimate.quota || 0;
      const available = quota - usage;
      
      if (blob.size > available) {
        console.warn('Not enough storage space, evicting old entries...');
        await this.evictOldest(blob.size);
      }
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      const record = {
        hash,
        blob,
        size: blob.size,
        timestamp: Date.now()
      };

      const request = store.put(record);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Atualiza timestamp de acesso (LRU)
   */
  private async updateAccessTime(hash: string): Promise<void> {
    if (!this.db) return;

    const transaction = this.db.transaction([this.storeName], 'readwrite');
    const store = transaction.objectStore(this.storeName);
    
    const getRequest = store.get(hash);
    
    getRequest.onsuccess = () => {
      const record = getRequest.result;
      if (record) {
        record.timestamp = Date.now();
        store.put(record);
      }
    };
  }

  /**
   * Remove entradas antigas (LRU eviction)
   */
  private async evictOldest(requiredSpace: number): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const index = store.index('timestamp');
      
      const request = index.openCursor();
      let freedSpace = 0;

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result as IDBCursorWithValue;
        
        if (cursor && freedSpace < requiredSpace) {
          freedSpace += cursor.value.size;
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Remove arquivo do cache
   */
  public async delete(hash: string): Promise<void> {
    await this.initPromise;
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(hash);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Limpa todo o cache
   */
  public async clear(): Promise<void> {
    await this.initPromise;
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Obtém tamanho total do cache
   */
  public async getSize(): Promise<number> {
    await this.initPromise;
    if (!this.db) return 0;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        const records = request.result;
        const totalSize = records.reduce((sum, record) => sum + (record.size || 0), 0);
        resolve(totalSize);
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Obtém estatísticas do cache
   */
  public async getStats(): Promise<{
    count: number;
    totalSize: number;
    oldestTimestamp: number;
    newestTimestamp: number;
  }> {
    await this.initPromise;
    if (!this.db) {
      return { count: 0, totalSize: 0, oldestTimestamp: 0, newestTimestamp: 0 };
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        const records = request.result;
        
        if (records.length === 0) {
          resolve({ count: 0, totalSize: 0, oldestTimestamp: 0, newestTimestamp: 0 });
          return;
        }

        const totalSize = records.reduce((sum, r) => sum + (r.size || 0), 0);
        const timestamps = records.map(r => r.timestamp).sort((a, b) => a - b);

        resolve({
          count: records.length,
          totalSize,
          oldestTimestamp: timestamps[0],
          newestTimestamp: timestamps[timestamps.length - 1]
        });
      };

      request.onerror = () => reject(request.error);
    });
  }
}
