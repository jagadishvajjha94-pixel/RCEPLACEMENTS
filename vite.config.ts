import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-is', 'recharts'],
  },
  ssr: {
    // Ensure these packages are bundled during SSR builds (prevents Vercel/Turbopack "module not found" for react-is)
    noExternal: ['react-is', 'recharts'],
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
      },
    },
  },
}));
