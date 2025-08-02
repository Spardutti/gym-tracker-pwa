import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Exercise } from '@/types';

interface ExerciseCardProps {
  exercise: Exercise;
  onRemove: () => void;
  onEdit: () => void;
}

export function ExerciseCard({ exercise, onRemove, onEdit }: ExerciseCardProps) {
  return (
    <div className="flex items-center gap-2 p-3 bg-card rounded-lg border">
      <button
        onClick={onEdit}
        className="flex-1 text-left space-y-1"
      >
        <p className="font-medium text-sm">{exercise.name}</p>
        <p className="text-xs text-muted-foreground">
          {exercise.lastWeight}kg × {exercise.lastReps} reps
        </p>
      </button>
      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}