import React, { useContext, useEffect, Suspense, lazy } from 'react'; // Import Suspense dan Lazy sesuai Slide Hal 10
import './App.css';
import FormOrder from './components/FormOrder';
import { OrderContext } from './context/OrderContext';

// Import Lazy Component (Memuat komponen hanya saat dibutuhkan)
const AdminDashboard = lazy(() => import('./components/admin_dashboard'));

function App() {
  const { lastOrder } = useContext(OrderContext);

  // Efek Animasi Scroll Reveal
  useEffect(() => {
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealOnScroll = () => {
      revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        // Elemen muncul jika berada di 85% area layar
        if (elementTop < windowHeight * 0.85) {
          element.classList.add('visible');
        } else {
          element.classList.remove('visible'); 
        }
      });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Cek posisi awal saat load

    return () => window.removeEventListener('scroll', revealOnScroll);
  }, []);

  return (
    <div className="App">
      {/* Navbar Simple */}
      <nav className="navbar">
        <div className="nav-container">
          <span className="logo">Teh Desa UMP</span>
          <div className="nav-links">
            <a href="#info">Info</a>
            <a href="#menu">Menu</a>
            <a href="#pesan">Pesan</a>
            <a href="#admin">Admin</a>
            <a href="#lokasi">Lokasi</a>
          </div>
        </div>
      </nav>

      <main className="container">
        {/* Info Header */}
        <header className="hero-section" id="info">
          <h1>Teh Desa di Depan Kampus UMP</h1>
          <p>Aplikasi ini membantu mahasiswa, staf, dan pengunjung UMP untuk memesan teh lebih cepat dan praktis.</p>
        </header>

        {/* Section Info Jam & Fitur */}
        <div className="info-grid">
          <div className="info-card scroll-reveal">
            <div className="icon">🕒</div>
            <h4>Buka Harian</h4>
            <p>08.00 - 20.00 WIB</p>
          </div>
          <div className="info-card scroll-reveal">
            <div className="icon">📍</div>
            <h4>Lokasi Strategis</h4>
            <p>Tepat di depan pintu masuk Kampus UMP Purwokerto.</p>
          </div>
          <div className="info-card scroll-reveal">
            <div className="icon">🚀</div>
            <h4>Layanan Cepat</h4>
            <p>Pesan online, langsung pickup tanpa antre panjang.</p>
          </div>
        </div>

        {/* Section Menu (Grid 3 Kolom dengan Efek Timbul) */}
        <section className="menu-section" id="menu">
          <div className="section-title">
            <h2>Daftar Menu Favorit</h2>
            <p>Pilih kelezatan favoritmu dari Teh Desa UMP.</p>
          </div>
          
          <div className="menu-grid">
            <div className="menu-card scroll-reveal">
              <div className="menu-icon">🍵</div>
              <h4>Teh Original</h4>
              <p>Classic / Jasmine</p>
              <span className="menu-price">Rp 3.000</span>
            </div>

            <div className="menu-card scroll-reveal">
              <div className="menu-icon">🍋</div>
              <h4>Fruit Tea</h4>
              <p>Lemon / Lychee / Mango</p>
              <span className="menu-price">Rp 6.000</span>
            </div>

            <div className="menu-card scroll-reveal">
              <div className="menu-icon">🧋</div>
              <h4>Milk Tea</h4>
              <p>Original / Taro / Matcha</p>
              <span className="menu-price">Rp 8.000</span>
            </div>
          </div>
          <p className="menu-note">*Harga dapat berubah sewaktu-waktu</p>
        </section>

        {/* Form Pemesanan */}
        <section id="pesan" className="order-section scroll-reveal">
          <div className="section-title">
            <h2>Form Pemesanan Teh Desa</h2>
            <p>Isi data di bawah untuk memproses pesanan Anda secara otomatis.</p>
          </div>
          <FormOrder />
        </section>

        {/* Ringkasan Pesanan (Muncul setelah klik Kirim) */}
        {lastOrder && (
          <div className="summary-section">
            <div className="summary-card">
              <h3>Ringkasan Pesanan</h3>
              <div className="summary-details">
                <p><strong>Menu:</strong> {lastOrder.menu}</p>
                <p><strong>Jumlah:</strong> {lastOrder.jumlah} Paket</p>
                <p><strong>Atas Nama:</strong> {lastOrder.nama}</p>
                <p><strong>Catatan:</strong> {lastOrder.catatan || '-'}</p>
              </div>
            </div>
          </div>
        )}
        <section id="admin" className="admin-section scroll-reveal">
          {/* Menggunakan Suspense dengan UI Fallback saat memuat halaman admin */}
          <Suspense fallback={
            <div style={{ textAlign: 'center', padding: '30px', color: '#166534', fontWeight: 'bold' }}>
              🔄 Mengunduh Halaman Admin Dashboard...
            </div>
          }>
            <AdminDashboard />
          </Suspense>
        </section>

        {/* Section Lokasi & Google Maps */}
        <section id="lokasi" className="location-section scroll-reveal">
          <h3>Lokasi Teh Desa UMP</h3>
          <p>Temukan kami di depan gerbang utama kampus.</p>
          <div className="map-placeholder">
            <a 
              href="https://www.google.com/maps/search/Universitas+Muhammadiyah+Purwokerto" 
              target="_blank" 
              rel="noreferrer"
              className="btn-map"
            >
              📍 Buka di Google Maps
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>© 2026 Teh Desa UMP </p>
      </footer>
    </div>
  );
}

export default App;