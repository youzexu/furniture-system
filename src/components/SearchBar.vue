<script setup lang="ts">
import { ref } from 'vue'

const query = ref('')
let timer: ReturnType<typeof setTimeout> | null = null

const emit = defineEmits<{ search: [value: string] }>()
const props = withDefaults(defineProps<{ placeholder?: string; debounce?: number }>(), {
  placeholder: '搜索产品...',
  debounce: 600,
})

function onInput() {
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => emit('search', query.value), props.debounce)
}
</script>

<template>
  <div class="search-bar">
    <input v-model="query" type="text" :placeholder="placeholder" @input="onInput" />
  </div>
</template>

<style scoped>
.search-bar { max-width: 360px; margin: 16px auto 0; }
.search-bar input {
  width: 100%; padding: 10px 16px; border: none; border-bottom: 1px solid #ddd;
  font-size: 14px; color: var(--text); outline: none; background: transparent;
  text-align: center; letter-spacing: 1px; font-family: inherit; transition: border-color 0.3s;
}
.search-bar input:focus { border-bottom-color: var(--gold); }
.search-bar input::placeholder { color: #ccc; letter-spacing: 2px; }
</style>
