import type { Metadata } from 'next';
import { DM_Serif_Display, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const dmSerif = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-serif',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jbMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'REAP | Real Estate Asset Protocol',
  description: 'Turn Real Estate Into Liquid Digital Assets',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${inter.variable} ${jbMono.variable}`}>
      <body className="bg-[#080808] text-white font-sans antialiased overflow-x-hidden selection:bg-white/20 selection:text-white" suppressHydrationWarning>
        {/* Noise Overlay */}
        <div className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-5 mix-blend-overlay">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
            <filter id="noiseFilter">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter)" />
          </svg>
        </div>
        {children}
      </body>
    </html>
  );
}
