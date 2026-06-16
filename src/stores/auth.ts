import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { API_BASE } from '../api'
import { request } from '../utils/request'

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
  const refreshTokenStr = ref<string>('')
  const showExpired = ref(false)

  const isLoggedIn = computed(() => !!accessToken.value && !!user.value)

  // 从 localStorage 恢复
  function restore() {
    const saved = localStorage.getItem('auth')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        accessToken.value = data.access || ''
        refreshTokenStr.value = data.refresh || ''
        user.value = data.user || null
      } catch {}
    }
  }

  function save() {
    localStorage.setItem('auth', JSON.stringify({
      access: accessToken.value,
      refresh: refreshTokenStr.value,
      user: user.value,
    }))
  }

  function clear() {
    accessToken.value = ''
    refreshTokenStr.value = ''
    user.value = null
    localStorage.removeItem('auth')
  }

  async function register(username: string, password: string, first_name: string, email: string) {
    const res = await request(`${API_BASE}/api/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, first_name, email }),
    })
    const data = await res.json()
    if (!data.success) throw new Error(data.message)
    accessToken.value = data.access
    refreshTokenStr.value = data.refresh
    user.value = data.user
    save()
    return data
  }

  async function login(username: string, password: string) {
    const res = await request(`${API_BASE}/api/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    const data = await res.json()
    if (!data.success) throw new Error(data.message)
    accessToken.value = data.access
    refreshTokenStr.value = data.refresh
    user.value = data.user
    save()
    return data
  }

  async function logout() {
    clear()
  }

  async function updateProfile(first_name: string, email: string) {
    await refreshAccessToken()
    const res = await request(`${API_BASE}/api/auth/update/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken.value}`,
      },
      body: JSON.stringify({ first_name, email }),
    })
    const data = await res.json()
    if (!data.success) throw new Error(data.message)
    user.value = data.user
    save()
    return data
  }

  async function refreshAccessToken(): Promise<boolean> {
    if (!refreshTokenStr.value) return false
    try {
      const res = await request(`${API_BASE}/api/auth/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshTokenStr.value }),
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

  async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const doFetch = () => request(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${accessToken.value}`,
      },
    })

    let res = await doFetch()
    if (res.status === 401) {
      const ok = await refreshAccessToken()
      if (ok) {
        res = await doFetch()
      } else {
        showExpired.value = true
        throw new Error('登录已过期')
      }
    }
    return res
  }

  function closeExpired() {
    showExpired.value = false
  }

  // 初始化时恢复
  restore()

  return { user, accessToken, refreshTokenStr, showExpired, isLoggedIn, login, register, logout, updateProfile, authFetch, refreshAccessToken, closeExpired, restore }
})
