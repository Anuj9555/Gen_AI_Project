import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { LoginForm } from '../components/auth/LoginForm';
import { ForgotPassword } from '../components/auth/ForgotPassword';

export const LoginPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isForgot = searchParams.get('forgot') === 'true';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-brand-500/25 group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Wander<span className="text-brand-600">AI</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {isForgot ? 'Reset your password' : 'Welcome back, traveler'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isForgot
              ? 'Enter your email to receive recovery instructions'
              : 'Sign in to access your planned itineraries and trips'}
          </p>
        </div>

        {/* Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl">
          {isForgot ? (
            <ForgotPassword onBackToLogin={() => setSearchParams({})} />
          ) : (
            <>
              <LoginForm />
              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Don't have an account yet?{' '}
                  <Link
                    to="/register"
                    className="font-bold text-brand-600 hover:text-brand-500 dark:text-brand-400"
                  >
                    Create account
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
