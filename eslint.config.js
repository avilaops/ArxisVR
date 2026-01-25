import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: './tsconfig.json'
      }
    },
    plugins: {
      '@typescript-eslint': typescriptEslint
    },
    rules: {
      ...typescriptEslint.configs.recommended.rules,
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['three', 'three/*'],
              message: '⚠️ PROIBIDO: Three.js só pode ser importado em src/engine/adapters/ThreeAdapter.ts. Use as interfaces AVX de src/engine/api/ ao invés.'
            }
          ]
        }
      ]
    }
  },
  {
    files: ['src/engine/adapters/ThreeAdapter.ts'],
    rules: {
      'no-restricted-imports': 'off'
    }
  },
  {
    files: ['src/loaders/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'warn',
        {
          patterns: [
            {
              group: ['three', 'three/*'],
              message: '⚠️ AVISO: Loaders devem migrar para abstrações AVX. Use src/engine/api/ quando possível.'
            }
          ]
        }
      ]
    }
  }
];
