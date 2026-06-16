<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div class="not-found">
    <div class="nf-content">
      <span class="nf-code">404</span>
      <h1>页面不存在</h1>
      <p>您访问的页面可能已被移除或地址输入有误</p>
      <div class="nf-actions">
        <button class="btn-primary" @click="router.push('/')">返回首页</button>
        <button class="btn-outline" @click="router.back()">返回上一页</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-warm, #fafaf8);
  padding-top: 72px;
}
.nf-content {
  text-align: center;
  padding: 60px 40px;
}
.nf-code {
  font-size: 120px;
  font-weight: 300;
  color: var(--gold-light, #c9a84c);
  display: block;
  line-height: 1;
  font-family: 'Georgia', serif;
}
.nf-content h1 {
  font-size: 24px;
  color: var(--dark, #1a1a1a);
  font-weight: 400;
  letter-spacing: 4px;
  margin: 16px 0 12px;
  font-family: 'Noto Serif SC', serif;
}
.nf-content p {
  font-size: 14px;
  color: var(--text-muted, #999);
  letter-spacing: 2px;
  margin-bottom: 32px;
}
.nf-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}
.btn-primary {
  padding: 12px 32px;
  background: var(--gold, #8b6914);
  color: #fff;
  border: none;
  font-size: 14px;
  letter-spacing: 3px;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.3s;
}
.btn-primary:hover { background: #7a5c12; }
.btn-outline {
  padding: 12px 32px;
  border: 1px solid var(--gold, #8b6914);
  color: var(--gold, #8b6914);
  background: transparent;
  font-size: 14px;
  letter-spacing: 3px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.3s;
}
.btn-outline:hover { background: var(--gold, #8b6914); color: #fff; }
</style>
