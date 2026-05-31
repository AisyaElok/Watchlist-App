const express = require('express')
const router = express.Router()
const db = require('../config/database')
const authMiddleware = require('../middleware/auth')

// GET /api/films/all — semua film semua user (admin)
router.get('/all', async (req, res) => {
  try {
    const filmsSnap = await db.ref('films').once('value')
    const usersSnap = await db.ref('users').once('value')
    const users = {}
    usersSnap.forEach(u => { users[u.key] = u.val() })
    const films = []
    filmsSnap.forEach(child => {
      const f = child.val()
      films.push({
        id: child.key, ...f,
        user_name: users[f.user_id]?.name || '-',
        user_email: users[f.user_id]?.email || '-'
      })
    })
    films.sort((a, b) => b.created_at - a.created_at)
    res.json({ data: films })
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data.' })
  }
})

router.use(authMiddleware)

// GET /api/films
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.ref('films').orderByChild('user_id').equalTo(req.user.id).once('value')
    const films = []
    snapshot.forEach(child => { films.push({ id: child.key, ...child.val() }) })
    films.sort((a, b) => b.created_at - a.created_at)
    res.json({ data: films })
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data film.' })
  }
})

// GET /api/films/:id
router.get('/:id', async (req, res) => {
  try {
    const snapshot = await db.ref(`films/${req.params.id}`).once('value')
    if (!snapshot.exists() || snapshot.val().user_id !== req.user.id) {
      return res.status(404).json({ message: 'Film tidak ditemukan.' })
    }
    res.json({ data: { id: snapshot.key, ...snapshot.val() } })
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data film.' })
  }
})

// POST /api/films
router.post('/', async (req, res) => {
  const { title, genre, platform, type, status, poster_url, rating } = req.body
  if (!title || !genre || !platform || !type) {
    return res.status(400).json({ message: 'Field title, genre, platform, dan type wajib diisi.' })
  }
  try {
    const newFilm = db.ref('films').push()
    const data = {
      user_id: req.user.id, title, genre, platform, type,
      status: status || 'Belum Ditonton',
      poster_url: poster_url || null,
      rating: rating || null,
      created_at: Date.now()
    }
    await newFilm.set(data)
    res.status(201).json({ message: 'Film berhasil ditambahkan!', data: { id: newFilm.key, ...data } })
  } catch (err) {
    res.status(500).json({ message: 'Gagal menambahkan film.' })
  }
})

// PUT /api/films/:id
router.put('/:id', async (req, res) => {
  const { title, genre, platform, type, status, poster_url, rating } = req.body
  try {
    const snapshot = await db.ref(`films/${req.params.id}`).once('value')
    if (!snapshot.exists() || snapshot.val().user_id !== req.user.id) {
      return res.status(404).json({ message: 'Film tidak ditemukan.' })
    }
    const updated = { title, genre, platform, type, status, poster_url: poster_url || null, rating: rating || null }
    await db.ref(`films/${req.params.id}`).update(updated)
    res.json({ message: 'Film berhasil diupdate!', data: { id: req.params.id, ...snapshot.val(), ...updated } })
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengupdate film.' })
  }
})

// DELETE /api/films/:id
router.delete('/:id', async (req, res) => {
  try {
    const snapshot = await db.ref(`films/${req.params.id}`).once('value')
    if (!snapshot.exists() || snapshot.val().user_id !== req.user.id) {
      return res.status(404).json({ message: 'Film tidak ditemukan.' })
    }
    await db.ref(`films/${req.params.id}`).remove()
    res.json({ message: 'Film berhasil dihapus.' })
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus film.' })
  }
})

module.exports = router