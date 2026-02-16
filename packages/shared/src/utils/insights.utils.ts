import type { Workout } from '../schemas/workout.schema';
import type {
  WeeklyTrendItem,
  WeekOverWeekComparison,
  ConsistencyScore,
  BestDay,
  AverageMetrics,
  PersonalBests,
} from '../schemas/insights.schema';
import { getISOWeek, addDays } from './date.utils';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function getMondayOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getSundayOfWeek(date: Date): Date {
  const monday = getMondayOfWeek(date);
  const sunday = addDays(monday, 6);
  sunday.setHours(23, 59, 59, 999);
  return sunday;
}

function isInWeek(workoutDate: Date, weekMonday: Date): boolean {
  const monday = new Date(weekMonday);
  monday.setHours(0, 0, 0, 0);
  const sunday = addDays(monday, 6);
  sunday.setHours(23, 59, 59, 999);
  return workoutDate >= monday && workoutDate <= sunday;
}

function buildTrendItem(weekMonday: Date, workouts: Workout[]): WeeklyTrendItem {
  const weekWorkouts = workouts.filter(w => isInWeek(new Date(w.date), weekMonday));
  return {
    week: getISOWeek(weekMonday),
    weekStartDate: weekMonday.toISOString(),
    workouts: weekWorkouts.length,
    duration: weekWorkouts.reduce((sum, w) => sum + w.duration, 0),
    calories: weekWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0),
  };
}

export function calculateWeeklyTrends(
  workouts: Workout[],
  weeksCount: number = 8,
  referenceDate: Date = new Date()
): WeeklyTrendItem[] {
  const currentMonday = getMondayOfWeek(referenceDate);
  const weeks: WeeklyTrendItem[] = [];

  for (let i = weeksCount - 1; i >= 0; i--) {
    const weekMonday = addDays(currentMonday, -i * 7);
    weekMonday.setHours(0, 0, 0, 0);
    weeks.push(buildTrendItem(weekMonday, workouts));
  }

  return weeks;
}

export function calculateWeekOverWeek(
  workouts: Workout[],
  referenceDate: Date = new Date()
): WeekOverWeekComparison {
  const trends = calculateWeeklyTrends(workouts, 2, referenceDate);
  const lastWeek = trends[0];
  const thisWeek = trends[1];

  const workoutsDelta = thisWeek.workouts - lastWeek.workouts;
  const durationDelta = thisWeek.duration - lastWeek.duration;
  const caloriesDelta = thisWeek.calories - lastWeek.calories;

  const pctChange = (current: number, previous: number): number | null => {
    if (previous === 0) return null;
    return Math.round(((current - previous) / previous) * 100);
  };

  return {
    thisWeek,
    lastWeek,
    workoutsDelta,
    durationDelta,
    caloriesDelta,
    workoutsPercentChange: pctChange(thisWeek.workouts, lastWeek.workouts),
    durationPercentChange: pctChange(thisWeek.duration, lastWeek.duration),
    caloriesPercentChange: pctChange(thisWeek.calories, lastWeek.calories),
  };
}

export function calculateConsistencyScore(
  workouts: Workout[],
  targetDaysPerWeek: number,
  referenceDate: Date = new Date()
): ConsistencyScore {
  if (targetDaysPerWeek === 0) {
    return { targetDaysPerWeek: 0, actualDaysThisWeek: 0, score: 100 };
  }

  const weekMonday = getMondayOfWeek(referenceDate);
  const weekWorkouts = workouts.filter(w => isInWeek(new Date(w.date), weekMonday));

  const uniqueDays = new Set(
    weekWorkouts.map(w => new Date(w.date).toISOString().split('T')[0])
  );

  const actualDays = uniqueDays.size;
  const score = Math.min(100, Math.round((actualDays / targetDaysPerWeek) * 100));

  return {
    targetDaysPerWeek,
    actualDaysThisWeek: actualDays,
    score,
  };
}

export function calculateBestDay(workouts: Workout[]): BestDay | null {
  if (workouts.length === 0) return null;

  const dayCounts = new Array(7).fill(0);
  workouts.forEach(w => {
    const day = new Date(w.date).getDay();
    dayCounts[day]++;
  });

  let bestDayIndex = 0;
  for (let i = 1; i < 7; i++) {
    if (dayCounts[i] > dayCounts[bestDayIndex]) {
      bestDayIndex = i;
    }
  }

  return {
    dayOfWeek: bestDayIndex,
    dayName: DAY_NAMES[bestDayIndex],
    totalWorkouts: dayCounts[bestDayIndex],
  };
}

export function calculateAverageMetrics(workouts: Workout[]): AverageMetrics {
  if (workouts.length === 0) {
    return { avgDuration: 0, avgCalories: 0, totalSessions: 0 };
  }

  const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0);
  const totalCalories = workouts.reduce((sum, w) => sum + w.caloriesBurned, 0);

  return {
    avgDuration: Math.round(totalDuration / workouts.length),
    avgCalories: Math.round(totalCalories / workouts.length),
    totalSessions: workouts.length,
  };
}

export function calculatePersonalBests(workouts: Workout[]): PersonalBests {
  if (workouts.length === 0) {
    return { longestWorkoutDuration: 0, mostCaloriesInSession: 0, longestStreak: 0 };
  }

  const longestWorkoutDuration = Math.max(...workouts.map(w => w.duration));
  const mostCaloriesInSession = Math.max(...workouts.map(w => w.caloriesBurned));

  // Calculate longest streak from all workout dates
  const uniqueDates = Array.from(
    new Set(workouts.map(w => new Date(w.date).toISOString().split('T')[0]))
  ).sort();

  let longestStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < uniqueDates.length; i++) {
    const prev = new Date(uniqueDates[i - 1]);
    const curr = new Date(uniqueDates[i]);
    const diffMs = curr.getTime() - prev.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      currentStreak++;
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }
    } else {
      currentStreak = 1;
    }
  }

  return {
    longestWorkoutDuration,
    mostCaloriesInSession,
    longestStreak,
  };
}
