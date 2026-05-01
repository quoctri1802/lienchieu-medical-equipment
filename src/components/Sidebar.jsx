import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Wrench, 
  History, 
  LogOut,
  Building2,
  Users,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import logo from '../assets/logo/logo.png';

const Sidebar = ({ activeView, setActiveView, user, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'inventory', label: 'Thiết bị y tế', icon: Package },
    { id: 'maintenance', label: 'Bảo trì sửa chữa', icon: Wrench },
    { id: 'departments', label: 'Khoa phòng', icon: Building2 },
  ];

  if (user?.role === 'admin') {
    menuItems.push({ id: 'users', label: 'Người dùng', icon: Users });
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="app-logo" />
          <div className="logo-text">
            <h2>LIÊN CHIỂU</h2>
            <span>Equipment Manager</span>
          </div>
        </div>
        <button className="mobile-close-sidebar" onClick={() => setActiveView(activeView)} style={{ display: 'none' }}>
          <X size={24} />
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button 
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveView(item.id)}
            >
              <div className="nav-icon-box">
                <Icon size={20} />
              </div>
              <span className="nav-label">{item.label}</span>
              {isActive && <ChevronRight size={14} className="active-arrow" />}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="auth-status glass-premium">
          <ShieldCheck size={16} className="status-icon" />
          <div className="status-text">
            <p>Hệ thống bảo mật</p>
            <span>v2.1 Stable</span>
          </div>
        </div>
        
        <button className="logout-btn" onClick={onLogout}>
          <LogOut size={20} />
          <span>Đăng xuất</span>
        </button>
      </div>

      <style jsx>{`
        .sidebar-nav { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
        .nav-icon-box { display: flex; align-items: center; justify-content: center; }
        .active-arrow { margin-left: auto; opacity: 0.8; }
        
        .sidebar-footer { margin-top: auto; padding-top: 2rem; border-top: 1px solid var(--border); }
        .auth-status { 
          display: flex; align-items: center; gap: 1rem; padding: 1rem; 
          border-radius: 16px; margin-bottom: 1.5rem; background: rgba(10, 88, 202, 0.05);
        }
        .status-icon { color: var(--primary); }
        .status-text p { font-size: 0.75rem; font-weight: 800; color: var(--text-primary); }
        .status-text span { font-size: 0.65rem; color: var(--text-muted); }
        
        .logout-btn { 
          width: 100%; padding: 1rem; border-radius: 16px; display: flex; align-items: center; gap: 1rem;
          color: #ef4444; font-weight: 700; transition: all 0.3s;
        }
        .logout-btn:hover { background: #fef2f2; transform: translateY(-2px); }
      `}</style>
    </aside>
  );
};

export default Sidebar;
