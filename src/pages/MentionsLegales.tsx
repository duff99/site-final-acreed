import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SEO from '@/components/SEO';
import SkipToContent from '@/components/SkipToContent';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AnimatedSection from '@/components/AnimatedSection';

const lastUpdate = '29 avril 2026';

const MentionsLegales = () => (
  <div className="min-h-screen bg-background text-foreground">
    <SEO
      title="Mentions légales"
      description="Mentions légales du site Acreed Consulting : éditeur, hébergement, propriété intellectuelle, responsabilité et juridiction."
      canonicalPath="/mentions-legales"
    />
    <SkipToContent />
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
            <span className="text-xs uppercase tracking-[3px] text-[#dbcca5]/80 mb-3 block">
              Informations légales
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-3 text-gradient">
              Mentions Légales
            </h1>
            <p className="text-sm text-white/40 mb-12">Dernière mise à jour : {lastUpdate}</p>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="space-y-10 text-muted-foreground leading-relaxed">

              <Section title="1. Éditeur du site">
                <p>
                  Le site <strong className="text-white/90">acreedconsulting.com</strong> est édité par :
                </p>
                <KeyValueList
                  items={[
                    ['Raison sociale', 'ACREED CONSULTING'],
                    ['Forme juridique', 'Société par actions simplifiée (SAS)'],
                    ['Capital social', '30 000 €'],
                    ['Siège social', '5 Lotissement La Chaud, 43320 Saint-Vidal, France'],
                    ['SIREN', '883 042 798'],
                    ['SIRET (siège)', '883 042 798 00016'],
                    ['RCS', 'Le Puy-en-Velay 883 042 798'],
                    ['Numéro TVA intracommunautaire', 'FR12 883 042 798'],
                    ['Code APE / NAF', '6202A — Conseil en systèmes et logiciels informatiques'],
                    ['Date d\'immatriculation', '24 avril 2020'],
                    ['Email', 'contact@acreedconsulting.com'],
                  ]}
                />
              </Section>

              <Section title="2. Directeur de la publication">
                <p>
                  <strong className="text-white/90">Steven Breuil</strong>, en sa qualité de
                  Président d'Acreed Consulting.
                </p>
                <p>Contact : contact@acreedconsulting.com</p>
              </Section>

              <Section title="3. Hébergement">
                <p>Le site est hébergé par&nbsp;:</p>
                <KeyValueList
                  items={[
                    ['Hébergeur', 'Microsoft Azure (Microsoft Ireland Operations Limited)'],
                    ['Adresse', 'One Microsoft Place, South County Business Park, Leopardstown, Dublin 18, D18 P521, Irlande'],
                    ['Site web', 'https://azure.microsoft.com'],
                  ]}
                />
                <p className="text-sm text-white/50">
                  Les données sont stockées au sein de l'Espace économique européen (EEE).
                </p>
              </Section>

              <Section title="4. Propriété intellectuelle">
                <p>
                  L'ensemble des éléments composant le site (textes, images, vidéos, logos,
                  graphismes, icônes, sons, logiciels, bases de données, code source) sont la
                  propriété exclusive d'Acreed Consulting ou de ses partenaires et sont protégés
                  par le droit français et les conventions internationales relatives à la propriété
                  intellectuelle.
                </p>
                <p>
                  Toute reproduction, représentation, modification, publication, adaptation,
                  traduction ou réutilisation, totale ou partielle, des éléments du site, par quelque
                  moyen ou procédé que ce soit, est interdite sans l'autorisation écrite préalable
                  d'Acreed Consulting, sauf exceptions prévues à l'article L.122-5 du Code de la
                  propriété intellectuelle.
                </p>
                <p>
                  La marque <strong className="text-white/90">Acreed Consulting</strong>, ainsi que
                  les logos figurant sur le site, sont des marques protégées. Toute reproduction sans
                  autorisation préalable constitue une contrefaçon sanctionnée par les articles
                  L.335-2 et suivants du Code de la propriété intellectuelle.
                </p>
              </Section>

              <Section title="5. Liens hypertextes">
                <p>
                  Le site peut contenir des liens vers d'autres sites internet. Acreed Consulting ne
                  peut être tenue responsable du contenu, des pratiques ou de la disponibilité de ces
                  sites tiers, dont l'utilisation relève de la seule responsabilité de l'utilisateur.
                </p>
                <p>
                  La création de liens vers acreedconsulting.com est autorisée à condition de ne pas
                  porter atteinte à l'image de la société. Acreed Consulting se réserve le droit de
                  demander la suppression d'un lien jugé non conforme.
                </p>
              </Section>

              <Section title="6. Limitation de responsabilité">
                <p>
                  Acreed Consulting met tout en œuvre pour fournir des informations exactes et
                  à jour. Elle ne peut toutefois garantir l'exactitude, la complétude ou
                  l'actualité des informations diffusées sur le site.
                </p>
                <p>
                  L'utilisateur reconnaît utiliser ces informations sous sa responsabilité
                  exclusive. Acreed Consulting ne saurait être tenue responsable des dommages
                  directs ou indirects résultant de l'utilisation du site, d'une indisponibilité
                  temporaire, de la présence de virus ou encore de tout dysfonctionnement.
                </p>
              </Section>

              <Section title="7. Protection des données personnelles">
                <p>
                  Les conditions de collecte et de traitement des données personnelles sont
                  détaillées dans notre{' '}
                  <Link to="/confidentialite" className="text-[#dbcca5] underline decoration-dotted underline-offset-2 hover:text-white">
                    politique de confidentialité
                  </Link>
                  . L'utilisation de cookies est régie par notre{' '}
                  <Link to="/politique-cookies" className="text-[#dbcca5] underline decoration-dotted underline-offset-2 hover:text-white">
                    politique de cookies
                  </Link>
                  .
                </p>
              </Section>

              <Section title="8. Droit applicable et juridiction">
                <p>
                  Les présentes mentions légales sont soumises au droit français. En cas de litige
                  et à défaut de résolution amiable, les tribunaux français seront seuls compétents.
                </p>
              </Section>

              <Section title="9. Contact">
                <p>
                  Pour toute question relative au site ou à ses mentions légales :{' '}
                  <a
                    href="mailto:contact@acreedconsulting.com"
                    className="text-[#dbcca5] underline decoration-dotted underline-offset-2 hover:text-white"
                  >
                    contact@acreedconsulting.com
                  </a>
                  .
                </p>
              </Section>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="space-y-3 scroll-mt-32">
    <h2 className="text-lg md:text-xl font-semibold text-white/90 font-display tracking-tight">
      {title}
    </h2>
    <div className="space-y-3 text-[15px] text-white/65 font-light">{children}</div>
  </section>
);

const KeyValueList = ({ items }: { items: [string, string][] }) => (
  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
    <dl className="divide-y divide-white/[0.04]">
      {items.map(([k, v]) => (
        <div key={k} className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-4 px-4 py-3">
          <dt className="text-xs uppercase tracking-[1.5px] text-white/40">{k}</dt>
          <dd className="md:col-span-2 text-[15px] text-white/80 font-light break-words">{v}</dd>
        </div>
      ))}
    </dl>
  </div>
);

export default MentionsLegales;
