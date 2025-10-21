<template>
  <header class="header">
    <h1 class="title">
      <span class="title-main">東京午餐</span>
      <span class="title-sub">ランチピッカー</span>
    </h1>
    <p class="subtitle">今天吃什麼呢？</p>
  </header>
</template>

<style scoped>
.header {
  text-align: center;
  margin-bottom: 40px;
  padding-top: 20px;
}

.title {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.title-main {
  font-size: 3rem;
  font-weight: 900;
  background: linear-gradient(135deg, var(--neon-pink) 0%, var(--neon-blue) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 2px;
  animation: glow 2s ease-in-out infinite alternate;
}

.title-sub {
  font-size: 1.2rem;
  color: var(--neon-purple);
  font-weight: 300;
  letter-spacing: 4px;
}

.subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  font-weight: 300;
}

@keyframes glow {
  from {
    filter: drop-shadow(0 0 10px rgba(255, 0, 110, 0.5));
  }
  to {
    filter: drop-shadow(0 0 20px rgba(0, 245, 255, 0.8));
  }
}

@media (max-width: 768px) {
  .title-main {
    font-size: 2.2rem;
  }

  .title-sub {
    font-size: 1rem;
    letter-spacing: 2px;
  }

  .subtitle {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .title-main {
    font-size: 1.8rem;
  }
}
</style>
