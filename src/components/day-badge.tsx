import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { DayOfWeek } from '@/types';
import { DAY_LABELS } from '@/types';

interface DayBadgeProps {
  day: DayOfWeek;
  isActive: boolean;
  exerciseCount: number;
  onClick: () => void;
}

export function DayBadge({ day, isActive, exerciseCount, onClick }: DayBadgeProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 p-2 rounded-lg transition-all",
        "hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary",
        isActive && "bg-primary text-primary-foreground hover:bg-primary/90"
      )}
    >
      <span className="text-xs font-medium uppercase">
        {DAY_LABELS[day]}
      </span>
      <Badge 
        variant={isActive ? "secondary" : "outline"} 
        className="h-5 min-w-[2rem] justify-center text-xs"
      >
        {exerciseCount}
      </Badge>
    </button>
  );
}