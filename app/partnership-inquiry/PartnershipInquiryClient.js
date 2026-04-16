'use client';

import { useState } from 'react';
import Link from 'next/link';
import GlowDivider from '@/components/ui/GlowDivider';
import Modal from '@/components/ui/Modal';
import { useWeb3Form } from '@/components/ui/useWeb3Form';

const ACCESS_KEY = '36a9ceb5-dbb8-47b1-a857-ef2629facffa';

export default function PartnershipInquiryClient() {
  const { submitting, handleSubmit } = useWeb3Form();
  const [fields, setFields] = useState({
    name: '', brandName: '', email: '', website: '', interest: '', budgetRange: '', message: '', timeline: '',
  });
  const [scopes, setScopes] = useState([]);
  const [success, setSuccess] = useState(false);

  function set(k) { return (e) => setFields((f) => ({ ...f, [k]: e.target.value })); }
  function toggleScope(val) {
    setScopes((prev) => prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]);
  }

  function onSubmit(e) {
    handleSubmit(
      e,
      { access_key: ACCESS_KEY, botcheck: '', ...fields, scope: scopes.join(', ') },
      () => {
        setFields({ name: '', brandName: '', email: '', website: '', interest: '', budgetRange: '', message: '', timeline: '' });
        setScopes([]);
        setSuccess(true);
      }
    );
  }

  const scopeOptions = [
    'Live events / activations',
    'Branded kits or merchandise',
    'Digital content / media',
    'On-site presence / signage',
    'Long-term partnership',
  ];

  return (
    <>
      <main style={{ maxWidth: 700, margin: '2.8rem auto 4rem', padding: '0 1.25rem' }}>
        <section style={{ margin: '3rem 0', textAlign: 'center' }}>
          <h2>Partnership Inquiry</h2>

          <form onSubmit={onSubmit}>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" placeholder="Enter your name" value={fields.name} onChange={set('name')} required />

            <label htmlFor="brandName">Company/Brand Name</label>
            <input type="text" id="brandName" placeholder="Enter your company/brand name" value={fields.brandName} onChange={set('brandName')} required />

            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Enter your email" value={fields.email} onChange={set('email')} required />

            <label htmlFor="website">Website Link</label>
            <input type="text" id="website" placeholder="Enter your website link" value={fields.website} onChange={set('website')} required />

            <label htmlFor="interest">What best describes your interest?</label>
            <select id="interest" value={fields.interest} onChange={set('interest')}>
              <option value="" disabled hidden>Select interest</option>
              <option>Brand / Product Collaboration</option>
              <option>Event or Venue Partnership</option>
              <option>Sponsorship Opportunity</option>
              <option>Creative / Media Collaboration</option>
              <option>Community or Cultural Partner</option>
              <option>Other</option>
            </select>

            <div style={{ margin: '1rem 0' }}>
              <div style={{ fontWeight: 600, marginBottom: '0.5rem', textAlign: "left" }}>Partnership Scope - Select all that apply</div>
              <div className="checkbox-group">
                {scopeOptions.map((opt) => (
                  <label key={opt} style={{display: 'block', marginBottom: '0.4rem', cursor: 'pointer'}}>
                    <input type="checkbox" checked={scopes.includes(opt)} onChange={() => toggleScope(opt)}
                           style={{marginRight: '0.5rem'}}/>
                    {opt}
                  </label>
                ))}
              </div>
            </div>

            <label htmlFor="budgetRange">Do you have an estimated partnership budget?</label>
            <select id="budgetRange" value={fields.budgetRange} onChange={set('budgetRange')}>
              <option value="" disabled hidden>Select budget range</option>
              <option>Exploring / not defined yet</option>
              <option>Under $2,500</option>
              <option>$2,500 – $7,500</option>
              <option>$7,500 – $15,000</option>
              <option>$15,000+</option>
            </select>

            <label htmlFor="message">Briefly tell us why you&#39;d like to partner with TekkyFutbol (2–4 sentences max)</label>
            <textarea
              id="message"
              placeholder="Tell us why you'd like to partner with TekkyFutbol"
              rows={4}
              value={fields.message}
              onChange={set('message')}
              style={{ width: '100%', padding: '0.8rem', marginBottom: '1.2rem', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(0,116,255,0.4)', borderRadius: 8, color: 'var(--fg)', fontFamily: 'Montserrat, sans-serif', resize: 'vertical' }}
            />

            <label htmlFor="timeline">Timeline</label>
            <select id="timeline" value={fields.timeline} onChange={set('timeline')}>
              <option value="" disabled hidden>Select timeline</option>
              <option>Immediate / upcoming season</option>
              <option>Next 3 months</option>
              <option>Later this year</option>
              <option>Just exploring</option>
            </select>

            <button type="submit" className="cta" style={{ marginTop: '.5rem', display: "inline-block" }} disabled={submitting}>
              {submitting ? <><span className="spinner" />Submitting</> : 'Send Partnership Inquiry'}
            </button>
          </form>
        </section>

        <GlowDivider />
      </main>

      <Modal isOpen={success} onClose={() => setSuccess(false)}>
        <h3>Partnership Inquiry Received</h3>
        <p className="subtext">Thanks for reaching out to TekkyFutbol. We review all partnership inquiries to ensure alignment with our culture, audience, and long-term vision. If there&#39;s a strong fit, our team will follow up with next steps.</p>
        <button className="cta close-overlay" onClick={() => setSuccess(false)}>Back to Partnerships</button>
      </Modal>
    </>
  );
}
