import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { registerSchema } from '../../utils/validation';

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm: React.FC = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);
    try {
      await registerUser(data.email, data.password, data.full_name);
      navigate('/dashboard');
    } catch (err: any) {
      setServerError(
        err.response?.data?.error?.message || err.message || 'Registration failed. Please try again.'
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-600 dark:text-rose-400 font-medium">
          {serverError}
        </div>
      )}

      <Input
        label="Full Name"
        type="text"
        placeholder="e.g. Alex Morgan"
        autoComplete="name"
        leftIcon={<User className="w-4 h-4" />}
        error={errors.full_name?.message}
        {...register('full_name')}
      />

      <Input
        label="Email Address"
        type="email"
        placeholder="alex@example.com"
        autoComplete="email"
        leftIcon={<Mail className="w-4 h-4" />}
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Create Password"
        type="password"
        placeholder="At least 6 characters"
        autoComplete="new-password"
        leftIcon={<Lock className="w-4 h-4" />}
        error={errors.password?.message}
        {...register('password')}
      />

      <Button
        type="submit"
        variant="primary"
        className="w-full mt-2"
        isLoading={isSubmitting}
        rightIcon={<ArrowRight className="w-4 h-4" />}
      >
        Create Free Account
      </Button>

      <p className="text-[11px] text-slate-500 text-center leading-normal">
        By registering, you agree to our Terms of Service and Privacy Policy.
      </p>
    </form>
  );
};
