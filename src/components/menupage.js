import React from 'react';
import './menupage.css';

function MenuPage() {
  const menuKategori = [
    {
      kategori: '✨ TEA SERIES',
      item: [
        { id: 1, nama: 'Jasmine Tea', harga: 'Rp 3.000', deskripsi: 'Teh melati tradisional dengan aroma khas yang menenangkan.', gambar: '/images/jasmine_tea.jpg' },
        { id: 2, nama: 'Lemon Tea', harga: 'Rp 7.000', deskripsi: 'Kombinasi teh segar dengan perasan lemon asli kaya Vitamin C.', gambar: '/images/lemon_tea.jpg' },
        { id: 3, nama: 'Lychee Tea', harga: 'Rp 7.000', deskripsi: 'Teh buah segar dengan sensasi manis buah leci yang eksotis.', gambar: '/images/lychee_tea.jpg' },
        { id: 4, nama: 'Strawberry Tea', harga: 'Rp 7.000', deskripsi: 'Kesegaran teh premium dipadukan manis asam buah strawberry.', gambar: '/images/strawberry_tea.jpg' },
        { id: 5, nama: 'Mango Tea', harga: 'Rp 7.000', deskripsi: 'Racikan es teh manis dengan ekstrak mangga tropis yang segar.', gambar: '/images/mango_tea.jpg' },
        { id: 6, nama: 'Grape Tea', harga: 'Rp 7.000', deskripsi: 'Sensasi unik es teh buah dengan rasa anggur manis menyegarkan.', gambar: '/images/grape_tea.jpg' }
      ]
    },
    {
      kategori: '💥 SODA POPPING BOBA',
      item: [
        { id: 7, nama: 'Sunset Orange', harga: 'Rp 10.000', deskripsi: 'Sensasi soda rasa jeruk dengan topping popping boba yang meletus di mulut.', gambar: '/images/sunset_orange.jpg' },
        { id: 8, nama: 'Sunrise Manggo', harga: 'Rp 10.000', deskripsi: 'Perpaduan soda mangga segar yang memberikan energi instan seharian.', gambar: '/images/sunrise_mango.jpg' },
        { id: 9, nama: 'Sakura Berry', harga: 'Rp 10.000', deskripsi: 'Soda rasa berry merah cantik khas bunga sakura berpadu boba manis.', gambar: '/images/sakura_berry.jpg' }
      ]
    },
    {
      kategori: '🐘 THAI TEA SERIES',
      item: [
        { id: 10, nama: 'Original Thai Tea', harga: 'Rp 8.000', deskripsi: 'Teh Thailand autentik yang pekat berpadu dengan kental manis gurih.', gambar: '/images/original_thai_tea.jpg' },
        { id: 11, nama: 'Thai Tea + Macchiato', harga: 'Rp 10.000', deskripsi: 'Thai tea premium disiram foam macchiato lembut yang super creamy.', gambar: '/images/thai_tea_machiato.jpg' },
        { id: 12, nama: 'Thai Tea Choco', harga: 'Rp 10.000', deskripsi: 'Perpaduan epik antara racikan Thai tea dengan rasa cokelat pekat.', gambar: '/images/thai_tea_choco.jpg' },
        { id: 13, nama: 'Thai Tea Oreo', harga: 'Rp 10.000', deskripsi: 'Thai milk tea lezat dengan taburan remahan biskuit Oreo gurih.', gambar: '/images/thai_tea_oreo.jpg' }
      ]
    },
    {
      kategori: '🥛 MILKY SERIES',
      item: [
        { id: 14, nama: 'Royal Choco Creamy', harga: 'Rp 15.000', deskripsi: 'Minuman cokelat premium royal yang super rich, kental, dan manis lezat.', gambar: '/images/royal _hoco_creamy.jpg' },
        { id: 15, nama: 'Taro Creamy', harga: 'Rp 10.000', deskripsi: 'Rasa taro (talas ungu) yang lembut, gurih susu, dan jadi andalan mahasiswa.', gambar: '/images/taro_creamy.jpg' },
        { id: 16, nama: 'Oreo Creamy', harga: 'Rp 13.000', deskripsi: 'Susu segar yang di-blend sempurna dengan biskuit Oreo hitam legendaris.', gambar: '/images/oreo_creamy.jpg' },
        { id: 17, nama: 'Matcha Creamy', harga: 'Rp 10.000', deskripsi: 'Bubuk matcha hijau autentik bersanding lembut dengan creamy-nya susu.', gambar: '/images/matcha_creamy.jpg' },
        { id: 18, nama: 'Strawberry Creamy', harga: 'Rp 13.000', deskripsi: 'Sensasi segar susu strawberry merah muda yang manis, lembut, dan buah banget.', gambar: '/images/strawberry_creamy.jpg' },
        { id: 19, nama: 'Avocado Creamy', harga: 'Rp 10.000', deskripsi: 'Rasa buah alpukat yang legit berpadu gurih kentalnya susu premium.', gambar: '/images/avocado_creamy.jpg' },
        { id: 20, nama: 'Caramel Macchiato', harga: 'Rp 14.000', deskripsi: 'Paduan rasa karamel mewah melingkari kelembutan segelas susu es.', gambar: '/images/thai_tea_machiato.jpg' },
        { id: 21, nama: 'Red Velvet Creamy', harga: 'Rp 13.000', deskripsi: 'Kue red velvet dalam bentuk minuman yang gurih, manis, dan berkelas.', gambar: '/images/red_velvet_creamy.jpg' },
        { id: 22, nama: 'Teh Tarik', harga: 'Rp 9.500', deskripsi: 'Teh pekat pilihan yang ditarik sempurna menghasilkan busa foam lembut.', gambar: '/images/teh_tarik.jpg' }
      ]
    }
  ];

  return (
    <div className="menu-page-container">
      <div className="menu-page-header">
        <h2>Daftar Menu Teh Desa UMP</h2>
        <p>Varian rasa autentik lengkap untuk menyegarkan hari-hari kuliahmu.</p>
      </div>

      {menuKategori.map((kat, index) => (
        <div className="menu-section-group" key={index}>
          {/* Label Banner Pembatas Kategori Sesuai Gambar Fisik */}
          <div className="category-banner">
            <h3>{kat.kategori}</h3>
          </div>

          {/* Grid Responsif 3 Kolom Lanskap */}
          <div className="menu-products-grid">
            {kat.item.map((menu) => (
              <div key={menu.id} className="product-card">
                <div className="product-image-wrapper">
                  <img src={menu.gambar} alt={menu.nama} className="product-image" />
                  <span className="product-price-tag">{menu.harga}</span>
                </div>
                <div className="product-details">
                  <h3>{menu.nama}</h3>
                  <p>{menu.deskripsi}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MenuPage;