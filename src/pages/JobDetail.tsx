import { useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Clock,
  Calendar,
  CheckCircle2,
  Wifi,
  Send,
} from 'lucide-react';
import SkipToContent from '@/components/SkipToContent';
import SEO from '@/components/SEO';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import JobJsonLd from '@/components/JobJsonLd';
import AnimatedSection from '@/components/AnimatedSection';
import SpotlightCard from '@/components/SpotlightCard';
import ApplicationModal from '@/components/ApplicationModal';
import RouteFallback from '@/components/RouteFallback';
import { useJob } from '@/hooks/use-jobs';

const SITE_URL = 'https://site.acreedconsulting.com';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const formatDate = (iso: string): string => {
  const [year, month, day] = iso.split('-');
  return `${day}/${month}/${year}`;
};

// ---------------------------------------------------------------------------
// Sub-components (mirroring Jobs.tsx visual style)
// ---------------------------------------------------------------------------

const CardSection = ({ title, items }: { title: string; items: string[] }) => (
  <div className="space-y-3">
    <h3 className="text-sm font-semibold uppercase tracking-premium text-white/50 pl-4 border-l-2 border-white/20">
      {title}
    </h3>
    <ul className="space-y-2 pl-4">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-muted-foreground text-sm leading-relaxed">
          <CheckCircle2 size={14} className="mt-1 flex-shrink-0 text-white/30" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

const SkillTags = ({ skills }: { skills: string[] }) => (
  <div className="space-y-3">
    <h3 className="text-sm font-semibold uppercase tracking-premium text-white/50 pl-4 border-l-2 border-white/20">
      Compétences
    </h3>
    <div className="flex flex-wrap gap-2 pl-4">
      {skills.map((skill) => (
        <span key={skill} className="premium-badge text-[11px]">
          {skill}
        </span>
      ))}
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [applyOpen, setApplyOpen] = useState(false);

  const { data: job, isLoading, isError } = useJob(id);

  if (!id) return <Navigate to="/offres" replace />;
  if (isLoading) return <RouteFallback />;
  if (isError || !job) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <main id="main-content" tabIndex={-1} className="pt-24 md:pt-28">
          <div className="max-w-4xl mx-auto px-6 lg:px-12 py-20 text-center">
            <p className="text-2xl font-display font-bold text-gradient mb-4">
              Offre introuvable
            </p>
            <p className="text-muted-foreground mb-8">
              Cette offre n'existe pas ou n'est plus disponible.
            </p>
            <Link
              to="/offres"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Retour aux offres
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const canonicalUrl = `${SITE_URL}/offres/${job.id}`;
  const seoDescription = job.description.length > 160
    ? job.description.slice(0, 157) + '…'
    : job.description;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SkipToContent />
      <SEO
        title={`${job.title} — Acreed Consulting`}
        description={seoDescription}
        canonicalPath={`/offres/${job.id}`}
        ogType="article"
        bareTitle
      />
      <JobJsonLd job={job} canonicalUrl={canonicalUrl} />

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main id="main-content" tabIndex={-1} className="pt-24 md:pt-28">
        {/* ---------------------------------------------------------------- */}
        {/* HERO COMPACT                                                      */}
        {/* ---------------------------------------------------------------- */}
        <section className="relative pt-8 pb-16 md:pt-12 md:pb-20 overflow-hidden">
          {/* Subtle radial glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)',
            }}
          />

          <div className="relative max-w-4xl mx-auto px-6 lg:px-12">
            {/* Back link */}
            <AnimatedSection>
              <Link
                to="/offres"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10 group"
                aria-label="Retour aux offres"
              >
                <ArrowLeft
                  size={16}
                  className="group-hover:-translate-x-1 transition-transform"
                />
                Retour aux offres
              </Link>
            </AnimatedSection>

            {/* Sector label */}
            <AnimatedSection delay={0.05}>
              <span className="text-sm text-muted-foreground uppercase tracking-premium mb-4 block">
                {job.sector}
              </span>
            </AnimatedSection>

            {/* Title */}
            <AnimatedSection delay={0.1}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-gradient">
                {job.title}
              </h1>
            </AnimatedSection>

            {/* Meta row */}
            <AnimatedSection delay={0.15}>
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <span className="job-tag font-medium">{job.type}</span>

                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin size={14} />
                  {job.location}
                </span>

                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Briefcase size={14} />
                  {job.sector}
                </span>

                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock size={14} />
                  {job.experience}
                </span>

                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar size={14} />
                  Publié le {formatDate(job.publishedDate)}
                </span>

                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Wifi size={14} />
                  {job.remote}
                </span>
              </div>
            </AnimatedSection>

            {/* Apply CTA (top) */}
            <AnimatedSection delay={0.2}>
              <motion.button
                onClick={() => setApplyOpen(true)}
                className="btn-premium btn-premium-primary inline-flex items-center gap-2"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                aria-label={`Postuler à l'offre ${job.title}`}
              >
                <Send size={16} />
                Postuler à cette offre
              </motion.button>
            </AnimatedSection>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* JOB DETAIL CARD                                                   */}
        {/* ---------------------------------------------------------------- */}
        <section className="pb-32 md:pb-40">
          <div className="max-w-4xl mx-auto px-6 lg:px-12">
            <AnimatedSection delay={0.25}>
              <SpotlightCard className="p-8 md:p-10">
                {/* Full description */}
                <div className="mb-10">
                  <h2 className="text-sm font-semibold uppercase tracking-premium text-white/50 pl-4 border-l-2 border-white/20 mb-4">
                    Description du poste
                  </h2>
                  <p className="text-muted-foreground leading-relaxed pl-4">
                    {job.fullDescription}
                  </p>
                </div>

                {/* Detail sections */}
                <div className="space-y-8 mb-10">
                  <CardSection title="Missions principales" items={job.responsibilities} />
                  <CardSection title="Profil recherché" items={job.profile} />
                  <SkillTags skills={job.skills} />
                  <CardSection title="Ce que nous offrons" items={job.advantages} />
                </div>

                {/* Action row */}
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
                    to="/offres"
                    className="btn-premium btn-premium-secondary inline-flex items-center gap-2 text-sm"
                  >
                    <ArrowLeft size={16} />
                    Retour aux offres
                  </Link>

                  <span className="text-xs text-white/30 sm:ml-auto">
                    Ref : {job.id}
                  </span>
                </div>
              </SpotlightCard>
            </AnimatedSection>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Application modal */}
      <ApplicationModal open={applyOpen} onOpenChange={setApplyOpen} job={job} />
    </div>
  );
};

export default JobDetail;
