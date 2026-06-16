<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
const message = ref('')
let timer: ReturnType<typeof setTimeout> | null = null

function show(msg: string, duration = 2000) {
  message.value = msg
  visible.value = true
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => visible.value = false, duration)
}

defineExpose({ show })
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="app-toast">{{ message }}</div>
  </Teleport>
</template>

<style scoped>
.app-toast {
  position: fixed; top: 90px; left: 50%; transform: translateX(-50%);
  background: var(--dark); color: #fff; padding: 12px 28px;
  font-size: 13px; letter-spacing: 3px; z-index: 999;
  animation: toastIn .3s ease;
}
@keyframes toastIn { from { opacity:0; transform:translateX(-50%) translateY(-10px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }
</style>
