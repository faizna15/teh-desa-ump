const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs'); // Untuk enkripsi password
const jwt = require('jsonwebtoken'); // Untuk token login

const app = express();

// PENTING: PENGATURAN CORS TERBUKA UNTUK VERCEL
app.use(cors({
  origin: '*', // Mengizinkan domain Vercel mengakses API tanpa diblokir browser
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Mengambil JWT Secret dari environment variable, jika tidak ada pakai default lokal
const JWT_SECRET = process.env.JWT_SECRET || 'teh_desa_secret_key_ump';

// 1. KONEKSI DATABASE (FLEKSIBEL LOKAL/CLOUD)
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'teh_desa_ump',
  port: process.env.DB_PORT || 3306
});

db.connect((err) => {
  if (err) {
    console.error('Koneksi MySQL Gagal:', err);
    return;
  }
  console.log(`Sukses terkoneksi ke Database MySQL (${process.env.DB_NAME || 'teh_desa_ump'})!`);
});

// LANDING ROUTE AGAR RAILWAY TIDAK TIMEOUT / CRASHED
app.get('/', (req, res) => {
  res.send('Backend Teh Desa UMP is running perfectly!');
});

// 2. ENDPOINT / FITUR-FITUR API
// FITUR CREATE (SIMPAN PESANAN) - VERSI BULK INSERT MULTI-MENU
app.post('/api/pesanan', (req, res) => {
  const { nama, catatan, items } = req.body;

  // Validasi data array items dari frontend
  if (!nama || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Data tidak valid atau pesanan kosong!' });
  }

  // Memetakan array objek
  const values = items.map(item => [nama, item.menu, item.jumlah, catatan]);

  // Menggunakan tanda tanya tunggal (?) di dalam array untuk bulk insert bertingkat
  const sqlInsertBulk = "INSERT INTO orders (nama, menu, jumlah, catatan) VALUES ?";
  
  db.query(sqlInsertBulk, [values], (err, result) => {
    if (err) {
      console.error('Gagal melakukan Bulk Insert:', err);
      return res.status(500).json({ message: 'Gagal menyimpan semua item pesanan ke database!' });
    }
    res.status(200).json({ 
      message: `Halo ${nama}, sebanyak ${result.affectedRows} jenis menu berhasil dimasukkan ke database!`,
      affectedRows: result.affectedRows 
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
  
  db.query(sqlFindAdmin, [username], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Eror pada server database!' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Username tidak ditemukan!' });
    }
    
    const admin = results[0];
    const isPasswordValid = bcrypt.compareSync(password, admin.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Password salah!' });
    }
    
    const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login Berhasil!', token });
  });
});

// FITUR READ (DASHBOARD AMBIL DATA)
app.get('/api/pesanan', (req, res) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'Akses ditolak, butuh token login!' });

  try {
    jwt.verify(token, JWT_SECRET);
    
    const sqlSelect = `
      SELECT * FROM orders 
      ORDER BY 
        CASE WHEN status = 'Diproses' THEN 1 ELSE 2 END ASC, 
        id DESC
    `;
    
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
  const { status } = req.body;

  const sqlUpdate = "UPDATE orders SET status = ? WHERE id = ?";
  db.query(sqlUpdate, [status, id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Gagal update status' });
    res.status(200).json({ message: `Pesanan ID ${id} berhasil diperbarui menjadi: ${status}` });
  });
});

// 3. RUNNING SERVER WITH DYNAMIC PORT (DEFAULT 8080 FOR DOCKER RAILWAY)
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server Backend UAS berjalan di port ${PORT}`);
});