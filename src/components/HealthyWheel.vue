<template>
  <div class="healthy-wheel-section">
    <h2 class="wheel-title">
      <span class="title-icon">🥗</span>
      <span>健康轉盤</span>
      <span class="title-sub">好吃超市</span>
    </h2>

    <!-- 結果顯示 -->
    <div class="result-container">
      <div
        class="result-card"
        :class="{
          'picking': isAnimating,
          'picked': !isAnimating && currentPick
        }"
      >
        <div class="result-icon">{{ resultIcon }}</div>
        <div class="result-text">{{ displayText }}</div>
      </div>
    </div>

    <!-- 控制按鈕 -->
    <div class="controls">
      <button
        class="btn btn-healthy"
        @click="handlePick"
        :disabled="isAnimating || availableItems.length === 0"
      >
        <span class="btn-icon">🎲</span>
        <span>健康選擇</span>
      </button>
      <button
        v-if="currentPick"
        class="btn btn-repick"
        @click="handlePick"
        :disabled="isAnimating"
      >
        <span class="btn-icon">🔄</span>
        <span>重新選擇</span>
      </button>
    </div>

    <!-- 歷史記錄 -->
    <div v-if="history.length > 0" class="history-section">
      <h3 class="sub-title">
        <span>最近選擇</span>
        <button class="btn-clear" @click="handleClearHistory">清除</button>
      </h3>
      <div class="history-list">
        <div
          v-for="(item, index) in history"
          :key="item.timestamp"
          class="history-item fade-in"
          :style="{ animationDelay: `${index * 0.05}s` }"
        >
          <div class="history-info">
            <span class="history-icon">🥗</span>
            <span class="history-name">{{ item.restaurant }}</span>
          </div>
          <span class="history-time">{{ item.displayTime }}</span>
        </div>
      </div>
    </div>

    <!-- 菜單列表 -->
    <div class="menu-section">
      <h3 class="sub-title">
        <span>菜單列表</span>
        <button class="btn-toggle" @click="toggleList">
          {{ isExpanded ? '收起' : '展開' }}
        </button>
      </h3>
      <div class="menu-list" :class="{ collapsed: !isExpanded }">
        <p class="list-hint">點擊菜品可以臨時排除</p>
        <div class="menu-grid">
          <div
            v-for="item in menuItems"
            :key="item.name"
            class="menu-item"
            :class="{
              active: !excludedItems.has(item.name),
              disabled: excludedItems.has(item.name)
            }"
            @click="handleToggle(item.name)"
          >
            <span class="item-icon">🥗</span>
            <span class="item-name">{{ item.name }}</span>
          </div>
        </div>
        <div class="list-actions">
          <button class="btn btn-small" @click="selectAll">全選</button>
          <button class="btn btn-small" @click="deselectAll">全不選</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useHealthyPicker } from '../composables/useHealthyPicker'

const {
  menuItems,
  currentPick,
  isAnimating,
  excludedItems,
  resultIcon,
  history,
  availableItems,
  pickRandom,
  toggleItem,
  selectAll,
  deselectAll,
  clearHistory
} = useHealthyPicker()

const isExpanded = ref(false)

const displayText = computed(() => {
  if (currentPick.value) return currentPick.value
  return '按下按鈕開始健康選擇'
})

const handlePick = async () => {
  if (availableItems.value.length === 0) {
    alert('沒有可用的菜品！請至少選擇一個。')
    return
  }
  await pickRandom()
}

const handleToggle = (itemName) => {
  const success = toggleItem(itemName)
  if (!success) {
    alert('至少要保留一個可用的菜品選項！')
  }
}

const handleClearHistory = () => {
  if (confirm('確定要清除健康轉盤的歷史記錄嗎？')) {
    clearHistory()
  }
}

const toggleList = () => {
  isExpanded.value = !isExpanded.value
}
</script>

<style scoped>
.healthy-wheel-section {
  margin-bottom: 40px;
  padding: 30px;
  background: var(--bg-card);
  border-radius: var(--border-radius);
  border: 2px solid rgba(6, 255, 165, 0.3);
  box-shadow: 0 0 20px rgba(6, 255, 165, 0.1);
}

.wheel-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--neon-green);
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid rgba(6, 255, 165, 0.2);
}

.title-icon {
  font-size: 2rem;
}

.title-sub {
  font-size: 0.85rem;
  font-weight: 400;
  color: var(--text-muted);
  margin-left: auto;
}

/* Result Card */
.result-container {
  margin-bottom: 25px;
}

.result-card {
  background: var(--bg-dark);
  border-radius: var(--border-radius);
  padding: 35px 25px;
  text-align: center;
  border: 2px solid transparent;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
}

.result-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(6, 255, 165, 0.1), transparent);
  transition: left 0.5s;
}

.result-card.picking {
  border-color: var(--neon-green);
  box-shadow: 0 0 30px rgba(6, 255, 165, 0.4);
  animation: pulse 0.5s ease-in-out infinite;
}

.result-card.picked {
  border-color: var(--neon-green);
  box-shadow: 0 0 40px rgba(6, 255, 165, 0.5);
}

.result-card.picked::before {
  left: 100%;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

.result-icon {
  font-size: 3.5rem;
  margin-bottom: 15px;
}

.result-text {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-primary);
  min-height: 2.2rem;
}

/* Controls */
.controls {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.btn {
  flex: 1;
  min-width: 140px;
  padding: 14px 20px;
  font-size: 1.05rem;
  font-weight: 600;
  border: none;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.btn:hover::before {
  width: 300px;
  height: 300px;
}

.btn-icon {
  font-size: 1.2rem;
}

.btn-healthy {
  background: linear-gradient(135deg, #06ffa5 0%, #17c784 100%);
  color: #0a0a0f;
  box-shadow: 0 4px 15px rgba(6, 255, 165, 0.4);
}

.btn-healthy:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(6, 255, 165, 0.6);
}

.btn-healthy:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-repick {
  background: var(--bg-dark);
  color: var(--neon-green);
  border: 2px solid var(--neon-green);
  box-shadow: 0 4px 15px rgba(6, 255, 165, 0.2);
}

.btn-repick:hover:not(:disabled) {
  background: var(--neon-green);
  color: var(--bg-dark);
  transform: translateY(-2px);
}

/* History */
.history-section {
  margin-bottom: 25px;
}

.sub-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(6, 255, 165, 0.15);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.history-item {
  background: var(--bg-dark);
  padding: 12px 16px;
  border-radius: var(--border-radius-sm);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: var(--transition);
  border-left: 3px solid var(--neon-green);
}

.history-item:hover {
  background: var(--bg-card-hover);
  transform: translateX(5px);
}

.history-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.history-icon {
  font-size: 1.3rem;
}

.history-name {
  font-size: 1rem;
  font-weight: 500;
}

.history-time {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.btn-clear {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 0.85rem;
  cursor: pointer;
  padding: 4px 10px;
  border-radius: 4px;
  transition: var(--transition);
}

.btn-clear:hover {
  color: var(--neon-pink);
  background: rgba(255, 0, 110, 0.1);
}

/* Menu List */
.menu-section {
  margin-top: 10px;
}

.menu-list {
  max-height: 400px;
  overflow: hidden;
  transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-list.collapsed {
  max-height: 0;
}

.list-hint {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 12px;
  font-style: italic;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
  margin-bottom: 15px;
}

.menu-item {
  background: var(--bg-dark);
  padding: 12px 10px;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: var(--transition);
  border: 2px solid transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  position: relative;
}

.menu-item:hover {
  background: var(--bg-card-hover);
  transform: translateY(-2px);
}

.menu-item.active {
  border-color: var(--neon-green);
  background: rgba(6, 255, 165, 0.1);
}

.menu-item.disabled {
  opacity: 0.4;
  background: var(--bg-card-hover);
  border-color: var(--text-muted);
}

.menu-item.disabled::after {
  content: '✕';
  position: absolute;
  top: 5px;
  right: 8px;
  color: var(--neon-pink);
  font-size: 1.1rem;
}

.item-icon {
  font-size: 1.8rem;
}

.item-name {
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
  line-height: 1.3;
}

.list-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.btn-small {
  padding: 6px 14px;
  font-size: 0.85rem;
  min-width: auto;
  background: var(--bg-dark);
  color: var(--text-secondary);
  border: 1px solid var(--text-muted);
}

.btn-small:hover {
  background: var(--neon-green);
  color: var(--bg-dark);
  border-color: var(--neon-green);
}

.btn-toggle {
  background: none;
  border: none;
  color: var(--neon-green);
  font-size: 0.85rem;
  cursor: pointer;
  padding: 4px 10px;
  border-radius: 4px;
  transition: var(--transition);
}

.btn-toggle:hover {
  background: rgba(6, 255, 165, 0.1);
}

.fade-in {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .healthy-wheel-section {
    padding: 20px 15px;
  }

  .result-card {
    padding: 25px 15px;
  }

  .result-icon {
    font-size: 2.5rem;
  }

  .result-text {
    font-size: 1.3rem;
  }

  .controls {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    min-width: auto;
  }

  .menu-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
}

@media (max-width: 480px) {
  .menu-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
}
</style>
