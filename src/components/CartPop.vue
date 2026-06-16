<script setup lang="ts">
import { ref } from 'vue'
import { useCartStore } from '../stores/cart'

const cart = useCartStore()
const showClearConfirm = ref(false)

const emit = defineEmits<{ checkout: [] }>()
</script>

<template>
  <div class="cart-menu">
    <div v-if="showClearConfirm" class="cart-pop-confirm">
      <span>确定清空？</span>
      <button class="pop-yes" @click="cart.clear(); showClearConfirm = false">清空</button>
      <button class="pop-no" @click="showClearConfirm = false">取消</button>
    </div>
    <div v-else-if="cart.totalItems > 0" class="cart-pop-actions">
      <button class="pop-clear" @click="showClearConfirm = true">清空</button>
      <button class="pop-checkout" @click="emit('checkout')">去结算</button>
    </div>
  </div>
</template>

<style scoped>
.cart-pop-confirm { display: flex; align-items: center; gap: 8px; padding: 12px 16px; border-top: 1px solid #eee; font-size: 13px; color: var(--text); }
.cart-pop-confirm span { flex: 1; }
.pop-yes { padding: 6px 16px; background: #c00; color: #fff; border: none; font-size: 12px; cursor: pointer; font-family: inherit; }
.pop-yes:hover { background: #a00; }
.pop-no { padding: 6px 16px; background: none; border: 1px solid #ddd; color: var(--text-muted); font-size: 12px; cursor: pointer; font-family: inherit; }
.pop-no:hover { border-color: #999; color: #666; }
.cart-pop-actions { display: flex; gap: 8px; padding: 0 16px 14px; }
.pop-clear { flex: 1; padding: 10px; background: none; border: 1px solid #eee; color: var(--text-muted); font-size: 12px; letter-spacing: 1px; cursor: pointer; font-family: inherit; transition: all .3s; }
.pop-clear:hover { color: #c00; border-color: #fcc; }
.pop-checkout { flex: 2; padding: 10px; background: var(--gold); color: #fff; text-align: center; font-size: 13px; letter-spacing: 2px; display: block; cursor: pointer; transition: background .3s; border: none; font-family: inherit; }
.pop-checkout:hover { background: #7a5c12; }
</style>
