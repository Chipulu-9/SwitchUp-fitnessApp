import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { PREDEFINED_ACTIVITIES, getActivitiesByCategory } from '@repo/shared';
import { Button } from '@repo/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui/Card';

// Local form schema — accepts datetime-local format for the date input
const workoutFormSchema = z.object({
  activityId: z.string().min(1, 'Please select an activity'),
  activityName: z.string().min(1),
  duration: z.number({ invalid_type_error: 'Enter a number' }).min(1, 'At least 1 minute').max(1440),
  caloriesBurned: z.number({ invalid_type_error: 'Enter a number' }).min(0),
  date: z.string().min(1, 'Date is required'),
  notes: z.string().max(500).optional(),
});

type WorkoutFormData = z.infer<typeof workoutFormSchema>;

interface WorkoutFormProps {
  onSubmit: (data: WorkoutFormData) => Promise<void>;
  onCancel?: () => void;
  defaultValues?: Partial<WorkoutFormData>;
  isSubmitting?: boolean;
}

export function WorkoutForm({ onSubmit, onCancel, defaultValues, isSubmitting = false }: WorkoutFormProps) {
  // Convert ISO date to datetime-local format (YYYY-MM-DDTHH:mm)
  const formatDateForInput = (isoDate?: string) => {
    if (!isoDate) return new Date().toISOString().slice(0, 16);
    try {
      const date = new Date(isoDate);
      return date.toISOString().slice(0, 16);
    } catch {
      return new Date().toISOString().slice(0, 16);
    }
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<WorkoutFormData>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues: {
      activityId: defaultValues?.activityId || '',
      activityName: defaultValues?.activityName || '',
      duration: defaultValues?.duration || undefined,
      caloriesBurned: defaultValues?.caloriesBurned || undefined,
      date: formatDateForInput(defaultValues?.date),
      notes: defaultValues?.notes || '',
    },
  });

  const selectedActivityId = watch('activityId');

  // Reset form when defaultValues change (e.g., when switching between create/edit)
  useEffect(() => {
    console.log('Form defaultValues changed:', defaultValues);
    reset({
      activityId: defaultValues?.activityId || '',
      activityName: defaultValues?.activityName || '',
      duration: defaultValues?.duration || undefined,
      caloriesBurned: defaultValues?.caloriesBurned || undefined,
      date: formatDateForInput(defaultValues?.date),
      notes: defaultValues?.notes || '',
    });
  }, [defaultValues, reset]);

  const handleActivityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const activityId = e.target.value;
    const activity = PREDEFINED_ACTIVITIES.find(a => a.id === activityId);
    if (activity) {
      setValue('activityId', activity.id);
      setValue('activityName', activity.name);
      const duration = watch('duration');
      if (duration) {
        setValue('caloriesBurned', Math.round(duration * activity.avgCaloriesPerMin));
      }
    }
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const duration = parseInt(e.target.value);
    const activity = PREDEFINED_ACTIVITIES.find(a => a.id === selectedActivityId);
    if (activity && duration) {
      setValue('caloriesBurned', Math.round(duration * activity.avgCaloriesPerMin));
    }
  };

  const categories = {
    Cardio: getActivitiesByCategory('cardio'),
    Strength: getActivitiesByCategory('strength'),
    Flexibility: getActivitiesByCategory('flexibility'),
  };

  const doSubmit = async (data: WorkoutFormData) => {
    // Convert datetime-local value to ISO string before handing off
    const isoDate = new Date(data.date).toISOString();
    await onSubmit({ ...data, date: isoDate });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{defaultValues ? 'Edit Workout' : 'Log New Workout'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(doSubmit)} className="space-y-6">
          {/* Activity Selection */}
          <div className="space-y-2">
            <label htmlFor="activity" className="block text-sm font-medium text-gray-700">
              Activity Type *
            </label>
            <select
              {...register('activityId')}
              id="activity"
              onChange={handleActivityChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select an activity</option>
              {Object.entries(categories).map(([label, activities]) => (
                <optgroup key={label} label={label}>
                  {activities.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.name} (~{a.avgCaloriesPerMin} cal/min)
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            {errors.activityId && <p className="text-sm text-red-600">{errors.activityId.message}</p>}
          </div>

          <input type="hidden" {...register('activityName')} />

          {/* Duration */}
          <div className="space-y-2">
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
              Duration (minutes) *
            </label>
            <input
              {...register('duration', { valueAsNumber: true })}
              type="number"
              id="duration"
              min="1"
              max="1440"
              onChange={handleDurationChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="30"
            />
            {errors.duration && <p className="text-sm text-red-600">{errors.duration.message}</p>}
          </div>

          {/* Calories */}
          <div className="space-y-2">
            <label htmlFor="calories" className="block text-sm font-medium text-gray-700">
              Calories Burned *
            </label>
            <input
              {...register('caloriesBurned', { valueAsNumber: true })}
              type="number"
              id="calories"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Auto-calculated"
            />
            {errors.caloriesBurned && <p className="text-sm text-red-600">{errors.caloriesBurned.message}</p>}
            <p className="text-xs text-gray-500">Auto-calculated from activity and duration</p>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date & Time *
            </label>
            <input
              {...register('date')}
              type="datetime-local"
              id="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.date && <p className="text-sm text-red-600">{errors.date.message}</p>}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes (optional)
            </label>
            <textarea
              {...register('notes')}
              id="notes"
              rows={3}
              maxLength={500}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="How did it go?"
            />
            {errors.notes && <p className="text-sm text-red-600">{errors.notes.message}</p>}
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            {onCancel && (
              <Button type="button" onClick={onCancel} variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : defaultValues ? 'Update Workout' : 'Log Workout'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
