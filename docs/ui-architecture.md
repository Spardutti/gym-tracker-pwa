# Simple Gym Tracker PWA Frontend Architecture Document

## Change Log
| Date | Version | Description | Author |
|------|---------|-------------|---------|
| 2025-08-02 | 1.0 | Initial architecture document | Winston |

## Template and Framework Selection

**Selected Stack**: Vite + React + TypeScript + shadcn/ui (Project already initialized)

**Rationale**:
- **Vite**: Lightning-fast builds, built-in PWA support via vite-plugin-pwa
- **React 19**: Latest React with improved performance and features
- **TypeScript**: Type safety for IndexedDB operations and component props
- **shadcn/ui**: Accessible components using Radix UI primitives
- **Tailwind CSS v4**: Utility-first CSS with excellent DX

## Frontend Tech Stack

### Technology Stack Table
| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|-----------|
| Framework | React | 19.1.0 | UI component framework | Modern, efficient with excellent ecosystem |
| UI Library | shadcn/ui + Radix UI | Latest | Component library | Accessible, customizable, no vendor lock-in |
| State Management | Zustand | TBD | Global state management | Lightweight, TypeScript-first, perfect for small apps |
| Routing | None | - | Single page app | No routing needed for single page |
| Build Tool | Vite | 7.0.4 | Build and dev server | Fast HMR, built-in PWA support |
| Styling | Tailwind CSS | 4.1.11 | Utility-first CSS | Rapid development, consistent styling |
| Component Library | shadcn/ui | Latest | Pre-built components | Copy-paste model, fully customizable |
| Form Handling | React Hook Form | TBD | Form state management | Lightweight, performant, great DX |
| Dev Tools | React DevTools | Latest | Debugging | Essential for React development |
| PWA | vite-plugin-pwa | TBD | PWA functionality | Service worker, manifest generation |
| Database | idb | TBD | IndexedDB wrapper | Promise-based, simple API |

## Project Structure

```
gym-tracker-pwa/
├── public/
│   ├── manifest.json          # PWA manifest
│   └── icons/                 # PWA icons (various sizes)
├── src/
│   ├── components/
│   │   ├── ui/               # shadcn/ui components (already exists)
│   │   ├── DayBadge.tsx      # Day of week badge component
│   │   ├── ExerciseCard.tsx  # Individual exercise display
│   │   ├── ExerciseForm.tsx  # Add/edit exercise form
│   │   └── WeekView.tsx      # Main week view container
│   ├── hooks/
│   │   ├── useIndexedDB.ts   # Custom hook for DB operations
│   │   └── useExercises.ts   # Exercise-specific operations
│   ├── lib/
│   │   ├── db.ts             # IndexedDB setup and schema
│   │   ├── utils.ts          # Utility functions (already exists)
│   │   └── constants.ts      # App constants
│   ├── store/
│   │   └── exerciseStore.ts  # Zustand store for exercises
│   ├── types/
│   │   └── index.ts          # TypeScript type definitions
│   ├── App.tsx               # Main app component
│   ├── main.tsx              # App entry point (already exists)
│   └── index.css             # Global styles (already exists)
├── .env                      # Environment variables
├── index.html                # HTML template (already exists)
├── vite.config.ts            # Vite configuration (already exists)
├── tsconfig.json             # TypeScript config (already exists)
└── package.json              # Dependencies (already exists)
```

## Component Standards

### Component Template

```typescript
import { cn } from '@/lib/utils';

interface ComponentNameProps {
  className?: string;
  // Add specific props here
}

export function ComponentName({ 
  className,
  ...props 
}: ComponentNameProps) {
  // Component logic here
  
  return (
    <div className={cn('base-classes', className)}>
      {/* Component content */}
    </div>
  );
}
```

### Naming Conventions

- **Component files**: kebab-case (e.g., `exercise-card.tsx`)
- **Component exports**: PascalCase (e.g., `ExerciseCard`)
- **Hooks**: kebab-case with 'use' prefix (e.g., `use-exercises.ts`)
- **Utilities**: kebab-case (e.g., `format-date.ts`)
- **Types**: PascalCase for interfaces/types (e.g., `Exercise`, `DaySchedule`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `DAYS_OF_WEEK`)
- **Store**: kebab-case with '-store' suffix (e.g., `exercise-store.ts`)
- **Event handlers**: 'handle' prefix (e.g., `handleAddExercise`)
- **Boolean props**: 'is/has' prefix (e.g., `isActive`, `hasExercises`)

## State Management

### Store Structure

```
src/store/
├── exercise-store.ts    # Main exercise state management
└── types.ts            # Store-specific types
```

### State Management Template

```typescript
// src/store/exercise-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Exercise, DaySchedule } from '@/types';

interface ExerciseStore {
  // State
  exercises: Record<string, Exercise>;
  schedule: Record<string, string[]>; // day -> exerciseIds
  
  // Actions
  addExercise: (exercise: Exercise) => void;
  updateExercise: (id: string, updates: Partial<Exercise>) => void;
  removeExercise: (id: string) => void;
  
  assignExerciseToDay: (exerciseId: string, day: string) => void;
  removeExerciseFromDay: (exerciseId: string, day: string) => void;
  
  // Selectors
  getExercisesByDay: (day: string) => Exercise[];
}

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
      
      addExercise: (exercise) =>
        set((state) => ({
          exercises: { ...state.exercises, [exercise.id]: exercise },
        })),
        
      updateExercise: (id, updates) =>
        set((state) => ({
          exercises: {
            ...state.exercises,
            [id]: { ...state.exercises[id], ...updates },
          },
        })),
        
      removeExercise: (id) =>
        set((state) => {
          const { [id]: _, ...exercises } = state.exercises;
          return { exercises };
        }),
        
      assignExerciseToDay: (exerciseId, day) =>
        set((state) => ({
          schedule: {
            ...state.schedule,
            [day]: [...state.schedule[day], exerciseId],
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
        return exerciseIds.map((id) => state.exercises[id]).filter(Boolean);
      },
    }),
    {
      name: 'gym-tracker-storage',
    }
  )
);
```

## API Integration

### Service Template

Since this is a PWA with no backend, our "API" layer is IndexedDB. Here's the service pattern:

```typescript
// src/lib/db.ts
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Exercise } from '@/types';

interface GymTrackerDB extends DBSchema {
  exercises: {
    key: string;
    value: Exercise;
    indexes: { 'by-name': string };
  };
  schedule: {
    key: string; // day of week
    value: string[]; // exercise IDs
  };
}

class DatabaseService {
  private db: IDBPDatabase<GymTrackerDB> | null = null;

  async init(): Promise<void> {
    this.db = await openDB<GymTrackerDB>('gym-tracker', 1, {
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

  // Exercise operations
  async getExercise(id: string): Promise<Exercise | undefined> {
    if (!this.db) await this.init();
    return this.db!.get('exercises', id);
  }

  async getAllExercises(): Promise<Exercise[]> {
    if (!this.db) await this.init();
    return this.db!.getAll('exercises');
  }

  async saveExercise(exercise: Exercise): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.put('exercises', exercise);
  }

  async deleteExercise(id: string): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.delete('exercises', id);
  }

  // Schedule operations
  async getSchedule(day: string): Promise<string[]> {
    if (!this.db) await this.init();
    return (await this.db!.get('schedule', day)) || [];
  }

  async saveSchedule(day: string, exerciseIds: string[]): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.put('schedule', exerciseIds, day);
  }
}

export const db = new DatabaseService();
```

### API Client Configuration

```typescript
// src/hooks/use-indexed-db.ts
import { useEffect, useState } from 'react';
import { db } from '@/lib/db';

export function useIndexedDB() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    db.init()
      .then(() => setIsReady(true))
      .catch((err) => setError(err));
  }, []);

  return { isReady, error, db };
}
```

## Routing

### Route Configuration

This is a single-page application with no routing required. All functionality is contained within one view.

```typescript
// src/App.tsx
import { WeekView } from '@/components/week-view';
import { useIndexedDB } from '@/hooks/use-indexed-db';

export function App() {
  const { isReady, error } = useIndexedDB();

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Failed to initialize database</p>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">
        Gym Tracker
      </h1>
      <WeekView />
    </div>
  );
}
```

**No Routing Rationale**:
- Single view keeps the app ultra-simple
- All interactions happen within the week view
- Modal/sheet patterns for forms instead of page navigation
- Reduces bundle size and complexity

## Styling Guidelines

### Styling Approach
- **Tailwind CSS**: Utility-first with shadcn/ui components
- **Dark mode**: Use Tailwind's dark: modifier
- **Responsive**: Mobile-first design

### Global Theme Variables
```css
/* src/index.css */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --radius: 0.5rem;
  }
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
  }
}
```

## Type Definitions

```typescript
// src/types/index.ts
export interface Exercise {
  id: string;
  name: string;
  lastWeight: number;
  lastReps: number;
  notes?: string;
}

export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri';
```

## PWA Configuration

```typescript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Gym Tracker',
        short_name: 'GymTracker',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ]
});
```

## Quick Reference

- **Dev server**: `npm run dev`
- **Build**: `npm run build`
- **Install deps**: `npm install zustand idb react-hook-form vite-plugin-pwa`
- **Add shadcn component**: `npx shadcn-ui@latest add [component]`
