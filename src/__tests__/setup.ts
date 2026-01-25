/**
 * Vitest Setup File
 * Configuração global para todos os testes
 */

// Mock do canvas para testes
HTMLCanvasElement.prototype.getContext = () => null;

// Mock básico do Three.js para testes
global.THREE = {} as any;

// Setup adicional se necessário
beforeEach(() => {
  // Limpar mocks antes de cada teste
});

afterEach(() => {
  // Cleanup após cada teste
});
