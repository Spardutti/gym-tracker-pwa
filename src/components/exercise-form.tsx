import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Exercise } from '@/types';

interface ExerciseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (exercise: Omit<Exercise, 'id'>) => void;
  initialData?: Exercise;
}

export function ExerciseForm({ open, onOpenChange, onSubmit, initialData }: ExerciseFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [weight, setWeight] = useState(initialData?.lastWeight?.toString() || '');
  const [reps, setReps] = useState(initialData?.lastReps?.toString() || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && weight && reps) {
      onSubmit({
        name,
        lastWeight: parseFloat(weight),
        lastReps: parseInt(reps, 10)
      });
      onOpenChange(false);
      // Reset form
      setName('');
      setWeight('');
      setReps('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Exercise' : 'Add Exercise'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Exercise Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Bench Press"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="60"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reps">Reps</Label>
              <Input
                id="reps"
                type="number"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                placeholder="10"
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            {initialData ? 'Update' : 'Add'} Exercise
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}