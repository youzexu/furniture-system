<script setup lang="ts">
</script>

<template>
  <footer class="app-footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <img src="/logo-vertical.svg" alt="尚品工坊" class="footer-logo" width="160" height="100" />
        <p class="footer-desc">源头工厂 · 高端定制 · 品质保证</p>
      </div>
      <div class="footer-links">
        <div class="footer-col">
          <h4>导航</h4>
          <router-link to="/">首页</router-link>
          <router-link to="/products">产品</router-link>
          <router-link to="/factory">工厂</router-link>
          <router-link to="/custom">定制</router-link>
          <router-link to="/contact">联系</router-link>
        </div>
        <div class="footer-col">
          <h4>产品系列</h4>
          <span>客厅家具</span>
          <span>餐厅家具</span>
          <span>卧室家具</span>
          <span>办公家具</span>
          <span>酒店工程</span>
        </div>
        <div class="footer-col">
          <h4>联系方式</h4>
          <span>400-888-6688</span>
          <span>info@shangpin.com</span>
          <span>佛山顺德龙江工业大道 188 号</span>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2025 尚品工坊家具制造有限公司 All Rights Reserved</span>
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
.footer-brand { flex-shrink: 0; }
.footer-logo {
  height: 100px;
  width: auto;
  display: block;
  margin-bottom: 8px;
}
.footer-desc { margin-top: 8px; font-size: 13px; color: #666; letter-spacing: 1px; }
.footer-links { display: flex; gap: 60px; flex: 1; }
.footer-col h4 { color: #ccc; font-size: 14px; margin-bottom: 16px; font-weight: 500; letter-spacing: 2px; }
.footer-col a, .footer-col span { display: block; color: #777; font-size: 13px; margin-bottom: 10px; transition: color 0.3s; }
.footer-col a:hover { color: var(--gold); }
.footer-bottom {
  margin-top: 50px;
  padding: 20px 40px;
  border-top: 1px solid rgba(255,255,255,0.08);
  text-align: center;
  font-size: 12px;
  color: #555;
}
</style>
