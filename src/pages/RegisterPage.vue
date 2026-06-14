<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const first_name = ref('')
const email = ref('')
const showPwd = ref(false)
const error = ref('')
const fieldErrors = ref<Record<string, string>>({})
const loading = ref(false)
const touched = ref<Record<string, boolean>>({})

const pwStrength = computed(() => {
  const pw = password.value
  if (!pw) return { level: 0, label: '', color: '' }
  let score = 0
  if (pw.length >= 6) score++
  if (pw.length >= 10) score++
  if (/[a-zA-Z]/.test(pw) && /[0-9]/.test(pw)) score++
  if (/[^a-zA-Z0-9]/.test(pw)) score++
  const map = [
    { level: 1, label: '弱', color: '#c00' },
    { level: 2, label: '较弱', color: '#e67e22' },
    { level: 3, label: '中等', color: '#f0a500' },
    { level: 4, label: '强', color: '#27ae60' },
  ]
  return score <= 0 ? map[0] : map[Math.min(score - 1, 3)]
})

function markTouched(field: string) {
  touched.value[field] = true
  validateField(field)
}

function validateField(field: string) {
  fieldErrors.value[field] = ''
  if (field === 'username' && !username.value.trim() && touched.value.username) {
    fieldErrors.value.username = '请输入用户名'
  }
  if (field === 'password' && touched.value.password) {
    if (!password.value) fieldErrors.value.password = '请输入密码'
    else if (password.value.length < 6) fieldErrors.value.password = '密码至少 6 位'
  }
  if (field === 'confirmPassword' && touched.value.confirmPassword) {
    if (!confirmPassword.value) fieldErrors.value.confirmPassword = '请确认密码'
    else if (confirmPassword.value !== password.value) fieldErrors.value.confirmPassword = '两次密码不一致'
  }
}

const formValid = computed(() =>
  username.value.trim() && password.value.length >= 6 && confirmPassword.value === password.value
)

async function handleRegister() {
  error.value = ''
  markTouched('username')
  markTouched('password')
  markTouched('confirmPassword')
  if (!formValid.value) return

  loading.value = true
  try {
    await auth.register(username.value.trim(), password.value, first_name.value.trim(), email.value.trim())
    loading.value = false
    router.push('/')
  } catch (e: any) {
    loading.value = false
    error.value = e.message || '注册失败'
  }
}
</script>

<template>
  <div class="register-page">
    <!-- 左侧品牌区 -->
    <div class="register-hero">
      <div class="hero-overlay">
        <router-link to="/" class="hero-brand">
          <span class="hero-icon">◆</span>
          <h1>尚品工坊</h1>
          <p>家具源头工厂 · 高端定制专家</p>
        </router-link>
        <div class="hero-features">
          <div class="hero-feat">
            <span class="feat-icon">✦</span>
            <span>注册即享专属客服对接</span>
          </div>
          <div class="hero-feat">
            <span class="feat-icon">✦</span>
            <span>新品上线优先通知</span>
          </div>
          <div class="hero-feat">
            <span class="feat-icon">✦</span>
            <span>定制需求快速响应</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧表单区 -->
    <div class="register-form-side">
      <div class="form-container">
        <div class="form-header">
          <h2>创建账号</h2>
          <p>注册尚品工坊，开启专属家居定制之旅</p>
        </div>

        <form @submit.prevent="handleRegister" class="auth-form" novalidate>
          <!-- 用户名 -->
          <div class="field" :class="{ error: fieldErrors.username, focused: touched.username }">
            <label>用户名 <span class="required">*</span></label>
            <div class="input-wrap">
              <span class="input-icon">👤</span>
              <input
                v-model="username" type="text"
                placeholder="4-20 位字母或数字"
                autocomplete="username"
                @blur="markTouched('username')"
                @input="validateField('username')"
              />
            </div>
            <p v-if="fieldErrors.username" class="field-error">{{ fieldErrors.username }}</p>
          </div>

          <!-- 密码 -->
          <div class="field" :class="{ error: fieldErrors.password, focused: touched.password }">
            <label>密码 <span class="required">*</span></label>
            <div class="input-wrap">
              <span class="input-icon">🔒</span>
              <input
                v-model="password"
                :type="showPwd ? 'text' : 'password'"
                placeholder="至少 6 位，建议包含字母和数字"
                autocomplete="new-password"
                @blur="markTouched('password')"
                @input="validateField('password')"
              />
              <button type="button" class="pwd-toggle" @click="showPwd = !showPwd" tabindex="-1">
                {{ showPwd ? '🙈' : '👁' }}
              </button>
            </div>
            <div v-if="password" class="pw-meter">
              <div class="pw-bar"><div :style="{ width: pwStrength.level * 25 + '%', background: pwStrength.color }"></div></div>
              <span :style="{ color: pwStrength.color }">密码强度：{{ pwStrength.label }}</span>
            </div>
            <p v-if="fieldErrors.password" class="field-error">{{ fieldErrors.password }}</p>
          </div>

          <!-- 确认密码 -->
          <div class="field" :class="{ error: fieldErrors.confirmPassword, focused: touched.confirmPassword }">
            <label>确认密码 <span class="required">*</span></label>
            <div class="input-wrap">
              <span class="input-icon">🔒</span>
              <input
                v-model="confirmPassword"
                type="password"
                placeholder="再次输入密码"
                autocomplete="new-password"
                @blur="markTouched('confirmPassword')"
                @input="validateField('confirmPassword')"
              />
            </div>
            <p v-if="fieldErrors.confirmPassword" class="field-error">{{ fieldErrors.confirmPassword }}</p>
          </div>

          <!-- 姓名 -->
          <div class="field">
            <label>姓名</label>
            <div class="input-wrap">
              <span class="input-icon">📝</span>
              <input v-model="first_name" type="text" placeholder="请输入您的姓名（选填）" />
            </div>
          </div>

          <!-- 邮箱 -->
          <div class="field">
            <label>邮箱</label>
            <div class="input-wrap">
              <span class="input-icon">📧</span>
              <input v-model="email" type="email" placeholder="请输入邮箱地址（选填）" autocomplete="email" />
            </div>
          </div>

          <p v-if="error" class="global-error">{{ error }}</p>

          <button type="submit" class="submit-btn" :disabled="loading || !formValid">
            <span v-if="loading" class="spinner"></span>
            {{ loading ? '注册中' : '注 册' }}
          </button>
        </form>

        <p class="switch-link">
          已有账号？<router-link to="/login">立即登录 →</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-page {
  display: flex;
  min-height: 100vh;
  margin-top: 72px;
}

/* ======== 左侧品牌区 ======== */
.register-hero {
  flex: 1;
  background: linear-gradient(135deg, #2c1810 0%, #1a1a1a 50%, #3d2b1f 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}
.register-hero::before {
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
.feat-icon { color: var(--gold-light); }

/* ======== 右侧表单区 ======== */
.register-form-side {
  flex: 1.15;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  padding: 60px;
}
.form-container {
  width: 100%;
  max-width: 460px;
}
.form-header {
  margin-bottom: 36px;
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
.auth-form { display: flex; flex-direction: column; gap: 18px; }
.field { display: flex; flex-direction: column; gap: 5px; }
.field label {
  font-size: 13px;
  color: var(--text);
  letter-spacing: 2px;
  transition: color 0.3s;
}
.field.focused label { color: var(--gold); }
.field.error label { color: #c00; }
.required { color: #c00; margin-left: 2px; }

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
  padding: 13px 0;
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

/* 密码强度 */
.pw-meter { margin-top: 6px; }
.pw-bar {
  height: 3px;
  background: #eee;
  margin-bottom: 4px;
}
.pw-bar div {
  height: 100%;
  transition: width 0.3s, background 0.3s;
}
.pw-meter span {
  font-size: 11px;
  letter-spacing: 1px;
}

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
  margin-top: 4px;
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
  margin-top: 28px;
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
  .register-page { flex-direction: column; }
  .register-hero { min-height: 220px; }
  .hero-overlay { padding: 30px 20px; }
  .hero-brand h1 { font-size: 24px; letter-spacing: 6px; }
  .hero-features { margin-top: 24px; gap: 10px; }
  .hero-feat { font-size: 12px; }
  .register-form-side { padding: 40px 24px; }
}
</style>
