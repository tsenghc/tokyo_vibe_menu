#!/bin/bash

# Tokyo Vibe Menu - 部署檢查腳本
# 用於診斷部署問題

echo "========================================="
echo "Tokyo Vibe Menu - 部署狀態檢查"
echo "========================================="
echo ""

# 檢查 Node.js 和 npm
echo "1. 檢查環境..."
node --version > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✅ Node.js: $(node --version)"
else
    echo "   ❌ Node.js 未安裝"
fi

npm --version > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✅ npm: $(npm --version)"
else
    echo "   ❌ npm 未安裝"
fi
echo ""

# 檢查依賴
echo "2. 檢查依賴..."
if [ -d "node_modules" ]; then
    echo "   ✅ node_modules 存在"
else
    echo "   ❌ node_modules 不存在，請運行: npm install"
fi
echo ""

# 檢查配置文件
echo "3. 檢查配置文件..."
files=("package.json" "vite.config.js" "index.html" ".github/workflows/deploy.yml")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file"
    else
        echo "   ❌ $file 不存在"
    fi
done
echo ""

# 檢查 src 目錄
echo "4. 檢查源代碼..."
if [ -d "src" ]; then
    echo "   ✅ src 目錄存在"
    component_count=$(find src/components -name "*.vue" 2>/dev/null | wc -l)
    echo "   ✅ 找到 $component_count 個組件"
else
    echo "   ❌ src 目錄不存在"
fi
echo ""

# 檢查 Git 狀態
echo "5. 檢查 Git 狀態..."
current_branch=$(git branch --show-current 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "   ✅ 當前分支: $current_branch"

    if [ "$current_branch" == "main" ] || [ "$current_branch" == "master" ]; then
        echo "   ✅ 在主分支上（部署會自動觸發）"
    else
        echo "   ⚠️  不在主分支上（需要合併到 main/master 才會自動部署）"
    fi
else
    echo "   ❌ 不是 Git 倉庫"
fi
echo ""

# 嘗試構建
echo "6. 測試構建..."
if [ -d "node_modules" ]; then
    echo "   正在構建... (這可能需要幾秒鐘)"
    npm run build > /dev/null 2>&1

    if [ $? -eq 0 ]; then
        echo "   ✅ 構建成功"

        if [ -d "dist" ]; then
            echo "   ✅ dist 目錄已創建"

            if [ -f "dist/index.html" ]; then
                echo "   ✅ index.html 已生成"
            fi

            if [ -f "dist/.nojekyll" ]; then
                echo "   ✅ .nojekyll 文件存在"
            else
                echo "   ⚠️  .nojekyll 文件不存在"
            fi

            asset_count=$(find dist/assets -type f 2>/dev/null | wc -l)
            echo "   ✅ 資源文件數: $asset_count"
        fi
    else
        echo "   ❌ 構建失敗，請檢查錯誤訊息"
    fi
else
    echo "   ⚠️  跳過構建測試（需要先安裝依賴）"
fi
echo ""

# 總結
echo "========================================="
echo "部署建議"
echo "========================================="
echo ""

if [ "$current_branch" != "main" ] && [ "$current_branch" != "master" ]; then
    echo "🔴 主要問題: 代碼不在主分支上"
    echo ""
    echo "解決方案:"
    echo "1. 創建 Pull Request 並合併到 main"
    echo "   訪問: https://github.com/tsenghc/tokyo_vibe_menu/pull/new/$current_branch"
    echo ""
    echo "2. 或直接合併（如果有權限）:"
    echo "   git checkout main"
    echo "   git merge $current_branch"
    echo "   git push origin main"
else
    echo "✅ 已在主分支上"
    echo ""
    echo "請確認:"
    echo "1. GitHub Pages 已啟用"
    echo "   Settings → Pages → Source: GitHub Actions"
    echo ""
    echo "2. 推送代碼後檢查 Actions"
    echo "   https://github.com/tsenghc/tokyo_vibe_menu/actions"
    echo ""
    echo "3. 部署後訪問"
    echo "   https://tsenghc.github.io/tokyo_vibe_menu/"
fi

echo ""
echo "📖 詳細說明請查看: DEPLOYMENT.md"
echo "========================================="
