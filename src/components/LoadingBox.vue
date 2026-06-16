<script setup lang="ts">
defineProps<{ text?: string }>()
</script>

<template>
  <div class="loading-box">
    <span class="loading-spin">⏳</span>
    <p>{{ text || '加载中...' }}</p>
  </div>
</template>

<style scoped>
.loading-box { text-align: center; padding: 80px 20px; color: var(--text-muted); }
.loading-spin { font-size: 44px; display: block; margin-bottom: 12px; animation: pulse 1.5s infinite; }
.loading-box p { font-size: 14px; }
@keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:1} }
</style>
