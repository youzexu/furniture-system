<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useReveal } from '../composables/useReveal'
import { API_BASE } from '../api'

const { addReveal } = useReveal()
const visible = ref(false)
const cases = ref<{name:string;type:string;area:string;style:string;desc:string}[]>([])

async function loadCases() {
  try {
    const res = await fetch(`${API_BASE}/api/cases/`)
    const data = await res.json()
    if (data.success) cases.value = data.data
  } catch {}
}

onMounted(() => {
  setTimeout(() => visible.value = true, 100)
  loadCases()
  fetch(`${API_BASE}/api/faqs/`).then(r => r.json()).then(d => { if (d.success) faq.value = d.data }).catch(() => {})
})

const flowSteps = [
  { icon:'💬', title:'需求沟通', desc:'专业顾问一对一沟通，深入了解您的设计偏好、空间尺寸、功能需求、预算范围与使用场景。预约后可安排设计师上门测量。' },
  { icon:'✏️', title:'方案设计', desc:'中意设计团队根据需求提供 3D 效果图与材质搭配方案，包含平面布局图、立面图及家具清单。48 小时内出初步方案。' },
  { icon:'📐', title:'打样确认', desc:'按确认方案制作实物样品或局部样板。您可到厂亲验材质与工艺，也可通过视频连线远程确认每一处细节。' },
  { icon:'🏭', title:'生产制造', desc:'样品确认后进入正式排产。全程数字化追踪，专属项目经理每周向您汇报进度，关键节点拍照/录像存档。' },
  { icon:'📦', title:'物流配送', desc:'专业家具物流承运，防震包装 + 全运输保险。全国 300+ 城市可送货上门，海外支持集装箱海运/空运。' },
  { icon:'🔧', title:'安装售后', desc:'提供专业上门安装服务，安装完成后由您验收签字。3 年质保期内免费维修，终身维护，7×24 小时客服在线。' },
]


const faq = ref<{q:string;a:string}[]>([])
</script>

<template>
  <div class="page-fade" :class="{ show: visible }">
    <!-- Banner -->
    <section class="page-banner">
      <div>
        <p class="banner-label">CUSTOM</p>
        <h1>专属定制</h1>
        <p class="banner-sub">从一张草图到一件传世之作，全流程一对一服务</p>
      </div>
    </section>

    <!-- 定制流程 -->
    <section class="section reveal" :ref="addReveal">
      <div class="container">
        <div class="text-center">
          <p class="section-label">PROCESS</p>
          <h2 class="section-title">六步定制流程</h2>
          <p class="section-subtitle">标准化流程 + 个性化服务，确保您的想法完美落地</p>
        </div>
        <div class="flow-grid">
          <div class="flow-card" v-for="(f, i) in flowSteps" :key="i">
            <div class="flow-number">{{ String(i + 1).padStart(2, '0') }}</div>
            <div class="flow-icon">{{ f.icon }}</div>
            <h3>{{ f.title }}</h3>
            <p>{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 优势 -->
    <section class="section bg-light">
      <div class="container">
        <div class="text-center">
          <p class="section-label">ADVANTAGE</p>
          <h2 class="section-title">定制优势</h2>
        </div>
        <div class="feature-grid">
          <div class="feature-card">
            <h3>一对一专属设计师</h3>
            <p>每位客户配备一名专属设计师，从需求沟通到方案落地全程跟进。设计师平均从业经验 8 年以上，深谙空间美学与人体工学。</p>
          </div>
          <div class="feature-card">
            <h3>柔性化生产体系</h3>
            <p>支持单件定制与批量定制。小到一张边几，大到整栋酒店，我们的柔性化产线都能灵活响应，兼顾品质与效率。</p>
          </div>
          <div class="feature-card">
            <h3>材质自由选配</h3>
            <p>提供 200+ 种面料、50+ 种木材、30+ 种石材、20+ 种金属表面处理供您自由组合，打造真正独一无二的家具作品。</p>
          </div>
          <div class="feature-card">
            <h3>全流程透明管控</h3>
            <p>从设计到交付，每个节点拍照留档。您可通过专属链接实时查看项目进度，告别信息不透明的焦虑。</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 案例 -->
    <section class="section reveal" :ref="addReveal">
      <div class="container">
        <div class="text-center">
          <p class="section-label">CASES</p>
          <h2 class="section-title">精选案例</h2>
        </div>
        <div class="case-grid">
          <div class="case-card" v-for="c in cases" :key="c.name">
            <div class="case-image">
              <div class="img-placeholder">
                <span>{{ c.name[0] }}</span>
              </div>
              <div class="case-tags">
                <span>{{ c.type }}</span>
                <span>{{ c.area }}</span>
                <span>{{ c.style }}</span>
              </div>
            </div>
            <div class="case-body">
              <h3>{{ c.name }}</h3>
              <p>{{ c.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="section bg-light">
      <div class="container">
        <div class="text-center">
          <p class="section-label">FAQ</p>
          <h2 class="section-title">常见问题</h2>
        </div>
        <div class="faq-list">
          <details class="faq-item" v-for="(f, i) in faq" :key="i">
            <summary>{{ f.q }}</summary>
            <p>{{ f.a }}</p>
          </details>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="container cta-content">
        <h2>准备好开始您的专属定制了吗？</h2>
        <p>留下联系方式，我们的设计顾问将在 24 小时内与您联系</p>
        <router-link to="/contact" class="btn-primary">立即联系我们</router-link>
      </div>
    </section>
  </div>
</template>

<style scoped>
.text-center { text-align: center; }
.bg-light { background: #fafaf8; }

/* Flow */
.flow-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: #e0e0e0; }
.flow-card {
  background: #fff;
  padding: 40px 28px;
  position: relative;
  transition: background 0.3s;
}
.flow-card:hover { background: #fafaf8; }
.flow-number {
  position: absolute;
  top: 20px;
  right: 20px;
  font-family: 'Georgia', serif;
  font-size: 42px;
  color: #f0e8d8;
}
.flow-icon { font-size: 28px; margin-bottom: 16px; }
.flow-card h3 { font-size: 17px; color: var(--dark); letter-spacing: 2px; margin-bottom: 10px; }
.flow-card p { font-size: 13px; line-height: 1.9; color: var(--text-muted); }

/* Feature */
.feature-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px; background: #e0e0e0; }
.feature-card { background: #fff; padding: 50px 36px; }
.feature-card h3 { font-size: 20px; color: var(--dark); letter-spacing: 2px; margin-bottom: 14px; }
.feature-card p { font-size: 14px; line-height: 2; color: var(--text-light); }

/* Cases */
.case-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: #e0e0e0; }
.case-card { background: #fff; }
.case-image { position: relative; }
.img-placeholder {
  aspect-ratio: 4/3;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.img-placeholder span { font-size: 48px; color: #ddd; font-weight: 600; }
.case-tags {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px;
  display: flex;
  gap: 6px;
  background: linear-gradient(transparent, rgba(0,0,0,0.5));
}
.case-tags span {
  padding: 3px 8px;
  background: rgba(255,255,255,0.9);
  font-size: 10px;
  color: var(--text);
  letter-spacing: 1px;
}
.case-body { padding: 20px; }
.case-body h3 { font-size: 16px; color: var(--dark); letter-spacing: 2px; margin-bottom: 8px; }
.case-body p { font-size: 13px; line-height: 1.8; color: var(--text-muted); }

/* FAQ */
.faq-list { max-width: 780px; margin: 0 auto; }
.faq-item { border-bottom: 1px solid #e0e0e0; padding: 20px 0; }
.faq-item summary {
  font-size: 16px;
  color: var(--dark);
  letter-spacing: 1px;
  cursor: pointer;
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.faq-item summary::after { content: '+'; font-size: 20px; color: #ccc; }
.faq-item[open] summary::after { content: '−'; }
.faq-item p { padding-top: 12px; font-size: 14px; color: var(--text-light); line-height: 1.9; }

.cta-section { background: var(--dark); padding: 80px 0; text-align: center; color: #fff; }
.cta-content h2 { font-size: 30px; font-weight: 300; letter-spacing: 6px; margin-bottom: 12px; font-family: 'Noto Serif SC', serif; }
.cta-content p { font-size: 14px; color: rgba(255,255,255,0.6); letter-spacing: 2px; margin-bottom: 30px; }

@media (max-width: 768px) {
  .flow-grid { grid-template-columns: 1fr; }
  .feature-grid { grid-template-columns: 1fr; }
  .case-grid { grid-template-columns: 1fr; }
}
</style>
