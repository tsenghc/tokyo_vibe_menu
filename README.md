# 🍱 Tokyo Vibe 午餐選擇器

一個充滿東京霓虹風格的午餐選擇小工具，幫助你每天快速決定午餐吃什麼！

**Vue 3 版本** - 使用現代化的前端框架和工具鏈構建

## ✨ 功能特色

- 🎲 **隨機選擇** - 帶有炫酷動畫效果的隨機選擇器
- 📱 **響應式設計** - 完美支援手機、平板、桌面電腦
- 🎨 **Tokyo Vibe 風格** - 霓虹色調、深色主題、日式美學
- 📝 **歷史記錄** - 自動記錄最近10次選擇
- 🚫 **排除選項** - 可以臨時排除不想吃的餐廳
- 💾 **本地儲存** - 使用 LocalStorage 保存歷史記錄
- ⚡ **現代化架構** - Vue 3 Composition API + Vite
- 🚀 **自動部署** - GitHub Actions 自動化部署到 GitHub Pages

## 🍜 餐廳列表

- 蝦蝦麵
- 蛋包飯
- 魚魚飯
- 雞雞飯
- 大眾
- 車站沾麵
- 煎餃
- 漢堡
- MDD
- KFC
- 松屋
- 咖喱飯
- 義大利麵
- 餛飩麵
- 一風堂
- 味噌拉麵 絆ラーメン
- 咖啡廳豬排咖喱
- 咖啡廳法式薄餅
- 沖繩麵
- 西餐飯飯
- 炸豬排

## 🚀 快速開始

### 在線訪問

訪問已部署的網站：[Tokyo Vibe 午餐選擇器](https://tsenghc.github.io/tokyo_vibe_menu/)

### 本地開發

1. **克隆專案**
```bash
git clone https://github.com/tsenghc/tokyo_vibe_menu.git
cd tokyo_vibe_menu
```

2. **安裝依賴**
```bash
npm install
```

3. **啟動開發伺服器**
```bash
npm run dev
```

4. **在瀏覽器中開啟**
   - 預設地址：`http://localhost:5173`

### 構建生產版本

```bash
# 構建
npm run build

# 本地預覽構建結果
npm run preview
```

## 📖 使用說明

### 基本操作

1. **開始選擇** - 點擊「開始選擇」按鈕，系統會隨機選擇一家餐廳
2. **重新選擇** - 如果對結果不滿意，可以點擊「重新選擇」
3. **查看歷史** - 自動記錄最近的選擇歷史

### 管理餐廳列表

1. 點擊「餐廳列表」區域的「展開」按鈕
2. 點擊任何餐廳可以臨時排除（標記為 ✕）
3. 再次點擊可以恢復選項
4. 使用「全選」或「全不選」按鈕快速管理

### 歷史記錄

- 自動保存最近10次選擇
- 顯示選擇時間（剛剛、X分鐘前等）
- 點擊「清除」可以清空所有歷史

## 🎨 設計特色

### 視覺風格

- **Tokyo Vibe 配色**：霓虹粉、霓虹藍、霓虹紫等東京風格配色
- **深色主題**：深色背景配合霓虹效果
- **動畫效果**：流暢的過渡動畫和互動反饋
- **現代化卡片**：圓角設計、陰影效果、霓虹邊框

### 響應式設計

- **桌面版** (>768px)：寬闊的佈局，多欄網格
- **平板版** (768px-480px)：適中的間距和字體
- **手機版** (<480px)：單欄佈局，大按鈕，易於點擊

## 🛠️ 技術棧

### 核心框架
- **Vue 3** - 使用 Composition API 進行組件開發
- **Vite** - 極速的前端構建工具

### 開發工具
- **JavaScript (ES6+)** - 現代 JavaScript 特性
- **CSS3** - Scoped CSS、CSS Variables、動畫
- **LocalStorage API** - 本地資料持久化

### 部署
- **GitHub Actions** - CI/CD 自動化部署
- **GitHub Pages** - 靜態網站託管

## 📁 專案結構

```
tokyo_vibe_menu/
├── src/
│   ├── components/          # Vue 組件
│   │   ├── AppHeader.vue
│   │   ├── ResultCard.vue
│   │   ├── ControlButtons.vue
│   │   ├── HistorySection.vue
│   │   └── RestaurantList.vue
│   ├── composables/         # 組合式函數
│   │   ├── useLunchPicker.js
│   │   └── useLocalStorage.js
│   ├── assets/             # 靜態資源
│   │   └── styles/
│   │       └── global.css
│   ├── App.vue             # 主應用組件
│   └── main.js             # 應用入口
├── public/                 # 公共資源
├── index.html             # HTML 入口
├── vite.config.js         # Vite 配置
├── package.json           # 專案配置
└── README.md              # 說明文件
```

## 🎯 自訂餐廳列表

要修改餐廳列表，編輯 `src/composables/useLunchPicker.js` 中的 `restaurants` 陣列：

```javascript
const restaurants = ref([
  '你的餐廳1',
  '你的餐廳2',
  // ... 更多餐廳
])
```

## 🏗️ 開發指南

### 添加新組件

在 `src/components/` 目錄下創建新的 `.vue` 文件：

```vue
<template>
  <!-- 模板 -->
</template>

<script setup>
// 組件邏輯
</script>

<style scoped>
/* 樣式 */
</style>
```

### 使用 Composables

在 `src/composables/` 中創建可重用的邏輯：

```javascript
import { ref } from 'vue'

export function useMyFeature() {
  const state = ref(null)

  const doSomething = () => {
    // 邏輯
  }

  return {
    state,
    doSomething
  }
}
```

## 📦 部署

### 自動部署

推送到 `main` 或 `master` 分支會自動觸發 GitHub Actions 部署流程。

### 手動部署

```bash
# 構建並部署到 GitHub Pages
npm run build
npm run deploy
```

## 🌟 版本歷史

### v2.0.0 - Vue 3 重構版本
- ✅ 遷移到 Vue 3 + Vite 架構
- ✅ 使用 Composition API
- ✅ 組件化開發
- ✅ 改進的狀態管理
- ✅ 自動化部署流程
- ✅ 更好的開發體驗

### v1.0.0 - 原版
- ✅ 純 HTML/CSS/JavaScript 實現
- ✅ 基礎功能完成

## 🌟 未來功能規劃

- [ ] PWA 支援（離線使用）
- [ ] 自訂餐廳列表（UI介面）
- [ ] 收藏功能
- [ ] 餐廳評分系統
- [ ] 多語言支援（i18n）
- [ ] 主題切換（淺色/深色）
- [ ] 匯出/匯入餐廳列表
- [ ] TypeScript 支援
- [ ] 單元測試

## 📄 授權

MIT License

## 🙏 致謝

感謝所有提供美食靈感的東京餐廳！