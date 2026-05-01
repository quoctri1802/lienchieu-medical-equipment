import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const useDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/departments`);
      const data = await res.json();
      setDepartments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addDepartment = async (dept) => {
    const res = await fetch(`${API_URL}/departments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dept),
    });
    const data = await res.json();
    setDepartments(prev => [...prev, data]);
    return data;
  };

  const updateDepartment = async (id, dept) => {
    const res = await fetch(`${API_URL}/departments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dept),
    });
    const data = await res.json();
    setDepartments(prev => prev.map(d => d.id === id ? data : d));
    return data;
  };

  const deleteDepartment = async (id) => {
    await fetch(`${API_URL}/departments/${id}`, { method: 'DELETE' });
    setDepartments(prev => prev.filter(d => d.id !== id));
  };

  useEffect(() => { fetchDepartments(); }, []);

  return { departments, loading, addDepartment, updateDepartment, deleteDepartment };
};

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/users`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (user) => {
    const res = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    const data = await res.json();
    setUsers(prev => [...prev, data]);
    return data;
  };

  const deleteUser = async (id) => {
    await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  useEffect(() => { fetchUsers(); }, []);

  return { users, loading, addUser, deleteUser };
};

export const useStats = () => {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    maintenance: 0,
    broken: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_URL}/equipment`);
        const data = await res.json();
        setStats({
          total: data.length,
          active: data.filter(e => e.status?.includes('tốt')).length,
          maintenance: data.filter(e => e.status?.includes('bảo trì')).length,
          broken: data.filter(e => e.status?.includes('Hỏng')).length
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return stats;
};

export const useMaintenance = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/maintenance`);
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addLog = async (log) => {
    const res = await fetch(`${API_URL}/maintenance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(log),
    });
    const data = await res.json();
    setLogs(prev => [data, ...prev]);
    return data;
  };

  const updateLog = async (id, updates) => {
    const res = await fetch(`${API_URL}/maintenance/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    setLogs(prev => prev.map(l => l.id === id ? { ...l, ...data } : l));
    return data;
  };

  useEffect(() => { fetchLogs(); }, []);

  return { logs, loading, addLog, updateLog, refresh: fetchLogs };
};
