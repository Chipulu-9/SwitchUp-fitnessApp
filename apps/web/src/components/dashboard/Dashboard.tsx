import type { Workout } from '@repo/shared'
import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui/Card'
import { formatDuration } from '@repo/shared'
import { Activity, Calendar, Flame, TrendingUp, Award, Clock } from 'lucide-react'
import { InsightsSection } from './insights/InsightsSection'
import { GoalsSection } from '../goals/GoalsSection'

interface DashboardProps {
  workouts: Workout[]
  weeklyGoal?: number
  calorieGoal?: number
  onUpdateGoals?: (goals: { weeklyGoal: number; calorieGoal: number }) => Promise<void>
}

export function Dashboard({ workouts, weeklyGoal = 3, calorieGoal = 0, onUpdateGoals }: DashboardProps) {
  // Calculate statistics
  const totalWorkouts = workouts.length
  const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0)
  const totalCalories = workouts.reduce((sum, w) => sum + w.caloriesBurned, 0)

  // Get this week's workouts
  const now = new Date()
  const weekStart = new Date(now.setDate(now.getDate() - now.getDay()))
  weekStart.setHours(0, 0, 0, 0)

  const thisWeekWorkouts = workouts.filter(w => {
    const workoutDate = new Date(w.date)
    return workoutDate >= weekStart
  })

  const weeklyWorkouts = thisWeekWorkouts.length
  const weeklyDuration = thisWeekWorkouts.reduce((sum, w) => sum + w.duration, 0)
  const weeklyCalories = thisWeekWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0)

  // Calculate current streak (consecutive days with workouts)
  const sortedDates = [...new Set(workouts.map(w => new Date(w.date).toDateString()))].sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  )

  let currentStreak = 0
  const today = new Date().toDateString()
  const yesterday = new Date(Date.now() - 86400000).toDateString()

  if (sortedDates.length > 0 && (sortedDates[0] === today || sortedDates[0] === yesterday)) {
    let checkDate = sortedDates[0] === today ? new Date() : new Date(Date.now() - 86400000)

    for (const dateStr of sortedDates) {
      if (dateStr === checkDate.toDateString()) {
        currentStreak++
        checkDate = new Date(checkDate.getTime() - 86400000)
      } else {
        break
      }
    }
  }

  // Get activity breakdown
  const activityCounts = workouts.reduce(
    (acc, w) => {
      acc[w.activityName] = (acc[w.activityName] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const topActivities = Object.entries(activityCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)

  const handleUpdateGoals = onUpdateGoals || (async () => {})

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Workouts"
          value={totalWorkouts}
          icon={<Activity className="w-6 h-6 text-blue-600" />}
          gradient="from-blue-50 to-blue-100"
        />
        <StatsCard
          title="Total Duration"
          value={formatDuration(totalDuration)}
          icon={<Clock className="w-6 h-6 text-purple-600" />}
          gradient="from-purple-50 to-purple-100"
        />
        <StatsCard
          title="Total Calories"
          value={`${totalCalories.toLocaleString()}`}
          unit="cal"
          icon={<Flame className="w-6 h-6 text-orange-600" />}
          gradient="from-orange-50 to-orange-100"
        />
        <StatsCard
          title="Current Streak"
          value={`${currentStreak}`}
          unit={currentStreak === 1 ? 'day' : 'days'}
          icon={<TrendingUp className="w-6 h-6 text-green-600" />}
          gradient="from-green-50 to-green-100"
          highlight={currentStreak > 0}
        />
      </div>

      {/* This Week Stats */}
      <Card className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 border-indigo-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <CardTitle className="text-indigo-900">This Week's Progress</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-indigo-500" />
                <p className="text-sm font-medium text-gray-600">Workouts</p>
              </div>
              <p className="text-4xl font-bold text-indigo-600">{weeklyWorkouts}</p>
            </div>
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-indigo-500" />
                <p className="text-sm font-medium text-gray-600">Duration</p>
              </div>
              <p className="text-4xl font-bold text-indigo-600">{formatDuration(weeklyDuration)}</p>
            </div>
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-4 h-4 text-indigo-500" />
                <p className="text-sm font-medium text-gray-600">Calories</p>
              </div>
              <p className="text-4xl font-bold text-indigo-600">
                {weeklyCalories.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Activities */}
      {topActivities.length > 0 && (
        <Card className="border-gray-200 shadow-md">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-600" />
              <CardTitle className="text-gray-900">Your Top Activities</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {topActivities.map(([activity, count], index) => {
                const medals = ['🥇', '🥈', '🥉']
                const colors = [
                  'from-yellow-50 to-amber-50 border-yellow-300',
                  'from-gray-50 to-slate-50 border-gray-300',
                  'from-orange-50 to-amber-50 border-orange-300',
                ]
                return (
                  <div
                    key={activity}
                    className={`flex items-center justify-between p-4 rounded-lg bg-gradient-to-r ${colors[index]} border transition-transform hover:scale-[1.02]`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{medals[index]}</span>
                      <div>
                        <span className="font-semibold text-gray-900 text-lg">{activity}</span>
                        <p className="text-sm text-gray-600">Rank #{index + 1}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-gray-900">{count}</span>
                      <p className="text-sm text-gray-600">
                        {count === 1 ? 'workout' : 'workouts'}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Motivational Message */}
      {totalWorkouts === 0 ? (
        <Card className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-blue-300 shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="mb-4">
              <Activity className="w-16 h-16 text-blue-600 mx-auto" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-3">
              Ready to start your fitness journey?
            </p>
            <p className="text-gray-700 text-lg">
              Log your first workout to begin tracking your progress!
            </p>
          </CardContent>
        </Card>
      ) : currentStreak > 2 ? (
        <Card className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-green-300 shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <TrendingUp className="w-12 h-12 text-green-600" />
              <Flame className="w-12 h-12 text-orange-500 animate-pulse" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-2">
              Amazing! You're on a {currentStreak}-day streak!
            </p>
            <p className="text-gray-700 text-lg">Keep up the great work and stay consistent!</p>
          </CardContent>
        </Card>
      ) : null}

      {/* Performance Insights */}
      <InsightsSection workouts={workouts} weeklyGoal={weeklyGoal} />

      {/* Goals & Progress */}
      <GoalsSection
        workouts={workouts}
        weeklyGoal={weeklyGoal}
        calorieGoal={calorieGoal}
        onUpdateGoals={handleUpdateGoals}
      />
    </div>
  )
}

interface StatsCardProps {
  title: string
  value: string | number
  unit?: string
  icon: React.ReactNode
  gradient?: string
  highlight?: boolean
}

function StatsCard({ title, value, unit, icon, gradient, highlight }: StatsCardProps) {
  return (
    <Card
      className={`${highlight ? 'border-2 border-green-400 shadow-lg' : 'shadow-md'} bg-gradient-to-br ${gradient || 'from-white to-gray-50'} transition-transform hover:scale-[1.02]`}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{title}</p>
          <div className="p-2 bg-white rounded-lg shadow-sm">{icon}</div>
        </div>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {unit && <span className="text-lg font-medium text-gray-600">{unit}</span>}
        </div>
      </CardContent>
    </Card>
  )
}
