import Image from "next/image";
import React from 'react'

import { ModeToggle } from "@/components/mode-toggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import FieldDescriptionComponent from './_components/field-description';
import LoginForm from './_components/login-form';
import RegisterForm from './_components/register-form';
import Shaders from './_components/shaders';

const page = () => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2 relative">
      <div className="absolute top-4 right-4 z-50 lg:right-4 lg:top-4">
        <ModeToggle />
      </div>
      <div className="bg-primary relative flex items-center justify-center overflow-hidden">
        <Shaders />
        <Image
          src="/agendafacil-white.svg"
          alt="Authentication background"
          width={350}
          height={350}
          className="relative z-10"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
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