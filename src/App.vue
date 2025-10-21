<template>
  <div class="app-container">
    <!-- 標題 -->
    <AppHeader />

    <!-- 油度監控 -->
    <OilStatus
      :oil-status="oilStatus"
      :oil-filtered-restaurants="oilFilteredRestaurants"
      :oil-filter-enabled="oilFilterEnabled"
      @toggle-filter="toggleOilFilter"
    />

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

    <!-- 已食用記錄 -->
    <ConsumedMeals
      :consumed-meals="consumedMeals"
      :restaurant-data="restaurantData"
      :get-oil-icon="getOilIcon"
      :format-time="formatTime"
      @remove="removeConsumed"
      @clear="clearConsumed"
      @add="manualAddConsumed"
    />

    <!-- 歷史記錄 -->
    <HistorySection
      :history="history"
      @clear="clearHistory"
    />

    <!-- 餐廳列表 -->
    <RestaurantList
      :restaurant-data="restaurantData"
      :excluded-restaurants="excludedRestaurants"
      :get-oil-icon="getOilIcon"
      :can-eat-restaurant="canEatRestaurant"
      :oil-filter-enabled="oilFilterEnabled"
      @toggle="handleToggleRestaurant"
      @select-all="selectAll"
      @deselect-all="deselectAll"
    />

    <!-- 頁腳 -->
    <footer class="footer">
      <p>Made with ❤️ in Tokyo Style | Vue 3 + Vite + 油度管理</p>
    </footer>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useLunchPicker } from './composables/useLunchPicker'
import AppHeader from './components/AppHeader.vue'
import OilStatus from './components/OilStatus.vue'
import ResultCard from './components/ResultCard.vue'
import ControlButtons from './components/ControlButtons.vue'
import ConsumedMeals from './components/ConsumedMeals.vue'
import HistorySection from './components/HistorySection.vue'
import RestaurantList from './components/RestaurantList.vue'

// 使用 composable
const {
  restaurantData,
  currentPick,
  isAnimating,
  excludedRestaurants,
  resultIcon,
  history,
  consumedMeals,
  availableRestaurants,
  oilFilterEnabled,
  oilStatus,
  oilFilteredRestaurants,
  pickRandomRestaurant,
  clearHistory,
  clearConsumed,
  toggleRestaurant,
  selectAll,
  deselectAll,
  updateHistoryTimes,
  getOilLevel,
  getOilIcon,
  getOilText,
  canEatRestaurant,
  manualAddConsumed,
  removeConsumed,
  toggleOilFilter,
  formatTime
} = useLunchPicker()

// 處理選擇
const handlePick = async () => {
  if (availableRestaurants.value.length === 0) {
    if (oilFilterEnabled.value && oilFilteredRestaurants.value.length > 0) {
      alert('目前沒有符合油度限制的餐廳！\n' +
            '建議：\n' +
            '1. 等待油度降低（2天內不超過3油）\n' +
            '2. 關閉油度過濾\n' +
            '3. 手動調整已食用記錄')
    } else {
      alert('沒有可用的餐廳！請至少選擇一個。')
    }
    return
  }

  await pickRandomRestaurant()
}

// 處理餐廳切換
const handleToggleRestaurant = (restaurant) => {
  const success = toggleRestaurant(restaurant)
  if (!success) {
    alert('至少要保留一個可用的餐廳選項！')
  }
}

// 定期更新歷史記錄時間
let updateInterval = null

onMounted(() => {
  // 每分鐘更新一次時間顯示
  updateInterval = setInterval(() => {
    updateHistoryTimes()
  }, 60000)

  console.log('🍱 Tokyo Vibe 午餐選擇器 - 油度管理系統已啟動')
  console.log('📊 當前油度狀態:', oilStatus.value)
  console.log('📋 已食用記錄數:', consumedMeals.value.length)
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
