import DivisionTicketsClient from '@/components/tickets/DivisionTicketsClient';

export const metadata = {
  title: 'TekkyFutbol — South Division Match Passes',
  description: 'South Division regular season matchday passes and supporter bundles.',
};

export default function SouthDivisionTicketsPage() {
  return <DivisionTicketsClient division="south" />;
}
