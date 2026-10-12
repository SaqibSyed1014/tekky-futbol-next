'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createStaff, deleteStaff, getAdminStaff } from '@/services/ticketsApi';
import { formatApiError } from '@/services/api';
import { AdminLoader, AdminStarsDivider } from '@/components/admin/ChicagoStar';
import { PremiumField, PremiumInput } from '@/components/dashboard/DashboardControls';

function Banner({ type, children }) {
  if (!children) return null;
  const s = type === 'error'
    ? { bg: 'rgba(255,60,60,0.1)', border: 'rgba(255,60,60,0.35)', color: '#ff6b6b', icon: 'fa-solid fa-circle-xmark' }
    : { bg: 'rgba(0,200,100,0.1)', border: 'rgba(0,200,100,0.35)', color: '#00c864', icon: 'fa-solid fa-circle-check' };
  return (
    <div style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 8, padding: '0.75rem 1rem', color: s.color, fontSize: '0.88rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <i className={s.icon} /><span>{children}</span>
    </div>
  );
}

function AddStaffModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ name: '', email: '', unique_id: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function set(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await createStaff(form);
      onCreated();
      onClose();
    } catch (err) {
      setError(formatApiError(err, 'Failed to add staff member.'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="ad-overlay ad-overlay--center" onClick={onClose}>
      <div className="ad-modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h3 className="ad-modal__title">Add Staff</h3>
          <button type="button" className="ad-modal__close" onClick={onClose} aria-label="Close">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <Banner type="error">{error}</Banner>

        <form onSubmit={handleSave}>
          <PremiumField label="Name">
            <PremiumInput type="text" value={form.name} onChange={(e) => set('name', e.target.value)} required />
          </PremiumField>
          <PremiumField label="Email (optional)">
            <PremiumInput type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
          </PremiumField>
          <PremiumField label="Unique ID" hint="Assign this yourself — exactly 6 digits, not generated automatically.">
            <PremiumInput
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={form.unique_id}
              onChange={(e) => set('unique_id', e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
            />
          </PremiumField>

          <div className="ad-modal__actions">
            <button type="button" className="ad-btn" style={{ height: '42px' }} onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="cta" disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 1.5rem' }}>
              {saving ? <><span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Adding…</> : <><i className="fa-solid fa-plus" /> Add Staff</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminStaffPage() {
  const { user, loading: authLoading } = useAuth();

  const [staff, setStaff] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState('');

  async function load() {
    setError('');
    try {
      const data = await getAdminStaff();
      setStaff(data);
    } catch {
      setError('Failed to load staff.');
    } finally {
      setInitialLoad(false);
    }
  }

  useEffect(() => {
    if (authLoading || !user) return;
    load();
  }, [authLoading, user]);

  async function handleDelete(id) {
    if (!window.confirm('Remove this staff member? They will no longer be able to verify tickets.')) return;
    setDeletingId(id);
    setError('');
    try {
      await deleteStaff(id);
      setStaff((prev) => prev.filter((s) => s.id !== id));
    } catch {
      setError('Failed to remove staff member.');
    } finally {
      setDeletingId('');
    }
  }

  if (authLoading || initialLoad) {
    return <AdminLoader />;
  }

  return (
    <div className="ad-page" style={{ maxWidth: 900 }}>
      <div className="ad-page-head">
        <p className="ad-kicker">Gate Verification</p>
        <h1 className="ad-title">Staff</h1>
        <p className="ad-sub">The roster of staff who can verify tickets at the gate.</p>
        <div className="sec-cta on-right" style={{ marginTop: '0.75rem' }}>
          <button type="button" className="cta" onClick={() => setModalOpen(true)}>
            <i className="fa-solid fa-plus" style={{ marginRight: '0.5rem' }} />
            Add Staff
          </button>
        </div>
      </div>
      <AdminStarsDivider />

      <Banner type="error">{error}</Banner>

      <div className="ad-panel">
        {staff.length === 0 ? (
          <p style={{ padding: '2rem', color: 'var(--muted)', textAlign: 'center', fontSize: '0.9rem' }}>
            No staff members yet.
          </p>
        ) : (
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead>
                <tr>
                  {['Name', 'Email', 'Unique ID', ''].map((h) => <th key={h}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {staff.map((s) => (
                  <tr key={s.id}>
                    <td className="ad-table__name">{s.name}</td>
                    <td className="ad-table__meta">{s.email || '—'}</td>
                    <td style={{ fontFamily: 'var(--ad-display)', letterSpacing: '2px' }}>{s.unique_id}</td>
                    <td className="ad-table__col-actions">
                      <button
                        type="button"
                        className="ad-btn"
                        onClick={() => handleDelete(s.id)}
                        disabled={deletingId === s.id}
                        aria-label={`Remove ${s.name}`}
                      >
                        {deletingId === s.id
                          ? <span className="spinner" style={{ width: 12, height: 12, borderWidth: 2 }} />
                          : <i className="fa-solid fa-trash" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && <AddStaffModal onClose={() => setModalOpen(false)} onCreated={load} />}
    </div>
  );
}
