<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useReveal } from '../composables/useReveal'

const { addReveal } = useReveal()
const visible = ref(false)
onMounted(() => { setTimeout(() => visible.value = true, 100) })

const processes = [
  { step:'01', title:'原木采选', desc:'精选北美白橡、欧洲榉木、东南亚柚木等优质原材，与全球 12 家 FSC 认证林场建立直采合作。每批原木入库前须通过含水率、密度、纹理三项检测。' },
  { step:'02', title:'科学干燥', desc:'采用意大利纳迪（NARDI）蒸汽干燥窑 8 座，根据不同木材特性设置干燥曲线，精准控制含水率至 8%-12%，有效防止开裂变形。干燥周期 15-45 天。' },
  { step:'03', title:'精密开料', desc:'德国豪迈（HOMAG）电子开料锯 4 台 + CNC 数控加工中心 12 台，编程精度 0.01mm，加工公差控制在 ±0.2mm 以内。每日处理原木 20 立方米。' },
  { step:'04', title:'手工精修', desc:'20 年以上经验雕刻师傅 30 余人，对 CNC 加工后的部件进行手工打磨、修边、雕刻花纹。每件产品经 3 道手工砂光（180#→320#→600#）。' },
  { step:'05', title:'环保涂装', desc:'全自动 UV 涂装线 4 条 + 手动喷涂房 6 间，选用意大利 Sayerlack 环保漆，通过 SGS 甲醛、VOC 检测认证，符合欧盟 E1 级及美国 CARB 标准。' },
  { step:'06', title:'组装检验', desc:'流水线装配 8 条，每件成品须通过结构强度测试、五轮滚轮耐磨测试、24 小时承重测试。37 道品控节点，逐件检验合格方可入库。' },
]

const workshops = [
  { name:'木工车间', area:'8,000 ㎡', workers:45, equip:'豪迈 CNC 加工中心 × 12 / 电子开料锯 × 4 / 封边机 × 8' },
  { name:'涂装车间', area:'5,000 ㎡', workers:28, equip:'全自动 UV 涂装线 × 4 / 手动喷涂房 × 6 / 烘干隧道 × 2' },
  { name:'软包车间', area:'4,000 ㎡', workers:35, equip:'杜克普工业缝纫机 × 30 / 裁皮机 × 4 / 充棉机 × 6' },
  { name:'组装车间', area:'6,000 ㎡', workers:50, equip:'流水装配线 × 8 / 电动工具站 × 60 / 打包线 × 4' },
  { name:'五金车间', area:'3,000 ㎡', workers:20, equip:'激光切割机 × 3 / 折弯机 × 4 / 焊接机器人 × 6' },
  { name:'品控中心', area:'2,000 ㎡', workers:12, equip:'万能试验机 / 色差仪 × 2 / 恒温恒湿箱 / 甲醛检测仪' },
]

const certs = ['ISO 9001:2015', 'ISO 14001:2015', 'FSC 森林认证', 'SGS 产品检测', '欧盟 E1 环保', '美国 CARB 认证', 'OHSAS 18001', '中国环保标志']
</script>

<template>
  <div class="page-fade" :class="{ show: visible }">
    <!-- Banner -->
    <section class="page-banner">
      <div>
        <p class="banner-label">FACTORY</p>
        <h1>智造基地</h1>
        <p class="banner-sub">30,000㎡ 现代化工厂 · 德国精工生产线 · 200+ 匠人团队</p>
      </div>
    </section>

    <!-- 工厂概览 -->
    <section class="section reveal" :ref="addReveal">
      <div class="container">
        <div class="overview-grid">
          <div class="overview-image">
            <div class="img-placeholder dark large">
              <div class="img-text">工厂航拍全景 · 佛山顺德</div>
            </div>
          </div>
          <div class="overview-text">
            <p class="section-label">LOCATION</p>
            <h2 class="section-title">中国 · 佛山</h2>
            <p class="overview-lead">坐落于中国家具制造核心产区，占地 30,000 平方米，建筑面积 42,000 平方米。</p>
            <p>尚品工坊生产基地按照德国工业 4.0 标准规划建设，引进豪迈（HOMAG）、比雅斯（BIESSE）、纳迪（NARDI）等欧洲顶级制造设备，构建了从原木加工到成品包装的全流程智能制造体系。年产能达 50 万件家具，可同时承接 20 个以上大型工程项目。</p>
            <p>我们不仅是生产基地，更是工艺研发与品质管理中心。工厂设有独立的研发实验室，配备 12 人专职品控团队，确保每一件产品都经得起时间的检验。</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 车间 -->
    <section class="section bg-light reveal" :ref="addReveal">
      <div class="container">
        <div class="text-center">
          <p class="section-label">WORKSHOP</p>
          <h2 class="section-title">六大核心车间</h2>
        </div>
        <div class="workshop-grid">
          <div class="workshop-card" v-for="ws in workshops" :key="ws.name">
            <div class="ws-header">
              <h3>{{ ws.name }}</h3>
              <span class="ws-area">{{ ws.area }}</span>
            </div>
            <div class="ws-body">
              <p><strong>工人：</strong>{{ ws.workers }} 人</p>
              <p><strong>设备：</strong>{{ ws.equip }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 工艺流程 -->
    <section class="section reveal" :ref="addReveal">
      <div class="container">
        <div class="text-center">
          <p class="section-label">CRAFT</p>
          <h2 class="section-title">六步匠心工艺</h2>
          <p class="section-subtitle">从原木到成品，每一步都精益求精</p>
        </div>
        <div class="process-list">
          <div class="process-item" v-for="(p, i) in processes" :key="i">
            <div class="process-num">{{ p.step }}</div>
            <div class="process-content">
              <h3>{{ p.title }}</h3>
              <p>{{ p.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 生产数据 -->
    <section class="section bg-light reveal" :ref="addReveal">
      <div class="container">
        <div class="text-center">
          <p class="section-label">CAPACITY</p>
          <h2 class="section-title">生产实力</h2>
        </div>
        <div class="capacity-grid">
          <div class="capacity-card">
            <b>50 万件</b>
            <span>年产能</span>
          </div>
          <div class="capacity-card">
            <b>20+</b>
            <span>同时承接工程项目</span>
          </div>
          <div class="capacity-card">
            <b>30 天</b>
            <span>标准生产周期</span>
          </div>
          <div class="capacity-card">
            <b>99.6%</b>
            <span>准时交付率</span>
          </div>
          <div class="capacity-card">
            <b>37 道</b>
            <span>品控节点</span>
          </div>
          <div class="capacity-card">
            <b>12 年</b>
            <span>核心匠人平均工龄</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 认证 -->
    <section class="section reveal" :ref="addReveal">
      <div class="container">
        <div class="text-center">
          <p class="section-label">CERTIFICATIONS</p>
          <h2 class="section-title">资质与认证</h2>
        </div>
        <div class="cert-grid">
          <div class="cert-item" v-for="c in certs" :key="c">{{ c }}</div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.text-center { text-align: center; }
.bg-light { background: #fafaf8; }

.overview-grid { display: flex; gap: 80px; align-items: flex-start; }
.overview-image { flex: 1; }
.img-placeholder.dark {
  width: 100%;
  aspect-ratio: 16/10;
  background: linear-gradient(135deg, #2c2c2c, #4a4a4a);
  display: flex;
  align-items: center;
  justify-content: center;
}
.img-placeholder.large { aspect-ratio: 16/10; }
.img-text { color: rgba(255,255,255,0.25); letter-spacing: 4px; font-size: 14px; }
.overview-text { flex: 1; }
.overview-text .section-label,
.overview-text .section-title { margin-bottom: 20px; display: block; }
.overview-lead { font-size: 18px; color: #2c1810; margin-bottom: 16px; font-weight: 500; letter-spacing: 1px; }
.overview-text p { font-size: 14px; line-height: 2; color: var(--text-light); margin-bottom: 16px; }

/* Workshop */
.workshop-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: #e0e0e0; }
.workshop-card { background: #fff; padding: 30px; }
.ws-header { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #eee; }
.ws-header h3 { font-size: 18px; color: var(--dark); letter-spacing: 2px; }
.ws-area { font-size: 13px; color: var(--gold); font-weight: 500; }
.ws-body p { font-size: 13px; color: var(--text-light); margin-bottom: 6px; line-height: 1.8; }
.ws-body strong { color: var(--text); font-weight: 500; }

/* Process */
.process-list { max-width: 860px; margin: 0 auto; }
.process-item { display: flex; gap: 40px; padding: 30px 0; border-bottom: 1px solid #eee; }
.process-item:last-child { border-bottom: none; }
.process-num { font-family: 'Georgia', serif; font-size: 48px; color: var(--gold); opacity: 0.2; flex-shrink: 0; width: 70px; line-height: 1; }
.process-content h3 { font-size: 18px; color: var(--dark); letter-spacing: 2px; margin-bottom: 8px; }
.process-content p { font-size: 14px; line-height: 1.9; color: var(--text-light); }

/* Capacity */
.capacity-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 1px; background: #e0e0e0; }
.capacity-card { background: #fff; text-align: center; padding: 40px 16px; }
.capacity-card b { display: block; font-size: 32px; font-weight: 300; color: var(--gold); font-family: 'Georgia', serif; margin-bottom: 8px; }
.capacity-card span { font-size: 12px; color: var(--text-muted); letter-spacing: 1px; }

/* Cert */
.cert-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: #e0e0e0; }
.cert-item { background: #fff; text-align: center; padding: 30px 16px; font-size: 14px; color: var(--text); letter-spacing: 2px; }

@media (max-width: 768px) {
  .overview-grid { flex-direction: column; }
  .workshop-grid { grid-template-columns: 1fr; }
  .capacity-grid { grid-template-columns: repeat(2, 1fr); }
  .cert-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
