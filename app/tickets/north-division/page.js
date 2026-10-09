import DivisionTicketsClient from '@/components/tickets/DivisionTicketsClient';

export const metadata = {
  title: 'TekkyFutbol — North Division Match Passes',
  description: 'North Division regular season matchday passes and supporter bundles.',
};

export default function NorthDivisionTicketsPage() {
  return <DivisionTicketsClient division="north" />;
}
