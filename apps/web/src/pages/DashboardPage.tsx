import { useMemo, useCallback } from 'react';
import { useWorkouts } from '../context/WorkoutContext';
import { useUserPreferences } from '../hooks/useUserPreferences';
import { Dashboard } from '../components/dashboard/Dashboard';

export function DashboardPage() {
  const { workouts, loading } = useWorkouts();
  const { preferences, loading: prefsLoading, updatePreferences } = useUserPreferences();

  const stats = useMemo(() => {
    const now = new Date();

    // --- A. Totals ---
    const totalWorkouts = workouts.length;

    const totalDuration = workouts.reduce((acc, curr) =>
      acc + (Number(curr.duration) || 0), 0);

    const totalCalories = workouts.reduce((acc, curr) =>
      acc + (Number(curr.caloriesBurned) || 0), 0);

    // --- B. Weekly Progress ---
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const weeklyWorkouts = workouts.filter(w => {
      const wDate = new Date(w.date);
      return wDate >= startOfWeek;
    });

    const weeklyStats = {
      count: weeklyWorkouts.length,
      duration: weeklyWorkouts.reduce((acc, curr) => acc + (Number(curr.duration) || 0), 0),
      calories: weeklyWorkouts.reduce((acc, curr) => acc + (Number(curr.caloriesBurned) || 0), 0),
    };

    // --- C. Current Streak ---
    const uniqueDates = Array.from(new Set(workouts.map(w => {
        return new Date(w.date).toISOString().split('T')[0];
    }))).sort((a, b) => b.localeCompare(a));

    let currentStreak = 0;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (uniqueDates.length > 0) {
        const lastWorkoutDate = uniqueDates[0];

        if (lastWorkoutDate === today || lastWorkoutDate === yesterday) {
            currentStreak = 1;
            for (let i = 0; i < uniqueDates.length - 1; i++) {
                const currentDate = new Date(uniqueDates[i]);
                const prevDate = new Date(uniqueDates[i+1]);

                const diffTime = Math.abs(currentDate.getTime() - prevDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays === 1) {
                    currentStreak++;
                } else {
                    break;
                }
            }
        }
    }

    return {
      totalWorkouts,
      totalDuration,
      totalCalories,
      currentStreak,
      weeklyStats
    };
  }, [workouts]);

  const handleUpdateGoals = useCallback(
    async (goals: { weeklyGoal: number; calorieGoal: number }) => {
      await updatePreferences(goals);
    },
    [updatePreferences]
  );

  if (loading || prefsLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Your fitness progress at a glance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

        {/* Card 1: Total Workouts */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium uppercase">Total Workouts</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalWorkouts}</p>
          <p className="text-sm text-green-600 mt-1">
            {stats.weeklyStats.count} this week
          </p>
        </div>

        {/* Card 2: Duration */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium uppercase">Total Duration</h3>
          <div className="flex items-baseline mt-2">
            <p className="text-3xl font-bold text-blue-600">{stats.totalDuration}</p>
            <span className="ml-1 text-gray-500">mins</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {stats.weeklyStats.duration} mins this week
          </p>
        </div>

        {/* Card 3: Calories */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium uppercase">Calories Burned</h3>
          <div className="flex items-baseline mt-2">
            <p className="text-3xl font-bold text-orange-500">{stats.totalCalories}</p>
            <span className="ml-1 text-gray-500">kcal</span>
          </div>
           <p className="text-sm text-gray-500 mt-1">
            {stats.weeklyStats.calories} kcal this week
          </p>
        </div>

        {/* Card 4: Streak */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium uppercase">Current Streak</h3>
          <div className="flex items-baseline mt-2">
            <p className="text-3xl font-bold text-red-500">{stats.currentStreak}</p>
            <span className="ml-1 text-gray-500">days</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Keep it up!
          </p>
        </div>
      </div>

      <Dashboard
        workouts={workouts}
        weeklyGoal={preferences.weeklyGoal}
        calorieGoal={preferences.calorieGoal}
        onUpdateGoals={handleUpdateGoals}
      />
    </div>
  );
}
