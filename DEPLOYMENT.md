# 部署問題診斷與解決方案

## 🔍 問題診斷

如果部署後網頁沒有畫面，可能是以下原因：

### 1. 代碼尚未合併到主分支

**問題**: GitHub Actions 配置為只在 `main` 或 `master` 分支觸發部署。

**當前狀態**: 代碼在分支 `claude/lunch-picker-app-011CUKWxjhTkWKNW3YN6rXvU`

**解決方案**:
```bash
# 選項 A: 創建 Pull Request 並合併
# 在 GitHub 上創建 PR: https://github.com/tsenghc/tokyo_vibe_menu/pull/new/claude/lunch-picker-app-011CUKWxjhTkWKNW3YN6rXvU

# 選項 B: 直接合併到 main (如果有權限)
git checkout main || git checkout -b main
git merge claude/lunch-picker-app-011CUKWxjhTkWKNW3YN6rXvU
git push origin main
```

### 2. GitHub Pages 未啟用

**解決步驟**:
1. 前往 Repository Settings
2. 找到 "Pages" 設置
3. Source 選擇: "GitHub Actions"
4. 確認設置已保存

### 3. 路徑配置問題

**已修復**:
- ✅ `vite.config.js` 已配置正確的 base path
- ✅ `.nojekyll` 文件已添加（避免 Jekyll 處理）
- ✅ 構建產物路徑正確

## 🚀 完整部署流程

### 步驟 1: 檢查 GitHub Pages 設置

1. 前往: `https://github.com/tsenghc/tokyo_vibe_menu/settings/pages`
2. 確認 Source 設為 "GitHub Actions"

### 步驟 2: 合併代碼到主分支

```bash
# 如果沒有 main 分支，創建一個
git checkout -b main
git push -u origin main

# 或者合併當前分支到已存在的 main
git checkout main
git merge claude/lunch-picker-app-011CUKWxjhTkWKNW3YN6rXvU
git push origin main
```

### 步驟 3: 觸發部署

推送到 main 分支後，GitHub Actions 會自動：
1. 安裝依賴
2. 構建專案
3. 部署到 GitHub Pages

可以在這裡查看部署狀態:
`https://github.com/tsenghc/tokyo_vibe_menu/actions`

### 步驟 4: 訪問網站

部署成功後，訪問:
`https://tsenghc.github.io/tokyo_vibe_menu/`

## 🧪 本地測試

### 方法 1: 使用 Vite 預覽

```bash
# 構建專案
npm run build

# 預覽構建結果（會自動處理路徑）
npm run preview
```

### 方法 2: 模擬 GitHub Pages 環境

```bash
# 安裝 serve (全局)
npm install -g serve

# 在 dist 目錄運行，並設置正確的 base path
cd dist
serve -s . -p 8080

# 然後訪問: http://localhost:8080/tokyo_vibe_menu/
```

### 方法 3: 使用相對路徑構建（開發測試用）

臨時修改 `vite.config.js`:
```javascript
base: './', // 改為相對路徑
```

然後構建並直接打開 `dist/index.html`

**注意**: 測試完記得改回 `base: '/tokyo_vibe_menu/'`

## 🔧 常見問題

### Q: 頁面空白但沒有錯誤

**檢查**:
1. 打開瀏覽器開發者工具 (F12)
2. 查看 Console 是否有 JavaScript 錯誤
3. 查看 Network 標籤，確認 JS 和 CSS 文件是否成功加載 (狀態碼 200)

### Q: 資源文件 404

**原因**: Base path 配置錯誤

**解決**:
1. 確認 repository 名稱是 `tokyo_vibe_menu`
2. 確認 `vite.config.js` 中 `base: '/tokyo_vibe_menu/'`
3. 如果 repository 名稱不同，修改 base path

### Q: 首次部署需要等多久？

通常 2-5 分鐘。可以在 Actions 頁面查看進度。

## 📋 檢查清單

部署前確認:
- [ ] 代碼已推送到 main/master 分支
- [ ] GitHub Pages 已在 Settings 中啟用
- [ ] Source 設置為 "GitHub Actions"
- [ ] `.github/workflows/deploy.yml` 文件存在
- [ ] `package.json` 包含必要的依賴
- [ ] 本地構建成功 (`npm run build`)

部署後確認:
- [ ] GitHub Actions 工作流程執行成功
- [ ] 綠色勾選出現在 Actions 頁面
- [ ] 訪問 URL 顯示正確內容
- [ ] 瀏覽器開發者工具沒有錯誤

## 🆘 如果仍然有問題

1. **檢查 Actions 日誌**:
   - 前往: `https://github.com/tsenghc/tokyo_vibe_menu/actions`
   - 查看最近的工作流程
   - 檢查是否有錯誤訊息

2. **清除瀏覽器緩存**:
   - 按 Ctrl+Shift+R (Windows/Linux)
   - 或 Cmd+Shift+R (Mac)
   - 強制重新加載頁面

3. **驗證構建產物**:
   ```bash
   npm run build
   ls -la dist/
   cat dist/index.html
   ```
   確認文件路徑正確

## 📞 當前狀態

- ✅ Vue 3 + Vite 專案已配置完成
- ✅ GitHub Actions 工作流程已創建
- ✅ 構建配置已優化
- ✅ .nojekyll 文件已添加
- ⏳ **待完成**: 合併代碼到 main 分支並觸發部署
