const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../config/database')
require('dotenv').config()

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Semua field wajib diisi.' })
  }
  try {
    const snapshot = await db.ref('users').orderByChild('email').equalTo(email).once('value')
    if (snapshot.exists()) {
      return res.status(409).json({ message: 'Email sudah terdaftar.' })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = db.ref('users').push()
    await newUser.set({ id: newUser.key, name, email, password: hashedPassword, created_at: Date.now() })
    res.status(201).json({ message: 'Registrasi berhasil!', userId: newUser.key })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Terjadi kesalahan server.' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan password wajib diisi.' })
  }
  try {
    const snapshot = await db.ref('users').orderByChild('email').equalTo(email).once('value')
    if (!snapshot.exists()) {
      return res.status(401).json({ message: 'Email atau password salah.' })
    }
    let user
    snapshot.forEach(child => { user = { id: child.key, ...child.val() } })
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Email atau password salah.' })
    }
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    res.json({ message: 'Login berhasil!', token, user: { id: user.id, name: user.name, email: user.email } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Terjadi kesalahan server.' })
  }
})

// GET /api/auth/users
router.get('/users', async (req, res) => {
  try {
    const snapshot = await db.ref('users').once('value')
    const users = []
    snapshot.forEach(child => {
      const u = child.val()
      users.push({ id: child.key, name: u.name, email: u.email, created_at: u.created_at })
    })
    res.json({ data: users })
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data users.' })
  }
})

module.exports = router