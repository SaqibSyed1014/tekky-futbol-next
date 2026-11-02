import { Anton, Inter, JetBrains_Mono } from 'next/font/google';

// Roadmap typographic hierarchy — the only three families on the platform:
//   Anton          hero headers (Druk Wide is the spec's first choice but is a
//                  paid typeface; Anton is the spec's listed alternative)
//   Inter          subheaders + body text
//   JetBrains Mono tactical tags / system metadata
// Server-side only (imported by the root layout) — next/font must not be
// pulled into a client component.
export const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-anton',
  display: 'swap',
});

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const siteFontVars = `${anton.variable} ${inter.variable} ${jetbrainsMono.variable}`;
