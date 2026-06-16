import React, { useContext, useEffect, Suspense, lazy, useState } from 'react'; 
import './App.css';
import FormOrder from './components/FormOrder';
import MenuPage from './components/menupage'; 
import { OrderContext } from './context/OrderContext';

// Import Lazy Component untuk halaman admin dashboard
const AdminDashboard = lazy(() => import('./components/admin_dashboard'));

function App() {
  const { lastOrder } = useContext(OrderContext);
  
  // State Navigasi Utama (Default: info)
  const [currentPage, setCurrentPage] = useState('info');

  // Efek Animasi Scroll Reveal
  useEffect(() => {
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealOnScroll = () => {
      revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (elementTop < windowHeight * 0.85) {
          element.classList.add('visible');
        } else {
          element.classList.remove('visible'); 
        }
      });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); 

    return () => window.removeEventListener('scroll', revealOnScroll);
  }, [currentPage]); // Re-run setiap kali halaman berganti

  return (
    <div className="App">
      {/* NAVBAR DENGAN CLASS TOMBOL DINAMIS */}
      <nav className="navbar">
        <div className="nav-container">
          <span className="logo" onClick={() => setCurrentPage('info')} style={{ cursor: 'pointer' }}>
            Teh Desa UMP
          </span>
          <div className="nav-links">
            <button className={`nav-btn ${currentPage === 'info' ? 'active' : ''}`} onClick={() => setCurrentPage('info')}>Info</button>
            <button className={`nav-btn ${currentPage === 'menu' ? 'active' : ''}`} onClick={() => setCurrentPage('menu')}>Menu</button>
            <button className={`nav-btn ${currentPage === 'pesan' ? 'active' : ''}`} onClick={() => setCurrentPage('pesan')}>Pesan</button>
            <button className={`nav-btn ${currentPage === 'admin' ? 'active' : ''}`} onClick={() => setCurrentPage('admin')}>Admin</button>
          </div>
        </div>
      </nav>

      <main className="container" style={{ maxWidth: currentPage === 'menu' ? '100%' : '600px', transition: 'max-width 0.3s ease' }}>
        
        {/* HALAMAN 1: INFO + INTEGRASI LOKASI */}
        {currentPage === 'info' && (
          <div className="page-wrapper">
            <header className="hero-section">
              <h1>Teh Desa di Depan Kampus UMP</h1>
              <p>Aplikasi ini membantu mahasiswa, staf, dan pengunjung UMP untuk memesan teh lebih cepat dan praktis.</p>
            </header>

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

            {/* KONTEN LOKASI */}
            <section className="location-section scroll-reveal" style={{ marginTop: '50px', borderTop: '2px dashed #eee', paddingTop: '30px' }}>
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
          </div>
        )}

        {/* HALAMAN 2: MENU */}
        {currentPage === 'menu' && (
          <div className="page-wrapper">
            <MenuPage />
          </div>
        )}

        {/* HALAMAN 3: PESAN */}
        {currentPage === 'pesan' && (
          <div className="page-wrapper">
            <section className="order-section scroll-reveal">
              <div className="section-title">
                <h2>Form Pemesanan Teh Desa</h2>
                <p>Isi data di bawah untuk memproses pesanan Anda secara otomatis.</p>
              </div>
              <FormOrder />
            </section>

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
          </div>
        )}

        {/* HALAMAN 4: ADMIN */}
        {currentPage === 'admin' && (
          <div className="page-wrapper">
            <section className="admin-section scroll-reveal">
              <Suspense fallback={
                <div style={{ textAlign: 'center', padding: '50px', color: '#166534', fontWeight: 'bold' }}>
                  🔄 Mengunduh Halaman Admin Dashboard...
                </div>
              }>
                <AdminDashboard />
              </Suspense>
            </section>
          </div>
        )}

      </main>

      <footer className="footer">
        <p>© 2026 Teh Desa UMP</p>
      </footer>
    </div>
  );
}

export default App;