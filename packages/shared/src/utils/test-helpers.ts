import type { Workout } from '../schemas/workout.schema';

let idCounter = 0;

export function createMockWorkout(overrides: Partial<Workout> = {}): Workout {
  idCounter++;
  return {
    id: `workout-${idCounter}`,
    userId: 'test-user',
    activityId: 'run',
    activityName: 'Running',
    duration: 30,
    caloriesBurned: 300,
    date: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

export function createWorkoutsOnDates(
  dates: Date[],
  defaults?: Partial<Workout>
): Workout[] {
  return dates.map(date =>
    createMockWorkout({ date: date.toISOString(), ...defaults })
  );
}
