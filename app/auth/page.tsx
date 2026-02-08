import { CalendarDays } from "lucide-react";
import Image from "next/image";
import React from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import FieldDescriptionComponent from './_components/field-description';
import LoginForm from './_components/login-form';
import RegisterForm from './_components/register-form';

const page = () => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/auth-background.webp"
          alt="Authentication background"
          fill
          className="object-cover dark:brightness-[0.2] dark:grayscale"
          priority
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <CalendarDays className="size-4" />
            </div>
            AgendaFácil
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <Tabs defaultValue="account" className="w-[400px]">
            <TabsList>
              <TabsTrigger value="account">Login</TabsTrigger>
              <TabsTrigger value="register">Registrar</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <LoginForm />
              <FieldDescriptionComponent />
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm />
              <FieldDescriptionComponent />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
    </div>
  )
}

export default page