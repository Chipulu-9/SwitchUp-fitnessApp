import { Card, CardContent } from '@repo/ui/Card';
import { Sparkles, Heart, Zap, Star } from 'lucide-react';
import type { MotivationalFeedback } from '@repo/shared';

interface MotivationalMessageProps {
  feedback: MotivationalFeedback;
}

const TONE_CONFIG = {
  encouraging: {
    icon: Heart,
    gradient: 'from-pink-50 to-rose-50',
    border: 'border-pink-200',
    iconColor: 'text-pink-500',
  },
  celebrating: {
    icon: Star,
    gradient: 'from-yellow-50 to-amber-50',
    border: 'border-yellow-200',
    iconColor: 'text-yellow-500',
  },
  neutral: {
    icon: Sparkles,
    gradient: 'from-gray-50 to-slate-50',
    border: 'border-gray-200',
    iconColor: 'text-gray-500',
  },
  motivating: {
    icon: Zap,
    gradient: 'from-blue-50 to-indigo-50',
    border: 'border-blue-200',
    iconColor: 'text-blue-500',
  },
};

export function MotivationalMessage({ feedback }: MotivationalMessageProps) {
  const config = TONE_CONFIG[feedback.tone];
  const Icon = config.icon;

  return (
    <Card className={`bg-gradient-to-r ${config.gradient} ${config.border} shadow-sm`}>
      <CardContent className="py-4">
        <div className="flex items-center gap-3">
          <Icon className={`w-6 h-6 ${config.iconColor} flex-shrink-0`} />
          <p className="text-sm font-medium text-gray-800" data-testid="motivational-message">
            {feedback.message}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
