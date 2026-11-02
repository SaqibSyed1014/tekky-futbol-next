import { Inter, JetBrains_Mono } from 'next/font/google';

// Roadmap typography: JetBrains Mono for tactical tags / system metadata,
// Inter for subheaders and body copy. Server-side only (imported by the root
// layout) — next/font must not be pulled into a client component.
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

export const siteFontVars = `${inter.variable} ${jetbrainsMono.variable}`;
