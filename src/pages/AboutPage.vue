<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useReveal } from '../composables/useReveal'

const { addReveal } = useReveal()
const visible = ref(false)
onMounted(() => setTimeout(() => visible.value = true, 100))

const milestones = [
  { year: '2001', title: '品牌创立', desc: '在佛山顺德成立，专注高端家具制造' },
  { year: '2008', title: '规模扩张', desc: '建成 30,000㎡ 现代化生产基地，引进德国豪迈生产线' },
  { year: '2015', title: '设计升级', desc: '与意大利米兰设计机构达成战略合作，组建中意联合设计团队' },
  { year: '2020', title: '全球布局', desc: '产品远销 50+ 国家，自建海外仓储物流体系' },
  { year: '2025', title: '数字智造', desc: '全面升级工业 4.0 智能工厂，年产能突破 50 万件' },
]
</script>

<template>
  <div class="page-fade" :class="{ show: visible }">
    <section class="page-banner">
      <div><p class="banner-label">ABOUT US</p><h1>关于我们</h1><p class="banner-sub">二十三载匠心传承 · 以品质定义家居美学</p></div>
    </section>

    <section class="section reveal" :ref="addReveal">
      <div class="container">
        <div class="about-intro">
          <p class="lead">尚品工坊成立于 2001 年，坐落于中国家具之都——广东佛山。二十三年来，我们始终专注高端家具制造，致力于为全球客户提供兼具美学价值与实用功能的家具产品。</p>
          <p>公司拥有 30,000㎡ 现代化生产基地，汇聚 200 余名资深匠人与 15 人设计团队。从原木采选到成品出库，每一道工序都遵循严苛标准。我们的产品涵盖客厅、餐厅、卧室、书房、办公及酒店工程六大品类，年产能超过 50 万件。</p>
          <p>尚品工坊始终秉持「设计驱动、品质为本」的理念，已通过 ISO 9001、ISO 14001、FSC、SGS 等国际权威认证，产品符合欧盟 E1 级环保标准及美国 CARB 认证，远销北美、欧洲、中东、东南亚等 50 余个国家和地区。</p>
        </div>
      </div>
    </section>

    <section class="section bg-light reveal" :ref="addReveal">
      <div class="container">
        <div class="text-center"><p class="section-label">MILESTONE</p><h2 class="section-title">发展历程</h2></div>
        <div class="timeline">
          <div class="tl-item" v-for="m in milestones" :key="m.year">
            <div class="tl-year">{{ m.year }}</div>
            <div class="tl-content"><h3>{{ m.title }}</h3><p>{{ m.desc }}</p></div>
          </div>
        </div>
      </div>
    </section>

    <section class="section reveal" :ref="addReveal">
      <div class="container">
        <div class="text-center"><p class="section-label">CULTURE</p><h2 class="section-title">企业文化</h2></div>
        <div class="culture-grid">
          <div class="culture-card">
            <h3>使命</h3>
            <p>以匠心工艺创造美好家居生活</p>
          </div>
          <div class="culture-card">
            <h3>愿景</h3>
            <p>成为全球领先的高端家具制造服务商</p>
          </div>
          <div class="culture-card">
            <h3>价值观</h3>
            <p>品质为本 · 创新驱动 · 客户至上 · 合作共赢</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page-fade { opacity:0; transition:opacity .8s; }
.page-fade.show { opacity:1; }
.page-banner { height:320px; background:var(--dark); display:flex; align-items:center; justify-content:center; text-align:center; color:#fff; margin-top:72px; }
.banner-label { font-size:12px; letter-spacing:6px; color:var(--gold-light); margin-bottom:12px; }
.page-banner h1 { font-size:44px; font-weight:300; letter-spacing:8px; font-family:'Noto Serif SC',serif; margin-bottom:12px; }
.banner-sub { font-size:15px; color:rgba(255,255,255,.6); letter-spacing:2px; }
.section { padding:80px 0; }
.bg-light { background:#fafaf8; }
.container { max-width:960px; margin:0 auto; padding:0 40px; }
.text-center { text-align:center; }
.section-label { font-size:12px; letter-spacing:5px; color:var(--gold); margin-bottom:12px; }
.section-title { font-size:36px; font-weight:300; letter-spacing:6px; color:var(--dark); margin-bottom:60px; font-family:'Noto Serif SC',serif; }
.about-intro { max-width:780px; margin:0 auto; }
.lead { font-size:19px; color:var(--dark); line-height:1.8; margin-bottom:24px; letter-spacing:1px; }
.about-intro p { font-size:14px; color:var(--text-light); line-height:2; margin-bottom:14px; }
.timeline { max-width:700px; margin:0 auto; }
.tl-item { display:flex; gap:40px; padding:28px 0; border-bottom:1px solid #e0e0e0; }
.tl-item:last-child { border-bottom:none; }
.tl-year { font-family:'Georgia',serif; font-size:32px; color:var(--gold); font-weight:300; width:80px; flex-shrink:0; }
.tl-content h3 { font-size:18px; color:var(--dark); letter-spacing:2px; margin-bottom:6px; }
.tl-content p { font-size:14px; color:var(--text-muted); }
.culture-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:#e0e0e0; max-width:800px; margin:0 auto; }
.culture-card { background:#fff; padding:50px 30px; text-align:center; }
.culture-card h3 { font-size:18px; color:var(--dark); letter-spacing:3px; margin-bottom:14px; }
.culture-card p { font-size:14px; color:var(--text-light); line-height:1.8; }

@media (max-width: 768px) {
  .culture-grid { grid-template-columns: 1fr; }
  .tl-item { flex-direction: column; gap: 12px; }
  .page-banner h1 { font-size: 28px; }
}
</style>
