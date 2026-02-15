import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupCredentials } from '@repo/shared';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '@repo/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui/Card';

interface SignupFormProps {
  onSuccess?: () => void;
  onLoginClick?: () => void;
}

/**
 * Signup Form Component
 * Handles new user registration
 */
export function SignupForm({ onSuccess, onLoginClick }: SignupFormProps) {
  const { signUp } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupCredentials>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupCredentials) => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      await signUp(data.email, data.password, data.displayName);
      onSuccess?.();
    } catch (error: any) {
      setErrorMessage(
        error.code === 'auth/email-already-in-use'
          ? 'An account with this email already exists'
          : error.code === 'auth/weak-password'
          ? 'Password should be at least 6 characters'
          : error.message || 'Failed to create account'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
              {errorMessage}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              {...register('displayName')}
              type="text"
              id="displayName"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
            />
            {errors.displayName && (
              <p className="text-sm text-red-600">{errors.displayName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              {...register('password')}
              type="password"
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
            <p className="text-xs text-gray-500">Must be at least 6 characters</p>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </Button>

          <div className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onLoginClick}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign in
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
