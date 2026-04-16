import WomenStandingsClient from './WomenStandingsClient';

export const metadata = {
  title: "Women's Standings — TekkyFutbol",
  description: "Women's division standings — North and South tables updated throughout the season.",
};

export default function WomenStandingsPage() {
  return <WomenStandingsClient />;
}
