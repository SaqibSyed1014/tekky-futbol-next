import Link from 'next/link';
import TicketPageShell, { TicketRule } from '@/components/tickets/TicketPageShell';
import { AsphaltGrid, BlueprintNodes, PlayerSilhouette } from '@/components/tickets/TicketArt';

export const metadata = {
  title: 'TekkyFutbol — Match Passes',
  description: 'North Division, South Division, and League match passes.',
};

const CHOICES = [
  {
    key: 'north',
    href: '/tickets/north-division',
    index: '01',
    tag: 'Matte black',
    title: 'North Division',
    description: 'Single Match Passes and Supporter Bundles for North Division fixtures.',
    Art: PlayerSilhouette,
  },
  {
    key: 'south',
    href: '/tickets/south-division',
    index: '02',
    tag: 'Off-white',
    title: 'South Division',
    description: 'Single Match Passes and Supporter Bundles for South Division fixtures.',
    Art: AsphaltGrid,
  },
  {
    key: 'hub',
    href: '/tickets/league-passes',
    index: '03',
    tag: 'Gunmetal',
    title: 'League Passes',
    description: 'Season Access, Playoff, and Finale Celebration passes.',
    Art: BlueprintNodes,
  },
];

const STEPS = [
  { title: 'Choose your pass', body: 'Pick a division match pass, a supporter bundle, or a league-wide pass.' },
  { title: 'Pay securely', body: 'Checkout with Stripe. Your pass is issued the moment payment clears.' },
  { title: 'Scan at the gate', body: 'Your QR lands in your Wallet and inbox. Security scans it at the perimeter.' },
];

export default function TicketsPage() {
  return (
    <TicketPageShell
      theme="hub"
      active="hub"
      eyebrow="Ticketing Hub // 3 Pass Types"
      title="MATCH PASSES"
      subtitle="Get in the stands. Feel the game live."
    >
      <section className="tkt-dest-grid" aria-label="Pass types">
        {CHOICES.map(({ key, href, index, tag, title, description, Art }) => (
          <Link key={key} href={href} className={`tkt-dest tkt-dest--${key}`}>
            <Art className={`tkt-art tkt-art--card-${key}`} />
            <p className="tkt-tag">{`${index} // ${tag}`}</p>
            <h2>{title}</h2>
            <p className="tkt-dest__desc">{description}</p>
            <span className="tkt-dest__go">
              View passes <i className="fa-solid fa-arrow-right-long" aria-hidden="true" />
            </span>
          </Link>
        ))}
      </section>

      <TicketRule />

      <section className="tkt-info" aria-label="How passes work">
        {STEPS.map((step, i) => (
          <div className="tkt-info__card" key={step.title}>
            <p className="tkt-tag">Step {String(i + 1).padStart(2, '0')}</p>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </div>
        ))}
      </section>
    </TicketPageShell>
  );
}
