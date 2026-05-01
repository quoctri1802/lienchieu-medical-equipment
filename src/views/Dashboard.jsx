import React from 'react';
import { 
  Activity, 
  Package, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Clock,
  Calendar,
  Building2,
  PieChart as PieIcon,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { useStats, useDepartments } from '../hooks/useSystem';
import { useEquipment } from '../hooks/useEquipment';

const Dashboard = () => {
  const stats = useStats();
  const { departments } = useDepartments();
  const { equipment } = useEquipment();

  const statusData = [
    { name: 'Sử dụng tốt', value: stats.active || 0, color: '#10b981' },
    { name: 'Bảo trì', value: stats.maintenance || 0, color: '#f59e0b' },
    { name: 'Hỏng hóc', value: stats.broken || 0, color: '#ef4444' },
  ].filter(d => d.value > 0);

  const deptData = departments.map(d => ({
    name: d.name,
    count: equipment.filter(e => e.department === d.name).length
  })).filter(d => d.count > 0).slice(0, 5);

  const trendData = [
    { name: 'T2', value: 40 }, { name: 'T3', value: 30 }, { name: 'T4', value: 65 },
    { name: 'T5', value: 45 }, { name: 'T6', value: 90 }, { name: 'T7', value: 75 }, { name: 'CN', value: 85 },
  ];

  const statCards = [
    { title: 'Tổng tài sản', value: stats.total || 0, icon: <Package size={22} />, color: 'var(--primary)', bg: 'rgba(10, 88, 202, 0.08)', trend: '+2.4%' },
    { title: 'Đang vận hành', value: stats.active || 0, icon: <Zap size={22} />, color: '#10b981', bg: 'rgba(16, 185, 129, 0.08)', trend: '98%' },
    { title: 'Lịch bảo trì', value: stats.maintenance || 0, icon: <Clock size={22} />, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.08)', trend: 'Ổn định' },
    { title: 'Sự cố thiết bị', value: stats.broken || 0, icon: <ShieldCheck size={22} />, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.08)', trend: '-5%' },
  ];

  return (
    <div className="view-container fade-in">
      <div className="dashboard-welcome" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div className="welcome-text">
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-1px' }}>Chào mừng trở lại, Quản trị viên</h1>
          <p style={{ color: '#64748b', fontWeight: 600 }}>Dữ liệu hệ thống TTYT Liên Chiểu cập nhật lúc {new Date().toLocaleTimeString('vi-VN')}</p>
        </div>
        <div className="date-badge" style={{ background: 'white', padding: '0.75rem 1.5rem', borderRadius: '100px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 800, color: '#475569', boxShadow: 'var(--shadow-sm)' }}>
          <Calendar size={18} color="var(--primary)" />
          <span>{new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
        </div>
      </div>

      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {statCards.map((stat, i) => (
          <div key={i} className="premium-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyObject: 'center' }}>{stat.icon}</div>
              <div style={{ padding: '4px 10px', borderRadius: '100px', background: '#f8fafc', color: stat.color, fontSize: '0.7rem', fontWeight: 800, height: 'fit-content' }}>{stat.trend}</div>
            </div>
            <div className="stat-main">
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.title}</span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', marginTop: '4px' }}>{stat.value}</h2>
            </div>
          </div>
        ))}
      </div>

      <div className="charts-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="premium-card">
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.75rem' }}><PieIcon size={20} color="var(--primary)" /> Phân bố trạng thái</h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, marginTop: '4px' }}>Tỷ lệ trang thiết bị theo tình trạng kỹ thuật</p>
          </div>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value">
                  {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1rem' }}>
            {statusData.map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: d.color }} />
                <span>{d.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="premium-card">
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Building2 size={20} color="var(--primary)" /> Mật độ thiết bị tại Khoa Phòng</h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, marginTop: '4px' }}>Top 5 khoa có lượng tài sản lớn nhất</p>
          </div>
          <div style={{ height: '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }} width={100} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                <Bar dataKey="count" fill="var(--primary)" radius={[0, 10, 10, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1200px) { .stats-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 1024px) { .charts-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 640px) { .stats-grid { grid-template-columns: 1fr !important; } .dashboard-welcome { flex-direction: column; gap: 1.5rem; } }
      `}</style>
    </div>
  );
};

export default Dashboard;
