import StandingsClient from './StandingsClient';

export const metadata = {
  title: 'TekkyFutbol — Standings',
  description: 'Men\'s division standings — North and South tables updated throughout the season.',
};

export default function StandingsPage() {
  return <StandingsClient />;
}
