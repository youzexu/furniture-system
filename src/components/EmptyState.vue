<script setup lang="ts">
withDefaults(defineProps<{ icon?: string; text?: string; action?: boolean }>(), {
  icon: '📭', text: '暂无数据', action: false,
})
</script>

<template>
  <div class="empty-state">
    <span class="empty-icon">{{ icon }}</span>
    <p>{{ text }}</p>
    <slot name="action" />
  </div>
</template>

<style scoped>
.empty-state { text-align: center; padding: 80px 20px; color: var(--text-muted); }
.empty-icon { font-size: 44px; display: block; margin-bottom: 12px; }
.empty-state p { font-size: 14px; }
</style>
