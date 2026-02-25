import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './ContactSection.css';
import AnimatedSection from './AnimatedSection';

const ContactSection = () => {
  return (
    <section id="contact" className="ultimate-cta py-20 scroll-mt-24">
      <AnimatedSection className="cta-content w-full">
        <h2 className="cta-title">
          Prêt à transformer
          <em>votre carrière ?</em>
        </h2>

        <p className="cta-desc">
          Consultants, entreprises : construisons ensemble votre succès avec exigence, agilité et transparence.
        </p>

        <div className="guide-line"></div>

        <div className="button-wrapper">
          <div className="ambient-glow"></div>
          <Link to="/contact" className="btn-aura">
            Nous contacter
            <ArrowRight size={18} className="btn-icon" />
          </Link>
        </div>
      </AnimatedSection>
    </section>
  );
};

export default ContactSection;
