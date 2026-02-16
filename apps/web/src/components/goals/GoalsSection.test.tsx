import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GoalsSection } from './GoalsSection';
import type { Workout } from '@repo/shared';

const noop = async () => {};

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

describe('GoalsSection', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <GoalsSection workouts={[]} weeklyGoal={3} calorieGoal={2000} onUpdateGoals={noop} />
    );
    expect(container).toBeTruthy();
  });

  it('renders section heading', () => {
    render(
      <GoalsSection workouts={[]} weeklyGoal={3} calorieGoal={2000} onUpdateGoals={noop} />
    );
    expect(screen.getByText('Goals & Progress')).toBeTruthy();
  });

  it('renders goal setting card', () => {
    render(
      <GoalsSection workouts={[]} weeklyGoal={3} calorieGoal={2000} onUpdateGoals={noop} />
    );
    expect(screen.getByText('Your Goals')).toBeTruthy();
  });

  it('renders workout goal progress', () => {
    render(
      <GoalsSection workouts={[]} weeklyGoal={3} calorieGoal={2000} onUpdateGoals={noop} />
    );
    expect(screen.getByText('Workout Goal')).toBeTruthy();
  });

  it('renders calorie goal progress', () => {
    render(
      <GoalsSection workouts={[]} weeklyGoal={3} calorieGoal={2000} onUpdateGoals={noop} />
    );
    expect(screen.getByText('Calorie Goal')).toBeTruthy();
  });

  it('renders weekly activity calendar', () => {
    render(
      <GoalsSection workouts={[]} weeklyGoal={3} calorieGoal={2000} onUpdateGoals={noop} />
    );
    expect(screen.getByText('This Week')).toBeTruthy();
  });

  it('renders motivational message', () => {
    render(
      <GoalsSection workouts={[]} weeklyGoal={3} calorieGoal={2000} onUpdateGoals={noop} />
    );
    expect(screen.getByTestId('motivational-message')).toBeTruthy();
  });

  it('displays current goals in view mode', () => {
    render(
      <GoalsSection workouts={[]} weeklyGoal={5} calorieGoal={3000} onUpdateGoals={noop} />
    );
    expect(screen.getByText('5')).toBeTruthy();
    expect(screen.getByText('3,000')).toBeTruthy();
  });

  it('shows edit form when edit button is clicked', () => {
    render(
      <GoalsSection workouts={[]} weeklyGoal={3} calorieGoal={2000} onUpdateGoals={noop} />
    );
    fireEvent.click(screen.getByText('Edit'));
    expect(screen.getByLabelText('Weekly workout goal')).toBeTruthy();
    expect(screen.getByLabelText('Weekly calorie goal')).toBeTruthy();
  });

  it('calls onUpdateGoals when saving', async () => {
    const onUpdateGoals = vi.fn().mockResolvedValue(undefined);
    render(
      <GoalsSection workouts={[]} weeklyGoal={3} calorieGoal={2000} onUpdateGoals={onUpdateGoals} />
    );
    fireEvent.click(screen.getByText('Edit'));
    fireEvent.click(screen.getByText('Save'));
    expect(onUpdateGoals).toHaveBeenCalled();
  });
});
