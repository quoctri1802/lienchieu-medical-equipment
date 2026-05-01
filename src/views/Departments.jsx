import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Loader2, Building, Hash, FileText, X, CheckCircle2 } from 'lucide-react';
import { useDepartments } from '../hooks/useSystem';
import Modal from '../components/Modal';

const Departments = () => {
  const { departments, loading, addDepartment, updateDepartment, deleteDepartment } = useDepartments();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDept, setCurrentDept] = useState(null);
  const [formData, setFormData] = useState({ name: '', code: '', description: '' });

  const handleOpenModal = (dept = null) => {
    setCurrentDept(dept);
    setFormData(dept || { name: '', code: '', description: '' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentDept) {
        await updateDepartment(currentDept.id, formData);
      } else {
        await addDepartment(formData);
      }
      setIsModalOpen(false);
      alert('Lưu khoa phòng thành công!');
    } catch (err) {
      alert('Lỗi lưu khoa phòng: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khoa phòng này?')) {
      await deleteDepartment(id);
    }
  };

  if (loading) return <div className="view-loader"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="view-container fade-in">
      <div className="inventory-header">
        <div className="header-actions">
          <h3>Quản lý Khoa Phòng</h3>
          <button className="primary-btn" onClick={() => handleOpenModal()}>
            <Plus size={18} />
            <span>Thêm khoa mới</span>
          </button>
        </div>
      </div>

      <div className="table-card glass">
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã Khoa</th>
              <th>Tên Khoa Phòng</th>
              <th>Mô tả</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {departments.map(dept => (
              <tr key={dept.id}>
                <td><span className="id-badge">{dept.code}</span></td>
                <td><strong>{dept.name}</strong></td>
                <td>{dept.description || '--'}</td>
                <td>
                  <div className="actions-cell">
                    <button className="action-btn" onClick={() => handleOpenModal(dept)} title="Sửa"><Edit2 size={16} /></button>
                    <button className="action-btn delete" onClick={() => handleDelete(dept.id)} title="Xóa"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={currentDept ? 'Cập nhật khoa phòng' : 'Thêm khoa phòng mới'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên khoa phòng</label>
            <div className="input-wrapper">
              <Building className="input-icon" size={18} />
              <input 
                type="text" 
                required 
                placeholder="VD: Khoa Cấp cứu, Khoa ICU..."
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Mã khoa</label>
            <div className="input-wrapper">
              <Hash className="input-icon" size={18} />
              <input 
                type="text" 
                required 
                placeholder="VD: KCC, KICU..."
                value={formData.code}
                onChange={e => setFormData({...formData, code: e.target.value})}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Mô tả chi tiết</label>
            <div className="input-wrapper" style={{ alignItems: 'flex-start' }}>
              <FileText className="input-icon" size={18} style={{ marginTop: '0.9rem' }} />
              <textarea 
                rows="4"
                placeholder="Thông tin thêm về khoa phòng..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                style={{ paddingLeft: '3rem' }}
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="cancel-btn flex-center gap-2" onClick={() => setIsModalOpen(false)}>
              <X size={18} />
              <span>Hủy bỏ</span>
            </button>
            <button type="submit" className="submit-btn flex-center gap-2">
              <CheckCircle2 size={18} />
              <span>Lưu khoa phòng</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Departments;
