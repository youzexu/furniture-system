<script setup lang="ts">
import { useCartStore } from '../stores/cart'
import { useRouter } from 'vue-router'

const emit = defineEmits<{ checkout: [] }>()
const cart = useCartStore()
const router = useRouter()

function goCheckout() {
  emit('checkout')
  router.push('/shop')
}
</script>

<template>
  <div v-if="cart.totalItems > 0" class="cart-pop-footer">
    <button class="checkout-btn" @click="goCheckout">去结算</button>
    <button class="clear-btn" @click="cart.clear()">清空</button>
  </div>
</template>

<style scoped>
.cart-pop-footer { display: flex; gap: 8px; padding: 12px 16px; border-top: 1px solid #eee; }
.checkout-btn { flex: 1; padding: 10px; background: var(--gold); color: #fff; border: none; font-size: 13px; letter-spacing: 3px; cursor: pointer; font-family: inherit; }
.checkout-btn:hover { background: #7a5c12; }
.clear-btn { padding: 10px 16px; background: none; border: 1px solid #eee; color: #999; font-size: 12px; letter-spacing: 2px; cursor: pointer; font-family: inherit; }
.clear-btn:hover { color: #c00; border-color: #c00; }
</style>
