import { authClient } from '@/lib/auth-client';

async function SingOutButton() {
  await authClient.signOut();
  window.location.href = '/auth';
}

export default SingOutButton