import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // 使用環境變數來設定 base，支援不同的部署平台
  // DEPLOY_PLATFORM=github -> GitHub Pages (需要 /tokyo_vibe_menu/)
  // DEPLOY_PLATFORM=cloudflare -> Cloudflare Pages (使用 /)
  // 默認使用相對路徑 ./ (最通用)
  base: process.env.DEPLOY_PLATFORM === 'github'
    ? '/tokyo_vibe_menu/'
    : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    // 確保資源內聯閾值合理
    assetsInlineLimit: 4096
  }
})
