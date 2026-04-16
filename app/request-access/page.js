import RequestAccessClient from './RequestAccessClient';

export const metadata = {
  title: 'Request Access — TekkyFutbol',
  description: 'Request access to the TekkyFutbol player portal. Approved players and coaches only.',
};

export default function RequestAccessPage() {
  return <RequestAccessClient />;
}
