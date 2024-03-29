import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://192.168.2.70:8080'
    }
  },
  // optimizeDeps: {
  //   include: ['@mui/material/CssBaseline', '@mui/material/Box'],
  //   force: true
  // },
})
