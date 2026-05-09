import { Suspense } from 'react';
import RegisterViaInviteClient from './RegisterViaInviteClient';

export const metadata = { title: 'Join Team — TekkyFutbol' };

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterViaInviteClient />
    </Suspense>
  );
}
