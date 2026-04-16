'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Modal from '../ui/Modal';
import { useWeb3Form } from '../ui/useWeb3Form';

/* ─── tiny sub-component: dropdown chevron ─── */
function ChevronDown() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M18.53 9.53a.75.75 0 0 0 0-1.06H5.47a.75.75 0 0 0 0 1.06l6 6a.75.75 0 0 0 1.06 0z"
      />
    </svg>
  );
}

/* ─── sub-component: email-signup form used inside popups ─── */
function SignupForm({ accessKey, buttonLabel, onSuccess, activeFormId, successFormId }) {
  const { submitting, handleSubmit } = useWeb3Form();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  function onSubmit(e) {
    handleSubmit(
      e,
      { access_key: accessKey, botcheck: '', name, email },
      () => {
        setName('');
        setEmail('');
        onSuccess();
      }
    );
  }

  return (
    <form onSubmit={onSubmit} style={{ paddingTop: '1.5rem' }}>
      <input type="hidden" name="access_key" value={accessKey} />
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ padding: '0.6rem' }}
        required
      />
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: '0.6rem' }}
        required
      />
      <button type="submit" className="cta close-overlay" disabled={submitting}>
        {submitting ? (
          <>
            <span className="spinner" />
            Submitting
          </>
        ) : (
          buttonLabel
        )}
      </button>
    </form>
  );
}

/* ─── main Navbar ─── */
export default function Navbar() {
  const pathname = usePathname();

  /* mobile menu state */
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  /* modal states */
  const [hofOpen, setHofOpen] = useState(false);
  const [hofSuccess, setHofSuccess] = useState(false);
  const [teamsOpen, setTeamsOpen] = useState(false);
  const [teamsSuccess, setTeamsSuccess] = useState(false);
  const [partnersOpen, setPartnersOpen] = useState(false);
  const [partnersSuccess, setPartnersSuccess] = useState(false);

  /* close menu on route change */
  useEffect(() => {
    setMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  function toggleMenu() {
    setMenuOpen((prev) => !prev);
    if (menuOpen) setActiveDropdown(null);
  }

  function toggleDropdown(name) {
    setActiveDropdown((prev) => (prev === name ? null : name));
  }

  /* ─── dropdown item: nav link ─── */
  function NavLink({ href, children }) {
    return (
      <li>
        <Link href={href}>{children}</Link>
      </li>
    );
  }

  /* ─── dropdown item: "coming soon" trigger ─── */
  function ComingSoonTrigger({ onClick, children }) {
    return (
      <li>
        <div className="nav-link" onClick={onClick}>
          {children}
        </div>
      </li>
    );
  }

  /* ─── dropdown wrapper ─── */
  function Dropdown({ name, label, children }) {
    const isActive = activeDropdown === name;
    return (
      <li className={`dropdown-menu${isActive ? ' active' : ''}`}>
        <div className="nav-dropdown-trigger" onClick={() => toggleDropdown(name)}>
          <span>{label}</span>
          <ChevronDown />
        </div>
        <div className="nav-links-dropdown">
          <ul>{children}</ul>
        </div>
      </li>
    );
  }

  return (
    <>
      {/* ── nav spacer pushes page content below fixed bar ── */}
      <div id="nav-spacer" />

      <nav style={{ background: menuOpen ? 'black' : undefined }}>
        {/* mobile logo */}
        <Link className="logo logo-mobile" href="/" aria-label="TekkyFutbol Home">
          <Image src="/images/logo.webp" alt="TekkyFutbol Logo" width={70} height={70} />
        </Link>

        {/* hamburger */}
        <button
          type="button"
          className={`menu-toggler${menuOpen ? ' active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          {/* open icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="menu-toggler-open"
          >
            <path d="M3 5h18" />
            <path d="M3 12h18" />
            <path d="M3 19h18" />
          </svg>
          {/* close icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="menu-toggler-close"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        {/* nav links */}
        <div className={`nav-links${menuOpen ? ' active' : ''}`}>
          <ul>
            {/* Shop dropdown */}
            <Dropdown name="shop" label="Shop">
              <NavLink href="/shop/north-division">North Division</NavLink>
              <NavLink href="/shop/south-division">South Division</NavLink>
              <NavLink href="/shop/finale-collection">Finale Collection</NavLink>
              <NavLink href="/shop/signature-drops">Signature Drops</NavLink>
            </Dropdown>

            {/* Schedule dropdown */}
            <Dropdown name="schedule" label="Schedule">
              <NavLink href="/schedule">League Schedule</NavLink>
              <NavLink href="/results">Results</NavLink>
              <NavLink href="/standings">Standings</NavLink>
              <NavLink href="/top-scorers">Top Scorers</NavLink>
              <NavLink href="/next-fixtures">Next Fixtures</NavLink>
            </Dropdown>

            {/* Teams — coming soon */}
            <li>
              <div className="nav-link" onClick={() => setTeamsOpen(true)}>
                Teams
              </div>
            </li>

            {/* About dropdown */}
            <Dropdown name="about" label="About">
              <NavLink href="/about">About TekkyFutbol</NavLink>
              <NavLink href="/staff">Staff &amp; Volunteers</NavLink>
              <ComingSoonTrigger onClick={() => setHofOpen(true)}>Hall of Fame</ComingSoonTrigger>
            </Dropdown>

            <li>
              <Link href="/venues">Venues</Link>
            </li>
            <li>
              <Link href="/season-1-kits">Season 1 Kits</Link>
            </li>

            {/* desktop center logo */}
            <li className="logo-desktop">
              <Link className="logo" href="/" aria-label="TekkyFutbol Home">
                <Image src="/images/logo.webp" alt="TekkyFutbol Logo" width={70} height={70} />
              </Link>
            </li>

            {/* Rules dropdown */}
            <Dropdown name="rules" label="Rules">
              <NavLink href="/rules">Attrition</NavLink>
              <NavLink href="/dominion">Dominion</NavLink>
            </Dropdown>

            {/* Partners dropdown */}
            <Dropdown name="partners" label="Partners">
              <ComingSoonTrigger onClick={() => setPartnersOpen(true)}>
                Official Partners
              </ComingSoonTrigger>
              <NavLink href="/partners">Partner with TekkyFutbol</NavLink>
              <NavLink href="/partnership-inquiry">Partnership Inquiry</NavLink>
              <NavLink href="/partnership-deck">Request partnership deck</NavLink>
            </Dropdown>

            <li>
              <Link href="/registration">Register</Link>
            </li>
            <li>
              <Link href="/season-finale">Finale</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* ═══════════════════════ MODALS ═══════════════════════ */}

      {/* Hall of Fame */}
      <Modal isOpen={hofOpen} onClose={() => { setHofOpen(false); setHofSuccess(false); }}>
        {!hofSuccess ? (
          <>
            <h3>The Hall of Fame Is Coming</h3>
            <p>
              Celebrate the players, moments, and legacy that define TekkyFutbol. Be the first to
              know when the Hall of Fame officially opens.
            </p>
            <SignupForm
              accessKey="6d159077-4c0b-4cb2-bef6-5a866c7a7ab6"
              buttonLabel="Enter the legacy"
              onSuccess={() => { setHofOpen(false); setHofSuccess(true); }}
            />
          </>
        ) : (
          <>
            <h3>You&apos;re Part of the Legacy</h3>
            <p className="subtext">
              You&apos;ll be notified when the Hall of Fame goes live and new inductions are revealed.
            </p>
            <button className="cta close-overlay" onClick={() => setHofSuccess(false)}>
              Explore the League
            </button>
          </>
        )}
      </Modal>

      {/* Hall of Fame success modal */}
      <Modal isOpen={hofSuccess} onClose={() => setHofSuccess(false)}>
        <h3>You&apos;re Part of the Legacy</h3>
        <p className="subtext">
          You&apos;ll be notified when the Hall of Fame goes live and new inductions are revealed.
        </p>
        <button className="cta close-overlay" onClick={() => setHofSuccess(false)}>
          Explore the League
        </button>
      </Modal>

      {/* Teams */}
      <Modal isOpen={teamsOpen} onClose={() => { setTeamsOpen(false); setTeamsSuccess(false); }}>
        {!teamsSuccess ? (
          <>
            <h3>Teams Are Forming</h3>
            <p>
              Registered teams will be revealed before the season begins. Join the list to be
              notified when lineups, names, and rivalries go live.
            </p>
            <SignupForm
              accessKey="25215844-510d-4166-92e9-23a82d7e947f"
              buttonLabel="Notify Me"
              onSuccess={() => { setTeamsOpen(false); setTeamsSuccess(true); }}
            />
          </>
        ) : (
          <>
            <h3>You&apos;re In</h3>
            <p className="subtext">
              You&apos;ll be notified as soon as teams are revealed. This is where the stories begin.
            </p>
            <button className="cta close-overlay" onClick={() => setTeamsSuccess(false)}>
              Explore the League
            </button>
          </>
        )}
      </Modal>

      {/* Teams success */}
      <Modal isOpen={teamsSuccess} onClose={() => setTeamsSuccess(false)}>
        <h3>You&apos;re In</h3>
        <p className="subtext">
          You&apos;ll be notified as soon as teams are revealed. This is where the stories begin.
        </p>
        <button className="cta close-overlay" onClick={() => setTeamsSuccess(false)}>
          Explore the League
        </button>
      </Modal>

      {/* Official Partners */}
      <Modal isOpen={partnersOpen} onClose={() => { setPartnersOpen(false); setPartnersSuccess(false); }}>
        {!partnersSuccess ? (
          <>
            <h3>Official Partners — Coming Soon</h3>
            <p>
              TekkyFutbol partners help power the league experience — from matchday venues and
              performance training to street culture and media production.
            </p>
            <p>Our first official partners will be announced soon.</p>
            <p style={{ marginBottom: '1rem' }}>
              Join the Partner Announcements List to be notified when new brands join the movement.
            </p>
            <SignupForm
              accessKey="f7916cb4-e9e6-4afb-b91b-88b3b6b42d83"
              buttonLabel="Get Partner Updates"
              onSuccess={() => { setPartnersOpen(false); setPartnersSuccess(true); }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
              <small>No spam. Only major partner announcements.</small>
            </div>
          </>
        ) : (
          <>
            <h3>You&apos;re In</h3>
            <p className="subtext">
              You&apos;ll be the first to hear when TekkyFutbol announces its official partners.
            </p>
            <p>The movement is building.</p>
            <button className="cta close-overlay" onClick={() => setPartnersSuccess(false)}>
              Explore the League
            </button>
          </>
        )}
      </Modal>

      {/* Partners success */}
      <Modal isOpen={partnersSuccess} onClose={() => setPartnersSuccess(false)}>
        <h3>You&apos;re In</h3>
        <p className="subtext">
          You&apos;ll be the first to hear when TekkyFutbol announces its official partners.
        </p>
        <p>The movement is building.</p>
        <button className="cta close-overlay" onClick={() => setPartnersSuccess(false)}>
          Explore the League
        </button>
      </Modal>
    </>
  );
}
