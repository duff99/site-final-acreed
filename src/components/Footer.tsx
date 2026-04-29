import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Linkedin } from 'lucide-react';
import './Footer.css';
import AnimatedSection from './AnimatedSection';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const goHome = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isHomePage) {
      navigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <div className="footer-divider"></div>

      <footer className="minimal-footer">
        <AnimatedSection delay={0} className="w-full flex flex-col items-center">
          <div className="footer-brand">
            <div className="footer-logo">
              <button
                onClick={goHome}
                className="group transition-transform duration-200 hover:scale-105"
              >
                <img
                  src="/images/favicon_footer.png"
                  alt="Acreed Consulting"
                  className="h-10 w-auto rounded-md"
                />
              </button>
            </div>
            <div className="footer-signature">Fantastique simplicité</div>
          </div>

          <nav className="footer-nav">
            <a href="mailto:recrutement@acreedconsulting.com">
              <Mail size={16} /> Contact
            </a>
            <a
              href="https://www.linkedin.com/company/acreedconsutling/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin size={16} /> LinkedIn
            </a>
            <Link to="/mentions-legales">Mentions Légales</Link>
            <Link to="/confidentialite">Confidentialité</Link>
          </nav>

          <div className="footer-legal">
            <span>&copy; {new Date().getFullYear()} Acreed Consulting. Tous droits réservés.</span>
            <span>Le Puy-en-Velay, France</span>
            <Link to="/admin/login" className="footer-admin-link" aria-label="Espace pro">
              Espace pro
            </Link>
          </div>
        </AnimatedSection>
      </footer>
    </>
  );
};

export default Footer;
