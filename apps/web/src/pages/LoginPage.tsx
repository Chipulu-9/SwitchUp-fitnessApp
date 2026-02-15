import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';
import { SignupForm } from '../components/auth/SignupForm';

/**
 * Login Page
 * Handles user authentication with login/signup forms
 */
export function LoginPage() {
  const [showSignup, setShowSignup] = useState(false);
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">SwitchUp</h1>
          <p className="text-gray-600">Track your fitness journey</p>
        </div>

        {/* Forms */}
        {showSignup ? (
          <SignupForm
            onSuccess={handleSuccess}
            onLoginClick={() => setShowSignup(false)}
          />
        ) : (
          <LoginForm
            onSuccess={handleSuccess}
            onSignUpClick={() => setShowSignup(true)}
          />
        )}
      </div>
    </div>
  );
}
