<template>
  <div>
    <Navbar />
    <main class="container main-content">
      <div class="form-page">

        <div class="form-header">
          <h2 class="page-title">Tambah <span>Film/Series</span></h2>
          <p class="page-sub">Masukin judul baru ke watchlist kamu</p>
        </div>

        <div class="form-layout">
          <!-- Preview Poster -->
          <div class="preview-side">
            <div class="poster-preview">
              <img v-if="previewUrl" :src="previewUrl" alt="preview" @error="previewUrl = ''" />
              <div v-else class="preview-placeholder">
                <span>🎬</span>
                <p>Preview poster</p>
              </div>
            </div>
            <p class="preview-hint">Isi URL poster di bawah untuk preview</p>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="film-form">
            <div class="form-row">
              <div class="form-group">
                <label>Judul *</label>
                <input v-model="form.title" type="text" placeholder="Judul film atau series" required />
              </div>
            </div>

            <div class="form-row two-col">
              <div class="form-group">
                <label>Tipe *</label>
                <select v-model="form.type" required>
                  <option value="Film">Film</option>
                  <option value="Series">Series</option>
                </select>
              </div>
              <div class="form-group">
                <label>Platform *</label>
                <select v-model="form.platform" required>
                  <option value="">Pilih platform</option>
                  <option>Netflix</option>
                  <option>Disney+</option>
                  <option>Viu</option>
                  <option>Apple TV+</option>
                  <option>HBO Max</option>
                  <option>Hulu</option>
                  <option>Bioskop</option>
                  <option>YouTube</option>
                  <option>Lainnya</option>
                </select>
              </div>
            </div>

            <!-- Genre Checkbox -->
            <div class="form-group">
              <label>Genre * <span class="genre-hint">(pilih 1 atau lebih)</span></label>
              <div class="genre-grid">
                <label v-for="g in genreOptions" :key="g" class="genre-check">
                  <input type="checkbox" :value="g" v-model="selectedGenres" />
                  {{ g }}
                </label>
              </div>
              <p v-if="genreError" class="error-msg">Pilih minimal 1 genre.</p>
            </div>

            <div class="form-row two-col">
              <div class="form-group">
                <label>Status</label>
                <select v-model="form.status">
                  <option value="Belum Ditonton">Belum Ditonton</option>
                  <option value="Sedang Ditonton">Sedang Ditonton</option>
                  <option value="Sudah Ditonton">Sudah Ditonton</option>
                </select>
              </div>
              <div class="form-group">
                <label>Rating (1–10)</label>
                <input v-model.number="form.rating" type="number" min="1" max="10" placeholder="Opsional" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>URL Poster</label>
                <input v-model="form.poster_url" type="url" placeholder="https://..." @input="updatePreview" />
              </div>
            </div>

            <p v-if="error" class="error-msg">{{ error }}</p>

            <div class="form-actions">
              <RouterLink to="/watchlist" class="btn-outline">Batal</RouterLink>
              <button type="submit" class="btn-primary" :disabled="loading">
                {{ loading ? 'Menyimpan...' : '+ Tambahkan' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>

    <div v-if="toast.show" :class="['toast', toast.type]">{{ toast.message }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import api from '../api'

const router = useRouter()

const genreOptions = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime',
  'Documentary', 'Drama', 'Fantasy', 'Horror', 'Mystery',
  'Romance', 'Youth','Sci-Fi', 'Thriller', 'Fight'
]

const form = ref({
  title: '',
  type: 'Film',
  platform: '',
  status: 'Belum Ditonton',
  rating: '',
  poster_url: '',
})

const selectedGenres = ref([])
const genreError = ref(false)
const previewUrl = ref('')
const error = ref('')
const loading = ref(false)
const toast = ref({ show: false, message: '', type: '' })

function updatePreview() {
  previewUrl.value = form.value.poster_url
}

function showToast(message, type = 'success') {
  toast.value = { show: true, message, type }
  setTimeout(() => { toast.value.show = false }, 3000)
}

async function handleSubmit() {
  error.value = ''
  genreError.value = false

  if (selectedGenres.value.length === 0) {
    genreError.value = true
    return
  }

  loading.value = true
  try {
    const payload = { ...form.value }
    payload.genre = selectedGenres.value.join(',')
    if (!payload.rating) delete payload.rating
    if (!payload.poster_url) delete payload.poster_url

    await api.post('/films', payload)
    showToast('Film berhasil ditambahkan!')
    setTimeout(() => router.push('/watchlist'), 1200)
  } catch (err) {
    error.value = err.response?.data?.message || 'Gagal menambahkan film.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.main-content { padding: 40px 24px; }
.form-page { max-width: 900px; margin: 0 auto; }

.page-title { font-family: var(--font-display); font-size: 2.2rem; letter-spacing: 2px; }
.page-title span { color: var(--accent); }
.page-sub { color: var(--muted); font-size: 0.9rem; margin-top: 4px; margin-bottom: 32px; }

.form-layout { display: grid; grid-template-columns: 220px 1fr; gap: 40px; align-items: start; }

@media (max-width: 640px) {
  .form-layout { grid-template-columns: 1fr; }
}

.preview-side { display: flex; flex-direction: column; align-items: center; gap: 10px; }
.poster-preview {
  width: 100%;
  aspect-ratio: 2/3;
  background: var(--card);
  border: 1.5px solid var(--border);
  border-radius: 14px;
  overflow: hidden;
}
.poster-preview img { width: 100%; height: 100%; object-fit: cover; display: block; }
.preview-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: var(--muted);
  font-size: 0.85rem;
}
.preview-placeholder span { font-size: 2.5rem; }
.preview-hint { font-size: 0.78rem; color: var(--muted); text-align: center; }

.film-form { display: flex; flex-direction: column; gap: 18px; }
.form-row { display: flex; flex-direction: column; gap: 18px; }
.two-col { flex-direction: row; gap: 16px; }
.two-col > * { flex: 1; }

@media (max-width: 500px) {
  .two-col { flex-direction: column; }
}

.genre-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 8px;
  padding: 12px;
  background: var(--card);
  border: 1.5px solid var(--border);
  border-radius: 10px;
}

.genre-check {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  color: var(--text);
}

.genre-check input[type="checkbox"] {
  accent-color: var(--accent);
  width: 14px;
  height: 14px;
}

.genre-hint {
  font-size: 0.78rem;
  color: var(--muted);
  font-weight: normal;
}

.error-msg { color: var(--red); font-size: 0.87rem; }

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}
</style>