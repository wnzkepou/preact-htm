import { defineConfig, globalIgnores } from 'eslint/config'
import preact from 'eslint-config-preact'
import { configs as htmConfigs } from "eslint-plugin-htm"
import globals from 'globals'
import js from '@eslint/js'

export default defineConfig([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx}'],
  },
  js.configs.recommended,
  ...preact,
  ...htmConfigs.flatRecommended,
  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
    }
  }
])
