<script setup lang="ts">
import { ref, onMounted, onUnmounted, onErrorCaptured } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useToastStore } from './stores/toast'
import { API_BASE } from './api'
import { request } from './utils/request'
import NavBar from './components/NavBar.vue'
import AppFooter from './components/AppFooter.vue'

const auth = useAuthStore()
const toast = useToastStore()
const router = useRouter()
const showBackTop = ref(false)
const announcements = ref<{ text: string; link: string }[]>([])
const showAnnounce = ref(false)
const routeError = ref(false)

onErrorCaptured((_err) => {
  routeError.value = true
  return false
})

function onScroll() {
  showBackTop.value = window.scrollY > 400
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  request(`${API_BASE}/api/announcements/`).then(r => r.json()).then(d => {
    if (d.success && d.data.length > 0) { announcements.value = d.data; showAnnounce.value = true }
  }).catch(() => {})
})
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

    <div v-if="showAnnounce" class="announce-bar">
      <span v-for="(a, i) in announcements" :key="i">
        <a v-if="a.link" :href="a.link">{{ a.text }}</a>
        <span v-else>{{ a.text }}</span>
        <span v-if="i < announcements.length - 1" class="announce-sep">｜</span>
      </span>
    </div>

    <!-- Toast notification -->
    <Teleport to="body">
      <div v-if="toast.visible" class="app-toast">{{ toast.message }}</div>
    </Teleport>

    <main class="page-content">
      <div v-if="routeError" class="route-error">
        <span>⚠️</span>
        <p>页面加载失败</p>
        <button class="btn-primary" @click="routeError = false; $router.go(0)">刷新页面</button>
      </div>
      <Suspense v-else>
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
        <template #fallback>
          <div class="route-loading"><span>⏳</span><p>加载中...</p></div>
        </template>
      </Suspense>
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
.expired-overlay {
  position: fixed;
  inset: 0;
  z-index: 999;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.expired-card {
  background: #fff;
  max-width: 380px;
  width: 100%;
  padding: 44px 36px;
  text-align: center;
}

.expired-icon {
  font-size: 40px;
  display: block;
  margin-bottom: 16px;
}

.expired-card h3 {
  font-size: 20px;
  font-weight: 400;
  color: var(--dark);
  letter-spacing: 4px;
  margin-bottom: 10px;
  font-family: 'Noto Serif SC', serif;
}

.expired-card p {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 28px;
}

.btn-primary {
  padding: 12px 32px;
  background: var(--gold);
  color: #fff;
  border: none;
  font-size: 14px;
  letter-spacing: 3px;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.3s;
}

.btn-primary:hover {
  background: #7a5c12;
}

.announce-bar {
  background: #faf7f2;
  text-align: center;
  padding: 8px 20px;
  font-size: 13px;
  color: var(--gold);
  letter-spacing: 2px;
  border-bottom: 1px solid #f0e8d8;
  margin-top: 72px;
}

.announce-bar a {
  color: var(--gold);
}

.announce-sep {
  color: #ddd;
  margin: 0 8px;
}

.back-top {
  position: fixed;
  bottom: 40px;
  right: 40px;
  width: 44px;
  height: 44px;
  background: var(--dark);
  color: #fff;
  border: none;
  font-size: 20px;
  cursor: pointer;
  z-index: 150;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s, opacity 0.3s;
}

.back-top:hover {
  background: var(--gold);
}

.app-toast {
  position: fixed;
  top: 90px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--dark);
  color: #fff;
  padding: 12px 28px;
  font-size: 13px;
  letter-spacing: 3px;
  z-index: 300;
  animation: toastIn .3s ease;
}
@keyframes toastIn {
  from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}

.route-error, .route-loading {
  text-align: center;
  padding: 120px 20px;
  color: var(--text-muted);
}

.route-error span, .route-loading span {
  font-size: 44px;
  display: block;
  margin-bottom: 12px;
}

.route-error p, .route-loading p {
  font-size: 14px;
  margin-bottom: 20px;
}
</style>
