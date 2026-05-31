import React, { useState, useEffect } from 'react';

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

  // Fungsi Login Admin
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/admin/login', {
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
      alert('Gagal terhubung ke server login!');
    }
  };

  // Ambil Data Pesanan (Fitur READ)
  const fetchOrders = async (authToken) => {
    try {
      const res = await fetch('http://localhost:5000/api/pesanan', {
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

  // Mengubah Status Pesanan (Fitur UPDATE)
  const updateStatus = async (id, statusBaru) => {
    try {
      const res = await fetch(`http://localhost:5000/api/pesanan/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: statusBaru })
      });
      if (res.ok) {
        alert('Status Berhasil Diperbarui!');
        fetchOrders(token); // Refresh data tabel
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

  // TAMPILAN FORM LOGIN JIKA BELUM TERAUTENTIKASI
  if (!isLoggedIn) {
    return (
      // SUDAH DIPERBAIKI: maxWidth diubah menjadi '100%' agar tidak lagi terhimpit seuprit
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

  // TAMPILAN DASHBOARD UTAMA JIKA SUDAH LOGIN
  return (
    <div style={{ marginTop: '40px', padding: '20px', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ color: '#166534', margin: 0 }}>Dashboard Admin: Kendali Pesanan UMP</h3>
        <button onClick={handleLogout} style={{ padding: '8px 15px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          🔒 Keluar
        </button>
      </div>

      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', borderColor: '#eee' }}>
        <thead>
          <tr style={{ background: '#166534', color: '#fff' }}>
            <th>Nama</th>
            <th>Menu</th>
            <th>Jumlah</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.nama}</td>
              <td>{order.menu}</td>
              <td>{order.jumlah}</td>
              <td style={{ fontWeight: 'bold', color: order.status === 'Selesai' ? '#166534' : '#d97706' }}>
                {order.status || 'Diproses'}
              </td>
              <td>
                {order.status !== 'Selesai' && (
                  <button onClick={() => updateStatus(order.id, 'Selesai')} style={{ padding: '5px 10px', background: '#166534', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Tandai Selesai
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;