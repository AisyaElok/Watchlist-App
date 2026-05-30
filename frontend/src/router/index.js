import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/', redirect: '/watchlist' },
  { path: '/login', component: () => import('../views/LoginView.vue'), meta: { guest: true } },
  { path: '/register', component: () => import('../views/RegisterView.vue'), meta: { guest: true } },
  { path: '/watchlist', component: () => import('../views/WatchlistView.vue'), meta: { requiresAuth: true } },
  { path: '/tambah', component: () => import('../views/TambahFilmView.vue'), meta: { requiresAuth: true } },
  { path: '/edit/:id', component: () => import('../views/EditFilmView.vue'), meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) return '/login'
  if (to.meta.guest && auth.isLoggedIn) return '/watchlist'
})

export default router
