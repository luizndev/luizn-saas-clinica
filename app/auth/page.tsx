import React from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import FieldDescriptionComponent from './_components/field-description';
import LoginForm from './_components/login-form';
import RegisterForm from './_components/register-form';

const page = () => {
  return (
    <div className='flex h-screen w-screen items-center justify-center'>
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
  )
}

export default page