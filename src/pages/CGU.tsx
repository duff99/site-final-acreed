import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SEO from '@/components/SEO';
import SkipToContent from '@/components/SkipToContent';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AnimatedSection from '@/components/AnimatedSection';

const lastUpdate = '29 avril 2026';

const CGU = () => (
  <div className="min-h-screen bg-background text-foreground">
    <SEO
      title="Conditions générales d'utilisation"
      description="Conditions générales d'utilisation du site acreedconsulting.com — accès, comportement, propriété intellectuelle, responsabilité, droit applicable."
      canonicalPath="/cgu"
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
              CGU
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-3 text-gradient">
              Conditions générales d'utilisation
            </h1>
            <p className="text-sm text-white/40 mb-12">Dernière mise à jour : {lastUpdate}</p>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="space-y-12">

              <Section title="1. Objet">
                <p>
                  Les présentes conditions générales d'utilisation (« CGU ») ont pour objet de
                  définir les modalités d'accès et d'utilisation du site internet{' '}
                  <strong className="text-white/90">acreedconsulting.com</strong> (le « Site »),
                  édité par la société Acreed Consulting (l'« Éditeur »).
                </p>
                <p>
                  Le Site présente les services d'Acreed Consulting (cabinet de recrutement,
                  conseil et services professionnels en télécoms, IT, cybersécurité, énergies
                  renouvelables et industrie), publie des offres d'emploi et permet la prise
                  de contact ou la candidature en ligne.
                </p>
              </Section>

              <Section title="2. Acceptation et évolution des CGU">
                <p>
                  L'accès et la navigation sur le Site impliquent l'acceptation sans réserve des
                  présentes CGU. À défaut d'acceptation, l'utilisateur est invité à ne pas
                  utiliser le Site.
                </p>
                <p>
                  L'Éditeur se réserve le droit de modifier les CGU à tout moment, notamment
                  pour tenir compte d'évolutions légales, techniques ou éditoriales. La date de
                  dernière mise à jour figure en tête du document. Il appartient à l'utilisateur
                  de consulter régulièrement la version en vigueur.
                </p>
              </Section>

              <Section title="3. Accès au Site">
                <p>
                  Le Site est accessible gratuitement à toute personne disposant d'un accès à
                  internet. Les coûts d'accès et d'utilisation du réseau (matériel,
                  abonnement internet, etc.) sont à la charge exclusive de l'utilisateur.
                </p>
                <p>
                  L'Éditeur s'efforce de maintenir le Site accessible 24h/24 et 7j/7. Il se
                  réserve toutefois la possibilité d'en suspendre l'accès, sans préavis ni
                  indemnité, notamment pour des raisons de maintenance, de mise à jour ou de
                  cas de force majeure.
                </p>
              </Section>

              <Section title="4. Comportement de l'utilisateur">
                <p>
                  L'utilisateur s'engage à utiliser le Site dans le respect des lois et
                  règlements en vigueur, des présentes CGU et des droits des tiers. Sont
                  notamment interdits&nbsp;:
                </p>
                <ul className="list-disc list-outside pl-5 space-y-1.5 text-[15px] text-white/65 font-light marker:text-[#dbcca5]/60">
                  <li>toute tentative d'intrusion, de contournement des mesures de sécurité ou d'altération du Site ;</li>
                  <li>l'envoi de contenus illicites, diffamatoires, injurieux, contrefaisants, dénigrants ou contraires à l'ordre public ;</li>
                  <li>la collecte automatisée de données (scraping) sans accord préalable de l'Éditeur ;</li>
                  <li>l'usurpation d'identité ou l'utilisation de faux profils dans les formulaires de contact ou de candidature ;</li>
                  <li>tout usage du Site à des fins commerciales non autorisées (envoi de spam, prospection non sollicitée).</li>
                </ul>
                <p>
                  Tout manquement pourra entraîner la suspension de l'accès au Site et, le cas
                  échéant, des poursuites civiles ou pénales.
                </p>
              </Section>

              <Section title="5. Formulaires de contact et de candidature">
                <p>
                  L'utilisateur garantit que les informations transmises via les formulaires sont
                  exactes, à jour et qu'il dispose des droits nécessaires pour les communiquer.
                </p>
                <p>
                  Les données transmises sont traitées conformément à notre{' '}
                  <Link to="/confidentialite" className="text-[#dbcca5] underline decoration-dotted underline-offset-2 hover:text-white">
                    politique de confidentialité
                  </Link>
                  . L'envoi d'un message ou d'une candidature ne crée aucune obligation
                  contractuelle entre l'utilisateur et Acreed Consulting.
                </p>
              </Section>

              <Section title="6. Propriété intellectuelle">
                <p>
                  Le Site et l'ensemble de ses éléments (textes, images, vidéos, logos,
                  graphismes, icônes, sons, logiciels, bases de données, code source, charte
                  graphique) sont protégés par le droit de la propriété intellectuelle et sont
                  la propriété exclusive d'Acreed Consulting ou de ses partenaires.
                </p>
                <p>
                  Toute reproduction, représentation, modification, publication ou réutilisation,
                  totale ou partielle, est interdite sans autorisation écrite préalable, sauf
                  exceptions prévues à l'article L.122-5 du Code de la propriété intellectuelle.
                </p>
                <p>
                  Le contenu transmis par l'utilisateur via les formulaires reste sa propriété ;
                  il accorde à l'Éditeur une licence d'utilisation strictement nécessaire au
                  traitement de sa demande.
                </p>
              </Section>

              <Section title="7. Données personnelles et cookies">
                <p>
                  Le traitement des données personnelles est détaillé dans la{' '}
                  <Link to="/confidentialite" className="text-[#dbcca5] underline decoration-dotted underline-offset-2 hover:text-white">
                    politique de confidentialité
                  </Link>
                  . L'usage des cookies est régi par la{' '}
                  <Link to="/politique-cookies" className="text-[#dbcca5] underline decoration-dotted underline-offset-2 hover:text-white">
                    politique de cookies
                  </Link>
                  .
                </p>
              </Section>

              <Section title="8. Liens externes">
                <p>
                  Le Site peut comporter des liens vers des sites tiers. L'Éditeur n'exerce aucun
                  contrôle sur ces sites et décline toute responsabilité quant à leur contenu,
                  leurs pratiques de confidentialité ou leur disponibilité.
                </p>
              </Section>

              <Section title="9. Responsabilité">
                <p>
                  L'Éditeur met tout en œuvre pour assurer l'exactitude des informations
                  diffusées et la disponibilité du Site. Il ne peut toutefois être tenu
                  responsable&nbsp;:
                </p>
                <ul className="list-disc list-outside pl-5 space-y-1.5 text-[15px] text-white/65 font-light marker:text-[#dbcca5]/60">
                  <li>des éventuelles erreurs, inexactitudes ou omissions dans les contenus du Site ;</li>
                  <li>des dommages directs ou indirects résultant de l'utilisation du Site ou de l'impossibilité d'y accéder ;</li>
                  <li>des conséquences d'une intrusion, d'un virus ou de tout autre élément malveillant échappant à son contrôle raisonnable ;</li>
                  <li>de l'utilisation faite par l'utilisateur des informations diffusées sur le Site.</li>
                </ul>
                <p>
                  Le Site ne constitue ni une offre commerciale ferme, ni un engagement
                  contractuel à l'égard d'un utilisateur.
                </p>
              </Section>

              <Section title="10. Force majeure">
                <p>
                  L'Éditeur ne pourra être tenu responsable de tout manquement à ses obligations
                  résultant d'un cas de force majeure tel que défini par l'article 1218 du Code
                  civil, notamment en cas de défaillance des réseaux de télécommunications, de
                  panne d'hébergement, d'événement de nature climatique, sanitaire ou
                  géopolitique.
                </p>
              </Section>

              <Section title="11. Droit applicable et juridiction">
                <p>
                  Les présentes CGU sont régies par le droit français. Le site s'adresse à une
                  clientèle professionnelle (B2B). En cas de litige et à défaut de résolution
                  amiable, les tribunaux français seront seuls compétents.
                </p>
              </Section>

              <Section title="12. Contact">
                <p>
                  Pour toute question relative aux présentes CGU :{' '}
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
  <section className="space-y-4 scroll-mt-32">
    <h2 className="text-xl md:text-2xl font-semibold text-white/90 font-display tracking-tight">
      {title}
    </h2>
    <div className="space-y-3 text-[15px] text-white/65 font-light leading-relaxed">{children}</div>
  </section>
);

export default CGU;
