export const metadata = {
  title: 'Admin Dashboard — TekkyFutbol',
};

export default function AdminDashboard() {
  return (
    <main style={{ maxWidth: 1080, margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", color: 'var(--tekky-blue)', marginBottom: '1rem' }}>
        Admin Dashboard
      </h1>
      <p style={{ color: 'var(--muted)' }}>
        Placeholder — connect authentication and admin APIs here.
      </p>
    </main>
  );
}
