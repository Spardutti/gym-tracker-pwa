import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DayBadge } from './day-badge';
import { ExerciseCard } from './exercise-card';
import { ExerciseForm } from './exercise-form';
import type { DayOfWeek, Exercise } from '@/types';
import { DAYS_OF_WEEK } from '@/types';

// Mock data for now - will be replaced with store
const mockExercises: Record<string, Exercise> = {
  '1': { id: '1', name: 'Bench Press', lastWeight: 60, lastReps: 10 },
  '2': { id: '2', name: 'Squats', lastWeight: 80, lastReps: 12 },
  '3': { id: '3', name: 'Deadlifts', lastWeight: 100, lastReps: 8 },
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
  const [editingExercise, setEditingExercise] = useState<Exercise | undefined>();

  const getExerciseCount = (day: DayOfWeek) => mockSchedule[day]?.length || 0;
  const getDayExercises = (day: DayOfWeek) => 
    mockSchedule[day]?.map(id => mockExercises[id]).filter(Boolean) || [];

  const handleAddExercise = (exercise: Omit<Exercise, 'id'>) => {
    // TODO: Add to store
    console.log('Adding exercise:', exercise);
  };

  const handleEditExercise = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setFormOpen(true);
  };

  const handleRemoveExercise = (exerciseId: string) => {
    // TODO: Remove from day in store
    console.log('Removing exercise:', exerciseId);
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
            onClick={() => {
              setEditingExercise(undefined);
              setFormOpen(true);
            }}
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