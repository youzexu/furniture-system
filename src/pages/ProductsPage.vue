<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useReveal } from '../composables/useReveal'

const { addReveal } = useReveal()
const visible = ref(false)
onMounted(() => { setTimeout(() => visible.value = true, 100) })

const activeCat = ref('all')
const activeDetail = ref<string | null>(null)

const categories = [
  { key: 'all', label: '全部产品' },
  { key: 'living', label: '客厅系列' },
  { key: 'dining', label: '餐厅系列' },
  { key: 'bedroom', label: '卧室系列' },
  { key: 'study', label: '书房系列' },
  { key: 'hotel', label: '酒店工程' },
  { key: 'office', label: '办公系列' },
]

interface Product {
  cat: string; name: string; code: string; material: string
  size: string; price: string; desc: string; details: string[]
}

const products: Product[] = [
  { cat:'living', name:'意式极简真皮沙发', code:'SP-SF-8801', material:'进口头层牛皮 / 白蜡木框架 / 高密度回弹海绵', size:'280×95×75cm（三人位）', price:'¥ 12,800', desc:'意大利设计师操刀，极简线条搭配顶级牛皮触感', details:['头层牛皮接触面','实木框架终身质保','48 种皮色可选','支持尺寸定制'] },
  { cat:'living', name:'轻奢岩板组合茶几', code:'SP-CT-3302', material:'12mm 天然岩板 / 钛金不锈钢脚 / 双层设计', size:'130×70×42cm', price:'¥ 5,600', desc:'岩板耐高温防刮花，金属质感彰显轻奢品位', details:['意大利拉米娜岩板','承重 200kg','无缝拼接工艺','圆角/方角可选'] },
  { cat:'living', name:'新中式胡桃木电视柜', code:'SP-TV-5506', material:'北美黑胡桃木 / 黄铜拉手', size:'220×45×50cm', price:'¥ 8,900', desc:'传统榫卯工艺与现代设计融合，收纳与美观兼备', details:['纯实木打造','抽屉静音滑轨','线缆收纳设计','可定制长度'] },
  { cat:'living', name:'意式极简单人休闲椅', code:'SP-LC-1109', material:'进口科技布 / 不锈钢脚', size:'80×78×95cm', price:'¥ 3,600', desc:'符合人体工学的靠背弧度，适合阅读与休憩', details:['360° 旋转底座','52 色科技布可选','SGS 气压杆','承重 150kg'] },
  { cat:'dining', name:'意式岩板伸缩餐桌', code:'SP-DT-7703', material:'12mm 岩板 / 碳钢底座', size:'160-220×90×75cm', price:'¥ 7,200', desc:'伸缩设计适配不同用餐场景，岩板易清洁', details:['双向伸缩 30cm','磁吸锁扣设计','8 款底座可选','含 6 把椅子套装'] },
  { cat:'dining', name:'轻奢皮质餐椅（6把装）', code:'SP-DC-4408S', material:'超纤皮 / 不锈钢脚', size:'48×52×85cm', price:'¥ 12,800/套', desc:'高密度海绵填充，久坐不塌陷，6 色可选', details:['超纤皮耐水解','不锈钢电镀脚','防滑脚垫','单把起订'] },
  { cat:'dining', name:'现代简约餐边柜', code:'SP-CB-6601', material:'烟熏橡木 / 金属腿 / 岩板台面', size:'180×42×85cm', price:'¥ 9,600', desc:'大容量收纳 + 展示区，餐厅空间整理利器', details:['4 抽屉 + 2 柜门','内置红酒架','LED 氛围灯','可定制尺寸'] },
  { cat:'bedroom', name:'轻奢真皮软包床', code:'SP-BD-9902', material:'头层牛皮 / 实木框架 / 独立袋装弹簧', size:'200×220×110cm（1.8m）', price:'¥ 11,500', desc:'高靠背软包设计，倚靠阅读舒适惬意', details:['头层牛皮软包','静音排骨架','8cm 加厚床垫','1.5m/1.8m/2.0m'] },
  { cat:'bedroom', name:'意式极简床头柜', code:'SP-BT-3305', material:'胡桃木 / 岩板台面 / 黄铜脚', size:'55×45×50cm', price:'¥ 3,200', desc:'双抽屉收纳，岩板台面耐磨防水', details:['静音阻尼滑轨','岩板耐高温','黄铜实心脚','多色可选'] },
  { cat:'bedroom', name:'步入式衣帽间系统', code:'SP-WD-8800', material:'多层实木 / 铝合金框架 / 钢化玻璃', size:'按现场定制', price:'¥ 28,000 起', desc:'模块化设计，灵活组合，最大化利用空间', details:['免费上门测量','3D 效果图设计','含安装服务','10年质保'] },
  { cat:'study', name:'新中式黑胡桃书桌', code:'SP-SD-5503', material:'北美黑胡桃木 / 黄铜配件', size:'160×70×76cm', price:'¥ 6,800', desc:'极简线条搭配实木温润质感，打造专注空间', details:['纯实木制作','隐藏式线槽','黄铜桌角','140/160/180cm'] },
  { cat:'study', name:'极简组合书柜', code:'SP-BK-6607', material:'北美白橡木 / 钢化玻璃门', size:'240×35×200cm（可组合）', price:'¥ 10,500', desc:'模块化书柜，自由组合，满足藏书与展示需求', details:['可组合扩展','LED 层板灯','玻璃/实木门选择','单组可购'] },
  { cat:'hotel', name:'酒店客房整装方案', code:'SP-HT-9000', material:'按项目定制', size:'按房型设计', price:'按方案报价', desc:'从标准间到总统套房，提供一站式家具配套服务', details:['专属项目经理','样板间打样','批量生产周期 30 天','全国上门安装'] },
  { cat:'office', name:'智能升降办公桌', code:'SP-OD-1500', material:'环保 E1 级板材 / 双电机升降柱', size:'140×70×72-120cm', price:'¥ 4,800', desc:'双电机平稳升降，坐站交替健康办公', details:['双电机驱动','4 档记忆高度','遇阻回弹保护','120/140/160cm'] },
]

const filtered = computed(() => activeCat.value === 'all' ? products : products.filter(p => p.cat === activeCat.value))
const activeProduct = computed(() => activeDetail.value ? products.find(p => p.code === activeDetail.value) : null)
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
      </div>
    </section>

    <!-- 产品网格 -->
    <section class="section reveal" style="padding-top: 0" :ref="addReveal">
      <div class="container">
        <div class="product-grid">
          <div class="product-card" v-for="p in filtered" :key="p.code" @click="activeDetail = p.code">
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

    <!-- 详情弹窗 -->
    <Teleport to="body">
      <div v-if="activeProduct" class="detail-overlay" @click.self="activeDetail = null">
        <div class="detail-modal">
          <button class="detail-close" @click="activeDetail = null">✕</button>
          <div class="detail-grid">
            <div class="detail-image">
              <img :src="'/images/products/' + activeProduct.code + '.svg'" :alt="activeProduct.name" class="product-img" />
            </div>
            <div class="detail-info">
              <p class="detail-code">{{ activeProduct.code }}</p>
              <h2>{{ activeProduct.name }}</h2>
              <p class="detail-desc">{{ activeProduct.desc }}</p>
              <div class="detail-table">
                <div class="detail-row"><span>材质</span><span>{{ activeProduct.material }}</span></div>
                <div class="detail-row"><span>尺寸</span><span>{{ activeProduct.size }}</span></div>
                <div class="detail-row"><span>参考价</span><span class="gold">{{ activeProduct.price }}</span></div>
              </div>
              <ul class="detail-features">
                <li v-for="d in activeProduct.details" :key="d">✓ {{ d }}</li>
              </ul>
              <router-link to="/contact" class="btn-primary" style="margin-top:20px">咨询此产品</router-link>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

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

/* Detail Modal */
.detail-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}
.detail-modal {
  background: #fff;
  max-width: 960px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  position: relative;
  padding: 50px;
}
.detail-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 22px;
  color: #999;
  cursor: pointer;
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
}
.detail-close:hover { color: #333; }
.detail-grid { display: flex; gap: 50px; }
.detail-image { flex: 1; }
.detail-info { flex: 1; }
.detail-code { font-size: 11px; color: #ccc; letter-spacing: 2px; margin-bottom: 8px; }
.detail-info h2 { font-size: 26px; font-weight: 400; color: var(--dark); letter-spacing: 3px; margin-bottom: 12px; font-family: 'Noto Serif SC', serif; }
.detail-desc { font-size: 14px; color: var(--text-light); line-height: 1.8; margin-bottom: 24px; }
.detail-table { margin-bottom: 24px; }
.detail-row {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 13px;
}
.detail-row span:first-child { color: #999; width: 80px; flex-shrink: 0; letter-spacing: 2px; }
.detail-row span:last-child { color: var(--text); }
.gold { color: var(--gold) !important; font-weight: 500; }
.detail-features { list-style: none; }
.detail-features li { padding: 6px 0; font-size: 13px; color: var(--text-light); }

.cta-section { background: var(--dark); padding: 80px 0; text-align: center; color: #fff; }
.cta-content h2 { font-size: 30px; font-weight: 300; letter-spacing: 6px; margin-bottom: 12px; font-family: 'Noto Serif SC', serif; }
.cta-content p { font-size: 14px; color: rgba(255,255,255,0.6); letter-spacing: 2px; margin-bottom: 30px; }

@media (max-width: 768px) {
  .product-grid { grid-template-columns: 1fr; }
  .filter-bar { flex-wrap: wrap; }
  .detail-grid { flex-direction: column; }
  .detail-modal { padding: 24px; }
}
</style>
