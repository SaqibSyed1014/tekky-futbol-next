'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getAdminTickets } from '@/services/ticketsApi';
import { AdminLoader, AdminStarsDivider } from '@/components/admin/ChicagoStar';
import StatCard from '@/components/admin/StatCard';
import StatusBadge from '@/components/admin/StatusBadge';
import { PremiumSelect } from '@/components/dashboard/DashboardControls';
import { formatPrice } from '@/lib/shopUtils';

function fmtDate(val) {
  if (!val) return '—';
  return new Date(val).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

const STATUS_FILTERS = [
  { value: '',           label: 'All' },
  { value: 'paid',       label: 'Paid' },
  { value: 'checked_in', label: 'Checked In' },
];

const TIER_LABELS = {
  single_match: 'Single Match Pass',
  supporter_bundle: 'Supporter Bundle',
  season_pass: 'Season Access Pass',
  playoff_pass: 'Playoff Match Pass',
  finale_pass: 'Finale Celebration Pass',
};

export default function AdminTicketsPage() {
  const { user, loading: authLoading } = useAuth();

  const [tickets,      setTickets]      = useState([]);
  const [initialLoad,  setInitialLoad]  = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [error,        setError]        = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [count,        setCount]        = useState(0);

  async function load(sf = statusFilter, showTableLoader = true) {
    if (showTableLoader) setTableLoading(true);
    setError('');
    try {
      const data = await getAdminTickets({ status: sf });
      setTickets(data.results ?? data);
      setCount(data.count ?? (data.results ?? data).length);
    } catch {
      setError('Failed to load tickets.');
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
    return <AdminLoader />;
  }

  const checkedInCount = tickets.filter((t) => t.status === 'checked_in').length;

  return (
    <div className="ad-page" style={{ maxWidth: 1000 }}>
      <div className="ad-page-head">
        <p className="ad-kicker">Match Passes</p>
        <h1 className="ad-title">Tickets</h1>
        <p className="ad-sub">Every purchased match pass — who holds it, and whether it&apos;s been scanned.</p>
        <div className="sec-cta" style={{ marginTop: '0.75rem' }}>
          <Link className="cta" href="/admin/tickets/scan">
            <i className="fa-solid fa-qrcode" style={{ marginRight: '0.5rem' }} />
            Open Gate Scanner
          </Link>
        </div>
      </div>
      <AdminStarsDivider />

      <div className="ad-stats">
        <StatCard label="Total Passes" value={count} />
        <StatCard label="Checked In" value={checkedInCount} />
      </div>

      <div className="ad-toolbar">
        <PremiumSelect
          className="db-select--compact"
          aria-label="Filter by status"
          value={statusFilter}
          onChange={(e) => handleFilter(e.target.value)}
        >
          {STATUS_FILTERS.map((opt) => (
            <option key={opt.value || 'all'} value={opt.value}>{opt.label}</option>
          ))}
        </PremiumSelect>
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

      <div className="ad-panel" style={{ position: 'relative' }}>
        {tableLoading && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5,
          }}>
            <span className="spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
          </div>
        )}

        {tickets.length === 0 && !tableLoading ? (
          <p style={{ padding: '2rem', color: 'var(--muted)', textAlign: 'center', fontSize: '0.9rem' }}>
            No ticket purchases found.
          </p>
        ) : (
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead>
                <tr>
                  {['Buyer', 'Pass', 'Amount', 'Status', 'Purchased'].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <div className="ad-table__name">{t.buyer_name || (t.is_guest ? 'Guest' : t.buyer_email)}</div>
                      <div className="ad-table__meta">{t.buyer_email}</div>
                    </td>
                    <td>
                      <div className="ad-table__name">{TIER_LABELS[t.tier] || t.tier}</div>
                      {t.division && (
                        <div className="ad-table__meta">
                          {t.division === 'north' ? 'North' : 'South'} Division
                          {t.week_number ? ` — Week ${t.week_number}` : ''}
                        </div>
                      )}
                    </td>
                    <td className="ad-table__num">{formatPrice((t.amount_cents || 0) / 100)}</td>
                    <td>
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="ad-table__date">{fmtDate(t.created_at)}</td>
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
