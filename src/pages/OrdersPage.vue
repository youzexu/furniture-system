<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { API_BASE } from '../api'

interface Order { id: number; code: string; created_at: string; total: string; status: string }

const auth = useAuthStore()
const orders = ref<Order[]>([])
const loading = ref(true)
const showConfirm = ref(false)
const deletingId = ref<number | null>(null)

async function deleteOrder(id: number) {
  deletingId.value = id
  showConfirm.value = true
}

async function confirmDelete() {
  if (!deletingId.value) return
  try {
    await auth.authFetch(`${API_BASE}/api/orders/${deletingId.value}/delete/`, { method: 'DELETE' })
    orders.value = orders.value.filter(o => o.id !== deletingId.value)
  } catch {}
  showConfirm.value = false
  deletingId.value = null
}

onMounted(async () => {
  try {
    const res = await auth.authFetch(`${API_BASE}/api/orders/mine/`)
    const data = await res.json()
    if (data.success) orders.value = data.data
  } catch {}
  loading.value = false
})
</script>

<template>
  <div class="orders-page">
    <section class="page-banner">
      <div>
        <p class="banner-label">ORDERS</p>
        <h1>我的订单</h1>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div v-if="loading" class="state-box"><span>⏳</span><p>加载中...</p></div>
        <div v-else-if="orders.length === 0" class="state-box"><span>📭</span><p>暂无订单</p><router-link to="/shop" class="btn-primary">去购买</router-link></div>
        <div v-else class="order-list">
          <div class="order-card" v-for="o in orders" :key="o.id">
            <div class="order-header">
              <span class="order-id">订单 #{{ o.id }}</span>
              <span class="order-status">{{ o.status }}</span>
            </div>
            <div class="order-items">
              <div class="order-item" v-for="(item, i) in o.items" :key="i">
                <span>{{ item.name }}</span>
                <span>×{{ item.quantity }}</span>
                <span>¥{{ (item.price * item.quantity).toLocaleString() }}</span>
              </div>
            </div>
            <div class="order-footer">
              <span class="order-time">{{ o.created_at }}</span>
              <strong class="order-total">合计 ¥{{ o.total.toLocaleString() }}</strong>
              <button v-if="o.status === '已签收'" class="del-btn" @click="deleteOrder(o.id)">删除</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <Teleport to="body">
      <div v-if="showConfirm" class="prompt-overlay" @click.self="showConfirm = false">
        <div class="prompt-card">
          <span class="prompt-icon">🗑️</span>
          <h3>删除订单</h3>
          <p>确定要删除此订单吗？此操作不可撤销。</p>
          <div class="prompt-actions">
            <button class="btn-danger" @click="confirmDelete">确认删除</button>
            <button class="btn-outline-dark" @click="showConfirm = false">取消</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.orders-page { margin-top: 72px; }
.page-banner { height: 240px; background: var(--dark); display: flex; align-items: center; justify-content: center; text-align: center; color: #fff; }
.banner-label { font-size: 12px; letter-spacing: 6px; color: var(--gold-light); }
.page-banner h1 { font-size: 36px; font-weight: 300; letter-spacing: 8px; font-family: 'Noto Serif SC', serif; margin-top: 8px; }
.section { padding: 60px 0; }
.container { max-width: 860px; margin: 0 auto; padding: 0 40px; }
.state-box { text-align: center; padding: 80px 20px; color: var(--text-muted); }
.state-box span { font-size: 40px; display: block; margin-bottom: 12px; }
.state-box p { font-size: 14px; margin-bottom: 20px; }
.btn-primary { display: inline-block; padding: 12px 32px; background: var(--gold); color: #fff; font-size: 14px; letter-spacing: 3px; }

.order-list { display: flex; flex-direction: column; gap: 20px; }
.order-card { border: 1px solid #eee; }
.order-header { display: flex; justify-content: space-between; padding: 14px 20px; border-bottom: 1px solid #f5f5f5; background: #fafaf8; }
.order-id { font-size: 13px; color: var(--text); letter-spacing: 1px; }
.order-status { font-size: 12px; color: var(--gold); letter-spacing: 2px; }
.order-items { padding: 16px 20px; }
.order-item { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; color: var(--text-light); }
.order-footer { display: flex; justify-content: space-between; align-items: center; padding: 14px 20px; border-top: 1px solid #f5f5f5; }
.order-time { font-size: 12px; color: var(--text-muted); }
.order-total { font-size: 15px; color: var(--gold); }
.del-btn { padding: 6px 16px; background: none; border: 1px solid #eee; color: #bbb; font-size: 12px; cursor: pointer; letter-spacing: 2px; transition: all .3s; font-family: inherit; }
.del-btn:hover { color: #c00; border-color: #fcc; background: #fff5f5; }

.prompt-overlay { position:fixed; inset:0; z-index:300; background:rgba(0,0,0,.45); display:flex; align-items:center; justify-content:center; padding:40px; }
.prompt-card { background:#fff; max-width:400px; width:100%; padding:44px 36px; text-align:center; }
.prompt-icon { font-size:40px; display:block; margin-bottom:16px; }
.prompt-card h3 { font-size:20px; font-weight:400; color:var(--dark); letter-spacing:4px; margin-bottom:10px; font-family:'Noto Serif SC',serif; }
.prompt-card p { font-size:13px; color:var(--text-muted); line-height:1.7; margin-bottom:28px; }
.prompt-actions { display:flex; gap:12px; justify-content:center; }
.btn-danger { padding:12px 28px; background:#c00; color:#fff; border:none; font-size:13px; letter-spacing:2px; cursor:pointer; font-family:inherit; transition:background .3s; }
.btn-danger:hover { background:#a00; }
.btn-outline-dark { padding:12px 28px; border:1px solid #ddd; background:#fff; color:var(--text-light); font-size:13px; letter-spacing:2px; cursor:pointer; font-family:inherit; transition:all .3s; }
.btn-outline-dark:hover { border-color:#333; color:#333; }
</style>
