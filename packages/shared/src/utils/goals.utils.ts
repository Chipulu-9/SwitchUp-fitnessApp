import type { Workout } from '../schemas/workout.schema';
import type {
  GoalProgress,
  WeeklyActivityCalendar,
  MotivationalFeedback,
} from '../schemas/goals.schema';
import { addDays, isSameDay } from './date.utils';

const DAY_NAMES_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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

function getThisWeekWorkouts(workouts: Workout[], referenceDate: Date): Workout[] {
  const monday = getMondayOfWeek(referenceDate);
  const sunday = getSundayOfWeek(referenceDate);
  return workouts.filter(w => {
    const d = new Date(w.date);
    return d >= monday && d <= sunday;
  });
}

export function calculateWorkoutGoalProgress(
  workouts: Workout[],
  targetWorkoutsPerWeek: number,
  referenceDate: Date = new Date()
): GoalProgress {
  const weekWorkouts = getThisWeekWorkouts(workouts, referenceDate);
  const current = weekWorkouts.length;
  const percentage = targetWorkoutsPerWeek > 0
    ? Math.min(100, Math.round((current / targetWorkoutsPerWeek) * 100))
    : 0;
  const remaining = Math.max(0, targetWorkoutsPerWeek - current);
  const isComplete = current >= targetWorkoutsPerWeek;

  return { target: targetWorkoutsPerWeek, current, percentage, remaining, isComplete };
}

export function calculateCalorieGoalProgress(
  workouts: Workout[],
  targetCaloriesPerWeek: number,
  referenceDate: Date = new Date()
): GoalProgress {
  const weekWorkouts = getThisWeekWorkouts(workouts, referenceDate);
  const current = weekWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0);
  const percentage = targetCaloriesPerWeek > 0
    ? Math.min(100, Math.round((current / targetCaloriesPerWeek) * 100))
    : 0;
  const remaining = Math.max(0, targetCaloriesPerWeek - current);
  const isComplete = current >= targetCaloriesPerWeek;

  return { target: targetCaloriesPerWeek, current, percentage, remaining, isComplete };
}

export function buildWeeklyActivityCalendar(
  workouts: Workout[],
  referenceDate: Date = new Date()
): WeeklyActivityCalendar {
  const monday = getMondayOfWeek(referenceDate);
  const days = [];

  for (let i = 0; i < 7; i++) {
    const dayDate = addDays(monday, i);
    const dayWorkouts = workouts.filter(w => isSameDay(new Date(w.date), dayDate));

    days.push({
      date: dayDate.toISOString().split('T')[0],
      dayName: DAY_NAMES_SHORT[i],
      hasWorkout: dayWorkouts.length > 0,
      workoutCount: dayWorkouts.length,
      totalDuration: dayWorkouts.reduce((sum, w) => sum + w.duration, 0),
      totalCalories: dayWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0),
    });
  }

  return { days };
}

export function getMotivationalFeedback(percentage: number): MotivationalFeedback {
  if (percentage === 0) {
    return {
      message: 'Every journey starts with a single step. Log your first workout this week!',
      tone: 'encouraging',
    };
  }
  if (percentage <= 25) {
    return {
      message: 'Great start! Keep the momentum going.',
      tone: 'motivating',
    };
  }
  if (percentage <= 50) {
    return {
      message: "You're making progress! Keep pushing toward your goal.",
      tone: 'motivating',
    };
  }
  if (percentage <= 75) {
    return {
      message: 'More than halfway there! Keep it up.',
      tone: 'encouraging',
    };
  }
  if (percentage < 100) {
    return {
      message: "Almost there! Just a little more to crush your goal.",
      tone: 'celebrating',
    };
  }
  return {
    message: "Goal crushed! You're a champion this week!",
    tone: 'celebrating',
  };
}
