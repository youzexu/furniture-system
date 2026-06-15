<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { API_BASE } from '../api'

interface Banner { title: string; image: string; link: string }
const banners = ref<Banner[]>([])
const current = ref(0)
const loaded = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

onMounted(async () => {
  try {
    const res = await fetch(`${API_BASE}/api/banners/`)
    const data = await res.json()
    if (data.success && data.data.length > 0) banners.value = data.data
  } catch {}
  loaded.value = true
  if (banners.value.length > 1) {
    timer = setInterval(() => { current.value = (current.value + 1) % banners.value.length }, 4000)
  }
})

onUnmounted(() => { if (timer) clearInterval(timer) })

function prev() { current.value = (current.value - 1 + banners.value.length) % banners.value.length; resetTimer() }
function next() { current.value = (current.value + 1) % banners.value.length; resetTimer() }
function goTo(i: number) { current.value = i; resetTimer() }
function resetTimer() { if (timer) { clearInterval(timer); timer = setInterval(() => { current.value = (current.value + 1) % banners.value.length }, 4000) } }
</script>

<template>
  <div v-if="loaded && banners.length > 0" class="hero-banner">
    <div class="banner-track" :style="{ transform: `translateX(-${current * 100}%)` }">
      <div v-for="(b, i) in banners" :key="i" class="banner-slide">
        <a :href="b.link || '#'">
          <img :src="API_BASE + b.image" :alt="b.title" />
          <div v-if="b.title" class="banner-caption"><span>{{ b.title }}</span></div>
        </a>
      </div>
    </div>
    <button v-if="banners.length > 1" class="banner-prev" @click="prev">‹</button>
    <button v-if="banners.length > 1" class="banner-next" @click="next">›</button>
    <div v-if="banners.length > 1" class="banner-dots">
      <span v-for="(_b, i) in banners" :key="i" :class="{ active: i === current }" @click="goTo(i)"></span>
    </div>
  </div>
  <div v-else class="hero-fallback">
    <slot>
      <!-- Default hero content if no slot provided -->
      <div class="hero-bg"></div>
      <div class="hero-content">
        <p class="hero-tag">— SOURCE FACTORY · SINCE 2001 —</p>
        <h1 class="hero-title">以工艺之名<br>定义家居美学</h1>
        <p class="hero-sub">二十三年专注高端家具制造<br>从原木到成品，每一件都是对品质的承诺</p>
        <div class="hero-actions">
          <a href="#categories" class="btn-primary" @click.prevent="scrollToCategories">浏览产品</a>
          <router-link to="/contact" class="btn-outline">联系我们</router-link>
        </div>
      </div>
    </slot>
  </div>
</template>

<script lang="ts">
function scrollToCategories() {
  document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
.hero-banner { position: relative; width: 100%; overflow: hidden; background: #1a1a1a; }
.banner-track { display: flex; transition: transform .5s ease; }
.banner-slide { min-width: 100%; }
.banner-slide a { display: block; }
.banner-slide img { width: 100%; height: 100vh; min-height: 700px; object-fit: cover; display: block; }
.banner-caption { position: absolute; bottom: 100px; left: 50%; transform: translateX(-50%); z-index: 2; }
.banner-caption span { background: rgba(0,0,0,.5); color: #fff; padding: 12px 36px; font-size: 15px; letter-spacing: 4px; }
.banner-prev, .banner-next { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,.3); color: #fff; border: none; width: 50px; height: 80px; font-size: 32px; cursor: pointer; transition: background .3s; z-index: 2; }
.banner-prev:hover, .banner-next:hover { background: rgba(0,0,0,.6); }
.banner-prev { left: 0; border-radius: 0 4px 4px 0; }
.banner-next { right: 0; border-radius: 4px 0 0 4px; }
.banner-dots { position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); display: flex; gap: 10px; z-index: 2; }
.banner-dots span { width: 12px; height: 12px; border-radius: 50%; background: rgba(255,255,255,.4); cursor: pointer; transition: background .3s; }
.banner-dots span.active { background: #fff; }

/* Fallback hero (same as original) */
.hero-fallback { height: 100vh; min-height: 700px; display: flex; align-items: center; justify-content: center; text-align: center; position: relative; background: linear-gradient(135deg, #1a1a1a, #2c1810, #3d2b1f); color: #fff; }
.hero-bg { position: absolute; inset: 0; background: radial-gradient(ellipse at center, rgba(139,105,20,.08), transparent 70%); }
.hero-content { position: relative; z-index: 1; max-width: 780px; padding: 0 40px; }
.hero-tag { font-size: 12px; letter-spacing: 6px; color: var(--gold-light); margin-bottom: 20px; }
.hero-title { font-size: 64px; font-weight: 300; line-height: 1.2; letter-spacing: 8px; margin-bottom: 24px; font-family: 'Noto Serif SC', serif; }
.hero-sub { font-size: 16px; line-height: 1.8; color: rgba(255,255,255,.65); letter-spacing: 2px; }
.hero-actions { margin-top: 40px; display: flex; gap: 20px; justify-content: center; }
.btn-primary { padding: 14px 40px; background: var(--gold); color: #fff; font-size: 14px; letter-spacing: 3px; border: none; cursor: pointer; text-decoration: none; transition: background .3s; }
.btn-primary:hover { background: #7a5c12; }
.btn-outline { padding: 14px 40px; border: 1px solid rgba(255,255,255,.4); color: #fff; font-size: 14px; letter-spacing: 3px; text-decoration: none; transition: border-color .3s; }
.btn-outline:hover { border-color: var(--gold-light); }
</style>
