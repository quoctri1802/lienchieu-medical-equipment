import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const useEquipment = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/equipment`);
      if (!response.ok) throw new Error('Failed to fetch equipment');
      const data = await response.json();
      setEquipment(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      // Fallback to local storage or mock data if server is not available
      const localData = localStorage.getItem('equipment');
      if (localData) setEquipment(JSON.parse(localData));
    } finally {
      setLoading(false);
    }
  };

  const addEquipment = async (newEq) => {
    try {
      const response = await fetch(`${API_URL}/equipment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEq),
      });
      if (!response.ok) throw new Error('Failed to add equipment');
      const added = await response.json();
      setEquipment(prev => [...prev, added]);
      return added;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateEquipment = async (id, updatedEq) => {
    try {
      const response = await fetch(`${API_URL}/equipment/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEq),
      });
      if (!response.ok) throw new Error('Failed to update equipment');
      const updated = await response.json();
      setEquipment(prev => prev.map(eq => eq.id === id ? updated : eq));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteEquipment = async (id) => {
    try {
      const response = await fetch(`${API_URL}/equipment/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete equipment');
      setEquipment(prev => prev.filter(eq => eq.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  // Save to local storage as backup
  useEffect(() => {
    if (equipment.length > 0) {
      localStorage.setItem('equipment', JSON.stringify(equipment));
    }
  }, [equipment]);

  return { equipment, loading, error, addEquipment, updateEquipment, deleteEquipment, refresh: fetchEquipment };
};
