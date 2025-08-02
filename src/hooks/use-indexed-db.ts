import { useEffect, useState } from 'react';
import { db } from '@/lib/db';
import { useExerciseStore } from '@/store/exercise-store';

export function useIndexedDB() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const store = useExerciseStore();

  useEffect(() => {
    let mounted = true;

    const initDB = async () => {
      try {
        // Initialize IndexedDB
        await db.init();
        
        if (!mounted) return;

        // Load data from IndexedDB
        const [exercises, schedules] = await Promise.all([
          db.getAllExercises(),
          db.getAllSchedules(),
        ]);

        // Update Zustand store with IndexedDB data
        if (exercises.length > 0 || Object.values(schedules).some(s => s.length > 0)) {
          useExerciseStore.setState({
            exercises: exercises.reduce((acc, exercise) => {
              acc[exercise.id] = exercise;
              return acc;
            }, {} as Record<string, typeof exercises[0]>),
            schedule: schedules,
          });
        }

        setIsReady(true);

        // Subscribe to store changes and sync to IndexedDB
        const unsubscribe = useExerciseStore.subscribe(
          (state) => {
            // Save to IndexedDB whenever store changes
            const exercises = Object.values(state.exercises);
            db.saveAllData(exercises, state.schedule).catch(console.error);
          }
        );

        // Cleanup subscription
        return () => {
          mounted = false;
          unsubscribe();
        };
      } catch (err) {
        console.error('Failed to initialize IndexedDB:', err);
        if (mounted) {
          setError(err as Error);
          setIsReady(true); // Still mark as ready to use localStorage fallback
        }
      }
    };

    initDB();
  }, []);

  return { isReady, error };
}