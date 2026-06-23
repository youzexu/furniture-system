<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAuthStore } from '../stores/auth'
import { API_BASE } from '../api'

const auth = useAuthStore()
const editing = ref(false)
const saving = ref(false)
const error = ref('')
const success = ref('')

const form = reactive({
  first_name: '',
  email: '',
})

function startEdit() {
  form.first_name = auth.user?.first_name || ''
  form.email = auth.user?.email || ''
  editing.value = true
  error.value = ''
  success.value = ''
}

function cancelEdit() {
  editing.value = false
}

async function saveProfile() {
  saving.value = true
  error.value = ''
  success.value = ''
  try {
    await auth.updateProfile(form.first_name, form.email)
    success.value = '修改成功'
    editing.value = false
  } catch (e: unknown) {
    error.value = e.message || '保存失败'
  }
  saving.value = false
}

const changingPwd = ref(false)
const pwdForm = reactive({ oldPassword: '', newPassword: '', confirm: '' })
const pwdError = ref('')
const pwdSuccess = ref('')
const pwdSaving = ref(false)

async function changePassword() {
  pwdError.value = ''
  pwdSuccess.value = ''
  if (!pwdForm.oldPassword || !pwdForm.newPassword) { pwdError.value = '请填写所有密码字段'; return }
  if (pwdForm.newPassword !== pwdForm.confirm) { pwdError.value = '两次输入不一致'; return }
  if (pwdForm.newPassword.length < 6) { pwdError.value = '新密码至少6位'; return }
  pwdSaving.value = true
  try {
    await auth.authFetch(`${API_BASE}/api/auth/change-password/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ old_password: pwdForm.oldPassword, new_password: pwdForm.newPassword })
    })
    pwdSuccess.value = '密码修改成功'
    pwdForm.oldPassword = pwdForm.newPassword = pwdForm.confirm = ''
    changingPwd.value = false
  } catch {
    pwdError.value = '密码修改失败，请验证原密码'
  }
  pwdSaving.value = false
}
</script>

<template>
  <div class="profile-page">
    <section class="page-banner">
      <div>
        <p class="banner-label">PROFILE</p>
        <h1>个人中心</h1>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div v-if="!auth.isLoggedIn" class="state-box">
          <span>🔒</span>
          <p>请先登录查看个人信息</p>
          <router-link to="/login" class="btn-primary">去登录</router-link>
        </div>

        <div v-else class="profile-content">
          <div class="profile-card">
            <div class="avatar">{{ (auth.user?.first_name || auth.user?.username || 'U')[0] }}</div>
            <h2>{{ auth.user?.first_name || auth.user?.username }}</h2>
            <p class="role">{{ auth.user?.is_staff ? '管理员' : '注册用户' }}</p>
          </div>

          <!-- 展示模式 -->
          <div v-if="!editing" class="info-cards">
            <div class="info-card">
              <div class="info-label">用户名</div>
              <div class="info-value">{{ auth.user?.username }}</div>
            </div>
            <div class="info-card">
              <div class="info-label">姓名</div>
              <div class="info-value">{{ auth.user?.first_name || '未填写' }}</div>
            </div>
            <div class="info-card">
              <div class="info-label">邮箱</div>
              <div class="info-value">{{ auth.user?.email || '未填写' }}</div>
            </div>
            <button class="edit-btn" @click="startEdit">编辑资料</button>
          </div>

          <!-- 编辑模式 -->
          <div v-else class="edit-form">
            <div class="form-group">
              <label>用户名</label>
              <input :value="auth.user?.username" disabled class="disabled" />
            </div>
            <div class="form-group">
              <label>姓名</label>
              <input v-model="form.first_name" type="text" placeholder="请输入您的姓名" />
            </div>
            <div class="form-group">
              <label>邮箱</label>
              <input v-model="form.email" type="email" placeholder="请输入邮箱地址" />
            </div>

            <p v-if="error" class="form-error">{{ error }}</p>
            <p v-if="success" class="form-success">{{ success }}</p>

            <div class="form-actions">
              <button class="btn-primary" @click="saveProfile" :disabled="saving">
                <span v-if="saving" class="spinner"></span>{{ saving ? '保存中' : '保存' }}
              </button>
              <button class="btn-cancel" @click="cancelEdit">取消</button>
            </div>
          </div>

          <!-- 修改密码 -->
          <div v-if="!changingPwd" class="info-cards" style="margin-top:24px">
            <button class="edit-btn" @click="changingPwd = true">修改密码</button>
          </div>
          <div v-else class="edit-form">
            <div class="form-group">
              <label>原密码</label>
              <input v-model="pwdForm.oldPassword" type="password" placeholder="输入原密码" />
            </div>
            <div class="form-group">
              <label>新密码</label>
              <input v-model="pwdForm.newPassword" type="password" placeholder="至少6位" />
            </div>
            <div class="form-group">
              <label>确认新密码</label>
              <input v-model="pwdForm.confirm" type="password" placeholder="再次输入新密码" />
            </div>
            <p v-if="pwdError" class="form-error">{{ pwdError }}</p>
            <p v-if="pwdSuccess" class="form-success">{{ pwdSuccess }}</p>
            <div class="form-actions">
              <button class="btn-primary" @click="changePassword" :disabled="pwdSaving">
                {{ pwdSaving ? '提交中' : '修改密码' }}
              </button>
              <button class="btn-cancel" @click="changingPwd = false; pwdError = ''; pwdSuccess = ''">取消</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.profile-page {
  margin-top: 72px;
}

.page-banner {
  height: 240px;
  background: var(--dark);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #fff;
}

.banner-label {
  font-size: 12px;
  letter-spacing: 6px;
  color: var(--gold-light);
}

.page-banner h1 {
  font-size: 36px;
  font-weight: 300;
  letter-spacing: 8px;
  font-family: 'Noto Serif SC', serif;
  margin-top: 8px;
}

.section {
  padding: 60px 0;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 40px;
}

.state-box {
  text-align: center;
  padding: 80px 20px;
  color: var(--text-muted);
}

.state-box span {
  font-size: 40px;
  display: block;
  margin-bottom: 12px;
}

.state-box p {
  font-size: 14px;
  margin-bottom: 20px;
}

.btn-primary {
  display: inline-block;
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

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-cancel {
  padding: 12px 32px;
  border: 1px solid #ddd;
  background: #fff;
  color: var(--text-light);
  font-size: 14px;
  letter-spacing: 2px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.3s;
}

.btn-cancel:hover {
  border-color: #333;
}

.profile-content {
  text-align: center;
}

.profile-card {
  margin-bottom: 40px;
}

.avatar {
  width: 80px;
  height: 80px;
  background: var(--gold);
  color: #fff;
  font-size: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.profile-card h2 {
  font-size: 24px;
  font-weight: 400;
  letter-spacing: 4px;
  color: var(--dark);
  font-family: 'Noto Serif SC', serif;
}

.role {
  font-size: 12px;
  color: var(--text-muted);
  letter-spacing: 2px;
  margin-top: 4px;
}

.info-cards {
  text-align: left;
  border: 1px solid #eee;
  margin-bottom: 32px;
}

.info-card {
  display: flex;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #f5f5f5;
}

.info-card:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 13px;
  color: var(--text-muted);
  letter-spacing: 1px;
}

.info-value {
  font-size: 14px;
  color: var(--text);
}

.edit-btn {
  margin-top: 16px;
  padding: 8px 28px;
  border: 1px solid var(--gold);
  background: #fff;
  color: var(--gold);
  font-size: 13px;
  letter-spacing: 2px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.3s;
}

.edit-btn:hover {
  background: var(--gold);
  color: #fff;
}

.edit-form {
  text-align: left;
  border: 1px solid #eee;
  padding: 24px;
  margin-bottom: 32px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

.form-group label {
  font-size: 13px;
  color: var(--text);
  letter-spacing: 1px;
}

.form-group input {
  padding: 12px 14px;
  border: 1px solid #ddd;
  font-size: 14px;
  color: var(--text);
  outline: none;
  font-family: inherit;
  transition: border-color 0.3s;
}

.form-group input:focus {
  border-color: var(--gold);
}

.form-group input.disabled {
  background: #f5f5f5;
  color: #999;
}

.form-error {
  color: #c00;
  font-size: 13px;
  margin-bottom: 12px;
}

.form-success {
  color: #27ae60;
  font-size: 13px;
  margin-bottom: 12px;
}

.form-actions {
  display: flex;
  gap: 12px;
}

.profile-actions {
  display: flex;
  justify-content: center;
}

.action-link {
  padding: 12px 32px;
  border: 1px solid #eee;
  font-size: 14px;
  color: var(--text);
  letter-spacing: 2px;
  transition: all 0.3s;
}

.action-link:hover {
  border-color: var(--gold);
  color: var(--gold);
}
</style>
