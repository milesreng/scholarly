import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      vue: '@vue/compat',
    }
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          compatConfig: {
            MODE: 2
          }
        }
      }
    }),
    svgLoader(),
  ],
  server: {
    port: 3001,
    proxy: {
      '^/api': {
        target: 'https://scholarly-api-pafu.onrender.com'
        // target: 'http://127.0.0.1:5174'
      },
    }
  },
})
