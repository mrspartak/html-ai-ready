import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude, "local/*"],
    coverage: {
      exclude: ["local/*", "bin/*", "src/types/*", "src/index.ts", "docs/*", "examples/*", "assets/*"],
    },
  },
});
