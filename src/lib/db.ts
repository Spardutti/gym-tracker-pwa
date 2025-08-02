import { openDB, type DBSchema, type IDBPDatabase,  } from 'idb';
import type { Exercise, DayOfWeek } from '@/types';

interface GymTrackerDB extends DBSchema {
  exercises: {
    key: string;
    value: Exercise;
    indexes: { 'by-name': string };
  };
  schedule: {
    key: DayOfWeek;
    value: string[]; // exercise IDs
  };
}

const DB_NAME = 'gym-tracker';
const DB_VERSION = 1;

class DatabaseService {
  private db: IDBPDatabase<GymTrackerDB> | null = null;

  async init(): Promise<void> {
    this.db = await openDB<GymTrackerDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Create exercises store
        if (!db.objectStoreNames.contains('exercises')) {
          const exerciseStore = db.createObjectStore('exercises', {
            keyPath: 'id',
          });
          exerciseStore.createIndex('by-name', 'name');
        }

        // Create schedule store
        if (!db.objectStoreNames.contains('schedule')) {
          db.createObjectStore('schedule');
        }
      },
    });
  }

  private async ensureDB() {
    if (!this.db) await this.init();
  }

  // Exercise operations
  async getExercise(id: string): Promise<Exercise | undefined> {
    await this.ensureDB();
    return this.db!.get('exercises', id);
  }

  async getAllExercises(): Promise<Exercise[]> {
    await this.ensureDB();
    return this.db!.getAll('exercises');
  }

  async saveExercise(exercise: Exercise): Promise<void> {
    await this.ensureDB();
    await this.db!.put('exercises', exercise);
  }

  async deleteExercise(id: string): Promise<void> {
    await this.ensureDB();
    await this.db!.delete('exercises', id);
  }

  // Schedule operations
  async getSchedule(day: DayOfWeek): Promise<string[]> {
    await this.ensureDB();
    return (await this.db!.get('schedule', day)) || [];
  }

  async saveSchedule(day: DayOfWeek, exerciseIds: string[]): Promise<void> {
    await this.ensureDB();
    await this.db!.put('schedule', exerciseIds, day);
  }

  async getAllSchedules(): Promise<Record<DayOfWeek, string[]>> {
    await this.ensureDB();
    const days: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri'];
    const schedules: Record<DayOfWeek, string[]> = {} as Record<DayOfWeek, string[]>;
    
    for (const day of days) {
      schedules[day] = await this.getSchedule(day);
    }
    
    return schedules;
  }

  // Bulk operations for initial sync
  async saveAllData(exercises: Exercise[], schedules: Record<DayOfWeek, string[]>): Promise<void> {
    await this.ensureDB();
    const tx = this.db!.transaction(['exercises', 'schedule'], 'readwrite');
    
    // Clear and save exercises
    await tx.objectStore('exercises').clear();
    for (const exercise of exercises) {
      await tx.objectStore('exercises').put(exercise);
    }
    
    // Clear and save schedules
    await tx.objectStore('schedule').clear();
    for (const [day, ids] of Object.entries(schedules) as [DayOfWeek, string[]][]) {
      await tx.objectStore('schedule').put(ids, day);
    }
    
    await tx.done;
  }
}

export const db = new DatabaseService();