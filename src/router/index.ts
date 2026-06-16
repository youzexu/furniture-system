import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/", name: "home",
    component: () => import(/* webpackPrefetch: true */ "../pages/HomePage.vue"),
    meta: { title: "首页" },
  },
  {
    path: "/shop", name: "shop",
    component: () => import(/* webpackPrefetch: true */ "../pages/ShopPage.vue"),
    meta: { title: "成品购买" },
  },
  {
    path: "/products", name: "products",
    component: () => import(/* webpackPrefetch: true */ "../pages/ProductsPage.vue"),
    meta: { title: "产品" },
  },
  {
    path: "/products/:code", name: "product-detail",
    component: () => import("../pages/ProductDetailPage.vue"),
    meta: { title: "产品详情" },
  },
  {
    path: "/about", name: "about",
    component: () => import("../pages/AboutPage.vue"),
    meta: { title: "关于我们" },
  },
  {
    path: "/factory", name: "factory",
    component: () => import("../pages/FactoryPage.vue"),
    meta: { title: "工厂" },
  },
  {
    path: "/custom", name: "custom",
    component: () => import("../pages/CustomPage.vue"),
    meta: { title: "定制" },
  },
  {
    path: "/contact", name: "contact",
    component: () => import("../pages/ContactPage.vue"),
    meta: { title: "联系" },
  },
  {
    path: "/login", name: "login",
    component: () => import("../pages/LoginPage.vue"),
    meta: { title: "登录", guest: true },
  },
  {
    path: "/register", name: "register",
    component: () => import("../pages/RegisterPage.vue"),
    meta: { title: "注册", guest: true },
  },
  {
    path: "/orders", name: "orders",
    component: () => import("../pages/OrdersPage.vue"),
    meta: { title: "我的订单", requiresAuth: true },
  },
  {
    path: "/profile", name: "profile",
    component: () => import("../pages/ProfilePage.vue"),
    meta: { title: "个人中心", requiresAuth: true },
  },
  {
    path: "/:pathMatch(.*)*", name: "not-found",
    component: () => import("../pages/NotFoundPage.vue"),
    meta: { title: "页面不存在" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

// 路由守卫
import { useAuthStore } from "../stores/auth";
import { API_BASE } from "../api";
router.beforeEach((to, _from, next) => {
  try {
    const auth = useAuthStore();

    // 已登录用户访问登录/注册页 → 跳首页
    if (to.meta.guest && auth.isLoggedIn) {
      return next("/");
    }

    // 需认证页面（未来扩展） → 未登录跳转登录
    if (to.meta.requiresAuth && !auth.isLoggedIn) {
      return next(`/login?redirect=${to.fullPath}`);
    }
  } catch {
    // Pinia 未就绪时直接放行
  }

  next();
});

router.afterEach((to) => {
  const name = (to.meta.title as string) || ''
  document.title = name ? `${name} - 尚品工坊` : '尚品工坊 | 家具源头工厂 · 高端定制专家'

  // Update meta description from SEO config (loaded once)
  const seoData = (window as any).__seoConfig
  if (seoData) {
    const key = to.name as string
    const desc = seoData[`${key}_desc`] || seoData.home_desc || ''
    const meta = document.querySelector('meta[name="description"]')
    if (meta && desc) meta.setAttribute('content', desc)
  }
})

// Load SEO config
fetch(`${API_BASE}/api/seo-config/`).then(r => r.json()).then(d => {
  if (d.success) (window as any).__seoConfig = d.data
}).catch(() => {})

export default router;
