<template>
  <div class="consumed-section">
    <h2 class="section-title">
      <span>已食用記錄</span>
      <div class="title-actions">
        <button class="btn-add" @click="showAddModal = true">
          ➕ 添加
        </button>
        <button
          v-if="consumedMeals.length > 0"
          class="btn-clear"
          @click="handleClear"
        >
          清除全部
        </button>
      </div>
    </h2>

    <div class="consumed-list">
      <p v-if="consumedMeals.length === 0" class="empty-message">
        還沒有食用記錄
      </p>

      <div
        v-for="(meal, index) in displayMeals"
        :key="index"
        class="consumed-item fade-in"
      >
        <div class="meal-info">
          <span class="meal-icon">{{ getOilIcon(meal.oilLevel) }}</span>
          <div class="meal-details">
            <span class="meal-name">{{ meal.restaurant }}</span>
            <span class="meal-time">{{ formatTime(meal.timestamp) }}</span>
          </div>
        </div>
        <div class="meal-actions">
          <span class="meal-oil" :class="`oil-${meal.oilLevel}`">
            {{ meal.oilLevel }}油
          </span>
          <button class="btn-remove" @click="handleRemove(index)">
            ✕
          </button>
        </div>
      </div>
    </div>

    <!-- 添加記錄模態框 -->
    <div v-if="showAddModal" class="modal-overlay" @click="showAddModal = false">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">添加已食用記錄</h3>

        <div class="form-group">
          <label>選擇餐廳</label>
          <select v-model="selectedRestaurant" class="form-select">
            <option value="">請選擇...</option>
            <option
              v-for="restaurant in sortedRestaurants"
              :key="restaurant.name"
              :value="restaurant.name"
            >
              {{ getOilIcon(restaurant.oilLevel) }} {{ restaurant.name }}
              ({{ restaurant.oilLevel }}油)
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>選擇日期時間</label>
          <input
            v-model="selectedDateTime"
            type="datetime-local"
            class="form-input"
          />
        </div>

        <div class="modal-actions">
          <button class="btn btn-cancel" @click="showAddModal = false">
            取消
          </button>
          <button
            class="btn btn-confirm"
            :disabled="!selectedRestaurant"
            @click="handleAdd"
          >
            確認添加
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  consumedMeals: {
    type: Array,
    default: () => []
  },
  restaurantData: {
    type: Array,
    required: true
  },
  getOilIcon: {
    type: Function,
    required: true
  },
  formatTime: {
    type: Function,
    required: true
  }
})

const emit = defineEmits(['remove', 'clear', 'add'])

// 模態框狀態
const showAddModal = ref(false)
const selectedRestaurant = ref('')
const selectedDateTime = ref('')

// 初始化當前時間
const initDateTime = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  selectedDateTime.value = `${year}-${month}-${day}T${hours}:${minutes}`
}

// 打開模態框時初始化
const openModal = () => {
  initDateTime()
  showAddModal.value = true
}

// 顯示最近7天的記錄
const displayMeals = computed(() => {
  return props.consumedMeals.slice(0, 20) // 最多顯示20條
})

// 按油度排序的餐廳列表
const sortedRestaurants = computed(() => {
  return [...props.restaurantData].sort((a, b) => a.oilLevel - b.oilLevel)
})

const handleRemove = (index) => {
  if (confirm('確定要刪除這條記錄嗎？')) {
    emit('remove', index)
  }
}

const handleClear = () => {
  if (confirm('確定要清除所有已食用記錄嗎？這會重置油度計算。')) {
    emit('clear')
  }
}

const handleAdd = () => {
  if (!selectedRestaurant.value) return

  const date = new Date(selectedDateTime.value)
  emit('add', selectedRestaurant.value, date)

  // 重置表單
  selectedRestaurant.value = ''
  initDateTime()
  showAddModal.value = false
}

// 初始化時間
initDateTime()
</script>

<style scoped>
.consumed-section {
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

.title-actions {
  display: flex;
  gap: 10px;
}

.btn-add {
  background: linear-gradient(135deg, var(--neon-blue) 0%, #00d4ff 100%);
  border: none;
  color: white;
  font-size: 0.85rem;
  cursor: pointer;
  padding: 6px 14px;
  border-radius: 20px;
  transition: var(--transition);
  font-weight: 600;
}

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 245, 255, 0.4);
}

.btn-clear {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 0.85rem;
  cursor: pointer;
  padding: 4px 12px;
  border-radius: 4px;
  transition: var(--transition);
}

.btn-clear:hover {
  color: var(--neon-pink);
  background: rgba(255, 0, 110, 0.1);
}

.consumed-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.consumed-item {
  background: var(--bg-card);
  padding: 15px 20px;
  border-radius: var(--border-radius-sm);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: var(--transition);
  border-left: 3px solid var(--neon-blue);
}

.consumed-item:hover {
  background: var(--bg-card-hover);
  transform: translateX(5px);
}

.meal-info {
  display: flex;
  align-items: center;
  gap: 15px;
  flex: 1;
}

.meal-icon {
  font-size: 2rem;
}

.meal-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meal-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.meal-time {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.meal-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.meal-oil {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
}

.meal-oil.oil-0 {
  background: rgba(6, 255, 165, 0.2);
  color: var(--neon-green);
}

.meal-oil.oil-1 {
  background: rgba(255, 190, 11, 0.2);
  color: var(--neon-yellow);
}

.meal-oil.oil-2 {
  background: rgba(255, 0, 110, 0.2);
  color: var(--neon-pink);
}

.btn-remove {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 4px 8px;
  transition: var(--transition);
}

.btn-remove:hover {
  color: var(--neon-pink);
  transform: scale(1.2);
}

.empty-message {
  text-align: center;
  color: var(--text-muted);
  padding: 40px;
  font-style: italic;
}

/* 模態框樣式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(10, 10, 15, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s;
}

.modal-content {
  background: var(--bg-card);
  border-radius: var(--border-radius);
  padding: 30px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  border: 2px solid var(--neon-blue);
}

.modal-title {
  font-size: 1.5rem;
  margin-bottom: 25px;
  color: var(--text-primary);
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: var(--text-secondary);
  font-weight: 500;
}

.form-select,
.form-input {
  width: 100%;
  padding: 12px;
  background: var(--bg-dark);
  border: 2px solid var(--bg-card-hover);
  border-radius: var(--border-radius-sm);
  color: var(--text-primary);
  font-size: 1rem;
  transition: var(--transition);
}

.form-select:focus,
.form-input:focus {
  outline: none;
  border-color: var(--neon-blue);
  box-shadow: 0 0 10px rgba(0, 245, 255, 0.3);
}

.modal-actions {
  display: flex;
  gap: 15px;
  margin-top: 25px;
}

.btn {
  flex: 1;
  padding: 12px 24px;
  border: none;
  border-radius: var(--border-radius-sm);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.btn-cancel {
  background: var(--bg-card-hover);
  color: var(--text-secondary);
}

.btn-cancel:hover {
  background: var(--text-muted);
  color: var(--text-primary);
}

.btn-confirm {
  background: linear-gradient(135deg, var(--neon-blue) 0%, #00d4ff 100%);
  color: white;
}

.btn-confirm:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 245, 255, 0.5);
}

.btn-confirm:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
  .section-title {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .meal-info {
    gap: 10px;
  }

  .meal-icon {
    font-size: 1.5rem;
  }

  .meal-name {
    font-size: 1rem;
  }

  .modal-content {
    padding: 20px;
  }
}
</style>
