import { WeekView } from '@/components/week-view';

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center px-4">
          <h1 className="text-lg font-bold">Gym Tracker</h1>
        </div>
      </header>
      <main className="container px-4 py-4 max-w-2xl mx-auto">
        <WeekView />
      </main>
    </div>
  );
}