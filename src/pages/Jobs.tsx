import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Briefcase,
  Clock,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Wifi,
  Send,
  Search,
} from 'lucide-react';
import SkipToContent from '@/components/SkipToContent';
import SEO from '@/components/SEO';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
// Branded button styles (.btn-aura primary + .btn-aura-secondary). Imported here so the
// Jobs route ships them even when the home (where ContactSection lives) hasn't been visited.
import '@/components/ContactSection.css';
import JobJsonLd from '@/components/JobJsonLd';
import AnimatedSection from '@/components/AnimatedSection';
import SpotlightCard from '@/components/SpotlightCard';
import ApplicationModal from '@/components/ApplicationModal';
import { useJobs } from '@/hooks/use-jobs';
import type { Job } from '@shared/types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SECTORS = ['Tous', 'Télécoms', 'IT & Digital', 'Cybersécurité', 'Énergies renouvelables', 'Industrie'] as const;
type Sector = (typeof SECTORS)[number];

/** Maps UI filter labels to the DB sector values (case-insensitive match) */
const sectorMatchesFilter = (jobSector: string, filter: Sector): boolean => {
  if (filter === 'Tous') return true;
  const normalised = jobSector.toLowerCase();
  switch (filter) {
    case 'Télécoms':
      return normalised.includes('telecom') || normalised.includes('télé');
    case 'IT & Digital':
      return normalised.includes('it') || normalised.includes('digital');
    case 'Cybersécurité':
      return normalised.includes('cyber');
    case 'Énergies renouvelables':
      return normalised.includes('energie') || normalised.includes('énergie');
    case 'Industrie':
      return normalised.includes('industrie');
    default:
      return false;
  }
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Format ISO date string to DD/MM/YYYY */
const formatDate = (iso: string): string => {
  const [year, month, day] = iso.split('-');
  return `${day}/${month}/${year}`;
};

// ---------------------------------------------------------------------------
// Animation Variants
// ---------------------------------------------------------------------------

const cardListVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardItemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.25 },
  },
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** A single detail section inside a job card (Missions, Profil, Avantages) */
const CardSection = ({
  title,
  items,
}: {
  title: string;
  items: string[];
}) => (
  <div className="space-y-3">
    <h4 className="text-sm font-semibold uppercase tracking-premium text-white/50 pl-4 border-l-2 border-white/20">
      {title}
    </h4>
    <ul className="space-y-2 pl-4">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-muted-foreground text-sm leading-relaxed">
          <CheckCircle2
            size={14}
            className="mt-1 flex-shrink-0 text-white/30"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

/** Inline tags for the skills list */
const SkillTags = ({ skills }: { skills: string[] }) => (
  <div className="space-y-3">
    <h4 className="text-sm font-semibold uppercase tracking-premium text-white/50 pl-4 border-l-2 border-white/20">
      Compétences
    </h4>
    <div className="flex flex-wrap gap-2 pl-4">
      {skills.map((skill) => (
        <span
          key={skill}
          className="premium-badge text-[11px]"
        >
          {skill}
        </span>
      ))}
    </div>
  </div>
);

/** A single job card */
const JobCard = ({ job }: { job: Job }) => {
  const [applyOpen, setApplyOpen] = useState(false);

  return (
    <motion.div
      variants={cardItemVariants}
      layout
      id={job.id}
      className="scroll-mt-28"
    >
      <SpotlightCard className="p-8 md:p-10">
        <JobJsonLd job={job} />
        {/* ---- Header meta row ---- */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="job-tag font-medium">{job.type}</span>

          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin size={13} />
            {job.location}
          </span>

          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Briefcase size={13} />
            {job.sector}
          </span>

          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock size={13} />
            {job.experience}
          </span>

          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar size={13} />
            {formatDate(job.publishedDate)}
          </span>
        </div>

        {/* ---- Title ---- */}
        <h3 className="text-2xl md:text-3xl font-display font-bold mb-3 text-gradient">
          {job.title}
        </h3>

        {/* ---- Remote badge ---- */}
        <div className="flex items-center gap-2 mb-6">
          <Wifi size={14} className="text-white/40" />
          <span className="text-sm text-muted-foreground">{job.remote}</span>
        </div>

        {/* ---- Full description ---- */}
        <p className="text-muted-foreground leading-relaxed mb-10">
          {job.fullDescription}
        </p>

        {/* ---- Detail sections ---- */}
        <div className="space-y-8 mb-10">
          <CardSection title="Missions principales" items={job.responsibilities} />
          <CardSection title="Profil recherché" items={job.profile} />
          <SkillTags skills={job.skills} />
          <CardSection title="Ce que nous offrons" items={job.advantages} />
        </div>

        {/* ---- Action row ---- */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-6 border-t border-white/10">
          <motion.button
            onClick={() => setApplyOpen(true)}
            className="btn-premium btn-premium-primary inline-flex items-center gap-2 text-sm"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            aria-label={`Postuler à l'offre ${job.title}`}
          >
            <Send size={16} />
            Postuler
          </motion.button>
          <Link
            to={`/offres/${job.id}`}
            className="btn-premium btn-premium-secondary inline-flex items-center gap-2 text-sm"
            aria-label={`Voir le détail de l'offre ${job.title}`}
          >
            <ExternalLink size={16} />
            Voir le détail
          </Link>
          <span className="text-xs text-white/30 sm:ml-auto">
            Ref : {job.id}
          </span>
        </div>
      </SpotlightCard>

      <ApplicationModal
        open={applyOpen}
        onOpenChange={setApplyOpen}
        job={job}
      />
    </motion.div>
  );
};

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

const Jobs = () => {
  const [activeSector, setActiveSector] = useState<Sector>('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [spontaneousOpen, setSpontaneousOpen] = useState(false);
  const location = useLocation();
  const { data: jobs = [] } = useJobs();

  // Scroll to anchor when navigating from main page (e.g. /offres#job-id)
  useEffect(() => {
    if (location.hash) {
      const timer = setTimeout(() => {
        const el = document.getElementById(location.hash.slice(1));
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 600); // Wait for animations to settle
      return () => clearTimeout(timer);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.hash]);

  const filteredJobs = jobs.filter((j) => {
    if (!sectorMatchesFilter(j.sector, activeSector)) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      j.title.toLowerCase().includes(q) ||
      j.fullDescription.toLowerCase().includes(q) ||
      j.skills.some((s) => s.toLowerCase().includes(q)) ||
      j.location.toLowerCase().includes(q) ||
      j.type.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SkipToContent />
      <SEO
        title="Offres d'emploi"
        description="Découvrez nos opportunités de carrière en Télécoms, IT, Cybersécurité, Énergie et Digital. Postes en CDI, freelance et missions de conseil partout en France."
        canonicalPath="/offres"
      />

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main id="main-content" tabIndex={-1} className="pt-24 md:pt-28">
        {/* -------------------------------------------------------------- */}
        {/* HERO COMPACT                                                    */}
        {/* -------------------------------------------------------------- */}
        <section className="relative pt-8 pb-20 md:pt-12 md:pb-28 overflow-hidden">
          {/* Subtle radial glow behind heading */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)',
            }}
          />

          <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
            {/* Back link */}
            <AnimatedSection>
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
                aria-label="Retour à l'accueil"
              >
                <ArrowLeft
                  size={16}
                  className="group-hover:-translate-x-1 transition-transform"
                />
                Retour à l'accueil
              </Link>
            </AnimatedSection>

            {/* Heading */}
            <AnimatedSection delay={0.1} className="max-w-3xl">
              <span className="text-sm text-muted-foreground uppercase tracking-premium mb-4 block">
                Recrutement
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 text-gradient">
                Nos Offres
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
                Découvrez toutes nos opportunités dans les télécoms, l'IT, la cybersécurité, les énergies renouvelables et l'industrie.
              </p>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/5 text-sm font-semibold">
                  {jobs.length}
                </span>
                <span className="text-muted-foreground text-sm">
                  postes ouverts
                </span>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* SEARCH + FILTER BAR                                             */}
        {/* -------------------------------------------------------------- */}
        <section className="pb-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-6">
            {/* Search bar */}
            <AnimatedSection delay={0.15}>
              <div className="relative max-w-md">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher par titre, compétence, ville..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-foreground placeholder:text-white/30 focus:outline-none focus:border-white/25 focus:bg-white/[0.07] transition-colors"
                />
              </div>
            </AnimatedSection>

            {/* Sector filters */}
            <AnimatedSection delay={0.2}>
              <div className="flex flex-wrap gap-3">
                {SECTORS.map((sector) => {
                  const isActive = activeSector === sector;
                  return (
                    <motion.button
                      key={sector}
                      onClick={() => setActiveSector(sector)}
                      className={`
                        relative px-5 py-2.5 rounded-xl text-sm font-medium transition-colors duration-300
                        ${isActive
                          ? 'bg-white text-background'
                          : 'border border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20 hover:bg-white/5'
                        }
                      `}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      aria-label={`Filtrer par ${sector}`}
                      aria-pressed={isActive}
                    >
                      {sector}
                    </motion.button>
                  );
                })}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* JOB CARDS LIST                                                  */}
        {/* -------------------------------------------------------------- */}
        <section className="pb-32 md:pb-40">
          <div className="max-w-4xl mx-auto px-6 lg:px-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSector}
                className="space-y-8"
                variants={cardListVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))
                ) : (
                  <motion.div
                    variants={cardItemVariants}
                    className="text-center py-20"
                  >
                    <p className="text-muted-foreground text-lg">
                      Aucune offre dans cette catégorie pour le moment.
                    </p>
                    <button
                      onClick={() => setActiveSector('Tous')}
                      className="mt-4 text-sm text-white/50 hover:text-white transition-colors underline underline-offset-4"
                    >
                      Voir toutes les offres
                    </button>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* BOTTOM CTA                                                      */}
        {/* -------------------------------------------------------------- */}
        <section className="relative py-32 md:py-40 overflow-hidden">
          {/* Decorative horizontal line */}
          <div
            className="absolute top-0 left-0 right-0 h-px pointer-events-none"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)',
            }}
          />

          {/* Subtle glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 70%)',
            }}
          />

          <div className="relative max-w-3xl mx-auto px-6 lg:px-12 text-center">
            <AnimatedSection>
              <span className="text-sm text-muted-foreground uppercase tracking-premium mb-4 block">
                Candidature spontanée
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 text-gradient">
                Aucune offre ne correspond ?
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-xl mx-auto">
                Envoyez-nous votre candidature spontanée. Nous étudions chaque profil avec
                attention et vous recontactons dès qu'une opportunité se présente.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                {/* Primary CTA — branded "aura" button (matches the landing page Contact CTA) */}
                <div className="button-wrapper">
                  <div className="ambient-glow" />
                  <button
                    type="button"
                    onClick={() => setSpontaneousOpen(true)}
                    className="btn-aura"
                    aria-label="Envoyer une candidature spontanée"
                  >
                    Envoyer ma candidature
                    <Send size={18} className="btn-icon" />
                  </button>
                </div>

                {/* Secondary CTA — same pill silhouette, quieter outline variant */}
                <Link to="/" className="btn-aura-secondary" aria-label="Retour à l'accueil">
                  <ArrowLeft size={18} className="btn-icon" />
                  Retour au site
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Spontaneous application modal — no specific job targeted */}
      <ApplicationModal
        open={spontaneousOpen}
        onOpenChange={setSpontaneousOpen}
      />
    </div>
  );
};

export default Jobs;
