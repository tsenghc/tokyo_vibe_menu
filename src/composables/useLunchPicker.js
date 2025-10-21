import { ref, computed } from 'vue'
import { useLocalStorage } from './useLocalStorage'

/**
 * Main composable for lunch picker functionality
 */
export function useLunchPicker() {
  // 餐廳列表
  const restaurants = ref([
    '蝦蝦麵',
    '蛋包飯',
    '魚魚飯',
    '雞雞飯',
    '大眾',
    '車站沾麵',
    '煎餃',
    '漢堡',
    'MDD',
    'KFC',
    '松屋',
    '咖喱飯',
    '義大利麵',
    '餛飩麵',
    '一風堂',
    '味噌拉麵 絆ラーメン',
    '咖啡廳豬排咖喱',
    '咖啡廳法式薄餅',
    '沖繩麵',
    '西餐飯飯',
    '炸豬排'
  ])

  // 狀態
  const currentPick = ref(null)
  const isAnimating = ref(false)
  const excludedRestaurants = ref(new Set())
  const resultIcon = ref('🍱')

  // 歷史記錄 - 使用 localStorage
  const { data: history } = useLocalStorage('lunchPickerHistory', [])

  // 計算可用餐廳
  const availableRestaurants = computed(() => {
    return restaurants.value.filter(r => !excludedRestaurants.value.has(r))
  })

  // 格式化時間
  const formatTime = (timestamp) => {
    const now = new Date()
    const date = new Date(timestamp)
    const diff = now - date

    // 小於1分鐘
    if (diff < 60000) return '剛剛'

    // 小於1小時
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000)
      return `${minutes}分鐘前`
    }

    // 小於1天
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000)
      return `${hours}小時前`
    }

    // 顯示日期時間
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours().toString().padStart(2, '0')
    const minute = date.getMinutes().toString().padStart(2, '0')

    return `${month}/${day} ${hour}:${minute}`
  }

  // 隨機選擇餐廳
  const pickRandomRestaurant = () => {
    return new Promise((resolve) => {
      if (isAnimating.value || availableRestaurants.value.length === 0) {
        resolve(null)
        return
      }

      isAnimating.value = true

      // 動畫參數
      const animationDuration = 2000
      const intervalTime = 100
      const iterations = animationDuration / intervalTime

      let currentIteration = 0
      const interval = setInterval(() => {
        const randomRestaurant = availableRestaurants.value[
          Math.floor(Math.random() * availableRestaurants.value.length)
        ]
        currentPick.value = randomRestaurant

        currentIteration++
        if (currentIteration >= iterations) {
          clearInterval(interval)
          finalizePick(resolve)
        }
      }, intervalTime)
    })
  }

  // 完成選擇
  const finalizePick = (resolve) => {
    // 最終選擇
    const finalPick = availableRestaurants.value[
      Math.floor(Math.random() * availableRestaurants.value.length)
    ]

    currentPick.value = finalPick

    // 添加到歷史記錄
    addToHistory(finalPick)

    // 慶祝效果
    celebrate()

    setTimeout(() => {
      isAnimating.value = false
      resolve(finalPick)
    }, 500)
  }

  // 慶祝效果
  const celebrate = () => {
    const icons = ['🎉', '✨', '🎊', '🌟', '💫']
    resultIcon.value = icons[Math.floor(Math.random() * icons.length)]

    setTimeout(() => {
      resultIcon.value = '🍱'
    }, 2000)
  }

  // 添加到歷史記錄
  const addToHistory = (restaurant) => {
    const timestamp = new Date().toISOString()
    const historyItem = {
      restaurant,
      timestamp,
      displayTime: formatTime(timestamp)
    }

    // 添加到開頭
    history.value.unshift(historyItem)

    // 限制歷史記錄數量
    if (history.value.length > 10) {
      history.value = history.value.slice(0, 10)
    }
  }

  // 清除歷史記錄
  const clearHistory = () => {
    history.value = []
  }

  // 切換餐廳排除狀態
  const toggleRestaurant = (restaurant) => {
    if (excludedRestaurants.value.has(restaurant)) {
      excludedRestaurants.value.delete(restaurant)
    } else {
      // 確保至少保留一個餐廳
      if (availableRestaurants.value.length <= 1) {
        return false
      }
      excludedRestaurants.value.add(restaurant)
    }
    // 觸發響應式更新
    excludedRestaurants.value = new Set(excludedRestaurants.value)
    return true
  }

  // 全選餐廳
  const selectAll = () => {
    excludedRestaurants.value.clear()
    excludedRestaurants.value = new Set()
  }

  // 全不選餐廳
  const deselectAll = () => {
    // 保留一個隨機餐廳
    const keepOne = restaurants.value[
      Math.floor(Math.random() * restaurants.value.length)
    ]

    excludedRestaurants.value = new Set(
      restaurants.value.filter(r => r !== keepOne)
    )
  }

  // 更新歷史記錄的顯示時間
  const updateHistoryTimes = () => {
    history.value.forEach(item => {
      item.displayTime = formatTime(item.timestamp)
    })
  }

  return {
    // 狀態
    restaurants,
    currentPick,
    isAnimating,
    excludedRestaurants,
    resultIcon,
    history,
    availableRestaurants,

    // 方法
    pickRandomRestaurant,
    clearHistory,
    toggleRestaurant,
    selectAll,
    deselectAll,
    formatTime,
    updateHistoryTimes
  }
}
