import { useState, useCallback } from 'react';
import type { CravingLog } from '@/types/craving';

const STORAGE_KEY = 'craving-logs';

function loadLogs(): CravingLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLogs(logs: CravingLog[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

export function useCravingLogs() {
  const [logs, setLogs] = useState<CravingLog[]>(loadLogs);

  const addLog = useCallback((log: Omit<CravingLog, 'id'>) => {
    setLogs(prev => {
      const next = [{ ...log, id: crypto.randomUUID() }, ...prev];
      saveLogs(next);
      return next;
    });
  }, []);

  const deleteLog = useCallback((id: string) => {
    setLogs(prev => {
      const next = prev.filter(l => l.id !== id);
      saveLogs(next);
      return next;
    });
  }, []);

  return { logs, addLog, deleteLog };
}
