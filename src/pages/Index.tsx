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
    if (hash) {
      // Small delay to let the page render before scrolling
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [hash]);
  return (
    <div className="min-h-screen bg-background text-foreground">
{/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main>
        {/* Hero with Video */}
        <HeroSection />

        <SectionDividerPremium />

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
