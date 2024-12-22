import pluginNext from '@next/eslint-plugin-next'
import parser from '@typescript-eslint/parser' // optional
import eslintTypescript from '@typescript-eslint/eslint-plugin'

export default [
  {
    name: 'ESLint Config - nextjs',
    languageOptions: {
      parser, // optional
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        },
        tsConfigRootDir: import.meta.dirname
      }
    },
    plugins: {
      '@next/next': pluginNext,
      '@typescript-eslint': eslintTypescript
    },
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs['core-web-vitals'].rules,

      // TypeScript rules
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Allow unused vars starting with _
      '@typescript-eslint/no-explicit-any': 'warn', // Discourage `any` usage

      'prefer-const': 'warn',

      eqeqeq: ['warn', 'always'], // Use === and !==
      'no-console': 'warn' // Discourage console.log in production
    }
  }
]