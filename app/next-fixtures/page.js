import NextFixturesClient from './NextFixturesClient';

export const metadata = {
  title: 'Next Fixtures — TekkyFutbol',
  description: 'Upcoming fixtures for the TekkyFutbol Men\'s division across North and South.',
};

export default function NextFixturesPage() {
  return <NextFixturesClient />;
}
