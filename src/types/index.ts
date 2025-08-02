export interface Exercise {
  id: string;
  name: string;
  lastWeight: number;
  lastReps: number;
}

export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri';

export const DAYS_OF_WEEK: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri'];

export const DAY_LABELS: Record<DayOfWeek, string> = {
  mon: 'Mon',
  tue: 'Tue',
  wed: 'Wed',
  thu: 'Thu',
  fri: 'Fri'
};