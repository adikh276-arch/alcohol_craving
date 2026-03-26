import { useState, useMemo } from 'react';
import { startOfWeek, addWeeks, addDays, isSameDay, isSameWeek } from 'date-fns';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCravingLogs } from '@/hooks/useCravingLogs';
import { WeekNavigation } from './WeekNavigation';
import { DayColumn } from './DayColumn';
import { WeekStats } from './WeekStats';
import { CravingCard } from './CravingCard';
import { LogCravingPage } from './LogCravingPage';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '../LanguageSelector';

export function CravingTracker() {
  const { t } = useTranslation();
  const { logs, addLog, deleteLog } = useCravingLogs();
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [showLogPage, setShowLogPage] = useState(false);
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

  if (showLogPage) {
    return (
      <LogCravingPage
        onSubmit={(log) => { addLog(log); setShowLogPage(false); }}
        onCancel={() => setShowLogPage(false)}
        selectedDate={selectedDate || undefined}
      />
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">{t('alcohol_craving_tracker')}</h1>
        <LanguageSelector />
      </div>
      <WeekNavigation
        currentWeekStart={weekStart}
        onPrev={() => { setWeekStart(w => addWeeks(w, -1)); setSelectedDate(null); }}
        onNext={() => { setWeekStart(w => addWeeks(w, 1)); setSelectedDate(null); }}
      />

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

      <WeekStats logs={weekLogs} />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-muted-foreground">
            {selectedDate ? t('day_logs') : t('week_logs')}
          </h3>
          {selectedDate && (
            <button onClick={() => setSelectedDate(null)} className="text-xs text-primary font-medium">
              {t('show_all')}
            </button>
          )}
        </div>
        {selectedDayLogs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-sm">{t('no_cravings_logged')}</p>
            <p className="text-muted-foreground/60 text-xs mt-1">{t('great_progress')}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {selectedDayLogs.map(log => (
              <CravingCard key={log.id} log={log} onDelete={deleteLog} />
            ))}
          </div>
        )}
      </div>

      <Button
        onClick={() => setShowLogPage(true)}
        className="w-full rounded-2xl h-14 text-base font-semibold shadow-md shadow-primary/20 gap-2"
      >
        <Plus className="w-5 h-5" />
        {t('log_a_craving')}
      </Button>
    </div>
  );
}
