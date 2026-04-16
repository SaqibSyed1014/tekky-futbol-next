'use client';

import { useState } from 'react';
import Link from 'next/link';
import GlowDivider from '@/components/ui/GlowDivider';
import { useWeb3Form } from '@/components/ui/useWeb3Form';

export default function ContactClient() {
  const { submitting, handleSubmit } = useWeb3Form();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [success, setSuccess] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function onSubmit(e) {
    handleSubmit(
      e,
      {
        access_key: 'ef9b49eb-fc9c-495c-86bb-4f2b03096619',
        botcheck: '',
        ...form,
      },
      () => {
        setForm({ name: '', email: '', subject: '', message: '' });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 7000);
      }
    );
  }

  return (
    <>
      <header style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="hero" style={{ position: 'relative', zIndex: 2, maxWidth: 980, padding: '0 1rem' }}>
          <h1>CONTACT TEKKYFUTBOL</h1>
          <p className="tagline">For Ballers Who Create</p>
          <p className="subtext">Reach out for sponsorships, media, or player inquiries.</p>
        </div>
      </header>

      <main style={{ maxWidth: 800, margin: '3rem auto 4rem', padding: '0 1.25rem', textAlign: 'center' }}>
        <GlowDivider />

        <section id="contact-form">
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", color: 'var(--tekky-blue)', fontSize: '2rem', marginBottom: '1rem' }}>
            Send a Message
          </h2>

          <form
            onSubmit={onSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              background: 'rgba(0,0,0,0.4)',
              padding: '2rem',
              border: '1px solid rgba(0,116,255,0.3)',
              borderRadius: 16,
              boxShadow: '0 0 20px rgba(0,116,255,0.15)',
            }}
          >
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={form.subject}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              required
              style={{ resize: 'vertical', minHeight: 120 }}
            />
            <button type="submit" className="cta un-focused" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="spinner" />
                  Submitting
                </>
              ) : (
                'Send Message'
              )}
            </button>

            {success && (
              <div style={{ color: 'var(--tekky-blue)', fontWeight: 600, marginTop: '1rem', textShadow: '0 0 8px var(--tekky-blue)' }}>
                <span>✅</span> Your message has been sent!
              </div>
            )}
          </form>
        </section>

        <GlowDivider />

        <section id="contact-info" style={{ marginTop: '2rem' }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", color: 'var(--tekky-blue)', fontSize: '2rem', marginBottom: '1rem' }}>
            Direct Contact
          </h2>
          <p style={{ margin: '0.4rem 0' }}>
            <i className="fas fa-envelope"></i> tekkyfutbol@gmail.com
          </p>
          <p style={{ margin: '0.4rem 0' }}>
            <i className="fas fa-map-marker-alt"></i> Chicago, IL (Based)
          </p>
          <div className="social">
            <a href="https://instagram.com/tekkyfutbol" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://x.com/TekkyFutbol" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-x-twitter"></i>
            </a>
          </div>
        </section>

        <GlowDivider />

        <section id="cta">
          <div className="sec-cta">
            <Link className="cta" href="/registration">Register Your Squad</Link>
            <Link className="cta" href="/partners">View Partners</Link>
            <Link className="cta" href="/">Back to Home</Link>
          </div>
        </section>
      </main>
    </>
  );
}
