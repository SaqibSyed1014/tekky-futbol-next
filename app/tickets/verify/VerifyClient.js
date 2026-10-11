'use client';

import { useEffect, useState } from 'react';
import Modal from '@/components/ui/Modal';
import { formatApiError } from '@/services/api';
import { fetchTicketVerifyDetails, verifyTicket } from '@/services/ticketsApi';

export default function VerifyClient() {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [ticket, setTicket] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [staffId, setStaffId] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [modalError, setModalError] = useState('');
  const [verifiedResult, setVerifiedResult] = useState(null);

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('token');
    if (!t) {
      setLoadError('Missing QR code.');
      setLoading(false);
      return;
    }
    setToken(t);
    fetchTicketVerifyDetails(t)
      .then((data) => setTicket(data))
      .catch((err) => setLoadError(formatApiError(err, 'This code is invalid or expired.')))
      .finally(() => setLoading(false));
  }, []);

  async function handleVerifySubmit(e) {
    e.preventDefault();
    if (!/^\d{6}$/.test(staffId.trim())) {
      setModalError('Enter your 6-digit staff ID.');
      return;
    }
    setVerifying(true);
    setModalError('');
    try {
      const data = await verifyTicket(token, staffId.trim());
      setVerifiedResult(data);
      setModalOpen(false);
    } catch (err) {
      setModalError(formatApiError(err, 'Could not verify. Please try again.'));
    } finally {
      setVerifying(false);
    }
  }

  function openModal() {
    setStaffId('');
    setModalError('');
    setModalOpen(true);
  }

  const isCheckedIn = verifiedResult
    ? true
    : ticket?.status === 'checked_in';
  const checkedInBy = verifiedResult ? verifiedResult.checked_in_by : ticket?.checked_in_by;
  const checkedInAt = verifiedResult ? verifiedResult.checked_in_at : ticket?.checked_in_at;
  const justVerified = verifiedResult ? !verifiedResult.already_checked_in : false;

  return (
    <main style={{ maxWidth: 480, margin: '4rem auto', padding: '0 1.25rem', textAlign: 'center' }}>
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
          <span className="spinner" />
        </div>
      )}

      {!loading && loadError && (
        <>
          <h1>Invalid Code</h1>
          <p className="subtext">{loadError}</p>
        </>
      )}

      {!loading && ticket && (
        <>
          <h1>{isCheckedIn ? (justVerified ? 'Verified' : 'Already Checked In') : 'Match Pass'}</h1>

          <div
            style={{
              background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 12,
              padding: '1.5rem', margin: '1.5rem 0', textAlign: 'left',
            }}
          >
            <p className="muted" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>
              Pass
            </p>
            <p style={{ fontWeight: 700, marginBottom: '1rem' }}>{ticket.product_name}</p>

            <p className="muted" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>
              Holder
            </p>
            <p style={{ fontWeight: 700, marginBottom: '0.15rem' }}>{ticket.buyer_name || 'Guest'}</p>
            <p className="muted" style={{ fontSize: '0.85rem' }}>{ticket.buyer_email}</p>
          </div>

          {isCheckedIn ? (
            <p className="subtext">
              {justVerified ? 'This pass has just been verified.' : 'This pass was already checked in.'}
              {checkedInBy && <> Verified by <strong>{checkedInBy}</strong></>}
              {checkedInAt && <> at {new Date(checkedInAt).toLocaleTimeString()}</>}.
            </p>
          ) : (
            <div className="sec-cta">
              <button type="button" className="cta" onClick={openModal}>Verify Ticket</button>
            </div>
          )}
        </>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h3>Staff Verification</h3>
        <p className="subtext">Enter your 6-digit staff ID to verify this pass.</p>
        <form onSubmit={handleVerifySubmit} style={{ paddingTop: '1rem' }}>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="123456"
            value={staffId}
            onChange={(e) => setStaffId(e.target.value.replace(/\D/g, '').slice(0, 6))}
            style={{ textAlign: 'center', letterSpacing: '0.3em', fontSize: '1.2rem' }}
            autoFocus
            required
          />
          {modalError && (
            <p style={{ color: '#ff6b6b', fontSize: '0.85rem', marginTop: '0.5rem' }}>{modalError}</p>
          )}
          <button type="submit" className="cta close-overlay" disabled={verifying}>
            {verifying ? <><span className="spinner" />Verifying</> : 'Confirm'}
          </button>
        </form>
      </Modal>
    </main>
  );
}
