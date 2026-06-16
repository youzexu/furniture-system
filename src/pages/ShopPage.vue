<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useReveal } from '../composables/useReveal'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import { useCheckout } from '../composables/useCheckout'

const { addReveal } = useReveal()
import { API_BASE } from '../api'

function productImageSrc(p: { image?: string; code: string }): string {
  return p.image ? API_BASE + p.image : '/images/shop/' + p.code + '.svg'
}

function onImgError(e: Event, code: string) {
  const img = e.target as HTMLImageElement
  const fallback = '/images/shop/' + code + '.svg'
  if (img.src && !img.src.includes(fallback)) {
    img.src = fallback
  }
}

const cart = useCartStore()
const auth = useAuthStore()
const showCheckout = ref(false)
const showLoginPrompt = ref(false)
const showClearConfirm = ref(false)
const toastMsg = ref('')
const toastTimer = ref<ReturnType<typeof setTimeout> | null>(null)

function showToast(msg: string) {
  toastMsg.value = msg
  if (toastTimer.value) clearTimeout(toastTimer.value)
  toastTimer.value = setTimeout(() => toastMsg.value = '', 2000)
}

function addToCart(p: Product) {
  if (!requireLogin()) return
  cart.addItem({ code: p.code, name: p.name, price: p.price, priceNum: p.priceNum, image: p.image })
  showToast('已加入购物车')
}

function requireLogin(): boolean {
  if (!auth.isLoggedIn) {
    showLoginPrompt.value = true
    return false
  }
  return true
}

function confirmClear() {
  cart.clear()
  showClearConfirm.value = false
}

interface Product {
  code: string; name: string; cat: string; shop_cat: string; material: string
  price: string; priceNum: number; desc: string; tag?: string; image: string
}

const products = ref<Product[]>([])
const loading = ref(true)
const loadError = ref(false)
const catLabels: Record<string, string> = { living: '客厅', dining: '餐厅', bedroom: '卧室', study: '书房', office: '办公' }
const cats = ref<{ key: string; label: string }[]>([{ key: 'all', label: '全部' }])

async function fetchCategories() {
  try {
    const res = await fetch(`${API_BASE}/api/shop-categories/`)
    const data = await res.json()
    if (data.success) {
      cats.value = [{ key: 'all', label: '全部' }, ...data.data.map((c: any) => ({ key: c.key, label: c.name }))]
    }
  } catch {}
}
const activeCat = ref('all')
const searchQuery = ref('')
let debounceTimer: ReturnType<typeof setTimeout>

function onSearch() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {}, 600)
}

const filtered = computed(() => {
  let result = activeCat.value === 'all' ? products.value : products.value.filter(p => p.shop_cat === activeCat.value)
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(p =>
      p.name.includes(q) || p.material.includes(q) || p.desc.includes(q) || p.code.toLowerCase().includes(q)
    )
  }
  return result
})
const selectedProduct = ref<Product | null>(null)

async function loadProducts() {
  loading.value = true
  loadError.value = false
  try {
    const res = await fetch(`${API_BASE}/api/products/`)
    if (!res.ok) throw new Error('HTTP ' + res.status)
    const data = await res.json()
    if (data.success && data.data?.length > 0) {
      products.value = data.data
    }
  } catch {
    loadError.value = true
  }
  loading.value = false
}


onMounted(loadProducts)
fetchCategories()

// NavBar 购物车「去结算」触发
watch(() => cart.pendingCheckout, (val) => {
  if (val) {
    showCheckout.value = true
    cart.clearPendingCheckout()
  }
})

// 结算逻辑
const { step, submitting, submitted, orderForm, fieldErrors, nextStep } = useCheckout()
</script>

<template>
  <div class="shop-page">
    <!-- Banner -->
    <section class="page-banner">
      <div>
        <p class="banner-label">SHOP</p>
        <h1>成品购买</h1>
        <p class="banner-sub">精选成品 · 现货速发 · 全国配送</p>
      </div>
    </section>

    <div class="shop-layout">
      <!-- Toast -->
      <div v-if="toastMsg" class="toast">{{ toastMsg }}</div>
      <!-- 左侧：产品列表 -->
      <section class="shop-main reveal" :ref="addReveal">
        <div class="filter-bar">
          <button v-for="c in cats" :key="c.key" :class="{ active: activeCat === c.key }" @click="activeCat = c.key">{{
            c.label }}</button>
        </div>

        <div class="search-bar">
          <input v-model="searchQuery" type="text" placeholder="搜索产品..." @input="onSearch" />
        </div>

        <!-- 加载中 -->
        <div v-if="loading" class="state-box">
          <span class="state-icon">⏳</span>
          <p>正在加载商品...</p>
        </div>

        <!-- 加载失败 -->
        <div v-else-if="loadError" class="state-box">
          <span class="state-icon">⚠️</span>
          <p>商品加载失败</p>
          <button class="retry-btn" @click="loadProducts()">重试</button>
        </div>

        <!-- 产品列表 -->
        <div v-else class="product-grid">
          <div v-if="filtered.length === 0" class="state-box" style="grid-column:1/-1">
            <span class="state-icon">📭</span>
            <p>该分类暂无商品</p>
          </div>
          <div class="product-card" v-for="p in filtered" :key="p.code" @click="selectedProduct = p">
            <div class="product-img">
              <img :src="productImageSrc(p)" :alt="p.name" class="product-image" loading="lazy"
                @error="e => onImgError(e, p.code)" />
              <span v-if="p.tag" class="product-tag">{{ p.tag }}</span>
            </div>
            <div class="product-body">
              <h3>{{ p.name }}</h3>
              <p class="product-material">{{ p.material }}</p>
              <p class="product-desc">{{ p.desc }}</p>
              <div class="product-footer">
                <span class="price">{{ p.price }}</span>
                <button class="add-btn" @click.stop="addToCart(p)">加入购物车</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 产品详情弹窗 -->
        <Teleport to="body">
          <div v-if="selectedProduct" class="detail-overlay" @click.self="selectedProduct = null">
            <div class="detail-modal">
              <button class="detail-close" @click="selectedProduct = null">✕</button>
              <div class="detail-grid">
                <div class="detail-image">
                  <img :src="productImageSrc(selectedProduct!)" :alt="selectedProduct!.name" class="detail-img"
                    loading="lazy" @error="e => onImgError(e, selectedProduct!.code)" />
                </div>
                <div class="detail-info">
                  <p class="detail-code">{{ selectedProduct.code }}</p>
                  <h2>{{ selectedProduct.name }}</h2>
                  <p class="detail-desc">{{ selectedProduct.desc }}</p>
                  <div class="detail-table">
                    <div class="d-row"><span>材质</span><span>{{ selectedProduct.material }}</span></div>
                    <div class="d-row"><span>分类</span><span>{{ catLabels[selectedProduct.cat] || selectedProduct.cat
                    }}</span></div>
                    <div class="d-row"><span>价格</span><span class="gold">{{ selectedProduct.price }}</span></div>
                  </div>
                  <div class="detail-actions">
                    <button class="btn-primary" @click="addToCart(selectedProduct!); selectedProduct = null">
                      加入购物车
                    </button>
                    <button class="btn-outline-dark" @click="selectedProduct = null">继续浏览</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Teleport>
      </section>
    </div>

    <!-- 底部结算栏 -->
    <div v-if="cart.totalItems > 0" class="checkout-bar">
      <div class="checkout-bar-inner">
        <span>已选 <strong>{{ cart.totalItems }}</strong> 件</span>
        <strong class="cb-total">¥{{ cart.totalPrice.toLocaleString() }}</strong>
        <button class="cb-btn" @click="requireLogin() && (showCheckout = true)">去结算</button>
      </div>
    </div>

    <!-- 结算弹窗 -->
    <Teleport to="body">
      <div v-if="showCheckout" class="modal-overlay" @click.self="showCheckout = false">
        <div class="modal-content">
          <button class="modal-close" @click="showCheckout = false; step = 1">✕</button>

          <!-- 步骤指示器 -->
          <div class="step-indicator" v-if="!submitted">
            <div class="step-item" :class="{ active: step >= 1, done: step > 1 }">
              <span class="step-num">1</span>
              <span class="step-label">确认订单</span>
            </div>
            <div class="step-line" :class="{ done: step > 1 }"></div>
            <div class="step-item" :class="{ active: step >= 2 }">
              <span class="step-num">2</span>
              <span class="step-label">填写信息</span>
            </div>
          </div>

          <!-- Step 1: 订单确认 -->
          <div v-if="step === 1">
            <h2>确认订单</h2>
            <p class="step-desc">请核对您选购的商品</p>

            <div class="order-review">
              <div class="review-item" v-for="item in cart.items" :key="item.code">
                <img :src="productImageSrc(item)" :alt="item.name" class="review-img"
                  @error="e => onImgError(e, item.code)" />
                <div class="review-info">
                  <h4>{{ item.name }}</h4>
                  <span class="review-price">{{ item.price }}</span>
                </div>
                <div class="review-qty">
                  <button @click="cart.setQuantity(item.code, item.quantity - 1)"
                    :disabled="item.quantity <= 1">−</button>
                  <span>{{ item.quantity }}</span>
                  <button @click="cart.setQuantity(item.code, item.quantity + 1)">+</button>
                </div>
                <div class="review-subtotal">¥{{ (item.priceNum * item.quantity).toLocaleString() }}</div>
                <button class="review-del" @click="cart.removeItem(item.code)">✕</button>
              </div>
            </div>

            <div class="price-breakdown">
              <div class="price-row"><span>商品小计</span><span>¥{{ cart.totalPrice.toLocaleString() }}</span></div>
              <div class="price-row"><span>配送费</span><span class="free">免运费</span></div>
              <div class="price-row total"><span>应付总额</span><strong>¥{{ cart.totalPrice.toLocaleString() }}</strong>
              </div>
            </div>

            <div class="step-actions">
              <button class="btn-outline" @click="showCheckout = false; step = 1">返回选购</button>
              <button class="btn-primary" @click="nextStep">下一步：填写收货信息</button>
            </div>
          </div>

          <!-- Step 2: 收货信息 -->
          <div v-if="step === 2">
            <h2>收货信息</h2>
            <p class="step-desc">请填写收货人及配送信息</p>

            <form @submit.prevent="nextStep" class="info-form">
              <div class="form-row">
                <div class="form-group flex-1">
                  <label>收货人 <span class="req">*</span></label>
                  <input v-model="orderForm.name" type="text" placeholder="姓名" :class="{ err: fieldErrors.name }" />
                  <span v-if="fieldErrors.name" class="f-err">{{ fieldErrors.name }}</span>
                </div>
                <div class="form-group flex-1">
                  <label>联系电话 <span class="req">*</span></label>
                  <input v-model="orderForm.phone" type="tel" placeholder="手机号码" :class="{ err: fieldErrors.phone }" />
                  <span v-if="fieldErrors.phone" class="f-err">{{ fieldErrors.phone }}</span>
                </div>
              </div>

              <div class="form-group">
                <label>城市 <span class="req">*</span></label>
                <input v-model="orderForm.city" type="text" placeholder="例如：深圳市" :class="{ err: fieldErrors.city }" />
                <span v-if="fieldErrors.city" class="f-err">{{ fieldErrors.city }}</span>
              </div>

              <div class="form-group">
                <label>详细地址 <span class="req">*</span></label>
                <input v-model="orderForm.address" type="text" placeholder="街道、门牌号等"
                  :class="{ err: fieldErrors.address }" />
                <span v-if="fieldErrors.address" class="f-err">{{ fieldErrors.address }}</span>
              </div>

              <div class="form-group">
                <label>备注</label>
                <textarea v-model="orderForm.note" rows="3" placeholder="如有特殊要求请在此说明（选填）"></textarea>
              </div>

              <p v-if="fieldErrors._global" class="global-err">{{ fieldErrors._global }}</p>

              <div class="step-actions">
                <button type="button" class="btn-outline" @click="step = 1">返回修改订单</button>
                <button type="submit" class="btn-primary" :disabled="submitting">
                  <span v-if="submitting" class="spinner"></span>
                  {{ submitting ? '提交中' : '确认下单 · ¥' + cart.totalPrice.toLocaleString() }}
                </button>
              </div>
            </form>
          </div>

          <!-- Step 3: 成功 -->
          <div v-if="step === 3" class="success-state">
            <div class="success-badge">
              <span>✓</span>
            </div>
            <h2>下单成功</h2>
            <p class="success-desc">感谢您的订购！我们的客服将在 <strong>24 小时内</strong>与您联系确认订单详情。</p>
            <div class="success-info">
              <div class="si-row"><span>订单编号</span><strong>#{{ submitted ? 'SP' + Date.now().toString(36).toUpperCase()
                : '' }}</strong></div>
              <div class="si-row"><span>应付金额</span><strong>¥{{ cart.totalPrice.toLocaleString() }}</strong></div>
            </div>
            <button class="btn-primary" @click="submitted = false; showCheckout = false; step = 1">继续购物</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 登录提示 -->
    <Teleport to="body">
      <div v-if="showLoginPrompt" class="prompt-overlay" @click.self="showLoginPrompt = false">
        <div class="prompt-card">
          <span class="prompt-icon">🔒</span>
          <h3>请先登录</h3>
          <p>登录后即可购买成品家具，享受专属服务</p>
          <div class="prompt-actions">
            <router-link to="/login" class="btn-primary">去登录</router-link>
            <router-link to="/register" class="btn-outline-dark">注册账号</router-link>
          </div>
          <button class="prompt-close" @click="showLoginPrompt = false">暂不登录，继续浏览</button>
        </div>
      </div>
    </Teleport>

    <!-- 清空购物车确认 -->
    <Teleport to="body">
      <div v-if="showClearConfirm" class="prompt-overlay" @click.self="showClearConfirm = false">
        <div class="prompt-card">
          <span class="prompt-icon">🗑️</span>
          <h3>清空购物车</h3>
          <p>确定要移除购物车中所有商品吗？此操作不可撤销。</p>
          <div class="prompt-actions">
            <button class="btn-danger" @click="confirmClear">确认清空</button>
            <button class="btn-outline-dark" @click="showClearConfirm = false">取消</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.shop-page {
  margin-top: 72px;
}

.page-banner {
  height: 280px;
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
  margin-bottom: 8px;
}

.page-banner h1 {
  font-size: 40px;
  font-weight: 300;
  letter-spacing: 8px;
  font-family: 'Noto Serif SC', serif;
}

.banner-sub {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 2px;
  margin-top: 8px;
}

.shop-layout {
  display: flex;
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px;
  gap: 30px;
}

.shop-main {
  flex: 1;
  min-width: 0;
}

.filter-bar {
  display: flex;
  gap: 1px;
  background: #eee;
  margin-bottom: 30px;
}

.filter-bar button {
  padding: 10px 22px;
  background: #fff;
  border: none;
  font-size: 13px;
  color: #666;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-bar button.active,
.filter-bar button:hover {
  background: var(--gold);
  color: #fff;
}

.state-box {
  text-align: center;
  padding: 80px 20px;
  color: var(--text-muted);
}

.state-icon {
  font-size: 40px;
  display: block;
  margin-bottom: 12px;
}

.state-box p {
  font-size: 14px;
}

.retry-btn {
  margin-top: 16px;
  padding: 8px 24px;
  border: 1px solid var(--gold);
  background: #fff;
  color: var(--gold);
  font-size: 13px;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s;
  font-family: inherit;
}

.retry-btn:hover {
  background: var(--gold);
  color: #fff;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: #eee;
}

.product-card {
  animation: cardIn .5s ease both;
}

.product-card:nth-child(1) {
  animation-delay: .05s;
}

.product-card:nth-child(2) {
  animation-delay: .1s;
}

.product-card:nth-child(3) {
  animation-delay: .15s;
}

.product-card:nth-child(4) {
  animation-delay: .2s;
}

.product-card:nth-child(5) {
  animation-delay: .25s;
}

.product-card:nth-child(6) {
  animation-delay: .3s;
}

.product-card:nth-child(7) {
  animation-delay: .35s;
}

.product-card:nth-child(8) {
  animation-delay: .4s;
}

.product-card:nth-child(9) {
  animation-delay: .45s;
}

.product-card:nth-child(10) {
  animation-delay: .5s;
}

.product-card:nth-child(11) {
  animation-delay: .55s;
}

.product-card:nth-child(12) {
  animation-delay: .6s;
}

.product-card:nth-child(13) {
  animation-delay: .65s;
}

.product-card:nth-child(14) {
  animation-delay: .7s;
}

.product-card:nth-child(15) {
  animation-delay: .75s;
}

.product-card:nth-child(16) {
  animation-delay: .8s;
}

@keyframes cardIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.product-card:hover {
  background: #fafaf8;
}

.product-img {
  aspect-ratio: 3/2;
  background: var(--bg-warm);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.product-tag {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 3px 8px;
  background: var(--gold);
  color: #fff;
  font-size: 10px;
  letter-spacing: 1px;
}

.product-body {
  padding: 14px;
}

.product-body h3 {
  font-size: 13px;
  color: var(--dark);
  letter-spacing: 1px;
}

.product-material {
  font-size: 11px;
  color: #999;
  margin: 4px 0;
}

.product-desc {
  font-size: 11px;
  color: #bbb;
  margin-bottom: 10px;
  line-height: 1.4;
}

.product-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.price {
  font-size: 14px;
  color: var(--gold);
  font-weight: 500;
}

.add-btn {
  padding: 5px 12px;
  background: var(--gold);
  color: #fff;
  border: none;
  font-size: 11px;
  letter-spacing: 1px;
  cursor: pointer;
  transition: background 0.3s;
  font-family: inherit;
}

.add-btn:hover {
  background: #7a5c12;
}

/* Cart */
.shop-cart {
  width: 320px;
  flex-shrink: 0;
  align-self: flex-start;
  position: sticky;
  top: 92px;
  background: #fff;
  border: 1px solid #eee;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  padding: 16px 20px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
}

.cart-title {
  font-size: 15px;
  letter-spacing: 2px;
  color: var(--dark);
}

.cart-arrow {
  font-size: 12px;
  color: #ccc;
}

.cart-body {
  padding: 0;
}

.cart-empty {
  padding: 50px 20px;
  text-align: center;
}

.cart-empty-icon {
  font-size: 36px;
  display: block;
  margin-bottom: 12px;
  opacity: 0.5;
}

.cart-empty p {
  font-size: 14px;
  color: #999;
  margin-bottom: 6px;
}

.cart-empty span {
  font-size: 12px;
  color: #ccc;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 20px;
  border-bottom: 1px solid #f5f5f5;
}

.cart-item-info {
  flex: 1;
  min-width: 0;
}

.cart-item-name {
  display: block;
  font-size: 13px;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cart-item-price {
  font-size: 12px;
  color: var(--gold);
}

.cart-item-qty {
  display: flex;
  align-items: center;
  gap: 6px;
}

.cart-item-qty button {
  width: 24px;
  height: 24px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
}

.cart-item-qty span {
  font-size: 13px;
  min-width: 20px;
  text-align: center;
}

.cart-item-del {
  background: none;
  border: none;
  font-size: 14px;
  color: #ccc;
  cursor: pointer;
}

.cart-item-del:hover {
  color: #c00;
}

.cart-total {
  display: flex;
  justify-content: space-between;
  padding: 16px 20px;
  border-top: 1px solid #eee;
  font-size: 14px;
}

.cart-total strong {
  color: var(--gold);
  font-size: 16px;
}

.checkout-btn {
  width: calc(100% - 40px);
  margin: 0 20px 10px;
  padding: 14px;
  background: var(--dark);
  color: #fff;
  border: none;
  font-size: 14px;
  letter-spacing: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.checkout-btn:hover {
  background: #333;
}

.clear-cart-btn {
  width: calc(100% - 40px);
  margin: 0 20px 12px;
  padding: 10px;
  background: none;
  color: #bbb;
  border: 1px solid #f0f0f0;
  font-size: 12px;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s;
  font-family: inherit;
}

.clear-cart-btn:hover {
  color: #c00;
  border-color: #fcc;
  background: #fff5f5;
}

.btn-danger {
  padding: 12px 28px;
  background: #c00;
  color: #fff;
  border: none;
  font-size: 13px;
  letter-spacing: 2px;
  cursor: pointer;
  transition: background 0.3s;
  font-family: inherit;
}

.btn-danger:hover {
  background: #a00;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.modal-content {
  background: #fff;
  max-width: 620px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  padding: 44px;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 20px;
  color: #999;
  cursor: pointer;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s;
}

.modal-close:hover {
  color: #333;
}

/* 步骤指示器 */
.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  margin-bottom: 36px;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.step-num {
  width: 32px;
  height: 32px;
  border: 2px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: #ccc;
  font-weight: 600;
  transition: all 0.3s;
}

.step-item.active .step-num {
  border-color: var(--gold);
  color: var(--gold);
}

.step-item.done .step-num {
  border-color: var(--gold);
  background: var(--gold);
  color: #fff;
}

.step-label {
  font-size: 11px;
  color: #ccc;
  letter-spacing: 1px;
  transition: color 0.3s;
}

.step-item.active .step-label {
  color: var(--gold);
}

.step-item.done .step-label {
  color: var(--text-muted);
}

.step-line {
  width: 60px;
  height: 2px;
  background: #eee;
  margin: 0 4px 20px;
  transition: background 0.3s;
}

.step-line.done {
  background: var(--gold);
}

.modal-content h2 {
  font-size: 22px;
  font-weight: 400;
  letter-spacing: 4px;
  color: var(--dark);
  margin-bottom: 4px;
  font-family: 'Noto Serif SC', serif;
}

.step-desc {
  font-size: 13px;
  color: var(--text-muted);
  letter-spacing: 1px;
  margin-bottom: 28px;
}

/* Order Review (Step 1) */
.order-review {
  margin-bottom: 20px;
}

.review-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid #f5f5f5;
}

.review-img {
  width: 56px;
  height: 56px;
  object-fit: cover;
  display: block;
  flex-shrink: 0;
  background: var(--bg-warm);
}

.review-info {
  flex: 1;
  min-width: 0;
}

.review-info h4 {
  font-size: 14px;
  color: var(--dark);
  letter-spacing: 1px;
  margin-bottom: 2px;
}

.review-price {
  font-size: 13px;
  color: var(--gold);
}

.review-qty {
  display: flex;
  align-items: center;
  gap: 6px;
}

.review-qty button {
  width: 26px;
  height: 26px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.review-qty button:hover:not(:disabled) {
  border-color: #333;
}

.review-qty button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.review-qty span {
  font-size: 13px;
  min-width: 22px;
  text-align: center;
}

.review-subtotal {
  font-size: 14px;
  color: var(--text);
  font-weight: 500;
  min-width: 80px;
  text-align: right;
}

.review-del {
  background: none;
  border: none;
  font-size: 14px;
  color: #ccc;
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s;
}

.review-del:hover {
  color: #c00;
}

.price-breakdown {
  border: 1px solid #eee;
  padding: 16px 20px;
  margin-bottom: 24px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 13px;
  color: var(--text-light);
}

.price-row.total {
  border-top: 1px solid #eee;
  margin-top: 8px;
  padding-top: 12px;
  font-size: 15px;
}

.price-row.total strong {
  color: var(--gold);
  font-size: 18px;
}

.free {
  color: #27ae60;
}

.step-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}

.btn-outline {
  padding: 12px 28px;
  border: 1px solid #ddd;
  background: #fff;
  color: var(--text-light);
  font-size: 13px;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s;
  font-family: inherit;
}

.btn-outline:hover {
  border-color: #333;
  color: #333;
}

.btn-primary {
  padding: 12px 32px;
  background: var(--gold);
  color: #fff;
  border: none;
  font-size: 14px;
  letter-spacing: 3px;
  cursor: pointer;
  transition: background 0.3s;
  font-family: inherit;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-primary:hover {
  background: #7a5c12;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Info Form (Step 2) */
.info-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-group.flex-1 {
  flex: 1;
}

.form-group label {
  font-size: 13px;
  color: var(--text);
  letter-spacing: 1px;
}

.req {
  color: #c00;
}

.info-form input,
.info-form textarea {
  padding: 12px 14px;
  border: 1px solid #ddd;
  font-size: 14px;
  color: var(--text);
  outline: none;
  font-family: inherit;
  transition: border-color 0.3s;
}

.info-form input:focus,
.info-form textarea:focus {
  border-color: var(--gold);
}

.info-form input.err {
  border-color: #c00;
}

.f-err {
  font-size: 11px;
  color: #c00;
  letter-spacing: 1px;
}

.global-err {
  padding: 10px 14px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #c00;
  font-size: 13px;
  text-align: center;
}

.info-form textarea {
  resize: vertical;
}

.form-row {
  display: flex;
  gap: 12px;
}

/* Success (Step 3) */
.success-state {
  text-align: center;
  padding: 20px 0;
}

.success-badge {
  width: 72px;
  height: 72px;
  margin: 0 auto 24px;
  background: var(--gold);
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-badge span {
  font-size: 36px;
  color: #fff;
}

.success-state h2 {
  margin-bottom: 12px;
}

.success-desc {
  font-size: 14px;
  color: var(--text-light);
  line-height: 1.8;
  margin-bottom: 24px;
}

.success-desc strong {
  color: var(--gold);
}

.success-info {
  display: inline-block;
  text-align: left;
  border: 1px solid #eee;
  padding: 16px 24px;
  margin-bottom: 28px;
  min-width: 260px;
}

.si-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 13px;
  color: var(--text-light);
  gap: 40px;
}

.si-row strong {
  color: var(--dark);
  font-size: 14px;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .modal-overlay {
    padding: 16px;
    align-items: flex-end;
  }

  .modal-content {
    padding: 28px 20px;
    max-height: 90vh;
  }

  .form-row {
    flex-direction: column;
  }

  .step-actions {
    flex-direction: column;
  }

  .step-actions .btn-primary,
  .step-actions .btn-outline {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .shop-layout {
    flex-direction: column;
    padding: 20px;
  }

  .shop-cart {
    width: 100%;
    position: static;
  }

  .product-grid {
    grid-template-columns: 1fr;
  }
}

/* Detail Modal */
.detail-overlay {
  position: fixed;
  inset: 0;
  z-index: 210;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.detail-modal {
  background: #fff;
  max-width: 860px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  position: relative;
  padding: 50px;
}

.detail-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 22px;
  color: #999;
  cursor: pointer;
}

.detail-close:hover {
  color: #333;
}

.detail-grid {
  display: flex;
  gap: 50px;
}

.detail-image {
  flex: 1;
}

.detail-img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  display: block;
  background: var(--bg-warm);
}

.detail-info {
  flex: 1;
}

.detail-code {
  font-size: 11px;
  color: #ccc;
  letter-spacing: 2px;
  margin-bottom: 8px;
}

.detail-info h2 {
  font-size: 26px;
  font-weight: 400;
  letter-spacing: 3px;
  color: var(--dark);
  margin-bottom: 12px;
  font-family: 'Noto Serif SC', serif;
}

.detail-desc {
  font-size: 14px;
  color: var(--text-light);
  line-height: 1.8;
  margin-bottom: 24px;
}

.detail-table {
  margin-bottom: 28px;
}

.d-row {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 13px;
}

.d-row span:first-child {
  color: #999;
  width: 70px;
  flex-shrink: 0;
  letter-spacing: 2px;
}

.d-row span:last-child {
  color: var(--text);
}

.gold {
  color: var(--gold) !important;
  font-weight: 500;
}

.detail-actions {
  display: flex;
  gap: 12px;
}

.btn-outline-dark {
  padding: 12px 28px;
  border: 1px solid #ddd;
  background: #fff;
  color: var(--text-light);
  font-size: 13px;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s;
  font-family: inherit;
}

.btn-outline-dark:hover {
  border-color: #333;
  color: #333;
}

@media (max-width: 768px) {
  .detail-grid {
    flex-direction: column;
  }

  .detail-modal {
    padding: 28px 20px;
  }
}

/* Login Prompt */
.prompt-overlay {
  position: fixed;
  inset: 0;
  z-index: 220;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.prompt-card {
  background: #fff;
  max-width: 400px;
  width: 100%;
  padding: 44px 36px;
  text-align: center;
}

.prompt-icon {
  font-size: 40px;
  display: block;
  margin-bottom: 16px;
}

.prompt-card h3 {
  font-size: 20px;
  font-weight: 400;
  color: var(--dark);
  letter-spacing: 4px;
  margin-bottom: 10px;
  font-family: 'Noto Serif SC', serif;
}

.prompt-card p {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.7;
  margin-bottom: 28px;
}

.prompt-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 16px;
}

.prompt-close {
  background: none;
  border: none;
  font-size: 12px;
  color: #bbb;
  cursor: pointer;
  letter-spacing: 1px;
  transition: color 0.3s;
  font-family: inherit;
}

.prompt-close:hover {
  color: #666;
}

.checkout-bar {
  position: sticky;
  bottom: 0;
  background: #fff;
  border-top: 1px solid #eee;
  padding: 16px 40px;
  z-index: 50;
}

.checkout-bar-inner {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 24px;
}

.cb-total {
  font-size: 18px;
  color: var(--gold);
}

.cb-btn {
  padding: 12px 40px;
  background: var(--gold);
  color: #fff;
  border: none;
  font-size: 14px;
  letter-spacing: 3px;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.3s;
}

.cb-btn:hover {
  background: #7a5c12;
}

.toast {
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
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.search-bar {
  max-width: 360px;
  margin: 16px auto 0;
}

.search-bar input {
  width: 100%;
  padding: 10px 16px;
  border: none;
  border-bottom: 1px solid #ddd;
  font-size: 14px;
  color: var(--text);
  outline: none;
  background: transparent;
  text-align: center;
  letter-spacing: 1px;
  font-family: inherit;
  transition: border-color 0.3s;
}

.search-bar input:focus {
  border-bottom-color: var(--gold);
}

.search-bar input::placeholder {
  color: #ccc;
  letter-spacing: 2px;
}
</style>
