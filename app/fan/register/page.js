import { Suspense } from 'react';
import FanRegisterClient from './FanRegisterClient';

export const metadata = {
  title: 'Fan Sign Up — TekkyFutbol',
  description: 'Create a TekkyFutbol fan account to save your profile, sizes, and orders.',
};

export default function FanRegisterPage() {
  return (
    <Suspense fallback={null}>
      <FanRegisterClient />
    </Suspense>
  );
}
