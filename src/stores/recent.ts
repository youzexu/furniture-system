import { defineStore } from 'pinia'
import { ref } from 'vue'

interface RecentItem { code: string; name: string }

export const useRecentStore = defineStore('recent', () => {
  const items = ref<RecentItem[]>([])

  function restore() {
    const saved = localStorage.getItem('recentViews')
    if (saved) {
      try { items.value = JSON.parse(saved) } catch {}
    }
  }

  function persist() {
    localStorage.setItem('recentViews', JSON.stringify(items.value))
  }

  function addItem(item: RecentItem) {
    items.value = items.value.filter(r => r.code !== item.code)
    items.value.unshift(item)
    items.value = items.value.slice(0, 5)
    persist()
  }

  function removeItem(code: string) {
    items.value = items.value.filter(r => r.code !== code)
    persist()
  }

  return { items, restore, addItem, removeItem }
})
