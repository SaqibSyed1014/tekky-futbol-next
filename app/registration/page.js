'use client';

import { useState } from 'react';
import Link from 'next/link';
import GlowDivider from '@/components/ui/GlowDivider';

const TOTAL_STEPS = 5;

const INITIAL_FORM = {
  access_key: 'f91205be-f6c8-49cf-961a-ac2de2adca7f',
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

export default function RegistrationPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM);
  const [logoFile, setLogoFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  function nextStep() {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  function prevStep() {
    setStep((s) => Math.max(s - 1, 1));
  }

  function goToFirst() {
    setStep(1);
    setForm(INITIAL_FORM);
    setLogoFile(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (logoFile) formData.append('logoAttachment', logoFile);

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });

      if (response.status === 200) {
        nextStep(); // advance to step 5 (confirmation)
        setForm(INITIAL_FORM);
        setLogoFile(null);
      }
    } catch (err) {
      console.error('Registration Error:', err);
    } finally {
      setSubmitting(false);
    }
  }

  const stepStyles = {
    h2: { fontFamily: "'Bebas Neue', sans-serif", color: 'var(--tekky-blue)', fontSize: '2rem', marginBottom: '1.2rem' },
  };

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
          <form
            onSubmit={handleSubmit}
            style={{
              background: 'rgba(0,0,0,0.45)',
              border: '1px solid rgba(0,116,255,0.4)',
              borderRadius: 16,
              padding: '2rem',
              marginBottom: '1rem',
              boxShadow: '0 0 25px rgba(0,116,255,0.25)',
            }}
          >
            {/* STEP 1 — Player Info */}
            {step === 1 && (
              <div>
                <h2 style={stepStyles.h2}>Player / Captain Info</h2>
                <label htmlFor="reg-name">Full Name</label>
                <input id="reg-name" type="text" name="name" value={form.name} onChange={handleChange} required />

                <label htmlFor="reg-phone">Phone Number</label>
                <input id="reg-phone" type="tel" name="phone" value={form.phone} onChange={handleChange} required />

                <label htmlFor="reg-email">Email</label>
                <input id="reg-email" type="email" name="email" value={form.email} onChange={handleChange} required />

                <label htmlFor="reg-gender">Gender</label>
                <select id="reg-gender" name="gender" value={form.gender} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                </select>

                <label htmlFor="reg-division">Preferred Division</label>
                <select id="reg-division" name="preferredDivision" value={form.preferredDivision} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="North">North</option>
                  <option value="South">South</option>
                </select>

                <label htmlFor="reg-ig">Instagram (optional)</label>
                <input id="reg-ig" type="text" name="instagram" value={form.instagram} onChange={handleChange} />

                <button type="button" className="cta" onClick={nextStep}>Next</button>
              </div>
            )}

            {/* STEP 2 — Registration Type */}
            {step === 2 && (
              <div>
                <h2 style={stepStyles.h2}>Registration Type</h2>

                <label>
                  <input type="radio" name="registrationType" value="Free Agent" checked={form.registrationType === 'Free Agent'} onChange={handleChange} required />
                  {' '}Free Agent
                </label>

                <label>
                  <input type="radio" name="registrationType" value="Full Team" checked={form.registrationType === 'Full Team'} onChange={handleChange} />
                  {' '}Full Team Registration
                </label>

                {form.registrationType === 'Full Team' && (
                  <div>
                    <label htmlFor="reg-teamName">Team Name</label>
                    <input id="reg-teamName" type="text" name="teamName" value={form.teamName} onChange={handleChange} />

                    <label htmlFor="reg-rosterSize">Estimated Roster Size</label>
                    <input id="reg-rosterSize" type="number" name="rosterSize" value={form.rosterSize} onChange={handleChange} />

                    <label htmlFor="reg-logo">Logo Upload</label>
                    <input
                      id="reg-logo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file && file.size / 1024 > 5000) {
                          alert('Please upload a file less than 5 MB');
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
              <div>
                <h2 style={stepStyles.h2}>Competitive Intent</h2>
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

            {/* STEP 4 — Confirmations */}
            {step === 4 && (
              <div>
                <h2 style={stepStyles.h2}>Mandatory Confirmation</h2>

                <label>
                  <input
                    type="checkbox"
                    name="nameLogoConfirmation"
                    checked={form.nameLogoConfirmation}
                    onChange={handleChange}
                    required
                  />
                  {' '}I confirm that my team name and logo are original or authorized for use.
                </label>

                <label>
                  <input
                    type="checkbox"
                    name="nonGuarantee"
                    checked={form.nonGuarantee}
                    onChange={handleChange}
                    required
                  />
                  {' '}I understand that application does not guarantee acceptance.
                </label>

                <label>
                  <input
                    type="checkbox"
                    name="codeOfConduct"
                    checked={form.codeOfConduct}
                    onChange={handleChange}
                    required
                  />
                  {' '}I agree to follow league rules and code of conduct if approved.
                </label>

                <button type="button" className="cta" onClick={prevStep}>Back</button>
                <button type="submit" className="cta" disabled={submitting}>
                  {submitting ? (
                    <>
                      <span className="spinner" />
                      Submitting
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </div>
            )}

            {/* STEP 5 — Confirmation */}
            {step === 5 && (
              <div>
                <h2 style={stepStyles.h2}>TekkyFutbol Application Received</h2>
                <p style={{ marginBottom: '1.5rem' }}>
                  Your application has been received and is under review. Selected players and teams
                  will be contacted directly with next steps, payment instructions, and onboarding details.
                </p>
                <button type="button" className="cta" onClick={goToFirst}>Back</button>
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
