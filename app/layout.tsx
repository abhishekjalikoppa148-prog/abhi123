import type { Metadata, Viewport } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ParticleBackground from '@/components/ParticleBackground';
import { AuthProvider } from '@/components/auth/AuthProvider';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://celebrationcraft.com'),
  title: 'CelebrationCraft 🎂 — Create Beautiful Birthday Websites | Premium SaaS Platform',
  description: 'Create personalized, interactive birthday surprise websites with music, photos, AI wish generator, interactive cake blowing, fireworks, and unique shareable links in minutes. Premium birthday website platform.',
  keywords: ['birthday website', 'birthday surprise', 'birthday wish generator', 'paid birthday website saas', 'personalized birthday gift', 'birthday website creator', 'online birthday card', 'digital birthday gift'],
  authors: [{ name: 'CelebrationCraft' }],
  creator: 'CelebrationCraft',
  publisher: 'CelebrationCraft',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://celebrationcraft.com',
    siteName: 'CelebrationCraft',
    title: 'CelebrationCraft 🎂 — Create Beautiful Birthday Websites',
    description: 'Create personalized, interactive birthday surprise websites with music, photos, AI wish generator, and more.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CelebrationCraft - Birthday Website Platform'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CelebrationCraft 🎂 — Create Beautiful Birthday Websites',
    description: 'Create personalized, interactive birthday surprise websites with music, photos, AI wish generator, and more.',
    images: ['/twitter-image.png'],
    creator: '@celebrationcraft'
  },
  verification: {
    google: 'your-google-verification-code',
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#e11d48',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen text-slate-100 flex flex-col selection:bg-rose-500 selection:text-white">
        <AuthProvider>
          <ParticleBackground />
          <Navbar />
          <main className="flex-1 relative z-10">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
