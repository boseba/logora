import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/module.ts"],
  outDir: "dist", 
  format: ["cjs", "esm"],
  dts: false,
  clean: true,
  minify: false,
  sourcemap: false, 
  splitting: false,
  treeshake: true,
  target: "es2019", 
  skipNodeModulesBundle: true
});
