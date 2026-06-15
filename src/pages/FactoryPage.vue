<script setup lang="ts">
import { onMounted, ref } from 'vue'

const visible = ref(false)
const processes = ref<{step:string;title:string;desc:string}[]>([])
const workshops = ref<{name:string;area:string;workers:number;equip:string}[]>([])
const certs = ref<string[]>([])
import { API_BASE } from '../api'

onMounted(() => {
  setTimeout(() => visible.value = true, 100)
  fetch(`${API_BASE}/api/crafts/`).then(r=>r.json()).then(d=>{if(d.success) processes.value=d.data}).catch(()=>{})
  fetch(`${API_BASE}/api/workshops/`).then(r=>r.json()).then(d=>{if(d.success) workshops.value=d.data}).catch(()=>{})
  fetch(`${API_BASE}/api/certs/`).then(r=>r.json()).then(d=>{if(d.success) certs.value=d.data}).catch(()=>{})
})
</script>

<template>
  <div class="page-fade" :class="{ show: visible }">
    <section class="page-banner">
      <div><p class="banner-label">FACTORY</p><h1>智造基地</h1><p class="banner-sub">30,000㎡ 现代化工厂 · 德国精工生产线 · 200+ 匠人团队</p></div>
    </section>

    <section class="section">
      <div class="container">
        <div class="overview-grid">
          <div class="overview-image"><div class="img-placeholder dark large"><div class="img-text">工厂航拍全景 · 佛山顺德</div></div></div>
          <div class="overview-text">
            <p class="section-label">LOCATION</p>
            <h2 class="section-title">中国 · 佛山</h2>
            <p class="overview-lead">坐落于中国家具制造核心产区，占地 30,000 平方米，建筑面积 42,000 平方米。</p>
            <p>尚品工坊生产基地按照德国工业 4.0 标准规划建设，引进豪迈（HOMAG）、比雅斯（BIESSE）、纳迪（NARDI）等欧洲顶级制造设备，构建了从原木加工到成品包装的全流程智能制造体系。年产能达 50 万件家具，可同时承接 20 个以上大型工程项目。</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section bg-light">
      <div class="container">
        <div class="text-center"><p class="section-label">WORKSHOP</p><h2 class="section-title">六大核心车间</h2></div>
        <div class="workshop-grid">
          <div class="workshop-card" v-for="ws in workshops" :key="ws.name">
            <div class="ws-header"><h3>{{ ws.name }}</h3><span class="ws-area">{{ ws.area }}</span></div>
            <div class="ws-body"><p><strong>工人：</strong>{{ ws.workers }} 人</p><p><strong>设备：</strong>{{ ws.equip }}</p></div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="text-center"><p class="section-label">CRAFT</p><h2 class="section-title">六步匠心工艺</h2></div>
        <div class="process-list">
          <div class="process-item" v-for="p in processes" :key="p.step">
            <div class="process-num">{{ p.step }}</div>
            <div class="process-content"><h3>{{ p.title }}</h3><p>{{ p.desc }}</p></div>
          </div>
        </div>
      </div>
    </section>

    <section class="section bg-light">
      <div class="container">
        <div class="text-center"><p class="section-label">CAPACITY</p><h2 class="section-title">生产实力</h2></div>
        <div class="capacity-grid">
          <div class="capacity-card"><b>50 万件</b><span>年产能</span></div>
          <div class="capacity-card"><b>20+</b><span>同时承接工程项目</span></div>
          <div class="capacity-card"><b>30 天</b><span>标准生产周期</span></div>
          <div class="capacity-card"><b>99.6%</b><span>准时交付率</span></div>
          <div class="capacity-card"><b>37 道</b><span>品控节点</span></div>
          <div class="capacity-card"><b>12 年</b><span>核心匠人平均工龄</span></div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="text-center"><p class="section-label">CERTIFICATIONS</p><h2 class="section-title">资质与认证</h2></div>
        <div class="cert-grid"><div class="cert-item" v-for="c in certs" :key="c">{{ c }}</div></div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page-fade { opacity: 0; transition: opacity 0.8s; }
.page-fade.show { opacity: 1; }
.page-banner { height: 320px; background: linear-gradient(135deg, #1a1a1a, #3d2b1f); display: flex; align-items: center; justify-content: center; text-align: center; color: #fff; margin-top: 72px; }
.banner-label { font-size: 12px; letter-spacing: 6px; color: var(--gold-light); margin-bottom: 12px; }
.page-banner h1 { font-size: 44px; font-weight: 300; letter-spacing: 8px; font-family: 'Noto Serif SC', serif; margin-bottom: 12px; }
.banner-sub { font-size: 15px; color: rgba(255,255,255,0.6); letter-spacing: 2px; }
.section { padding: 80px 0; }
.bg-light { background: #fafaf8; }
.container { max-width: 1280px; margin: 0 auto; padding: 0 40px; }
.section-label { font-size: 12px; letter-spacing: 5px; color: var(--gold); margin-bottom: 12px; }
.section-title { font-size: 36px; font-weight: 300; letter-spacing: 6px; color: #1a1a1a; margin-bottom: 60px; font-family: 'Noto Serif SC', serif; }
.text-center { text-align: center; }
.overview-grid { display: flex; gap: 80px; align-items: flex-start; }
.overview-image { flex: 1; }
.img-placeholder.dark { width: 100%; aspect-ratio: 16/10; background: linear-gradient(135deg, #2c2c2c, #4a4a4a); display: flex; align-items: center; justify-content: center; }
.img-text { color: rgba(255,255,255,0.25); letter-spacing: 4px; font-size: 14px; }
.overview-text { flex: 1; }
.overview-text .section-label, .overview-text .section-title { margin-bottom: 20px; display: block; }
.overview-lead { font-size: 18px; color: #2c1810; margin-bottom: 16px; font-weight: 500; }
.overview-text p { font-size: 14px; line-height: 2; color: var(--text-light); margin-bottom: 16px; }
.workshop-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: #e0e0e0; }
.workshop-card { background: #fff; padding: 30px; }
.ws-header { display: flex; justify-content: space-between; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #eee; }
.ws-header h3 { font-size: 18px; color: var(--dark); letter-spacing: 2px; }
.ws-area { font-size: 13px; color: var(--gold); }
.ws-body p { font-size: 13px; color: var(--text-light); margin-bottom: 6px; }
.process-list { max-width: 860px; margin: 0 auto; }
.process-item { display: flex; gap: 40px; padding: 30px 0; border-bottom: 1px solid #eee; }
.process-num { font-family: 'Georgia', serif; font-size: 48px; color: var(--gold); opacity: 0.2; flex-shrink: 0; width: 70px; }
.process-content h3 { font-size: 18px; color: var(--dark); letter-spacing: 2px; margin-bottom: 8px; }
.process-content p { font-size: 14px; line-height: 1.9; color: var(--text-light); }
.capacity-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 1px; background: #e0e0e0; }
.capacity-card { background: #fff; text-align: center; padding: 40px 16px; }
.capacity-card b { display: block; font-size: 32px; font-weight: 300; color: var(--gold); font-family: 'Georgia', serif; margin-bottom: 8px; }
.capacity-card span { font-size: 12px; color: var(--text-muted); }
.cert-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: #e0e0e0; }
.cert-item { background: #fff; text-align: center; padding: 30px 16px; font-size: 14px; color: var(--text); letter-spacing: 2px; }
@media (max-width: 768px) { .overview-grid{flex-direction:column} .workshop-grid{grid-template-columns:1fr} .capacity-grid{grid-template-columns:repeat(2,1fr)} .cert-grid{grid-template-columns:repeat(2,1fr)} }
</style>
