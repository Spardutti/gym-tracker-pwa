import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DayBadge } from './day-badge';
import { ExerciseCard } from './exercise-card';
import { ExerciseForm } from './exercise-form';
import { ExercisePicker } from './exercise-picker';
import type { DayOfWeek, Exercise } from '@/types';
import { DAYS_OF_WEEK } from '@/types';

// Mock data for now - will be replaced with store
const mockExercises: Record<string, Exercise> = {
  '1': { id: '1', name: 'Bench Press', lastWeight: 60, lastReps: 10 },
  '2': { id: '2', name: 'Squats', lastWeight: 80, lastReps: 12 },
  '3': { id: '3', name: 'Deadlifts', lastWeight: 100, lastReps: 8 },
  '4': { id: '4', name: 'Bicep Curls', lastWeight: 12, lastReps: 15 }, // Not assigned to any day
  '5': { id: '5', name: 'Tricep Extensions', lastWeight: 10, lastReps: 12 }, // Not assigned to any day
};

const mockSchedule: Record<DayOfWeek, string[]> = {
  mon: ['1', '2'],
  tue: [],
  wed: ['3'],
  thu: ['1'],
  fri: ['2', '3'],
};

export function WeekView() {
  const [activeDay, setActiveDay] = useState<DayOfWeek>('mon');
  const [formOpen, setFormOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | undefined>();

  const getExerciseCount = (day: DayOfWeek) => mockSchedule[day]?.length || 0;
  const getDayExercises = (day: DayOfWeek) => 
    mockSchedule[day]?.map(id => mockExercises[id]).filter(Boolean) || [];

  // Get all exercises not assigned to current day
  const getAvailableExercises = () => {
    const currentDayExerciseIds = mockSchedule[activeDay] || [];
    return Object.values(mockExercises).filter(
      exercise => !currentDayExerciseIds.includes(exercise.id)
    );
  };

  const handleAddExercise = (exercise: Omit<Exercise, 'id'>) => {
    // TODO: Add to store
    console.log('Adding new exercise:', exercise);
    setFormOpen(false);
  };

  const handleSelectExistingExercise = (exercise: Exercise) => {
    // TODO: Assign exercise to current day
    console.log('Adding existing exercise to day:', exercise);
  };

  const handleEditExercise = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setFormOpen(true);
  };

  const handleRemoveExercise = (exerciseId: string) => {
    // TODO: Remove from day in store (not delete the exercise)
    console.log('Removing exercise from day:', exerciseId);
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
          {getDayExercises(activeDay).length > 0 ? (
            getDayExercises(activeDay).map((exercise) => (
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
        availableExercises={getAvailableExercises()}
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