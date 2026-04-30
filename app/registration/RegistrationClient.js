'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import GlowDivider from '@/components/ui/GlowDivider';
import { submitApplication } from '@/services/applicationsApi';
import { ApiError } from '@/services/api';
import {
  APPLICATION_TYPE,
  GENDER_OPTIONS,
  DIVISION_OPTIONS,
  REGISTRATION_TYPE_OPTIONS,
  MAX_LOGO_SIZE_KB,
  TOTAL_STEPS,
} from '@/constants/registration';

const INITIAL_FORM = {
  name: '',
  phone: '',
  email: '',
  password: '',
  password2: '',
  gender: '',
  preferredDivision: '',
  instagram: '',
  registrationType: '',
  teamName: '',
  rosterSize: '',
  reasonForCompeting: '',
  nameLogoConfirmation: false,
  nonGuarantee: false,
  codeOfConduct: false,
};

const h2Style = {
  fontFamily: "'Bebas Neue', sans-serif",
  color: 'var(--tekky-blue)',
  fontSize: '2rem',
  marginBottom: '1.2rem',
};

const errorBannerStyle = {
  background: 'rgba(255,60,60,0.12)',
  border: '1px solid rgba(255,60,60,0.4)',
  borderRadius: 8,
  padding: '0.75rem 1rem',
  color: '#ff6b6b',
  fontSize: '0.9rem',
  margin: '1rem 0',
  textAlign: 'left',
};

// ─── Password field with show/hide toggle ─────────────────────────────────────

function PasswordInput({ id, name, value, onChange, placeholder, disabled, required, minLength }) {
  const [visible, setVisible] = useState(false);
  return (
    <div style={{ position: 'relative', marginBottom: "1.2rem" }}>
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        minLength={minLength}
        style={{ paddingRight: '2.6rem', marginBottom: 0 }}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        style={{
          position: 'absolute',
          right: '0.75rem',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          color: 'var(--muted)',
          cursor: 'pointer',
          padding: 0,
          fontSize: '0.95rem',
          lineHeight: 1,
        }}
      >
        <i className={visible ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'} />
      </button>
    </div>
  );
}

// ─── Logo upload zone ─────────────────────────────────────────────────────────

function LogoUploadZone({ file, preview, onSelect, onRemove }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  function processFile(f) {
    if (!f) return;
    if (f.size / 1024 > MAX_LOGO_SIZE_KB) {
      alert(`Please upload a file smaller than ${MAX_LOGO_SIZE_KB / 1000} MB`);
      return;
    }
    const url = URL.createObjectURL(f);
    onSelect(f, url);
  }

  function handleInputChange(e) {
    processFile(e.target.files[0] || null);
    e.target.value = '';
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    processFile(e.dataTransfer.files[0] || null);
  }

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div style={{ marginBottom: '1.2rem', textAlign: 'left' }}>
      <div style={{ fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, marginBottom: '0.5rem' }}>
        Team Logo
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        style={{ display: 'none' }}
        tabIndex={-1}
        required={true}
      />

      {!file ? (
        // ── Empty state: drop zone ──
        <div
          onClick={() => inputRef.current.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current.click()}
          aria-label="Upload team logo"
          style={{
            border: `2px dashed ${dragOver ? 'rgba(0,116,255,0.7)' : 'rgba(0,116,255,0.3)'}`,
            borderRadius: 12,
            background: dragOver ? 'rgba(0,116,255,0.07)' : 'rgba(0,116,255,0.03)',
            padding: '2.2rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            transition: 'border-color 0.2s, background 0.2s',
            outline: 'none',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(0,116,255,0.6)'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,116,255,0.3)'; }}
        >
          <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: '2rem', color: 'rgba(0,116,255,0.5)' }} />
          <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--fg)', fontWeight: 500 }}>
            Click or drag & drop to upload
          </p>
          <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)' }}>
            PNG, JPG, SVG · Max {MAX_LOGO_SIZE_KB / 1000} MB
          </p>
        </div>
      ) : (
        // ── Filled state: preview card ──
        <div style={{
          border: '1px solid rgba(0,116,255,0.3)',
          borderRadius: 12,
          background: 'rgba(0,116,255,0.04)',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}>
          <div style={{
            width: 72,
            height: 72,
            borderRadius: 8,
            border: '1px solid rgba(0,116,255,0.2)',
            background: 'rgba(0,0,0,0.4)',
            flexShrink: 0,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <img
              src={preview}
              alt="Logo preview"
              style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 6 }}
            />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              margin: '0 0 0.2rem',
              fontSize: '0.88rem',
              color: 'var(--fg)',
              fontWeight: 500,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {file.name}
            </div>
            <p style={{ margin: '0 0 0.6rem', fontSize: '0.78rem', color: 'var(--muted)' }}>
              {formatSize(file.size)}
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => inputRef.current.click()}
                style={{
                  fontSize: '0.78rem',
                  padding: '0.3rem 0.75rem',
                  border: '1px solid rgba(0,116,255,0.4)',
                  borderRadius: 20,
                  background: 'none',
                  color: 'var(--tekky-blue)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,116,255,0.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
              >
                <i className="fa-solid fa-arrow-up-from-bracket" style={{ marginRight: 5 }} />
                Change
              </button>
              <button
                type="button"
                onClick={onRemove}
                style={{
                  fontSize: '0.78rem',
                  padding: '0.3rem 0.75rem',
                  border: '1px solid rgba(255,60,60,0.35)',
                  borderRadius: 20,
                  background: 'none',
                  color: '#ff6b6b',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,60,60,0.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
              >
                <i className="fa-solid fa-trash" style={{ marginRight: 5 }} />
                Remove
              </button>
            </div>
          </div>

          <i className="fa-solid fa-circle-check" style={{ fontSize: '1.3rem', color: '#00c864', flexShrink: 0 }} />
        </div>
      )}

      <div style={{ fontSize: '0.74rem', color: 'var(--muted)', marginTop: '0.5rem', lineHeight: 1.5 }}>
        By uploading, you confirm you own the rights to this logo. <br/>TekkyFutbol reserves the right to reject any infringing branding.
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function RegistrationClient() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  function nextStep() {
    const current = document.querySelector(`.step[data-step="${step}"]`);
    const inputs = current.querySelectorAll('input, select, textarea');
    for (const input of inputs) {
      if (!input.checkValidity()) {
        input.reportValidity();
        return;
      }
    }
    // Password match check on step 1
    if (step === 1 && form.password !== form.password2) {
      setPasswordError('Passwords do not match.');
      return;
    }
    setPasswordError('');
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  function prevStep() {
    setStep((s) => Math.max(s - 1, 1));
  }

  function goToFirst() {
    setStep(1);
    setForm(INITIAL_FORM);
    setLogoFile(null);
    setLogoPreview(null);
    setSubmitError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');

    // Build the application payload

    const payload = {
      applicationType: form.registrationType,
      name:              form.name,
      email:             form.email,
      password:          form.password,
      password2:         form.password2,
      phone:             form.phone,
      gender:            form.gender,
      preferredDivision: form.preferredDivision,
      instagram:         form.instagram,
      reasonForCompeting: form.reasonForCompeting,
      nameLogoConfirmation: form.nameLogoConfirmation,
      nonGuarantee:         form.nonGuarantee,
      codeOfConduct:        form.codeOfConduct,
      // Team fields — only meaningful when applicationType is full_team
      ...(form.registrationType === APPLICATION_TYPE.FULL_TEAM && {
        teamName:   form.teamName,
        rosterSize: Number(form.rosterSize) || undefined,
      }),
    };

    try {
      await submitApplication(payload, logoFile);
      setStep(TOTAL_STEPS);
      setForm(INITIAL_FORM);
      setLogoFile(null);
      setLogoPreview(null);
    } catch (err) {
      if (err instanceof ApiError) {
        setSubmitError(err.message || 'Submission failed. Please try again.');
      } else {
        setSubmitError('Something went wrong. Please check your connection and try again.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <header style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="hero" style={{ position: 'relative', zIndex: 2, maxWidth: 980, padding: '0 1rem' }}>
          <h1>REGISTRATION</h1>
          <p className="tagline">For Ballers Who Create</p>
          <p className="subtext">Built for players, creators, and the culture</p>
        </div>
      </header>

      <main
        id="register"
        style={{ width: '100%', maxWidth: 800, margin: '3rem auto 5rem', padding: '0 1.25rem', textAlign: 'center' }}
      >
        <GlowDivider />

        <section id="mensRegistration">
          <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>

            {/* STEP 1 — Player Info */}
            {step === 1 && (
              <div className="step" data-step="1">
                <h2 style={h2Style}>Player / Captain Info</h2>

                <label htmlFor="reg-name">Full Name</label>
                <input id="reg-name" type="text" name="name" value={form.name} onChange={handleChange} required />

                <label htmlFor="reg-phone">Phone Number</label>
                <input id="reg-phone" type="tel" name="phone" value={form.phone} onChange={handleChange} required />

                <label htmlFor="reg-email">Email</label>
                <input id="reg-email" type="email" name="email" value={form.email} onChange={handleChange} required />

                <label htmlFor="reg-password">Password</label>
                <PasswordInput
                  id="reg-password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
                />

                <label htmlFor="reg-password2">Confirm Password</label>
                <PasswordInput
                  id="reg-password2"
                  name="password2"
                  value={form.password2}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  required
                  minLength={8}
                />

                <label htmlFor="reg-gender">Gender</label>
                <select id="reg-gender" name="gender" value={form.gender} onChange={handleChange} required>
                  <option value="">Select</option>
                  {GENDER_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>

                <label htmlFor="reg-division">Preferred Division</label>
                <select id="reg-division" name="preferredDivision" value={form.preferredDivision} onChange={handleChange} required>
                  <option value="">Select</option>
                  {DIVISION_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>

                <label htmlFor="reg-ig">Instagram (optional)</label>
                <input id="reg-ig" type="text" name="instagram" value={form.instagram} onChange={handleChange} />

                {passwordError && (
                  <div role="alert" style={errorBannerStyle}>{passwordError}</div>
                )}

                <button type="button" className="cta" onClick={nextStep}>Next</button>
                <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-muted, #aaa)' }}>
                  Already registered?{' '}
                  <Link href="/login" style={{ color: 'var(--tekky-blue)', textDecoration: 'underline' }}>Login here</Link>
                </p>
              </div>
            )}

            {/* STEP 2 — Registration Type */}
            {step === 2 && (
              <div className="step" data-step="2">
                <h2 style={h2Style}>Registration Type</h2>

                {REGISTRATION_TYPE_OPTIONS.map((o, i) => (
                  <label key={o.value}>
                    <input
                      type="radio"
                      name="registrationType"
                      value={o.value}
                      checked={form.registrationType === o.value}
                      onChange={handleChange}
                      required={i === 0}
                    />
                    {' '}{o.label}
                  </label>
                ))}

                {form.registrationType === APPLICATION_TYPE.FULL_TEAM && (
                  <div style={{ paddingTop: "8px" }}>
                    <label htmlFor="reg-teamName">Team Name</label>
                    <input id="reg-teamName" type="text" name="teamName" value={form.teamName} onChange={handleChange} required />

                    <label htmlFor="reg-rosterSize">Estimated Roster Size</label>
                    <input id="reg-rosterSize" type="number" name="rosterSize" min="1" max="20" value={form.rosterSize} onChange={handleChange} required />

                    <LogoUploadZone
                      file={logoFile}
                      preview={logoPreview}
                      onSelect={(file, preview) => { setLogoFile(file); setLogoPreview(preview); }}
                      onRemove={() => { setLogoFile(null); setLogoPreview(null); }}
                    />
                  </div>
                )}

                <button type="button" className="cta" onClick={prevStep}>Back</button>
                <button type="button" className="cta" onClick={nextStep}>Next</button>
              </div>
            )}

            {/* STEP 3 — Competitive Intent */}
            {step === 3 && (
              <div className="step" data-step="3">
                <h2 style={h2Style}>Competitive Intent</h2>
                <label htmlFor="reg-intent">Why do you want to compete in TekkyFutbol?</label>
                <textarea
                  id="reg-intent"
                  name="reasonForCompeting"
                  value={form.reasonForCompeting}
                  onChange={handleChange}
                  required
                  style={{ resize: 'vertical', minHeight: 120 }}
                />
                <button type="button" className="cta" onClick={prevStep}>Back</button>
                <button type="button" className="cta" onClick={nextStep}>Next</button>
              </div>
            )}

            {/* STEP 4 — Confirmations + Submit */}
            {step === 4 && (
              <div className="step" data-step="4">
                <h2 style={h2Style}>Mandatory Confirmation</h2>

                <label>
                  <input type="checkbox" name="nameLogoConfirmation" checked={form.nameLogoConfirmation} onChange={handleChange} required />
                  {' '}I confirm that my team name and logo are original or authorized for use.
                </label>

                <label>
                  <input type="checkbox" name="nonGuarantee" checked={form.nonGuarantee} onChange={handleChange} required />
                  {' '}I understand that application does not guarantee acceptance.
                </label>

                <label>
                  <input type="checkbox" name="codeOfConduct" checked={form.codeOfConduct} onChange={handleChange} required />
                  {' '}I agree to follow league rules and code of conduct if approved.
                </label>

                {submitError && (
                  <div role="alert" style={errorBannerStyle}>{submitError}</div>
                )}

                <button type="button" className="cta" onClick={prevStep}>Back</button>
                <button type="submit" className="cta" disabled={submitting}>
                  {submitting ? <><span className="spinner" /> Submitting</> : 'Submit Application'}
                </button>
              </div>
            )}

            {/* STEP 5 — Confirmation */}
            {step === 5 && (
              <div>
                <h2 style={h2Style}>Application Received</h2>
                <p style={{ marginBottom: '1.5rem' }}>
                  Your application has been received and is under review. Selected players and teams
                  will be contacted directly with next steps, payment instructions, and onboarding details.
                </p>
                <Link className="cta" href="/login" style={{ marginRight: '1rem' }}>Login to Your Account</Link>
              </div>
            )}

          </form>
        </section>

        <GlowDivider />

        <div className="sec-cta" style={{ marginTop: '2rem' }}>
          <Link className="cta" href="/rules">View League Rules</Link>
          <Link className="cta" href="/schedule">View Schedule</Link>
        </div>
      </main>
    </>
  );
}
