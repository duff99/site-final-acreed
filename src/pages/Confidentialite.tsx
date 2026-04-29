import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SEO from '@/components/SEO';
import SkipToContent from '@/components/SkipToContent';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AnimatedSection from '@/components/AnimatedSection';

const lastUpdate = '29 avril 2026';

const Confidentialite = () => (
  <div className="min-h-screen bg-background text-foreground">
    <SEO
      title="Politique de confidentialité"
      description="Comment Acreed Consulting collecte, traite et protège vos données personnelles. Vos droits RGPD, durées de conservation, sous-traitants et contact."
      canonicalPath="/confidentialite"
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
            <span className="text-xs uppercase tracking-[3px] text-[#dbcca5]/80 mb-3 block">RGPD</span>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-3 text-gradient">
              Politique de confidentialité
            </h1>
            <p className="text-sm text-white/40 mb-12">Dernière mise à jour : {lastUpdate}</p>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="space-y-12">

              <Section title="1. Responsable du traitement">
                <p>Le responsable du traitement de vos données personnelles est :</p>
                <KV
                  rows={[
                    ['Société', 'Acreed Consulting (SAS) — RCS Le Puy-en-Velay 883 042 798'],
                    ['Siège social', '5 Lotissement La Chaud — Grazac, 43320 Saint-Vidal, France'],
                    ['Représentant légal', 'Steven Breuil, Président'],
                    ['Email RGPD', 'contact@acreedconsulting.com'],
                    ['DPO', 'Aucun DPO désigné — contact RGPD via l\'email ci-dessus'],
                  ]}
                />
                <p>
                  La présente politique décrit les conditions dans lesquelles Acreed Consulting
                  collecte, utilise, conserve et protège les données personnelles des utilisateurs
                  du site, conformément au Règlement (UE) 2016/679 (RGPD) et à la loi n° 78-17
                  du 6 janvier 1978 modifiée (Informatique et Libertés).
                </p>
              </Section>

              <Section title="2. Données collectées et finalités">
                <p>
                  Nous collectons uniquement les données nécessaires aux finalités décrites
                  ci-dessous. Aucune donnée sensible (santé, religion, opinion politique...)
                  n'est collectée.
                </p>

                <SubTitle>2.1 Formulaire de contact</SubTitle>
                <Table
                  headers={['Donnée', 'Finalité', 'Base légale']}
                  rows={[
                    ['Nom, prénom', 'Identification de l\'expéditeur', 'Consentement (art. 6.1.a RGPD)'],
                    ['Email', 'Réponse à votre demande', 'Consentement'],
                    ['Téléphone (optionnel)', 'Reprise de contact si fourni', 'Consentement'],
                    ['Sujet, message', 'Traitement de la demande', 'Consentement'],
                    ['Entreprise / délai / secteur (selon sujet)', 'Qualification de la demande B2B/B2C', 'Consentement'],
                  ]}
                />

                <SubTitle>2.2 Candidature à une offre d'emploi</SubTitle>
                <Table
                  headers={['Donnée', 'Finalité', 'Base légale']}
                  rows={[
                    ['Nom, prénom, email', 'Identification du candidat', 'Mesures précontractuelles (art. 6.1.b RGPD)'],
                    ['Téléphone (optionnel)', 'Prise de contact', 'Mesures précontractuelles'],
                    ['Lien CV (optionnel)', 'Évaluation de la candidature', 'Mesures précontractuelles'],
                    ['Message de motivation', 'Évaluation de la candidature', 'Mesures précontractuelles'],
                    ['Référence offre (jobId, intitulé)', 'Rattachement de la candidature', 'Mesures précontractuelles'],
                  ]}
                />

                <SubTitle>2.3 Données techniques de navigation</SubTitle>
                <Table
                  headers={['Donnée', 'Finalité', 'Base légale']}
                  rows={[
                    ['Adresse IP', 'Sécurité, détection d\'abus, limite de débit', 'Intérêt légitime (art. 6.1.f RGPD)'],
                    ['User-Agent', 'Compatibilité, statistiques anonymes', 'Intérêt légitime'],
                    ['Logs serveur (date, route, code HTTP)', 'Sécurité, diagnostic technique', 'Intérêt légitime'],
                    ['Cookies techniques (session admin)', 'Authentification de l\'espace administrateur', 'Intérêt légitime + obligation contractuelle'],
                  ]}
                />
                <p className="text-sm text-white/55">
                  Le détail des cookies utilisés est décrit dans notre{' '}
                  <Link to="/politique-cookies" className="text-[#dbcca5] underline decoration-dotted underline-offset-2 hover:text-white">
                    politique de cookies
                  </Link>
                  .
                </p>
              </Section>

              <Section title="3. Durée de conservation">
                <Table
                  headers={['Catégorie', 'Durée active', 'Archivage / suppression']}
                  rows={[
                    ['Messages de contact', '3 ans à compter du dernier échange', 'Suppression à l\'issue'],
                    ['Candidatures', '2 ans à compter de la candidature (recommandation CNIL)', 'Suppression — sauf consentement renouvelé'],
                    ['Comptes administrateurs', 'Pendant la durée de la fonction', 'Suppression dans les 30 jours suivant la fin de fonction'],
                    ['Logs serveur (sécurité)', '12 mois', 'Purge automatique'],
                    ['Logs d\'authentification', '12 mois', 'Purge automatique'],
                    ['Données comptables', '10 ans (art. L.123-22 Code de commerce)', 'Archivage sécurisé'],
                  ]}
                />
              </Section>

              <Section title="4. Destinataires et sous-traitants">
                <p>Vos données ne sont communiquées qu'à :</p>
                <ul className="list-disc list-outside pl-5 space-y-1.5 text-[15px] text-white/65 font-light marker:text-[#dbcca5]/60">
                  <li>nos collaborateurs habilités, dans la limite stricte de leurs missions ;</li>
                  <li>nos sous-traitants techniques, listés ci-dessous ;</li>
                  <li>les autorités administratives ou judiciaires lorsque la loi l'exige.</li>
                </ul>
                <Table
                  headers={['Sous-traitant', 'Rôle', 'Données concernées', 'Localisation / garanties']}
                  rows={[
                    ['Microsoft Azure', 'Hébergement de la VM applicative et de la base de données', 'Toutes les données du site', 'Irlande (UE) — Microsoft DPA, ISO 27001/27018'],
                    ['Microsoft 365 (Exchange Online)', 'Envoi des notifications email aux équipes Acreed', 'Email, nom, sujet, contenu du message', 'UE — Microsoft DPA, ISO 27001/27018'],
                  ]}
                />
              </Section>

              <Section title="5. Transferts de données hors de l'Espace économique européen">
                <p>
                  Nous nous efforçons de stocker et de traiter vos données exclusivement au sein
                  de l'Espace économique européen (EEE). Les sous-traitants identifiés ci-dessus
                  sont configurés pour héberger les données en Union européenne (Irlande).
                </p>
                <p>
                  Dans l'hypothèse où un transfert hors EEE serait rendu nécessaire, celui-ci
                  serait encadré par les Clauses Contractuelles Types de la Commission européenne
                  (décision 2021/914) ou par toute autre garantie appropriée prévue aux articles
                  44 à 49 du RGPD.
                </p>
              </Section>

              <Section title="6. Vos droits">
                <p>
                  Conformément aux articles 15 à 22 du RGPD, vous disposez des droits suivants
                  sur vos données :
                </p>
                <Table
                  headers={['Droit', 'Référence', 'Description']}
                  rows={[
                    ['Droit d\'accès', 'Art. 15 RGPD', 'Obtenir la confirmation que vos données sont traitées et en recevoir une copie'],
                    ['Droit de rectification', 'Art. 16 RGPD', 'Faire corriger des données inexactes ou incomplètes'],
                    ['Droit à l\'effacement', 'Art. 17 RGPD', '« Droit à l\'oubli » — suppression dans les conditions prévues'],
                    ['Droit à la limitation', 'Art. 18 RGPD', 'Geler temporairement le traitement de vos données'],
                    ['Droit à la portabilité', 'Art. 20 RGPD', 'Recevoir vos données dans un format structuré, lisible par machine'],
                    ['Droit d\'opposition', 'Art. 21 RGPD', 'Vous opposer au traitement pour des motifs tenant à votre situation'],
                    ['Retrait du consentement', 'Art. 7 RGPD', 'À tout moment, sans affecter la licéité des traitements antérieurs'],
                    ['Directives post mortem', 'Loi 78-17 art. 85', 'Définir le sort de vos données après votre décès'],
                  ]}
                />
                <p>
                  Pour exercer ces droits, contactez-nous à{' '}
                  <a href="mailto:contact@acreedconsulting.com" className="text-[#dbcca5] underline decoration-dotted underline-offset-2 hover:text-white">
                    contact@acreedconsulting.com
                  </a>
                  . Une copie d'une pièce d'identité pourra vous être demandée en cas de doute
                  raisonnable sur votre identité (art. 12.6 RGPD). Nous répondons dans un délai
                  maximal d'un mois, prorogeable de deux mois pour les demandes complexes.
                </p>
                <p>
                  Si vous estimez, après nous avoir contactés, que vos droits ne sont pas respectés,
                  vous pouvez introduire une réclamation auprès de la{' '}
                  <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-[#dbcca5] underline decoration-dotted underline-offset-2 hover:text-white">
                    CNIL
                  </a>{' '}
                  (3 place de Fontenoy, 75007 Paris).
                </p>
              </Section>

              <Section title="7. Sécurité des données">
                <ul className="list-disc list-outside pl-5 space-y-1.5 text-[15px] text-white/65 font-light marker:text-[#dbcca5]/60">
                  <li>chiffrement TLS de bout en bout pour les communications avec le site ;</li>
                  <li>mots de passe administrateur stockés sous forme de condensats bcrypt (12 rounds) ;</li>
                  <li>jetons d'authentification à durée courte (15 minutes) avec rotation et révocation des sessions ;</li>
                  <li>verrouillage automatique des comptes après 5 tentatives de connexion infructueuses ;</li>
                  <li>en-têtes de sécurité HTTP (CSP, X-Frame-Options, X-Content-Type-Options, Permissions-Policy) ;</li>
                  <li>limitation de débit (rate-limit) sur les endpoints sensibles ;</li>
                  <li>sauvegardes quotidiennes chiffrées de la base de données.</li>
                </ul>
              </Section>

              <Section title="8. Modifications de la politique">
                <p>
                  Cette politique peut être modifiée pour tenir compte d'évolutions légales,
                  techniques ou organisationnelles. La date de dernière mise à jour figure en
                  tête du document. En cas de modification substantielle, nous vous en informerons
                  par tout moyen approprié (email, bandeau d'information, mise à jour en page d'accueil).
                </p>
              </Section>

              <Section title="9. Contact">
                <p>
                  Pour toute question relative à la protection de vos données :{' '}
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

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="space-y-4 scroll-mt-32">
    <h2 className="text-xl md:text-2xl font-semibold text-white/90 font-display tracking-tight">
      {title}
    </h2>
    <div className="space-y-3 text-[15px] text-white/65 font-light leading-relaxed">{children}</div>
  </section>
);

const SubTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-base font-medium text-white/80 mt-4 mb-1">{children}</h3>
);

const Table = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
  <div className="overflow-x-auto rounded-xl border border-white/[0.06] bg-white/[0.02]">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-white/[0.06] bg-white/[0.02]">
          {headers.map((h) => (
            <th key={h} className="text-left px-4 py-3 text-[11px] uppercase tracking-[1.5px] text-white/45 font-medium">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-white/[0.04]">
        {rows.map((row, i) => (
          <tr key={i} className="hover:bg-white/[0.015]">
            {row.map((cell, j) => (
              <td key={j} className="px-4 py-3 text-white/75 font-light leading-relaxed align-top">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const KV = ({ rows }: { rows: [string, string][] }) => (
  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
    <dl className="divide-y divide-white/[0.04]">
      {rows.map(([k, v]) => (
        <div key={k} className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-4 px-4 py-3">
          <dt className="text-xs uppercase tracking-[1.5px] text-white/40">{k}</dt>
          <dd className="md:col-span-2 text-[15px] text-white/80 font-light break-words">{v}</dd>
        </div>
      ))}
    </dl>
  </div>
);

export default Confidentialite;
