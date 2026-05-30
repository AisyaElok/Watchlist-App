-- Jalankan file ini di phpMyAdmin atau MySQL CLI

CREATE DATABASE IF NOT EXISTS watchlist_db;
USE watchlist_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS films (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  genre VARCHAR(100) NOT NULL,
  platform VARCHAR(100) NOT NULL,
  type ENUM('Film', 'Series') NOT NULL DEFAULT 'Film',
  status ENUM('Belum Ditonton', 'Sedang Ditonton', 'Sudah Ditonton') NOT NULL DEFAULT 'Belum Ditonton',
  poster_url TEXT,
  rating TINYINT UNSIGNED DEFAULT NULL COMMENT '1-10',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
