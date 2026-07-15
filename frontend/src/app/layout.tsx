import type { Metadata, Viewport } from 'next';
import './globals.css';
import Providers from '@/store/Providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileNav from '@/components/MobileNav';

export const metadata: Metadata = {
  title: {
    default: 'Amrut Jobs — Find Your Dream Job',
    template: '%s | Amrut Jobs',
  },
  description:
    'Amrut Jobs is India’s smartest job platform, by the team behind amrut.ai. Search live openings from real companies, apply in one click and track every application in one place.',
};

export const viewport: Viewport = {
  themeColor: '#4f46e5',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <main className="min-h-[70vh] pb-20 md:pb-0">{children}</main>
          <Footer />
          <MobileNav />
        </Providers>
      </body>
    </html>
  );
}
