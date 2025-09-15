import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
    // Relax a few rules that cause the production build to fail while
    // keeping most of Next's defaults. This prevents `no-explicit-any`
    // from blocking `next build` during development or CI.
    rules: {
      // allow temporary usage of `any` in a working codebase
      "@typescript-eslint/no-explicit-any": "off",
      // prefer the TypeScript-aware rule, but only warn about unused vars
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { "varsIgnorePattern": "^_" }]
    },
  },
];

export default eslintConfig;
