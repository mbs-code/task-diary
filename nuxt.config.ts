// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  srcDir: 'src/',
  ssr: false,

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
  }
})
