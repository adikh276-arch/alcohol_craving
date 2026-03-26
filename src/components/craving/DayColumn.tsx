import { format, isToday } from 'date-fns';
import type { CravingLog } from '@/types/craving';
import { cn } from '@/lib/utils';
import { INTENSITY_SCORES } from '@/types/craving';

interface DayColumnProps {
  date: Date;
  logs: CravingLog[];
  onSelect: (date: Date) => void;
}

const intensityColor: Record<string, string> = {
  low: 'bg-intensity-low',
  medium: 'bg-intensity-medium',
  high: 'bg-intensity-high',
  severe: 'bg-intensity-severe',
};

export function DayColumn({ date, logs, onSelect }: DayColumnProps) {
  const today = isToday(date);
  const count = logs.length;
  const maxIntensity = logs.length
    ? (logs.reduce((max, l) => (INTENSITY_SCORES[l.intensity] > INTENSITY_SCORES[max] ? l.intensity : max), logs[0].intensity) as any)
    : null;

  return (
    <button
      onClick={() => onSelect(date)}
      className={cn(
        "flex flex-col items-center gap-1.5 py-3 px-1 rounded-2xl transition-all flex-1 min-w-0",
        today ? "bg-primary/10 ring-2 ring-primary/30" : "hover:bg-muted/60"
      )}
    >
      <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
        {format(date, 'EEE')}
      </span>
      <span className={cn(
        "text-sm font-semibold",
        today ? "text-primary" : "text-foreground"
      )}>
        {format(date, 'd')}
      </span>
      {count > 0 ? (
        <div className="flex flex-col items-center gap-1">
          <div className={cn("w-3 h-3 rounded-full", intensityColor[maxIntensity!])} />
          <span className="text-[10px] text-muted-foreground">{count}</span>
        </div>
      ) : (
        <div className="w-3 h-3 rounded-full bg-muted/50 mt-0" />
      )}
    </button>
  );
}
