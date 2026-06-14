import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const API_BASE = 'http://127.0.0.1:8000'

interface User {
  id: number
  username: string
  first_name: string
  email: string
  is_staff: boolean
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const accessToken = ref<string>('')
  const refreshToken = ref<string>('')

  const isLoggedIn = computed(() => !!accessToken.value && !!user.value)

  // 从 localStorage 恢复
  function restore() {
    const saved = localStorage.getItem('auth')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        accessToken.value = data.access || ''
        refreshToken.value = data.refresh || ''
        user.value = data.user || null
      } catch {}
    }
  }

  function save() {
    localStorage.setItem('auth', JSON.stringify({
      access: accessToken.value,
      refresh: refreshToken.value,
      user: user.value,
    }))
  }

  function clear() {
    accessToken.value = ''
    refreshToken.value = ''
    user.value = null
    localStorage.removeItem('auth')
  }

  async function register(username: string, password: string, first_name: string, email: string) {
    const res = await fetch(`${API_BASE}/api/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, first_name, email }),
    })
    const data = await res.json()
    if (!data.success) throw new Error(data.message)
    accessToken.value = data.access
    refreshToken.value = data.refresh
    user.value = data.user
    save()
    return data
  }

  async function login(username: string, password: string) {
    const res = await fetch(`${API_BASE}/api/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    const data = await res.json()
    if (!data.success) throw new Error(data.message)
    accessToken.value = data.access
    refreshToken.value = data.refresh
    user.value = data.user
    save()
    return data
  }

  async function logout() {
    clear()
  }

  async function refreshAccessToken(): Promise<boolean> {
    if (!refreshToken.value) return false
    try {
      const res = await fetch(`${API_BASE}/api/auth/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken.value }),
      })
      const data = await res.json()
      if (data.success) {
        accessToken.value = data.access
        save()
        return true
      }
    } catch {}
    clear()
    return false
  }

  // 初始化时恢复
  restore()

  return { user, accessToken, refreshToken, isLoggedIn, login, register, logout, refreshAccessToken, restore }
})
