const PRESETS = {
  pending:       { label: 'Pending',   icon: 'fa-solid fa-clock',           tone: 'pending' },
  pending_admin: { label: 'Pending',   icon: 'fa-solid fa-clock',           tone: 'pending' },
  approved:      { label: 'Approved',  icon: 'fa-solid fa-circle-check',    tone: 'success' },
  paid:          { label: 'Paid',      icon: 'fa-solid fa-circle-check',    tone: 'success' },
  official:      { label: 'Official',  icon: 'fa-solid fa-shield-halved',   tone: 'success' },
  rejected:      { label: 'Rejected',  icon: 'fa-solid fa-circle-xmark',    tone: 'danger' },
  failed:        { label: 'Failed',    icon: 'fa-solid fa-circle-xmark',    tone: 'danger' },
  waitlist:      { label: 'Waitlist',  icon: 'fa-solid fa-hourglass-half',  tone: 'violet' },
  interview:     { label: 'Interview', icon: 'fa-solid fa-comments',        tone: 'cyan' },
  invited:       { label: 'Invited',   icon: 'fa-solid fa-envelope',        tone: 'blue' },
  forming:       { label: 'Forming',   icon: 'fa-solid fa-users-gear',      tone: 'pending' },
  cancelled:     { label: 'Cancelled', icon: 'fa-solid fa-ban',             tone: 'muted' },
  none:          { label: 'None',      icon: 'fa-solid fa-minus',           tone: 'muted' },
};

export default function StatusBadge({ status, bucket }) {
  const key = status ?? bucket;
  const preset = PRESETS[key] ?? { label: key || '—', icon: 'fa-solid fa-circle', tone: 'muted' };

  return (
    <span className={`ad-status ad-status--${preset.tone}`}>
      <span className="ad-status__icon" aria-hidden="true">
        <i className={preset.icon} />
      </span>
      {preset.label}
    </span>
  );
}
