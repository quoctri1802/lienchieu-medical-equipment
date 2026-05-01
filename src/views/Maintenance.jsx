import React, { useState } from 'react';
import { 
  Plus, 
  Wrench, 
  AlertCircle, 
  CheckCircle2, 
  Search, 
  Calendar, 
  User, 
  Settings,
  Clock,
  MoreVertical,
  ClipboardList,
  Hash,
  DollarSign,
  Activity,
  UserCheck
} from 'lucide-react';
import { useMaintenance } from '../hooks/useSystem';
import Modal from '../components/Modal';

const Maintenance = () => {
  const { logs, loading, addLog, updateLog } = useMaintenance();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Tất cả');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    equipment_id: '',
    equipment_name: '',
    description: '',
    technician: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Đang xử lý',
    cost: 0
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Hoàn thành': return { bg: '#ecfdf5', text: '#10b981', icon: <CheckCircle2 size={14} /> };
      case 'Đang xử lý': return { bg: '#fffbeb', text: '#f59e0b', icon: <Clock size={14} /> };
      case 'Chờ phụ tùng': return { bg: '#fef2f2', text: '#ef4444', icon: <AlertCircle size={14} /> };
      default: return { bg: '#f8fafc', text: '#64748b', icon: <Settings size={14} /> };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addLog(formData);
    setIsModalOpen(false);
    alert('Đã tạo phiếu bảo trì mới!');
  };

  const filteredLogs = logs.filter(log => 
    log.equipment_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.equipment_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="view-container fade-in">
      <div className="header-actions">
        <div className="filters">
          <div className="search-bar">
            <Search size={18} />
            <input type="text" placeholder="Tìm phiếu bảo trì..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="filter-group">
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="Tất cả">Trạng thái: Tất cả</option>
              <option value="Đang xử lý">Đang xử lý</option>
              <option value="Hoàn thành">Hoàn thành</option>
              <option value="Chờ phụ tùng">Chờ phụ tùng</option>
            </select>
          </div>
        </div>
        <button className="primary-btn" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          <span>Tạo phiếu sửa chữa</span>
        </button>
      </div>

      <div className="maintenance-stats">
        <div className="m-stat-card premium-card">
          <div className="m-stat-icon processing"><Clock size={24} /></div>
          <div className="m-stat-info"><h4>{logs.filter(l => l.status === 'Đang xử lý').length}</h4><span>Đang xử lý</span></div>
        </div>
        <div className="m-stat-card premium-card">
          <div className="m-stat-icon completed"><CheckCircle2 size={24} /></div>
          <div className="m-stat-info"><h4>{logs.filter(l => l.status === 'Hoàn thành').length}</h4><span>Hoàn thành</span></div>
        </div>
        <div className="m-stat-card premium-card">
          <div className="m-stat-icon pending"><AlertCircle size={24} /></div>
          <div className="m-stat-info"><h4>{logs.filter(l => l.status === 'Chờ phụ tùng').length}</h4><span>Chờ phụ tùng</span></div>
        </div>
      </div>

      <div className="table-card premium-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Phiếu / Ngày</th>
              <th>Thiết bị</th>
              <th>Nội dung</th>
              <th>Kỹ thuật</th>
              <th>Trạng thái</th>
              <th>Chi phí</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => {
              const status = getStatusStyle(log.status);
              return (
                <tr key={log.id}>
                  <td data-label="Phiếu / Ngày"><div className="log-id-cell"><span className="log-id">#M-{log.id.toString().slice(-4)}</span><span className="log-date">{new Date(log.date).toLocaleDateString('vi-VN')}</span></div></td>
                  <td data-label="Thiết bị"><div className="eq-cell"><span className="eq-name-main">{log.equipment_name}</span><span className="eq-id-sub">{log.equipment_id}</span></div></td>
                  <td data-label="Nội dung"><p className="log-desc">{log.description}</p></td>
                  <td data-label="Kỹ thuật"><div className="tech-cell"><User size={14} /><span>{log.technician}</span></div></td>
                  <td data-label="Trạng thái"><span className="status-pill-custom" style={{ backgroundColor: status.bg, color: status.text }}>{status.icon}{log.status}</span></td>
                  <td data-label="Chi phí"><span className="log-cost">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(log.cost)}</span></td>
                  <td data-label="Thao tác"><button className="action-btn"><MoreVertical size={16} /></button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Lập phiếu sửa chữa kỹ thuật" icon={Wrench}>
        <form onSubmit={handleSubmit}>
          <div className="form-row-premium">
            <div className="form-group-premium">
              <label>Mã thiết bị</label>
              <div className="input-box-premium"><Hash size={18} /><input type="text" placeholder="EQ-XXXX" value={formData.equipment_id} onChange={e => setFormData({...formData, equipment_id: e.target.value})} required /></div>
            </div>
            <div className="form-group-premium">
              <label>Tên thiết bị</label>
              <div className="input-box-premium"><ClipboardList size={18} /><input type="text" placeholder="Nhập tên thiết bị..." value={formData.equipment_name} onChange={e => setFormData({...formData, equipment_name: e.target.value})} required /></div>
            </div>
          </div>
          <div className="form-group-premium" style={{ marginBottom: '1.5rem' }}>
            <label>Nội dung xử lý kỹ thuật</label>
            <div className="input-box-premium" style={{ alignItems: 'flex-start' }}>
              <Settings size={18} style={{ marginTop: '14px' }} />
              <textarea rows="3" placeholder="Mô tả chi tiết tình trạng và giải pháp..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required style={{ paddingLeft: '3.5rem' }} />
            </div>
          </div>
          <div className="form-row-premium">
            <div className="form-group-premium">
              <label>Kỹ thuật viên xử lý</label>
              <div className="input-box-premium"><UserCheck size={18} /><input type="text" placeholder="Tên người thực hiện..." value={formData.technician} onChange={e => setFormData({...formData, technician: e.target.value})} required /></div>
            </div>
            <div className="form-group-premium">
              <label>Ngày thực hiện</label>
              <div className="input-box-premium"><Calendar size={18} /><input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required /></div>
            </div>
          </div>
          <div className="form-row-premium">
            <div className="form-group-premium">
              <label>Chi phí dự kiến</label>
              <div className="input-box-premium"><DollarSign size={18} /><input type="number" placeholder="0" value={formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})} /></div>
            </div>
            <div className="form-group-premium">
              <label>Trạng thái phiếu</label>
              <div className="input-box-premium"><Activity size={18} /><select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}><option value="Đang xử lý">Đang xử lý</option><option value="Hoàn thành">Hoàn thành</option><option value="Chờ phụ tùng">Chờ phụ tùng</option></select></div>
            </div>
          </div>
          <div className="modal-footer-premium">
            <button type="button" className="modal-btn-cancel" onClick={() => setIsModalOpen(false)}>Hủy bỏ</button>
            <button type="submit" className="modal-btn-save">Phát hành phiếu</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Maintenance;
