const mysql = require('mysql2');
const bcrypt = require('bcryptjs');

// Menggunakan murni variabel internal cloud Railway
const db = mysql.createConnection({
  host: process.env.MYSQLHOST || process.env.DB_HOST,
  user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD, 
  database: process.env.MYSQLDATABASE || process.env.DB_NAME,
  port: process.env.MYSQLPORT || process.env.DB_PORT || 3306 
});

const register = async () => {
  try {
    const hashedPassword = await bcrypt.hash('rahasiaump123', 10);
    
    db.query(
      "DELETE FROM admins WHERE username = ?",
      ['admin_tehdesa'],
      (err) => {
        if (err) console.error('Gagal membersihkan data lama:', err);
      }
    );

    db.query(
      "INSERT INTO admins (username, password) VALUES (?, ?)", 
      ['admin_tehdesa', hashedPassword], 
      (err, result) => {
        if (err) {
          console.error('Gagal daftar:', err);
        } else {
          console.log('🎉 SUCCESS: AKUN ADMIN BERHASIL DIBUAT OLEH SERVER INTERNAL!');
        }
        db.end();
      }
    );
  } catch (error) {
    console.error('Terjadi kesalahan enkripsi:', error);
    db.end();
  }
};

register();