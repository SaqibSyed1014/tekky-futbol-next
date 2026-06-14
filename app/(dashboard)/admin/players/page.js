'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  getAdminPlayers,
  updatePlayerStats,
  reviewProfileLink,
} from '@/services/profilesApi';

// ─── Shared primitives ────────────────────────────────────────────────────────

function Banner({ type, children }) {
  if (!children) return null;
  const s = type === 'error'
    ? { bg: 'rgba(255,60,60,0.1)',  border: 'rgba(255,60,60,0.35)',  color: '#ff6b6b', icon: 'fa-solid fa-circle-xmark' }
    : { bg: 'rgba(0,200,100,0.1)', border: 'rgba(0,200,100,0.35)', color: '#00c864', icon: 'fa-solid fa-circle-check' };
  return (
    <div style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 8, padding: '0.75rem 1rem', color: s.color, fontSize: '0.88rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <i className={s.icon} /><span>{children}</span>
    </div>
  );
}

function LinkStatusBadge({ status }) {
  const map = {
    none:     { color: '#555',    bg: 'rgba(255,255,255,0.04)', label: 'None' },
    pending:  { color: '#ffb400', bg: 'rgba(255,180,0,0.1)',   label: 'Pending' },
    approved: { color: '#00c864', bg: 'rgba(0,200,100,0.1)',   label: 'Approved' },
    rejected: { color: '#ff6b6b', bg: 'rgba(255,60,60,0.1)',   label: 'Rejected' },
  };
  const s = map[status] || map.none;
  return (
    <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: 4, background: s.bg, color: s.color, border: `1px solid ${s.color}40` }}>
      {s.label}
    </span>
  );
}

function PublicBadge({ isPublic }) {
  return (
    <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: 4, background: isPublic ? 'rgba(0,200,100,0.1)' : 'rgba(255,255,255,0.04)', color: isPublic ? '#00c864' : '#555', border: `1px solid ${isPublic ? 'rgba(0,200,100,0.3)' : 'rgba(255,255,255,0.1)'}` }}>
      {isPublic ? 'Public' : 'Private'}
    </span>
  );
}

// ─── Copy URL button ──────────────────────────────────────────────────────────

function CopyUrlButton({ url }) {
  const [copied, setCopied] = useState(false);
  if (!url) return <span style={{ color: '#555', fontSize: '0.78rem' }}>—</span>;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* fallback: no-op */
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
      <a href={url} target="_blank" rel="noreferrer" style={{ color: 'var(--tekky-blue)', fontSize: '0.75rem', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: 'none' }}>
        {url.replace(/^https?:\/\//, '')}
      </a>
      <button
        onClick={handleCopy}
        title="Copy URL"
        style={{ background: 'none', border: 'none', color: copied ? '#00c864' : 'var(--muted)', cursor: 'pointer', padding: '0.1rem 0.3rem', fontSize: '0.8rem' }}
      >
        <i className={copied ? 'fa-solid fa-check' : 'fa-solid fa-copy'} />
      </button>
    </div>
  );
}

// ─── Stats edit modal ─────────────────────────────────────────────────────────

function StatsModal({ player, onClose, onSaved }) {
  const [form, setForm] = useState({
    goals:              player.goals ?? 0,
    assists:            player.assists ?? 0,
    matches_played:     player.matches_played ?? 0,
    mvps:               player.mvps ?? 0,
    upcoming_opponent:  player.upcoming_opponent ?? '',
    upcoming_date:      player.upcoming_date ?? '',
    upcoming_kickoff:   player.upcoming_kickoff ?? '',
    upcoming_location:  player.upcoming_location ?? '',
    team_rank:          player.team_rank ?? '',
    team_wins:          player.team_wins ?? 0,
    team_losses:        player.team_losses ?? 0,
    team_draws:         player.team_draws ?? 0,
    team_goal_difference: player.team_goal_difference ?? 0,
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');

  function set(key, val) { setForm((f) => ({ ...f, [key]: val })); }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = { ...form };
      if (payload.team_rank === '' || payload.team_rank === null) payload.team_rank = null;
      else payload.team_rank = parseInt(payload.team_rank, 10);
      if (payload.upcoming_date === '') payload.upcoming_date = null;
      await updatePlayerStats(player.user_id, payload);
      onSaved();
      onClose();
    } catch (err) {
      const data = err?.data;
      if (data && typeof data === 'object') {
        const first = Object.values(data).flat()[0];
        setError(typeof first === 'string' ? first : 'Failed to save.');
      } else {
        setError('Failed to save stats. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  }

  const inputStyle = { width: '100%', boxSizing: 'border-box', marginBottom: 0 };

  function Field({ label, children }) {
    return (
      <div style={{ marginBottom: '0.85rem' }}>
        <label style={{ display: 'block', fontSize: '0.73rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, marginBottom: '0.3rem' }}>{label}</label>
        {children}
      </div>
    );
  }

  function NumInput({ k, min = 0 }) {
    return <input type="number" min={min} value={form[k]} onChange={(e) => set(k, e.target.value)} style={inputStyle} />;
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: '#0a0a0a', border: '1px solid rgba(0,116,255,0.3)', borderRadius: 14, padding: '2rem', maxWidth: 580, width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 0 60px rgba(0,0,0,0.8)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.3rem', letterSpacing: '1.5px', margin: 0 }}>Edit Stats</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.82rem', margin: '0.2rem 0 0' }}>{player.name || player.email}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '1.1rem' }}><i className="fa-solid fa-xmark" /></button>
        </div>

        <Banner type="error">{error}</Banner>

        <form onSubmit={handleSave}>
          {/* Stats */}
          <p style={{ fontSize: '0.75rem', color: 'var(--tekky-blue)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, marginBottom: '0.75rem' }}>Stats Overview</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.25rem' }}>
            <Field label="Goals"><NumInput k="goals" /></Field>
            <Field label="Assists"><NumInput k="assists" /></Field>
            <Field label="Matches Played"><NumInput k="matches_played" /></Field>
            <Field label="MVPs"><NumInput k="mvps" /></Field>
          </div>

          {/* Upcoming Match */}
          <p style={{ fontSize: '0.75rem', color: 'var(--tekky-blue)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, margin: '1rem 0 0.75rem' }}>Upcoming Match</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.25rem' }}>
            <Field label="Opponent"><input type="text" value={form.upcoming_opponent} onChange={(e) => set('upcoming_opponent', e.target.value)} placeholder="e.g. Street Runners" style={inputStyle} /></Field>
            <Field label="Date"><input type="date" value={form.upcoming_date} onChange={(e) => set('upcoming_date', e.target.value)} style={inputStyle} /></Field>
            <Field label="Kickoff Time"><input type="text" value={form.upcoming_kickoff} onChange={(e) => set('upcoming_kickoff', e.target.value)} placeholder="e.g. 7:00 PM" style={inputStyle} /></Field>
            <Field label="Location"><input type="text" value={form.upcoming_location} onChange={(e) => set('upcoming_location', e.target.value)} placeholder="e.g. Tekky Arena Pitch 3" style={inputStyle} /></Field>
          </div>

          {/* Team Standing */}
          <p style={{ fontSize: '0.75rem', color: 'var(--tekky-blue)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, margin: '1rem 0 0.75rem' }}>Team Standing</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.25rem' }}>
            <Field label="Rank"><input type="number" min={1} value={form.team_rank} onChange={(e) => set('team_rank', e.target.value)} placeholder="e.g. 2" style={inputStyle} /></Field>
            <Field label="Goal Difference"><input type="number" value={form.team_goal_difference} onChange={(e) => set('team_goal_difference', e.target.value)} style={inputStyle} /></Field>
            <Field label="Wins"><NumInput k="team_wins" /></Field>
            <Field label="Losses"><NumInput k="team_losses" /></Field>
            <Field label="Draws"><NumInput k="team_draws" /></Field>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" onClick={onClose} disabled={saving} style={{ padding: '0.6rem 1.25rem', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'var(--muted)', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.88rem' }}>
              Cancel
            </button>
            <button type="submit" className="cta" disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.5rem' }}>
              {saving ? <><span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Saving…</> : <><i className="fa-solid fa-floppy-disk" /> Save Stats</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AdminPlayersPage() {
  const { user, loading: authLoading } = useAuth();

  const [players,    setPlayers]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [search,     setSearch]     = useState('');
  const [editPlayer, setEditPlayer] = useState(null);
  const [linkMsg,    setLinkMsg]    = useState('');
  const [linkErr,    setLinkErr]    = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAdminPlayers({ search });
      setPlayers(data.results ?? data);
    } catch {
      setError('Failed to load players.');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    if (!authLoading && user) load();
  }, [authLoading, user, load]);

  async function handleLinkAction(playerId, action) {
    setLinkMsg(''); setLinkErr('');
    try {
      await reviewProfileLink(playerId, action);
      setLinkMsg(`Profile link ${action}d successfully.`);
      load();
    } catch {
      setLinkErr(`Failed to ${action} link.`);
    }
  }

  if (authLoading || loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
        <span className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
      </div>
    );
  }

  const pendingLinks = players.filter((p) => p.profile_link_status === 'pending');

  return (
    <div style={{ maxWidth: 1100 }}>
      {editPlayer && (
        <StatsModal
          player={editPlayer}
          onClose={() => setEditPlayer(null)}
          onSaved={load}
        />
      )}

      {/* ── Pending link approvals ── */}
      {pendingLinks.length > 0 && (
        <div style={{ background: '#000', border: '1px solid rgba(255,180,0,0.3)', borderRadius: 12, padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', letterSpacing: '1.5px', color: '#ffb400', margin: '0 0 1rem' }}>
            <i className="fa-solid fa-clock" style={{ marginRight: '0.5rem' }} />
            Pending Profile Links ({pendingLinks.length})
          </h3>
          <Banner type="success">{linkMsg}</Banner>
          <Banner type="error">{linkErr}</Banner>
          {pendingLinks.map((p) => (
            <div key={p.user_id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.65rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 600, fontSize: '0.88rem', color: '#fff', margin: 0 }}>{p.name || p.email}</p>
                <a href={p.profile_link} target="_blank" rel="noreferrer" style={{ fontSize: '0.78rem', color: 'var(--tekky-blue)', wordBreak: 'break-all' }}>{p.profile_link}</a>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                <button onClick={() => handleLinkAction(p.user_id, 'approve')} style={{ padding: '0.35rem 0.9rem', borderRadius: 6, background: 'rgba(0,200,100,0.12)', border: '1px solid rgba(0,200,100,0.35)', color: '#00c864', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                  <i className="fa-solid fa-check" style={{ marginRight: '0.35rem' }} />Approve
                </button>
                <button onClick={() => handleLinkAction(p.user_id, 'reject')} style={{ padding: '0.35rem 0.9rem', borderRadius: 6, background: 'rgba(255,60,60,0.1)', border: '1px solid rgba(255,60,60,0.3)', color: '#ff6b6b', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                  <i className="fa-solid fa-xmark" style={{ marginRight: '0.35rem' }} />Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Filters ── */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', fontSize: '0.8rem' }} />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load()}
            style={{ width: '100%', boxSizing: 'border-box', paddingLeft: '2.2rem' }}
          />
        </div>
        <button onClick={load} className="cta" style={{ padding: '0.55rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
          <i className="fa-solid fa-rotate-right" /> Refresh
        </button>
      </div>

      <Banner type="error">{error}</Banner>

      {/* ── Players table ── */}
      {players.length === 0 ? (
        <div style={{ background: '#000', border: '1px solid rgba(0,116,255,0.2)', borderRadius: 12, padding: '3rem', textAlign: 'center' }}>
          <i className="fa-solid fa-users" style={{ fontSize: '2.5rem', color: 'var(--muted)', marginBottom: '1rem', display: 'block' }} />
          <p style={{ color: 'var(--muted)' }}>No players found.</p>
        </div>
      ) : (
        <div style={{ background: '#000', border: '1px solid rgba(0,116,255,0.2)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(0,116,255,0.15)' }}>
                  {['Player', 'Team', 'Visibility', 'Goals', 'Assists', 'Matches', 'MVPs', 'Profile Link', 'Public URL', 'Actions'].map((h) => (
                    <th key={h} style={{ padding: '0.65rem 1rem', textAlign: 'left', color: 'var(--muted)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.4px', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {players.map((p) => (
                  <tr key={p.user_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{p.name || '—'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{p.email}</div>
                      {p.is_captain && <span style={{ fontSize: '0.65rem', color: '#f0b429', fontWeight: 700 }}>CAPTAIN</span>}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: p.team_name ? '#fff' : 'var(--muted)', whiteSpace: 'nowrap' }}>
                      {p.team_name || '—'}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <PublicBadge isPublic={p.is_public} />
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: '#fff', textAlign: 'center' }}>{p.goals}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#fff', textAlign: 'center' }}>{p.assists}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#fff', textAlign: 'center' }}>{p.matches_played}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#fff', textAlign: 'center' }}>{p.mvps}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <LinkStatusBadge status={p.profile_link_status} />
                    </td>
                    <td style={{ padding: '0.75rem 1rem', minWidth: 180 }}>
                      <CopyUrlButton url={p.public_url} />
                    </td>
                    <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>
                      <button
                        onClick={() => setEditPlayer(p)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.9rem', borderRadius: 6, background: 'rgba(0,116,255,0.1)', border: '1px solid rgba(0,116,255,0.3)', color: 'var(--tekky-blue)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        <i className="fa-solid fa-pen-to-square" /> Edit Stats
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
