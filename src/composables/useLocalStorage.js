import { ref, watch } from 'vue'

/**
 * Composable for managing localStorage with Vue reactivity
 * @param {string} key - localStorage key
 * @param {*} defaultValue - default value if key doesn't exist
 */
export function useLocalStorage(key, defaultValue) {
  const data = ref(defaultValue)

  // Load from localStorage
  const loadData = () => {
    try {
      const saved = localStorage.getItem(key)
      if (saved) {
        data.value = JSON.parse(saved)
      }
    } catch (error) {
      console.error(`Error loading data from localStorage (${key}):`, error)
    }
  }

  // Save to localStorage
  const saveData = () => {
    try {
      localStorage.setItem(key, JSON.stringify(data.value))
    } catch (error) {
      console.error(`Error saving data to localStorage (${key}):`, error)
    }
  }

  // Initialize
  loadData()

  // Watch for changes and auto-save
  watch(data, saveData, { deep: true })

  return {
    data,
    loadData,
    saveData
  }
}
