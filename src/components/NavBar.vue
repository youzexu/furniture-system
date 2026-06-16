<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import CartPop from './CartPop.vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const cart = useCartStore()
const showCartPop = ref(false)
const mobileMenuOpen = ref(false)
const scrolled = ref(false)

function onScroll() { scrolled.value = window.scrollY > 50 }
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

const navItems = [
  { path: '/', label: '首页' },
  { path: '/products', label: '产品' },
  { path: '/shop', label: '购买', badge: true },
  { path: '/factory', label: '工厂' },
  { path: '/about', label: '关于' },
  { path: '/custom', label: '定制' },
  { path: '/contact', label: '联系' },
]

function isActive(path: string): boolean {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
const showLogoutConfirm = ref(false)

async function handleLogout() {
  showLogoutConfirm.value = true
}

async function confirmLogout() {
  await auth.logout()
  showLogoutConfirm.value = false
  router.push('/')
}
</script>

<template>
  <header class="navbar" :class="{ scrolled }">
    <div class="navbar-inner">
      <router-link to="/" class="brand">
        <img src="/logo.svg" alt="尚品工坊" class="brand-logo" width="140" height="37" />
      </router-link>

      <nav class="nav-links" :class="{ 'mobile-open': mobileMenuOpen }">
        <router-link v-for="item in navItems" :key="item.path" :to="item.path" class="nav-link"
          :class="{ active: isActive(item.path) }" @click="mobileMenuOpen = false">
          {{ item.label }}
          <span v-if="item.badge && cart.totalItems" class="badge">{{ cart.totalItems }}</span>
        </router-link>
      </nav>

      <button class="hamburger" @click="mobileMenuOpen = !mobileMenuOpen">
        <span></span><span></span><span></span>
      </button>

      <!-- 认证区域 -->
      <div class="auth-area">
        <!-- 购物车 -->
        <div class="cart-menu">
          <div v-if="showCartPop" class="cart-backdrop" @click="showCartPop = false"></div>
          <button class="cart-trigger" @click="showCartPop = !showCartPop" title="购物车">
            🛒 <span v-if="cart.totalItems > 0" class="cart-badge">{{ cart.totalItems }}</span>
          </button>
          <div v-if="showCartPop" class="cart-pop" @click.stop>
            <div v-if="cart.totalItems === 0" class="cart-pop-empty">购物车是空的</div>
            <div v-else class="cart-pop-items">
              <div class="cart-pop-item" v-for="item in cart.items" :key="item.code">
                <span class="cip-name">{{ item.name }}</span>
                <span class="cip-qty">×{{ item.quantity }}</span>
                <span class="cip-price">¥{{ (item.priceNum * item.quantity).toLocaleString() }}</span>
                <button class="cip-del" @click="cart.removeItem(item.code)">✕</button>
              </div>
            </div>
            <div v-if="cart.totalItems > 0" class="cart-pop-total">合计 ¥{{ cart.totalPrice.toLocaleString() }}</div>
            <CartPop @checkout="showCartPop = false; cart.triggerCheckout(); $router.push('/shop')" />
          </div>
        </div>

        <template v-if="auth.isLoggedIn">
          <router-link to="/orders" class="orders-btn" title="我的订单">
            <img src="/NavBar/orders.svg" alt="订单" class="orders-icon" />
          </router-link>
          <router-link to="/profile" class="user-name">{{ auth.user?.first_name || auth.user?.username }}</router-link>
          <template v-if="!showLogoutConfirm">
            <button class="auth-btn" @click="handleLogout">退出</button>
          </template>
          <template v-else>
            <span class="logout-confirm-text">确定退出？</span>
            <button class="auth-btn-yes" @click="confirmLogout">退出</button>
            <button class="auth-btn-no" @click="showLogoutConfirm = false">取消</button>
          </template>
        </template>
        <template v-else>
          <router-link to="/login" class="auth-link">登录</router-link>
          <router-link to="/register" class="auth-btn-outline">注册</router-link>
        </template>
      </div>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: #fff;
  border-bottom: 1px solid #eee;
  height: 72px;
  transition: height .3s, box-shadow .3s;
}

.navbar.scrolled {
  height: 56px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, .08);
}

.navbar-inner {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  height: 100%;
}

.brand {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.brand-logo {
  height: 37px;
  width: auto;
  display: block;
}

.nav-links {
  display: flex;
  gap: 0;
}

.nav-link {
  padding: 10px 22px;
  font-size: 14px;
  color: var(--text-light);
  letter-spacing: 2px;
  transition: color 0.3s;
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background: var(--gold);
  transition: width 0.3s;
}

.nav-link:hover,
.nav-link.active {
  color: var(--gold);
}

.nav-link:hover::after,
.nav-link.active::after {
  width: 20px;
}

.badge {
  position: absolute;
  top: 2px;
  right: 4px;
  min-width: 18px;
  height: 18px;
  background: #c00;
  color: #fff;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0;
}

/* Auth area */
.auth-area {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.user-name {
  font-size: 13px;
  color: var(--text-light);
  letter-spacing: 1px;
}

.auth-link {
  font-size: 13px;
  color: var(--text-light);
  letter-spacing: 2px;
  transition: color 0.3s;
}

.auth-link:hover {
  color: var(--gold);
}

.auth-btn {
  font-size: 12px;
  color: var(--text-muted);
  letter-spacing: 1px;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.3s;
}

.auth-btn:hover {
  color: #c00;
}

.logout-confirm-text {
  font-size: 12px;
  color: var(--text-muted);
  letter-spacing: 1px;
}

.auth-btn-yes {
  font-size: 11px;
  padding: 4px 10px;
  background: #c00;
  color: #fff;
  border: none;
  cursor: pointer;
  font-family: inherit;
  letter-spacing: 1px;
  transition: background 0.3s;
}

.auth-btn-yes:hover {
  background: #a00;
}

.auth-btn-no {
  font-size: 11px;
  padding: 4px 10px;
  background: none;
  border: 1px solid #ddd;
  color: var(--text-muted);
  cursor: pointer;
  font-family: inherit;
  letter-spacing: 1px;
  transition: all 0.3s;
}

.auth-btn-no:hover {
  border-color: #999;
  color: #666;
}

.auth-btn-outline {
  padding: 6px 16px;
  font-size: 12px;
  color: var(--gold);
  border: 1px solid var(--gold);
  letter-spacing: 2px;
  transition: all 0.3s;
}

.auth-btn-outline:hover {
  background: var(--gold);
  color: #fff;
}

/* Cart popup */
.cart-menu {
  position: relative;
}

.cart-backdrop {
  position: fixed;
  inset: 0;
  z-index: 199;
}

.cart-trigger {
  background: none;
  border: 1px solid #eee;
  padding: 0;
  width: 42px;
  height: 36px;
  font-size: 16px;
  cursor: pointer;
  color: var(--text);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  font-family: inherit;
  position: relative;
}

.cart-trigger:hover {
  border-color: var(--gold);
  color: var(--gold);
}

.orders-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 36px;
  border: 1px solid #eee;
  font-size: 16px;
  color: var(--text);
  transition: all .3s;
  margin-right: 4px;
}

.orders-btn:hover {
  border-color: var(--gold);
  color: var(--gold);
}

.orders-icon {
  width: 20px;
  height: 20px;
  display: block;
}

.cart-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #c00;
  color: #fff;
  font-size: 10px;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-pop {
  position: absolute;
  top: 42px;
  right: 0;
  width: 340px;
  background: #fff;
  border: 1px solid #eee;
  z-index: 200;
  max-height: 460px;
  overflow-y: auto;
}

.cart-pop-items {
  padding: 12px 16px;
  max-height: 260px;
  overflow-y: auto;
}

.cart-pop-empty {
  padding: 30px 16px;
  text-align: center;
  font-size: 13px;
  color: var(--text-muted);
}

.cart-pop-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;
  font-size: 13px;
}

.cip-name {
  flex: 1;
  color: var(--text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cip-qty {
  color: var(--text-muted);
}

.cip-price {
  color: var(--gold);
  font-weight: 500;
  min-width: 70px;
  text-align: right;
}

.cip-del {
  background: none;
  border: none;
  color: #ccc;
  cursor: pointer;
  font-size: 12px;
  padding: 2px 4px;
}

.cip-del:hover {
  color: #c00;
}

.cart-pop-total {
  padding: 12px 16px;
  border-top: 1px solid #eee;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  color: var(--gold);
  font-weight: 500;

}

.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
}

.hamburger span {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--text);
  transition: all .3s;
}

@media (max-width:768px) {
  .hamburger {
    display: flex;
  }

  .nav-links {
    display: none;
    position: fixed;
    top: 72px;
    left: 0;
    right: 0;
    background: #fff;
    flex-direction: column;
    border-bottom: 1px solid #eee;
    padding: 0;
  }

  .nav-links.mobile-open {
    display: flex;
  }

  .auth-area {
    margin-left: auto;
  }
}
</style>
