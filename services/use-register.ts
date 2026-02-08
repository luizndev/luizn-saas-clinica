'use client';

import { useRouter } from 'next/navigation';
import { UseFormReturn } from 'react-hook-form';

import { authClient } from '@/lib/auth-client';

interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const useRegister = (form: UseFormReturn<RegisterData>) => {
  const router = useRouter();

  const register = async (values: RegisterData) => {
    await authClient.signUp.email({
      email: values.email,
      password: values.password,
      name: values.username,
      callbackURL: "/dashboard",
    }, {
      onSuccess: () => {
        form.reset();
        router.push("/dashboard");
      },
      onError: (error) => {
        console.error(error);
      }
    });
  };

  return { register };
};
