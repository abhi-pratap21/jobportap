import type { Metadata, Viewport } from 'next';
import './globals.css';
import Providers from '@/store/Providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileNav from '@/components/MobileNav';

export const metadata: Metadata = {
  title: {
    default: 'JobNest — Find Your Dream Job',
    template: '%s | JobNest',
  },
  description:
    'JobNest is India’s smartest job platform. Search thousands of jobs, apply in one click and track every application in one place.',
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
