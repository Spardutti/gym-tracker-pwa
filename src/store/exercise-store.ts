import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Exercise, DayOfWeek } from '@/types';

interface ExerciseStore {
  // State
  exercises: Record<string, Exercise>;
  schedule: Record<DayOfWeek, string[]>;
  
  // Actions
  addExercise: (exercise: Omit<Exercise, 'id'>) => string; // returns id
  updateExercise: (id: string, updates: Partial<Omit<Exercise, 'id'>>) => void;
  deleteExercise: (id: string) => void; // Permanently delete
  
  assignExerciseToDay: (exerciseId: string, day: DayOfWeek) => void;
  removeExerciseFromDay: (exerciseId: string, day: DayOfWeek) => void;
  
  // Selectors
  getExercisesByDay: (day: DayOfWeek) => Exercise[];
  getAvailableExercisesForDay: (day: DayOfWeek) => Exercise[];
  getAllExercises: () => Exercise[];
}

// Helper to generate unique IDs
const generateId = () => Date.now().toString();

export const useExerciseStore = create<ExerciseStore>()(
  persist(
    (set, get) => ({
      exercises: {},
      schedule: {
        mon: [],
        tue: [],
        wed: [],
        thu: [],
        fri: [],
      },
      
      addExercise: (exerciseData) => {
        const id = generateId();
        const exercise: Exercise = { ...exerciseData, id };
        set((state) => ({
          exercises: { ...state.exercises, [id]: exercise },
        }));
        return id;
      },
        
      updateExercise: (id, updates) =>
        set((state) => ({
          exercises: {
            ...state.exercises,
            [id]: { ...state.exercises[id], ...updates },
          },
        })),
        
      deleteExercise: (id) =>
        set((state) => {
          // Remove from exercises
          const { [id]: _, ...exercises } = state.exercises;
          
          // Remove from all schedules
          const schedule = { ...state.schedule };
          Object.keys(schedule).forEach((day) => {
            schedule[day as DayOfWeek] = schedule[day as DayOfWeek].filter(
              (exerciseId) => exerciseId !== id
            );
          });
          
          return { exercises, schedule };
        }),
        
      assignExerciseToDay: (exerciseId, day) =>
        set((state) => ({
          schedule: {
            ...state.schedule,
            [day]: state.schedule[day].includes(exerciseId)
              ? state.schedule[day]
              : [...state.schedule[day], exerciseId],
          },
        })),
        
      removeExerciseFromDay: (exerciseId, day) =>
        set((state) => ({
          schedule: {
            ...state.schedule,
            [day]: state.schedule[day].filter((id) => id !== exerciseId),
          },
        })),
        
      getExercisesByDay: (day) => {
        const state = get();
        const exerciseIds = state.schedule[day] || [];
        return exerciseIds
          .map((id) => state.exercises[id])
          .filter(Boolean);
      },
      
      getAvailableExercisesForDay: (day) => {
        const state = get();
        const assignedIds = state.schedule[day] || [];
        return Object.values(state.exercises).filter(
          (exercise) => !assignedIds.includes(exercise.id)
        );
      },
      
      getAllExercises: () => {
        const state = get();
        return Object.values(state.exercises);
      },
    }),
    {
      name: 'gym-tracker-storage',
    }
  )
);