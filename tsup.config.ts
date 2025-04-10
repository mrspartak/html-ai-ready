import { defineConfig } from "tsup";

export default defineConfig([
  // Normal build
  {
    entry: ["./src/index.ts"],
    clean: true,
    format: ["esm", "cjs"],
    minify: false,
    dts: true,
    outDir: "./dist",
    esbuildOptions: (options) => {
      options.external = [...(options.external || []), "./native/*"];
    },
    noExternal: [],
  },
  // Minified build
  {
    entry: ["./src/index.ts"],
    clean: true,
    format: ["esm", "cjs"],
    minify: true,
    dts: false,
    outDir: "./dist",
    outExtension: ({ format }) => ({
      js: format === "cjs" ? ".min.cjs" : ".min.js",
    }),
    esbuildOptions: (options) => {
      options.external = [...(options.external || []), "./native/*"];
    },
    noExternal: [],
  },
]);
