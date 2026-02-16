import { describe, it, expect } from 'vitest';
import {
  calculateWorkoutGoalProgress,
  calculateCalorieGoalProgress,
  buildWeeklyActivityCalendar,
  getMotivationalFeedback,
} from './goals.utils';
import { createMockWorkout, createWorkoutsOnDates } from './test-helpers';
import { addDays } from './date.utils';

// Fixed reference date: Wednesday, February 18, 2026
const REF_DATE = new Date(2026, 1, 18, 12, 0, 0);

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(12, 0, 0, 0);
  return d;
}

describe('calculateWorkoutGoalProgress', () => {
  it('returns 0% when no workouts this week', () => {
    const result = calculateWorkoutGoalProgress([], 4, REF_DATE);
    expect(result.percentage).toBe(0);
    expect(result.current).toBe(0);
    expect(result.target).toBe(4);
    expect(result.remaining).toBe(4);
    expect(result.isComplete).toBe(false);
  });

  it('returns 50% when 2 of 4 target workouts completed', () => {
    const thisMonday = getMonday(REF_DATE);
    const workouts = createWorkoutsOnDates([
      thisMonday,
      addDays(thisMonday, 1),
    ]);

    const result = calculateWorkoutGoalProgress(workouts, 4, REF_DATE);
    expect(result.percentage).toBe(50);
    expect(result.current).toBe(2);
    expect(result.remaining).toBe(2);
    expect(result.isComplete).toBe(false);
  });

  it('returns 100% when target met', () => {
    const thisMonday = getMonday(REF_DATE);
    const workouts = createWorkoutsOnDates([
      thisMonday,
      addDays(thisMonday, 1),
      addDays(thisMonday, 2),
    ]);

    const result = calculateWorkoutGoalProgress(workouts, 3, REF_DATE);
    expect(result.percentage).toBe(100);
    expect(result.isComplete).toBe(true);
    expect(result.remaining).toBe(0);
  });

  it('caps at 100% when target exceeded', () => {
    const thisMonday = getMonday(REF_DATE);
    const workouts = createWorkoutsOnDates([
      thisMonday,
      addDays(thisMonday, 1),
      addDays(thisMonday, 2),
      addDays(thisMonday, 3),
    ]);

    const result = calculateWorkoutGoalProgress(workouts, 2, REF_DATE);
    expect(result.percentage).toBe(100);
    expect(result.isComplete).toBe(true);
    expect(result.remaining).toBe(0);
  });

  it('only counts current week workouts', () => {
    const thisMonday = getMonday(REF_DATE);
    const lastMonday = addDays(thisMonday, -7);
    const workouts = [
      createMockWorkout({ date: thisMonday.toISOString() }),
      createMockWorkout({ date: lastMonday.toISOString() }),
      createMockWorkout({ date: addDays(lastMonday, 1).toISOString() }),
    ];

    const result = calculateWorkoutGoalProgress(workouts, 4, REF_DATE);
    expect(result.current).toBe(1);
    expect(result.percentage).toBe(25);
  });
});

describe('calculateCalorieGoalProgress', () => {
  it('returns 0% when no calories this week', () => {
    const result = calculateCalorieGoalProgress([], 2000, REF_DATE);
    expect(result.percentage).toBe(0);
    expect(result.current).toBe(0);
    expect(result.target).toBe(2000);
  });

  it('calculates percentage correctly', () => {
    const thisMonday = getMonday(REF_DATE);
    const workouts = [
      createMockWorkout({ date: thisMonday.toISOString(), caloriesBurned: 500 }),
      createMockWorkout({ date: addDays(thisMonday, 1).toISOString(), caloriesBurned: 500 }),
    ];

    const result = calculateCalorieGoalProgress(workouts, 2000, REF_DATE);
    expect(result.percentage).toBe(50);
    expect(result.current).toBe(1000);
    expect(result.remaining).toBe(1000);
  });

  it('caps at 100% when goal exceeded', () => {
    const thisMonday = getMonday(REF_DATE);
    const workouts = [
      createMockWorkout({ date: thisMonday.toISOString(), caloriesBurned: 1500 }),
      createMockWorkout({ date: addDays(thisMonday, 1).toISOString(), caloriesBurned: 1500 }),
    ];

    const result = calculateCalorieGoalProgress(workouts, 2000, REF_DATE);
    expect(result.percentage).toBe(100);
    expect(result.isComplete).toBe(true);
    expect(result.remaining).toBe(0);
  });

  it('sums calories from all workouts in current week', () => {
    const thisMonday = getMonday(REF_DATE);
    const workouts = [
      createMockWorkout({ date: thisMonday.toISOString(), caloriesBurned: 200 }),
      createMockWorkout({ date: thisMonday.toISOString(), caloriesBurned: 300 }),
      createMockWorkout({ date: addDays(thisMonday, 1).toISOString(), caloriesBurned: 500 }),
    ];

    const result = calculateCalorieGoalProgress(workouts, 2000, REF_DATE);
    expect(result.current).toBe(1000);
    expect(result.percentage).toBe(50);
  });
});

describe('buildWeeklyActivityCalendar', () => {
  it('returns exactly 7 days', () => {
    const result = buildWeeklyActivityCalendar([], REF_DATE);
    expect(result.days).toHaveLength(7);
  });

  it('days are ordered Monday through Sunday', () => {
    const result = buildWeeklyActivityCalendar([], REF_DATE);
    expect(result.days[0].dayName).toBe('Mon');
    expect(result.days[1].dayName).toBe('Tue');
    expect(result.days[2].dayName).toBe('Wed');
    expect(result.days[3].dayName).toBe('Thu');
    expect(result.days[4].dayName).toBe('Fri');
    expect(result.days[5].dayName).toBe('Sat');
    expect(result.days[6].dayName).toBe('Sun');
  });

  it('marks days with workouts as hasWorkout true', () => {
    const thisMonday = getMonday(REF_DATE);
    const workouts = [
      createMockWorkout({ date: thisMonday.toISOString() }),
    ];

    const result = buildWeeklyActivityCalendar(workouts, REF_DATE);
    expect(result.days[0].hasWorkout).toBe(true); // Monday
    expect(result.days[1].hasWorkout).toBe(false); // Tuesday
  });

  it('marks days without workouts as hasWorkout false', () => {
    const result = buildWeeklyActivityCalendar([], REF_DATE);
    result.days.forEach(day => {
      expect(day.hasWorkout).toBe(false);
    });
  });

  it('counts multiple workouts on same day', () => {
    const thisMonday = getMonday(REF_DATE);
    const workouts = [
      createMockWorkout({ date: thisMonday.toISOString(), duration: 30, caloriesBurned: 300 }),
      createMockWorkout({ date: thisMonday.toISOString(), duration: 45, caloriesBurned: 400 }),
    ];

    const result = buildWeeklyActivityCalendar(workouts, REF_DATE);
    expect(result.days[0].workoutCount).toBe(2);
    expect(result.days[0].totalDuration).toBe(75);
    expect(result.days[0].totalCalories).toBe(700);
  });

  it('only includes workouts from the current week', () => {
    const thisMonday = getMonday(REF_DATE);
    const lastMonday = addDays(thisMonday, -7);
    const workouts = [
      createMockWorkout({ date: thisMonday.toISOString() }),
      createMockWorkout({ date: lastMonday.toISOString() }),
    ];

    const result = buildWeeklyActivityCalendar(workouts, REF_DATE);
    const totalWorkouts = result.days.reduce((sum, d) => sum + d.workoutCount, 0);
    expect(totalWorkouts).toBe(1);
  });
});

describe('getMotivationalFeedback', () => {
  it('returns encouraging tone for 0%', () => {
    const result = getMotivationalFeedback(0);
    expect(result.tone).toBe('encouraging');
    expect(result.message).toBeTruthy();
  });

  it('returns motivating tone for 25%', () => {
    const result = getMotivationalFeedback(25);
    expect(result.tone).toBe('motivating');
  });

  it('returns motivating tone for 50%', () => {
    const result = getMotivationalFeedback(50);
    expect(result.tone).toBe('motivating');
  });

  it('returns encouraging tone for 75%', () => {
    const result = getMotivationalFeedback(75);
    expect(result.tone).toBe('encouraging');
  });

  it('returns celebrating tone for 99%', () => {
    const result = getMotivationalFeedback(99);
    expect(result.tone).toBe('celebrating');
  });

  it('returns celebrating tone for 100%', () => {
    const result = getMotivationalFeedback(100);
    expect(result.tone).toBe('celebrating');
  });

  it('returns appropriate message strings', () => {
    const result0 = getMotivationalFeedback(0);
    const result100 = getMotivationalFeedback(100);
    expect(result0.message.length).toBeGreaterThan(0);
    expect(result100.message.length).toBeGreaterThan(0);
    expect(result0.message).not.toBe(result100.message);
  });
});
