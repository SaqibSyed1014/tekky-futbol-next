import './globals.css';
import PublicShell from '@/components/shared/PublicShell';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata = {
  title: 'TekkyFutbol',
  description: "Chicago's competitive 5v5 league built around creativity, pressure, and controlled chaos.",
  icons: {
    icon: [
      { url: '/images/favicons/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/images/favicons/favicon.svg', type: 'image/svg+xml' },
      { url: '/images/favicons/favicon.ico', rel: 'shortcut icon' },
    ],
    apple: { url: '/images/favicons/apple-touch-icon.png', sizes: '180x180' },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@400;600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          <PublicShell>
            {children}
          </PublicShell>
        </AuthProvider>
      </body>
    </html>
  );
}
