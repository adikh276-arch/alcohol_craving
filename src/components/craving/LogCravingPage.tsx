import { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { CravingIntensity, CravingLog } from '@/types/craving';
import { TRIGGERS } from '@/types/craving';
import { cn } from '@/lib/utils';
import { ArrowLeft, Check, X } from 'lucide-react';

interface LogCravingPageProps {
  onSubmit: (log: Omit<CravingLog, 'id'>) => void;
  onCancel: () => void;
  selectedDate?: Date;
}

const intensityOptions: { value: CravingIntensity; emoji: string; label: string; desc: string; color: string }[] = [
  { value: 'low', emoji: '😌', label: 'Mild', desc: 'Easy to manage', color: 'border-intensity-low bg-intensity-low/10' },
  { value: 'medium', emoji: '😐', label: 'Moderate', desc: 'Noticeable but manageable', color: 'border-intensity-medium bg-intensity-medium/10' },
  { value: 'high', emoji: '😰', label: 'Strong', desc: 'Hard to resist', color: 'border-intensity-high bg-intensity-high/10' },
  { value: 'severe', emoji: '🔥', label: 'Intense', desc: 'Overwhelming urge', color: 'border-intensity-severe bg-intensity-severe/10' },
];

const triggerEmojis: Record<string, string> = {
  Stress: '😤', Social: '🍻', Boredom: '😴', Emotions: '💔',
  Habit: '🔄', Celebration: '🎉', Loneliness: '😔', Other: '❓',
};

export function LogCravingPage({ onSubmit, onCancel, selectedDate }: LogCravingPageProps) {
  const [intensity, setIntensity] = useState<CravingIntensity | null>(null);
  const [trigger, setTrigger] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [resisted, setResisted] = useState<boolean | null>(null);

  const canSubmit = intensity !== null && resisted !== null;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({
      timestamp: (selectedDate || new Date()).toISOString(),
      intensity,
      trigger: trigger || undefined,
      notes: notes.trim() || undefined,
      resisted: resisted!,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-md mx-auto flex items-center justify-between px-4 h-14">
          <button onClick={onCancel} className="flex items-center gap-1 text-muted-foreground text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <span className="text-sm font-semibold text-foreground">
            {selectedDate ? format(selectedDate, 'EEEE, MMM d') : 'Right now'}
          </span>
          <div className="w-12" />
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-8 pb-32">
        {/* Step 1 — Intensity */}
        <section className="space-y-3">
          <div>
            <h2 className="text-lg font-bold text-foreground">How strong is it?</h2>
            <p className="text-sm text-muted-foreground">Tap the one that matches best</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {intensityOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setIntensity(opt.value)}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left",
                  intensity === opt.value
                    ? `${opt.color} scale-[1.02] shadow-sm`
                    : "border-border/50 bg-card hover:border-border"
                )}
              >
                <span className="text-2xl">{opt.emoji}</span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{opt.label}</p>
                  <p className="text-[11px] text-muted-foreground">{opt.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Step 2 — Did you resist? */}
        <section className="space-y-3">
          <div>
            <h2 className="text-lg font-bold text-foreground">Did you give in?</h2>
            <p className="text-sm text-muted-foreground">Be honest — no judgement here</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setResisted(true)}
              className={cn(
                "flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all",
                resisted === true
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border/50 bg-card hover:border-border"
              )}
            >
              <span className="text-3xl">💪</span>
              <p className="text-sm font-semibold text-foreground">I resisted</p>
              <p className="text-[11px] text-muted-foreground">Stayed strong</p>
            </button>
            <button
              onClick={() => setResisted(false)}
              className={cn(
                "flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all",
                resisted === false
                  ? "border-accent bg-accent/10 shadow-sm"
                  : "border-border/50 bg-card hover:border-border"
              )}
            >
              <span className="text-3xl">🫣</span>
              <p className="text-sm font-semibold text-foreground">I gave in</p>
              <p className="text-[11px] text-muted-foreground">It's okay, keep going</p>
            </button>
          </div>
        </section>

        {/* Step 3 — Trigger */}
        <section className="space-y-3">
          <div>
            <h2 className="text-lg font-bold text-foreground">What set it off?</h2>
            <p className="text-sm text-muted-foreground">Optional — pick one if you know</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {TRIGGERS.map(t => (
              <button
                key={t}
                onClick={() => setTrigger(trigger === t ? '' : t)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 rounded-xl border transition-all text-left",
                  trigger === t
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-border/50 bg-card text-muted-foreground hover:border-border"
                )}
              >
                <span className="text-lg">{triggerEmojis[t]}</span>
                <span className="text-sm font-medium">{t}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Step 4 — Notes */}
        <section className="space-y-3">
          <div>
            <h2 className="text-lg font-bold text-foreground">Anything else?</h2>
            <p className="text-sm text-muted-foreground">Optional — jot down how you felt</p>
          </div>
          <Textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="I was feeling..."
            className="resize-none rounded-2xl bg-card border-border/50 focus-visible:ring-primary/30 min-h-[80px]"
            rows={3}
          />
        </section>
      </div>

      {/* Sticky submit */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border/50 p-4">
        <div className="max-w-md mx-auto">
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full rounded-2xl h-14 text-base font-semibold gap-2"
          >
            <Check className="w-5 h-5" />
            Save Entry
          </Button>
        </div>
      </div>
    </div>
  );
}
