import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './views/Dashboard';
import Inventory from './views/Inventory';
import Maintenance from './views/Maintenance';
import Departments from './views/Departments';
import Users from './views/Users';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  User, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  Heart, 
  Search,
  Package,
  Calendar,
  Activity,
  Building,
  Tag,
  Hash,
  Phone,
  Loader2,
  ChevronRight,
  Stethoscope,
  Database,
  Cloud
} from 'lucide-react';
import logo from './assets/logo/logo.png';
import bgImage from './assets/bg/login_bg.png';

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [publicViewId, setPublicViewId] = useState(null);
  const [publicData, setPublicData] = useState(null);

  useEffect(() => {
    // Handle Public QR View
    const path = window.location.pathname;
    if (path.startsWith('/view/')) {
      const id = path.split('/')[2];
      setPublicViewId(id);
      fetchPublicData(id);
    }

    if (path === '/logout') {
      localStorage.removeItem('user');
      window.history.replaceState({}, '', '/');
    }

    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
    
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const fetchPublicData = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/api/equipment`);
      const data = await res.json();
      const item = data.find(e => e.id === id);
      setPublicData(item);
    } catch (err) {
      console.error('Public fetch error:', err);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?')) {
      setUser(null);
      localStorage.removeItem('user');
      setActiveView('dashboard');
      setIsSidebarOpen(false);
    }
  };

  const getTitle = () => {
    switch (activeView) {
      case 'dashboard': return 'Bảng điều khiển';
      case 'inventory': return 'Thiết bị y tế';
      case 'maintenance': return 'Bảo trì sửa chữa';
      case 'departments': return 'Khoa phòng';
      case 'users': return 'Người dùng';
      default: return 'Lien Chieu Equipment';
    }
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard />;
      case 'inventory': return <Inventory />;
      case 'maintenance': return <Maintenance />;
      case 'departments': return <Departments />;
      case 'users': return <Users />;
      default: return <Dashboard />;
    }
  };

  if (loading) {
    return (
      <div className="loading-screen" style={{ background: '#f8fafc' }}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="loader-content">
          <div className="medical-loader"><Heart className="heart-pulse" size={64} style={{ color: '#ef4444' }} /></div>
          <div className="loading-text" style={{ marginTop: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.5px' }}>TTYT LIÊN CHIỂU</h2>
            <p style={{ color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.75rem' }}>Đang khởi tạo hệ thống...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Public View Screen (for QR scans)
  if (publicViewId) {
    return (
      <div className="login-wrapper" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="login-glass-overlay" />
        <motion.div className="login-card-container" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div className="login-card-premium">
            <div className="login-header-brand">
              <img src={logo} alt="Logo" className="login-logo-img" />
              <h3 className="login-brand-title">THÔNG TIN THIẾT BỊ</h3>
              <p className="login-brand-subtitle">TTYT Khu vực Liên Chiểu</p>
            </div>
            {publicData ? (
              <div className="public-details">
                <div className="detail-row"><div className="detail-item"><span className="label"><Hash size={14}/> Mã thiết bị</span><span className="val highlight">{publicData.id}</span></div><div className="detail-item"><span className="label"><Activity size={14}/> Trạng thái</span><span className={`status-pill ${publicData.status?.includes('tốt') ? 'success' : 'warning'}`}>{publicData.status}</span></div></div>
                <div className="detail-item full"><span className="label"><Package size={14}/> Tên thiết bị</span><span className="val large">{publicData.name}</span></div>
                <div className="detail-row"><div className="detail-item"><span className="label"><Tag size={14}/> Phân loại</span><span className="val">{publicData.type}</span></div><div className="detail-item"><span className="label"><Building size={14}/> Khoa phòng</span><span className="val">{publicData.department}</span></div></div>
                <div className="public-contact-box"><div className="contact-title">HỖ TRỢ KỸ THUẬT</div><div className="contact-info"><div className="contact-field"><User size={14} /><span>{publicData.contact_person || 'Chưa cập nhật'}</span></div><div className="contact-field highlight"><Phone size={14} /><a href={`tel:${publicData.contact_phone}`} className="phone-link">{publicData.contact_phone || 'N/A'}</a></div></div></div>
                <button className="login-action-btn" style={{ marginTop: '2rem' }} onClick={() => { setPublicViewId(null); window.history.replaceState({}, '', '/'); }}><span>Quay lại trang chủ</span></button>
              </div>
            ) : (
              <div className="public-loading"><Loader2 className="animate-spin" size={32} /><p>Đang truy xuất thông tin...</p></div>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="login-split-container">
        <motion.div className="login-branding-side" initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
          <div className="branding-content">
            <img src={logo} alt="Logo" className="branding-logo" />
            <h1>Lien Chieu<br/>Medical System</h1>
            <p>Hệ thống quản trị tài sản và trang thiết bị y tế tập trung. Giải pháp tối ưu cho công tác bảo trì và vận hành kỹ thuật bệnh viện.</p>
            <div style={{ marginTop: '3rem', display: 'flex', gap: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Database size={24} color="var(--secondary)" /><strong>Neon SQL</strong></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Cloud size={24} color="var(--secondary)" /><strong>Cloud Sync</strong></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Stethoscope size={24} color="var(--secondary)" /><strong>Secure</strong></div>
            </div>
          </div>
        </motion.div>

        <div className="login-form-side">
          <motion.div className="login-form-card" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <div className="form-header">
              <h2>Đăng nhập</h2>
              <p>Vui lòng nhập thông tin xác thực hệ thống</p>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); const username = e.target.username.value; const role = username === 'admin' ? 'admin' : 'staff'; handleLogin({ name: username === 'admin' ? 'Quản trị viên' : 'Nhân viên', username, role }); }}>
              <div className="ui-field">
                <label>Tài khoản quản trị</label>
                <div className="ui-input-wrapper">
                  <User size={20} />
                  <input name="username" type="text" placeholder="Tên đăng nhập..." required />
                </div>
              </div>
              <div className="ui-field">
                <label>Mật khẩu truy cập</label>
                <div className="ui-input-wrapper">
                  <Lock size={20} />
                  <input name="password" type="password" placeholder="••••••••" required />
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748b', fontWeight: 700, cursor: 'pointer' }}>
                  <input type="checkbox" style={{ width: '16px', height: '16px' }} /> Duy trì đăng nhập
                </label>
                <a href="#" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 800, textDecoration: 'none' }}>Quên mật khẩu?</a>
              </div>

              <button type="submit" className="ui-submit-btn">
                <span>Vào hệ thống</span>
                <ChevronRight size={20} />
              </button>
            </form>

            <div style={{ marginTop: '3rem', textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '2rem' }}>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>Bản quyền thuộc về TTYT Liên Chiểu © 2026</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 800, marginTop: '4px' }}>Design & Developed by QUỐC TRÍ</p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={() => setIsSidebarOpen(false)} />
      <div className={`sidebar-container ${isSidebarOpen ? 'open' : ''}`}><Sidebar activeView={activeView} setActiveView={(v) => { setActiveView(v); setIsSidebarOpen(false); }} onClose={() => setIsSidebarOpen(false)} user={user} onLogout={handleLogout} /></div>
      <div className="main-wrapper">
        <Header title={getTitle()} user={user} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} onLogout={handleLogout} />
        <main className="main-content">
          <AnimatePresence mode="wait">
            <motion.div key={activeView} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              {renderView()}
            </motion.div>
          </AnimatePresence>
          <footer className="app-footer">
            <p><span className="footer-brand">@2026 Lien Chieu Medical</span> | Design by <strong>Quốc Trí</strong></p>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
