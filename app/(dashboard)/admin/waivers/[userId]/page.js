import WaiverViewClient from './WaiverViewClient';

export default async function WaiverViewPage({ params }) {
  const { userId } = await params;
  return <WaiverViewClient userId={userId} />;
}
