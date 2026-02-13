'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import React from 'react'
import { useForm } from 'react-hook-form';
import { FcGoogle } from "react-icons/fc";
import z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { authClient } from '@/lib/auth-client';
import { useLogin } from '@/services/use-login';

const loginSchema = z.object({
  email: z.string().trim().min(1, {message: "Email é obrigatório"}).email({message: "Email inválido"}),
  password: z.string().trim().min(1, {message: "Senha é obrigatória"}),
});

const LoginForm = () => {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { login } = useLogin(form);

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    await login(values);
  }


  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
  };


  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Seja bem-vindo(a), a AgendaFácil!</CardTitle>
        <CardDescription>
          Faça login na sua conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Button variant="outline" type="button" className="w-full" onClick={handleGoogleLogin}>
                <FcGoogle size={20} />
                Login com Google
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-2 text-muted-foreground">
                  Ou continue com
                </span>
              </div>
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Insira seu email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Senha</FormLabel>
                    <a
                      href="#"
                      className="text-sm underline-offset-4 hover:underline text-muted-foreground"
                    >
                      Esqueceu sua senha?
                    </a>
                  </div>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (<Loader2 className="mr-2 h-4 w-4 animate-spin" />) : "Entrar"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default LoginForm