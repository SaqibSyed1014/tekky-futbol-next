import NewsletterClient from './NewsletterClient';

export const metadata = {
  title: 'Newsletter — TekkyFutbol',
  description: 'Stay in the loop. League updates, match recaps, and culture drops — straight to your inbox.',
};

export default function NewsletterPage() {
  return <NewsletterClient />;
}
