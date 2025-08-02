import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Exercise } from '@/types';

interface ExercisePickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableExercises: Exercise[];
  onSelectExercise: (exercise: Exercise) => void;
  onCreateNew: () => void;
}

export function ExercisePicker({ 
  open, 
  onOpenChange, 
  availableExercises, 
  onSelectExercise,
  onCreateNew 
}: ExercisePickerProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Add Exercise</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Create new exercise button */}
          <Button 
            onClick={onCreateNew}
            variant="outline" 
            className="w-full justify-start"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Exercise
          </Button>

          {/* Available exercises list */}
          {availableExercises.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Or choose from your exercises:
              </p>
              <div className="max-h-[300px] overflow-y-auto space-y-2">
                {availableExercises.map((exercise) => (
                  <button
                    key={exercise.id}
                    onClick={() => {
                      onSelectExercise(exercise);
                      onOpenChange(false);
                    }}
                    className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <p className="font-medium">{exercise.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Last: {exercise.lastWeight}kg × {exercise.lastReps} reps
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}