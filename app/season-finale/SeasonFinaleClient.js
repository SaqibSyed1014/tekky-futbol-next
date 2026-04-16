'use client';

import { useState } from 'react';
import Link from 'next/link';
import GlowDivider from '@/components/ui/GlowDivider';
import Modal from '@/components/ui/Modal';
import { useWeb3Form } from '@/components/ui/useWeb3Form';

const SPONSOR_KEY = '67277c57-96c8-4511-83fd-2290f6958d5c';
const ACCESS_KEY = '84ddba4f-238b-4591-ad22-a1951b9e7739';
const FINALE_KEY = '52994049-196c-4c88-8f8c-e50232fc6559';

function SponsorForm({ onSuccess }) {
  const { submitting, handleSubmit } = useWeb3Form();
  const [fields, setFields] = useState({ name: '', brandName: '', email: '', phone: '', website: '', sponsorshipInterest: '', budgetRange: '' });

  function set(k) { return (e) => setFields((f) => ({ ...f, [k]: e.target.value })); }

  function onSubmit(e) {
    handleSubmit(e, { access_key: SPONSOR_KEY, botcheck: '', ...fields }, () => { setFields({ name: '', brandName: '', email: '', phone: '', website: '', sponsorshipInterest: '', budgetRange: '' }); onSuccess(); });
  }

  return (
    <form onSubmit={onSubmit}>
      <input type="text" placeholder="Enter your name" value={fields.name} onChange={set('name')} required />
      <input type="text" placeholder="Enter your company/brand name" value={fields.brandName} onChange={set('brandName')} required />
      <input type="email" placeholder="Enter your email" value={fields.email} onChange={set('email')} required />
      <input type="tel" placeholder="Enter your phone" value={fields.phone} onChange={set('phone')} />
      <input type="text" placeholder="Enter your website/instagram" value={fields.website} onChange={set('website')} required />
      <select value={fields.sponsorshipInterest} onChange={set('sponsorshipInterest')} required>
        <option value="" disabled hidden>Select sponsorship interest</option>
        <option>Event Sponsorship (Season Finale)</option>
        <option>League Sponsorship (Season / Division)</option>
        <option>Content Partnership</option>
        <option>Product / Activation Partnership</option>
        <option>Not Sure (Open to Ideas)</option>
      </select>
      <select value={fields.budgetRange} onChange={set('budgetRange')}>
        <option value="" disabled hidden>Select budget range</option>
        <option>Under $1,000</option>
        <option>$1,000 – $2,500</option>
        <option>$2,500 – $5,000</option>
        <option>$5,000+</option>
        <option>Prefer to discuss</option>
      </select>
      <button type="submit" className="cta close-overlay" disabled={submitting}>
        {submitting ? <><span className="spinner" />Submitting</> : 'Submit Sponsorship Inquiry'}
      </button>
      <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.5rem' }}>All sponsorships are curated to align with TekkyFutbol&#39;s culture and audience.</p>
    </form>
  );
}

function AccessForm({ onSuccess }) {
  const { submitting, handleSubmit } = useWeb3Form();
  const [fields, setFields] = useState({ name: '', email: '', reasonForRequest: '', website: '' });

  function set(k) { return (e) => setFields((f) => ({ ...f, [k]: e.target.value })); }

  function onSubmit(e) {
    handleSubmit(e, { access_key: ACCESS_KEY, botcheck: '', ...fields }, () => { setFields({ name: '', email: '', reasonForRequest: '', website: '' }); onSuccess(); });
  }

  return (
    <form onSubmit={onSubmit}>
      <input type="text" placeholder="Enter your name" value={fields.name} onChange={set('name')} required />
      <input type="email" placeholder="Enter your email" value={fields.email} onChange={set('email')} required />
      <select value={fields.reasonForRequest} onChange={set('reasonForRequest')} required>
        <option value="" disabled hidden>Select your reason for request</option>
        <option value="Player">Player</option>
        <option value="Creator/Media">Creator/Media</option>
        <option value="Brand/partner">Brand/partner</option>
        <option value="Guest">Guest</option>
        <option value="Other">Other</option>
      </select>
      <input type="text" placeholder="Enter your website/instagram" value={fields.website} onChange={set('website')} required />
      <button type="submit" className="cta close-overlay" disabled={submitting}>
        {submitting ? <><span className="spinner" />Submitting</> : 'Request Access'}
      </button>
      <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.5rem' }}>Submitting a request does not guarantee access. Approved guests will receive follow-up details.</p>
    </form>
  );
}

function FinalePartnerForm({ onSuccess }) {
  const { submitting, handleSubmit } = useWeb3Form();
  const [fields, setFields] = useState({ name: '', brandName: '', email: '', website: '', typeOfBrand: '', message: '' });
  const [interests, setInterests] = useState([]);

  function set(k) { return (e) => setFields((f) => ({ ...f, [k]: e.target.value })); }
  function toggleInterest(val) {
    setInterests((prev) => prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]);
  }

  function onSubmit(e) {
    handleSubmit(e, { access_key: FINALE_KEY, botcheck: '', ...fields, interest: interests.join(', ') }, () => {
      setFields({ name: '', brandName: '', email: '', website: '', typeOfBrand: '', message: '' });
      setInterests([]);
      onSuccess();
    });
  }

  const interestOptions = ['Finale Event Visibility', 'Finale Party Activation', 'On-Site Branding', 'Digital / Social Exposure'];

  return (
    <form onSubmit={onSubmit}>
      <input type="text" placeholder="Enter your name" value={fields.name} onChange={set('name')} required />
      <input type="text" placeholder="Enter your company/brand name" value={fields.brandName} onChange={set('brandName')} required />
      <input type="email" placeholder="Enter your email" value={fields.email} onChange={set('email')} required />
      <input type="text" placeholder="Enter your website/instagram" value={fields.website} onChange={set('website')} required />
      <select value={fields.typeOfBrand} onChange={set('typeOfBrand')}>
        <option value="" disabled hidden>Select type of brand</option>
        <option value="Apparel / Fashion">Apparel / Fashion</option>
        <option value="Food & Beverage">Food &amp; Beverage</option>
        <option value="Fitness / Wellness">Fitness / Wellness</option>
        <option value="Media / Creative">Media / Creative</option>
        <option value="Local Business">Local Business</option>
        <option value="Other">Other</option>
      </select>
      <div style={{ textAlign: 'left', margin: '0.8rem 0' }}>
        <p style={{ marginBottom: '0.5rem', fontWeight: 600 }}>What are you interested in?</p>
        {interestOptions.map((opt) => (
          <label key={opt} style={{ display: 'block', marginBottom: '0.3rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={interests.includes(opt)} onChange={() => toggleInterest(opt)} style={{ marginRight: '0.5rem' }} />
            {opt}
          </label>
        ))}
      </div>
      <textarea placeholder="Tell us briefly how you'd like to be involved." value={fields.message} onChange={set('message')} rows={4} style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(0,116,255,0.4)', borderRadius: 8, padding: '0.8rem', color: 'var(--fg)', fontSize: '1rem', width: '100%', resize: 'vertical', minHeight: 120 }} />
      <button type="submit" className="cta close-overlay" disabled={submitting}>
        {submitting ? <><span className="spinner" />Submitting</> : 'Request Finale Partnership'}
      </button>
    </form>
  );
}

export default function SeasonFinaleClient() {
  const [sponsorOpen, setSponsorOpen] = useState(false);
  const [sponsorSuccess, setSponsorSuccess] = useState(false);
  const [accessOpen, setAccessOpen] = useState(false);
  const [accessSuccess, setAccessSuccess] = useState(false);
  const [finaleOpen, setFinaleOpen] = useState(false);
  const [finaleSuccess, setFinaleSuccess] = useState(false);

  return (
    <>
      <header style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="hero" style={{ position: 'relative', zIndex: 2, maxWidth: 980, padding: '0 1rem' }}>
          <h1>SEASON FINALE EXPERIENCE</h1>
          <p className="tagline">For Ballers Who Create</p>
          <p className="subtext">Where Dominion is decided. Champions are crowned.</p>
        </div>
      </header>

      <main className="tight-list-content" style={{ maxWidth: 1080, margin: '2.8rem auto 4rem', padding: '0 1.25rem' }}>
        <GlowDivider />

        <section id="definition" style={{ margin: '3rem 0', textAlign: 'center' }}>
          <h2>THE DEFINING MOMENT</h2>
          <p style={{ color: '#d3d9e3', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>The TekkyFutbol Season Finale concludes Dominion — the elimination phase of the league.</p>
          <p style={{ color: '#d3d9e3', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Only the top teams from each division earn the right to compete on Championship Day.</p>
          <p style={{ color: '#d3d9e3', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>This is where the margins disappear.</p>
          <p style={{ color: '#d3d9e3', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Where structure meets creativity. Where champions are earned.</p>
          <div className="sec-cta">
            <button className="cta" onClick={() => setSponsorOpen(true)}>Become a Sponsor</button>
            <button className="cta" onClick={() => setAccessOpen(true)}>Request Access</button>
          </div>
        </section>

        <GlowDivider />

        <section id="format" style={{ margin: '3rem 0', textAlign: 'center' }}>
          <h2>CHAMPIONSHIP FORMAT</h2>
          <p style={{ color: '#d3d9e3', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>The Dominion playoffs are decided in a single Championship Day.</p>
          <p style={{ color: '#d3d9e3', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Semifinals. Third place. Championship.</p>
          <p style={{ color: '#d3d9e3', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Four matches decide everything.</p>
          <p style={{ color: '#d3d9e3', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Format</p>
          <ul className="bullet-list centered">
            <li>Top 2 teams from North qualify</li>
            <li>Top 2 teams from South qualify</li>
            <li>Single elimination bracket</li>
            <li>Men&#39;s and Women&#39;s champions crowned the same day</li>
            <li>Matches played on an outdoor street championship stage</li>
          </ul>
          <p style={{ color: '#d3d9e3', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>One league. One standard. One final stage.</p>
        </section>

        <GlowDivider />

        <section id="accommodation" style={{ margin: '3rem 0', textAlign: 'center' }}>
          <h2>CHAMPIONSHIP WEEKEND ACCOMMODATION</h2>
          <p style={{ color: '#d3d9e3', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Qualified Dominion players receive complimentary hotel accommodations for Championship Weekend.</p>
          <p style={{ color: '#d3d9e3', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Equal footing. Professional standard. No excuses.</p>
          <p style={{ color: '#d3d9e3', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>The focus stays on performance.</p>
        </section>

        <GlowDivider />

        <section id="location" style={{ margin: '3rem 0', textAlign: 'center' }}>
          <h2>LOCATION</h2>
          <p style={{ color: '#d3d9e3', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Harrison Park (planned) — Street Championship Stage</p>
          <p style={{ color: '#d3d9e3', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>The TekkyFutbol Season Finale is expected to take place at Harrison Park in West Chicago.</p>
          <p style={{ color: '#d3d9e3', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>On Championship Day, the league moves from its structured regular season environment to a true street stage, where the Dominion playoffs determine the season&#39;s champions.</p>
          <p style={{ color: '#d3d9e3', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Semifinals, third place, and the championship final are decided here in one defining day.</p>
          <p style={{ color: '#d3d9e3', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>When the final whistle blows, the court transforms into the official TekkyFutbol Finale Celebration.</p>
        </section>

        <GlowDivider />

        <section id="experience" style={{ margin: '3rem 0', textAlign: 'center' }}>
          <h2>CHAMPIONSHIP DAY EXPERIENCE</h2>
          <p style={{ color: '#d3d9e3', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Championship Day is designed as a street football festival.</p>
          <p style={{ color: '#d3d9e3', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Expect:</p>
          <ul className="bullet-list centered">
            <li>Semifinals, third place match, and championship final</li>
            <li>League awards and trophy ceremony</li>
            <li>Live DJ and curated music</li>
            <li>Professional media capture</li>
            <li>Local food trucks and community atmosphere</li>
            <li>The official TekkyFutbol season celebration</li>
          </ul>
          <p style={{ color: '#d3d9e3', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>The trophy is lifted on the court. The culture is celebrated together.</p>
        </section>

        <GlowDivider />

        <section id="whyItMatters" style={{ margin: '3rem 0', textAlign: 'center' }}>
          <h2>WHY IT MATTERS</h2>
          <p style={{ color: '#d3d9e3', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>The Season Finale represents the highest expression of TekkyFutbol.</p>
          <ul className="bullet-list centered" style={{ margin: "0 auto", display: "inline-block" }}>
            <li>Competitive excellence</li>
            <li>Creative identity</li>
            <li>Community presence</li>
            <li>Cultural relevance</li>
          </ul>
          <p style={{ color: '#d3d9e3', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>For players — it is earned.</p>
          <p style={{ color: '#d3d9e3', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>For partners — it is alignment.</p>
          <p style={{ color: '#d3d9e3', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>For the league — it is the standard.</p>
        </section>

        <GlowDivider />

        <section id="partnerAndBrand" style={{ margin: '3rem 0', textAlign: 'center' }}>
          <h2>PARTNER & SPONSOR OPPORTUNITIES</h2>
          <p style={{ color: '#d3d9e3', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Brands can engage through:</p>
          <ul className="bullet-list centered">
            <li>On-site brand placement</li>
            <li>Sponsored awards or segments</li>
            <li>Digital and social content integration</li>
            <li>Merchandise collaborations</li>
            <li>Experiential activations during Championship Day</li>
          </ul>
          <div className="sec-cta">
            <button className="cta" onClick={() => setFinaleOpen(true)}>PARTNER WITH THE FINALE</button>
          </div>
        </section>

        <GlowDivider />

        <section id="requestAccess" style={{ margin: '3rem 0', textAlign: 'center' }}>
          <h2>REQUEST ACCESS</h2>
          <p style={{ color: '#d3d9e3', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Interested in attending or collaborating?</p>
          <p style={{ color: '#d3d9e3', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Access to the TekkyFutbol Season Finale Experience is limited.</p>
          <p style={{ color: '#d3d9e3', margin: '0.6rem auto', maxWidth: '70ch', lineHeight: 1.8 }}>Attendance is confirmed in advance to preserve the atmosphere of Championship Day.</p>
          <div className="sec-cta">
            <button className="cta" onClick={() => setAccessOpen(true)}>REQUEST ACCESS</button>
          </div>
        </section>

        <GlowDivider />

        <div className="sec-cta">
          <button className="cta" onClick={() => setSponsorOpen(true)}>Become a Sponsor</button>
          <Link className="cta" href="/registration">JOIN THE LEAGUE</Link>
        </div>
      </main>

      {/* Sponsor Modal */}
      <Modal isOpen={sponsorOpen && !sponsorSuccess} onClose={() => setSponsorOpen(false)}>
        <h3>Become a Sponsor</h3>
        <p className="subtext">Partner with the Season Finale and the culture behind TekkyFutbol.</p>
        <SponsorForm onSuccess={() => { setSponsorOpen(false); setSponsorSuccess(true); }} />
      </Modal>
      <Modal isOpen={sponsorSuccess} onClose={() => setSponsorSuccess(false)}>
        <h3>Sponsorship Inquiry Received</h3>
        <p className="subtext">Thanks for your interest in partnering with TekkyFutbol. Our team will review your inquiry and follow up with next steps if there&#39;s alignment.</p>
        <button className="cta close-overlay" onClick={() => setSponsorSuccess(false)}>Back to Season Finale</button>
      </Modal>

      {/* Access Modal */}
      <Modal isOpen={accessOpen && !accessSuccess} onClose={() => setAccessOpen(false)}>
        <h3>Request Access</h3>
        <p className="subtext">This is a curated event. Submit your request to be considered.</p>
        <AccessForm onSuccess={() => { setAccessOpen(false); setAccessSuccess(true); }} />
      </Modal>
      <Modal isOpen={accessSuccess} onClose={() => setAccessSuccess(false)}>
        <h3>Request Received</h3>
        <p className="subtext">Thanks for your interest in the TekkyFutbol Season Finale. This is a curated event. Approved guests will receive follow-up details closer to the event.</p>
        <button className="cta close-overlay" onClick={() => setAccessSuccess(false)}>Back to Season Finale</button>
      </Modal>

      {/* Partner with Finale Modal */}
      <Modal isOpen={finaleOpen && !finaleSuccess} onClose={() => setFinaleOpen(false)}>
        <h3>Partner With the Finale</h3>
        <p className="subtext">The championship moment of TekkyFutbol. Limited brand placements for the most visible night of the season.</p>
        <GlowDivider />
        <p className="subtext">The TekkyFutbol Finale is more than a match — it&#39;s a cultural moment combining competition, celebration, and media coverage.</p>
        <p className="subtext">Finale partners receive premium visibility across the championship match, finale party, and official league content.</p>
        <FinalePartnerForm onSuccess={() => { setFinaleOpen(false); setFinaleSuccess(true); }} />
      </Modal>
      <Modal isOpen={finaleSuccess} onClose={() => setFinaleSuccess(false)}>
        <h3>Request Received</h3>
        <p className="subtext">Finale sponsorship placements are limited. Our team will review your inquiry and follow up shortly.</p>
        <button className="cta close-overlay" onClick={() => setFinaleSuccess(false)}>View the Finale</button>
      </Modal>
    </>
  );
}
