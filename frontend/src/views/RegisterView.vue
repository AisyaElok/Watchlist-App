<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <h1 class="logo">LOKIIE<span> PICKS</span></h1>
        <p>Buat akun baru</p>
      </div>

      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label>Nama</label>
          <input v-model="form.name" type="text" placeholder="Nama kamu" required />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input v-model="form.email" type="email" placeholder="email@contoh.com" required />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input v-model="form.password" type="password" placeholder="Min. 6 karakter" minlength="6" required />
        </div>

        <p v-if="error" class="error-msg">{{ error }}</p>
        <p v-if="success" class="success-msg">{{ success }}</p>

        <button type="submit" class="btn-primary w-full" :disabled="loading">
          {{ loading ? 'Memproses...' : 'Daftar' }}
        </button>
      </form>

      <p class="switch-link">
        Sudah punya akun?
        <RouterLink to="/login">Masuk</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const form = ref({ name: '', email: '', password: '' })
const error = ref('')
const success = ref('')
const loading = ref(false)

async function handleRegister() {
  error.value = ''
  success.value = ''
  loading.value = true
  try {
    await auth.register(form.value.name, form.value.email, form.value.password)
    success.value = 'Registrasi berhasil! Mengalihkan ke halaman login...'
    setTimeout(() => router.push('/login'), 1500)
  } catch (err) {
    error.value = err.response?.data?.message || 'Registrasi gagal, coba lagi.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: radial-gradient(ellipse at 80% 50%, rgba(232,197,71,0.06) 0%, transparent 60%),
              radial-gradient(ellipse at 20% 20%, rgba(255,107,53,0.05) 0%, transparent 50%),
              var(--bg);
}
.auth-card {
  background: var(--card);
  border: 1.5px solid var(--border);
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.auth-header { text-align: center; }
.logo { font-family: var(--font-display); font-size: 2.2rem; letter-spacing: 3px; }
.logo span { color: var(--accent); }
.auth-header p { color: var(--muted); margin-top: 6px; font-size: 0.92rem; }
form { display: flex; flex-direction: column; gap: 16px; }
.w-full { width: 100%; text-align: center; }
.error-msg { color: var(--red); font-size: 0.87rem; }
.success-msg { color: var(--green); font-size: 0.87rem; }
.switch-link { text-align: center; font-size: 0.88rem; color: var(--muted); }
.switch-link a { color: var(--accent); font-weight: 600; }
.switch-link a:hover { text-decoration: underline; }
button:disabled { opacity: 0.6; cursor: not-allowed; }
</style>
