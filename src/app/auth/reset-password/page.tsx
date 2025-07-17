'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { gql, useMutation } from '@apollo/client';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Import UI components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';

// Define GraphQL mutation
const RESET_PASSWORD = gql`
  mutation ResetPassword($token: String!, $newPassword: String!) {
    resetPassword(token: $token, newPassword: $newPassword) {
      message
    }
  }
`;

// Form validation schema
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must include uppercase, lowercase, number and special character'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [resetPassword, { loading, error, data }] = useMutation(RESET_PASSWORD);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    // Validate token exists
    if (!token) {
      setServerError('Invalid or missing reset token');
    }
  }, [token]);

  const onSubmit = async (values: ResetPasswordFormValues) => {
    try {
      if (!token) {
        setServerError('Invalid or missing reset token');
        return;
      }

      console.log('Submitting reset password with:', {
        token,
        passwordLength: values.password?.length,
        hasPassword: !!values.password
      });

      const result = await resetPassword({
        variables: {
          token,
          newPassword: values.password,
        },
      });

      console.log('Reset password result:', result);

      if (result.data?.resetPassword) {
        setSuccess(true);
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      }
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (success) {
    return (
      <div className="max-w-md w-full mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Password Reset Successful</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Your password has been successfully reset. You will be redirected to the login page shortly.
            </p>
          </div>
          <Button
            className="w-full"
            onClick={() => router.push('/auth/login')}
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reset Your Password</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Enter your new password below
          </p>
        </div>

        {(serverError || error) && (
          <Alert variant="destructive" className="mb-6">
            {serverError || error?.message || 'An error occurred'}
          </Alert>
        )}

        {!token ? (
          <Alert variant="destructive" className="mb-6">
            Invalid or missing reset token. Please request a new password reset link.
          </Alert>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !token}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/auth/login')}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
