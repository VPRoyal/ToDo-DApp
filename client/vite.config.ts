import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build:{
    rollupOptions:{
      output:{
        manualChunks:{
          dashboard: ['@/components/layout/mainDashboard'],
          wallet: ['@/context/walletProvider'],
          contract: ['@/hooks/useContract'],
          taskOperations: ['@/hooks/useTaskOperations'],
          taskModal: ['@/components/tasks/addTaskModal']

        }
      }
    }
  }
})
