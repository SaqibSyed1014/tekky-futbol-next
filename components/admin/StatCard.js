export default function StatCard({ label, value, loading }) {
  return (
    <article className="ad-stat">
      <p className="ad-stat__value">{loading ? '—' : value}</p>
      <p className="ad-stat__label">{label}</p>
    </article>
  );
}
