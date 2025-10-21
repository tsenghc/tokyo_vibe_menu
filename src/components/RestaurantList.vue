<template>
  <div class="restaurant-section">
    <h2 class="section-title">
      <span>餐廳列表</span>
      <button class="btn-toggle" @click="toggleList">
        {{ isExpanded ? '收起' : '展開' }}
      </button>
    </h2>
    <div class="restaurant-list" :class="{ collapsed: !isExpanded }">
      <p class="list-hint">點擊餐廳可以臨時排除</p>
      <div class="restaurant-grid">
        <div
          v-for="restaurant in restaurants"
          :key="restaurant"
          class="restaurant-item"
          :class="{
            active: !excludedRestaurants.has(restaurant),
            disabled: excludedRestaurants.has(restaurant)
          }"
          @click="handleToggle(restaurant)"
        >
          {{ restaurant }}
        </div>
      </div>
      <div class="list-actions">
        <button class="btn btn-small" @click="handleSelectAll">
          全選
        </button>
        <button class="btn btn-small" @click="handleDeselectAll">
          全不選
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  restaurants: {
    type: Array,
    required: true
  },
  excludedRestaurants: {
    type: Set,
    default: () => new Set()
  }
})

const emit = defineEmits(['toggle', 'select-all', 'deselect-all'])

const isExpanded = ref(false)

const toggleList = () => {
  isExpanded.value = !isExpanded.value
}

const handleToggle = (restaurant) => {
  emit('toggle', restaurant)
}

const handleSelectAll = () => {
  emit('select-all')
}

const handleDeselectAll = () => {
  emit('deselect-all')
}
</script>

<style scoped>
.restaurant-section {
  margin-bottom: 40px;
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

.restaurant-list {
  max-height: 500px;
  overflow: hidden;
  transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.restaurant-list.collapsed {
  max-height: 0;
}

.list-hint {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 15px;
  font-style: italic;
}

.restaurant-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.restaurant-item {
  background: var(--bg-card);
  padding: 15px;
  border-radius: var(--border-radius-sm);
  text-align: center;
  cursor: pointer;
  transition: var(--transition);
  border: 2px solid transparent;
  position: relative;
}

.restaurant-item:hover {
  background: var(--bg-card-hover);
  transform: translateY(-2px);
}

.restaurant-item.active {
  border-color: var(--neon-green);
  background: rgba(6, 255, 165, 0.1);
}

.restaurant-item.disabled {
  opacity: 0.4;
  background: var(--bg-card-hover);
  border-color: var(--text-muted);
}

.restaurant-item.disabled::after {
  content: '✕';
  position: absolute;
  top: 5px;
  right: 8px;
  color: var(--neon-pink);
  font-size: 1.2rem;
}

.list-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.btn {
  padding: 8px 16px;
  font-size: 0.9rem;
  min-width: auto;
  background: var(--bg-card-hover);
  color: var(--text-secondary);
  border: 1px solid var(--text-muted);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: var(--transition);
}

.btn:hover {
  background: var(--neon-purple);
  color: white;
  border-color: var(--neon-purple);
}

.btn-toggle {
  background: none;
  border: none;
  color: var(--neon-blue);
  font-size: 0.9rem;
  cursor: pointer;
  padding: 4px 12px;
  border-radius: 4px;
  transition: var(--transition);
}

.btn-toggle:hover {
  background: rgba(0, 245, 255, 0.1);
}

@media (max-width: 768px) {
  .restaurant-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 10px;
  }

  .restaurant-item {
    padding: 12px 8px;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .restaurant-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
}
</style>
