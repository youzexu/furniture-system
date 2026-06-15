<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useReveal } from '../composables/useReveal'
import { API_BASE } from '../api'

const { addReveal } = useReveal()
const visible = ref(false)
onMounted(() => { setTimeout(() => visible.value = true, 100); loadProducts(); fetchCategories() })

const activeCat = ref('all')
const searchQuery = ref('')

let debounceTimer: ReturnType<typeof setTimeout>
async function onSearch() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => loadProducts(searchQuery.value), 600)
}

const categories = ref<{ key: string; label: string }[]>([{ key: 'all', label: '全部产品' }])

async function fetchCategories() {
  try {
    const res = await fetch(`${API_BASE}/api/categories/`)
    const data = await res.json()
    if (data.success) {
      categories.value = [{ key: 'all', label: '全部产品' }, ...data.data.map((c: any) => ({ key: c.key, label: c.name + '系列' }))]
    }
  } catch {}
}

interface Product {
  code: string; name: string; cat: string; material: string
  size: string; price: string; desc: string; details: string[]; image: string
}

const products = ref<Product[]>([])

async function loadProducts(search?: string) {
  try {
    let url = `${API_BASE}/api/products/`
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    const qs = params.toString()
    if (qs) url += '?' + qs
    const res = await fetch(url)
    const data = await res.json()
    if (data.success) products.value = data.data
  } catch {}
}

onMounted(loadProducts)

const filtered = computed(() => activeCat.value === 'all' ? products.value : products.value.filter(p => p.cat === activeCat.value))
</script>

<template>
  <div class="page-fade" :class="{ show: visible }">
    <!-- Banner -->
    <section class="page-banner">
      <div>
        <p class="banner-label">PRODUCTS</p>
        <h1>匠心之作</h1>
        <p class="banner-sub">六大品类 · 数百款产品 · 满足所有空间需求</p>
      </div>
    </section>

    <!-- 筛选 -->
    <section class="filter-section reveal" :ref="addReveal">
      <div class="container">
        <div class="filter-bar">
          <button v-for="c in categories" :key="c.key"
            :class="{ active: activeCat === c.key }"
            @click="activeCat = c.key">
            {{ c.label }}
          </button>
        </div>
        <div class="search-bar">
          <input v-model="searchQuery" type="text" placeholder="搜索产品..." @input="onSearch" />
        </div>
      </div>
    </section>

    <!-- 产品网格 -->
    <section class="section reveal" style="padding-top: 0" :ref="addReveal">
      <div class="container">
        <div class="product-grid">
          <div class="product-card" v-for="p in filtered" :key="p.code" @click="$router.push('/products/' + p.code)">
            <div class="product-image">
              <img :src="'/images/products/' + p.code + '.svg'" :alt="p.name" class="product-img" />
              <div class="product-overlay">
                <span>查看详情</span>
              </div>
            </div>
            <div class="product-info">
              <span class="product-code">{{ p.code }}</span>
              <h3>{{ p.name }}</h3>
              <p class="product-material">{{ p.material }}</p>
              <p class="product-desc">{{ p.desc }}</p>
              <div class="product-bottom">
                <span class="product-price">{{ p.price }}</span>
                <span class="product-tag" v-if="p.cat === 'hotel'">工程定制</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section reveal" :ref="addReveal">
      <div class="container cta-content">
        <h2>没有找到合适的？</h2>
        <p>我们提供全品类定制服务，从尺寸到材质，完全按您的要求生产</p>
        <router-link to="/custom" class="btn-primary">了解定制服务</router-link>
      </div>
    </section>
  </div>
</template>

<style scoped>
.filter-section { padding: 30px 0; border-bottom: 1px solid #eee; }
.filter-bar { display: flex; justify-content: center; gap: 1px; background: #eee; }
.filter-bar button {
  padding: 12px 28px;
  background: #fff;
  border: none;
  color: var(--text-light);
  font-size: 13px;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s;
}
.filter-bar button.active,
.filter-bar button:hover {
  background: var(--gold);
  color: #fff;
}
.search-bar { max-width: 360px; margin: 16px auto 0; }
.search-bar input { width: 100%; padding: 10px 16px; border: none; border-bottom: 1px solid #ddd; font-size: 14px; color: var(--text); outline: none; background: transparent; text-align: center; letter-spacing: 1px; font-family: inherit; transition: border-color 0.3s; }
.search-bar input:focus { border-bottom-color: var(--gold); }
.search-bar input::placeholder { color: #ccc; letter-spacing: 2px; }

.product-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: #eee; }
.product-card { background: #fff; cursor: pointer; transition: background 0.3s; overflow: hidden; }
.product-card:hover { background: #fafaf8; }
.product-image { position: relative; }
.product-img {
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  display: block;
}
.product-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
  color: #fff;
  letter-spacing: 3px;
  font-size: 14px;
}
.product-card:hover .product-overlay { opacity: 1; }
.product-info { padding: 20px; }
.product-code { font-size: 10px; color: #ccc; letter-spacing: 2px; }
.product-info h3 { font-size: 15px; color: var(--dark); margin: 6px 0; letter-spacing: 2px; }
.product-material { font-size: 12px; color: #888; margin-bottom: 4px; }
.product-desc { font-size: 12px; color: #bbb; margin-bottom: 12px; line-height: 1.6; }
.product-bottom { display: flex; align-items: center; justify-content: space-between; padding-top: 12px; border-top: 1px solid #f0f0f0; }
.product-price { font-size: 15px; color: var(--gold); font-weight: 500; }
.product-tag { padding: 3px 8px; background: var(--gold); color: #fff; font-size: 10px; letter-spacing: 1px; }
</style>
