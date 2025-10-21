<template>
  <div class="oil-status-section">
    <h2 class="section-title">
      <span>油度監控</span>
      <button
        class="btn-toggle-filter"
        :class="{ active: oilFilterEnabled }"
        @click="handleToggleFilter"
      >
        {{ oilFilterEnabled ? '🔒 已啟用' : '🔓 已關閉' }}
      </button>
    </h2>

    <div class="oil-meter-container">
      <div class="oil-meter">
        <div class="oil-meter-info">
          <span class="oil-label">2天內油度</span>
          <span class="oil-value">
            {{ oilStatus.current }} / {{ oilStatus.max }}
          </span>
        </div>
        <div class="oil-meter-bar">
          <div
            class="oil-meter-fill"
            :style="{ width: `${Math.min(oilStatus.percentage, 100)}%` }"
            :class="{
              'low': oilStatus.percentage < 33,
              'medium': oilStatus.percentage >= 33 && oilStatus.percentage < 66,
              'high': oilStatus.percentage >= 66
            }"
          ></div>
        </div>
        <div class="oil-meter-hint">
          <span v-if="oilStatus.remaining > 0" class="hint-safe">
            ✅ 還可以吃 {{ oilStatus.remaining }} 油度的餐點
          </span>
          <span v-else class="hint-warning">
            ⚠️ 已達上限，建議選擇清淡餐點
          </span>
        </div>
      </div>

      <!-- 因油度被過濾的餐廳 -->
      <div v-if="oilFilteredRestaurants.length > 0 && oilFilterEnabled" class="filtered-notice">
        <p class="filtered-title">
          ⛔ {{ oilFilteredRestaurants.length }} 個餐廳因油度超標被排除
        </p>
        <div class="filtered-list">
          <span
            v-for="item in oilFilteredRestaurants"
            :key="item.name"
            class="filtered-item"
          >
            {{ item.name }} (+{{ item.oilLevel }}油 = {{ item.willExceed }})
          </span>
        </div>
      </div>

      <!-- 油度過濾關閉提示 -->
      <div v-if="!oilFilterEnabled" class="filter-disabled-notice">
        <p>ℹ️ 油度過濾已關閉，所有餐廳都可選擇</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  oilStatus: {
    type: Object,
    required: true
  },
  oilFilteredRestaurants: {
    type: Array,
    default: () => []
  },
  oilFilterEnabled: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['toggle-filter'])

const handleToggleFilter = () => {
  emit('toggle-filter')
}
</script>

<style scoped>
.oil-status-section {
  margin-bottom: 30px;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-primary);
  padding-bottom: 10px;
  border-bottom: 2px solid var(--bg-card);
}

.btn-toggle-filter {
  background: var(--bg-card);
  border: 2px solid var(--text-muted);
  color: var(--text-secondary);
  font-size: 0.9rem;
  cursor: pointer;
  padding: 6px 14px;
  border-radius: 20px;
  transition: var(--transition);
}

.btn-toggle-filter.active {
  background: linear-gradient(135deg, var(--neon-green) 0%, #04d98b 100%);
  border-color: var(--neon-green);
  color: white;
}

.btn-toggle-filter:hover {
  transform: scale(1.05);
}

.oil-meter-container {
  background: var(--bg-card);
  border-radius: var(--border-radius);
  padding: 25px;
  box-shadow: var(--shadow-card);
}

.oil-meter-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.oil-label {
  font-size: 1rem;
  color: var(--text-secondary);
}

.oil-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-primary);
}

.oil-meter-bar {
  height: 20px;
  background: var(--bg-dark);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 12px;
}

.oil-meter-fill {
  height: 100%;
  transition: width 0.5s ease-in-out, background 0.3s;
  border-radius: 10px;
}

.oil-meter-fill.low {
  background: linear-gradient(90deg, var(--neon-green) 0%, #06ffa5 100%);
}

.oil-meter-fill.medium {
  background: linear-gradient(90deg, var(--neon-yellow) 0%, #ffd60a 100%);
}

.oil-meter-fill.high {
  background: linear-gradient(90deg, var(--neon-pink) 0%, #ff006e 100%);
  box-shadow: 0 0 10px rgba(255, 0, 110, 0.5);
}

.oil-meter-hint {
  text-align: center;
  font-size: 0.95rem;
  margin-top: 10px;
}

.hint-safe {
  color: var(--neon-green);
}

.hint-warning {
  color: var(--neon-yellow);
}

.filtered-notice {
  margin-top: 20px;
  padding: 15px;
  background: rgba(255, 0, 110, 0.1);
  border: 1px solid var(--neon-pink);
  border-radius: var(--border-radius-sm);
}

.filtered-title {
  color: var(--neon-pink);
  font-weight: 600;
  margin-bottom: 10px;
}

.filtered-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filtered-item {
  background: var(--bg-card-hover);
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.filter-disabled-notice {
  margin-top: 15px;
  padding: 12px;
  background: rgba(0, 245, 255, 0.1);
  border: 1px solid var(--neon-blue);
  border-radius: var(--border-radius-sm);
  text-align: center;
  color: var(--neon-blue);
}

@media (max-width: 768px) {
  .section-title {
    font-size: 1.1rem;
  }

  .btn-toggle-filter {
    font-size: 0.8rem;
    padding: 5px 12px;
  }

  .oil-meter-container {
    padding: 20px;
  }

  .filtered-item {
    font-size: 0.8rem;
  }
}
</style>
