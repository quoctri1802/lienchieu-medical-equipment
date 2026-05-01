import React, { useState } from 'react';
import { 
  Bell, 
  Menu, 
  X, 
  User, 
  ChevronDown,
  Search,
  Settings,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = ({ title, user, toggleSidebar, isSidebarOpen, onLogout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="header fade-in">
      <div className="header-left">
        <button className="mobile-menu-btn" onClick={toggleSidebar} style={{ display: 'none' }}>
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="header-title">
          <h2>{title}</h2>
        </div>
      </div>

      <div className="header-right">
        <div className="header-tools">
          <button className="tool-btn"><Search size={20} /></button>
          <button className="tool-btn"><Bell size={20} /><span className="notif-dot" /></button>
          <button className="tool-btn"><Settings size={20} /></button>
        </div>
        
        <div className="user-profile-relative" style={{ position: 'relative' }}>
          <div className="user-profile-trigger" onClick={() => setIsProfileOpen(!isProfileOpen)}>
            <div className="user-avatar">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="user-info">
              <span className="user-name">{user?.name}</span>
              <span className="user-role">{user?.role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}</span>
            </div>
            <ChevronDown size={14} className={`chevron ${isProfileOpen ? 'rotate' : ''}`} />
          </div>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div 
                className="profile-dropdown glass-premium"
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
              >
                <div className="dropdown-header">
                  <p>Tài khoản hiện tại</p>
                  <strong>{user?.username}</strong>
                </div>
                <div className="dropdown-divider" />
                <button className="dropdown-item"><User size={16} /><span>Thông tin cá nhân</span></button>
                <button className="dropdown-item"><ShieldCheck size={16} /><span>Bảo mật</span></button>
                <div className="dropdown-divider" />
                <button className="dropdown-item logout" onClick={onLogout}>
                  <LogOut size={16} />
                  <span>Đăng xuất</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style jsx>{`
        .header-right { display: flex; align-items: center; gap: 2rem; }
        .header-tools { display: flex; align-items: center; gap: 0.75rem; padding-right: 2rem; border-right: 1px solid var(--border); }
        .tool-btn { 
          width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center;
          color: var(--text-secondary); transition: all 0.3s; position: relative;
        }
        .tool-btn:hover { background: white; color: var(--primary); box-shadow: var(--shadow-sm); }
        .notif-dot { position: absolute; top: 10px; right: 10px; width: 8px; height: 8px; background: var(--error); border-radius: 50%; border: 2px solid white; }
        
        .user-profile-trigger { display: flex; align-items: center; gap: 1rem; cursor: pointer; padding: 6px 12px; border-radius: 16px; transition: all 0.3s; }
        .user-profile-trigger:hover { background: white; box-shadow: var(--shadow-sm); }
        .user-avatar { 
          width: 42px; height: 42px; border-radius: 12px; background: var(--grad-primary); color: white;
          display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.1rem;
        }
        .user-info { display: flex; flex-direction: column; }
        .user-name { font-size: 0.9rem; font-weight: 800; color: var(--text-primary); }
        .user-role { font-size: 0.7rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
        .chevron { color: var(--text-muted); transition: transform 0.3s; }
        .chevron.rotate { transform: rotate(180deg); }

        .profile-dropdown {
          position: absolute; top: calc(100% + 10px); right: 0; width: 220px;
          background: rgba(255, 255, 255, 0.95); border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1); padding: 0.75rem; z-index: 1000;
          border: 1px solid var(--border);
        }
        .dropdown-header { padding: 0.5rem 1rem; margin-bottom: 0.5rem; }
        .dropdown-header p { font-size: 0.7rem; color: var(--text-muted); font-weight: 700; }
        .dropdown-header strong { font-size: 0.9rem; color: var(--text-primary); }
        .dropdown-divider { height: 1px; background: var(--border); margin: 0.5rem 0; }
        .dropdown-item {
          width: 100%; padding: 0.75rem 1rem; border-radius: 12px; display: flex; align-items: center; gap: 0.75rem;
          color: var(--text-secondary); font-size: 0.85rem; font-weight: 700; transition: all 0.2s; border: none; background: transparent; cursor: pointer;
        }
        .dropdown-item:hover { background: #f1f5f9; color: var(--primary); }
        .dropdown-item.logout { color: var(--error); }
        .dropdown-item.logout:hover { background: #fef2f2; }

        @media (max-width: 1024px) {
          .mobile-menu-btn { display: flex !important; }
          .header-tools { display: none; }
        }
      `}</style>
    </header>
  );
};

export default Header;
