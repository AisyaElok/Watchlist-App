<template>
  <nav class="navbar">
    <div class="container nav-inner">
      <RouterLink to="/watchlist" class="logo">LOKIIE<span> PICKS</span></RouterLink>
      <div class="nav-links">
        <RouterLink to="/watchlist" class="nav-link">Beranda</RouterLink>
        <RouterLink to="/tambah" class="nav-link">+ Tambah</RouterLink>
      </div>
      <div class="nav-actions">
        <span class="welcome">Halo, {{ auth.user?.name }} 👋</span>
        <button class="btn-outline logout-btn" @click="handleLogout">Keluar</button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  background: rgba(10,10,15,0.95);
  border-bottom: 1px solid var(--border);
  padding: 14px 0;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
}
.nav-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
}
.logo {
  font-family: var(--font-display);
  font-size: 1.6rem;
  letter-spacing: 2px;
  color: var(--text);
  flex-shrink: 0;
}
.logo span { color: var(--accent); }
.nav-links {
  display: flex;
  gap: 4px;
  flex: 1;
  padding-left: 32px;
}
.nav-link {
  color: var(--muted);
  font-size: 0.9rem;
  padding: 8px 16px;
  border-radius: 8px;
  transition: color 0.2s, background 0.2s;
  font-weight: 500;
}
.nav-link:hover {
  color: var(--accent);
  background: rgba(255,255,255,0.06);
}
.nav-link.router-link-active {
  color: var(--accent);
  background: rgba(232,197,71,0.08);
}
.nav-actions {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
}
.welcome { font-size: 0.88rem; color: var(--muted); }
.logout-btn { padding: 9px 18px; font-size: 0.88rem; }
</style>