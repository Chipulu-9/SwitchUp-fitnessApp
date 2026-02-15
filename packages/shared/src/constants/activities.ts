import type { Activity, ActivityCategory } from '../schemas/activity.schema';

/**
 * Predefined activity categories
 */
export const ACTIVITY_CATEGORIES = {
  CARDIO: 'cardio',
  STRENGTH: 'strength',
  FLEXIBILITY: 'flexibility',
} as const;

/**
 * Predefined activities list
 * This list will be seeded into Firestore on initial setup
 */
export const PREDEFINED_ACTIVITIES: Activity[] = [
  // Cardio Activities
  {
    id: 'run',
    name: 'Running',
    category: 'cardio' as ActivityCategory,
    avgCaloriesPerMin: 10,
    description: 'Outdoor or treadmill running',
  },
  {
    id: 'cycle',
    name: 'Cycling',
    category: 'cardio' as ActivityCategory,
    avgCaloriesPerMin: 8,
    description: 'Road cycling or stationary bike',
  },
  {
    id: 'swim',
    name: 'Swimming',
    category: 'cardio' as ActivityCategory,
    avgCaloriesPerMin: 11,
    description: 'Lap swimming',
  },
  {
    id: 'walk',
    name: 'Walking',
    category: 'cardio' as ActivityCategory,
    avgCaloriesPerMin: 4,
    description: 'Brisk walking or hiking',
  },
  {
    id: 'jump-rope',
    name: 'Jump Rope',
    category: 'cardio' as ActivityCategory,
    avgCaloriesPerMin: 12,
    description: 'Skipping rope',
  },
  {
    id: 'rowing',
    name: 'Rowing',
    category: 'cardio' as ActivityCategory,
    avgCaloriesPerMin: 9,
    description: 'Rowing machine or water rowing',
  },
  {
    id: 'elliptical',
    name: 'Elliptical',
    category: 'cardio' as ActivityCategory,
    avgCaloriesPerMin: 7,
    description: 'Elliptical machine',
  },

  // Strength Training
  {
    id: 'weights',
    name: 'Weight Training',
    category: 'strength' as ActivityCategory,
    avgCaloriesPerMin: 6,
    description: 'Free weights or machines',
  },
  {
    id: 'bodyweight',
    name: 'Bodyweight Exercises',
    category: 'strength' as ActivityCategory,
    avgCaloriesPerMin: 5,
    description: 'Push-ups, pull-ups, squats, etc.',
  },
  {
    id: 'crossfit',
    name: 'CrossFit',
    category: 'strength' as ActivityCategory,
    avgCaloriesPerMin: 9,
    description: 'High-intensity functional fitness',
  },
  {
    id: 'powerlifting',
    name: 'Powerlifting',
    category: 'strength' as ActivityCategory,
    avgCaloriesPerMin: 5,
    description: 'Squat, bench press, deadlift',
  },

  // Flexibility & Mind-Body
  {
    id: 'yoga',
    name: 'Yoga',
    category: 'flexibility' as ActivityCategory,
    avgCaloriesPerMin: 3,
    description: 'Various yoga styles',
  },
  {
    id: 'pilates',
    name: 'Pilates',
    category: 'flexibility' as ActivityCategory,
    avgCaloriesPerMin: 4,
    description: 'Core strengthening and flexibility',
  },
  {
    id: 'stretch',
    name: 'Stretching',
    category: 'flexibility' as ActivityCategory,
    avgCaloriesPerMin: 2,
    description: 'Static or dynamic stretching',
  },
  {
    id: 'tai-chi',
    name: 'Tai Chi',
    category: 'flexibility' as ActivityCategory,
    avgCaloriesPerMin: 3,
    description: 'Gentle martial art movements',
  },
];

/**
 * Get activities by category
 */
export function getActivitiesByCategory(category: ActivityCategory): Activity[] {
  return PREDEFINED_ACTIVITIES.filter((activity) => activity.category === category);
}

/**
 * Get activity by ID
 */
export function getActivityById(id: string): Activity | undefined {
  return PREDEFINED_ACTIVITIES.find((activity) => activity.id === id);
}

/**
 * Get all activity categories
 */
export function getAllCategories(): ActivityCategory[] {
  return ['cardio', 'strength', 'flexibility'] as ActivityCategory[];
}
