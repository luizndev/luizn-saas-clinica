"use client";

import { useRouter } from 'next/navigation';
import React from 'react'

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';

const SingOutButton = ({ }) => {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push('/auth');
  };

  return (
    <Button onClick={handleSignOut}>Sair</Button>
  )
}

export default SingOutButton