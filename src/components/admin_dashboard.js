import React, { useState, useEffect } from 'react';
import './admin_dashboard.css';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
      fetchOrders(token);
    }
  }, [token]);

  const totalPesanan = orders.length;
  const totalDiproses = orders.filter(o => o.status !== 'Selesai').length;
  const totalSelesai = orders.filter(o => o.status === 'Selesai').length;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://teh-desa-backend-production.up.railway.app/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('adminToken', data.token);
        setToken(data.token);
        setIsLoggedIn(true);
        alert(data.message);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Gagal terhubung ke server login cloud!');
    }
  };

  const fetchOrders = async (authToken) => {
    try {
      const res = await fetch('https://teh-desa-backend-production.up.railway.app/api/pesanan', {
        headers: { 'Authorization': authToken }
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(data);
      } else {
        alert(data.message);
        handleLogout();
      }
    } catch (err) {
      console.error('Gagal mengambil data:', err);
    }
  };

  const updateStatus = async (id, statusBaru) => {
    try {
      const res = await fetch(`https://teh-desa-backend-production.up.railway.app/api/pesanan/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: statusBaru })
      });
      if (res.ok) {
        alert('Status Berhasil Diperbarui!');
        fetchOrders(token);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken('');
    setIsLoggedIn(false);
    setOrders([]);
  };

  if (!isLoggedIn) {
    return (
      <div className="form-card" style={{ maxWidth: '100%', margin: '40px auto' }}>
        <h3 style={{ textAlign: 'center', color: '#166534' }}>Login Admin Teh Desa</h3>
        <form onSubmit={handleLogin}>
          <label>Username</label>
          <input type="text" required onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })} />
          <label>Password</label>
          <input type="password" required onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} />
          <button type="submit" className="btn-submit">Masuk Dashboard</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="header-text">
          <h2>Dashboard Admin</h2>
          <p>Kendali Manajemen Pesanan Lapak Teh Desa UMP</p>
        </div>
        <button 
          className="btn-logout" 
          onClick={handleLogout}
          style={{ 
            width: 'auto', 
            padding: '8px 16px', 
            fontSize: '14px', 
            maxWidth: '120px',
            height: 'fit-content'
          }}
        >
          🔒 Keluar
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h4>{totalPesanan}</h4>
            <p>Total Masuk</p>
          </div>
        </div>
        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h4>{totalDiproses}</h4>
            <p>Sedang Diproses</p>
          </div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h4>{totalSelesai}</h4>
            <p>Selesai Pickup</p>
          </div>
        </div>
      </div>

      <div className="table-wrapper">
        <div className="table-title">
          <h3>📋 Antrean Pesanan Masuk </h3>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nama Pemesan</th>
              <th>Varian Menu</th>
              <th>Jumlah</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className={order.status === 'Selesai' ? 'row-selesai' : ''}>
                <td className="font-bold">{order.nama}</td>
                <td>{order.menu}</td>
                <td><span className="badge-jumlah">{order.jumlah} Cup</span></td>
                <td>
                  <span className={`status-badge ${order.status === 'Selesai' ? 'status-complete' : 'status-proses'}`}>
                    {order.status || 'Diproses'}
                  </span>
                </td>
                <td>
                  {order.status !== 'Selesai' ? (
                    <button className="btn-action-done" onClick={() => updateStatus(order.id, 'Selesai')}>
                      Tandai Selesai
                    </button>
                  ) : (
                    <span className="text-muted">Selesai ✨</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;