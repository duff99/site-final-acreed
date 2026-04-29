import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SkipToContent from '@/components/SkipToContent';
import SEO from '@/components/SEO';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AnimatedSection from '@/components/AnimatedSection';

const MentionsLegales = () => (
  <div className="min-h-screen bg-background text-foreground">
    <SkipToContent />
    <SEO
      title="Mentions légales"
      description="Mentions légales du site Acreed Consulting : éditeur, hébergement, propriété intellectuelle."
      canonicalPath="/mentions-legales"
    />
    <Navigation />
    <main id="main-content" tabIndex={-1} className="pt-24 md:pt-28">
      <section className="relative py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-12">
          <AnimatedSection>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Retour à l'accueil
            </Link>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-12 text-gradient">
              Mentions Légales
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="space-y-10 text-muted-foreground leading-relaxed">
              <section className="space-y-3">
                <h2 className="text-lg font-semibold text-foreground">Éditeur du site</h2>
                <p>
                  Acreed Consulting<br />
                  Société par actions simplifiée (SAS)<br />
                  Siège social : Le Puy-en-Velay, France<br />
                  Email : recrutement@acreedconsulting.com
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-semibold text-foreground">Directeur de la publication</h2>
                <p>Le représentant légal de la société Acreed Consulting.</p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-semibold text-foreground">Hébergement</h2>
                <p>
                  Le site est hébergé par un prestataire professionnel assurant la sécurité
                  et la disponibilité des services.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-semibold text-foreground">Propriété intellectuelle</h2>
                <p>
                  L'ensemble du contenu du site (textes, images, logos, graphismes, icônes, sons,
                  logiciels) est la propriété exclusive d'Acreed Consulting ou de ses partenaires
                  et est protégé par les lois françaises et internationales relatives à la propriété
                  intellectuelle.
                </p>
                <p>
                  Toute reproduction, représentation, modification, publication, adaptation de tout
                  ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé,
                  est interdite sans l'autorisation écrite préalable d'Acreed Consulting.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-semibold text-foreground">Limitation de responsabilité</h2>
                <p>
                  Acreed Consulting s'efforce de fournir des informations aussi précises que
                  possible. Toutefois, elle ne pourra être tenue responsable des omissions,
                  des inexactitudes et des carences dans la mise à jour, qu'elles soient de
                  son fait ou du fait de tiers partenaires.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-semibold text-foreground">Droit applicable</h2>
                <p>
                  Les présentes mentions légales sont régies par le droit français.
                  En cas de litige, les tribunaux français seront seuls compétents.
                </p>
              </section>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default MentionsLegales;
