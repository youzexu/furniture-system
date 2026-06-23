<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useToastStore } from '../stores/toast'
import { useRecentStore } from '../stores/recent'
import { API_BASE } from '../api'

const route = useRoute()
const router = useRouter()
const cart = useCartStore()
const toast = useToastStore()
const recentStore = useRecentStore()

interface Product { code:string; name:string; cat:string; material:string; size:string; price:string; priceNum:number; desc:string; details:string[]; image:string; tag:string }
const product = ref<Product | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await fetch(`${API_BASE}/api/products/`)
    const data = await res.json()
    if (data.success) {
      product.value = data.data.find((p: Product) => p.code === route.params.code) || null
    }
  } catch {}
  loading.value = false
  // Save to recent views
  if (product.value) {
    recentStore.addItem({ code: product.value.code, name: product.value.name })
  }
})

function goBack() { router.back() }

function addToCart() {
  if (!product.value) return
  cart.addItem({ code: product.value.code, name: product.value.name, price: product.value.price, priceNum: product.value.priceNum, image: product.value.image })
  toast.show('已加入购物车')
  setTimeout(goBack, 600)
}

function shareProduct() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    toast.show('链接已复制')
  }).catch(() => {})
}
</script>

<template>
  <div class="detail-page">    <div v-if="loading" class="state-box"><span>⏳</span><p>加载中...</p></div>
    <div v-else-if="!product" class="state-box"><span>⚠️</span><p>产品不存在</p><button class="btn-back" @click="goBack">返回</button></div>
    <div v-else class="detail-content">
      <nav class="breadcrumb"><router-link to="/">首页</router-link> / <router-link to="/products">产品</router-link> / <span>{{ product.name }}</span></nav>
      <button class="share-btn" @click="shareProduct" title="分享链接">🔗</button>
      <button class="back-btn" @click="goBack">← 返回</button>
      <div class="detail-grid">
        <div class="detail-image">
          <img v-if="product.image" :src="API_BASE + product.image" :alt="product.name" class="detail-img" loading="lazy" />
          <img v-else :src="'/images/products/' + product.code + '.svg'" :alt="product.name" class="detail-img" />
        </div>
        <div class="detail-info">
          <p class="detail-code">{{ product.code }}</p>
          <h1>{{ product.name }}</h1>
          <p class="detail-desc">{{ product.desc }}</p>
          <div class="detail-table">
            <div class="d-row"><span>材质</span><span>{{ product.material }}</span></div>
            <div class="d-row" v-if="product.size"><span>尺寸</span><span>{{ product.size }}</span></div>
            <div class="d-row"><span>价格</span><span class="gold">{{ product.price }}</span></div>
          </div>
          <ul v-if="product.details?.length" class="detail-features">
            <li v-for="(d, i) in product.details" :key="i">✓ {{ d }}</li>
          </ul>
          <div class="detail-actions">
            <button class="btn-primary" @click="addToCart">加入购物车</button>
            <router-link to="/contact" class="btn-outline">咨询定制</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-page { min-height:100vh; padding-top:72px; }
.state-box { text-align:center; padding:120px 20px; color:var(--text-muted); }
.state-box span { font-size:44px; display:block; margin-bottom:12px; }
.state-box p { font-size:14px; margin-bottom:20px; }
.btn-back { padding:8px 24px; border:1px solid var(--gold); background:#fff; color:var(--gold); font-size:13px; letter-spacing:2px; cursor:pointer; font-family:inherit; transition:all .3s; }
.btn-back:hover { background:var(--gold); color:#fff; }
.back-btn { display:inline-block; margin:30px 40px 0; background:none; border:none; font-size:14px; color:var(--text-muted); cursor:pointer; letter-spacing:2px; transition:color .3s; font-family:inherit; }
.back-btn:hover { color:var(--gold); }
.share-btn { background: none; border: 1px solid #eee; padding: 6px 12px; font-size: 14px; cursor: pointer; float: right; margin-left: 10px; color: var(--text-muted); transition: all .3s; }
.share-btn:hover { border-color: var(--gold); color: var(--gold); }
.breadcrumb { padding: 30px 0 0; font-size: 13px; color: var(--text-muted); }
.breadcrumb a { color: var(--text-muted); transition: color .3s; }
.breadcrumb a:hover { color: var(--gold); }
.breadcrumb span { color: var(--text); }
.detail-content { max-width:1100px; margin:0 auto; padding:0 40px 80px; }
.detail-grid { display:flex; gap:60px; margin-top:20px; }
.detail-image { flex:1; background:var(--bg-warm); min-height:400px; overflow:hidden; }
.detail-img { width:100%; height:100%; object-fit:cover; display:block; }
.detail-info { flex:1; padding-top:10px; }
.detail-code { font-size:12px; color:#ccc; letter-spacing:2px; margin-bottom:8px; }
.detail-info h1 { font-size:32px; font-weight:300; letter-spacing:4px; color:var(--dark); margin-bottom:14px; font-family:'Noto Serif SC',serif; }
.detail-desc { font-size:15px; color:var(--text-light); line-height:1.8; margin-bottom:28px; }
.detail-table { margin-bottom:24px; }
.d-row { display:flex; padding:12px 0; border-bottom:1px solid #f0f0f0; font-size:14px; }
.d-row span:first-child { color:var(--text-muted); width:70px; flex-shrink:0; letter-spacing:2px; }
.gold { color:var(--gold) !important; font-weight:500; }
.detail-features { list-style:none; margin-bottom:32px; }
.detail-features li { padding:6px 0; font-size:14px; color:var(--text-light); letter-spacing:1px; }
.detail-actions { display:flex; gap:14px; }
.btn-primary { padding:14px 36px; background:var(--gold); color:#fff; border:none; font-size:14px; letter-spacing:3px; cursor:pointer; font-family:inherit; transition:background .3s; }
.btn-primary:hover { background:#7a5c12; }
.btn-outline { padding:14px 36px; border:1px solid var(--gold); color:var(--gold); font-size:14px; letter-spacing:3px; transition:all .3s; }
.btn-outline:hover { background:var(--gold); color:#fff; }
@media (max-width:768px) { .detail-grid { flex-direction:column; } }
</style>
