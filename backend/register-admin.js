const mysql = require('mysql2');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'teh_desa_ump',
  port: 3306 // Tetap pakai 3306 sesuai maumu
});

const register = async () => {
  const hashedPassword = await bcrypt.hash('rahasiaump123', 10);
  db.query(
    "INSERT INTO admins (username, password) VALUES (?, ?)", 
    ['admin_tehdesa', hashedPassword], 
    (err, result) => {
      if (err) {
        console.error('Gagal daftar:', err);
      } else {
        console.log('AKUN ADMIN BERHASIL DIBUAT PAKAI BCRYPT!');
      }
      db.end();
    }
  );
};

register();