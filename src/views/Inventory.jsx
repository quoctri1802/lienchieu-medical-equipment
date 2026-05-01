import React, { useState } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2,
  Loader2,
  Search,
  Hash,
  Tag,
  Building,
  Activity,
  Package,
  CheckCircle2,
  QrCode,
  Printer,
  Phone,
  UserCheck,
  ShieldAlert,
  ClipboardList,
  AlertTriangle,
  Clock,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useEquipment } from '../hooks/useEquipment';
import { useDepartments } from '../hooks/useSystem';
import Modal from '../components/Modal';
import logo from '../assets/logo/logo.png';

const Inventory = () => {
  const { equipment, loading, addEquipment, updateEquipment, deleteEquipment } = useEquipment();
  const { departments } = useDepartments();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('Tất cả');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [currentEq, setCurrentEq] = useState(null);
  
  const [formData, setFormData] = useState({
    id: '', name: '', type: '', department: '', status: 'Sử dụng tốt', 
    vendor: '', purchase_date: '', price: 0, serial_number: '',
    contact_person: '', contact_phone: ''
  });

  // Calculate quick stats
  const stats = {
    total: equipment.length,
    good: equipment.filter(e => e.status === 'Sử dụng tốt').length,
    maintenance: equipment.filter(e => e.status === 'Đang bảo trì').length,
    broken: equipment.filter(e => e.status?.includes('Hỏng')).length
  };

  const handleOpenModal = (eq = null) => {
    setCurrentEq(eq);
    if (eq) {
      setFormData({
        ...eq,
        purchase_date: eq.purchase_date ? eq.purchase_date.split('T')[0] : '',
        price: Number(eq.price) || 0,
        contact_person: eq.contact_person || '',
        contact_phone: eq.contact_phone || ''
      });
    } else {
      setFormData({
        id: `EQ-${Date.now().toString().slice(-6)}`,
        name: '', type: '', department: departments[0]?.name || '', status: 'Sử dụng tốt',
        vendor: '', purchase_date: new Date().toISOString().split('T')[0], price: 0, serial_number: '',
        contact_person: '', contact_phone: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleShowQR = (eq) => {
    setCurrentEq(eq);
    setIsQRModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSave = { ...formData, price: Number(formData.price) || 0 };
      if (currentEq) await updateEquipment(currentEq.id, dataToSave);
      else await addEquipment(dataToSave);
      setIsModalOpen(false);
      alert(currentEq ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
    } catch (err) {
      alert('Không thể lưu dữ liệu: ' + (err.message || 'Lỗi hệ thống'));
    }
  };

  const getStatusColor = (status) => {
    if (!status) return 'muted';
    if (status.includes('tốt')) return 'success';
    if (status.includes('bảo trì')) return 'warning';
    if (status.includes('Hỏng')) return 'error';
    return 'muted';
  };

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.serial_number?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDept === 'Tất cả' || item.department === filterDept;
    return matchesSearch && matchesDept;
  });

  const handlePrintQR = () => { window.print(); };
  const getQRData = (eq) => eq ? `${window.location.origin}/view/${eq.id}` : '';

  if (loading && equipment.length === 0) return <div className="view-loader"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="view-container fade-in">
      <div className="inventory-stats maintenance-stats" style={{ marginBottom: '2.5rem' }}>
        <div className="m-stat-card premium-card">
          <div className="m-stat-icon" style={{ background: 'rgba(10, 88, 202, 0.1)', color: 'var(--primary)' }}><Package size={24} /></div>
          <div className="m-stat-info"><h4>{stats.total}</h4><span>Tổng thiết bị</span></div>
        </div>
        <div className="m-stat-card premium-card">
          <div className="m-stat-icon completed"><CheckCircle2 size={24} /></div>
          <div className="m-stat-info"><h4>{stats.good}</h4><span>Sử dụng tốt</span></div>
        </div>
        <div className="m-stat-card premium-card">
          <div className="m-stat-icon processing"><Clock size={24} /></div>
          <div className="m-stat-info"><h4>{stats.maintenance}</h4><span>Bảo trì</span></div>
        </div>
        <div className="m-stat-card premium-card">
          <div className="m-stat-icon pending"><AlertTriangle size={24} /></div>
          <div className="m-stat-info"><h4>{stats.broken}</h4><span>Hỏng hóc</span></div>
        </div>
      </div>

      <div className="header-actions">
        <div className="filters">
          <div className="search-bar">
            <Search size={18} />
            <input type="text" placeholder="Tìm kiếm tên, mã thiết bị hoặc serial..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="filter-group">
            <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
              <option value="Tất cả">Tất cả khoa phòng</option>
              {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
            </select>
          </div>
        </div>
        <button className="primary-btn" onClick={() => handleOpenModal()}>
          <Plus size={18} />
          <span>Thêm thiết bị mới</span>
        </button>
      </div>

      <div className="table-card premium-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã / QR</th>
              <th>Tên thiết bị</th>
              <th>Phân loại</th>
              <th>Khoa sử dụng</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredEquipment.map((item) => (
              <tr key={item.id}>
                <td data-label="Mã / QR">
                  <div className="qr-cell-trigger" onClick={() => handleShowQR(item)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 800 }}>
                    <QrCode size={16} />
                    <span>{item.id}</span>
                  </div>
                </td>
                <td data-label="Tên thiết bị">
                  <div className="name-cell">
                    <span style={{ display: 'block', fontWeight: 700, color: '#1e293b' }}>{item.name}</span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.vendor || 'N/A'}</span>
                  </div>
                </td>
                <td data-label="Phân loại">{item.type}</td>
                <td data-label="Khoa sử dụng">{item.department}</td>
                <td data-label="Trạng thái"><span className={`status-pill ${getStatusColor(item.status)}`}>{item.status}</span></td>
                <td data-label="Thao tác">
                  <div className="actions-cell" style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="action-btn" onClick={() => handleOpenModal(item)} style={{ width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyObject: 'center', background: '#f1f5f9', border: 'none', cursor: 'pointer' }}><Edit2 size={14} /></button>
                    <button className="action-btn delete" onClick={() => deleteEquipment(item.id)} style={{ width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyObject: 'center', background: '#fef2f2', color: '#ef4444', border: 'none', cursor: 'pointer' }}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Professional Equipment Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentEq ? 'Cập nhật thiết bị' : 'Thêm thiết bị y tế mới'} icon={ClipboardList}>
        <form onSubmit={handleSubmit}>
          <div className="form-row-premium">
            <div className="form-group-premium"><label>Mã thiết bị</label><div className="input-box-premium"><Hash size={18} /><input type="text" value={formData.id} readOnly style={{ background: '#f8fafc', color: '#94a3b8' }} /></div></div>
            <div className="form-group-premium"><label>Tên thiết bị</label><div className="input-box-premium"><Package size={18} /><input type="text" required placeholder="Nhập tên thiết bị..." value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div></div>
          </div>
          <div className="form-row-premium">
            <div className="form-group-premium"><label>Phân loại</label><div className="input-box-premium"><Tag size={18} /><input type="text" required placeholder="VD: Máy siêu âm..." value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} /></div></div>
            <div className="form-group-premium"><label>Khoa phòng</label><div className="input-box-premium"><Building size={18} /><select value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}>{departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}</select></div></div>
          </div>
          <div className="form-row-premium">
            <div className="form-group-premium"><label>Kỹ thuật viên NCC</label><div className="input-box-premium"><UserCheck size={18} /><input type="text" placeholder="Người hỗ trợ kỹ thuật..." value={formData.contact_person} onChange={e => setFormData({...formData, contact_person: e.target.value})} /></div></div>
            <div className="form-group-premium"><label>Số điện thoại hỗ trợ</label><div className="input-box-premium"><Phone size={18} /><input type="text" placeholder="Số điện thoại khẩn cấp..." value={formData.contact_phone} onChange={e => setFormData({...formData, contact_phone: e.target.value})} /></div></div>
          </div>
          <div className="form-row-premium">
            <div className="form-group-premium"><label>Nhà cung cấp</label><div className="input-box-premium"><Building size={18} /><input type="text" value={formData.vendor} onChange={e => setFormData({...formData, vendor: e.target.value})} /></div></div>
            <div className="form-group-premium"><label>Số Serial</label><div className="input-box-premium"><ShieldAlert size={18} /><input type="text" value={formData.serial_number} onChange={e => setFormData({...formData, serial_number: e.target.value})} /></div></div>
          </div>
          <div className="form-row-premium">
            <div className="form-group-premium"><label>Giá trị (VNĐ)</label><div className="input-box-premium"><DollarSign size={18} /><input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} /></div></div>
            <div className="form-group-premium"><label>Trạng thái</label><div className="input-box-premium"><Activity size={18} /><select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}><option value="Sử dụng tốt">Sử dụng tốt</option><option value="Đang bảo trì">Đang bảo trì</option><option value="Hỏng - Chờ sửa chữa">Hỏng - Chờ sửa chữa</option></select></div></div>
          </div>
          <div className="modal-footer-premium"><button type="button" className="modal-btn-cancel" onClick={() => setIsModalOpen(false)}>Hủy bỏ</button><button type="submit" className="modal-btn-save">Lưu thiết bị</button></div>
        </form>
      </Modal>

      {/* QR Code Modal */}
      <Modal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} title="Mã QR định danh" icon={QrCode}>
        <div className="qr-modal-content" style={{ textAlign: 'center' }}>
          <div className="qr-card" style={{ background: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid #f1f5f9', display: 'inline-block' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>TTYT LIÊN CHIỂU</h3>
            <QRCodeSVG value={getQRData(currentEq)} size={200} level="H" includeMargin={true} imageSettings={{ src: logo, height: 40, width: 40, excavate: true }} />
            <div style={{ marginTop: '1rem', fontWeight: 800 }}>{currentEq?.id}</div>
            <div style={{ fontSize: '0.9rem', color: '#64748b' }}>{currentEq?.name}</div>
          </div>
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="primary-btn" onClick={handlePrintQR}><Printer size={18} /><span>In mã QR</span></button>
            <button className="modal-btn-cancel" onClick={() => setIsQRModalOpen(false)}>Đóng</button>
          </div>
        </div>
      </Modal>

      <style jsx>{`
        .inventory-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
        @media (max-width: 1024px) { .inventory-stats { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .inventory-stats { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
};

export default Inventory;
