<template>
  <div class="app-container">
    <!-- 標題 -->
    <AppHeader />

    <!-- 結果顯示 -->
    <ResultCard
      :current-pick="currentPick"
      :is-animating="isAnimating"
      :icon="resultIcon"
    />

    <!-- 控制按鈕 -->
    <ControlButtons
      :current-pick="currentPick"
      :is-animating="isAnimating"
      :available-count="availableRestaurants.length"
      @pick="handlePick"
    />

    <!-- 歷史記錄 -->
    <HistorySection
      :history="history"
      @clear="clearHistory"
    />

    <!-- 餐廳列表 -->
    <RestaurantList
      :restaurants="restaurants"
      :excluded-restaurants="excludedRestaurants"
      @toggle="handleToggleRestaurant"
      @select-all="selectAll"
      @deselect-all="deselectAll"
    />

    <!-- 頁腳 -->
    <footer class="footer">
      <p>Made with ❤️ in Tokyo Style | Vue 3 + Vite</p>
    </footer>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useLunchPicker } from './composables/useLunchPicker'
import AppHeader from './components/AppHeader.vue'
import ResultCard from './components/ResultCard.vue'
import ControlButtons from './components/ControlButtons.vue'
import HistorySection from './components/HistorySection.vue'
import RestaurantList from './components/RestaurantList.vue'

// 使用 composable
const {
  restaurants,
  currentPick,
  isAnimating,
  excludedRestaurants,
  resultIcon,
  history,
  availableRestaurants,
  pickRandomRestaurant,
  clearHistory,
  toggleRestaurant,
  selectAll,
  deselectAll,
  updateHistoryTimes
} = useLunchPicker()

// 處理選擇
const handlePick = async () => {
  await pickRandomRestaurant()
}

// 處理餐廳切換
const handleToggleRestaurant = (restaurant) => {
  const success = toggleRestaurant(restaurant)
  if (!success) {
    alert('至少要保留一個餐廳選項！')
  }
}

// 定期更新歷史記錄時間
let updateInterval = null

onMounted(() => {
  // 每分鐘更新一次時間顯示
  updateInterval = setInterval(() => {
    updateHistoryTimes()
  }, 60000)
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
})
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.footer {
  margin-top: auto;
}
</style>
