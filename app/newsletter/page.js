import NewsletterClient from './NewsletterClient';

export const metadata = {
  title: 'TekkyFutbol — Newsletter',
  description: 'Stay in the loop. League updates, match recaps, and culture drops — straight to your inbox.',
};

export default function NewsletterPage() {
  return <NewsletterClient />;
}
