import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InsightsSection } from './InsightsSection';
import type { Workout } from '@repo/shared';

function createWorkout(overrides: Partial<Workout> = {}): Workout {
  return {
    id: 'w1',
    userId: 'u1',
    activityId: 'run',
    activityName: 'Running',
    duration: 30,
    caloriesBurned: 300,
    date: new Date().toISOString(),
    ...overrides,
  };
}

describe('InsightsSection', () => {
  it('renders without crashing with empty workouts', () => {
    const { container } = render(
      <InsightsSection workouts={[]} weeklyGoal={3} />
    );
    expect(container).toBeTruthy();
  });

  it('renders section heading', () => {
    render(<InsightsSection workouts={[]} weeklyGoal={3} />);
    expect(screen.getByText('Performance Insights')).toBeTruthy();
  });

  it('renders weekly trend chart', () => {
    render(<InsightsSection workouts={[]} weeklyGoal={3} />);
    expect(screen.getByText('Weekly Trends')).toBeTruthy();
  });

  it('renders week-over-week comparison', () => {
    render(<InsightsSection workouts={[]} weeklyGoal={3} />);
    expect(screen.getByText('This Week vs Last Week')).toBeTruthy();
  });

  it('renders consistency score', () => {
    render(<InsightsSection workouts={[]} weeklyGoal={3} />);
    expect(screen.getByText('Consistency')).toBeTruthy();
  });

  it('renders best day card', () => {
    render(<InsightsSection workouts={[]} weeklyGoal={3} />);
    expect(screen.getByText('Best Day')).toBeTruthy();
  });

  it('renders average metrics', () => {
    render(<InsightsSection workouts={[]} weeklyGoal={3} />);
    expect(screen.getByText('Per Session Averages')).toBeTruthy();
  });

  it('renders personal bests', () => {
    render(<InsightsSection workouts={[]} weeklyGoal={3} />);
    expect(screen.getByText('Personal Bests')).toBeTruthy();
  });

  it('renders with workout data', () => {
    const workouts = [
      createWorkout({ duration: 60, caloriesBurned: 500 }),
      createWorkout({ id: 'w2', duration: 45, caloriesBurned: 400, date: new Date().toISOString() }),
    ];
    const { container } = render(
      <InsightsSection workouts={workouts} weeklyGoal={3} />
    );
    expect(container.querySelector('[data-testid="insights-section"]')).toBeTruthy();
  });
});
