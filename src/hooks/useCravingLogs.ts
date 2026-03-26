import { useState, useCallback, useEffect } from 'react';
import type { CravingLog } from '@/types/craving';

export function useCravingLogs() {
  const [logs, setLogs] = useState<CravingLog[]>([]);
  const userId = sessionStorage.getItem('user_id');

  const fetchLogs = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await fetch('/api/craving', {
        headers: { 'x-user-id': userId }
      });
      const data = await response.json();
      setLogs(data);
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    }
  }, [userId]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const addLog = useCallback(async (log: Omit<CravingLog, 'id'>) => {
    if (!userId) return;
    const entry = { ...log, id: crypto.randomUUID() };
    
    try {
      await fetch('/api/craving', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': userId
        },
        body: JSON.stringify(entry)
      });
      setLogs((prev) => [entry, ...prev]);
    } catch (err) {
      console.error('Failed to add log:', err);
    }
  }, [userId]);

  const deleteLog = useCallback(async (id: string) => {
    if (!userId) return;
    try {
      await fetch(`/api/craving/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': userId }
      });
      setLogs((prev) => prev.filter(l => l.id !== id));
    } catch (err) {
      console.error('Failed to delete log:', err);
    }
  }, [userId]);

  return { logs, addLog, deleteLog };
}
