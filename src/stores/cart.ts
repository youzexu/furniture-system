import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface CartItem {
  code: string
  name: string
  price: string
  priceNum: number
  quantity: number
  image?: string
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  const totalItems = computed(() => items.value.reduce((s, i) => s + i.quantity, 0))
  const totalPrice = computed(() => items.value.reduce((s, i) => s + i.priceNum * i.quantity, 0))

  function restore() {
    const saved = localStorage.getItem('cart')
    if (saved) {
      try { items.value = JSON.parse(saved) } catch {}
    }
  }

  function save() {
    localStorage.setItem('cart', JSON.stringify(items.value))
  }

  function addItem(product: { code: string; name: string; price: string; priceNum: number; image?: string }) {
    const existing = items.value.find(i => i.code === product.code)
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({ ...product, quantity: 1 })
    }
    save()
  }

  function removeItem(code: string) {
    items.value = items.value.filter(i => i.code !== code)
    save()
  }

  function setQuantity(code: string, qty: number) {
    if (qty <= 0) {
      removeItem(code)
      return
    }
    const item = items.value.find(i => i.code === code)
    if (item) {
      item.quantity = qty
      save()
    }
  }

  function clear() {
    items.value = []
    save()
  }

  restore()
  return { items, totalItems, totalPrice, addItem, removeItem, setQuantity, clear }
})
