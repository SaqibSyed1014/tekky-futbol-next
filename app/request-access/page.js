import RequestAccessClient from './RequestAccessClient';

export const metadata = {
  title: 'TekkyFutbol Shop — Request Access',
  description: 'Request access to the TekkyFutbol player portal. Approved players and coaches only.',
};

export default function RequestAccessPage() {
  return <RequestAccessClient />;
}
