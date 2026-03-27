import { useState, useCallback, useEffect } from 'react';
import type { CravingLog } from '@/types/craving';
import { pool } from '@/lib/db';

export function useCravingLogs() {
  const [logs, setLogs] = useState<CravingLog[]>([]);
  const userId = sessionStorage.getItem('user_id');

  const fetchLogs = useCallback(async () => {
    if (!userId) return;
    try {
      const result = await pool.query('SELECT * FROM craving_logs WHERE user_id = $1 ORDER BY timestamp DESC', [userId]);
      setLogs(result.rows);
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
      await pool.query(
        'INSERT INTO craving_logs (id, user_id, intensity, trigger, notes, resisted, timestamp) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [entry.id, userId, entry.intensity, entry.trigger, entry.notes, entry.resisted, entry.timestamp]
      );
      setLogs((prev) => [entry, ...prev]);
    } catch (err) {
      console.error('Failed to add log:', err);
    }
  }, [userId]);

  const deleteLog = useCallback(async (id: string) => {
    if (!userId) return;
    try {
      await pool.query('DELETE FROM craving_logs WHERE id = $1 AND user_id = $2', [id, userId]);
      setLogs((prev) => prev.filter(l => l.id !== id));
    } catch (err) {
      console.error('Failed to delete log:', err);
    }
  }, [userId]);

  return { logs, addLog, deleteLog };
}
