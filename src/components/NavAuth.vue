<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()
const showLogoutConfirm = ref(false)

async function confirmLogout() {
  await auth.logout()
  showLogoutConfirm.value = false
  router.push('/')
}
</script>

<template>
  <div class="auth-area">
    <template v-if="auth.isLoggedIn">
      <router-link to="/orders" class="orders-btn" title="我的订单">📋</router-link>
      <router-link to="/profile" class="user-name">{{ auth.user?.first_name || auth.user?.username }}</router-link>
      <template v-if="!showLogoutConfirm">
        <button class="auth-btn" @click="showLogoutConfirm = true">退出</button>
      </template>
      <template v-else>
        <span class="logout-confirm-text">确定退出？</span>
        <button class="auth-btn-yes" @click="confirmLogout">退出</button>
        <button class="auth-btn-no" @click="showLogoutConfirm = false">取消</button>
      </template>
    </template>
    <template v-else>
      <router-link to="/login" class="auth-link">登录</router-link>
      <router-link to="/register" class="auth-btn-outline">注册</router-link>
    </template>
  </div>
</template>

<style scoped>
.auth-area { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
.user-name { font-size: 13px; color: var(--text-light); letter-spacing: 1px; }
.auth-btn { font-size: 12px; color: var(--text-muted); letter-spacing: 1px; background: none; border: none; cursor: pointer; transition: color .3s; font-family: inherit; }
.auth-btn:hover { color: #c00; }
.auth-link { font-size: 13px; color: var(--text-light); letter-spacing: 2px; transition: color .3s; }
.auth-link:hover { color: var(--gold); }
.auth-btn-outline { padding: 6px 16px; font-size: 12px; color: var(--gold); border: 1px solid var(--gold); letter-spacing: 2px; transition: all .3s; }
.auth-btn-outline:hover { background: var(--gold); color: #fff; }
.orders-btn { display: inline-flex; align-items: center; justify-content: center; width: 42px; height: 36px; border: 1px solid #eee; font-size: 16px; color: var(--text); transition: all .3s; margin-right: 4px; }
.orders-btn:hover { border-color: var(--gold); color: var(--gold); }
.logout-confirm-text { font-size: 12px; color: var(--text-muted); letter-spacing: 1px; }
.auth-btn-yes { font-size: 11px; padding: 4px 10px; background: #c00; color: #fff; border: none; cursor: pointer; font-family: inherit; letter-spacing: 1px; }
.auth-btn-yes:hover { background: #a00; }
.auth-btn-no { font-size: 11px; padding: 4px 10px; background: none; border: 1px solid #ddd; color: var(--text-muted); cursor: pointer; font-family: inherit; letter-spacing: 1px; }
.auth-btn-no:hover { border-color: #999; color: #666; }
</style>
