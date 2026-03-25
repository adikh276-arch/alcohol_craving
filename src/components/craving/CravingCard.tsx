import { format } from 'date-fns';
import type { CravingLog } from '@/types/craving';
import { INTENSITY_LABELS } from '@/types/craving';
import { cn } from '@/lib/utils';
import { Shield, Trash2 } from 'lucide-react';

interface CravingCardProps {
  log: CravingLog;
  onDelete: (id: string) => void;
}

const intensityColor: Record<string, string> = {
  low: 'bg-intensity-low',
  medium: 'bg-intensity-medium',
  high: 'bg-intensity-high',
  severe: 'bg-intensity-severe',
};

export function CravingCard({ log, onDelete }: CravingCardProps) {
  return (
    <div className="bg-card rounded-2xl p-4 shadow-sm border border-border/50 flex gap-3 group">
      <div className={cn("w-1.5 rounded-full flex-shrink-0", intensityColor[log.intensity])} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{INTENSITY_LABELS[log.intensity]}</span>
            {log.resisted && (
              <span className="flex items-center gap-0.5 text-primary text-xs font-medium">
                <Shield className="w-3 h-3" /> Resisted
              </span>
            )}
          </div>
          <button
            onClick={() => onDelete(log.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive p-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{format(new Date(log.timestamp), 'h:mm a')}</span>
          {log.trigger && (
            <span className="bg-muted px-2 py-0.5 rounded-full">{log.trigger}</span>
          )}
        </div>
        {log.notes && (
          <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{log.notes}</p>
        )}
      </div>
    </div>
  );
}
