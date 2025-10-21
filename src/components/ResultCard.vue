<template>
  <div class="result-container">
    <div
      class="result-card"
      :class="{
        'picking': isAnimating,
        'picked': !isAnimating && currentPick
      }"
    >
      <div class="result-icon">{{ icon }}</div>
      <div class="result-text">{{ displayText }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPick: {
    type: String,
    default: null
  },
  isAnimating: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: '🍱'
  }
})

const displayText = computed(() => {
  if (props.currentPick) {
    return props.currentPick
  }
  return '按下按鈕開始選擇'
})
</script>

<style scoped>
.result-container {
  margin-bottom: 30px;
}

.result-card {
  background: var(--bg-card);
  border-radius: var(--border-radius);
  padding: 40px 30px;
  text-align: center;
  box-shadow: var(--shadow-card);
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
  background: linear-gradient(90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent);
  transition: left 0.5s;
}

.result-card.picking {
  border-color: var(--neon-pink);
  box-shadow: 0 0 30px rgba(255, 0, 110, 0.4);
  animation: pulse 0.5s ease-in-out infinite;
}

.result-card.picked {
  border-color: var(--neon-blue);
  box-shadow: 0 0 40px rgba(0, 245, 255, 0.5);
}

.result-card.picked::before {
  left: 100%;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}

.result-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  animation: bounce 0.6s ease-in-out;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.result-text {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  min-height: 2.5rem;
}

@media (max-width: 768px) {
  .result-card {
    padding: 30px 20px;
  }

  .result-icon {
    font-size: 3rem;
  }

  .result-text {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .result-icon {
    font-size: 2.5rem;
  }

  .result-text {
    font-size: 1.3rem;
  }
}
</style>
