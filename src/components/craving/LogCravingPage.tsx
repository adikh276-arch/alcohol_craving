import { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { CravingIntensity, CravingLog } from '@/types/craving';
import { TRIGGERS } from '@/types/craving';
import { cn } from '@/lib/utils';
import { ArrowLeft, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LogCravingPageProps {
  onSubmit: (log: Omit<CravingLog, 'id'>) => void;
  onCancel: () => void;
  selectedDate?: Date;
}

export function LogCravingPage({ onSubmit, onCancel, selectedDate }: LogCravingPageProps) {
  const { t } = useTranslation();
  const [intensity, setIntensity] = useState<CravingIntensity | null>(null);
  const [trigger, setTrigger] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [resisted, setResisted] = useState<boolean | null>(null);

  const intensityOptions: { value: CravingIntensity; emoji: string; label: string; desc: string; color: string }[] = [
    { value: 'low', emoji: '😌', label: t('mild'), desc: t('easy_to_manage'), color: 'border-intensity-low bg-intensity-low/10' },
    { value: 'medium', emoji: '😐', label: t('moderate'), desc: t('noticeable_but_manageable'), color: 'border-intensity-medium bg-intensity-medium/10' },
    { value: 'high', emoji: '😰', label: t('strong'), desc: t('hard_to_resist'), color: 'border-intensity-high bg-intensity-high/10' },
    { value: 'severe', emoji: '🔥', label: t('intense'), desc: t('overwhelming_urge'), color: 'border-intensity-severe bg-intensity-severe/10' },
  ];

  const triggerEmojis: Record<string, string> = {
    Stress: '😤', Social: '🍻', Boredom: '😴', Emotions: '💔',
    Habit: '🔄', Celebration: '🎉', Loneliness: '😔', Other: '❓',
  };

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
            {t('back')}
          </button>
          <span className="text-sm font-semibold text-foreground">
            {selectedDate ? format(selectedDate, 'EEEE, MMM d') : t('right_now')}
          </span>
          <div className="w-12" />
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-8 pb-32">
        {/* Step 1 — Intensity */}
        <section className="space-y-3">
          <div>
            <h2 className="text-lg font-bold text-foreground">{t('how_strong_is_it')}</h2>
            <p className="text-sm text-muted-foreground">{t('tap_one_that_matches')}</p>
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
            <h2 className="text-lg font-bold text-foreground">{t('did_you_give_in')}</h2>
            <p className="text-sm text-muted-foreground">{t('be_honest')}</p>
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
              <p className="text-sm font-semibold text-foreground">{t('i_resisted')}</p>
              <p className="text-[11px] text-muted-foreground">{t('stayed_strong')}</p>
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
              <p className="text-sm font-semibold text-foreground">{t('i_gave_in')}</p>
              <p className="text-[11px] text-muted-foreground">{t('keep_going')}</p>
            </button>
          </div>
        </section>

        {/* Step 3 — Trigger */}
        <section className="space-y-3">
          <div>
            <h2 className="text-lg font-bold text-foreground">{t('what_set_it_off')}</h2>
            <p className="text-sm text-muted-foreground">{t('optional_pick_one')}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {TRIGGERS.map(tr => (
              <button
                key={tr}
                onClick={() => setTrigger(trigger === tr ? '' : tr)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 rounded-xl border transition-all text-left",
                  trigger === tr
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-border/50 bg-card text-muted-foreground hover:border-border"
                )}
              >
                <span className="text-lg">{triggerEmojis[tr]}</span>
                <span className="text-sm font-medium">{t(tr.toLowerCase() as any, { defaultValue: tr })}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Step 4 — Notes */}
        <section className="space-y-3">
          <div>
            <h2 className="text-lg font-bold text-foreground">{t('anything_else')}</h2>
            <p className="text-sm text-muted-foreground">{t('optional_jot_down')}</p>
          </div>
          <Textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder={t('feeling_placeholder')}
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
            {t('save_entry')}
          </Button>
        </div>
      </div>
    </div>
  );
}
