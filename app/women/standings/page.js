import WomenStandingsClient from './WomenStandingsClient';

export const metadata = {
  title: "TekkyFutbol — Women's Standings",
  description: "Women's division standings — North and South tables updated throughout the season.",
};

export default function WomenStandingsPage() {
  return <WomenStandingsClient />;
}
