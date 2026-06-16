import { ref, reactive } from 'vue'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'

const API_BASE = 'http://127.0.0.1:8000'

export function useCheckout() {
  const cart = useCartStore()
  const auth = useAuthStore()
  const step = ref(1)
  const submitting = ref(false)
  const submitted = ref(false)
  const fieldErrors = ref<Record<string, string>>({})

  const orderForm = reactive({
    name: '', phone: '', address: '', city: '', note: ''
  })

  function validateForm(): boolean {
    fieldErrors.value = {}
    if (!orderForm.name.trim()) fieldErrors.value.name = '请填写收货人'
    if (!orderForm.phone.trim()) fieldErrors.value.phone = '请填写联系电话'
    if (!orderForm.city.trim()) fieldErrors.value.city = '请填写城市'
    if (!orderForm.address.trim()) fieldErrors.value.address = '请填写详细地址'
    return Object.keys(fieldErrors.value).length === 0
  }

  function nextStep() {
    if (step.value === 1) { step.value = 2; return }
    if (step.value === 2 && validateForm()) { submitOrder() }
  }

  async function submitOrder() {
    if (!validateForm()) return
    submitting.value = true
    try {
      const res = await auth.authFetch(`${API_BASE}/api/order/submit/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact_person: orderForm.name, phone: orderForm.phone,
          address: orderForm.city + ' ' + orderForm.address,
          note: orderForm.note,
          items: cart.items.map(i => ({ code: i.code, name: i.name, quantity: i.quantity, price: i.priceNum })),
          total: cart.totalPrice,
        }),
      })
      const data = await res.json()
      if (data.success) { submitted.value = true; step.value = 3; cart.clear() }
      else fieldErrors.value._global = data.message || '提交失败'
    } catch { fieldErrors.value._global = '网络错误' }
    submitting.value = false
  }

  function reset() { step.value = 1; submitted.value = false; Object.assign(orderForm, { name:'',phone:'',address:'',city:'',note:'' }) }

  return { step, submitting, submitted, orderForm, fieldErrors, validateForm, nextStep, submitOrder, reset }
}
