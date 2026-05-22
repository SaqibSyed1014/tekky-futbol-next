'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { signWaiver, getWaiverStatus } from '@/services/waiverApi';
import GlowDivider from '@/components/ui/GlowDivider';

// ─── Clause keys — all sent as true on submit ─────────────────────────────────

const REQUIRED_CLAUSES = [
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

// ─── Exact clause text from the signed waiver document ───────────────────────

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
    text: 'Neither I nor my heirs, executors, legal representative(s), or anyone claiming through me or on my behalf will sue or make any other claims or demands of any kind whatsoever against Company, the owners, officers, directors, employees, contractors and agents of Company, or any facility utilized by Company for the Activities (collectively, the “Released Parties”) for any personal injury, property damage, loss or death, whether caused or contributed to by any of the Released Parties or otherwise.',
  },
  {
    key: 'release_of_liability',
    text: 'To the maximum extent permitted by applicable law, I hereby release and agree to hold the Released Parties harmless from and against any and all claims, demands, actions, damages, liabilities, losses, costs and expenses (including, without limitation, court costs and reasonable attorney’s fees) in any way arising out of or related to my participation in the Activities, including without limitation, any and all claims, demands and actions for any injury, loss, damage or death, regardless of whether such injury, loss, damage or death was caused or contributed to by any of the Released Parties.',
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
    text: 'FOR GOOD AND VALUABLE CONSIDERATION, the receipt and sufficiency of which I acknowledge, I hereby grant Company and Company’s licensees, successors and assigns a perpetual, royalty-free right and permission to use my identity and likeness as may be recorded or otherwise captured by Company in connection with my participation in the Activities (collectively, my “Identity”) throughout the universe in connection with the advertising and promotion of Company. To that end, I hereby authorize Company to photograph and record my Identity; to edit same in Company’s sole discretion; to incorporate my Identity into such materials and derivative works as Company may create, or not; and to use, exhibit, publish and distribute, and license others to do the same, in any manner or media now known or later developed for all commercial purposes. I hereby acknowledge and agree that Company shall own all rights and proceeds related to any materials created pursuant to this grant of right and permission and that I am waiving any right to review or approve any such materials prior or subsequent to publication.',
  },
  {
    key: 'liability_limitation',
    text: 'Subject to the foregoing provisions, I understand that Company’s total liability arising from or in connection with my participation in the Activities shall be limited to the fees I paid for the particular activity from which a dispute has arisen. Failure by Company to insist upon strict and/or immediate adherence to any term contained in this Agreement on one or more occasions shall not be considered a waiver of Company’s right to thereafter insist upon strict and immediate adherence to that term, or any other term of this Agreement, at any time. Nothing contained in this Agreement shall be construed to place the parties in the relationship of partners, joint venturers or agents, and the parties shall have no power to obligate or bind each other in any manner whatsoever. This Agreement contains the entire understanding between the parties and supersedes, terminates and replaces any and all prior agreements and/or understandings between the parties on this subject matter. No amendments or waivers shall be valid unless in writing and signed by the parties hereto. The parties acknowledge and agree that this Agreement and its benefits, obligations and other provisions is applicable to, binding upon, and shall inure to the benefit of the parties and their respective heirs, executors, legal representatives, successors, assigns and anyone claiming through them or on their behalf. Every provision of this Agreement is intended to be severable. In the event that any provision hereof is declared by a court of competent jurisdiction to be illegal or invalid for any reason whatsoever, such illegality or invalidity shall not affect the balance of the provisions hereof, which provisions shall remain binding and enforceable; provided, however, said invalid or unenforceable provision shall be deemed automatically replaced with a valid and enforceable provision having the maximum similar legal effect possible. This Agreement is made in accordance with the laws and decisions of the State of Illinois and will be construed and enforced under the laws of that state as applied to agreements entered into and to be fully performed within that state (i.e., without regard for the principles of conflicts of laws). This Agreement shall not be construed as if it had been prepared by one of the parties, but rather as if all parties had prepared the same. Any action to enforce this Agreement shall be brought exclusively in the federal or state courts in or nearest to Cook County, Illinois and the parties hereby consent to the personal jurisdiction of same. Company shall be entitled to recover its reasonable attorney’s fees and costs incurred in connection with any successful defense or enforcement of this Agreement from you.',
  },
];

// ─── Module-level styles (constant — defined once, not recreated on render) ───

const S = {
  // Card wrapper
  card: {
    background:   'rgba(0,0,0,0.45)',
    border:       '1px solid rgba(0,116,255,0.18)',
    borderRadius: 12,
    overflow:     'hidden',
    marginBottom: '1.5rem',
  },
  cardPad: { padding: '1.75rem' },

  // Two-column grid
  grid: {
    display:             'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap:                 '1rem',
  },

  // Form inputs
  input: {
    width:       '100%',
    padding:     '0.65rem 0.9rem',
    background:  'rgba(255,255,255,0.03)',
    border:      '1px solid rgba(0,116,255,0.3)',
    borderRadius: 8,
    color:       '#e2e8f3',
    fontSize:    '0.9rem',
    fontFamily:  'inherit',
    outline:     'none',
    boxSizing:   'border-box',
    lineHeight:  1.5,
  },
  inputDisabled: {
    width:       '100%',
    padding:     '0.65rem 0.9rem',
    background:  'rgba(255,255,255,0.03)',
    border:      '1px solid rgba(0,116,255,0.3)',
    borderRadius: 8,
    color:       'var(--muted)',
    fontSize:    '0.9rem',
    fontFamily:  'inherit',
    outline:     'none',
    boxSizing:   'border-box',
    lineHeight:  1.5,
    cursor:      'default',
    opacity:     0.7,
  },
  inputSignature: {
    width:       '100%',
    padding:     '0.5rem 0.9rem',
    background:  'rgba(0,116,255,0.04)',
    border:      '1px solid rgba(0,116,255,0.5)',
    borderRadius: 8,
    color:       '#c8d8f8',
    fontSize:    '1.4rem',
    fontFamily:  "'Dancing Script', 'Brush Script MT', cursive",
    outline:     'none',
    boxSizing:   'border-box',
    lineHeight:  1.5,
  },

  // Field label
  label: {
    display:       'block',
    fontSize:      '0.73rem',
    color:         'var(--muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight:    600,
    marginBottom:  '0.4rem',
  },

  // Card section heading (Bebas Neue, blue)
  sectionHead: {
    fontFamily:    "'Bebas Neue', sans-serif",
    fontSize:      '0.95rem',
    color:         'var(--tekky-blue)',
    letterSpacing: '1.5px',
    margin:        0,
  },

  // Muted body text (clauses / paragraphs)
  prose: {
    margin:     0,
    fontSize:   '0.84rem',
    color:      'var(--muted)',
    lineHeight: 1.75,
  },
};

// ─── Utility: calculate age from an ISO date string ──────────────────────────

function calcAge(dobStr) {
  if (!dobStr) return null;
  const dob = new Date(dobStr);
  if (isNaN(dob.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  if (
    today.getMonth() < dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
  ) age -= 1;
  return age;
}

// ─── Already-signed state ─────────────────────────────────────────────────────

function AlreadySigned({ signedData }) {
  const { is_minor, printed_name, guardian_name_printed, signed_at } = signedData;
  const displayName = is_minor ? guardian_name_printed : printed_name;
  const formatted   = new Date(signed_at).toLocaleString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long',
    day: 'numeric', hour: '2-digit', minute: '2-digit',
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
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '2rem', color: '#00c864',
          letterSpacing: '2px', margin: '0 0 0.6rem',
        }}>
          Waiver Signed
        </h2>

        <p style={{ color: '#e2e8f3', fontSize: '1rem', margin: '0 0 0.3rem' }}>
          Signed by <strong>{displayName || '—'}</strong>
          {is_minor && (
            <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}> (parent/guardian)</span>
          )}
        </p>
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: '0 0 2rem' }}>
          {formatted}
        </p>

        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(0,200,100,0.1)', border: '1px solid rgba(0,200,100,0.22)',
          borderRadius: 8, padding: '0.55rem 1.25rem',
          fontSize: '0.85rem', color: '#00c864', fontWeight: 600,
        }}>
          <i className="fa-solid fa-shield-check" />
          You have full platform access
        </span>
      </div>
    </div>
  );
}

// ─── Reusable field wrapper ───────────────────────────────────────────────────

function Field({ label, fullWidth, children }) {
  return (
    <div style={fullWidth ? { gridColumn: '1 / -1' } : undefined}>
      <label style={S.label}>{label}</label>
      {children}
    </div>
  );
}

// ─── Radio card (age group selection) ────────────────────────────────────────

function RadioCard({ selected, onSelect, color = 'var(--tekky-blue)', children }) {
  const blue = color === 'var(--tekky-blue)';
  return (
    <div
      onClick={onSelect}
      style={{
        flex:         '1 1 220px',
        padding:      '1rem 1.25rem',
        borderRadius: 10,
        border:       `2px solid ${selected ? color : blue ? 'rgba(0,116,255,0.2)' : 'rgba(255,255,255,0.12)'}`,
        background:   selected
          ? (blue ? 'rgba(0,116,255,0.08)' : 'rgba(240,180,41,0.05)')
          : 'transparent',
        cursor:     'pointer',
        transition: 'all 0.15s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
        {/* Radio dot */}
        <div style={{
          width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 2,
          border:      `2px solid ${selected ? color : blue ? 'rgba(0,116,255,0.35)' : 'rgba(255,255,255,0.25)'}`,
          background:  selected ? color : 'transparent',
          display:     'flex', alignItems: 'center', justifyContent: 'center',
          transition:  'all 0.15s',
        }}>
          {selected && (
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: blue ? '#fff' : '#000',
            }} />
          )}
        </div>
        <div style={{ flex: 1 }}>{children}</div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function WaiverSigningClient() {
  const { user, refreshUser } = useAuth();

  const [pageStatus,  setPageStatus] = useState('loading'); // loading | unsigned | signed
  const [signedData,  setSignedData] = useState(null);

  // Participant info
  const [dob,                   setDob]                   = useState('');
  const [address,               setAddress]               = useState('');
  const [phone,                 setPhone]                 = useState('');
  const [medicalConditions,     setMedicalConditions]     = useState('');
  const [emergencyContactName,  setEmergencyContactName]  = useState('');
  const [emergencyContactRel,   setEmergencyContactRel]   = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');

  // Age group
  const [ageGroup, setAgeGroup] = useState(null); // null | 'adult' | 'minor'

  // Adult signature
  const [signatureText, setSignatureText] = useState('');
  const [printedName,   setPrintedName]   = useState('');

  // Guardian signature
  const [guardianSignature,   setGuardianSignature]   = useState('');
  const [guardianNamePrinted, setGuardianNamePrinted] = useState('');
  const [guardianType,        setGuardianType]        = useState(''); // 'parent' | 'legal_guardian'
  const [guardianEmail,       setGuardianEmail]       = useState('');
  const [guardianPhone,       setGuardianPhone]       = useState('');

  const [submitting,  setSubmitting]  = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Pre-fill from auth context
  useEffect(() => {
    if (!user) return;
    if (user.profile?.date_of_birth) setDob(user.profile.date_of_birth);
    if (user.phone) setPhone(user.phone);
  }, [user]);

  // Load waiver status
  useEffect(() => {
    getWaiverStatus()
      .then((data) => {
        if (data.waiver_signed) { setPageStatus('signed'); setSignedData(data); }
        else setPageStatus('unsigned');
      })
      .catch(() => setPageStatus('unsigned'));
  }, []);

  const age = useMemo(() => calcAge(dob), [dob]);

  const canSubmit = useMemo(() => {
    if (!ageGroup) return false;
    if (ageGroup === 'adult')
      return signatureText.trim().length >= 2 && printedName.trim().length >= 2;
    return (
      guardianSignature.trim().length >= 2 &&
      guardianNamePrinted.trim().length >= 2 &&
      guardianType !== ''
    );
  }, [ageGroup, signatureText, printedName, guardianSignature, guardianNamePrinted, guardianType]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await signWaiver({
        is_minor:                ageGroup === 'minor',
        date_of_birth:           dob || null,
        address,
        participant_phone:       phone,
        medical_conditions:      medicalConditions,
        emergency_contact_name:  emergencyContactName,
        emergency_contact_rel:   emergencyContactRel,
        emergency_contact_phone: emergencyContactPhone,
        clauses_initialed:       Object.fromEntries(REQUIRED_CLAUSES.map((k) => [k, true])),
        printed_name:            ageGroup === 'adult' ? printedName.trim()          : '',
        signature_image:         ageGroup === 'adult' ? signatureText.trim()        : '',
        guardian_signature:      ageGroup === 'minor' ? guardianSignature.trim()    : '',
        guardian_name_printed:   ageGroup === 'minor' ? guardianNamePrinted.trim()  : '',
        guardian_type:           ageGroup === 'minor' ? guardianType                : '',
        guardian_email:          ageGroup === 'minor' ? guardianEmail.trim()        : '',
        guardian_phone:          ageGroup === 'minor' ? guardianPhone.trim()        : '',
      });
      setSignedData(res);
      setPageStatus('signed');
      await refreshUser();
    } catch (err) {
      setSubmitError(err.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [
    canSubmit, ageGroup, dob, address, phone, medicalConditions,
    emergencyContactName, emergencyContactRel, emergencyContactPhone,
    printedName, signatureText,
    guardianSignature, guardianNamePrinted, guardianType, guardianEmail, guardianPhone,
    refreshUser,
  ]);

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  // ── Loading ─────────────────────────────────────────────────────────────────

  if (pageStatus === 'loading') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <span className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
      </div>
    );
  }

  // ── Already signed ──────────────────────────────────────────────────────────

  if (pageStatus === 'signed') return <AlreadySigned signedData={signedData} />;

  // ── Unsigned form ───────────────────────────────────────────────────────────

  return (
    <div style={{ maxWidth: 800 }}>

      {/* Logo + company name */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
        <Image src="/images/logo.webp" alt="TekkyFutbol Logo" width={70} height={70} />
        <p style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '1.4rem', letterSpacing: '3px',
          color: 'var(--fg)', margin: '0.5rem 0 0', textAlign: 'center',
        }}>
          TEKKY FUTBOL, LLC
        </p>
      </div>

      {/* Waiver title */}
      <div style={{ marginBottom: '0.5rem', textAlign: 'center' }}>
        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '1.8rem', letterSpacing: '2px',
          color: 'var(--fg)', margin: 0,
        }}>
          Release and Waiver of Liability Agreement
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
          (PARTICIPANTS, VOLUNTEERS, OFFICIALS)
        </p>
      </div>

      <GlowDivider />

      {/* Important notice */}
      <div style={{
        background: 'rgba(255,60,60,0.05)', border: '1px solid rgba(255,60,60,0.2)',
        borderRadius: 10, padding: '0.9rem 1.2rem', marginBottom: '1.75rem',
        display: 'flex', gap: '0.85rem', alignItems: 'flex-start',
      }}>
        <i className="fa-solid fa-triangle-exclamation"
           style={{ color: '#ff6b6b', fontSize: '1rem', marginTop: 3, flexShrink: 0 }} />
        <p style={{ margin: 0, fontSize: '0.875rem', color: '#e2e8f3', lineHeight: 1.7 }}>
          <strong style={{ color: '#ff6b6b' }}>IMPORTANT!!! </strong>
          Please read this Release and Waiver of Liability Agreement (this &ldquo;Agreement&rdquo;) very carefully
          as it requires you to give up certain legal rights and claims which you may have.
        </p>
      </div>

      {/* Intro paragraph */}
      <div style={{ ...S.card, ...S.cardPad }}>
        <p style={S.prose}>
          IN CONSIDERATION of you being allowed to participate in any of the games, leagues and/or
          athletic events and contests (collectively, the &ldquo;Activities&rdquo;), whether as a participant,
          volunteer or official, offered by TEKKY FUTBOL, LLC (&ldquo;Company&rdquo;), and for other good and
          valuable consideration of which you acknowledge the receipt and sufficiency of, you agree to
          the terms and conditions contained in this Agreement. Please read this Agreement thoroughly
          and consult with any professionals or advisors that you may desire. Upon completion of your
          review, please initial each section and sign at the end of this Agreement indicating that
          you have read it and agree to its terms.
        </p>
      </div>

      {/* Participant info */}
      <div style={S.card}>
        <div style={{ padding: '1rem 1.75rem 0.75rem', borderBottom: '1px solid rgba(0,116,255,0.12)' }}>
          <h3 style={S.sectionHead}>Participant Information</h3>
        </div>
        <div style={{ padding: '1.25rem 1.75rem 1.5rem' }}>
          <div style={S.grid}>
            <Field label="Participant Name">
              <input type="text" value={user?.name || ''} readOnly disabled style={S.inputDisabled} />
            </Field>
            <Field label="D/O/B">
              <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} style={S.input} />
            </Field>

            <Field label="Address" fullWidth>
              <input
                type="text" value={address} onChange={(e) => setAddress(e.target.value)}
                placeholder="Street, City, State, ZIP" style={S.input}
              />
            </Field>

            <Field label="Age (if under 18)">
              <input
                type="text" readOnly disabled
                value={(age !== null && age < 18) ? String(age) : ''}
                placeholder="—" style={S.inputDisabled}
              />
            </Field>
            <Field label="Email">
              <input type="email" value={user?.email || ''} readOnly disabled style={S.inputDisabled} />
            </Field>

            <Field label="Phone">
              <input
                type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 555-5555" style={S.input}
              />
            </Field>

            <Field label="Please list any current injuries or medical conditions:" fullWidth>
              <textarea
                value={medicalConditions} onChange={(e) => setMedicalConditions(e.target.value)}
                placeholder="List any injuries or conditions, or write 'None'"
                rows={3} style={{ ...S.input, resize: 'vertical', minHeight: 70 }}
              />
            </Field>

            <Field label="Emergency Contact">
              <input
                type="text" value={emergencyContactName}
                onChange={(e) => setEmergencyContactName(e.target.value)}
                placeholder="Full name" style={S.input}
              />
            </Field>
            <Field label="Relationship">
              <input
                type="text" value={emergencyContactRel}
                onChange={(e) => setEmergencyContactRel(e.target.value)}
                placeholder="e.g. Spouse, Parent" style={S.input}
              />
            </Field>

            <Field label="Emergency Contact Phone">
              <input
                type="tel" value={emergencyContactPhone}
                onChange={(e) => setEmergencyContactPhone(e.target.value)}
                placeholder="(555) 555-5555" style={S.input}
              />
            </Field>
          </div>
        </div>
      </div>

      {/* Age declaration */}
      <div style={{ ...S.card, ...S.cardPad }}>
        <p style={{ ...S.label, marginBottom: '0.85rem' }}>Please select one:</p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <RadioCard selected={ageGroup === 'adult'} onSelect={() => setAgeGroup('adult')}>
            <span style={{ fontSize: '0.9rem', color: ageGroup === 'adult' ? '#e2e8f3' : 'var(--muted)' }}>
              I am 18 years of age or older.
            </span>
          </RadioCard>

          <RadioCard
            selected={ageGroup === 'minor'}
            onSelect={() => setAgeGroup('minor')}
            color="#f0b429"
          >
            <span style={{ fontSize: '0.9rem', color: ageGroup === 'minor' ? '#e2e8f3' : 'var(--muted)' }}>
              I am under 18 years of age.
            </span>
            {ageGroup === 'minor' && (
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', color: '#f0b429', lineHeight: 1.5 }}>
                NOTE: A parent or legal guardian of the participant must carefully review and acknowledge
                his/her agreement to the terms and conditions of this Agreement for themselves and the
                minor participant.
              </p>
            )}
          </RadioCard>
        </div>
      </div>

      {/* Waiver clauses — read-only document view */}
      <div style={S.card}>
        <div style={{ padding: '1rem 1.75rem 0.75rem', borderBottom: '1px solid rgba(0,116,255,0.12)' }}>
          <h3 style={S.sectionHead}>Agreement Clauses</h3>
        </div>
        {CLAUSES.map((c, i) => (
          <div
            key={c.key}
            style={{
              display:      'flex',
              gap:          '1rem',
              padding:      '0.85rem 1.25rem',
              borderBottom: i < CLAUSES.length - 1 ? '1px solid rgba(0,116,255,0.07)' : 'none',
            }}
          >
            <span style={{
              fontFamily: 'monospace',
              fontSize:   '0.78rem',
              color:      'rgba(0,116,255,0.5)',
              flexShrink: 0,
              marginTop:  3,
              letterSpacing: '2px',
            }}>
              _____
            </span>
            <p style={S.prose}>{c.text}</p>
          </div>
        ))}
      </div>

      {/* Closing paragraph */}
      <div style={{ ...S.card, ...S.cardPad }}>
        <p style={{ ...S.prose, color: '#e2e8f3' }}>
          I, for myself and the minor participant for whom I am a parent or a legal guardian (if applicable),
          have read and understand this Agreement and agree to be bound by its terms. I am aware that, by
          signing this Agreement, I am waiving certain legal rights and claims which I may have against the
          Released Parties.
        </p>
      </div>

      {/* Signature section */}
      <form onSubmit={handleSubmit}>
        <div style={{ ...S.card, ...S.cardPad }}>

          {/* 18+ block */}
          {ageGroup === 'adult' && (
            <>
              <h3 style={{ ...S.sectionHead, marginBottom: '1.25rem' }}>
                Participants 18 Years of Age or Older
              </h3>
              <div style={{ ...S.grid, marginBottom: '1rem' }}>
                <Field label="Signature *">
                  <input
                    type="text" value={signatureText}
                    onChange={(e) => setSignatureText(e.target.value)}
                    placeholder="Type your full name as signature"
                    style={S.inputSignature}
                  />
                </Field>
                <Field label="Date">
                  <input type="text" value={today} readOnly disabled style={S.inputDisabled} />
                </Field>
                <Field label="Name Printed *" fullWidth>
                  <input
                    type="text" value={printedName}
                    onChange={(e) => setPrintedName(e.target.value)}
                    placeholder="Print your full legal name" style={S.input}
                  />
                </Field>
              </div>
            </>
          )}

          {/* Minor / guardian block */}
          {ageGroup === 'minor' && (
            <>
              <h3 style={{ ...S.sectionHead, color: '#f0b429', marginBottom: '0.3rem' }}>
                Minor Participants Under the Age of 18
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: '0 0 1.25rem' }}>
                (to be completed by parent or legal guardian of minor participant)
              </p>
              <div style={{ ...S.grid, marginBottom: '1rem' }}>
                <Field label="Guardian Signature *">
                  <input
                    type="text" value={guardianSignature}
                    onChange={(e) => setGuardianSignature(e.target.value)}
                    placeholder="Type guardian's full name as signature"
                    style={S.inputSignature}
                  />
                </Field>
                <Field label="Date">
                  <input type="text" value={today} readOnly disabled style={S.inputDisabled} />
                </Field>

                <Field label="Name Printed *" fullWidth>
                  <input
                    type="text" value={guardianNamePrinted}
                    onChange={(e) => setGuardianNamePrinted(e.target.value)}
                    placeholder="Print guardian's full legal name" style={S.input}
                  />
                </Field>

                {/* Parent / Legal Guardian radio */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={S.label}>Check One *</label>
                  <div style={{ display: 'flex', gap: '1.5rem' }}>
                    {[
                      { value: 'parent',         label: 'Parent'         },
                      { value: 'legal_guardian',  label: 'Legal Guardian' },
                    ].map(({ value, label }) => (
                      <label
                        key={value}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.5rem',
                          cursor: 'pointer', fontSize: '0.875rem',
                          color: guardianType === value ? '#e2e8f3' : 'var(--muted)',
                        }}
                      >
                        <div
                          onClick={() => setGuardianType(value)}
                          style={{
                            width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                            border:      `2px solid ${guardianType === value ? '#f0b429' : 'rgba(255,255,255,0.25)'}`,
                            background:  guardianType === value ? '#f0b429' : 'transparent',
                            display:     'flex', alignItems: 'center', justifyContent: 'center',
                            transition:  'all 0.15s', cursor: 'pointer',
                          }}
                        >
                          {guardianType === value && (
                            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#000' }} />
                          )}
                        </div>
                        {label}
                      </label>
                    ))}
                  </div>
                </div>

                <Field label="Guardian Email">
                  <input
                    type="email" value={guardianEmail}
                    onChange={(e) => setGuardianEmail(e.target.value)}
                    placeholder="guardian@email.com" style={S.input}
                  />
                </Field>
                <Field label="Guardian Phone">
                  <input
                    type="tel" value={guardianPhone}
                    onChange={(e) => setGuardianPhone(e.target.value)}
                    placeholder="(555) 555-5555" style={S.input}
                  />
                </Field>
              </div>
            </>
          )}

          {/* Prompt when no age group selected */}
          {!ageGroup && (
            <p style={{ ...S.prose, marginBottom: '1rem' }}>
              Please select your age group above to continue.
            </p>
          )}

          {/* Error */}
          {submitError && (
            <div style={{
              background: 'rgba(255,60,60,0.08)', border: '1px solid rgba(255,60,60,0.25)',
              borderRadius: 8, padding: '0.7rem 1rem', marginBottom: '1rem',
              color: '#ff6b6b', fontSize: '0.875rem',
            }}>
              {submitError}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!canSubmit}
            style={{
              width:         '100%',
              padding:       '0.9rem',
              background:    canSubmit ? 'var(--tekky-blue)' : 'rgba(0,116,255,0.1)',
              border:        `1px solid ${canSubmit ? 'var(--tekky-blue)' : 'rgba(0,116,255,0.15)'}`,
              borderRadius:  10,
              color:         canSubmit ? '#fff' : 'rgba(255,255,255,0.25)',
              fontSize:      '1.05rem',
              fontWeight:    700,
              fontFamily:    "'Bebas Neue', sans-serif",
              letterSpacing: '2px',
              cursor:        canSubmit ? 'pointer' : 'not-allowed',
              transition:    'all 0.2s',
              boxShadow:     canSubmit ? '0 0 20px rgba(0,116,255,0.25)' : 'none',
            }}
          >
            {submitting ? (
              <>
                <span className="spinner" style={{
                  width: 15, height: 15, borderWidth: 2,
                  display: 'inline-block', verticalAlign: 'middle', marginRight: 8,
                }} />
                Submitting&hellip;
              </>
            ) : (
              'Sign & Submit Waiver'
            )}
          </button>

          {!canSubmit && !submitting && (
            <p style={{
              textAlign: 'center', fontSize: '0.75rem',
              color: 'var(--muted)', margin: '0.6rem 0 0', opacity: 0.7,
            }}>
              {!ageGroup
                ? 'Select your age group to continue'
                : 'Complete the signature fields to continue'}
            </p>
          )}

        </div>
      </form>
    </div>
  );
}
