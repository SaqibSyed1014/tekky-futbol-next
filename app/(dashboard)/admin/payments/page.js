'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAdminPayments } from '@/services/paymentsApi';

const STATUS_STYLES = {
  paid:      { color: '#00c864', bg: 'rgba(0,200,100,0.1)',    border: 'rgba(0,200,100,0.3)',    label: 'Paid'      },
  pending:   { color: '#ffb400', bg: 'rgba(255,180,0,0.1)',    border: 'rgba(255,180,0,0.3)',    label: 'Pending'   },
  failed:    { color: '#ff6b6b', bg: 'rgba(255,60,60,0.1)',    border: 'rgba(255,60,60,0.3)',    label: 'Failed'    },
  cancelled: { color: '#888',    bg: 'rgba(128,128,128,0.1)',  border: 'rgba(128,128,128,0.3)', label: 'Cancelled' },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.pending;
  return (
    <span style={{
      fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.3px',
      padding: '0.15rem 0.55rem', borderRadius: 4,
      background: s.bg, border: `1px solid ${s.border}`, color: s.color,
    }}>
      {s.label}
    </span>
  );
}

function fmtDate(val) {
  if (!val) return '—';
  return new Date(val).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

const FILTER_OPTIONS = [
  { value: '',          label: 'All' },
  { value: 'paid',      label: 'Paid' },
  { value: 'pending',   label: 'Pending' },
  { value: 'failed',    label: 'Failed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function AdminPaymentsPage() {
  const { user, loading: authLoading } = useAuth();

  const [payments,      setPayments]      = useState([]);
  const [initialLoad,   setInitialLoad]   = useState(true);
  const [tableLoading,  setTableLoading]  = useState(false);
  const [error,         setError]         = useState('');
  const [statusFilter,  setStatusFilter]  = useState('');
  const [count,         setCount]         = useState(0);

  async function load(sf = statusFilter, showTableLoader = true) {
    if (showTableLoader) setTableLoading(true);
    setError('');
    try {
      const data = await getAdminPayments({ status: sf });
      setPayments(data.results ?? data);
      setCount(data.count ?? (data.results ?? data).length);
    } catch {
      setError('Failed to load payments.');
    } finally {
      setTableLoading(false);
      setInitialLoad(false);
    }
  }

  useEffect(() => {
    if (authLoading || !user) return;
    load(statusFilter, false);
  }, [authLoading, user]);

  function handleFilter(val) {
    setStatusFilter(val);
    load(val);
  }

  if (authLoading || initialLoad) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
        <span className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
      </div>
    );
  }

  const paidCount    = payments.filter((p) => p.status === 'paid').length;
  const pendingCount = payments.filter((p) => p.status === 'pending').length;

  return (
    <div style={{ maxWidth: 900 }}>

      {/* Summary stats */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { label: 'Total Records', value: count,        color: '#0074ff' },
          { label: 'Paid',          value: paidCount,    color: '#00c864' },
          { label: 'Pending',       value: pendingCount, color: '#ffb400' },
        ].map((s) => (
          <div key={s.label} style={{
            flex: '1 1 140px',
            background: '#000', border: '1px solid rgba(0,116,255,0.2)',
            borderRadius: 10, padding: '1rem 1.25rem',
          }}>
            <div style={{ fontSize: '1.6rem', fontFamily: "'Bebas Neue', sans-serif", color: s.color, letterSpacing: '1px' }}>
              {s.value}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Filter row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleFilter(opt.value)}
            style={{
              padding: '0.35rem 0.9rem', borderRadius: 6, fontSize: '0.82rem', fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit',
              background: statusFilter === opt.value ? 'rgba(0,116,255,0.18)' : 'transparent',
              border: `1px solid ${statusFilter === opt.value ? 'rgba(0,116,255,0.5)' : 'rgba(255,255,255,0.1)'}`,
              color: statusFilter === opt.value ? '#fff' : 'var(--muted)',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {error && (
        <div style={{
          padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1rem',
          background: 'rgba(255,60,60,0.08)', border: '1px solid rgba(255,60,60,0.25)',
          color: '#ff6b6b', fontSize: '0.88rem',
        }}>
          <i className="fa-solid fa-circle-xmark" style={{ marginRight: '0.5rem' }} />
          {error}
        </div>
      )}

      {/* Table */}
      <div style={{ position: 'relative', background: '#000', border: '1px solid rgba(0,116,255,0.2)', borderRadius: 12, overflow: 'hidden' }}>
        {tableLoading && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5,
          }}>
            <span className="spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
          </div>
        )}

        {payments.length === 0 && !tableLoading ? (
          <p style={{ padding: '2rem', color: 'var(--muted)', textAlign: 'center', fontSize: '0.9rem' }}>
            No payment records found.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(0,116,255,0.1)' }}>
                  {['Player', 'Role', 'Amount', 'Status', 'Paid On'].map((h) => (
                    <th key={h} style={{
                      padding: '0.65rem 1rem', textAlign: 'left',
                      color: 'var(--muted)', fontWeight: 600, fontSize: '0.75rem',
                      textTransform: 'uppercase', letterSpacing: '0.4px', whiteSpace: 'nowrap',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '0.7rem 1rem', whiteSpace: 'nowrap' }}>
                      <div style={{ fontWeight: 500, color: '#fff' }}>{p.user_name || '—'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{p.user_email}</div>
                    </td>
                    <td style={{ padding: '0.7rem 1rem', color: p.is_captain ? '#f0b429' : '#b6c2d3', fontSize: '0.8rem', fontWeight: 600 }}>
                      {p.is_captain ? 'Captain' : 'Player'}
                    </td>
                    <td style={{ padding: '0.7rem 1rem', color: '#fff', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', letterSpacing: '0.5px' }}>
                      ${p.amount}
                    </td>
                    <td style={{ padding: '0.7rem 1rem' }}>
                      <StatusBadge status={p.status} />
                    </td>
                    <td style={{ padding: '0.7rem 1rem', color: '#b6c2d3', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                      {fmtDate(p.paid_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
