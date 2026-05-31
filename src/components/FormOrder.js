import React, { useState, useContext } from 'react';
import { OrderContext } from '../context/OrderContext';

const FormOrder = () => {
  const { setLastOrder } = useContext(OrderContext);
  const [form, setForm] = useState({
    nama: '',
    email: '',
    menu: 'Teh Desa Classic',
    jumlah: 1,
    catatan: ''
  });

  const submitOrder = async (e) => {
    e.preventDefault();

    // ====== TAMBAHAN PENGEMBANGAN UAS: VALIDASI REGEX EMAIL ======
    // Pola ekspresi reguler untuk mengecek kevalidan struktur email pelanggan
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Logika penyaringan input email di sisi client
    if (!regexEmail.test(form.email)) {
       alert("Format email tidak valid! Harap masukkan email dengan benar (contoh: user@mail.com).");
       return; // Menghentikan eksekusi fetch agar data kotor tidak terkirim ke backend
    }
    try {
      const res = await fetch('http://localhost:5000/api/pesanan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      
      setLastOrder(form); 
      alert(data.message);
    } catch (err) {
      alert("Nyalakan terminal backend (port 5000) dulu!");
    }
  };

  return (
    <div className="form-card">
      <h3>Buat Pesanan Anda</h3>
      <form onSubmit={submitOrder}>
        
        <label>Nama Lengkap</label>
        <input type="text" placeholder="Masukkan nama Anda" required 
          onChange={(e) => setForm({...form, nama: e.target.value})} />
        
        <label>Email</label>
        <input type="email" placeholder="contoh@mail.com" required 
          onChange={(e) => setForm({...form, email: e.target.value})} />
        
        <label>Pilih Menu Teh Desa</label>
        <select onChange={(e) => setForm({...form, menu: e.target.value})}>
          <optgroup label="Teh Original">
            <option value="Teh Desa Classic">Teh Desa Classic (Original)</option>
            <option value="Teh Desa Jasmine">Teh Desa Jasmine</option>
            <option value="Teh Desa Gula Batu">Teh Desa Gula Batu</option>
          </optgroup>
          
          <optgroup label="Fruit Tea (Segar)">
            <option value="Teh Desa Lemon">Teh Desa Lemon Tea</option>
            <option value="Teh Desa Lychee">Teh Desa Lychee Tea</option>
            <option value="Teh Desa Peach">Teh Desa Peach Tea</option>
            <option value="Teh Desa Mango">Teh Desa Mango Tea</option>
          </optgroup>

          <optgroup label="Milk Tea (Creamy)">
            <option value="Teh Desa Susu">Teh Desa Susu (Original)</option>
            <option value="Teh Desa Taro">Teh Desa Taro Milk Tea</option>
            <option value="Teh Desa Matcha">Teh Desa Matcha Green Tea</option>
            <option value="Teh Desa Cokelat">Teh Desa Chocolate Tea</option>
          </optgroup>
        </select>
        
        <label>Jumlah Paket</label>
        <input type="number" min="1" value={form.jumlah} 
          onChange={(e) => setForm({...form, jumlah: e.target.value})} />
        
        <label>Catatan Tambahan</label>
        <textarea placeholder="Contoh: Pesan antar ke Gedung F UMP" rows="3"
          onChange={(e) => setForm({...form, catatan: e.target.value})}></textarea>
        
        <button type="submit" className="btn-submit">Kirim Pesanan</button>
      </form>
    </div>
  );
};

export default FormOrder;