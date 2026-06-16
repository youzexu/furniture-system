<script setup lang="ts">
const props = defineProps<{ src: string; alt?: string; fallback?: string }>()

function onError(e: Event) {
  const img = e.target as HTMLImageElement
  if (props.fallback) img.src = props.fallback
  else img.style.display = 'none'
}
</script>

<template>
  <img v-if="src" :src="src" :alt="alt || ''" class="image-box" @error="onError" loading="lazy" />
  <span v-else class="image-fallback">{{ (alt || '?')[0] }}</span>
</template>

<style scoped>
.image-box { width: 100%; height: 100%; object-fit: cover; display: block; }
.image-fallback { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; background: var(--bg-warm); font-size: 48px; color: #ddd; font-weight: 600; }
</style>
