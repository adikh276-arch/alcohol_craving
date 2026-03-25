import { useState } from 'react';
import { format } from 'date-fns';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { CravingIntensity, CravingLog } from '@/types/craving';
import { TRIGGERS, INTENSITY_LABELS } from '@/types/craving';
import { cn } from '@/lib/utils';
import { Check, Shield } from 'lucide-react';

interface LogCravingSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (log: Omit<CravingLog, 'id'>) => void;
  selectedDate?: Date;
}

const intensityOptions: { value: CravingIntensity; color: string }[] = [
  { value: 'low', color: 'bg-intensity-low' },
  { value: 'medium', color: 'bg-intensity-medium' },
  { value: 'high', color: 'bg-intensity-high' },
  { value: 'severe', color: 'bg-intensity-severe' },
];

export function LogCravingSheet({ open, onOpenChange, onSubmit, selectedDate }: LogCravingSheetProps) {
  const [intensity, setIntensity] = useState<CravingIntensity>('medium');
  const [trigger, setTrigger] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [resisted, setResisted] = useState(true);

  const handleSubmit = () => {
    onSubmit({
      timestamp: (selectedDate || new Date()).toISOString(),
      intensity,
      trigger: trigger || undefined,
      notes: notes.trim() || undefined,
      resisted,
    });
    setIntensity('medium');
    setTrigger('');
    setNotes('');
    setResisted(true);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl px-5 pb-8 max-h-[85vh] overflow-y-auto">
        <SheetHeader className="pb-2">
          <SheetTitle className="text-lg">
            Log Craving {selectedDate && `· ${format(selectedDate, 'MMM d')}`}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-5">
          {/* Intensity */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Intensity</p>
            <div className="grid grid-cols-4 gap-2">
              {intensityOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setIntensity(opt.value)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all",
                    intensity === opt.value
                      ? "border-foreground/20 bg-card shadow-sm scale-105"
                      : "border-transparent bg-muted/40"
                  )}
                >
                  <div className={cn("w-5 h-5 rounded-full", opt.color)} />
                  <span className="text-xs font-medium">{INTENSITY_LABELS[opt.value]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Trigger */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">What triggered it?</p>
            <div className="flex flex-wrap gap-2">
              {TRIGGERS.map(t => (
                <button
                  key={t}
                  onClick={() => setTrigger(trigger === t ? '' : t)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                    trigger === t
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Resisted */}
          <button
            onClick={() => setResisted(!resisted)}
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all",
              resisted
                ? "border-primary/30 bg-primary/5"
                : "border-transparent bg-muted/40"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
              resisted ? "bg-primary text-primary-foreground" : "bg-muted"
            )}>
              <Shield className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium">I resisted</p>
              <p className="text-xs text-muted-foreground">Stayed strong 💪</p>
            </div>
            {resisted && <Check className="w-4 h-4 ml-auto text-primary" />}
          </button>

          {/* Notes */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Notes (optional)</p>
            <Textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="How were you feeling?"
              className="resize-none rounded-xl bg-muted/40 border-0 focus-visible:ring-primary/30"
              rows={2}
            />
          </div>

          <Button onClick={handleSubmit} className="w-full rounded-xl h-12 text-base font-semibold">
            Log Craving
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
