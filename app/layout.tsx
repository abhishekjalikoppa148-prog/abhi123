import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ParticleBackground from '@/components/ParticleBackground';
import './globals.css';

export const metadata: Metadata = {
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
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  themeColor: '#e11d48',
  verification: {
    google: 'your-google-verification-code',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen text-slate-100 flex flex-col selection:bg-rose-500 selection:text-white">
        <ParticleBackground />
        <Navbar />
        <main className="flex-1 relative z-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
