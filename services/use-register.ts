'use client';

import { useRouter } from 'next/navigation';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

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
        if (error.error.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") {
          toast.error("Email já cadastrado");
        }
      }
    });
  };

  return { register };
};
