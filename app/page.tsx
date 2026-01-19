import { ToastProvider } from '@/components/Toast';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import Features from '@/components/Features';
import Examples from '@/components/Examples';
import Trust from '@/components/Trust';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <ToastProvider>
      <main className="min-h-screen">
        <Hero />
        <HowItWorks />
        <Features />
        <Examples />
        <Trust />
        <FAQ />
        <Footer />
      </main>
    </ToastProvider>
  );
}
