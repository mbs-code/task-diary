import eslint from 'vite-plugin-eslint'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
const isProduct = process.env.NODE_ENV === 'production'
export default defineNuxtConfig({
  srcDir: 'src/',
  ssr: false,

  css: [
    'primevue/resources/themes/bootstrap4-dark-blue/theme.css',
    'primevue/resources/primevue.css',
    'primeicons/primeicons.css',
    '@/assets/index.scss',
  ],

  app: {
    head: {
      script: [
        !isProduct && { src: 'http://localhost:8098' }, // vue devtools
      ],
    },
  },

  components: [{
    path: '~/components',
    pathPrefix: false,
  }],

  modules: [
    'nuxt-windicss',
  ],

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
})
