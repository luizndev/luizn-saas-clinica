'use client';

import { useRouter } from 'next/navigation';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

import { authClient } from '@/lib/auth-client';

interface LoginData {
  email: string;
  password: string;
}

export const useLogin = (form: UseFormReturn<LoginData>) => {
  const router = useRouter();

  const login = async (values: LoginData) => {
    await authClient.signIn.email({
      email: values.email,
      password: values.password,
      callbackURL: "/dashboard",
    }, {
      onSuccess: () => {
        form.reset();
        router.push("/dashboard");
      },
      onError: (error) => {
        console.error(error);
        toast.error("Email ou senha invalidos")
      }
    });
  };

  return { login };
};
