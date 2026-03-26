import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, endOfWeek, isSameWeek } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface WeekNavigationProps {
  currentWeekStart: Date;
  onPrev: () => void;
  onNext: () => void;
}

export function WeekNavigation({ currentWeekStart, onPrev, onNext }: WeekNavigationProps) {
  const { t } = useTranslation();
  const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
  const isCurrentWeek = isSameWeek(currentWeekStart, new Date(), { weekStartsOn: 1 });

  return (
    <div className="flex items-center justify-between">
      <Button variant="ghost" size="icon" onClick={onPrev} className="rounded-full">
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">
          {format(currentWeekStart, 'MMM d')} – {format(weekEnd, 'MMM d, yyyy')}
        </p>
        {isCurrentWeek && (
          <p className="text-xs text-primary font-medium">{t('this_week')}</p>
        )}
      </div>
      <Button variant="ghost" size="icon" onClick={onNext} className="rounded-full" disabled={isCurrentWeek}>
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
