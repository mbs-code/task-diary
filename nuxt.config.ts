import eslint from 'vite-plugin-eslint'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
const isProduct = process.env.NODE_ENV === 'production'
export default defineNuxtConfig({
  srcDir: 'src/',
  ssr: false,

  app: {
    head: {
      script: [
        !isProduct && { src: 'http://localhost:8098' }, // vue devtools
      ],
    },
  },

  vite: {
    clearScreen: false,
    server: {
      strictPort: true,
    },
    envPrefix: ['VITE_', 'TAURI_'],
    build: {
      target: ['es2021', 'chrome100', 'safari13'],
      minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
      sourcemap: !!process.env.TAURI_DEBUG,
    },

    plugins: [eslint({ fix: true })],
  },

  modules: [
    'nuxt-windicss',
  ],

  build: {
    transpile: ['kysely'],
  },
})
