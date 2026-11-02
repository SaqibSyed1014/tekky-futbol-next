'use client';

import Link from 'next/link';
import { AsphaltGrid, BlueprintNodes, PlayerSilhouette } from './TicketArt';
import './tickets.css';

/**
 * Ticketing hub chrome (roadmap §5). One shell, three palettes:
 *   north → matte black, cold white type, royal-blue rules, player watermark
 *   south → off-white, stark black keylines, asphalt-grid wireframe
 *   hub   → gunmetal steel utility bridge, blueprint node graphic
 * Every theme carries the same four artwork layers (base, hero graphic, rule,
 * ticket frame) — well under the Season Finale's density.
 */

const PASS_TABS = [
  { key: 'north', href: '/tickets/north-division', index: '01', label: 'North Division' },
  { key: 'south', href: '/tickets/south-division', index: '02', label: 'South Division' },
  { key: 'league', href: '/tickets/league-passes', index: '03', label: 'League Passes' },
];

const HERO_ART = {
  north: PlayerSilhouette,
  south: AsphaltGrid,
  hub: BlueprintNodes,
};

export function TicketRule() {
  return (
    <div className="tkt-rule" aria-hidden="true">
      <span />
    </div>
  );
}

export function PassTabs({ active }) {
  return (
    <div className="tkt-tabs" role="navigation" aria-label="Pass types">
      {PASS_TABS.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          className={`tkt-tab tkt-tab--${tab.key === 'league' ? 'hub' : tab.key}${active === tab.key ? ' is-active' : ''}`}
          aria-current={active === tab.key ? 'page' : undefined}
        >
          <span className="tkt-tab__index">{tab.index}</span>
          <span className="tkt-tab__label">{tab.label}</span>
        </Link>
      ))}
    </div>
  );
}

export default function TicketPageShell({ theme, active, eyebrow, title, subtitle, children }) {
  const Art = HERO_ART[theme];

  return (
    <div className={`tkt-page tkt-page--${theme}`}>
      <header className="tkt-hero">
        <Art className={`tkt-art tkt-art--${theme}`} />
        <div className="tkt-hero__inner">
          {eyebrow && <p className="tkt-tag tkt-hero__eyebrow">{eyebrow}</p>}
          <div className="tkt-hero__plate">
            <h1>{title}</h1>
          </div>
          <p className="tkt-hero__tagline">For Ballers Who Create</p>
          {subtitle && <p className="tkt-hero__sub">{subtitle}</p>}
        </div>
      </header>

      <main className="tkt-main">
        {active !== 'hub' && <PassTabs active={active} />}
        {children}
      </main>
    </div>
  );
}
