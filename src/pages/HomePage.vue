<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue'
import { API_BASE } from '../api'

const visible = ref(false)
const banners = ref<{title:string;image:string;link:string}[]>([])
const bannerIndex = ref(0)
let bannerTimer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  setTimeout(() => visible.value = true, 100)
  // Fetch banners
  fetch(`${API_BASE}/api/banners/`).then(r => r.json()).then(d => {
    if (d.success && d.data.length > 0) {
      banners.value = d.data
      if (d.data.length > 1) bannerTimer = setInterval(() => { bannerIndex.value = (bannerIndex.value + 1) % d.data.length }, 4000)
    }
  }).catch(() => {})
  setTimeout(() => visible.value = true, 100)
  fetch(`${API_BASE}/api/partners/`).then(r => r.json()).then(d => { if (d.success) partners.value = d.data }).catch(() => {})
  fetch(`${API_BASE}/api/testimonials/`).then(r => r.json()).then(d => { if (d.success) testimonials.value = d.data }).catch(() => {})
})


// Scroll-triggered reveal
const reveals = ref<HTMLElement[]>([])

function addReveal(el: unknown) {
  if (el instanceof HTMLElement) reveals.value.push(el)
}

function onScroll() {
  reveals.value.forEach(el => {
    const top = el.getBoundingClientRect().top
    if (top < window.innerHeight - 80) el.classList.add('revealed')
  })
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => { window.removeEventListener('scroll', onScroll); if (bannerTimer) clearInterval(bannerTimer) })

const advantages = [
  { icon: '', title: '原木直采', desc: '与全球优质林场建立长期合作，从源头把控木材品质，FSC 认证保障可持续性，精选北美白橡、欧洲榉木、东南亚柚木等优质原材。' },
  { icon: '', title: '精工制造', desc: '引进德国豪迈生产线，CNC 精密加工中心 12 台，每件产品经过 37 道品控节点，公差严格控制在 ±0.2mm 以内。' },
  { icon: '', title: '原创设计', desc: '中意设计团队 15 人联合研发，每年推出 200+ 新款，紧跟米兰国际家具展潮流，将前沿设计融入东方生活美学。' },
  { icon: '', title: '全球物流', desc: '自建海外仓储体系覆盖北美、欧洲、中东、东南亚，支持 FOB / CIF / DDP 多种贸易条款，确保准时安全交付。' },
  { icon: '', title: '品质认证', desc: '通过 ISO 9001、ISO 14001、FSC、SGS 等国际权威认证，产品符合欧盟 E1 级环保标准及美国 CARB 认证。' },
  { icon: '', title: '无忧售后', desc: '3 年质保期内免费维修，终身维护服务，专属客服 7×24 小时响应，让您购物无忧、售后不愁。' },
]

const partners = ref<string[]>([])

const testimonials = ref<{name:string;role:string;text:string}[]>([])
</script>

<template>
  <div class="page-fade" :class="{ show: visible }">

    <!-- ===== Hero / 轮播 ===== -->
    <HeroBanner />

    <!-- ===== Hero ===== -->
    <section v-if="banners.length > 0" class="hero-split">
      <div class="hero-left">
        <p class="hero-tag">— SOURCE FACTORY · SINCE 2001 —</p>
        <h1 class="hero-title">以工艺之名<br>定义家居美学</h1>
        <p class="hero-sub">二十三年专注高端家具制造<br>从原木到成品，每一件都是对品质的承诺</p>
        <div class="hero-actions">
          <router-link to="/products" class="btn-primary">浏览产品</router-link>
          <router-link to="/contact" class="btn-outline">联系我们</router-link>
        </div>
      </div>
      <div class="hero-right">
        <img :src="'http://127.0.0.1:8000' + banners[bannerIndex].image" alt="" class="hero-carousel-img" />
        <div v-if="banners.length > 1" class="hero-carousel-dots">
          <span v-for="(_b, i) in banners" :key="i" :class="{active: i===bannerIndex}" @click="bannerIndex=i"></span>
        </div>
      </div>
    </section>

    <section v-else class="hero">
      <div class="hero-bg"></div>
      <div class="hero-content">
        <p class="hero-tag">— SOURCE FACTORY · SINCE 2001 —</p>
        <h1 class="hero-title">以工艺之名<br>定义家居美学</h1>
        <p class="hero-sub">二十三年专注高端家具制造<br>从原木到成品，每一件都是对品质的承诺</p>
        <div class="hero-actions">
          <router-link to="/products" class="btn-primary">浏览产品</router-link>
          <router-link to="/contact" class="btn-outline">联系我们</router-link>
        </div>
      </div>
    </section>

    <!-- ===== 品牌故事 ===== -->
    <section class="section">
      <div class="container">
        <div :ref="addReveal" class="intro-grid reveal">
          <div class="intro-image">
            <img src="/images/brand-story.svg" alt="尚品工坊总部展厅" class="intro-img" loading="lazy" />
          </div>
          <div class="intro-text">
            <p class="section-label">BRAND STORY</p>
            <h2 class="section-title">品牌故事</h2>
            <p class="intro-lead">始于 2001 年，深耕家具制造领域二十三载。</p>
            <p>我们坐落于中国家具之都——广东佛山，拥有 30,000㎡ 现代化生产基地，汇聚 200 余名资深匠人。从原木采选到成品出库，每一道工序都遵循严苛标准，致力于为全球客户提供兼具美学价值与实用功能的高端家具产品。</p>
            <p>尚品工坊始终坚持「设计驱动、品质为本」的理念，与意大利、德国多家设计机构保持长期合作，将国际前沿设计语言融入东方生活美学之中。我们的产品远销北美、欧洲、中东、东南亚等 50 余个国家和地区。</p>
            <router-link to="/factory" class="inline-link">了解我们的工厂 →</router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== 产品系列 ===== -->
    <section id="categories" class="section" style="background:#fafaf8">
      <div class="container">
        <div :ref="addReveal" class="text-center reveal">
          <p class="section-label">COLLECTION</p>
          <h2 class="section-title">产品系列</h2>
          <p class="section-subtitle">六大品类，满足不同空间的家具需求</p>
        </div>
        <div :ref="addReveal" class="category-grid reveal">
          <div class="category-card" v-for="cat in [
            { key:'living', name:'客厅系列', en:'Living Room', desc:'沙发、茶几、电视柜、边几等，打造家的核心社交空间' },
            { key:'dining', name:'餐厅系列', en:'Dining Room', desc:'餐桌、餐椅、餐边柜、酒柜等，让每一餐都充满仪式感' },
            { key:'bedroom', name:'卧室系列', en:'Bedroom', desc:'床、床头柜、衣柜、梳妆台等，营造舒适私密的休憩空间' },
            { key:'study', name:'书房系列', en:'Home Office', desc:'书桌、书柜、办公椅等，在书香中享受专注时光' },
            { key:'hotel', name:'酒店工程', en:'Hotel Project', desc:'客房整装、公区家具、宴会厅桌椅等规模化定制交付' },
            { key:'office', name:'办公系列', en:'Workspace', desc:'高管桌、会议桌、文件柜、屏风等现代办公家具解决方案' },
          ]" :key="cat.name">
            <img :src="'/images/cat-' + cat.key + '.svg'" :alt="cat.name" class="cat-img" />
            <h3>{{ cat.name }}</h3>
            <p class="cat-en">{{ cat.en }}</p>
            <p class="cat-desc">{{ cat.desc }}</p>
            <router-link to="/products" class="inline-link">浏览产品 →</router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== 优势 ===== -->
    <section class="section">
      <div class="container">
        <div :ref="addReveal" class="text-center reveal">
          <p class="section-label">WHY US</p>
          <h2 class="section-title">为什么选择我们</h2>
        </div>
        <div class="adv-grid">
          <div :ref="addReveal" v-for="(adv, i) in advantages" :key="i" class="adv-card reveal">
            <div class="adv-icon">{{ adv.icon }}</div>
            <h3>{{ adv.title }}</h3>
            <p>{{ adv.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== 合作伙伴 ===== -->
    <section class="section" style="background:#fafaf8">
      <div class="container">
        <div :ref="addReveal" class="text-center reveal">
          <p class="section-label">PARTNERS</p>
          <h2 class="section-title">合作品牌</h2>
          <p class="section-subtitle">与行业头部企业建立长期战略合作</p>
        </div>
        <div :ref="addReveal" class="partner-grid reveal">
          <span v-for="p in partners" :key="p" class="partner-item">{{ p }}</span>
        </div>
      </div>
    </section>

    <!-- ===== 客户评价 ===== -->
    <section class="section">
      <div class="container">
        <div :ref="addReveal" class="text-center reveal">
          <p class="section-label">TESTIMONIALS</p>
          <h2 class="section-title">客户评价</h2>
        </div>
        <div class="testimonial-grid">
          <div :ref="addReveal" v-for="(t, i) in testimonials" :key="i" class="testimonial-card reveal">
            <p class="testimonial-text">"{{ t.text }}"</p>
            <div class="testimonial-author">
              <strong>{{ t.name }}</strong>
              <span>{{ t.role }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== CTA ===== -->
    <section class="cta-section">
      <div class="container">
        <div :ref="addReveal" class="cta-content reveal">
          <h2>开启您的专属定制之旅</h2>
          <p>从一张草图到一件传世之作，尚品工坊为您全程服务</p>
          <router-link to="/contact" class="btn-primary">立即咨询</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Hero */
.hero {
  height: 80vh;
  min-height: 520px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  background: var(--dark);
  color: #fff;
  margin-top: 72px;
}
.hero-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, rgba(139,105,20,0.08) 0%, transparent 70%);
}
.hero-content { position: relative; z-index: 1; max-width: 780px; padding: 0 40px; }
.hero-tag { font-size: 12px; letter-spacing: 6px; color: var(--gold-light); margin-bottom: 20px; }
.hero-title { font-size: 64px; font-weight: 300; line-height: 1.2; letter-spacing: 8px; margin-bottom: 24px; font-family: 'Noto Serif SC', serif; white-space: pre-line; }
.hero-sub { font-size: 16px; line-height: 1.8; color: rgba(255,255,255,0.65); letter-spacing: 2px; white-space: pre-line; }
.hero-actions { margin-top: 40px; display: flex; gap: 20px; justify-content: flex-start; }
.hero-stats {
  position: absolute;
  bottom: 60px;
  display: flex;
  gap: 80px;
}
.hero-stat { text-align: center; }
.hero-stat b { display: block; font-size: 42px; font-weight: 300; color: var(--gold-light); font-family: 'Georgia', serif; }
.hero-stat span { font-size: 12px; color: rgba(255,255,255,0.5); letter-spacing: 2px; }

/* Reveal */

.text-center { text-align: center; }

.text-center { text-align: center; }

/* Intro */
.intro-grid { display: flex; gap: 80px; align-items: center; }
.intro-image { flex: 1; }
.intro-img {
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  display: block;
  border-radius: 4px;
}
.intro-text { flex: 1; }
.intro-text .section-label,
.intro-text .section-title { margin-bottom: 24px; display: block; }
.intro-lead { font-size: 19px; color: #2c1810; margin-bottom: 20px; font-weight: 500; letter-spacing: 1px; }
.intro-text p { font-size: 14px; line-height: 2; color: var(--text-light); margin-bottom: 14px; }
.inline-link {
  display: inline-block;
  margin-top: 16px;
  color: var(--gold);
  font-size: 14px;
  letter-spacing: 2px;
  border-bottom: 1px solid var(--gold);
  padding-bottom: 2px;
  transition: opacity 0.3s;
}
.inline-link:hover { opacity: 0.7; }

/* Category */
.category-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: #eee; }
.category-card {
  background: #fff;
  padding: 50px 30px;
  text-align: center;
  transition: background 0.3s;
}
.category-card:hover { background: #fafaf8; }
.cat-img {
  width: 80px; height: 80px;
  margin: 0 auto 20px;
  display: block;
}
.category-card h3 { font-size: 17px; letter-spacing: 3px; color: var(--dark); margin-bottom: 4px; }
.cat-en { font-size: 11px; color: #ccc; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px; }
.cat-desc { font-size: 13px; color: var(--text-muted); line-height: 1.8; margin-bottom: 16px; }

/* Advantage */
.adv-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: #eee; }
.adv-card { background: #fff; text-align: center; padding: 50px 30px; transition: background 0.3s; }
.adv-card:hover { background: #fafaf8; }
.adv-icon { font-size: 32px; margin-bottom: 18px; }
.adv-card h3 { font-size: 16px; color: var(--dark); margin-bottom: 12px; letter-spacing: 2px; }
.adv-card p { font-size: 13px; line-height: 1.9; color: var(--text-muted); }

/* Partners */
.partner-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2px;
}
.partner-item {
  padding: 24px 36px;
  background: #fff;
  font-size: 14px;
  color: #888;
  letter-spacing: 2px;
  min-width: 140px;
  text-align: center;
  border: 1px solid #eee;
}

/* Testimonials */
.testimonial-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
.testimonial-card { padding: 40px 30px; background: var(--bg-warm); border-left: 3px solid var(--gold); }
.testimonial-text { font-size: 14px; line-height: 2; color: var(--text-light); margin-bottom: 24px; font-style: italic; }
.testimonial-author strong { display: block; font-size: 14px; color: var(--dark); }
.testimonial-author span { font-size: 12px; color: var(--text-muted); }

/* CTA */
.cta-section { background: var(--dark); padding: 100px 0; text-align: center; color: #fff; }
.cta-content h2 { font-size: 34px; font-weight: 300; letter-spacing: 6px; margin-bottom: 16px; font-family: 'Noto Serif SC', serif; }
.cta-content p { font-size: 14px; color: rgba(255,255,255,0.6); letter-spacing: 2px; margin-bottom: 36px; }


/* Hero Split (banners) */
.hero-split { display: flex; height: 80vh; min-height: 520px; margin-top: 72px; }
.hero-left { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 80px 60px; background: #fff; }
.hero-left .hero-tag { color: var(--gold); }
.hero-left .hero-title { color: var(--dark); }
.hero-left .hero-sub { color: var(--text-light); }
.hero-left .btn-primary { padding: 14px 40px; background: var(--gold); color: #fff; font-size: 14px; letter-spacing: 3px; border: none; cursor: pointer; text-decoration: none; transition: background .3s; }
.hero-left .btn-primary:hover { background: #7a5c12; }
.hero-left .btn-outline { padding: 14px 40px; border: 1px solid var(--gold); color: var(--gold); font-size: 14px; letter-spacing: 3px; text-decoration: none; transition: all .3s; }
.hero-left .btn-outline:hover { background: var(--gold); color: #fff; }
.hero-right { flex: 1; position: relative; overflow: hidden; background: #1a1a1a; }
.hero-carousel-img { width: 100%; height: 100%; object-fit: cover; transition: opacity .5s; }
.hero-carousel-dots { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px; }
.hero-carousel-dots span { width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,.4); cursor: pointer; transition: background .3s; }
.hero-carousel-dots span.active { background: #fff; }
@media (max-width:768px) { .hero-split { flex-direction: column; height: auto; } .hero-left { padding: 60px 30px; } .hero-right { height: 50vh; } }
@media (max-width: 768px) {
  .hero-title { font-size: 36px; }
  .hero-stats { gap: 30px; }
  .hero-stat b { font-size: 28px; }
  .intro-grid { flex-direction: column; }
  .category-grid { grid-template-columns: 1fr; }
  .adv-grid { grid-template-columns: 1fr; }
  .testimonial-grid { grid-template-columns: 1fr; }
}
</style>
