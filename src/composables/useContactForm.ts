import { ref, reactive } from 'vue'
import { useAuthStore } from '../stores/auth'

const API_BASE = 'http://127.0.0.1:8000'

export function useContactForm() {
  const auth = useAuthStore()
  const submitted = ref(false)
  const submitting = ref(false)
  const errorMsg = ref('')
  const showLoginPrompt = ref(false)

  const form = reactive({
    name: '', phone: '', company: '', projectType: '', quantity: '', city: '', budget: '', message: '',
  })

  const projectTypes: [string, string][] = [
    ['', '请选择项目类型'], ['full_house', '全屋定制'], ['hotel', '酒店工程'],
    ['showroom', '样板间/售楼处'], ['office', '办公空间'], ['restaurant', '餐饮门店'],
    ['club', '会所/别墅'], ['single', '单件定制'], ['other', '其他'],
  ]
  const budgets: [string, string][] = [
    ['', '请选择预算区间'], ['under_50k', '5万以下'], ['50k_100k', '5-10万'],
    ['100k_300k', '10-30万'], ['300k_500k', '30-50万'], ['500k_1m', '50-100万'],
    ['1m_3m', '100-300万'], ['over_3m', '300万以上'],
  ]
  const quantities: [string, string][] = [
    ['', '请选择预计数量'], ['1-10', '1-10件'], ['10-50', '10-50件'],
    ['50-100', '50-100件'], ['100-500', '100-500件'], ['500+', '500件以上'],
  ]

  async function handleSubmit() {
    if (!auth.isLoggedIn) { showLoginPrompt.value = true; return }
    if (!form.name || !form.phone) return
    submitting.value = true; errorMsg.value = ''
    try {
      const res = await fetch(`${API_BASE}/api/contract/submit/`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact_person: form.name, phone: form.phone, company: form.company,
          project_type: form.projectType, quantity: form.quantity, city: form.city,
          budget: form.budget, description: form.message,
        }),
      })
      const data = await res.json()
      if (data.success) { submitted.value = true; Object.assign(form, { name:'',phone:'',company:'',projectType:'',quantity:'',city:'',budget:'',message:'' }) }
      else errorMsg.value = data.message || '提交失败'
    } catch { errorMsg.value = '网络错误' }
    submitting.value = false
    if (submitted.value) setTimeout(() => { submitted.value = false }, 5000)
  }

  return { form, submitted, submitting, errorMsg, showLoginPrompt, projectTypes, budgets, quantities, handleSubmit }
}
