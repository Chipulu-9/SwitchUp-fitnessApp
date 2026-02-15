import { useState } from 'react';
import type { Workout } from '@repo/shared';
import { WorkoutCard } from './WorkoutCard';
import { Button } from '@repo/ui/Button';

interface WorkoutListProps {
  workouts: Workout[];
  onEdit?: (workout: Workout) => void;
  onDelete?: (workout: Workout) => void;
  isLoading?: boolean;
}

/**
 * Workout List Component
 * Displays a list of workouts with filtering and sorting options
 */
export function WorkoutList({ workouts, onEdit, onDelete, isLoading = false }: WorkoutListProps) {
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'duration' | 'calories'>('date');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (workouts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-block p-6 bg-gray-50 rounded-full mb-4">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No workouts yet</h3>
        <p className="text-gray-600">Start logging your workouts to track your progress!</p>
      </div>
    );
  }

  // Filter workouts
  const filteredWorkouts = filter === 'all'
    ? workouts
    : workouts.filter(w => w.activityId === filter);

  // Sort workouts
  const sortedWorkouts = [...filteredWorkouts].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'duration':
        return b.duration - a.duration;
      case 'calories':
        return b.caloriesBurned - a.caloriesBurned;
      default:
        return 0;
    }
  });

  // Get unique activity types for filtering
  const activityTypes = Array.from(new Set(workouts.map(w => w.activityId)));

  return (
    <div className="space-y-6">
      {/* Filters and Sorting */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <div className="flex gap-2 items-center">
          <label className="text-sm font-medium text-gray-700">Filter:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Activities</option>
            {activityTypes.map(type => (
              <option key={type} value={type}>
                {workouts.find(w => w.activityId === type)?.activityName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 items-center">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">Date (Newest)</option>
            <option value="duration">Duration</option>
            <option value="calories">Calories</option>
          </select>
        </div>

        <div className="text-sm text-gray-600">
          Showing {sortedWorkouts.length} of {workouts.length} workouts
        </div>
      </div>

      {/* Workout Cards */}
      <div className="space-y-4">
        {sortedWorkouts.map((workout) => (
          <WorkoutCard
            key={workout.id}
            workout={workout}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
