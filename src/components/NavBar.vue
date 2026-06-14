<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const cart = useCartStore()

const navItems = [
  { path: '/', label: '首页' },
  { path: '/products', label: '产品' },
  { path: '/shop', label: '购买', badge: true },
  { path: '/factory', label: '工厂' },
  { path: '/custom', label: '定制' },
  { path: '/contact', label: '联系' },
]

function isActive(path: string): boolean {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

async function handleLogout() {
  await auth.logout()
  router.push('/')
}
</script>

<template>
  <header class="navbar">
    <div class="navbar-inner">
      <router-link to="/" class="brand">
        <img src="/logo.svg" alt="尚品工坊" class="brand-logo" width="140" height="37" />
      </router-link>

      <nav class="nav-links">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-link"
          :class="{ active: isActive(item.path) }"
        >
          {{ item.label }}
          <span v-if="item.badge && cart.totalItems" class="badge">{{ cart.totalItems }}</span>
        </router-link>
      </nav>

      <!-- 认证区域 -->
      <div class="auth-area">
        <template v-if="auth.isLoggedIn">
          <span class="user-name">{{ auth.user?.first_name || auth.user?.username }}</span>
          <button class="auth-btn" @click="handleLogout">退出</button>
        </template>
        <template v-else>
          <router-link to="/login" class="auth-link">登录</router-link>
          <router-link to="/register" class="auth-btn-outline">注册</router-link>
        </template>
      </div>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: #fff;
  border-bottom: 1px solid #eee;
  height: 72px;
}
.navbar-inner {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  height: 100%;
}
.brand {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}
.brand-logo {
  height: 37px;
  width: auto;
  display: block;
}
.nav-links {
  display: flex;
  gap: 0;
}
.nav-link {
  padding: 10px 22px;
  font-size: 14px;
  color: var(--text-light);
  letter-spacing: 2px;
  transition: color 0.3s;
  position: relative;
}
.nav-link::after {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background: var(--gold);
  transition: width 0.3s;
}
.nav-link:hover,
.nav-link.active {
  color: var(--gold);
}
.nav-link:hover::after,
.nav-link.active::after {
  width: 20px;
}
.badge {
  position: absolute;
  top: 2px;
  right: 4px;
  min-width: 18px;
  height: 18px;
  background: #c00;
  color: #fff;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0;
}

/* Auth area */
.auth-area {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}
.user-name {
  font-size: 13px;
  color: var(--text-light);
  letter-spacing: 1px;
}
.auth-link {
  font-size: 13px;
  color: var(--text-light);
  letter-spacing: 2px;
  transition: color 0.3s;
}
.auth-link:hover { color: var(--gold); }
.auth-btn {
  font-size: 12px;
  color: var(--text-muted);
  letter-spacing: 1px;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.3s;
}
.auth-btn:hover { color: #c00; }
.auth-btn-outline {
  padding: 6px 16px;
  font-size: 12px;
  color: var(--gold);
  border: 1px solid var(--gold);
  letter-spacing: 2px;
  transition: all 0.3s;
}
.auth-btn-outline:hover { background: var(--gold); color: #fff; }
</style>
