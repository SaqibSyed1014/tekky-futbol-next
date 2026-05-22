'use client';

import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { signWaiver, getWaiverStatus } from '@/services/waiverApi';
import GlowDivider from '@/components/ui/GlowDivider';

// ─── Clause keys — all sent as `true` when the user agrees ───────────────────

const REQUIRED_CLAUSES = [
  'age_18_or_older',
  'voluntary_participation',
  'strenuous_activities',
  'athletic_hazards',
  'unforeseeable_risks',
  'no_implied_warranties',
  'no_lawsuit',
  'release_of_liability',
  'no_medical_personnel',
  'medical_consultation',
  'identity_likeness_grant',
  'liability_limitation',
];

// ─── Waiver content ───────────────────────────────────────────────────────────

const WAIVER_SECTIONS = [
  {
    title: 'Voluntary Participation',
    paragraphs: [
      'I am 18 years of age or older. I understand that I am under no compulsion to participate in the Activities, that my participation is voluntary, and that I am free to forgo participation in the Activities and/or find an alternate service provider if I disagree with the terms contained in this Agreement.',
    ],
  },
  {
    title: 'Assumption of Risk',
    paragraphs: [
      'I understand that the Activities may be physically strenuous and involve potentially hazardous activities associated with athletic contests. I am voluntarily participating with full knowledge that my participation involves risks, dangers and hazards — including, without limitation, the possibility of personal injury, property damage, financial loss or death. I freely accept and fully assume all such risks.',
      'Athletic contests carry inherent risks including soft tissue injuries, broken bones, fractures, dislocations, bruises, sprains, tears, head/spine injuries, tendinitis/bursitis, and death. I am solely responsible for all precautions necessary for my health and safety. I acknowledge that while some risks are foreseeable, others are not.',
    ],
  },
  {
    title: 'Release of Liability & Waiver of Claims',
    paragraphs: [
      'Neither I nor my heirs, executors, legal representatives, or anyone claiming through me will sue or make any claims against Company, its owners, officers, directors, employees, contractors and agents (the "Released Parties") for any personal injury, property damage, loss or death arising from my participation in the Activities.',
      'To the maximum extent permitted by applicable law, I hereby release and hold the Released Parties harmless from all claims, demands, damages, liabilities, losses, costs and expenses — including reasonable attorney\'s fees — arising out of or related to my participation in the Activities, regardless of cause.',
    ],
  },
  {
    title: 'Medical Responsibility',
    paragraphs: [
      'I understand that the Released Parties are not medical personnel and may not provide medical judgments, advice, care or treatment. I certify that I have consulted my own medical professionals regarding any past or present injury, illness, or physical or mental condition that may affect my ability to participate in the Activities.',
    ],
  },
  {
    title: 'Media Rights & Limitation of Liability',
    paragraphs: [
      'I grant TEKKY FUTBOL, LLC and its licensees a perpetual, royalty-free right to use my identity and likeness as captured in connection with the Activities for advertising and promotional purposes. Company\'s total liability for any dispute shall be limited to the fees I paid for the specific activity from which the dispute arose.',
    ],
  },
  {
    title: 'General Provisions',
    paragraphs: [
      'Failure to enforce any term of this Agreement on any occasion does not constitute a waiver of that right. Nothing herein creates a partnership or joint venture between the parties. This Agreement is the entire understanding between the parties and supersedes all prior agreements on this subject.',
      'This Agreement is binding upon the parties and their respective heirs, legal representatives, and successors. Each provision is severable. This Agreement is governed by Illinois law; disputes shall be resolved exclusively in courts in or nearest to Cook County, Illinois.',
    ],
  },
];

// ─── Shared styles ────────────────────────────────────────────────────────────

const inputStyle = {
  width: '100%',
  padding: '0.65rem 0.9rem',
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(0,116,255,0.3)',
  borderRadius: 8,
  color: '#e2e8f3',
  fontSize: '0.9rem',
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
  lineHeight: 1.5,
};

const labelStyle = {
  display: 'block',
  fontSize: '0.73rem',
  color: 'var(--muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  fontWeight: 600,
  marginBottom: '0.4rem',
};

// ─── Already-signed state ─────────────────────────────────────────────────────

function AlreadySigned({ printedName, signedAt }) {
  const formatted = new Date(signedAt).toLocaleString('en-US', {
    weekday: 'long',
    year:    'numeric',
    month:   'long',
    day:     'numeric',
    hour:    '2-digit',
    minute:  '2-digit',
  });

  return (
    <div style={{ maxWidth: 580 }}>
      <div style={{
        background:   'rgba(0,200,100,0.04)',
        border:       '1px solid rgba(0,200,100,0.22)',
        borderRadius: 16,
        padding:      '3rem 2rem',
        textAlign:    'center',
        boxShadow:    '0 0 40px rgba(0,200,100,0.06)',
      }}>
        {/* Icon */}
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'rgba(0,200,100,0.1)',
          border:     '2px solid rgba(0,200,100,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.5rem',
        }}>
          <i className="fa-solid fa-circle-check" style={{ fontSize: '2rem', color: '#00c864' }} />
        </div>

        <h2 style={{
          fontFamily:    "'Bebas Neue', sans-serif",
          fontSize:      '2rem',
          color:         '#00c864',
          letterSpacing: '2px',
          margin:        '0 0 0.6rem',
        }}>
          Waiver Signed
        </h2>

        <p style={{ color: '#e2e8f3', fontSize: '1rem', margin: '0 0 0.3rem' }}>
          Signed by <strong>{printedName}</strong>
        </p>
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: '0 0 2rem' }}>
          {formatted}
        </p>

        <span style={{
          display:      'inline-flex',
          alignItems:   'center',
          gap:          '0.5rem',
          background:   'rgba(0,200,100,0.1)',
          border:       '1px solid rgba(0,200,100,0.22)',
          borderRadius: 8,
          padding:      '0.55rem 1.25rem',
          fontSize:     '0.85rem',
          color:        '#00c864',
          fontWeight:   600,
        }}>
          <i className="fa-solid fa-shield-check" />
          You have full platform access
        </span>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function WaiverSigningClient() {
  const { refreshUser } = useAuth();

  const [pageStatus,  setPageStatus]  = useState('loading'); // loading | unsigned | signed
  const [signedData,  setSignedData]  = useState(null);
  const [agreed,      setAgreed]      = useState(false);
  const [name,        setName]        = useState('');
  const [submitting,  setSubmitting]  = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Load waiver status on mount
  useEffect(() => {
    getWaiverStatus()
      .then((data) => {
        if (data.waiver_signed) {
          setPageStatus('signed');
          setSignedData(data);
        } else {
          setPageStatus('unsigned');
        }
      })
      .catch(() => setPageStatus('unsigned'));
  }, []);

  const trimmedName = name.trim();
  const canSubmit   = agreed && trimmedName.length >= 2 && !submitting;

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await signWaiver({
        clauses_initialed: Object.fromEntries(REQUIRED_CLAUSES.map((k) => [k, true])),
        printed_name:      trimmedName,
        signature_image:   trimmedName,
      });
      setSignedData(res);
      setPageStatus('signed');
      await refreshUser();
    } catch (err) {
      setSubmitError(err.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [canSubmit, trimmedName, refreshUser]);

  // ── Loading ─────────────────────────────────────────────────────────────────

  if (pageStatus === 'loading') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <span className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
      </div>
    );
  }

  // ── Already signed ──────────────────────────────────────────────────────────

  if (pageStatus === 'signed') {
    return (
      <AlreadySigned
        printedName={signedData.printed_name}
        signedAt={signedData.signed_at}
      />
    );
  }

  // ── Unsigned form ───────────────────────────────────────────────────────────

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div style={{ maxWidth: 760 }}>

      {/* ── Page header ────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: '0.5rem' }}>
        <h1 style={{
          fontFamily:    "'Bebas Neue', sans-serif",
          fontSize:      '2.2rem',
          letterSpacing: '2px',
          color:         'var(--fg)',
          margin:        0,
        }}>
          Participant Waiver
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginTop: '0.35rem' }}>
          TEKKY FUTBOL, LLC — Release and Waiver of Liability Agreement
        </p>
      </div>

      <GlowDivider />

      {/* ── Important notice ───────────────────────────────────────────────── */}
      <div style={{
        background:    'rgba(255,60,60,0.05)',
        border:        '1px solid rgba(255,60,60,0.2)',
        borderRadius:  10,
        padding:       '0.9rem 1.2rem',
        marginBottom:  '1.75rem',
        display:       'flex',
        gap:           '0.85rem',
        alignItems:    'flex-start',
      }}>
        <i
          className="fa-solid fa-triangle-exclamation"
          style={{ color: '#ff6b6b', fontSize: '1rem', marginTop: 3, flexShrink: 0 }}
        />
        <p style={{ margin: 0, fontSize: '0.875rem', color: '#e2e8f3', lineHeight: 1.7 }}>
          <strong style={{ color: '#ff6b6b' }}>Important — </strong>
          Please read this entire Agreement before signing. It affects your legal rights.
          Signing is required before participating in any TEKKY FUTBOL, LLC league activity.
        </p>
      </div>

      {/* ── Waiver document ────────────────────────────────────────────────── */}
      <div style={{
        background:    'rgba(0,0,0,0.45)',
        border:        '1px solid rgba(0,116,255,0.18)',
        borderRadius:  12,
        overflow:      'hidden',
        marginBottom:  '0.75rem',
      }}>
        {WAIVER_SECTIONS.map((section, idx) => (
          <div
            key={section.title}
            style={{
              padding:      '1.4rem 1.75rem',
              borderBottom: idx < WAIVER_SECTIONS.length - 1
                ? '1px solid rgba(0,116,255,0.1)'
                : 'none',
            }}
          >
            {/* Section heading */}
            <h3 style={{
              fontFamily:    "'Bebas Neue', sans-serif",
              fontSize:      '0.95rem',
              color:         'var(--tekky-blue)',
              letterSpacing: '1.5px',
              margin:        '0 0 0.65rem',
              paddingBottom: '0.45rem',
              borderBottom:  '1px solid rgba(0,116,255,0.15)',
            }}>
              {section.title}
            </h3>

            {/* Section text */}
            {section.paragraphs.map((p, pIdx) => (
              <p
                key={pIdx}
                style={{
                  margin:     pIdx < section.paragraphs.length - 1 ? '0 0 0.7rem' : 0,
                  fontSize:   '0.875rem',
                  color:      'var(--muted)',
                  lineHeight: 1.75,
                }}
              >
                {p}
              </p>
            ))}
          </div>
        ))}
      </div>

      <GlowDivider />

      {/* ── Signature block ─────────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit}>
        <div style={{
          background:   'rgba(0,0,0,0.45)',
          border:       '1px solid rgba(0,116,255,0.18)',
          borderRadius: 12,
          padding:      '1.75rem',
        }}>

          {/* Preamble */}
          <p style={{
            color:         'var(--muted)',
            fontSize:      '0.875rem',
            lineHeight:    1.7,
            margin:        '0 0 1.5rem',
            paddingBottom: '1.25rem',
            borderBottom:  '1px solid rgba(0,116,255,0.1)',
          }}>
            By signing below, I confirm that I have read and fully understand all
            terms of this Agreement and voluntarily agree to be bound by its
            provisions. I am aware that I am waiving certain legal rights.
          </p>

          {/* Agreement checkbox */}
          <label style={{
            display:       'flex',
            alignItems:    'flex-start',
            gap:           '0.85rem',
            cursor:        'pointer',
            padding:       '0.9rem 1rem',
            marginBottom:  '1.5rem',
            background:    agreed ? 'rgba(0,200,100,0.04)' : 'rgba(0,116,255,0.03)',
            border:        `1px solid ${agreed ? 'rgba(0,200,100,0.2)' : 'rgba(0,116,255,0.15)'}`,
            borderRadius:  8,
            transition:    'all 0.15s',
          }}>
            {/* Custom checkbox */}
            <div style={{ flexShrink: 0, marginTop: 2 }}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                style={{ display: 'none' }}
              />
              <div style={{
                width:           20,
                height:          20,
                borderRadius:    4,
                border:          `2px solid ${agreed ? '#00c864' : 'rgba(0,116,255,0.5)'}`,
                background:      agreed ? '#00c864' : 'transparent',
                display:         'flex',
                alignItems:      'center',
                justifyContent:  'center',
                transition:      'all 0.15s',
                flexShrink:      0,
              }}>
                {agreed && (
                  <i className="fa-solid fa-check" style={{ fontSize: '0.6rem', color: '#000' }} />
                )}
              </div>
            </div>

            <span style={{
              fontSize:   '0.875rem',
              color:      agreed ? '#e2e8f3' : 'var(--muted)',
              lineHeight: 1.6,
              transition: 'color 0.15s',
            }}>
              I have read and fully understand all of the above terms and conditions,
              and I voluntarily agree to be bound by this Release and Waiver of
              Liability Agreement.
            </span>
          </label>

          {/* Name + Date */}
          <div style={{
            display:               'grid',
            gridTemplateColumns:   'repeat(auto-fit, minmax(200px, 1fr))',
            gap:                   '1rem',
            marginBottom:          '1.5rem',
          }}>
            <div>
              <label style={labelStyle}>
                Full Legal Name
                <span style={{ color: '#ff6b6b', marginLeft: 3 }}>*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="As it appears on your ID"
                style={inputStyle}
                required
                minLength={2}
                autoComplete="name"
              />
              <p style={{
                fontSize: '0.72rem', color: 'var(--muted)',
                margin: '0.35rem 0 0', lineHeight: 1.4,
              }}>
                Your typed name serves as your legal signature
              </p>
            </div>

            <div>
              <label style={labelStyle}>Date</label>
              <input
                type="text"
                value={today}
                readOnly
                style={{ ...inputStyle, color: 'var(--muted)', cursor: 'default' }}
              />
            </div>
          </div>

          {/* Error */}
          {submitError && (
            <div style={{
              background:    'rgba(255,60,60,0.08)',
              border:        '1px solid rgba(255,60,60,0.25)',
              borderRadius:  8,
              padding:       '0.7rem 1rem',
              marginBottom:  '1rem',
              color:         '#ff6b6b',
              fontSize:      '0.875rem',
            }}>
              {submitError}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!canSubmit}
            style={{
              width:        '100%',
              padding:      '0.9rem',
              background:   canSubmit ? 'var(--tekky-blue)' : 'rgba(0,116,255,0.1)',
              border:       `1px solid ${canSubmit ? 'var(--tekky-blue)' : 'rgba(0,116,255,0.15)'}`,
              borderRadius: 10,
              color:        canSubmit ? '#fff' : 'rgba(255,255,255,0.25)',
              fontSize:     '1.05rem',
              fontWeight:   700,
              fontFamily:   "'Bebas Neue', sans-serif",
              letterSpacing:'2px',
              cursor:       canSubmit ? 'pointer' : 'not-allowed',
              transition:   'all 0.2s',
              boxShadow:    canSubmit ? '0 0 20px rgba(0,116,255,0.25)' : 'none',
            }}
          >
            {submitting ? (
              <>
                <span
                  className="spinner"
                  style={{
                    width: 15, height: 15, borderWidth: 2,
                    display: 'inline-block', verticalAlign: 'middle', marginRight: 8,
                  }}
                />
                Submitting…
              </>
            ) : (
              'Sign & Submit Waiver'
            )}
          </button>

          {/* Hint when disabled */}
          {!canSubmit && !submitting && (
            <p style={{
              textAlign:  'center',
              fontSize:   '0.75rem',
              color:      'var(--muted)',
              margin:     '0.6rem 0 0',
              opacity:    0.7,
            }}>
              {!agreed && !trimmedName
                ? 'Check the agreement box and enter your full name to continue'
                : !agreed
                  ? 'Check the agreement box to continue'
                  : 'Enter your full name to continue'}
            </p>
          )}

        </div>
      </form>

    </div>
  );
}
