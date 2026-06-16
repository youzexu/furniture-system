<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import { useReveal } from '../composables/useReveal'
import { useAuthStore } from '../stores/auth'

const { addReveal } = useReveal()
const visible = ref(false)
const submitted = ref(false)
const submitting = ref(false)
const errorMsg = ref('')
import { API_BASE } from '../api'
const auth = useAuthStore()
const showLoginPrompt = ref(false)

onMounted(() => { setTimeout(() => visible.value = true, 100) })

const form = reactive({
  name: '',
  phone: '',
  company: '',
  projectType: '',
  quantity: '',
  city: '',
  budget: '',
  message: '',
})

const projectTypes: [string, string][] = [
  ['', '请选择项目类型'],
  ['full_house', '全屋定制'],
  ['hotel', '酒店工程'],
  ['showroom', '样板间/售楼处'],
  ['office', '办公空间'],
  ['restaurant', '餐饮门店'],
  ['club', '会所/别墅'],
  ['single', '单件定制'],
  ['other', '其他'],
]
const budgets: [string, string][] = [
  ['', '请选择预算区间'],
  ['under_50k', '5万以下'],
  ['50k_100k', '5-10万'],
  ['100k_300k', '10-30万'],
  ['300k_500k', '30-50万'],
  ['500k_1m', '50-100万'],
  ['1m_3m', '100-300万'],
  ['over_3m', '300万以上'],
]
const quantities: [string, string][] = [
  ['', '请选择预计数量'],
  ['1-10', '1-10件'],
  ['10-50', '10-50件'],
  ['50-100', '50-100件'],
  ['100-500', '100-500件'],
  ['500+', '500件以上'],
]

async function handleSubmit() {
  if (!auth.isLoggedIn) {
    showLoginPrompt.value = true
    return
  }
  if (!form.name || !form.phone) return
  if (!/^1[3-9]\d{9}$/.test(form.phone.trim())) {
    errorMsg.value = '请输入正确的手机号码'
    return
  }
  submitting.value = true
  errorMsg.value = ''

  try {
    const res = await auth.authFetch(`${API_BASE}/api/contract/submit/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contact_person: form.name,
        phone: form.phone,
        company: form.company,
        project_type: form.projectType,
        quantity: form.quantity,
        city: form.city,
        budget: form.budget,
        description: form.message,
      }),
    })
    const data = await res.json()
    if (data.success) {
      submitted.value = true
      // 清空表单
      form.name = ''; form.phone = ''; form.company = ''
      form.projectType = ''; form.quantity = ''; form.city = ''
      form.budget = ''; form.message = ''
    } else {
      errorMsg.value = data.message || '提交失败'
    }
  } catch {
    errorMsg.value = '网络错误，请稍后重试'
  }
  submitting.value = false
  if (submitted.value) setTimeout(() => { submitted.value = false }, 5000)
}
</script>

<template>
  <div class="page-fade" :class="{ show: visible }">

    <!-- Banner -->
    <section class="page-banner">
      <div>
        <p class="banner-label">CONTACT</p>
        <h1>联系我们</h1>
        <p class="banner-sub">期待与您共创传世之作</p>
      </div>
    </section>

    <section class="section reveal" :ref="addReveal">
      <div class="container">
        <div class="contact-grid">

          <!-- 左侧：联系信息 -->
          <div class="contact-info">
            <h2>尚品工坊</h2>
            <p class="info-subtitle">家具制造有限公司</p>
            <p class="info-desc">源头工厂 · 高端定制 · 品质保证</p>

            <div class="info-section">
              <h4>公司总部</h4>
              <div class="info-row">
                <img src="/contact/dizhi.svg" alt="地址" class="info-icon" />
                <span>广东省佛山市顺德区龙江镇工业大道 188 号</span>
              </div>
              <div class="info-row">
                <img src="/contact/dianhua.svg" alt="电话" class="info-icon" />
                <div>
                  <p>400-888-6688（全国服务热线）</p>
                  <p>+86-757-2388-6688（国际贸易部）</p>
                </div>
              </div>
              <div class="info-row">
                <img src="/contact/youjian.svg" alt="邮箱" class="info-icon" />
                <div>
                  <p>info@shangpin.com（业务咨询）</p>
                  <p>hr@shangpin.com（人才招聘）</p>
                </div>
              </div>
              <div class="info-row">
                <img src="/contact/zhongbiao.svg" alt="营业时间" class="info-icon" />
                <div>
                  <p>周一至周六 8:00 - 18:00</p>
                  <p>周日及法定节假日休息</p>
                </div>
              </div>
            </div>

            <div class="info-section">
              <h4>展厅地址</h4>
              <div class="info-row">
                <img src="/contact/loufang.svg" alt="展厅" class="info-icon" />
                <div>
                  <p>罗浮宫国际家具博览中心 3 楼 C15-C18</p>
                  <p>深圳国际艺展中心 MALL 2 楼 B23</p>
                </div>
              </div>
              <p class="info-note">欢迎预约参观，我们将安排专人接待讲解</p>
            </div>

            <div class="info-section">
              <h4>关注我们</h4>
              <div class="social-links">
                <span>微信公众号：尚品工坊</span>
                <span>小红书：尚品工坊家具定制</span>
                <span>抖音：尚品工坊官方账号</span>
              </div>
            </div>
          </div>

          <!-- 右侧：表单 -->
          <div class="contact-form-wrapper">
            <h3>在线咨询</h3>
            <p class="form-subtitle">留下您的需求信息，专属顾问将在 <strong>一个工作日</strong> 内与您联系</p>

            <div v-if="submitted" class="form-success">
              <div class="success-icon"><span>✓</span></div>
              <h3>提交成功</h3>
              <p>感谢您的咨询！我们的专属顾问将在一个工作日内与您联系，请保持电话畅通。</p>
            </div>

            <form v-else @submit.prevent="handleSubmit" class="contact-form" novalidate>
              <div class="form-group">
                <label>联系人 <span class="required">*</span></label>
                <input v-model="form.name" type="text" placeholder="请输入您的姓名" required />
              </div>

              <div class="form-group">
                <label>联系电话 <span class="required">*</span></label>
                <input v-model="form.phone" type="tel" placeholder="请输入您的手机号码" required />
              </div>

              <div class="form-group">
                <label>公司 / 品牌</label>
                <input v-model="form.company" type="text" placeholder="公司名称或个人品牌（选填）" />
              </div>

              <div class="form-row">
                <div class="form-group half">
                  <label>项目类型</label>
                  <select v-model="form.projectType">
                    <option v-for="[k, v] in projectTypes" :key="k" :value="k">{{ v }}</option>
                  </select>
                </div>
                <div class="form-group half">
                  <label>预计数量</label>
                  <select v-model="form.quantity">
                    <option v-for="[k, v] in quantities" :key="k" :value="k">{{ v }}</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group half">
                  <label>交付城市</label>
                  <input v-model="form.city" type="text" placeholder="例如：上海" />
                </div>
                <div class="form-group half">
                  <label>预算区间</label>
                  <select v-model="form.budget">
                    <option v-for="[k, v] in budgets" :key="k" :value="k">{{ v }}</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label>需求说明</label>
                <textarea v-model="form.message" rows="5" placeholder="请描述您的具体需求：空间类型、风格偏好、材质要求、特殊工艺等（选填）"></textarea>
              </div>

              <p v-if="errorMsg" class="form-error">{{ errorMsg }}</p>
              <button type="submit" class="submit-btn" :disabled="submitting || !form.name || !form.phone">
                <span v-if="submitting" class="spinner"></span>
                {{ submitting ? '提交中' : '提交咨询' }}
              </button>

              <p class="form-note">* 我们承诺对您的信息严格保密，仅用于业务沟通</p>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- 地图 -->
    <section class="map-section">
      <div class="map-placeholder">
        <div>
          <img src="/contact/dizhi.svg" alt="地址" class="map-icon" />
          <p>广东省佛山市顺德区龙江镇工业大道 188 号</p>
          <p class="map-sub">广佛江珠高速龙江出口 5 分钟车程 | 广州白云机场 60 分钟车程</p>
        </div>
      </div>
    </section>

    <!-- 登录提示 -->
    <Teleport to="body">
      <div v-if="showLoginPrompt" class="prompt-overlay" @click.self="showLoginPrompt = false">
        <div class="prompt-card">
          <span class="prompt-icon">🔒</span>
          <h3>请先登录</h3>
          <p>登录后即可提交咨询，我们将在一个工作日内与您联系</p>
          <div class="prompt-actions">
            <router-link to="/login" class="btn-primary">去登录</router-link>
            <router-link to="/register" class="btn-outline-dark">注册账号</router-link>
          </div>
          <button class="prompt-close" @click="showLoginPrompt = false">暂不登录，继续浏览</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
/* Contact Grid */
.contact-grid { display: flex; gap: 80px; align-items: flex-start; }
.contact-info { flex: 1; }
.contact-info h2 { font-size: 32px; font-weight: 300; letter-spacing: 6px; color: var(--dark); font-family: 'Noto Serif SC', serif; }
.info-subtitle { font-size: 14px; color: var(--text-muted); letter-spacing: 2px; margin-top: 4px; }
.info-desc { font-size: 14px; color: var(--gold); margin-top: 16px; letter-spacing: 2px; }

.info-section { margin-top: 36px; padding-top: 28px; border-top: 1px solid #eee; }
.info-section h4 { font-size: 13px; color: var(--gold); letter-spacing: 3px; margin-bottom: 16px; text-transform: uppercase; }
.info-row { display: flex; gap: 12px; margin-bottom: 14px; font-size: 14px; color: var(--text-light); align-items: center; }
.info-icon { flex-shrink: 0; width: 20px; height: 20px; }
.info-row p { margin-bottom: 2px; }
.info-note { font-size: 12px; color: var(--text-muted); margin-top: 8px; letter-spacing: 1px; }
.social-links span { display: block; font-size: 13px; color: var(--text-light); margin-bottom: 6px; }

/* Form */
.contact-form-wrapper { flex: 1.2; background: #fff; padding: 50px 40px; border: 1px solid #eee; }
.contact-form-wrapper h3 { font-size: 24px; font-weight: 400; color: var(--dark); letter-spacing: 4px; }
.form-subtitle { font-size: 13px; color: var(--text-muted); margin: 10px 0 36px; line-height: 1.6; }

.contact-form { display: flex; flex-direction: column; gap: 22px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group.half { flex: 1; }
.form-group label { font-size: 13px; color: var(--text); letter-spacing: 1px; }
.required { color: #c00; }
.form-row { display: flex; gap: 16px; }

input, select, textarea {
  padding: 12px 14px;
  border: 1px solid #ddd;
  font-size: 14px;
  color: var(--text);
  background: #fff;
  outline: none;
  transition: border-color 0.3s;
}
input:focus, select:focus, textarea:focus { border-color: var(--gold); }
input::placeholder, textarea::placeholder { color: #ccc; }
select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
}
textarea { resize: vertical; }
.submit-btn {
  padding: 16px 40px;
  background: var(--gold);
  color: #fff;
  border: none;
  font-size: 15px;
  letter-spacing: 4px;
  cursor: pointer;
  transition: background 0.3s;
  align-self: flex-start;
}
.submit-btn:hover:not(:disabled) { background: #7a5c12; }
.submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; display: inline-block; vertical-align: middle; margin-right: 6px; animation: spin .7s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }
.form-note { font-size: 11px; color: #bbb; letter-spacing: 1px; margin-top: 4px; }
.form-error { color: #c00; font-size: 13px; margin-top: 4px; }

.form-success { text-align: center; padding: 40px 20px; animation: fadeInUp .5s ease; }
.success-icon { width: 64px; height: 64px; margin: 0 auto 20px; background: var(--gold); display: flex; align-items: center; justify-content: center; }
.success-icon span { font-size: 32px; color: #fff; animation: scaleCheck .4s ease .2s both; }
.form-success h3 { font-size: 20px; margin-bottom: 12px; }
.form-success p { font-size: 14px; color: var(--text-light); line-height: 1.8; }
@keyframes fadeInUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
@keyframes scaleCheck { from { transform:scale(0); } to { transform:scale(1); } }

/* Map */
.map-section { background: #f5f0e8; }
.map-placeholder {
  height: 380px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: linear-gradient(135deg, #e8e0d5, #d5c9b5);
  color: var(--gold);
}
.map-icon { width: 20px; height: 20px; display: block; }
.map-placeholder p { font-size: 15px; letter-spacing: 2px; }
.map-sub { font-size: 13px !important; color: #999 !important; margin-top: 6px !important; }

@media (max-width: 768px) {
  .contact-grid { flex-direction: column; }
  .form-row { flex-direction: column; }
  .contact-form-wrapper { padding: 30px 20px; }
}

/* Login Prompt */
.prompt-overlay { position: fixed; inset: 0; z-index: 220; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; padding: 40px; }
.prompt-card { background: #fff; max-width: 400px; width: 100%; padding: 44px 36px; text-align: center; }
.prompt-icon { font-size: 40px; display: block; margin-bottom: 16px; }
.prompt-card h3 { font-size: 20px; font-weight: 400; color: var(--dark); letter-spacing: 4px; margin-bottom: 10px; font-family: 'Noto Serif SC', serif; }
.prompt-card p { font-size: 13px; color: var(--text-muted); line-height: 1.7; margin-bottom: 28px; }
.prompt-actions { display: flex; gap: 12px; justify-content: center; margin-bottom: 16px; }
.prompt-close { background: none; border: none; font-size: 12px; color: #bbb; cursor: pointer; letter-spacing: 1px; transition: color 0.3s; font-family: inherit; }
.prompt-close:hover { color: #666; }
</style>
