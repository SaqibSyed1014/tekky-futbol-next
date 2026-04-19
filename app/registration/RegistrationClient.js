'use client';

import { useState } from 'react';
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

export default function RegistrationClient() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM);
  const [logoFile, setLogoFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

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
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  function prevStep() {
    setStep((s) => Math.max(s - 1, 1));
  }

  function goToFirst() {
    setStep(1);
    setForm(INITIAL_FORM);
    setLogoFile(null);
    setSubmitError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');

    // Build the application payload — no hardcoded values
    const payload = {
      applicationType: form.registrationType, // already APPLICATION_TYPE constant value
      name:              form.name,
      email:             form.email,
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
      // 1 — Submit to /applications
      await submitApplication(payload, logoFile);

      // 2 — Email notification via web3forms (non-blocking)
      const w3key = process.env.NEXT_PUBLIC_WEB3FORMS_REGISTRATION_KEY;
      if (w3key) {
        const fd = new FormData();
        fd.append('access_key', w3key);
        Object.entries(payload).forEach(([k, v]) => fd.append(k, String(v)));
        if (logoFile) fd.append('logoAttachment', logoFile);
        fetch('https://api.web3forms.com/submit', { method: 'POST', body: fd }).catch(() => {});
      }

      // Advance to confirmation screen
      setStep(TOTAL_STEPS);
      setForm(INITIAL_FORM);
      setLogoFile(null);
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

                <button type="button" className="cta" onClick={nextStep}>Next</button>
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
                  <div>
                    <label htmlFor="reg-teamName">Team Name</label>
                    <input id="reg-teamName" type="text" name="teamName" value={form.teamName} onChange={handleChange} required />

                    <label htmlFor="reg-rosterSize">Estimated Roster Size</label>
                    <input id="reg-rosterSize" type="number" name="rosterSize" min="1" max="20" value={form.rosterSize} onChange={handleChange} required />

                    <label htmlFor="reg-logo">Logo Upload</label>
                    <input
                      id="reg-logo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file && file.size / 1024 > MAX_LOGO_SIZE_KB) {
                          alert(`Please upload a file smaller than ${MAX_LOGO_SIZE_KB / 1000} MB`);
                          e.target.value = '';
                          return;
                        }
                        setLogoFile(file || null);
                      }}
                    />
                    <small>
                      By submitting a logo, you confirm you own the rights or have authorization to use it.
                      TekkyFutbol reserves the right to reject or modify any branding that infringes on intellectual property.
                    </small>
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
                <button type="button" className="cta" onClick={goToFirst}>Submit Another</button>
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
