'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Eye as EyeIcon, EyeOff as EyeOffIcon, Loader2 as Loader2Icon } from 'lucide-react';

import InputErrorMsg from '@/components/auth/InputErrorMsg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { cn } from '@/lib/utils';
import { loginValidator } from '@/lib/validation';
import { useAuthStore } from '@/stores/authStore';
import type { ValidationError } from '@/types/validation';
import type { LoginCredentials } from '@/types/auth';

export function LoginForm() {
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { login, isLoading, error } = useAuthStore();

  const handleInputChange = (field: keyof LoginCredentials, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Clear field-specific errors as user types.
    setErrors((prev) => prev.filter((error) => error.field !== field));
  };

  const emailError = useMemo(() => {
    return errors.find((error) => error.field === 'email')?.message;
  }, [errors]);
  const passwordError = useMemo(() => {
    return errors.find((error) => error.field === 'password')?.message;
  }, [errors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form.
    const errors = loginValidator.validate(formData);
    if (errors.length > 0) {
      setErrors(errors);
      return;
    }

    setErrors([]);
    await login(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="bg-black/70 border-gray-800 backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-white text-center">
            Sign In
          </CardTitle>
          <CardDescription className="text-gray-300 text-center">
            Enter your email and password to access MyFlix
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={cn(
                  'bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-primary focus-visible:ring-0',
                  emailError && 'border-red-500',
                )}
                disabled={isLoading}
              />
              <AnimatePresence>
                <InputErrorMsg key={emailError} error={emailError} />
              </AnimatePresence>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={cn(
                    'bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-primary focus-visible:ring-0 pr-10',
                    passwordError && 'border-red-500'
                  )}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              <AnimatePresence>
                <InputErrorMsg key={passwordError} error={passwordError} />
              </AnimatePresence>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 rounded-md bg-red-500/10 border border-red-500/30"
              >
                <p className="text-sm text-red-400">{error}</p>
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full font-semibold h-12"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
