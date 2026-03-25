import { useState, useMemo } from 'react';
import { startOfWeek, addWeeks, addDays, isSameDay, isSameWeek } from 'date-fns';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCravingLogs } from '@/hooks/useCravingLogs';
import { WeekNavigation } from './WeekNavigation';
import { DayColumn } from './DayColumn';
import { WeekStats } from './WeekStats';
import { CravingCard } from './CravingCard';
import { LogCravingSheet } from './LogCravingSheet';

export function CravingTracker() {
  const { logs, addLog, deleteLog } = useCravingLogs();
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const weekDays = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  const weekLogs = useMemo(() =>
    logs.filter(l => isSameWeek(new Date(l.timestamp), weekStart, { weekStartsOn: 1 })),
    [logs, weekStart]
  );

  const selectedDayLogs = useMemo(() => {
    if (!selectedDate) return weekLogs;
    return weekLogs.filter(l => isSameDay(new Date(l.timestamp), selectedDate));
  }, [weekLogs, selectedDate]);

  const handleDaySelect = (date: Date) => {
    setSelectedDate(prev => prev && isSameDay(prev, date) ? null : date);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-5">
      {/* Week Navigation */}
      <WeekNavigation
        currentWeekStart={weekStart}
        onPrev={() => { setWeekStart(w => addWeeks(w, -1)); setSelectedDate(null); }}
        onNext={() => { setWeekStart(w => addWeeks(w, 1)); setSelectedDate(null); }}
      />

      {/* Week Grid */}
      <div className="flex gap-0.5">
        {weekDays.map(day => (
          <DayColumn
            key={day.toISOString()}
            date={day}
            logs={weekLogs.filter(l => isSameDay(new Date(l.timestamp), day))}
            onSelect={handleDaySelect}
          />
        ))}
      </div>

      {/* Stats */}
      <WeekStats logs={weekLogs} />

      {/* Log list */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-muted-foreground">
            {selectedDate ? 'Day Logs' : 'Week Logs'}
          </h3>
          {selectedDate && (
            <button onClick={() => setSelectedDate(null)} className="text-xs text-primary font-medium">
              Show all
            </button>
          )}
        </div>
        {selectedDayLogs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-sm">No cravings logged</p>
            <p className="text-muted-foreground/60 text-xs mt-1">That's great progress! 🎉</p>
          </div>
        ) : (
          <div className="space-y-2">
            {selectedDayLogs.map(log => (
              <CravingCard key={log.id} log={log} onDelete={deleteLog} />
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <Button
        onClick={() => setSheetOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg shadow-primary/25"
        size="icon"
      >
        <Plus className="w-6 h-6" />
      </Button>

      <LogCravingSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onSubmit={addLog}
        selectedDate={selectedDate || undefined}
      />
    </div>
  );
}
