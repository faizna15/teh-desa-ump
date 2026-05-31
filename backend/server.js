const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs'); // Untuk enkripsi password
const jwt = require('jsonwebtoken'); // Untuk token login

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'teh_desa_secret_key_ump';

// Koneksi ke Database MySQL

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Kosongkan jika pakai XAMPP default
  database: 'teh_desa_ump'
});

db.connect((err) => {
  if (err) {
    console.error('Koneksi MySQL Gagal:', err);
    return;
  }
  console.log('Sukses terkoneksi ke Database MySQL (teh_desa_ump)!');
});

// FITUR CREATE (SIMPAN PESANAN)

app.post('/api/pesanan', (req, res) => {
  const { nama, email, menu, jumlah, catatan } = req.body;

  // Validasi Backend: Memastikan input tidak kosong dan jumlah rasional

  if (!nama || !email || jumlah < 1) {
    return res.status(400).json({ message: 'Data tidak valid atau kurang lengkap!' });
  }

  const sqlInsert = "INSERT INTO orders (nama, email, menu, jumlah, catatan) VALUES (?, ?, ?, ?, ?)";
  db.query(sqlInsert, [nama, email, menu, jumlah, catatan], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Gagal menyimpan ke database' });
    }
    res.status(200).json({ 
      message: `Halo ${nama}, pesanan ${menu} berhasil masuk ke database!`,
      orderId: result.insertId 
    });
  });
});

// FITUR AUTENTIKASI ADMIN (LOGIN JWT)
// Endpoint untuk Register Akun Admin Baru
app.post('/api/admin/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const sqlRegister = "INSERT INTO admins (username, password) VALUES (?, ?)";
  db.query(sqlRegister, [username, hashedPassword], (err, result) => {
    if (err) return res.status(500).json({ message: 'Gagal register admin' });
    res.status(200).json({ message: 'Admin baru berhasil didaftarkan!' });
  });
});

// Endpoint Login Admin

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const sqlFindAdmin = "SELECT * FROM admins WHERE username = ?";
  
  db.query(sqlFindAdmin, [username], async (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ message: 'Username tidak ditemukan!' });
    
    const admin = results[0];
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    
    if (!isPasswordValid) return res.status(401).json({ message: 'Password salah!' });
    
    // Generate token JWT jika login sukses

    const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login Berhasil!', token });
  });
});

// FITUR READ (DASHBOARD AMBIL DATA)

app.get('/api/pesanan', (req, res) => {
  // Proteksi endpoint menggunakan token header
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'Akses ditolak, butuh token login!' });

  try {
    jwt.verify(token, JWT_SECRET);
    const sqlSelect = "SELECT * FROM orders ORDER BY id DESC";
    db.query(sqlSelect, (err, results) => {
      if (err) return res.status(500).json({ message: 'Gagal mengambil data' });
      res.status(200).json(results);
    });
  } catch (error) {
    return res.status(401).json({ message: 'Token kedaluwarsa atau tidak valid!' });
  }
});

// FITUR UPDATE STATUS PESANAN

app.put('/api/pesanan/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // status: 'Selesai' atau 'Diproses'

  const sqlUpdate = "UPDATE orders SET status = ? WHERE id = ?";
  db.query(sqlUpdate, [status, id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Gagal update status' });
    res.status(200).json({ message: `Pesanan ID ${id} berhasil diperbarui menjadi: ${status}` });
  });
});

app.listen(5000, () => {
  console.log('Server Backend UAS berjalan di port 5000');
});