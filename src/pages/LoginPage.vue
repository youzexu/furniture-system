<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const username = ref('')
const password = ref('')
const showPwd = ref(false)
const error = ref('')
const fieldErrors = ref<Record<string, string>>({})
const loading = ref(false)
const touched = ref<Record<string, boolean>>({})

function validateField(field: string) {
  fieldErrors.value[field] = ''
  if (field === 'username' && !username.value.trim()) {
    if (touched.value.username) fieldErrors.value.username = '请输入用户名'
  }
  if (field === 'password' && !password.value) {
    if (touched.value.password) fieldErrors.value.password = '请输入密码'
  }
}

function markTouched(field: string) {
  touched.value[field] = true
  validateField(field)
}

const isValid = computed(() => username.value.trim() && password.value)

async function handleLogin() {
  error.value = ''
  if (!isValid.value) {
    markTouched('username')
    markTouched('password')
    return
  }
  loading.value = true
  try {
    await auth.login(username.value.trim(), password.value)
    loading.value = false
    const redirect = (route.query.redirect as string) || '/'
    router.push(redirect)
  } catch (e: unknown) {
    loading.value = false
    error.value = e.message || '用户名或密码错误'
  }
}
</script>

<template>
  <div class="login-page">
    <!-- 左侧品牌区 -->
    <div class="login-hero">
      <div class="hero-overlay">
        <router-link to="/" class="hero-brand">
          <span class="hero-icon">◆</span>
          <h1>尚品工坊</h1>
          <p>家具源头工厂 · 高端定制专家</p>
        </router-link>
        <div class="hero-features">
          <div class="hero-feat">
            <span class="feat-icon">✓</span>
            <span>23 年行业深耕</span>
          </div>
          <div class="hero-feat">
            <span class="feat-icon">✓</span>
            <span>30,000㎡ 智造基地</span>
          </div>
          <div class="hero-feat">
            <span class="feat-icon">✓</span>
            <span>200+ 资深匠人</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧表单区 -->
    <div class="login-form-side">
      <div class="form-container">
        <div class="form-header">
          <h2>欢迎回来</h2>
          <p>登录您的尚品工坊账号</p>
        </div>

        <form @submit.prevent="handleLogin" class="auth-form" novalidate>
          <!-- 用户名 -->
          <div class="field" :class="{ error: fieldErrors.username, focused: touched.username }">
            <label>用户名</label>
            <div class="input-wrap">
              <span class="input-icon">👤</span>
              <input
                v-model="username"
                type="text"
                placeholder="请输入用户名"
                autocomplete="username"
                @blur="markTouched('username')"
                @input="validateField('username')"
              />
            </div>
            <p v-if="fieldErrors.username" class="field-error">{{ fieldErrors.username }}</p>
          </div>

          <!-- 密码 -->
          <div class="field" :class="{ error: fieldErrors.password, focused: touched.password }">
            <label>密码</label>
            <div class="input-wrap">
              <span class="input-icon">🔒</span>
              <input
                v-model="password"
                :type="showPwd ? 'text' : 'password'"
                placeholder="请输入密码"
                autocomplete="current-password"
                @blur="markTouched('password')"
                @input="validateField('password')"
              />
              <button type="button" class="pwd-toggle" @click="showPwd = !showPwd" tabindex="-1">
                {{ showPwd ? '🙈' : '👁' }}
              </button>
            </div>
            <p v-if="fieldErrors.password" class="field-error">{{ fieldErrors.password }}</p>
          </div>

          <!-- 全局错误 -->
          <p v-if="error" class="global-error">{{ error }}</p>

          <button type="submit" class="submit-btn" :disabled="loading || !isValid">
            <span v-if="loading" class="spinner"></span>
            {{ loading ? '登录中' : '登 录' }}
          </button>
        </form>

        <p class="switch-link">
          没有账号？<router-link to="/register">立即注册 →</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  min-height: 100vh;
  margin-top: 72px;
}

/* ======== 左侧品牌区 ======== */
.login-hero {
  flex: 1;
  background: linear-gradient(135deg, #1a1a1a 0%, #2c1810 50%, #3d2b1f 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}
.login-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 30% 50%, rgba(139,105,20,0.15) 0%, transparent 60%);
}
.hero-overlay {
  position: relative;
  z-index: 1;
  text-align: center;
  color: #fff;
  padding: 60px;
}
.hero-brand { color: #fff; display: block; }
.hero-brand h1 {
  font-size: 36px;
  font-weight: 300;
  letter-spacing: 10px;
  font-family: 'Noto Serif SC', serif;
  margin: 16px 0 8px;
}
.hero-brand p {
  font-size: 13px;
  color: rgba(255,255,255,0.5);
  letter-spacing: 3px;
}
.hero-icon { font-size: 28px; color: var(--gold-light); }
.hero-features {
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
}
.hero-feat {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: rgba(255,255,255,0.6);
  letter-spacing: 2px;
}
.feat-icon { color: var(--gold-light); font-weight: bold; }

/* ======== 右侧表单区 ======== */
.login-form-side {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  padding: 60px;
}
.form-container {
  width: 100%;
  max-width: 420px;
}
.form-header {
  margin-bottom: 40px;
}
.form-header h2 {
  font-size: 28px;
  font-weight: 300;
  letter-spacing: 6px;
  color: var(--dark);
  font-family: 'Noto Serif SC', serif;
}
.form-header p {
  font-size: 13px;
  color: var(--text-muted);
  letter-spacing: 1px;
  margin-top: 8px;
}

/* 表单 */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.field { display: flex; flex-direction: column; gap: 6px; }
.field label {
  font-size: 13px;
  color: var(--text);
  letter-spacing: 2px;
  transition: color 0.3s;
}
.field.focused label { color: var(--gold); }
.field.error label { color: #c00; }

.input-wrap {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  transition: border-color 0.3s;
}
.field.focused .input-wrap { border-color: var(--gold); }
.field.error .input-wrap { border-color: #c00; }

.input-icon {
  padding: 0 12px;
  font-size: 14px;
  opacity: 0.5;
  flex-shrink: 0;
}

.input-wrap input {
  flex: 1;
  padding: 14px 0;
  border: none;
  font-size: 14px;
  color: var(--text);
  outline: none;
  background: transparent;
  font-family: inherit;
}
.input-wrap input::placeholder { color: #ccc; }

.pwd-toggle {
  padding: 0 14px;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  opacity: 0.4;
  transition: opacity 0.3s;
}
.pwd-toggle:hover { opacity: 0.8; }

.field-error {
  font-size: 12px;
  color: #c00;
  letter-spacing: 1px;
}
.global-error {
  padding: 10px 14px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #c00;
  font-size: 13px;
  letter-spacing: 1px;
  text-align: center;
}

.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  background: var(--gold);
  color: #fff;
  border: none;
  font-size: 15px;
  letter-spacing: 6px;
  cursor: pointer;
  transition: background 0.3s;
  font-family: inherit;
}
.submit-btn:hover:not(:disabled) { background: #7a5c12; }
.submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.switch-link {
  margin-top: 32px;
  text-align: center;
  font-size: 13px;
  color: var(--text-muted);
}
.switch-link a {
  color: var(--gold);
  letter-spacing: 1px;
  transition: opacity 0.3s;
}
.switch-link a:hover { opacity: 0.7; }

@media (max-width: 768px) {
  .login-page { flex-direction: column; }
  .login-hero { min-height: 240px; }
  .hero-overlay { padding: 40px 20px; }
  .hero-brand h1 { font-size: 26px; letter-spacing: 6px; }
  .hero-features { margin-top: 30px; }
  .login-form-side { padding: 40px 24px; }
}
</style>
