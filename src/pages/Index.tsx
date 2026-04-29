import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import PartnersMarquee from '@/components/PartnersMarquee';
import ServicesSection from '@/components/ServicesSection';
import ExpertiseSection from '@/components/ExpertiseSection';
import TeamSection from '@/components/TeamSection';
import JobsSection from '@/components/JobsSection';
import AboutSection from '@/components/AboutSection';
import HistorySection from '@/components/HistorySection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import SectionDividerPremium from '@/components/SectionDividerPremium';

const Index = () => {
  const { hash } = useLocation();

  useEffect(() => {
    // Disable browser scroll restoration — always start at top on refresh
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    if (hash) {
      // Small delay to let the page render before scrolling
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);
  return (
    <div className="min-h-screen text-foreground relative z-10">
      {/* Skip-link — invisible until focused, lets keyboard users jump past nav */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded-md focus:font-medium focus:shadow-lg"
      >
        Aller au contenu principal
      </a>

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main id="main-content" tabIndex={-1}>
        {/* Hero with Video */}
        <HeroSection />

        <div className="-mt-5 md:-mt-7 relative z-20">
          <SectionDividerPremium />
        </div>

        {/* Expertise */}
        <ServicesSection />

        <SectionDividerPremium />

        {/* Services */}
        <ExpertiseSection />

        <SectionDividerPremium />

        {/* Nos Offres */}
        <JobsSection />

        <SectionDividerPremium />

        {/* Crédo / Values */}
        <AboutSection />

        <SectionDividerPremium />

        {/* L'Équipe */}
        <TeamSection />

        <SectionDividerPremium />

        {/* À propos / Histoire */}
        <HistorySection />

        <SectionDividerPremium />

        {/* Partners Marquee */}
        <PartnersMarquee />

        <SectionDividerPremium />

        {/* Contact */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
