import { Suspense } from 'react';
import LoginClient from './LoginClient';

export const metadata = {
  title: 'Login — TekkyFutbol',
  description: 'Sign in to your TekkyFutbol account — player, captain, admin, or fan.',
};

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginClient />
    </Suspense>
  );
}
