import React, { useState, useContext } from 'react';
import { OrderContext } from '../context/OrderContext';

const HARGA_MENU = {
  // TEA SERIES
  "Jasmine Tea": 3000,
  "Lemon Tea": 7000,
  "Lychee Tea": 7000,
  "Strawberry Tea": 7000,
  "Mango Tea": 7000,
  "Grape Tea": 7000,
  
  // SODA POPPING BOBA
  "Sunset Orange": 10000,
  "Sunrise Manggo": 10000,
  "Sakura Berry": 10000,
  
  // THAI TEA SERIES
  "Original Thai Tea": 8000,
  "Thai Tea + Macchiato": 10000,
  "Thai Tea Choco": 10000,
  "Thai Tea Oreo": 10000,
  
  // MILKY SERIES
  "Royal Choco Creamy": 15000,
  "Taro Creamy": 13000,
  "Oreo Creamy": 13000,
  "Matcha Creamy": 10000,
  "Strawberry Creamy": 13000,
  "Avocado Creamy": 10000,
  "Caramel Macchiato": 14000,
  "Red Velvet Creamy": 13000,
  "Teh Tarik": 9500
};

function FormOrder() {
  const { setLastOrder } = useContext(OrderContext);

  // State utama form
  const [nama, setNama] = useState('');
  const [catatan, setCatatan] = useState('');
  
  // State dinamis untuk banyak menu sekaligus
  const [itemPesanan, setItemPesanan] = useState([{ menu: '', jumlah: 1 }]);

  const tambahBarisMenu = () => {
    setItemPesanan([...itemPesanan, { menu: '', jumlah: 1 }]);
  };

  const hapusBarisMenu = (index) => {
    if (itemPesanan.length > 1) {
      const listBaru = itemPesanan.filter((_, i) => i !== index);
      setItemPesanan(listBaru);
    }
  };

  const handleItemChange = (index, field, value) => {
    const listBaru = [...itemPesanan];
    listBaru[index][field] = value;
    setItemPesanan(listBaru);
  };

  const hitungGrandTotal = () => {
    return itemPesanan.reduce((total, item) => {
      const hargaPerCup = HARGA_MENU[item.menu] || 0;
      return total + (hargaPerCup * item.jumlah);
    }, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const adaMenuKosong = itemPesanan.some(item => !item.menu);
    if (!nama || adaMenuKosong) {
      alert('Silakan isi nama dan pilih semua varian menu terlebih dahulu!');
      return;
    }

    const payload = {
      nama,
      catatan,
      items: itemPesanan
    };

    fetch('https://teh-desa-backend-production.up.railway.app/api/pesanan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Gagal menyimpan ke server!');
        return res.json();
      })
      .then((data) => {
        console.log('Respon sukses:', data);
        setLastOrder(payload);
        alert(`Pesanan atas nama ${nama} BERHASIL MASUK DATABASE!\nTotal Bayar: Rp ${hitungGrandTotal().toLocaleString('id-ID')}`);
        
        setNama('');
        setCatatan('');
        setItemPesanan([{ menu: '', jumlah: 1 }]);
      })
      .catch((err) => {
        console.error(err);
        alert('Gagal terhubung ke backend! Pastikan node server.js menyala.');
      });
  };

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '20px', boxSizing: 'border-box' }}>
      <div className="form-card scroll-reveal" style={{ boxSizing: 'border-box', width: '100%', padding: '25px', background: '#ffffff', borderRadius: '18px' }}>
        <form onSubmit={handleSubmit}>
          
          {/* INPUT NAMA */}
          <label htmlFor="nama">Nama Pemesan :</label>
          <input 
            type="text" 
            id="nama" 
            placeholder="Masukkan nama Anda..." 
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required 
            style={{ 
              width: '100%', 
              boxSizing: 'border-box', 
              padding: '10px', 
              marginBottom: '15px' 
            }}
          />

          {/* INPUT DINAMIS BANYAK MENU */}
          <label>Daftar Menu yang Dipesan :</label>
          {itemPesanan.map((item, index) => {
            const hargaSatuan = HARGA_MENU[item.menu] || 0;
            const subTotalBaris = hargaSatuan * item.jumlah;

            return (
              <div key={index} style={{ marginBottom: '15px', borderBottom: '1px dashed #ccc', paddingBottom: '10px', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '5px' }}>
                  
                  {/* DROPDOWN SELECT MENU */}
                  <select 
                    style={{ flex: 2, padding: '8px', boxSizing: 'border-box' }}
                    value={item.menu} 
                    onChange={(e) => handleItemChange(index, 'menu', e.target.value)}
                    required
                  >
                    <option value="" disabled hidden>-- Pilih Menu Minuman --</option>
                    <optgroup label="✨ TEA SERIES">
                      <option value="Jasmine Tea">Jasmine Tea (Rp 3.000)</option>
                      <option value="Lemon Tea">Lemon Tea (Rp 7.000)</option>
                      <option value="Lychee Tea">Lychee Tea (Rp 7.000)</option>
                      <option value="Strawberry Tea">Strawberry Tea (Rp 7.000)</option>
                      <option value="Mango Tea">Mango Tea (Rp 7.000)</option>
                      <option value="Grape Tea">Grape Tea (Rp 7.000)</option>
                    </optgroup>
                    <optgroup label="💥 SODA POPPING BOBA">
                      <option value="Sunset Orange">Sunset Orange (Rp 10.000)</option>
                      <option value="Sunrise Manggo">Sunrise Manggo (Rp 10.000)</option>
                      <option value="Sakura Berry">Sakura Berry (Rp 10.000)</option>
                    </optgroup>
                    <optgroup label="🐘 THAI TEA SERIES">
                      <option value="Original Thai Tea">Original Thai Tea (Rp 8.000)</option>
                      <option value="Thai Tea + Macchiato">Thai Tea + Macchiato (Rp 10.000)</option>
                      <option value="Thai Tea Choco">Thai Tea Choco (Rp 10.000)</option>
                      <option value="Thai Tea Oreo">Thai Tea Oreo (Rp 10.000)</option>
                    </optgroup>
                    <optgroup label="🥛 MILKY SERIES">
                      <option value="Royal Choco Creamy">Royal Choco Creamy (Rp 15.000)</option>
                      <option value="Taro Creamy">Taro Creamy (Rp 10.000)</option>
                      <option value="Oreo Creamy">Oreo Creamy (Rp 13.000)</option>
                      <option value="Matcha Creamy">Matcha Creamy (Rp 10.000)</option>
                      <option value="Strawberry Creamy">Strawberry Creamy (Rp 13.000)</option>
                      <option value="Avocado Creamy">Avocado Creamy (Rp 10.000)</option>
                      <option value="Caramel Macchiato">Caramel Macchiato (Rp 14.000)</option>
                      <option value="Red Velvet Creamy">Red Velvet Creamy (Rp 13.000)</option>
                      <option value="Teh Tarik">Teh Tarik (Rp 9.500)</option>
                    </optgroup>
                  </select>

                  {/* INPUT JUMLAH CUP */}
                  <input 
                    type="number" 
                    style={{ width: '65px', padding: '8px', boxSizing: 'border-box' }}
                    min="1" 
                    max="50"
                    value={item.jumlah}
                    onChange={(e) => handleItemChange(index, 'jumlah', parseInt(e.target.value) || 1)}
                    required 
                  />

                  {/* TOMBOL HAPUS BARIS */}
                  {itemPesanan.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => hapusBarisMenu(index)}
                      style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 12px', cursor: 'pointer', borderRadius: '4px' }}
                    >
                      ❌
                    </button>
                  )}
                </div>
                
                {/* LIVE HARGA PER ITEM */}
                {item.menu && (
                  <div style={{ textAlign: 'right', fontSize: '13px', color: '#666', marginTop: '2px' }}>
                    Subtotal: {item.jumlah} cup x Rp {hargaSatuan.toLocaleString('id-ID')} = <strong>Rp {subTotalBaris.toLocaleString('id-ID')}</strong>
                  </div>
                )}
              </div>
            );
          })}

          {/* TOMBOL TAMBAH BARIS MENU */}
          <button 
            type="button" 
            onClick={tambahBarisMenu}
            style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '8px 12px', cursor: 'pointer', borderRadius: '4px', marginBottom: '15px', display: 'block' }}
          >
            ➕ Tambah Menu Lain
          </button>

          {/* BOX TAMPILAN GRAND TOTAL DI FORM */}
          <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '12px', borderRadius: '6px', marginBottom: '15px', marginTop: '10px', boxSizing: 'border-box' }}>
            <h4 style={{ margin: 0, color: '#166534', display: 'flex', justifyContent: 'space-between' }}>
              <span>💰 Total Pembayaran:</span>
              <span>Rp {hitungGrandTotal().toLocaleString('id-ID')}</span>
            </h4>
          </div>

          {/* INPUT CATATAN */}
          <label htmlFor="catatan">Catatan Tambahan (Opsional) :</label>
          <textarea 
            id="catatan" 
            rows="3" 
            placeholder="Contoh: Es sedikit, manis banget, atau tanpa boba..."
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            style={{ 
              width: '100%', 
              boxSizing: 'border-box', 
              padding: '10px', 
              marginBottom: '15px',
              fontFamily: 'inherit'
            }}
          ></textarea>

          {/* TOMBOL SUBMIT */}
          <button type="submit" className="btn-submit" style={{ marginTop: '10px', width: '100%' }}>🚀 Pesan Sekarang</button>
        </form>
      </div>
    </div>
  );
}

export default FormOrder;