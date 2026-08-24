export default function StatCard({ label, value, icon, loading }) {
  return (
    <article className="ad-stat">
      <div className="ad-stat__icon">
        <i className={icon} />
      </div>
      <p className="ad-stat__value">{loading ? '—' : value}</p>
      <p className="ad-stat__label">{label}</p>
    </article>
  );
}
