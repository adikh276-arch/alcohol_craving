import type { CravingLog } from '@/types/craving';
import { INTENSITY_SCORES } from '@/types/craving';
import { Flame, Shield, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface WeekStatsProps {
  logs: CravingLog[];
}

export function WeekStats({ logs }: WeekStatsProps) {
  const { t } = useTranslation();
  const total = logs.length;
  const resisted = logs.filter(l => l.resisted).length;
  const avgIntensity = total
    ? (logs.reduce((sum, l) => sum + INTENSITY_SCORES[l.intensity], 0) / total).toFixed(1)
    : '0';

  const stats = [
    { icon: Flame, label: t('cravings', { defaultValue: 'Cravings' }), value: total, color: 'text-intensity-high' },
    { icon: Shield, label: t('resisted_stat', { defaultValue: 'Resisted' }), value: resisted, color: 'text-primary' },
    { icon: TrendingUp, label: t('avg_level', { defaultValue: 'Avg Level' }), value: avgIntensity, color: 'text-intensity-medium' },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map(s => (
        <div key={s.label} className="bg-card rounded-2xl p-3 text-center shadow-sm border border-border/50">
          <s.icon className={`w-4 h-4 mx-auto mb-1 ${s.color}`} />
          <p className="text-lg font-bold text-foreground">{s.value}</p>
          <p className="text-[10px] text-muted-foreground font-medium">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
