const mysql = require('mysql2');
const bcrypt = require('bcryptjs');

// Metode Connection String murni
const connectionString = process.env.MYSQL_URL || process.env.MYSQLURL || "mysql://root:fmFRnlPylVaBlNxKgMkYhPwUjlkHoCFs@mysql.railway.internal:3306/railway";

const db = mysql.createConnection(connectionString);

const register = async () => {
  try {
    const hashedPassword = await bcrypt.hash('rahasiaump123', 10);
    
    // Hapus data lama jika ada
    db.query("DELETE FROM admins WHERE username = ?", ['admin_tehdesa'], (err) => {
      if (err) console.error('Gagal bersihkan data lama:', err);
    });

    // Inject data baru dengan enkripsi bcryptjs
    db.query(
      "INSERT INTO admins (username, password) VALUES (?, ?)", 
      ['admin_tehdesa', hashedPassword], 
      (err, result) => {
        if (err) {
          console.error('Gagal mendaftarkan admin:', err);
        } else {
          console.log('');
          console.log('🎉 AKUN ADMIN BERHASIL DIINJECT 100% PAKE BCRYPTJS!');
          console.log('');
        }
        db.end();
      }
    );
  } catch (error) {
    console.error('Error enkripsi:', error);
    db.end();
  }
};

register();