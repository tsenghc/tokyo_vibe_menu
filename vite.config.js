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
  // 使用環境變數來設定 base，方便本地開發和生產環境切換
  base: process.env.NODE_ENV === 'production' ? '/tokyo_vibe_menu/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    // 確保資源內聯閾值合理
    assetsInlineLimit: 4096
  }
})
