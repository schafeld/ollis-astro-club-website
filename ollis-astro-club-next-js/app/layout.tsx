import type { Metadata } from 'next';
import { Kalam, Patrick_Hand } from 'next/font/google';
import './globals.css';

const kalam = Kalam({
  weight: ['700'],
  subsets: ['latin'],
  variable: '--font-kalam',
  display: 'swap',
});

const patrickHand = Patrick_Hand({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-patrick-hand',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Ollis Astro Club – Astronomie AG an der Michaelschule in Groß Reken",
  description:
    'Astronomie AG an der Michaelschule in Groß Reken mit Tipps für Sternenfreunde, Infos zu Teleskopen, Astronomie-Software und vielem mehr. Von Oliver Schafeld gegründet und betrieben.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html suppressHydrationWarning>
      <body className={`${kalam.variable} ${patrickHand.variable} antialiased`}>{children}</body>
    </html>
  );
}
