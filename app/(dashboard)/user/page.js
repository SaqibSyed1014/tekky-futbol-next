export const metadata = {
  title: 'Player Dashboard — TekkyFutbol',
};

export default function UserDashboard() {
  return (
    <main style={{ maxWidth: 1080, margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", color: 'var(--tekky-blue)', marginBottom: '1rem' }}>
        Player Dashboard
      </h1>
      <p style={{ color: 'var(--muted)' }}>
        Placeholder — connect authentication and player APIs here.
      </p>
    </main>
  );
}
