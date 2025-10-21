<template>
  <div class="history-section">
    <h2 class="section-title">
      <span>最近選擇</span>
      <button
        v-if="history.length > 0"
        class="btn-clear"
        @click="handleClear"
      >
        清除
      </button>
    </h2>
    <div class="history-list">
      <p v-if="history.length === 0" class="empty-message">
        還沒有選擇記錄
      </p>
      <div
        v-for="(item, index) in history"
        :key="item.timestamp"
        class="history-item fade-in"
        :style="{ animationDelay: `${index * 0.05}s` }"
      >
        <span class="history-name">{{ item.restaurant }}</span>
        <span class="history-time">{{ item.displayTime }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  history: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['clear'])

const handleClear = () => {
  if (confirm('確定要清除所有歷史記錄嗎？')) {
    emit('clear')
  }
}
</script>

<style scoped>
.history-section {
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

.history-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.history-item {
  background: var(--bg-card);
  padding: 15px 20px;
  border-radius: var(--border-radius-sm);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: var(--transition);
  border-left: 3px solid var(--neon-purple);
}

.history-item:hover {
  background: var(--bg-card-hover);
  transform: translateX(5px);
}

.history-name {
  font-size: 1.1rem;
  font-weight: 500;
}

.history-time {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.empty-message {
  text-align: center;
  color: var(--text-muted);
  padding: 30px;
  font-style: italic;
}

.btn-clear {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 0.9rem;
  cursor: pointer;
  padding: 4px 12px;
  border-radius: 4px;
  transition: var(--transition);
}

.btn-clear:hover {
  color: var(--neon-pink);
  background: rgba(255, 0, 110, 0.1);
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
</style>
