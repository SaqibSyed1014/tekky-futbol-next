'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getAdminWaiverDetail } from '@/services/waiverApi';

// ─── Clause text ──────────────────────────────────────────────────────────────

const CLAUSES = [
  {
    key: 'voluntary_participation',
    text: 'I understand that I am under no compulsion to participate in the Activities, that my participation is voluntary, and that I am free to forgo participation in the Activities and/or find an alternate service provider if I disagree with the terms contained in this Agreement.',
  },
  {
    key: 'strenuous_activities',
    text: 'I understand that the Activities may be physically strenuous and involve potentially hazardous activities associated with athletic contests or otherwise, and I am voluntarily participating with full knowledge that my participation involves risks, dangers and hazards. I freely accept and fully assume all such risks, dangers and hazards—including, without limitation, the possibility of personal injury, mental injury, property damage, financial loss or death.',
  },
  {
    key: 'athletic_hazards',
    text: 'I understand that athletic contests are potentially hazardous activities with certain inherent risks, including but not limited to: soft tissue injuries, broken bones, fractures, dislocations, bruises, sprains, tears, injuries to head/spine, tendinitis/bursitis and death. Further to the foregoing, I understand that I am solely responsible for taking all precautions necessary to ensure my health and safety during any participation in the Activities.',
  },
  {
    key: 'unforeseeable_risks',
    text: 'I understand that while some of the risks and hazards involved in athletic contests are clearly foreseeable, others are not.',
  },
  {
    key: 'no_implied_warranties',
    text: 'I understand that, except to the extent that they are expressly set forth herein, no conditions, warranties or other terms shall apply to the Activities (i.e., there are no implied terms as to satisfactory quality, fitness for particular purpose, conformance with description or otherwise).',
  },
  {
    key: 'no_lawsuit',
    text: 'Neither I nor my heirs, executors, legal representative(s), or anyone claiming through me or on my behalf will sue or make any other claims or demands of any kind whatsoever against Company, the owners, officers, directors, employees, contractors and agents of Company, or any facility utilized by Company for the Activities (collectively, the "Released Parties") for any personal injury, property damage, loss or death, whether caused or contributed to by any of the Released Parties or otherwise.',
  },
  {
    key: 'release_of_liability',
    text: 'To the maximum extent permitted by applicable law, I hereby release and agree to hold the Released Parties harmless from and against any and all claims, demands, actions, damages, liabilities, losses, costs and expenses (including, without limitation, court costs and reasonable attorney\'s fees) in any way arising out of or related to my participation in the Activities, including without limitation, any and all claims, demands and actions for any injury, loss, damage or death, regardless of whether such injury, loss, damage or death was caused or contributed to by any of the Released Parties.',
  },
  {
    key: 'no_medical_personnel',
    text: 'I understand that the Released Parties are not medical personnel, may make no medical judgments, may not give any medical advice, and may not provide any medical care or treatment, and that I should look solely to my own medical professionals (or, as may be necessary and appropriate, emergency medical personnel) for any medical judgments, advice, care or treatment.',
  },
  {
    key: 'medical_consultation',
    text: 'I certify that I have consulted with my own medical professionals with respect to any past or present injury, illness or any other physical or mental condition of any kind whatsoever that may affect my ability to participate in the Activities.',
  },
  {
    key: 'identity_likeness_grant',
    text: 'FOR GOOD AND VALUABLE CONSIDERATION, the receipt and sufficiency of which I acknowledge, I hereby grant Company and Company\'s licensees, successors and assigns a perpetual, royalty-free right and permission to use my identity and likeness as may be recorded or otherwise captured by Company in connection with my participation in the Activities (collectively, my "Identity") throughout the universe in connection with the advertising and promotion of Company.',
  },
  {
    key: 'liability_limitation',
    text: 'Subject to the foregoing provisions, I understand that Company\'s total liability arising from or in connection with my participation in the Activities shall be limited to the fees I paid for the particular activity from which a dispute has arisen. This Agreement is made in accordance with the laws and decisions of the State of Illinois.',
  },
];

// ─── Styles ───────────────────────────────────────────────────────────────────

const S = {
  page: {
    minHeight:  '100vh',
    background: '#030303',
    color:      '#e2e8f3',
    fontFamily: "'Montserrat', sans-serif",
    padding:    '2rem 1rem 4rem',
  },
  wrap:      { maxWidth: 800, margin: '0 auto' },
  card: {
    background:   'rgba(0,0,0,0.45)',
    border:       '1px solid rgba(0,116,255,0.18)',
    borderRadius: 12,
    overflow:     'hidden',
    marginBottom: '1.5rem',
  },
  cardPad:   { padding: '1.75rem' },
  grid: {
    display:             'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap:                 '1rem',
  },
  label: {
    display:       'block',
    fontSize:      '0.73rem',
    color:         'var(--muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight:    600,
    marginBottom:  '0.4rem',
  },
  input: {
    width:        '100%',
    padding:      '0.65rem 0.9rem',
    background:   'rgba(255,255,255,0.03)',
    border:       '1px solid rgba(0,116,255,0.2)',
    borderRadius: 8,
    color:        'var(--muted)',
    fontSize:     '0.9rem',
    fontFamily:   'inherit',
    outline:      'none',
    boxSizing:    'border-box',
    lineHeight:   1.5,
    cursor:       'default',
    opacity:      0.85,
  },
  inputSig: {
    width:        '100%',
    padding:      '0.5rem 0.9rem',
    background:   'rgba(0,116,255,0.04)',
    border:       '1px solid rgba(0,116,255,0.35)',
    borderRadius: 8,
    color:        '#c8d8f8',
    fontSize:     '1.4rem',
    fontFamily:   "'Dancing Script', 'Brush Script MT', cursive",
    outline:      'none',
    boxSizing:    'border-box',
    lineHeight:   1.5,
    cursor:       'default',
    opacity:      0.85,
  },
  sectionHead: {
    fontFamily:    "'Bebas Neue', sans-serif",
    fontSize:      '0.95rem',
    color:         'var(--tekky-blue)',
    letterSpacing: '1.5px',
    margin:        0,
  },
  prose: {
    margin:     0,
    fontSize:   '0.84rem',
    color:      'var(--muted)',
    lineHeight: 1.75,
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function CardSection({ title, children }) {
  return (
    <div style={S.card}>
      <div style={{
        padding:      '0.9rem 1.75rem',
        borderBottom: '1px solid rgba(0,116,255,0.12)',
        background:   'rgba(0,116,255,0.03)',
      }}>
        <p style={S.sectionHead}>{title}</p>
      </div>
      <div style={S.cardPad}>{children}</div>
    </div>
  );
}

function Field({ label, value, fullWidth, signature }) {
  return (
    <div style={fullWidth ? { gridColumn: '1 / -1' } : {}}>
      <label style={S.label}>{label}</label>
      <input readOnly disabled value={value || ''} style={signature ? S.inputSig : S.input} />
    </div>
  );
}

function FieldTA({ label, value }) {
  return (
    <div style={{ gridColumn: '1 / -1' }}>
      <label style={S.label}>{label}</label>
      <textarea readOnly disabled value={value || ''} rows={3}
        style={{ ...S.input, resize: 'none', width: '100%' }} />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function WaiverViewClient({ userId }) {
  const [waiver,  setWaiver]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    getAdminWaiverDetail(userId)
      .then(setWaiver)
      .catch((err) => setError(err.message || 'Failed to load waiver.'))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
      </div>
    );
  }

  if (error || !waiver) {
    return (
      <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          textAlign: 'center', background: 'rgba(255,60,60,0.08)',
          border: '1px solid rgba(255,60,60,0.25)', borderRadius: 12,
          padding: '2rem 2.5rem',
        }}>
          <i className="fa-solid fa-triangle-exclamation"
            style={{ fontSize: '2rem', color: '#ff6b6b', marginBottom: '0.75rem', display: 'block' }} />
          <p style={{ color: '#ff6b6b', margin: 0 }}>{error || 'Waiver not found.'}</p>
        </div>
      </div>
    );
  }

  const signedDate = new Date(waiver.signed_at).toLocaleString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  // Format a YYYY-MM-DD date string without timezone drift
  const fmtDOB = (d) =>
    d ? new Date(`${d}T12:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';

  const guardianTypeLabel =
    waiver.guardian_type === 'parent' ? 'Parent' :
    waiver.guardian_type === 'legal_guardian' ? 'Legal Guardian' :
    waiver.guardian_type || '—';

  return (
    <div style={S.page}>
      <div style={S.wrap}>

        {/* Logo + title */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
          <Image src="/images/logo.webp" alt="TekkyFutbol Logo" width={70} height={70} />
          <p style={{
            fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem',
            letterSpacing: '3px', color: 'var(--fg)', margin: '0.5rem 0 0.25rem', textAlign: 'center',
          }}>
            TekkyFutbol
          </p>
          <p style={{
            fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem',
            letterSpacing: '2px', color: 'var(--muted)', margin: 0,
          }}>
            Participant Waiver &amp; Release — Signed Copy
          </p>
        </div>

        {/* Audit badge */}
        <div style={{
          display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem 1.5rem',
          background: 'rgba(0,200,100,0.05)', border: '1px solid rgba(0,200,100,0.2)',
          borderRadius: 8, padding: '0.75rem 1.1rem', marginBottom: '1.75rem',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', color: '#00c864', fontWeight: 600 }}>
            <i className="fa-solid fa-circle-check" /> Signed
          </span>
          <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
            <strong style={{ color: 'var(--fg)' }}>{waiver.user_name || waiver.user_email}</strong>
            {' · '}{signedDate}
          </span>
        </div>

        {/* Participant Information */}
        <CardSection title="Participant Information">
          <div style={S.grid}>
            <Field label="Full Name"     value={waiver.user_name} />
            <Field label="Email"         value={waiver.user_email} />
            <Field label="Phone"         value={waiver.participant_phone || waiver.user_phone} />
            <Field label="Date of Birth" value={fmtDOB(waiver.date_of_birth)} />
            <FieldTA label="Address"     value={waiver.address} />
            <FieldTA label="Medical Conditions / Allergies" value={waiver.medical_conditions} />
          </div>
        </CardSection>

        {/* Emergency Contact */}
        <CardSection title="Emergency Contact">
          <div style={S.grid}>
            <Field label="Contact Name"  value={waiver.emergency_contact_name} />
            <Field label="Relationship"  value={waiver.emergency_contact_rel} />
            <Field label="Contact Phone" value={waiver.emergency_contact_phone} fullWidth />
          </div>
        </CardSection>

        {/* Age Group */}
        <CardSection title="Age Group">
          <div style={{ display: 'flex', gap: '1rem' }}>
            {['adult', 'minor'].map((opt) => {
              const selected = opt === (waiver.is_minor ? 'minor' : 'adult');
              return (
                <div key={opt} style={{
                  flex: 1, padding: '1rem', borderRadius: 10,
                  border: `2px solid ${selected ? 'rgba(0,116,255,0.5)' : 'rgba(255,255,255,0.08)'}`,
                  background: selected ? 'rgba(0,116,255,0.08)' : 'rgba(255,255,255,0.02)',
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  opacity: selected ? 1 : 0.4,
                }}>
                  <i className={`fa-solid ${selected ? 'fa-circle-dot' : 'fa-circle'}`}
                    style={{ color: selected ? 'var(--tekky-blue)' : 'var(--muted)', fontSize: '1rem' }} />
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.92rem', color: selected ? 'var(--fg)' : 'var(--muted)' }}>
                      {opt === 'adult' ? '18 or Older' : 'Under 18 (Minor)'}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)' }}>
                      {opt === 'adult' ? 'Participant signs for themselves' : 'Parent or guardian required'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardSection>

        {/* Waiver Clauses */}
        <div style={S.card}>
          <div style={{
            padding: '0.9rem 1.75rem', borderBottom: '1px solid rgba(0,116,255,0.12)',
            background: 'rgba(0,116,255,0.03)',
          }}>
            <p style={S.sectionHead}>Waiver &amp; Release of Liability</p>
          </div>
          <div style={{ ...S.cardPad, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {CLAUSES.map((clause, i) => (
              <div key={clause.key} style={{
                display: 'flex', gap: '0.9rem',
                paddingBottom: i < CLAUSES.length - 1 ? '1.25rem' : 0,
                borderBottom: i < CLAUSES.length - 1 ? '1px solid rgba(0,116,255,0.07)' : 'none',
              }}>
                <span style={{
                  flexShrink: 0, fontFamily: 'monospace', fontSize: '0.78rem',
                  color: 'var(--tekky-blue)', background: 'rgba(0,116,255,0.08)',
                  border: '1px solid rgba(0,116,255,0.2)', borderRadius: 4,
                  padding: '0.15rem 0.45rem', height: 'fit-content', marginTop: '0.1rem',
                }}>✓</span>
                <p style={S.prose}>{clause.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Signature Block */}
        {!waiver.is_minor ? (
          <CardSection title="Participant Signature">
            <div style={S.grid}>
              <Field label="Printed Name" value={waiver.printed_name}     fullWidth />
              <Field label="Signature"    value={waiver.signature_image}  fullWidth signature />
              <Field label="Date Signed"  value={signedDate}              fullWidth />
            </div>
          </CardSection>
        ) : (
          <CardSection title="Guardian Signature (Minor Participant)">
            <div style={S.grid}>
              <Field label="Guardian Type"         value={guardianTypeLabel} />
              <Field label="Guardian Printed Name" value={waiver.guardian_name_printed} />
              <Field label="Guardian Email"        value={waiver.guardian_email} />
              <Field label="Guardian Phone"        value={waiver.guardian_phone} />
              <Field label="Guardian Signature"    value={waiver.guardian_signature} fullWidth signature />
              <Field label="Date Signed"           value={signedDate}               fullWidth />
            </div>
          </CardSection>
        )}

        {/* Footer */}
        <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--muted)', marginTop: '1rem', lineHeight: 1.6 }}>
          This is a read-only view of a signed waiver. Record ID: {waiver.id}
        </p>

      </div>
    </div>
  );
}
