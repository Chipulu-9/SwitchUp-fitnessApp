import { describe, it, expect, beforeEach } from 'vitest';
import {
  calculateWeeklyTrends,
  calculateWeekOverWeek,
  calculateConsistencyScore,
  calculateBestDay,
  calculateAverageMetrics,
  calculatePersonalBests,
} from './insights.utils';
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

describe('calculateWeeklyTrends', () => {
  it('returns empty array when no workouts', () => {
    const result = calculateWeeklyTrends([], 8, REF_DATE);
    expect(result).toHaveLength(8);
    result.forEach(week => {
      expect(week.workouts).toBe(0);
      expect(week.duration).toBe(0);
      expect(week.calories).toBe(0);
    });
  });

  it('returns correct number of weeks', () => {
    const result = calculateWeeklyTrends([], 4, REF_DATE);
    expect(result).toHaveLength(4);
  });

  it('returns weeks sorted oldest to newest', () => {
    const result = calculateWeeklyTrends([], 4, REF_DATE);
    for (let i = 1; i < result.length; i++) {
      expect(new Date(result[i].weekStartDate).getTime()).toBeGreaterThan(
        new Date(result[i - 1].weekStartDate).getTime()
      );
    }
  });

  it('correctly buckets workouts into their respective weeks', () => {
    const thisMonday = getMonday(REF_DATE);
    const lastMonday = addDays(thisMonday, -7);

    const workouts = [
      createMockWorkout({ date: thisMonday.toISOString(), duration: 30, caloriesBurned: 300 }),
      createMockWorkout({ date: addDays(thisMonday, 1).toISOString(), duration: 45, caloriesBurned: 400 }),
      createMockWorkout({ date: lastMonday.toISOString(), duration: 60, caloriesBurned: 500 }),
    ];

    const result = calculateWeeklyTrends(workouts, 2, REF_DATE);
    // Last element is current week
    expect(result[result.length - 1].workouts).toBe(2);
    expect(result[result.length - 1].duration).toBe(75);
    expect(result[result.length - 1].calories).toBe(700);
    // Previous week
    expect(result[result.length - 2].workouts).toBe(1);
    expect(result[result.length - 2].duration).toBe(60);
    expect(result[result.length - 2].calories).toBe(500);
  });

  it('returns zeros for weeks with no workouts', () => {
    const thisMonday = getMonday(REF_DATE);
    const workouts = [
      createMockWorkout({ date: thisMonday.toISOString() }),
    ];

    const result = calculateWeeklyTrends(workouts, 3, REF_DATE);
    // Only the last week should have data
    expect(result[0].workouts).toBe(0);
    expect(result[1].workouts).toBe(0);
    expect(result[2].workouts).toBe(1);
  });
});

describe('calculateWeekOverWeek', () => {
  it('returns zeros when no workouts in either week', () => {
    const result = calculateWeekOverWeek([], REF_DATE);
    expect(result.thisWeek.workouts).toBe(0);
    expect(result.lastWeek.workouts).toBe(0);
    expect(result.workoutsDelta).toBe(0);
    expect(result.durationDelta).toBe(0);
    expect(result.caloriesDelta).toBe(0);
  });

  it('calculates positive delta when this week > last week', () => {
    const thisMonday = getMonday(REF_DATE);
    const lastMonday = addDays(thisMonday, -7);

    const workouts = [
      createMockWorkout({ date: thisMonday.toISOString(), duration: 30, caloriesBurned: 300 }),
      createMockWorkout({ date: addDays(thisMonday, 1).toISOString(), duration: 30, caloriesBurned: 300 }),
      createMockWorkout({ date: lastMonday.toISOString(), duration: 20, caloriesBurned: 200 }),
    ];

    const result = calculateWeekOverWeek(workouts, REF_DATE);
    expect(result.workoutsDelta).toBe(1);
    expect(result.durationDelta).toBe(40);
    expect(result.caloriesDelta).toBe(400);
  });

  it('calculates negative delta when this week < last week', () => {
    const thisMonday = getMonday(REF_DATE);
    const lastMonday = addDays(thisMonday, -7);

    const workouts = [
      createMockWorkout({ date: thisMonday.toISOString(), duration: 20, caloriesBurned: 200 }),
      createMockWorkout({ date: lastMonday.toISOString(), duration: 30, caloriesBurned: 300 }),
      createMockWorkout({ date: addDays(lastMonday, 1).toISOString(), duration: 40, caloriesBurned: 400 }),
    ];

    const result = calculateWeekOverWeek(workouts, REF_DATE);
    expect(result.workoutsDelta).toBe(-1);
    expect(result.durationDelta).toBe(-50);
    expect(result.caloriesDelta).toBe(-500);
  });

  it('calculates percent change correctly', () => {
    const thisMonday = getMonday(REF_DATE);
    const lastMonday = addDays(thisMonday, -7);

    const workouts = [
      createMockWorkout({ date: thisMonday.toISOString(), duration: 30, caloriesBurned: 300 }),
      createMockWorkout({ date: addDays(thisMonday, 1).toISOString(), duration: 30, caloriesBurned: 300 }),
      createMockWorkout({ date: lastMonday.toISOString(), duration: 30, caloriesBurned: 300 }),
    ];

    const result = calculateWeekOverWeek(workouts, REF_DATE);
    expect(result.workoutsPercentChange).toBe(100); // 1 -> 2 = +100%
    expect(result.durationPercentChange).toBe(100); // 30 -> 60 = +100%
    expect(result.caloriesPercentChange).toBe(100);
  });

  it('returns null percent change when last week value is zero', () => {
    const thisMonday = getMonday(REF_DATE);

    const workouts = [
      createMockWorkout({ date: thisMonday.toISOString() }),
    ];

    const result = calculateWeekOverWeek(workouts, REF_DATE);
    expect(result.workoutsPercentChange).toBeNull();
    expect(result.durationPercentChange).toBeNull();
    expect(result.caloriesPercentChange).toBeNull();
  });
});

describe('calculateConsistencyScore', () => {
  it('returns score of 0 when no workouts this week', () => {
    const result = calculateConsistencyScore([], 4, REF_DATE);
    expect(result.score).toBe(0);
    expect(result.actualDaysThisWeek).toBe(0);
    expect(result.targetDaysPerWeek).toBe(4);
  });

  it('returns score of 100 when target met exactly', () => {
    const thisMonday = getMonday(REF_DATE);
    const workouts = createWorkoutsOnDates([
      thisMonday,
      addDays(thisMonday, 1),
      addDays(thisMonday, 2),
      addDays(thisMonday, 3),
    ]);

    const result = calculateConsistencyScore(workouts, 4, REF_DATE);
    expect(result.score).toBe(100);
    expect(result.actualDaysThisWeek).toBe(4);
  });

  it('returns score of 100 when target exceeded', () => {
    const thisMonday = getMonday(REF_DATE);
    const workouts = createWorkoutsOnDates([
      thisMonday,
      addDays(thisMonday, 1),
      addDays(thisMonday, 2),
      addDays(thisMonday, 3),
      addDays(thisMonday, 4),
    ]);

    const result = calculateConsistencyScore(workouts, 3, REF_DATE);
    expect(result.score).toBe(100);
  });

  it('returns score of 75 for 3 out of 4 target days', () => {
    const thisMonday = getMonday(REF_DATE);
    const workouts = createWorkoutsOnDates([
      thisMonday,
      addDays(thisMonday, 1),
      addDays(thisMonday, 2),
    ]);

    const result = calculateConsistencyScore(workouts, 4, REF_DATE);
    expect(result.score).toBe(75);
    expect(result.actualDaysThisWeek).toBe(3);
  });

  it('returns score of 100 when targetDaysPerWeek is 0', () => {
    const result = calculateConsistencyScore([], 0, REF_DATE);
    expect(result.score).toBe(100);
  });

  it('counts unique days not total workouts', () => {
    const thisMonday = getMonday(REF_DATE);
    // 3 workouts on the same day
    const workouts = [
      createMockWorkout({ date: thisMonday.toISOString() }),
      createMockWorkout({ date: thisMonday.toISOString() }),
      createMockWorkout({ date: thisMonday.toISOString() }),
    ];

    const result = calculateConsistencyScore(workouts, 4, REF_DATE);
    expect(result.actualDaysThisWeek).toBe(1);
    expect(result.score).toBe(25);
  });

  it('only counts workouts from the current week', () => {
    const thisMonday = getMonday(REF_DATE);
    const lastMonday = addDays(thisMonday, -7);
    const workouts = [
      createMockWorkout({ date: thisMonday.toISOString() }),
      createMockWorkout({ date: lastMonday.toISOString() }),
      createMockWorkout({ date: addDays(lastMonday, 1).toISOString() }),
    ];

    const result = calculateConsistencyScore(workouts, 4, REF_DATE);
    expect(result.actualDaysThisWeek).toBe(1);
  });
});

describe('calculateBestDay', () => {
  it('returns null when no workouts', () => {
    const result = calculateBestDay([]);
    expect(result).toBeNull();
  });

  it('returns the correct day when one day dominates', () => {
    // Create workouts on Mondays (dayOfWeek=1) and one on Tuesday
    const workouts = [
      createMockWorkout({ date: new Date(2026, 1, 16, 12).toISOString() }), // Monday
      createMockWorkout({ date: new Date(2026, 1, 9, 12).toISOString() }),  // Monday
      createMockWorkout({ date: new Date(2026, 1, 2, 12).toISOString() }),  // Monday
      createMockWorkout({ date: new Date(2026, 1, 17, 12).toISOString() }), // Tuesday
    ];

    const result = calculateBestDay(workouts);
    expect(result).not.toBeNull();
    expect(result!.dayName).toBe('Monday');
    expect(result!.totalWorkouts).toBe(3);
  });

  it('includes correct dayName string', () => {
    const workouts = [
      createMockWorkout({ date: new Date(2026, 1, 14, 12).toISOString() }), // Saturday
    ];

    const result = calculateBestDay(workouts);
    expect(result).not.toBeNull();
    expect(result!.dayName).toBe('Saturday');
    expect(result!.dayOfWeek).toBe(6);
  });
});

describe('calculateAverageMetrics', () => {
  it('returns zeros when no workouts', () => {
    const result = calculateAverageMetrics([]);
    expect(result.avgDuration).toBe(0);
    expect(result.avgCalories).toBe(0);
    expect(result.totalSessions).toBe(0);
  });

  it('calculates correct averages with one workout', () => {
    const workouts = [
      createMockWorkout({ duration: 60, caloriesBurned: 500 }),
    ];

    const result = calculateAverageMetrics(workouts);
    expect(result.avgDuration).toBe(60);
    expect(result.avgCalories).toBe(500);
    expect(result.totalSessions).toBe(1);
  });

  it('calculates correct averages with multiple workouts', () => {
    const workouts = [
      createMockWorkout({ duration: 30, caloriesBurned: 300 }),
      createMockWorkout({ duration: 60, caloriesBurned: 500 }),
      createMockWorkout({ duration: 90, caloriesBurned: 700 }),
    ];

    const result = calculateAverageMetrics(workouts);
    expect(result.avgDuration).toBe(60);
    expect(result.avgCalories).toBe(500);
    expect(result.totalSessions).toBe(3);
  });

  it('rounds averages to whole numbers', () => {
    const workouts = [
      createMockWorkout({ duration: 31, caloriesBurned: 301 }),
      createMockWorkout({ duration: 32, caloriesBurned: 302 }),
    ];

    const result = calculateAverageMetrics(workouts);
    expect(result.avgDuration).toBe(Math.round(63 / 2));
    expect(result.avgCalories).toBe(Math.round(603 / 2));
  });
});

describe('calculatePersonalBests', () => {
  it('returns zeros when no workouts', () => {
    const result = calculatePersonalBests([]);
    expect(result.longestWorkoutDuration).toBe(0);
    expect(result.mostCaloriesInSession).toBe(0);
    expect(result.longestStreak).toBe(0);
  });

  it('finds the longest workout by duration', () => {
    const workouts = [
      createMockWorkout({ duration: 30 }),
      createMockWorkout({ duration: 120 }),
      createMockWorkout({ duration: 60 }),
    ];

    const result = calculatePersonalBests(workouts);
    expect(result.longestWorkoutDuration).toBe(120);
  });

  it('finds the most calories burned in a single session', () => {
    const workouts = [
      createMockWorkout({ caloriesBurned: 200 }),
      createMockWorkout({ caloriesBurned: 800 }),
      createMockWorkout({ caloriesBurned: 500 }),
    ];

    const result = calculatePersonalBests(workouts);
    expect(result.mostCaloriesInSession).toBe(800);
  });

  it('calculates longest streak correctly', () => {
    // 5 consecutive days
    const workouts = createWorkoutsOnDates([
      new Date(2026, 1, 14, 12), // Saturday
      new Date(2026, 1, 15, 12), // Sunday
      new Date(2026, 1, 16, 12), // Monday
      new Date(2026, 1, 17, 12), // Tuesday
      new Date(2026, 1, 18, 12), // Wednesday
    ]);

    const result = calculatePersonalBests(workouts);
    expect(result.longestStreak).toBe(5);
  });

  it('handles non-consecutive workouts for streak', () => {
    const workouts = createWorkoutsOnDates([
      new Date(2026, 1, 16, 12), // Monday
      new Date(2026, 1, 17, 12), // Tuesday
      // gap on Wednesday
      new Date(2026, 1, 19, 12), // Thursday
      new Date(2026, 1, 20, 12), // Friday
      new Date(2026, 1, 21, 12), // Saturday
    ]);

    const result = calculatePersonalBests(workouts);
    expect(result.longestStreak).toBe(3); // Thu-Fri-Sat
  });
});
