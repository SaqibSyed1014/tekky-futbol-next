'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getMyTeam,
  getMyRoster,
  getLinkInvite,
  regenerateLinkInvite,
  getFreeAgents,
  sendDirectInvite,
  revokeInvite,
  removePlayer,
} from '@/services/teamsApi';

// ─── Shared primitives ────────────────────────────────────────────────────────

function Label({ children }) {
  return (
    <p style={{
      fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase',
      letterSpacing: '0.5px', margin: '0 0 0.2rem', fontWeight: 600,
    }}>
      {children}
    </p>
  );
}

function Value({ children, color }) {
  return (
    <p style={{ fontSize: '0.92rem', color: color || 'var(--fg)', margin: 0 }}>
      {children || '—'}
    </p>
  );
}

function SectionTitle({ children }) {
  return (
    <h3 style={{
      fontFamily: "'Bebas Neue', sans-serif",
      fontSize: '1.1rem', letterSpacing: '1.5px',
      color: 'var(--tekky-blue)', textTransform: 'uppercase',
      margin: '0 0 0.9rem', borderBottom: '1px solid rgba(0,116,255,0.15)',
      paddingBottom: '0.35rem',
    }}>
      {children}
    </h3>
  );
}

function Card({ children, style }) {
  return (
    <div style={{
      background: '#000',
      border: '1px solid rgba(0,116,255,0.2)',
      borderRadius: 12,
      padding: '1.4rem 1.5rem',
      boxShadow: '0 0 16px rgba(0,116,255,0.06)',
      ...style,
    }}>
      {children}
    </div>
  );
}

function Btn({ onClick, disabled, color = 'var(--tekky-blue)', children, small }) {
  const pad = small ? '0.3rem 0.75rem' : '0.45rem 1.1rem';
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: pad, borderRadius: 6,
        border: `1px solid ${color}`,
        background: 'transparent', color,
        fontSize: small ? '0.8rem' : '0.88rem', fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        transition: 'background 0.15s', fontFamily: 'inherit',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = `${color}22`; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
    >
      {children}
    </button>
  );
}

function StatusBadge({ status }) {
  const map = {
    forming:  { bg: 'rgba(255,180,0,0.12)',  border: 'rgba(255,180,0,0.4)',  text: '#ffb400', label: 'Forming'  },
    official: { bg: 'rgba(0,200,100,0.12)',  border: 'rgba(0,200,100,0.4)', text: '#00c864', label: 'Official' },
    pending:  { bg: 'rgba(255,180,0,0.12)',  border: 'rgba(255,180,0,0.4)',  text: '#ffb400', label: 'Pending Approval' },
    approved: { bg: 'rgba(0,200,100,0.12)',  border: 'rgba(0,200,100,0.4)', text: '#00c864', label: 'Approved' },
    invited:  { bg: 'rgba(0,116,255,0.12)',  border: 'rgba(0,116,255,0.4)', text: '#0074ff', label: 'Invited'  },
  };
  const s = map[status] ?? map.pending;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
      padding: '0.25rem 0.7rem', borderRadius: 40,
      fontSize: '0.8rem', fontWeight: 600,
      background: s.bg, border: `1px solid ${s.border}`, color: s.text,
      whiteSpace: 'nowrap',
    }}>
      {s.label}
    </span>
  );
}

function Skeleton({ h = 48 }) {
  return (
    <div style={{
      height: h, borderRadius: 8,
      background: 'rgba(0,116,255,0.05)',
      border: '1px solid rgba(0,116,255,0.1)',
      animation: 'cpulse 1.5s ease-in-out infinite',
    }} />
  );
}

// ─── Roster progress bar ─────────────────────────────────────────────────────

function RosterProgress({ approved, max }) {
  const pct = max > 0 ? Math.min(100, (approved / max) * 100) : 0;
  const color = pct >= 100 ? '#00c864' : pct >= 60 ? '#ffb400' : 'var(--tekky-blue)';
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Roster Progress
        </span>
        <span style={{ fontSize: '0.9rem', fontWeight: 700, color }}>
          {approved}/{max}
        </span>
      </div>
      <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: color,
          borderRadius: 999,
          transition: 'width 0.4s ease',
          boxShadow: `0 0 8px ${color}66`,
        }} />
      </div>
      <p style={{ fontSize: '0.75rem', color: 'var(--muted)', margin: '0.35rem 0 0' }}>
        {max - approved > 0
          ? `${max - approved} slot${max - approved !== 1 ? 's' : ''} remaining`
          : 'Roster complete 🎉'}
      </p>
    </div>
  );
}

// ─── Roster table ─────────────────────────────────────────────────────────────

function RosterTable({ title, rows, bucketColor, onRemove, removingId, showRemove }) {
  if (rows.length === 0) return null;
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
        <span style={{
          display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
          background: bucketColor, boxShadow: `0 0 6px ${bucketColor}`,
        }} />
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '0.95rem', color: bucketColor, letterSpacing: '1px' }}>
          {title} ({rows.length})
        </span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(0,116,255,0.15)' }}>
              {['Name', 'Email', 'Division', 'Status', showRemove && 'Action'].filter(Boolean).map((h) => (
                <th key={h} style={{
                  textAlign: 'left', padding: '0.45rem 0.6rem',
                  color: 'var(--muted)', fontSize: '0.72rem',
                  fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.5px',
                  whiteSpace: 'nowrap',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => (
              <tr
                key={m.id}
                style={{ borderBottom: '1px solid rgba(0,116,255,0.07)', transition: 'background 0.12s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,116,255,0.04)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <td style={{ padding: '0.6rem 0.6rem', color: 'var(--fg)', fontWeight: 600, fontSize: '0.9rem' }}>
                  {m.name || '—'}
                </td>
                <td style={{ padding: '0.6rem 0.6rem', color: 'var(--muted)', fontSize: '0.85rem' }}>
                  {m.email}
                </td>
                <td style={{ padding: '0.6rem 0.6rem', color: 'var(--muted)', fontSize: '0.85rem', textTransform: 'capitalize' }}>
                  {m.division || '—'}
                </td>
                <td style={{ padding: '0.6rem 0.6rem' }}>
                  <StatusBadge status={m.membershipBucket} />
                </td>
                {showRemove && (
                  <td style={{ padding: '0.6rem 0.6rem' }}>
                    <Btn
                      small
                      color="#ff3c3c"
                      disabled={removingId === m.userId}
                      onClick={() => onRemove(m.userId)}
                    >
                      {removingId === m.userId ? '…' : 'Remove'}
                    </Btn>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Invite link panel ────────────────────────────────────────────────────────

function InviteLinkPanel() {
  const [invite, setInvite]     = useState(null);
  const [loading, setLoading]   = useState(true);
  const [regen, setRegen]       = useState(false);
  const [copied, setCopied]     = useState(false);
  const [error, setError]       = useState('');

  useEffect(() => {
    getLinkInvite()
      .then(setInvite)
      .catch(() => setError('Could not load invite link.'))
      .finally(() => setLoading(false));
  }, []);

  async function handleRegenerate() {
    setRegen(true);
    setError('');
    try {
      const fresh = await regenerateLinkInvite();
      setInvite(fresh);
    } catch {
      setError('Failed to regenerate link.');
    } finally {
      setRegen(false);
    }
  }

  function handleCopy() {
    if (!invite?.inviteUrl) return;
    navigator.clipboard.writeText(invite.inviteUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <Card>
      <SectionTitle>Invite Link</SectionTitle>
      {loading && <Skeleton h={60} />}
      {!loading && error && (
        <p style={{ color: '#ff6b6b', fontSize: '0.88rem' }}>{error}</p>
      )}
      {!loading && invite && (
        <>
          <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
            Share this link with non-registered players. Anyone who registers via this link is auto-added to your team (pending admin approval).
          </p>
          {/* URL display */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(0,116,255,0.06)',
            border: '1px solid rgba(0,116,255,0.2)',
            borderRadius: 8, padding: '0.6rem 0.9rem', marginBottom: '0.85rem',
            flexWrap: 'wrap',
          }}>
            <span style={{
              flex: 1, fontSize: '0.8rem', color: '#aaa',
              wordBreak: 'break-all', fontFamily: 'monospace',
            }}>
              {invite.inviteUrl}
            </span>
          </div>

          {/* Expiry + actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <Btn onClick={handleCopy} color="var(--tekky-blue)">
              <i className={`fa-solid fa-${copied ? 'check' : 'copy'}`} style={{ marginRight: '0.4rem' }} />
              {copied ? 'Copied!' : 'Copy Link'}
            </Btn>
            <Btn onClick={handleRegenerate} disabled={regen} color="#ffb400">
              <i className="fa-solid fa-rotate-right" style={{ marginRight: '0.4rem' }} />
              {regen ? 'Regenerating…' : 'New Link'}
            </Btn>
            {invite.expiresAt && (
              <span style={{ fontSize: '0.75rem', color: 'var(--muted)', marginLeft: 'auto' }}>
                Expires {new Date(invite.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            )}
          </div>
        </>
      )}
    </Card>
  );
}

// ─── Free agent pool panel ────────────────────────────────────────────────────

function FreeAgentPool() {
  const [agents, setAgents]     = useState([]);
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(1);
  const [search, setSearch]     = useState('');
  const [division, setDivision] = useState('');
  const [loading, setLoading]   = useState(true);
  const [inviting, setInviting] = useState({});
  const [invited, setInvited]   = useState({});
  const [errors, setErrors]     = useState({});

  const fetchAgents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getFreeAgents({ search, division, page });
      setAgents(res.results ?? []);
      setTotal(res.count ?? 0);
    } catch {
      setAgents([]);
    } finally {
      setLoading(false);
    }
  }, [search, division, page]);

  useEffect(() => { fetchAgents(); }, [fetchAgents]);
  useEffect(() => { setPage(1); }, [search, division]);

  async function handleInvite(playerId) {
    setInviting((p) => ({ ...p, [playerId]: true }));
    setErrors((e) => { const n = { ...e }; delete n[playerId]; return n; });
    try {
      await sendDirectInvite(playerId);
      setInvited((p) => ({ ...p, [playerId]: true }));
    } catch (err) {
      setErrors((e) => ({ ...e, [playerId]: err.message || 'Failed to send invite.' }));
    } finally {
      setInviting((p) => { const n = { ...p }; delete n[playerId]; return n; });
    }
  }

  const totalPages = Math.ceil(total / 20);

  return (
    <Card>
      <SectionTitle>Free Agent Pool</SectionTitle>
      <p style={{ fontSize: '0.82rem', color: 'var(--muted)', margin: '0 0 1rem', lineHeight: 1.5 }}>
        Browse admin-approved free agents and send direct invites.
      </p>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          style={{
            flex: 1, minWidth: 200, padding: '0.5rem 0.8rem',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(0,116,255,0.25)', borderRadius: 6,
            color: 'var(--fg)', fontSize: '0.88rem', fontFamily: 'inherit',
            outline: 'none',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(0,116,255,0.6)'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,116,255,0.25)'; }}
        />
        <select
          value={division}
          onChange={(e) => setDivision(e.target.value)}
          style={{
            padding: '0.5rem 0.8rem',
            background: '#0a0a0a',
            border: '1px solid rgba(0,116,255,0.25)', borderRadius: 6,
            color: division ? 'var(--fg)' : 'var(--muted)',
            fontSize: '0.88rem', fontFamily: 'inherit', outline: 'none', cursor: 'pointer',
          }}
        >
          <option value="">All divisions</option>
          <option value="north">North</option>
          <option value="south">South</option>
        </select>
      </div>

      {/* Results */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[1, 2, 3].map((i) => <Skeleton key={i} h={52} />)}
        </div>
      )}

      {!loading && agents.length === 0 && (
        <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '1.5rem 0', fontSize: '0.9rem' }}>
          No free agents found{search ? ` matching "${search}"` : ''}.
        </p>
      )}

      {!loading && agents.length > 0 && (
        <>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(0,116,255,0.15)' }}>
                  {['Player', 'Division', 'Instagram', 'Action'].map((h) => (
                    <th key={h} style={{
                      textAlign: 'left', padding: '0.4rem 0.6rem',
                      color: 'var(--muted)', fontSize: '0.72rem',
                      fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.5px',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {agents.map((a) => (
                  <>
                    <tr
                      key={a.userId}
                      style={{ borderBottom: '1px solid rgba(0,116,255,0.07)', transition: 'background 0.12s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,116,255,0.04)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <td style={{ padding: '0.6rem 0.6rem' }}>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', color: 'var(--fg)' }}>{a.name || '—'}</p>
                        <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)' }}>{a.email}</p>
                      </td>
                      <td style={{ padding: '0.6rem 0.6rem', color: 'var(--muted)', fontSize: '0.85rem', textTransform: 'capitalize' }}>
                        {a.division || '—'}
                      </td>
                      <td style={{ padding: '0.6rem 0.6rem', color: 'var(--muted)', fontSize: '0.85rem' }}>
                        {a.instagram ? `@${a.instagram}` : '—'}
                      </td>
                      <td style={{ padding: '0.6rem 0.6rem' }}>
                        {invited[a.userId] ? (
                          <span style={{ fontSize: '0.82rem', color: '#00c864' }}>
                            <i className="fa-solid fa-check" style={{ marginRight: '0.3rem' }} />Invited
                          </span>
                        ) : (
                          <Btn
                            small
                            color="var(--tekky-blue)"
                            disabled={!!inviting[a.userId]}
                            onClick={() => handleInvite(a.userId)}
                          >
                            {inviting[a.userId] ? '…' : 'Invite'}
                          </Btn>
                        )}
                      </td>
                    </tr>
                    {errors[a.userId] && (
                      <tr key={`${a.userId}-err`}>
                        <td colSpan={4} style={{ padding: '0 0.6rem 0.4rem', color: '#ff6b6b', fontSize: '0.8rem' }}>
                          {errors[a.userId]}
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', marginTop: '1rem' }}>
              <Btn small disabled={page === 1} onClick={() => setPage((p) => p - 1)} color="var(--tekky-blue)">← Prev</Btn>
              <span style={{ fontSize: '0.82rem', color: 'var(--muted)', alignSelf: 'center' }}>
                {page} / {totalPages}
              </span>
              <Btn small disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} color="var(--tekky-blue)">Next →</Btn>
            </div>
          )}
        </>
      )}
    </Card>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function CaptainDashboardClient({ user, defaultSection, soloSection = false }) {
  const [team, setTeam]           = useState(null);
  const [roster, setRoster]       = useState(null);
  const [loadingTeam, setLoadingTeam] = useState(true);
  const [error, setError]         = useState('');
  const [removingId, setRemovingId] = useState(null);
  const [removeErr, setRemoveErr] = useState('');

  const rosterRef  = useRef(null);
  const invitesRef = useRef(null);
  const poolRef    = useRef(null);

  // Scroll to section after data loads (for sub-pages)
  useEffect(() => {
    if (loadingTeam || !defaultSection) return;
    const map = { roster: rosterRef, invites: invitesRef, pool: poolRef };
    const ref = map[defaultSection];
    if (ref?.current) {
      setTimeout(() => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  }, [loadingTeam, defaultSection]);

  const loadData = useCallback(async () => {
    setLoadingTeam(true);
    setError('');
    try {
      const [teamRes, rosterRes] = await Promise.all([getMyTeam(), getMyRoster()]);
      setTeam(teamRes);
      setRoster(rosterRes);
    } catch (err) {
      setError(err.message || 'Failed to load team data.');
    } finally {
      setLoadingTeam(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  async function handleRemove(userId) {
    setRemovingId(userId);
    setRemoveErr('');
    try {
      await removePlayer(userId);
      // Re-fetch roster to get updated counts
      const rosterRes = await getMyRoster();
      setRoster(rosterRes);
      const teamRes = await getMyTeam();
      setTeam(teamRes);
    } catch (err) {
      setRemoveErr(err.message || 'Failed to remove player.');
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <div style={{ maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{
          fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem',
          color: 'var(--fg)', margin: 0, letterSpacing: '1px',
        }}>
          Welcome, Captain {user?.name || ''} ⚽
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginTop: '0.35rem' }}>
          Manage your team, roster and invitations from here.
        </p>
      </div>

      {error && (
        <div role="alert" style={{
          background: 'rgba(255,60,60,0.1)', border: '1px solid rgba(255,60,60,0.35)',
          borderRadius: 8, padding: '0.8rem 1rem', color: '#ff6b6b',
          marginBottom: '1.5rem', fontSize: '0.9rem',
        }}>
          {error}
        </div>
      )}

      {!soloSection && (
        <>
          {loadingTeam ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Skeleton h={120} />
              <Skeleton h={80} />
              <Skeleton h={200} />
            </div>
          ) : team && (
            <>
              {/* ── Team card ─────────────────────────────────────────── */}
              <Card style={{ marginBottom: '1.5rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                {/* Logo */}
                {team.logo_url ? (
                  <img
                    src={team.logo_url}
                    alt="Team logo"
                    style={{
                      width: 80, height: 80, objectFit: 'contain',
                      borderRadius: 10, border: '1px solid rgba(0,116,255,0.25)',
                      background: 'rgba(0,116,255,0.04)', padding: 6, flexShrink: 0,
                    }}
                  />
                ) : (
                  <div style={{
                    width: 80, height: 80, borderRadius: 10,
                    border: '1px solid rgba(0,116,255,0.2)',
                    background: 'rgba(0,116,255,0.05)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <i className="fa-solid fa-shield-halved" style={{ fontSize: '2rem', color: 'rgba(0,116,255,0.4)' }} />
                  </div>
                )}

                {/* Team info */}
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.6rem', margin: 0, letterSpacing: '1px' }}>
                      {team.name}
                    </h3>
                    <StatusBadge status={team.status} />
                  </div>
                  {team.description && (
                    <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: '0 0 0.8rem', lineHeight: 1.5 }}>
                      {team.description}
                    </p>
                  )}
                  <RosterProgress approved={team.playerCount} max={team.max_players} />
                </div>

                {/* Summary stats */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: 130 }}>
                  {[
                    { label: 'Approved',   value: team.playerCount,  color: '#00c864' },
                    { label: 'Pending',    value: team.pendingCount,  color: '#ffb400' },
                    { label: 'Slots Left', value: team.remainingSlots, color: 'var(--tekky-blue)' },
                  ].map(({ label, value, color }) => (
                    <div key={label} style={{
                      background: 'rgba(0,116,255,0.04)',
                      border: '1px solid rgba(0,116,255,0.12)',
                      borderRadius: 8, padding: '0.5rem 0.75rem',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem',
                    }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                        {label}
                      </span>
                      <span style={{ fontSize: '1.1rem', fontFamily: "'Bebas Neue', sans-serif", color, letterSpacing: '0.5px' }}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* ── Roster ────────────────────────────────────────────── */}
              {roster && (
                <div ref={rosterRef}>
                  <Card style={{ marginBottom: '1.5rem' }}>
                    <SectionTitle>Roster</SectionTitle>

                    {removeErr && (
                      <p style={{ color: '#ff6b6b', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{removeErr}</p>
                    )}

                    {roster.approved.count === 0 && roster.pending_admin.count === 0 && roster.invited.count === 0 ? (
                      <p style={{ color: 'var(--muted)', fontSize: '0.9rem', textAlign: 'center', padding: '1.5rem 0' }}>
                        No players yet. Use the invite link or free agent pool below.
                      </p>
                    ) : (
                      <>
                        <RosterTable
                          title="Approved"
                          rows={roster.approved.results}
                          bucketColor="#00c864"
                          showRemove
                          onRemove={handleRemove}
                          removingId={removingId}
                        />
                        <RosterTable
                          title="Pending Admin Approval"
                          rows={roster.pending_admin.results}
                          bucketColor="#ffb400"
                          showRemove={false}
                        />
                        <RosterTable
                          title="Invited (Awaiting Response)"
                          rows={roster.invited.results}
                          bucketColor="#0074ff"
                          showRemove={false}
                        />
                      </>
                    )}
                  </Card>
                </div>
              )}
            </>
          )}

          {/* ── Invite link ───────────────────────────────────────────── */}
          <div ref={invitesRef} style={{ marginBottom: '1.5rem' }}>
            <InviteLinkPanel />
          </div>
        </>
      )}

      {/* ── Free agent pool ───────────────────────────────────────── */}
      <div ref={poolRef}>
        <FreeAgentPool />
      </div>

      <style>{`
        @keyframes cpulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
