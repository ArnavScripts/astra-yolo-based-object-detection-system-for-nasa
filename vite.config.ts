import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
    alias: {
      // Keep only clean aliases. Remove versioned aliases that can break module resolution.
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "esnext",
    outDir: "build",
    // Reduce noisy large-chunk warnings and help Rollup split vendor code
    chunkSizeWarningLimit: 1000, // increase limit (in KB) if you prefer fewer warnings
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom"))
              return "react-vendor";
            if (id.includes("framer-motion")) return "motion-vendor";
            if (id.includes("sonner") || id.includes("lucide-react"))
              return "ui-vendor";
            return "vendor";
          }
        },
      },
    },
  },
  server: {
    port: 3001,
    open: true,
  },
});
