'use client';

import { useState } from 'react';

/**
 * Reusable hook that wraps the Web3Forms submission logic.
 * Mirrors the original scripts/web3form.js handleFormSubmit behaviour.
 *
 * Returns { submitting, handleSubmit }
 *
 *   handleSubmit(e, formData, onSuccess, onError?)
 *
 * formData must be either:
 *   - a plain object  { access_key, name, email, … }
 *   - a FormData instance (for file uploads, e.g. registration)
 */
export function useWeb3Form() {
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e, formData, onSuccess, onError) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const isFormData = formData instanceof FormData;

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: isFormData
          ? undefined
          : { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: isFormData ? formData : JSON.stringify(formData),
      });

      if (response.status === 200) {
        onSuccess?.();
      } else {
        onError?.('Submission failed. Please try again.');
      }
    } catch (err) {
      console.error('Form Error:', err);
      onError?.('An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  }

  return { submitting, handleSubmit };
}
