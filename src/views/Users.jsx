import React, { useState } from 'react';
import { Plus, Trash2, Loader2, User, Shield, X, CheckCircle2 } from 'lucide-react';
import { useUsers } from '../hooks/useSystem';
import Modal from '../components/Modal';

const Users = () => {
  const { users, loading, addUser, deleteUser } = useUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', username: '', password: '', role: 'staff' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addUser(formData);
      setIsModalOpen(false);
      setFormData({ name: '', username: '', password: '', role: 'staff' });
      alert('Đã tạo tài khoản thành công!');
    } catch (err) {
      alert('Lỗi tạo tài khoản: ' + err.message);
    }
  };

  if (loading) return <div className="view-loader"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="view-container fade-in">
      <div className="inventory-header">
        <div className="header-actions">
          <h3>Quản lý Người dùng</h3>
          <button className="primary-btn" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} />
            <span>Thêm người dùng</span>
          </button>
        </div>
      </div>

      <div className="table-card glass">
        <table className="data-table">
          <thead>
            <tr>
              <th>Họ tên</th>
              <th>Tên đăng nhập</th>
              <th>Vai trò</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>
                  <div className="user-cell">
                    <div className="u-avatar"><User size={16} /></div>
                    <span>{u.name}</span>
                  </div>
                </td>
                <td><span className="id-badge">{u.username}</span></td>
                <td>
                  <span className={`role-pill ${u.role}`}>
                    {u.role === 'admin' ? <Shield size={12} /> : null}
                    {u.role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}
                  </span>
                </td>
                <td>
                  <button 
                    className="action-btn delete" 
                    onClick={() => u.username !== 'admin' && deleteUser(u.id)}
                    disabled={u.username === 'admin'}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Thêm người dùng mới">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Họ và tên</label>
            <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Tên đăng nhập</label>
            <input type="text" required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Mật khẩu</label>
            <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Vai trò</label>
            <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
              <option value="staff">Nhân viên</option>
              <option value="admin">Quản trị viên</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="cancel-btn flex-center gap-2" onClick={() => setIsModalOpen(false)}>
              <X size={18} />
              <span>Hủy bỏ</span>
            </button>
            <button type="submit" className="submit-btn flex-center gap-2">
              <CheckCircle2 size={18} />
              <span>Tạo tài khoản</span>
            </button>
          </div>
        </form>
      </Modal>

      <style jsx>{`
        .user-cell { display: flex; align-items: center; gap: 0.75rem; }
        .u-avatar { width: 32px; height: 32px; background: var(--surface-hover); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--primary); }
        .role-pill { padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600; display: flex; align-items: center; gap: 0.25rem; width: fit-content; }
        .role-pill.admin { background: rgba(15, 82, 186, 0.1); color: var(--primary); }
        .role-pill.staff { background: var(--surface-hover); color: var(--text-muted); }
      `}</style>
    </div>
  );
};

export default Users;
