import { Link } from 'react-router-dom';
import { ArrowLeft, Settings2 } from 'lucide-react';
import SEO from '@/components/SEO';
import SkipToContent from '@/components/SkipToContent';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AnimatedSection from '@/components/AnimatedSection';
import { useCookieConsent } from '@/hooks/use-cookie-consent';

const lastUpdate = '29 avril 2026';

const PolitiqueCookies = () => {
  const { reopen } = useCookieConsent();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Politique de cookies"
        description="Liste détaillée des cookies déposés sur acreedconsulting.com, leur finalité, leur durée et comment refuser ou modifier votre consentement."
        canonicalPath="/politique-cookies"
      />
      <SkipToContent />
      <Navigation />
      <main id="main-content" tabIndex={-1} className="pt-24 md:pt-28">
        <section className="relative py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-6 lg:px-12">
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
                Cookies & traceurs
              </span>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-3 text-gradient">
                Politique de cookies
              </h1>
              <p className="text-sm text-white/40 mb-12">Dernière mise à jour : {lastUpdate}</p>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="space-y-12">

                <Section title="1. Qu'est-ce qu'un cookie ?">
                  <p>
                    Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur,
                    tablette, smartphone) lors de la consultation d'un site internet. Il permet
                    notamment de reconnaître votre navigateur, mémoriser vos préférences ou
                    sécuriser votre session.
                  </p>
                  <p>
                    Le terme « cookies » désigne ici, par extension, l'ensemble des traceurs
                    déposés ou lus lors de votre navigation : cookies HTTP, pixels, Local Storage,
                    Session Storage et technologies équivalentes.
                  </p>
                </Section>

                <Section title="2. Cadre juridique">
                  <p>
                    Le dépôt de cookies est encadré par l'article 82 de la loi Informatique et
                    Libertés (transposition de la directive 2002/58/CE dite « ePrivacy ») et par
                    les{' '}
                    <a
                      href="https://www.cnil.fr/fr/cookies-et-traceurs-que-dit-la-loi"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#dbcca5] underline decoration-dotted underline-offset-2 hover:text-white"
                    >
                      lignes directrices et recommandations de la CNIL
                    </a>{' '}
                    relatives aux cookies et autres traceurs.
                  </p>
                  <p>
                    Conformément à ces règles, les cookies non strictement nécessaires au
                    fonctionnement du site ne sont déposés qu'après obtention de votre
                    consentement libre, spécifique, éclairé et univoque. Refuser doit être aussi
                    simple qu'accepter.
                  </p>
                </Section>

                <Section title="3. Catégories de cookies utilisés">
                  <ul className="list-disc list-outside pl-5 space-y-1.5 text-[15px] text-white/65 font-light marker:text-[#dbcca5]/60">
                    <li>
                      <strong className="text-white/85">Strictement nécessaires</strong> —
                      indispensables au fonctionnement du site (authentification, sécurité,
                      préférences de session). Exemptés de consentement.
                    </li>
                    <li>
                      <strong className="text-white/85">Mesure d'audience</strong> — statistiques
                      d'utilisation. Aucun outil de mesure d'audience tiers n'est actif à ce jour.
                    </li>
                    <li>
                      <strong className="text-white/85">Marketing</strong> — contenus
                      personnalisés et mesure d'efficacité des campagnes. Aucun cookie marketing
                      n'est actif à ce jour.
                    </li>
                  </ul>
                </Section>

                <Section title="4. Liste détaillée des cookies déposés">
                  <p>
                    Le tableau ci-dessous recense les cookies effectivement déposés sur le site
                    acreedconsulting.com.
                  </p>
                  <Table
                    headers={['Nom', 'Émetteur', 'Catégorie', 'Finalité', 'Durée', 'Base légale']}
                    rows={[
                      [
                        'acreed_session',
                        'acreedconsulting.com (1ʳᵉ partie)',
                        'Strictement nécessaire',
                        'Maintien de la session de l\'espace administrateur (httpOnly, Secure, SameSite=Strict)',
                        '7 jours maximum',
                        'Exécution du contrat (art. 6.1.b RGPD) — exempté de consentement',
                      ],
                      [
                        'acreed_cookie_consent',
                        'acreedconsulting.com (1ʳᵉ partie, localStorage)',
                        'Strictement nécessaire',
                        'Mémoriser votre choix sur les cookies optionnels',
                        '12 mois (durée recommandée par la CNIL)',
                        'Strictement nécessaire (art. 82 loi Informatique et Libertés) — exempté de consentement',
                      ],
                    ]}
                  />
                  <p className="text-sm text-white/55 mt-3">
                    Aucun cookie de mesure d'audience tiers (Google Analytics, Matomo, etc.),
                    ni cookie marketing ou de réseau social, n'est actuellement déposé. En cas
                    d'évolution, ce tableau sera mis à jour et votre consentement à nouveau
                    sollicité.
                  </p>
                </Section>

                <Section title="5. Comment gérer vos préférences">
                  <p>
                    Vous pouvez à tout moment modifier votre choix en rouvrant le bandeau de
                    consentement&nbsp;:
                  </p>
                  <button
                    type="button"
                    onClick={reopen}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl bg-[#dbcca5] text-[#0a0a0b] hover:bg-white transition-colors"
                  >
                    <Settings2 className="h-4 w-4" />
                    Modifier mes préférences cookies
                  </button>
                  <p className="mt-4">
                    Vous pouvez également configurer votre navigateur pour bloquer ou supprimer
                    les cookies. La procédure varie selon le navigateur&nbsp;:
                  </p>
                  <ul className="list-disc list-outside pl-5 space-y-1.5 text-[15px] text-white/65 font-light marker:text-[#dbcca5]/60">
                    <li>
                      <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-[#dbcca5] underline decoration-dotted underline-offset-2 hover:text-white">
                        Google Chrome
                      </a>
                    </li>
                    <li>
                      <a href="https://support.mozilla.org/fr/kb/protection-renforcee-contre-pistage-firefox-ordinateur" target="_blank" rel="noopener noreferrer" className="text-[#dbcca5] underline decoration-dotted underline-offset-2 hover:text-white">
                        Mozilla Firefox
                      </a>
                    </li>
                    <li>
                      <a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-[#dbcca5] underline decoration-dotted underline-offset-2 hover:text-white">
                        Safari
                      </a>
                    </li>
                    <li>
                      <a href="https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-[#dbcca5] underline decoration-dotted underline-offset-2 hover:text-white">
                        Microsoft Edge
                      </a>
                    </li>
                  </ul>
                  <p className="text-sm text-white/55">
                    Note : bloquer les cookies strictement nécessaires peut empêcher certaines
                    fonctionnalités du site de fonctionner correctement (notamment l'espace
                    administrateur).
                  </p>
                </Section>

                <Section title="6. Modifications">
                  <p>
                    Cette politique peut être mise à jour pour intégrer de nouveaux cookies ou
                    refléter des évolutions législatives. En cas de modification substantielle,
                    le bandeau de consentement vous sera de nouveau présenté afin de recueillir
                    votre choix.
                  </p>
                </Section>

                <Section title="7. Contact">
                  <p>
                    Pour toute question :{' '}
                    <a href="mailto:contact@acreedconsulting.com" className="text-[#dbcca5] underline decoration-dotted underline-offset-2 hover:text-white">
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
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="space-y-4 scroll-mt-32">
    <h2 className="text-xl md:text-2xl font-semibold text-white/90 font-display tracking-tight">
      {title}
    </h2>
    <div className="space-y-3 text-[15px] text-white/65 font-light leading-relaxed">{children}</div>
  </section>
);

const Table = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02]">
    <table className="w-full text-sm table-fixed">
      <thead>
        <tr className="border-b border-white/[0.06] bg-white/[0.02]">
          {headers.map((h) => (
            <th key={h} className="text-left px-3 py-3 text-[11px] uppercase tracking-[1.5px] text-white/45 font-medium break-words">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-white/[0.04]">
        {rows.map((row, i) => (
          <tr key={i} className="hover:bg-white/[0.015]">
            {row.map((cell, j) => (
              <td key={j} className="px-3 py-3 text-white/75 font-light leading-relaxed align-top break-words">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default PolitiqueCookies;
