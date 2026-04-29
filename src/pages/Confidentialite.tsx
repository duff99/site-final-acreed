import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SEO from '@/components/SEO';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AnimatedSection from '@/components/AnimatedSection';

const Confidentialite = () => (
  <div className="min-h-screen bg-background text-foreground">
    <SEO
      title="Politique de confidentialité"
      description="Comment Acreed Consulting collecte, stocke et protège vos données personnelles. Vos droits RGPD et nos engagements."
      canonicalPath="/confidentialite"
    />
    <Navigation />
    <main className="pt-24 md:pt-28">
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
              Politique de Confidentialité
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="space-y-10 text-muted-foreground leading-relaxed">
              <section className="space-y-3">
                <h2 className="text-lg font-semibold text-foreground">Responsable du traitement</h2>
                <p>
                  Acreed Consulting, dont le siège social est situé au Puy-en-Velay, France,
                  est responsable du traitement des données personnelles collectées sur ce site.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-semibold text-foreground">Données collectées</h2>
                <p>Nous collectons les données suivantes dans le cadre de nos services :</p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li>Nom et prénom</li>
                  <li>Adresse email</li>
                  <li>Numéro de téléphone (optionnel)</li>
                  <li>Nom de l'entreprise (optionnel)</li>
                  <li>Contenu des messages envoyés via le formulaire de contact</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-semibold text-foreground">Finalités du traitement</h2>
                <p>Les données collectées sont utilisées pour :</p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li>Répondre à vos demandes de contact</li>
                  <li>Traiter vos candidatures</li>
                  <li>Vous proposer des offres d'emploi adaptées à votre profil</li>
                  <li>Améliorer nos services</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-semibold text-foreground">Base légale</h2>
                <p>
                  Le traitement de vos données repose sur votre consentement (formulaire de contact)
                  et sur notre intérêt légitime (gestion des candidatures et amélioration de nos services).
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-semibold text-foreground">Durée de conservation</h2>
                <p>
                  Les données de contact sont conservées pendant 3 ans à compter du dernier échange.
                  Les données de candidature sont conservées pendant 2 ans conformément aux
                  recommandations de la CNIL.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-semibold text-foreground">Vos droits</h2>
                <p>
                  Conformément au RGPD, vous disposez des droits suivants :
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li>Droit d'accès à vos données personnelles</li>
                  <li>Droit de rectification</li>
                  <li>Droit à l'effacement (« droit à l'oubli »)</li>
                  <li>Droit à la limitation du traitement</li>
                  <li>Droit à la portabilité des données</li>
                  <li>Droit d'opposition</li>
                </ul>
                <p>
                  Pour exercer ces droits, contactez-nous à : recrutement@acreedconsulting.com
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-semibold text-foreground">Cookies</h2>
                <p>
                  Ce site n'utilise pas de cookies de traçage publicitaire. Seuls des cookies
                  techniques essentiels au fonctionnement du site peuvent être déposés.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-semibold text-foreground">Contact</h2>
                <p>
                  Pour toute question relative à la protection de vos données, vous pouvez
                  nous contacter à recrutement@acreedconsulting.com ou adresser une réclamation
                  auprès de la CNIL (www.cnil.fr).
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

export default Confidentialite;
