import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DayBadge } from './day-badge';
import { ExerciseCard } from './exercise-card';
import { ExerciseForm } from './exercise-form';
import { ExercisePicker } from './exercise-picker';
import { useExerciseStore } from '@/store/exercise-store';
import type { DayOfWeek, Exercise } from '@/types';
import { DAYS_OF_WEEK } from '@/types';

export function WeekView() {
  const [activeDay, setActiveDay] = useState<DayOfWeek>('mon');
  const [formOpen, setFormOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | undefined>();

  // Store hooks
  const {
    schedule,
    addExercise,
    updateExercise,
    assignExerciseToDay,
    removeExerciseFromDay,
    getExercisesByDay,
    getAvailableExercisesForDay,
  } = useExerciseStore();

  const getExerciseCount = (day: DayOfWeek) => schedule[day]?.length || 0;

  const handleAddExercise = (exercise: Omit<Exercise, 'id'>) => {
    if (editingExercise) {
      // Update existing exercise
      updateExercise(editingExercise.id, exercise);
    } else {
      // Add new exercise and assign to current day
      const id = addExercise(exercise);
      assignExerciseToDay(id, activeDay);
    }
    setFormOpen(false);
    setEditingExercise(undefined);
  };

  const handleSelectExistingExercise = (exercise: Exercise) => {
    assignExerciseToDay(exercise.id, activeDay);
  };

  const handleEditExercise = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setFormOpen(true);
  };

  const handleRemoveExercise = (exerciseId: string) => {
    removeExerciseFromDay(exerciseId, activeDay);
  };

  return (
    <div className="space-y-4">
      {/* Day selector */}
      <div className="flex justify-between gap-2 overflow-x-auto pb-2">
        {DAYS_OF_WEEK.map((day) => (
          <DayBadge
            key={day}
            day={day}
            isActive={activeDay === day}
            exerciseCount={getExerciseCount(day)}
            onClick={() => setActiveDay(day)}
          />
        ))}
      </div>

      {/* Exercise list for active day */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold capitalize">
            {activeDay === 'mon' ? 'Monday' : 
             activeDay === 'tue' ? 'Tuesday' :
             activeDay === 'wed' ? 'Wednesday' :
             activeDay === 'thu' ? 'Thursday' : 'Friday'}
          </h2>
          <Button
            size="sm"
            onClick={() => setPickerOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>

        {/* Exercise cards */}
        <div className="space-y-2">
          {getExercisesByDay(activeDay).length > 0 ? (
            getExercisesByDay(activeDay).map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onEdit={() => handleEditExercise(exercise)}
                onRemove={() => handleRemoveExercise(exercise.id)}
              />
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No exercises for this day
            </p>
          )}
        </div>
      </div>

      {/* Exercise picker dialog */}
      <ExercisePicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        availableExercises={getAvailableExercisesForDay(activeDay)}
        onSelectExercise={handleSelectExistingExercise}
        onCreateNew={() => {
          setPickerOpen(false);
          setEditingExercise(undefined);
          setFormOpen(true);
        }}
      />

      {/* Exercise form dialog */}
      <ExerciseForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleAddExercise}
        initialData={editingExercise}
      />
    </div>
  );
}