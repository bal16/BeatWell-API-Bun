import js from @eslint/js;
import tseslint from typescript-eslint;
import eslintConfigPrettier from eslint-config-prettier;
import globals from globals;

export default tseslint.config(
  // 1. Ignore folder build/bun
  { ignores: [dist, node_modules, .bun] },

  // 2. Base Configs
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // 3. Custom Rules & Environment
  {
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.node, // Agar kenal process.env, dll
    },
    rules: {
      @typescript-eslint/no-unused-vars: [warn, { argsIgnorePattern: ^_ }],
      @typescript-eslint/no-explicit-any: warn,
    },
  },

  // 4. Prettier Config (WAJIB DITARUH TERAKHIR)
  // Ini akan menimpa rule ESLint yang tabrakan dengan Prettier
  eslintConfigPrettier
);
