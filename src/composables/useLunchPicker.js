import { ref, computed } from 'vue'
import { useLocalStorage } from './useLocalStorage'

/**
 * Main composable for lunch picker functionality with oil level tracking
 */
export function useLunchPicker() {
  // 餐廳列表（帶油度指標）
  const restaurantData = ref([
    // 0油 - 清淡健康
    { name: '蛋包飯', oilLevel: 0 },
    { name: '魚魚飯', oilLevel: 0 },
    { name: '雞雞飯', oilLevel: 0 },

    // 1油 - 中等油度
    { name: 'MDD', oilLevel: 1 },
    { name: '咖啡廳豬排咖喱', oilLevel: 1 },
    { name: '車站沾麵', oilLevel: 1 },
    { name: '蝦蝦麵', oilLevel: 1 },
    { name: '味噌拉麵 絆ラーメン', oilLevel: 1 },
    { name: '一風堂', oilLevel: 1 },
    { name: '義大利麵', oilLevel: 1 },
    { name: '沖繩麵', oilLevel: 1 },

    // 2油 - 高油度
    { name: '大眾', oilLevel: 2 },
    { name: '餛飩麵', oilLevel: 2 },
    { name: '炸豬排', oilLevel: 2 },
    { name: 'KFC', oilLevel: 2 },
    { name: '煎餃', oilLevel: 2 },
    { name: '漢堡', oilLevel: 2 },
    { name: '松屋', oilLevel: 2 },
    { name: '咖喱飯', oilLevel: 2 },
    { name: '咖啡廳法式薄餅', oilLevel: 2 },
    { name: '西餐飯飯', oilLevel: 2 }
  ])

  // 狀態
  const currentPick = ref(null)
  const isAnimating = ref(false)
  const excludedRestaurants = ref(new Set())
  const resultIcon = ref('🍱')
  const oilFilterEnabled = ref(true) // 油度過濾開關

  // 歷史記錄（用於展示）- 使用 localStorage
  const { data: history } = useLocalStorage('lunchPickerHistory', [])

  // 已食用記錄（用於油度計算）- 使用 localStorage
  const { data: consumedMeals } = useLocalStorage('consumedMeals', [])

  // 油度限制常數
  const OIL_LIMIT_DAYS = 2  // 2天內
  const MAX_OIL_LEVEL = 3   // 最大油度

  // 獲取餐廳油度
  const getOilLevel = (restaurantName) => {
    const restaurant = restaurantData.value.find(r => r.name === restaurantName)
    return restaurant ? restaurant.oilLevel : 0
  }

  // 獲取油度圖標
  const getOilIcon = (oilLevel) => {
    const icons = {
      0: '🥗',  // 清淡
      1: '🍜',  // 中等
      2: '🍗'   // 高油
    }
    return icons[oilLevel] || '🍱'
  }

  // 獲取油度文字
  const getOilText = (oilLevel) => {
    const texts = {
      0: '清淡',
      1: '中等',
      2: '重油'
    }
    return texts[oilLevel] || '未知'
  }

  // 計算指定天數內的總油度
  const calculateOilInDays = (days) => {
    const now = new Date()
    const cutoffTime = now.getTime() - (days * 24 * 60 * 60 * 1000)

    return consumedMeals.value
      .filter(meal => new Date(meal.timestamp).getTime() > cutoffTime)
      .reduce((total, meal) => total + (meal.oilLevel || 0), 0)
  }

  // 檢查是否可以吃某個餐廳（基於油度限制）
  const canEatRestaurant = (restaurantName) => {
    if (!oilFilterEnabled.value) return true

    const restaurantOilLevel = getOilLevel(restaurantName)
    const currentOilInPeriod = calculateOilInDays(OIL_LIMIT_DAYS)

    return (currentOilInPeriod + restaurantOilLevel) <= MAX_OIL_LEVEL
  }

  // 計算當前可用餐廳（考慮排除和油度）
  const availableRestaurants = computed(() => {
    return restaurantData.value
      .filter(r => !excludedRestaurants.value.has(r.name))
      .filter(r => canEatRestaurant(r.name))
      .map(r => r.name)
  })

  // 獲取當前油度狀態
  const oilStatus = computed(() => {
    const currentOil = calculateOilInDays(OIL_LIMIT_DAYS)
    const remaining = MAX_OIL_LEVEL - currentOil
    return {
      current: currentOil,
      max: MAX_OIL_LEVEL,
      remaining: Math.max(0, remaining),
      percentage: (currentOil / MAX_OIL_LEVEL) * 100
    }
  })

  // 獲取因油度被過濾的餐廳
  const oilFilteredRestaurants = computed(() => {
    if (!oilFilterEnabled.value) return []

    return restaurantData.value
      .filter(r => !excludedRestaurants.value.has(r.name))
      .filter(r => !canEatRestaurant(r.name))
      .map(r => ({
        name: r.name,
        oilLevel: r.oilLevel,
        willExceed: calculateOilInDays(OIL_LIMIT_DAYS) + r.oilLevel
      }))
  })

  // 格式化時間
  const formatTime = (timestamp) => {
    const now = new Date()
    const date = new Date(timestamp)
    const diff = now - date

    if (diff < 60000) return '剛剛'

    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000)
      return `${minutes}分鐘前`
    }

    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000)
      return `${hours}小時前`
    }

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
    const finalPick = availableRestaurants.value[
      Math.floor(Math.random() * availableRestaurants.value.length)
    ]

    currentPick.value = finalPick

    // 添加到歷史記錄
    addToHistory(finalPick)

    // 添加到已食用記錄（用於油度計算）
    addToConsumed(finalPick)

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

  // 添加到歷史記錄（顯示用）
  const addToHistory = (restaurant) => {
    const timestamp = new Date().toISOString()
    const oilLevel = getOilLevel(restaurant)

    const historyItem = {
      restaurant,
      timestamp,
      displayTime: formatTime(timestamp),
      oilLevel,
      oilIcon: getOilIcon(oilLevel),
      oilText: getOilText(oilLevel)
    }

    history.value.unshift(historyItem)

    if (history.value.length > 10) {
      history.value = history.value.slice(0, 10)
    }
  }

  // 添加到已食用記錄（油度計算用）
  const addToConsumed = (restaurant) => {
    const timestamp = new Date().toISOString()
    const oilLevel = getOilLevel(restaurant)

    const consumedItem = {
      restaurant,
      timestamp,
      oilLevel
    }

    consumedMeals.value.unshift(consumedItem)

    // 保留最近7天的記錄即可
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
    consumedMeals.value = consumedMeals.value.filter(
      meal => new Date(meal.timestamp).getTime() > sevenDaysAgo
    )
  }

  // 手動添加已食用記錄
  const manualAddConsumed = (restaurant, date = new Date()) => {
    const oilLevel = getOilLevel(restaurant)

    const consumedItem = {
      restaurant,
      timestamp: date.toISOString(),
      oilLevel
    }

    consumedMeals.value.unshift(consumedItem)
    consumedMeals.value.sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  }

  // 刪除已食用記錄
  const removeConsumed = (index) => {
    consumedMeals.value.splice(index, 1)
  }

  // 清除歷史記錄
  const clearHistory = () => {
    history.value = []
  }

  // 清除已食用記錄
  const clearConsumed = () => {
    consumedMeals.value = []
  }

  // 切換餐廳排除狀態
  const toggleRestaurant = (restaurant) => {
    if (excludedRestaurants.value.has(restaurant)) {
      excludedRestaurants.value.delete(restaurant)
    } else {
      const availableCount = restaurantData.value
        .filter(r => !excludedRestaurants.value.has(r.name))
        .filter(r => canEatRestaurant(r.name))
        .length

      if (availableCount <= 1) {
        return false
      }
      excludedRestaurants.value.add(restaurant)
    }
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
    const available = restaurantData.value
      .filter(r => canEatRestaurant(r.name))
      .map(r => r.name)

    if (available.length === 0) return

    const keepOne = available[Math.floor(Math.random() * available.length)]

    excludedRestaurants.value = new Set(
      restaurantData.value.map(r => r.name).filter(name => name !== keepOne)
    )
  }

  // 切換油度過濾
  const toggleOilFilter = () => {
    oilFilterEnabled.value = !oilFilterEnabled.value
  }

  // 更新歷史記錄的顯示時間
  const updateHistoryTimes = () => {
    history.value.forEach(item => {
      item.displayTime = formatTime(item.timestamp)
    })
  }

  return {
    // 狀態
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

    // 方法
    pickRandomRestaurant,
    clearHistory,
    clearConsumed,
    toggleRestaurant,
    selectAll,
    deselectAll,
    formatTime,
    updateHistoryTimes,
    getOilLevel,
    getOilIcon,
    getOilText,
    canEatRestaurant,
    calculateOilInDays,
    manualAddConsumed,
    removeConsumed,
    toggleOilFilter
  }
}
