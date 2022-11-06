import eslint from 'vite-plugin-eslint'

const isProduct = process.env.NODE_ENV === 'production'
const headScript = isProduct
  ? [{ src: 'http://localhost:8098' },]
  : []

// https://v3.nuxtjs.org/api/configuration/nuxt.config
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
      script: headScript,
    },
  },

  components: [{
    path: '~/components',
    pathPrefix: false,
  }],

  imports: {
    dirs: [
      'composables/**',
    ],
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

    plugins: [
      eslint({ fix: true, include: 'src/**/*.{js,ts,vue}' }),
    ],
  },

  modules: [
    'nuxt-windicss',
    '@vueuse/nuxt',
  ],

  build: {
    transpile: ['kysely'],
  },
})
