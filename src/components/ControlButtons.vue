<template>
  <div class="controls">
    <button
      class="btn btn-primary"
      @click="handlePick"
      :disabled="isAnimating || availableCount === 0"
    >
      <span class="btn-icon">🎲</span>
      <span>開始選擇</span>
    </button>
    <button
      v-if="currentPick"
      class="btn btn-secondary"
      @click="handlePick"
      :disabled="isAnimating"
    >
      <span class="btn-icon">🔄</span>
      <span>重新選擇</span>
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  currentPick: {
    type: String,
    default: null
  },
  isAnimating: {
    type: Boolean,
    default: false
  },
  availableCount: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['pick'])

const handlePick = () => {
  emit('pick')
}
</script>

<style scoped>
.controls {
  display: flex;
  gap: 15px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.btn {
  flex: 1;
  min-width: 150px;
  padding: 16px 24px;
  font-size: 1.1rem;
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
  font-size: 1.3rem;
}

.btn-primary {
  background: linear-gradient(135deg, var(--neon-pink) 0%, var(--neon-purple) 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(255, 0, 110, 0.4);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 0, 110, 0.6);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: var(--bg-card);
  color: var(--neon-blue);
  border: 2px solid var(--neon-blue);
  box-shadow: 0 4px 15px rgba(0, 245, 255, 0.2);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--neon-blue);
  color: var(--bg-dark);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .controls {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    min-width: auto;
  }
}
</style>
