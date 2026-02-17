import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, MapPin, Linkedin } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

const legalLinks = [
  { label: 'Mentions Légales', href: '#' },
  { label: 'Confidentialité', href: '#' },
  { label: 'CGV', href: '#' },
];

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const goHome = () => {
    if (!isHomePage) {
      navigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative pt-20 pb-10">
      {/* Decorative top line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-full max-w-3xl"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
        }}
      />

      <div className="w-[75%] max-w-5xl mx-auto px-6">
        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Column 1: Identity */}
          <AnimatedSection delay={0}>
            <div className="space-y-4">
              <button
                onClick={goHome}
                className="group transition-transform duration-200 hover:scale-105"
              >
                <img
                  src="/images/favicon_footer.png"
                  alt="Acreed Consulting"
                  className="h-14 w-auto rounded-md"
                />
              </button>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Cabinet de conseil et de recrutement spécialisé
              </p>
              <a
                href="https://www.linkedin.com/company/acreed-consulting"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Linkedin size={16} />
                <span>LinkedIn</span>
              </a>
            </div>
          </AnimatedSection>

          {/* Column 2: Contact */}
          <AnimatedSection delay={0.1}>
            <div>
              <h4 className="text-sm uppercase tracking-premium text-foreground mb-5">
                Contact
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="mailto:contact@acreedconsulting.com"
                    className="inline-flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Mail size={15} className="flex-shrink-0" />
                    contact@acreedconsulting.com
                  </a>
                </li>
<li>
                  <span className="inline-flex items-center gap-3 text-sm text-muted-foreground">
                    <MapPin size={15} className="flex-shrink-0" />
                    Le Puy-en-Velay, France
                  </span>
                </li>
              </ul>
            </div>
          </AnimatedSection>

          {/* Column 3: Legal */}
          <AnimatedSection delay={0.2}>
            <div>
              <h4 className="text-sm uppercase tracking-premium text-foreground mb-5">
                Informations
              </h4>
              <ul className="space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedSection>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-6 border-t border-white/10">
          <p className="text-center text-xs text-muted-foreground">
            &copy; 2026 Acreed Consulting. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
