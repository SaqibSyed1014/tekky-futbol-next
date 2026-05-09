import JoinPageClient from './JoinPageClient';

export const metadata = { title: 'Join Team — TekkyFutbol' };

export default async function JoinPage({ params }) {
  const { token } = await params;
  return <JoinPageClient token={token} />;
}
