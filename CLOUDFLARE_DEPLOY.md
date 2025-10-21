# Cloudflare Pages 部署說明

## 構建設置

在 Cloudflare Pages 設置中使用以下配置：

### Build configuration
- **Framework preset**: `None` 或 `Vite`
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/` (留空)

### 環境變數
不需要設置額外的環境變數。默認構建就是為 Cloudflare Pages 優化的。

## 構建命令說明

項目支持兩種構建方式：

### Cloudflare Pages（默認）
```bash
npm run build
# 或
npm run build:cloudflare
```
生成的資源路徑：`/assets/...`（適用於根路徑部署）

### GitHub Pages
```bash
npm run build:github
```
生成的資源路徑：`/tokyo_vibe_menu/assets/...`（適用於子路徑部署）

## 為什麼需要不同的構建？

- **Cloudflare Pages** 部署在根路徑：`https://your-site.pages.dev/`
- **GitHub Pages** 部署在子路徑：`https://username.github.io/repo-name/`

資源路徑必須匹配部署環境才能正常載入 CSS 和 JS 文件。

## 驗證部署

部署後訪問你的網站，檢查：
1. ✅ 頁面有樣式（CSS 載入成功）
2. ✅ 功能正常（JS 載入成功）
3. ✅ 油度管理系統正常運作

如果出現空白頁面，打開瀏覽器開發者工具（F12）查看 Console 和 Network 標籤。
