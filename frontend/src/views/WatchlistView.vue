<template>
  <div>
    <Navbar />
    <main class="container main-content">

      <!-- Header -->
      <div class="page-header">
  <div>
    <h2 class="page-title">Watchlist <span>Kamu</span></h2>
    <p class="page-sub">{{ films.length }} judul tersimpan</p>
  </div>
  <div class="filter-group">
    <select v-model="filterStatus" class="filter-select">
      <option value="">Semua Status</option>
      <option value="Belum Ditonton">Belum Ditonton</option>
      <option value="Sedang Ditonton">Sedang Ditonton</option>
      <option value="Sudah Ditonton">Sudah Ditonton</option>
    </select>
    <select v-model="filterType" class="filter-select">
      <option value="">Semua Tipe</option>
      <option value="Film">Film</option>
      <option value="Series">Series</option>
    </select>
  </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="state-msg">Memuat data...</div>

      <!-- Empty -->
      <div v-else-if="filteredFilms.length === 0" class="empty-state">
        <div class="empty-icon">🎬</div>
        <h3>Watchlist masih kosong</h3>
        <p>Tambahkan film atau series favorit kamu!</p>
        <RouterLink to="/tambah" class="btn-primary" style="margin-top: 12px; display: inline-block;">
          + Tambah Sekarang
        </RouterLink>
      </div>

      <!-- Film Grid -->
      <div v-else class="film-grid">
        <div v-for="film in filteredFilms" :key="film.id" class="film-card">
          <div class="poster-wrap">
            <img
              v-if="film.poster_url"
              :src="film.poster_url"
              :alt="film.title"
              class="poster"
              @error="onImgError"
            />
            <div v-else class="poster-placeholder">🎬</div>
            <span :class="['badge type-badge', film.type === 'Film' ? 'badge-film' : 'badge-series']">
              {{ film.type }}
            </span>
          </div>
          <div class="card-body">
            <h3 class="film-title">{{ film.title }}</h3>
            <div class="film-meta">
              <span>{{ film.genre }}</span>
              <span class="dot">•</span>
              <span>{{ film.platform }}</span>
            </div>
            <div class="card-footer">
              <span :class="['badge', statusBadge(film.status)]">{{ film.status }}</span>
              <span v-if="film.rating" class="rating">⭐ {{ film.rating }}/10</span>
            </div>
            <div class="card-actions">
              <RouterLink :to="`/edit/${film.id}`" class="edit-btn" title="Edit">✏️</RouterLink>
              <button class="delete-btn" @click="deleteFilm(film.id)" title="Hapus">✕</button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Toast -->
    <div v-if="toast.show" :class="['toast', toast.type]">{{ toast.message }}</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Navbar from '../components/Navbar.vue'
import api from '../api'

const films = ref([])
const loading = ref(true)
const filterStatus = ref('')
const filterType = ref('')
const toast = ref({ show: false, message: '', type: '' })

const filteredFilms = computed(() => {
  return films.value.filter(f => {
    const statusMatch = !filterStatus.value || f.status === filterStatus.value
    const typeMatch = !filterType.value || f.type === filterType.value
    return statusMatch && typeMatch
  })
})

function statusBadge(status) {
  if (status === 'Belum Ditonton') return 'badge-belum'
  if (status === 'Sedang Ditonton') return 'badge-sedang'
  return 'badge-sudah'
}

function showToast(message, type = 'success') {
  toast.value = { show: true, message, type }
  setTimeout(() => { toast.value.show = false }, 3000)
}

function onImgError(e) {
  e.target.style.display = 'none'
  e.target.nextElementSibling?.remove()
  e.target.parentElement.innerHTML = '<div class="poster-placeholder">🎬</div>'
}

async function fetchFilms() {
  try {
    const res = await api.get('/films')
    films.value = res.data.data
  } catch {
    showToast('Gagal memuat data.', 'error')
  } finally {
    loading.value = false
  }
}

async function deleteFilm(id) {
  if (!confirm('Hapus film ini dari watchlist?')) return
  try {
    await api.delete(`/films/${id}`)
    films.value = films.value.filter(f => f.id !== id)
    showToast('Film berhasil dihapus.')
  } catch {
    showToast('Gagal menghapus film.', 'error')
  }
}

onMounted(fetchFilms)
</script>

<style scoped>
.main-content { padding: 40px 24px; }

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
}

.page-title {
  font-family: var(--font-display);
  font-size: 2.4rem;
  letter-spacing: 2px;
}
.page-title span { color: var(--accent); }
.page-sub { color: var(--muted); font-size: 0.9rem; margin-top: 4px; }

.filter-group { display: flex; gap: 10px; flex-wrap: wrap; }
.filter-select { width: auto; padding: 10px 14px; }

.state-msg { color: var(--muted); text-align: center; padding: 60px 0; }

.empty-state {
  text-align: center;
  padding: 80px 24px;
  color: var(--muted);
}
.empty-icon { font-size: 3rem; margin-bottom: 16px; }
.empty-state h3 { color: var(--text); font-size: 1.2rem; margin-bottom: 8px; }
.empty-state p { font-size: 0.9rem; }

.film-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.film-card {
  background: var(--card);
  border: 1.5px solid var(--border);
  border-radius: 14px;
  overflow: hidden;
  transition: transform 0.2s, border-color 0.2s;
  position: relative;
}
.film-card:hover { transform: translateY(-4px); border-color: rgba(232,197,71,0.4); }

.poster-wrap { position: relative; aspect-ratio: 2/3; background: var(--bg2); overflow: hidden; }
.poster { width: 100%; height: 100%; object-fit: cover; display: block; }
.poster-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: var(--border);
}

.type-badge {
  position: absolute;
  top: 10px;
  left: 10px;
}

.card-body { padding: 14px; position: relative; }
.film-title {
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.film-meta { font-size: 0.78rem; color: var(--muted); margin-bottom: 10px; display: flex; gap: 4px; }
.dot { color: var(--border); }
.card-footer { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px; }
.rating { font-size: 0.8rem; color: var(--accent); font-weight: 600; }

.card-actions {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 6px;
  opacity: 0;
  transition: opacity 0.2s;
}
.film-card:hover .card-actions { opacity: 1; }

.edit-btn {
  background: rgba(232,197,71,0.15);
  color: var(--accent);
  border: none;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: background 0.2s;
}
.edit-btn:hover { background: rgba(232,197,71,0.3); }

.delete-btn {
  background: rgba(255,71,87,0.15);
  color: var(--red);
  border: none;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.delete-btn:hover { background: rgba(255,71,87,0.3); }
</style>
