import JoinPageClient from './JoinPageClient';

export const metadata = { title: 'Join Team — TekkyFutbol' };

export default function JoinPage({ params }) {
  return <JoinPageClient token={params.token} />;
}
