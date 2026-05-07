import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SEO
        title="Page introuvable"
        description="Cette page n'existe pas ou a été déplacée."
        noIndex
      />
      <Navigation />
      <main className="flex-1 flex items-center justify-center pt-24 md:pt-28">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold font-playfair">404</h1>
          <p className="mb-6 text-xl text-muted-foreground">Page introuvable</p>
          <Link to="/" className="text-primary underline hover:text-primary/90">
            Retour à l'accueil
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
