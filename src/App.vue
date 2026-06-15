<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import NavBar from './components/NavBar.vue'
import AppFooter from './components/AppFooter.vue'

const auth = useAuthStore()
const router = useRouter()
const showBackTop = ref(false)

function onScroll() {
  showBackTop.value = window.scrollY > 400
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

function goLogin() {
  auth.closeExpired()
  router.push('/login')
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="app-wrapper">
    <NavBar />
    <main class="page-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <AppFooter />

    <!-- 返回顶部 -->
    <button v-if="showBackTop" class="back-top" @click="scrollToTop">↑</button>

    <!-- 登录过期提示 -->
    <Teleport to="body">
      <div v-if="auth.showExpired" class="expired-overlay">
        <div class="expired-card">
          <span class="expired-icon">🔒</span>
          <h3>登录已过期</h3>
          <p>请重新登录后继续操作</p>
          <button class="btn-primary" @click="goLogin">去登录</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.expired-overlay { position: fixed; inset: 0; z-index: 999; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; padding: 40px; }
.expired-card { background: #fff; max-width: 380px; width: 100%; padding: 44px 36px; text-align: center; }
.expired-icon { font-size: 40px; display: block; margin-bottom: 16px; }
.expired-card h3 { font-size: 20px; font-weight: 400; color: var(--dark); letter-spacing: 4px; margin-bottom: 10px; font-family: 'Noto Serif SC', serif; }
.expired-card p { font-size: 13px; color: var(--text-muted); margin-bottom: 28px; }
.btn-primary { padding: 12px 32px; background: var(--gold); color: #fff; border: none; font-size: 14px; letter-spacing: 3px; cursor: pointer; font-family: inherit; transition: background 0.3s; }
.btn-primary:hover { background: #7a5c12; }
.back-top { position: fixed; bottom: 40px; right: 40px; width: 44px; height: 44px; background: var(--dark); color: #fff; border: none; font-size: 20px; cursor: pointer; z-index: 150; display: flex; align-items: center; justify-content: center; transition: background 0.3s, opacity 0.3s; }
.back-top:hover { background: var(--gold); }
</style>
