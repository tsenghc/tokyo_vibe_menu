// ============================================
// Tokyo Vibe 午餐選擇器 - 主要邏輯
// ============================================

class LunchPicker {
    constructor() {
        // 餐廳列表
        this.restaurants = [
            '蝦蝦麵',
            '蛋包飯',
            '魚魚飯',
            '雞雞飯',
            '大眾',
            '車站沾麵',
            '煎餃',
            '漢堡',
            'MDD',
            'KFC',
            '松屋',
            '咖喱飯',
            '義大利麵',
            '餛飩麵',
            '一風堂',
            '味噌拉麵 絆ラーメン',
            '咖啡廳豬排咖喱',
            '咖啡廳法式薄餅',
            '沖繩麵',
            '西餐飯飯',
            '炸豬排'
        ];

        // 狀態管理
        this.history = this.loadHistory();
        this.excludedRestaurants = new Set();
        this.currentPick = null;
        this.isAnimating = false;

        // DOM 元素
        this.elements = {
            resultCard: document.getElementById('resultCard'),
            resultText: document.getElementById('resultText'),
            pickBtn: document.getElementById('pickBtn'),
            rePickBtn: document.getElementById('rePickBtn'),
            historyList: document.getElementById('historyList'),
            clearHistoryBtn: document.getElementById('clearHistoryBtn'),
            restaurantGrid: document.getElementById('restaurantGrid'),
            restaurantList: document.getElementById('restaurantList'),
            toggleListBtn: document.getElementById('toggleListBtn'),
            selectAllBtn: document.getElementById('selectAllBtn'),
            deselectAllBtn: document.getElementById('deselectAllBtn'),
            loadingOverlay: document.getElementById('loadingOverlay')
        };

        this.init();
    }

    // 初始化
    init() {
        this.renderRestaurantList();
        this.renderHistory();
        this.attachEventListeners();
        console.log('Tokyo Vibe 午餐選擇器已啟動！');
    }

    // 綁定事件監聽器
    attachEventListeners() {
        // 選擇按鈕
        this.elements.pickBtn.addEventListener('click', () => this.pickRandomRestaurant());
        this.elements.rePickBtn.addEventListener('click', () => this.pickRandomRestaurant());

        // 歷史記錄
        this.elements.clearHistoryBtn.addEventListener('click', () => this.clearHistory());

        // 餐廳列表
        this.elements.toggleListBtn.addEventListener('click', () => this.toggleRestaurantList());
        this.elements.selectAllBtn.addEventListener('click', () => this.selectAll());
        this.elements.deselectAllBtn.addEventListener('click', () => this.deselectAll());
    }

    // 渲染餐廳列表
    renderRestaurantList() {
        this.elements.restaurantGrid.innerHTML = '';

        this.restaurants.forEach((restaurant) => {
            const item = document.createElement('div');
            item.className = 'restaurant-item';
            item.textContent = restaurant;

            // 設置初始狀態
            if (!this.excludedRestaurants.has(restaurant)) {
                item.classList.add('active');
            } else {
                item.classList.add('disabled');
            }

            // 點擊切換排除狀態
            item.addEventListener('click', () => {
                this.toggleRestaurant(restaurant, item);
            });

            this.elements.restaurantGrid.appendChild(item);
        });
    }

    // 切換餐廳排除狀態
    toggleRestaurant(restaurant, element) {
        if (this.excludedRestaurants.has(restaurant)) {
            this.excludedRestaurants.delete(restaurant);
            element.classList.remove('disabled');
            element.classList.add('active');
        } else {
            // 確保至少保留一個餐廳
            const availableCount = this.restaurants.length - this.excludedRestaurants.size;
            if (availableCount <= 1) {
                this.showError('至少要保留一個餐廳選項！');
                return;
            }

            this.excludedRestaurants.add(restaurant);
            element.classList.remove('active');
            element.classList.add('disabled');
        }
    }

    // 隨機選擇餐廳
    async pickRandomRestaurant() {
        if (this.isAnimating) return;

        // 獲取可用餐廳列表
        const availableRestaurants = this.restaurants.filter(
            r => !this.excludedRestaurants.has(r)
        );

        if (availableRestaurants.length === 0) {
            this.showError('沒有可用的餐廳！請至少選擇一個。');
            return;
        }

        this.isAnimating = true;
        this.elements.pickBtn.disabled = true;
        this.elements.rePickBtn.style.display = 'none';

        // 添加動畫效果
        this.elements.resultCard.classList.add('picking');

        // 快速切換效果（模擬抽選動畫）
        const animationDuration = 2000;
        const intervalTime = 100;
        const iterations = animationDuration / intervalTime;

        let currentIteration = 0;
        const interval = setInterval(() => {
            const randomRestaurant = availableRestaurants[
                Math.floor(Math.random() * availableRestaurants.length)
            ];
            this.elements.resultText.textContent = randomRestaurant;

            currentIteration++;
            if (currentIteration >= iterations) {
                clearInterval(interval);
                this.finalizePick(availableRestaurants);
            }
        }, intervalTime);
    }

    // 完成選擇
    finalizePick(availableRestaurants) {
        // 最終選擇
        const finalPick = availableRestaurants[
            Math.floor(Math.random() * availableRestaurants.length)
        ];

        this.currentPick = finalPick;
        this.elements.resultText.textContent = finalPick;

        // 移除選擇動畫，添加完成效果
        this.elements.resultCard.classList.remove('picking');
        this.elements.resultCard.classList.add('picked');

        // 添加到歷史記錄
        this.addToHistory(finalPick);

        // 顯示重新選擇按鈕
        setTimeout(() => {
            this.elements.rePickBtn.style.display = 'flex';
            this.elements.pickBtn.disabled = false;
            this.isAnimating = false;

            // 慶祝效果
            this.celebrate();
        }, 500);
    }

    // 慶祝效果
    celebrate() {
        const icons = ['🎉', '✨', '🎊', '🌟', '💫'];
        const randomIcon = icons[Math.floor(Math.random() * icons.length)];

        // 更新結果圖示
        const resultIcon = this.elements.resultCard.querySelector('.result-icon');
        resultIcon.textContent = randomIcon;
        resultIcon.classList.add('bounce');

        setTimeout(() => {
            resultIcon.classList.remove('bounce');
        }, 600);
    }

    // 添加到歷史記錄
    addToHistory(restaurant) {
        const timestamp = new Date();
        const historyItem = {
            restaurant,
            timestamp: timestamp.toISOString(),
            displayTime: this.formatTime(timestamp)
        };

        // 添加到開頭
        this.history.unshift(historyItem);

        // 限制歷史記錄數量
        if (this.history.length > 10) {
            this.history = this.history.slice(0, 10);
        }

        // 保存並渲染
        this.saveHistory();
        this.renderHistory();
    }

    // 渲染歷史記錄
    renderHistory() {
        if (this.history.length === 0) {
            this.elements.historyList.innerHTML = '<p class="empty-message">還沒有選擇記錄</p>';
            this.elements.clearHistoryBtn.style.display = 'none';
            return;
        }

        this.elements.clearHistoryBtn.style.display = 'block';
        this.elements.historyList.innerHTML = '';

        this.history.forEach((item, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item fade-in';
            historyItem.style.animationDelay = `${index * 0.05}s`;

            historyItem.innerHTML = `
                <span class="history-name">${item.restaurant}</span>
                <span class="history-time">${item.displayTime}</span>
            `;

            this.elements.historyList.appendChild(historyItem);
        });
    }

    // 清除歷史記錄
    clearHistory() {
        if (confirm('確定要清除所有歷史記錄嗎？')) {
            this.history = [];
            this.saveHistory();
            this.renderHistory();
        }
    }

    // 切換餐廳列表顯示
    toggleRestaurantList() {
        const isCollapsed = this.elements.restaurantList.classList.contains('collapsed');

        if (isCollapsed) {
            this.elements.restaurantList.classList.remove('collapsed');
            this.elements.toggleListBtn.textContent = '收起';
        } else {
            this.elements.restaurantList.classList.add('collapsed');
            this.elements.toggleListBtn.textContent = '展開';
        }
    }

    // 全選餐廳
    selectAll() {
        this.excludedRestaurants.clear();
        this.renderRestaurantList();
    }

    // 全不選餐廳
    deselectAll() {
        // 保留一個隨機餐廳
        const keepOne = this.restaurants[Math.floor(Math.random() * this.restaurants.length)];

        this.excludedRestaurants.clear();
        this.restaurants.forEach(r => {
            if (r !== keepOne) {
                this.excludedRestaurants.add(r);
            }
        });

        this.renderRestaurantList();
        this.showError(`已保留「${keepOne}」，其他全部排除`);
    }

    // 顯示錯誤訊息
    showError(message) {
        const resultText = this.elements.resultText;
        const originalText = resultText.textContent;

        resultText.textContent = message;
        this.elements.resultCard.classList.add('shake');

        setTimeout(() => {
            resultText.textContent = originalText;
            this.elements.resultCard.classList.remove('shake');
        }, 2000);
    }

    // 格式化時間
    formatTime(date) {
        const now = new Date();
        const diff = now - date;

        // 小於1分鐘
        if (diff < 60000) {
            return '剛剛';
        }

        // 小於1小時
        if (diff < 3600000) {
            const minutes = Math.floor(diff / 60000);
            return `${minutes}分鐘前`;
        }

        // 小於1天
        if (diff < 86400000) {
            const hours = Math.floor(diff / 3600000);
            return `${hours}小時前`;
        }

        // 顯示日期時間
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');

        return `${month}/${day} ${hour}:${minute}`;
    }

    // 本地存儲 - 載入歷史記錄
    loadHistory() {
        try {
            const saved = localStorage.getItem('lunchPickerHistory');
            if (saved) {
                const history = JSON.parse(saved);
                // 更新顯示時間
                return history.map(item => ({
                    ...item,
                    displayTime: this.formatTime(new Date(item.timestamp))
                }));
            }
        } catch (error) {
            console.error('載入歷史記錄失敗:', error);
        }
        return [];
    }

    // 本地存儲 - 保存歷史記錄
    saveHistory() {
        try {
            localStorage.setItem('lunchPickerHistory', JSON.stringify(this.history));
        } catch (error) {
            console.error('保存歷史記錄失敗:', error);
        }
    }
}

// 初始化應用
document.addEventListener('DOMContentLoaded', () => {
    window.lunchPicker = new LunchPicker();
});

// PWA支持（可選）
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // 未來可以添加Service Worker來支持離線使用
        console.log('準備支援PWA功能');
    });
}
