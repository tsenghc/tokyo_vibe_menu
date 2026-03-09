import { ref, computed } from 'vue'
import { useLocalStorage } from './useLocalStorage'

/**
 * Composable for healthy menu picker (好吃超市健康轉盤)
 */
export function useHealthyPicker() {
  const menuItems = ref([
    { name: '好吃超市烤蔬菜雞胸' },
    { name: '烤地瓜' },
    { name: '生菜沙拉（玉米）' },
    { name: '生菜沙拉（馬鈴薯火腿）' },
    { name: '越南春捲（鮭魚或蝦）' },
    { name: '胡麻菠菜' },
    { name: '豆腐湯' },
    { name: '雞胸肉' },
    { name: '涼拌冬粉' },
    { name: '烤雞肉（檸檬、照燒）' }
  ])

  const currentPick = ref(null)
  const isAnimating = ref(false)
  const excludedItems = ref(new Set())
  const resultIcon = ref('🥗')

  const { data: history } = useLocalStorage('healthyPickerHistory', [])

  const availableItems = computed(() => {
    return menuItems.value
      .filter(item => !excludedItems.value.has(item.name))
      .map(item => item.name)
  })

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

  const pickRandom = () => {
    return new Promise((resolve) => {
      if (isAnimating.value || availableItems.value.length === 0) {
        resolve(null)
        return
      }

      isAnimating.value = true

      const animationDuration = 2000
      const intervalTime = 100
      const iterations = animationDuration / intervalTime

      let currentIteration = 0
      const interval = setInterval(() => {
        currentPick.value = availableItems.value[
          Math.floor(Math.random() * availableItems.value.length)
        ]

        currentIteration++
        if (currentIteration >= iterations) {
          clearInterval(interval)
          finalizePick(resolve)
        }
      }, intervalTime)
    })
  }

  const finalizePick = (resolve) => {
    const finalPick = availableItems.value[
      Math.floor(Math.random() * availableItems.value.length)
    ]

    currentPick.value = finalPick
    addToHistory(finalPick)
    celebrate()

    setTimeout(() => {
      isAnimating.value = false
      resolve(finalPick)
    }, 500)
  }

  const celebrate = () => {
    const icons = ['🎉', '✨', '🎊', '🌟', '💫']
    resultIcon.value = icons[Math.floor(Math.random() * icons.length)]
    setTimeout(() => {
      resultIcon.value = '🥗'
    }, 2000)
  }

  const addToHistory = (item) => {
    const timestamp = new Date().toISOString()
    history.value.unshift({
      restaurant: item,
      timestamp,
      displayTime: formatTime(timestamp),
      oilIcon: '🥗',
      oilLevel: 0,
      oilText: '健康'
    })

    if (history.value.length > 10) {
      history.value = history.value.slice(0, 10)
    }
  }

  const toggleItem = (itemName) => {
    if (excludedItems.value.has(itemName)) {
      excludedItems.value.delete(itemName)
    } else {
      if (availableItems.value.length <= 1) return false
      excludedItems.value.add(itemName)
    }
    excludedItems.value = new Set(excludedItems.value)
    return true
  }

  const selectAll = () => {
    excludedItems.value = new Set()
  }

  const deselectAll = () => {
    if (menuItems.value.length === 0) return
    const keepOne = menuItems.value[Math.floor(Math.random() * menuItems.value.length)].name
    excludedItems.value = new Set(
      menuItems.value.map(item => item.name).filter(name => name !== keepOne)
    )
  }

  const clearHistory = () => {
    history.value = []
  }

  const updateHistoryTimes = () => {
    history.value.forEach(item => {
      item.displayTime = formatTime(item.timestamp)
    })
  }

  return {
    menuItems,
    currentPick,
    isAnimating,
    excludedItems,
    resultIcon,
    history,
    availableItems,
    pickRandom,
    toggleItem,
    selectAll,
    deselectAll,
    clearHistory,
    updateHistoryTimes,
    formatTime
  }
}
