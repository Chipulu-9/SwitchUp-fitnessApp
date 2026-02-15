import { useState } from 'react';
import { useWorkouts } from '../context/WorkoutContext';
import { WorkoutForm } from '../components/workout/WorkoutForm';
import { WorkoutList } from '../components/workout/WorkoutList';
import { Button } from '@repo/ui/Button';
import type { Workout } from '@repo/shared';

export function WorkoutsPage() {
  const { workouts, loading, addWorkout, updateWorkout, deleteWorkout } = useWorkouts();
  
  const [showForm, setShowForm] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCreate = async (data: any) => {
    try {
      setSubmitting(true);
      setError(null);
      
      // Use Context Action
      await addWorkout(data);

      setSuccess('Workout logged successfully!');
      setShowForm(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error creating workout:', error);
      setError(`Failed to log workout: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdate = async (data: any) => {
    if (!editingWorkout?.id) return;
    try {
      setSubmitting(true);
      setError(null);

      // Use Context Action
      await updateWorkout(editingWorkout.id, data);

      setSuccess('Workout updated successfully!');
      setEditingWorkout(null);
      setShowForm(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error updating workout:', error);
      setError(`Failed to update workout: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (workout: Workout) => {
    if (!window.confirm(`Delete ${workout.activityName} workout?`)) return;
    try {
      setError(null);
      // Use Context Action
      await deleteWorkout(workout.id!);
      
      setSuccess('Workout deleted successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error deleting workout:', error);
      setError(`Failed to delete workout: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEdit = (workout: Workout) => {
    setEditingWorkout(workout);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingWorkout(null);
  };

  return (
    <div>
      {/* Success Message */}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <span className="text-green-600">✓</span>
          <p className="text-green-800 font-medium">{success}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <span className="text-red-600">✕</span>
          <p className="text-red-800">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto text-red-600 hover:text-red-800">
            ✕
          </button>
        </div>
      )}

      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Workouts</h1>
          <p className="text-gray-600">Track and manage your workout history</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>+ Log Workout</Button>
        )}
      </div>

      {showForm && (
        <div className="mb-8">
          <WorkoutForm
            key={editingWorkout?.id || 'new'}
            onSubmit={editingWorkout ? handleUpdate : handleCreate}
            onCancel={handleCancel}
            defaultValues={editingWorkout ?? undefined}
            isSubmitting={submitting}
          />
        </div>
      )}

      <WorkoutList
        workouts={workouts}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={loading}
      />
    </div>
  );
}