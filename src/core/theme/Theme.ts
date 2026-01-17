/**
 * Theme Interface - ArxisVR Theme System
 * Define a estrutura completa de um tema
 */
export interface Theme {
  id: string;
  name: string;
  description?: string;
  
  colors: ThemeColors;
  fonts?: ThemeFonts;
  metadata?: ThemeMetadata;
}

export interface ThemeColors {
  // Background colors
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  
  // Foreground colors
  foreground: string;
  foregroundSecondary: string;
  foregroundMuted: string;
  
  // Brand colors
  primary: string;
  secondary: string;
  accent: string;
  
  // Status colors
  error: string;
  warning: string;
  info: string;
  success: string;
  
  // UI Element colors
  border: string;
  borderHover: string;
  shadow: string;
  
  // Interactive colors
  hover: string;
  active: string;
  focus: string;
  disabled: string;
  
  // Custom colors (extensible)
  [key: string]: string;
}

export interface ThemeFonts {
  base: string;
  heading: string;
  monospace: string;
  sizes?: {
    small: string;
    medium: string;
    large: string;
    xlarge: string;
  };
}

export interface ThemeMetadata {
  createdAt: string;
  updatedAt?: string;
  author?: string;
  version?: string;
  tags?: string[];
}

export type ThemeId = string;

/**
 * Valida se um objeto é um tema válido
 */
export function validateThemeSchema(theme: any): theme is Theme {
  const requiredColors = [
    'background', 'backgroundSecondary', 'foreground', 'primary'
  ];
  
  if (!theme.id || typeof theme.id !== 'string') return false;
  if (!theme.name || typeof theme.name !== 'string') return false;
  if (!theme.colors || typeof theme.colors !== 'object') return false;
  
  // Verifica cores obrigatórias
  const hasRequiredColors = requiredColors.every(color => 
    theme.colors[color] && isValidHex(theme.colors[color])
  );
  
  return hasRequiredColors;
}

/**
 * Valida formato hexadecimal de cor
 */
export function isValidHex(color: string): boolean {
  return /^#[0-9A-F]{6}$/i.test(color);
}

/**
 * Cria um tema com valores padrão
 */
export function createDefaultTheme(overrides?: Partial<Theme>): Theme {
  const defaultTheme: Theme = {
    id: 'default',
    name: 'Default Theme',
    description: 'Default ArxisVR theme with dark colors',
    colors: {
      background: '#1a1a1a',
      backgroundSecondary: '#2a2a2a',
      backgroundTertiary: '#3a3a3a',
      foreground: '#ffffff',
      foregroundSecondary: '#cccccc',
      foregroundMuted: '#999999',
      primary: '#667eea',
      secondary: '#764ba2',
      accent: '#f093fb',
      error: '#e53e3e',
      warning: '#dd6b20',
      info: '#3182ce',
      success: '#38a169',
      border: '#4a5568',
      borderHover: '#718096',
      shadow: 'rgba(0, 0, 0, 0.3)',
      hover: '#2d3748',
      active: '#4a5568',
      focus: '#4299e1',
      disabled: '#a0aec0'
    },
    metadata: {
      createdAt: new Date().toISOString(),
      version: '1.0.0',
      tags: ['default', 'dark']
    }
  };
  
  // Merge com overrides se fornecido
  if (overrides) {
    return {
      ...defaultTheme,
      ...overrides,
      colors: { ...defaultTheme.colors, ...overrides.colors },
      metadata: { ...defaultTheme.metadata, ...overrides.metadata }
    };
  }
  
  return defaultTheme;
}
