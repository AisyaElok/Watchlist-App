const express = require('express');
const router = express.Router();
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

// Semua route di sini butuh login (JWT)
router.use(authMiddleware);

// GET /api/films — ambil semua film milik user yang login
router.get('/', async (req, res) => {
  try {
    const [films] = await db.query(
      'SELECT * FROM films WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ data: films });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil data film.' });
  }
});

// GET /api/films/:id — detail satu film
router.get('/:id', async (req, res) => {
  try {
    const [films] = await db.query(
      'SELECT * FROM films WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (films.length === 0) {
      return res.status(404).json({ message: 'Film tidak ditemukan.' });
    }
    res.json({ data: films[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil data film.' });
  }
});

// POST /api/films — tambah film baru
router.post('/', async (req, res) => {
  const { title, genre, platform, type, status, poster_url, rating } = req.body;

  if (!title || !genre || !platform || !type) {
    return res.status(400).json({ message: 'Field title, genre, platform, dan type wajib diisi.' });
  }

  const validTypes = ['Film', 'Series'];
  const validStatuses = ['Belum Ditonton', 'Sedang Ditonton', 'Sudah Ditonton'];

  if (!validTypes.includes(type)) {
    return res.status(400).json({ message: 'Type harus Film atau Series.' });
  }
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Status tidak valid.' });
  }
  if (rating && (rating < 1 || rating > 10)) {
    return res.status(400).json({ message: 'Rating harus antara 1-10.' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO films (user_id, title, genre, platform, type, status, poster_url, rating)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        title,
        genre,
        platform,
        type,
        status || 'Belum Ditonton',
        poster_url || null,
        rating || null,
      ]
    );

    const [newFilm] = await db.query('SELECT * FROM films WHERE id = ?', [result.insertId]);
    res.status(201).json({ message: 'Film berhasil ditambahkan!', data: newFilm[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal menambahkan film.' });
  }
});

// PUT /api/films/:id — edit film
router.put('/:id', async (req, res) => {
  const { title, genre, platform, type, status, poster_url, rating } = req.body;
  try {
    const [films] = await db.query(
      'SELECT id FROM films WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (films.length === 0) {
      return res.status(404).json({ message: 'Film tidak ditemukan.' });
    }
    await db.query(
      `UPDATE films SET title=?, genre=?, platform=?, type=?, status=?, poster_url=?, rating=? WHERE id=?`,
      [title, genre, platform, type, status, poster_url || null, rating || null, req.params.id]
    );
    const [updated] = await db.query('SELECT * FROM films WHERE id = ?', [req.params.id]);
    res.json({ message: 'Film berhasil diupdate!', data: updated[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengupdate film.' });
  }
});

// DELETE /api/films/:id — hapus film
router.delete('/:id', async (req, res) => {
  try {
    const [films] = await db.query(
      'SELECT id FROM films WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (films.length === 0) {
      return res.status(404).json({ message: 'Film tidak ditemukan.' });
    }

    await db.query('DELETE FROM films WHERE id = ?', [req.params.id]);
    res.json({ message: 'Film berhasil dihapus.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal menghapus film.' });
  }
});

module.exports = router;
