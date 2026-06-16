<script setup lang="ts">
defineProps<{ label: string; title: string; sub?: string }>()
</script>

<template>
  <section class="page-banner">
    <div>
      <p class="banner-label">{{ label }}</p>
      <h1>{{ title }}</h1>
      <p v-if="sub" class="banner-sub">{{ sub }}</p>
    </div>
  </section>
</template>

<style scoped>
.page-banner {
  height: 320px; background: var(--dark); display: flex; align-items: center;
  justify-content: center; text-align: center; color: #fff; margin-top: 72px;
}
.banner-label { font-size: 12px; letter-spacing: 6px; color: var(--gold-light); margin-bottom: 12px; }
.page-banner h1 { font-size: 44px; font-weight: 300; letter-spacing: 8px; font-family: 'Noto Serif SC',serif; margin-bottom: 12px; }
.banner-sub { font-size: 15px; color: rgba(255,255,255,.6); letter-spacing: 2px; }
</style>
