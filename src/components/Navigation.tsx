import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { navLinks, ctaLink } from '@/config/navigation';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('#top');
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    // On route pages (e.g. /contact), highlight matching nav link
    const routeLink = navLinks.find(l => l.href === location.pathname);
    if (routeLink) {
      setActiveSection(routeLink.href);
      return;
    }

    // On non-home route pages (e.g. /contact), no navLink dot
    if (!isHomePage) {
      setActiveSection(location.pathname);
      return;
    }

    // On home page, track scroll position for hash sections
    const sectionIds = navLinks
      .filter(l => l.href.startsWith('#'))
      .map(l => l.href.replace('#', ''))
      .filter(id => id !== 'top');

    const handleScroll = () => {
      if (window.scrollY < 100) {
        setActiveSection('#top');
        return;
      }

      const threshold = window.scrollY + window.innerHeight * 0.4;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= threshold) {
          setActiveSection(`#${sectionIds[i]}`);
          return;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  const scrollToSection = (href: string) => {
    // Route links (e.g. /contact) - navigate directly
    if (href.startsWith('/')) {
      navigate(href);
      setIsMobileMenuOpen(false);
      return;
    }

    if (!isHomePage) {
      // On sub-pages, navigate back to home then scroll to section
      const sectionId = href.replace('#', '');
      navigate('/');
      // Wait for home page to render, then scroll
      setTimeout(() => {
        if (sectionId === 'top') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        }
        window.history.replaceState(null, '', '/');
      }, 100);
      setIsMobileMenuOpen(false);
      return;
    }
    if (href === '#top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    // Keep URL clean — never show hash fragments
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Raycast-style fixed centered wrapper */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 pointer-events-none" style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}>
        <nav className="pointer-events-auto w-[96%] max-w-[1600px] glass-nav-raycast">
          <div className="relative flex items-center h-[60px] lg:h-[76px] px-4 lg:px-8">
            {/* Logo — absolute left */}
            <button
              onClick={() => scrollToSection('#top')}
              className="absolute left-8 top-1/2 -translate-y-1/2 flex items-center flex-shrink-0 transition-transform duration-200 hover:scale-105"
            >
              <img
                src="/images/favicon_navbar.jpg"
                alt="Acreed Consulting"
                className="h-8 lg:h-12 w-auto rounded-md"
              />
            </button>

            {/* Desktop Menu — centered */}
            <div className="hidden lg:flex items-center gap-4 mx-auto">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className={`relative px-3 py-3 text-[15px] font-medium transition-colors duration-200 whitespace-nowrap ${activeSection === link.href ? 'text-[#dbcca5]' : 'text-[#9c9c9d] hover:text-white'}`}
                >
                  {link.label}
                  {activeSection === link.href && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-6 h-[2px] rounded-full bg-[#dbcca5] shadow-[0_0_8px_rgba(219,204,165,0.6)]"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* CTA — absolute right */}
            <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2">
              <button
                onClick={() => navigate(ctaLink.href)}
                className="btn-nav-aura"
              >
                {ctaLink.label}
              </button>
              {location.pathname === ctaLink.href && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white"
                />
              )}
            </div>

            {/* Mobile Menu Button — absolute right */}
            <button
              type="button"
              className="lg:hidden absolute right-6 top-1/2 -translate-y-1/2 glass-button p-2.5 rounded-lg text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav"
              aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {isMobileMenuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl pt-24"
          >
            <div className="flex flex-col items-center justify-center h-full gap-6">
              <img
                src="/images/favicon_navbar.jpg"
                alt="Acreed"
                className="h-10 w-auto rounded-md mb-8 opacity-60"
              />
              {navLinks.map((link, index) => (
                <motion.button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className={`text-xl font-display transition-colors relative ${
                    activeSection === link.href
                      ? 'text-[#dbcca5]'
                      : 'text-foreground hover:text-muted-foreground'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                >
                  {link.label}
                  {activeSection === link.href && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-[2px] rounded-full bg-[#dbcca5]" />
                  )}
                </motion.button>
              ))}
              <motion.button
                onClick={() => { setIsMobileMenuOpen(false); navigate(ctaLink.href); }}
                className="btn-premium btn-premium-primary text-base mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.08 + 0.1 }}
              >
                {ctaLink.label}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
};

export default Navigation;
