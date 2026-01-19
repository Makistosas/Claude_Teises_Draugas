import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#102a43',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Teisės draugas – AI pagalbininkas teisiniais klausimais',
  description:
    'Per kelias minutes paruošk pretenziją, sutartį ar aiškų laišką. Lietuviškas AI teisės pagalbininkas padeda spręsti kasdienius teisinius klausimus be advokato.',
  keywords: [
    'pretenzija',
    'sutartis',
    'teisinis pagalbininkas',
    'AI teisė',
    'Lietuva',
    'teisės draugas',
    'skolos išieškojimas',
    'nuomos sutartis',
    'vartotojų teisės',
  ],
  authors: [{ name: 'Teisės draugas' }],
  creator: 'Teisės draugas',
  publisher: 'Teisės draugas',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'lt_LT',
    url: 'https://teisesdraugas.lt',
    siteName: 'Teisės draugas',
    title: 'Teisės draugas – AI pagalbininkas teisiniais klausimais',
    description:
      'Per kelias minutes paruošk pretenziją, sutartį ar aiškų laišką. Lietuviškas AI teisės pagalbininkas.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Teisės draugas - AI teisės pagalbininkas',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Teisės draugas – AI pagalbininkas teisiniais klausimais',
    description:
      'Per kelias minutes paruošk pretenziją, sutartį ar aiškų laišką.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <html lang="lt" className={inter.variable}>
      <body className="min-h-screen bg-navy-950 text-navy-100 antialiased">
        {isDev && (
          <div className="dev-banner">
            🛠️ LOCAL DEV MODE – žinutės keliauja į Slack per Chatlio
          </div>
        )}
        <div className={isDev ? 'pt-6' : ''}>
          {children}
        </div>
      </body>
    </html>
  );
}
