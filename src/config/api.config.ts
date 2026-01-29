export interface ApiConfig {
  /** Base URL do backend Arxis.Core */
  baseUrl: string;
  /** Timeout em milissegundos para requisições */
  timeout: number;
}

export const apiConfig: ApiConfig = {
  baseUrl: import.meta.env.VITE_ARXIS_CORE_URL || 'http://localhost:5000',
  timeout: 15_000
};

export function getApiBaseUrl(): string {
  return apiConfig.baseUrl.replace(/\/$/, '');
}
