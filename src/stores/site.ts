import { defineStore } from 'pinia'
import { ref } from 'vue'
import { API_BASE } from '../api'
import { request } from '../utils/request'

interface Category { key: string; name: string; desc?: string; image?: string }
interface SiteConfig { hero_title: string; hero_sub: string }

export const useSiteStore = defineStore('site', () => {
  const categories = ref<Category[]>([])
  const siteConfig = ref<SiteConfig | null>(null)
  const lastFetch = ref<Record<string, number>>({})

  function isFresh(key: string, ttl = 10 * 60 * 1000): boolean {
    const ts = lastFetch.value[key] || 0
    return Date.now() - ts < ttl
  }

  async function fetchCategories(force = false) {
    if (!force && categories.value.length > 0 && isFresh('categories')) return
    try {
      const res = await request(`${API_BASE}/api/categories/`)
      const d = await res.json()
      if (d.success) {
        categories.value = d.data
        lastFetch.value.categories = Date.now()
      }
    } catch {}
  }

  async function fetchSiteConfig(force = false) {
    if (!force && siteConfig.value && isFresh('siteConfig')) return
    try {
      const res = await request(`${API_BASE}/api/site-config/`)
      const d = await res.json()
      if (d.success) {
        siteConfig.value = d.data
        lastFetch.value.siteConfig = Date.now()
      }
    } catch {}
  }

  return { categories, siteConfig, fetchCategories, fetchSiteConfig }
})
