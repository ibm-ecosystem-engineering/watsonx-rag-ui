import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/

const apiTarget: string = '' || 'http://localhost:3000';
const graphqlTarget: string = '' || 'http://localhost:3000';
const socketTarget: string = '' || 'ws://localhost:3000';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // with options: http://localhost:5173/api/bar-> {apiTarget}/bar
      '/api': {
        target: apiTarget,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/graphql': {
        target: graphqlTarget,
        changeOrigin: true,
      },
      '/subscription': {
        target: socketTarget,
        ws: true,
      },
    },
  },
})
