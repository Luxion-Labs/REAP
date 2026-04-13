import type { Metadata } from 'next';
import { DM_Serif_Display, Inter, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
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
  icons: {
    icon: '/icon.svg',
  },
};

import { WalletProvider } from '@/components/providers/wallet-provider';
import { ContractProvider } from '@/components/providers/contract-provider';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${dmSerif.variable} ${inter.variable} ${jbMono.variable}`}>
      <body className="bg-slate-950 text-white font-sans antialiased overflow-x-hidden selection:bg-slate-300/40 selection:text-slate-900">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="theme">
          <Toaster 
            position="top-right"
            toastOptions={{
              className: 'dark:bg-slate-800 dark:text-white',
            }}
          />
          <WalletProvider>
            <ContractProvider>
              {/* Noise Overlay */}
              <div className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-5 dark:mix-blend-overlay mix-blend-screen">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
                  <filter id="noiseFilter">
                    <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                  </filter>
                  <rect width="100%" height="100%" filter="url(#noiseFilter)" />
                </svg>
              </div>
              {children}
            </ContractProvider>
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
