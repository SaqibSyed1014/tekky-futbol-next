'use client';

import { useState } from 'react';
import GlowDivider from '@/components/ui/GlowDivider';
import Link from 'next/link';

export default function RequestAccessPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [team, setTeam] = useState('');
  const [coach, setCoach] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      <header style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="hero" style={{ position: 'relative', zIndex: 2, maxWidth: 980, padding: '0 1rem' }}>
          <h1>REQUEST ACCESS</h1>
          <p className="tagline">For Ballers Who Create</p>
          <p className="subtext">Submit your details to request access to the league portal.</p>
        </div>
      </header>

      <main style={{ maxWidth: 600, margin: '2.8rem auto 4rem', padding: '0 1.25rem', textAlign: 'center' }}>
        <GlowDivider />

        {submitted ? (
          <section style={{ margin: '3rem 0' }}>
            <h2>Request Received</h2>
            <p style={{ margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>
              Your access request has been submitted. The league will follow up with you shortly.
            </p>
            <div className="sec-cta" style={{ marginTop: '2rem' }}>
              <Link className="cta" href="/">Back to Home</Link>
            </div>
          </section>
        ) : (
          <section style={{ margin: '3rem 0' }}>
            <h2>ACCESS REQUEST</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Team Name"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Coach / Manager Name"
                value={coach}
                onChange={(e) => setCoach(e.target.value)}
              />
              <button type="submit" className="cta">Submit Request</button>
            </form>
          </section>
        )}

        <GlowDivider />

        <div className="sec-cta">
          <Link className="cta" href="/registration">Official Registration</Link>
          <Link className="cta" href="/">Back to Home</Link>
        </div>
      </main>
    </>
  );
}
