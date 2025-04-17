import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import commonjs from "@rollup/plugin-commonjs";

export default defineConfig({
  plugins: [
    react(),
    // Explicitly process the @material-tailwind/react package as CommonJS
    commonjs({
      include: [/node_modules[\\/]@material-tailwind[\\/]react/],
    }),
  ],
  // Ensure Vite pre-bundles the package (instead of excluding it)
  optimizeDeps: {
    include: ["@material-tailwind/react"],
  },
  build: {
    commonjsOptions: {
      // Only transform files from the material-tailwind package
      include: [/node_modules[\\/]@material-tailwind[\\/]react/],
      // Allow transformation of modules mixing ESM and CommonJS
      transformMixedEsModules: true,
    },
    css: {
      postcss: "./postcss.config.cjs",
    },
  },
  // Add server configuration to handle MIME types properly
  
});
