import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";
import ProductsPage from "../pages/ProductsPage.vue";
import FactoryPage from "../pages/FactoryPage.vue";
import CustomPage from "../pages/CustomPage.vue";
import ContactPage from "../pages/ContactPage.vue";
import LoginPage from "../pages/LoginPage.vue";
import RegisterPage from "../pages/RegisterPage.vue";

import ShopPage from "../pages/ShopPage.vue";

import OrdersPage from "../pages/OrdersPage.vue";
import ProfilePage from "../pages/ProfilePage.vue";
import AboutPage from "../pages/AboutPage.vue";
import ProductDetailPage from "../pages/ProductDetailPage.vue";

const routes = [
  { path: "/", name: "home", component: HomePage, meta: { title: "首页" } },
  {
    path: "/shop",
    name: "shop",
    component: ShopPage,
    meta: { title: "成品购买" },
  },
  {
    path: "/products",
    name: "products",
    component: ProductsPage,
    meta: { title: "产品" },
  },
  {
    path: "/products/:code",
    name: "product-detail",
    component: ProductDetailPage,
    meta: { title: "产品详情" },
  },
  {
    path: "/about",
    name: "about",
    component: AboutPage,
    meta: { title: "关于我们" },
  },
  {
    path: "/factory",
    name: "factory",
    component: FactoryPage,
    meta: { title: "工厂" },
  },
  {
    path: "/custom",
    name: "custom",
    component: CustomPage,
    meta: { title: "定制" },
  },
  {
    path: "/contact",
    name: "contact",
    component: ContactPage,
    meta: { title: "联系" },
  },
  {
    path: "/login",
    name: "login",
    component: LoginPage,
    meta: { title: "登录", guest: true },
  },
  {
    path: "/register",
    name: "register",
    component: RegisterPage,
    meta: { title: "注册", guest: true },
  },
  {
    path: "/orders",
    name: "orders",
    component: OrdersPage,
    meta: { title: "我的订单", requiresAuth: true },
  },
  {
    path: "/profile",
    name: "profile",
    component: ProfilePage,
    meta: { title: "个人中心", requiresAuth: true },
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
  document.title = (to.meta.title as string) ? `${to.meta.title} - 尚品工坊` : '尚品工坊 | 家具源头工厂'
})

export default router;
