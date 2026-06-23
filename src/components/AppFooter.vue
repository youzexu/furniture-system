<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { API_BASE } from '../api'
import { request } from '../utils/request'

const site = ref({ phone: '400-888-6688', email: 'info@shangpin.com', address: '佛山顺德龙江工业大道 188 号', company_name: '尚品工坊' })

onMounted(async () => {
  try {
    const res = await request(`${API_BASE}/api/site-config/`)
    const data = await res.json()
    if (data.success) site.value = data.data
  } catch {}
})
</script>

<template>
  <footer class="app-footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <img src="/logo-vertical.svg" :alt="site.company_name" class="footer-logo" width="160" height="100" />
        <p class="footer-desc">源头工厂 · 高端定制 · 品质保证</p>
      </div>
      <div class="footer-links">
        <div class="footer-col">
          <h4>导航</h4>
          <router-link to="/">首页</router-link>
          <router-link to="/products">产品</router-link>
          <router-link to="/shop">成品购买</router-link>
          <router-link to="/factory">工厂</router-link>
          <router-link to="/about">关于我们</router-link>
          <router-link to="/custom">定制</router-link>
          <router-link to="/contact">联系</router-link>
        </div>
        <div class="footer-col">
          <h4>产品系列</h4>
          <router-link to="/products?cat=living">客厅家具</router-link>
          <router-link to="/products?cat=dining">餐厅家具</router-link>
          <router-link to="/products?cat=bedroom">卧室家具</router-link>
          <router-link to="/products?cat=office">办公家具</router-link>
          <router-link to="/products?cat=hotel">酒店工程</router-link>
        </div>
        <div class="footer-col">
          <h4>联系方式</h4>
          <span>{{ site.phone }}</span>
          <span>{{ site.email }}</span>
          <span>{{ site.address }}</span>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© {{ new Date().getFullYear() }} {{ site.company_name }}家具制造有限公司 All Rights Reserved</span>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background: var(--dark);
  color: #999;
  padding-top: 60px;
}

.footer-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  gap: 80px;
}

.footer-brand {
  flex-shrink: 0;
}

.footer-logo {
  height: 100px;
  width: auto;
  display: block;
  margin-bottom: 8px;
}

.footer-desc {
  margin-top: 8px;
  font-size: 13px;
  color: #666;
  letter-spacing: 1px;
}

.footer-links {
  display: flex;
  gap: 60px;
  flex: 1;
}

.footer-col h4 {
  color: #ccc;
  font-size: 14px;
  margin-bottom: 16px;
  font-weight: 500;
  letter-spacing: 2px;
}

.footer-col a,
.footer-col span {
  display: block;
  color: #777;
  font-size: 13px;
  margin-bottom: 10px;
  transition: color 0.3s;
}

.footer-col a:hover {
  color: var(--gold);
}

.footer-bottom {
  margin-top: 50px;
  padding: 20px 40px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  text-align: center;
  font-size: 12px;
  color: #555;
}
</style>
