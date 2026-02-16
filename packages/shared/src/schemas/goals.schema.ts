import { z } from 'zod';

export const goalProgressSchema = z.object({
  target: z.number().min(0),
  current: z.number().min(0),
  percentage: z.number().min(0).max(100),
  remaining: z.number().min(0),
  isComplete: z.boolean(),
});

export const calendarDaySchema = z.object({
  date: z.string(),
  dayName: z.string(),
  hasWorkout: z.boolean(),
  workoutCount: z.number().min(0),
  totalDuration: z.number().min(0),
  totalCalories: z.number().min(0),
});

export const weeklyActivityCalendarSchema = z.object({
  days: z.array(calendarDaySchema),
});

export const motivationalFeedbackSchema = z.object({
  message: z.string(),
  tone: z.enum(['encouraging', 'celebrating', 'neutral', 'motivating']),
});

export type GoalProgress = z.infer<typeof goalProgressSchema>;
export type CalendarDay = z.infer<typeof calendarDaySchema>;
export type WeeklyActivityCalendar = z.infer<typeof weeklyActivityCalendarSchema>;
export type MotivationalFeedback = z.infer<typeof motivationalFeedbackSchema>;
