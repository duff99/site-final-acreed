import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnimatedSection from './AnimatedSection';
import SpotlightCard from './SpotlightCard';
import { ArrowRight, Loader2, MapPin } from 'lucide-react';
import { useJobs } from '@/hooks/use-jobs';

const JobsSection = () => {
  const { data: jobs = [], isLoading } = useJobs();
  const displayedJobs = jobs.slice(0, 3);

  return (
    <section id="jobs" className="relative py-20 overflow-hidden scroll-mt-24">
      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header - centré */}
        <AnimatedSection className="max-w-3xl mx-auto text-center mb-20">
          <span className="text-sm text-muted-foreground uppercase tracking-premium mb-4 block">
            Opportunités
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            Offres<span className="text-gradient"> d'emploi</span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Rejoignez des projets d'exception avec les leaders du secteur.
          </p>
        </AnimatedSection>

        {/* Jobs List */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {isLoading && displayedJobs.length === 0 && (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin mr-3" />
              <span className="text-sm">Chargement des offres…</span>
            </div>
          )}
          {!isLoading && displayedJobs.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">
              Aucune offre disponible pour le moment.
            </div>
          )}
          {displayedJobs.map((job, index) => (
            <AnimatedSection key={job.id} delay={index * 0.1}>
              <Link to={`/offres/${job.id}`} className="block">
                <SpotlightCard className="p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs px-3 py-1 rounded-md bg-[#dbcca5]/10 text-[#dbcca5] border border-[#dbcca5]/20">{job.type}</span>
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin size={14} className="text-[#dbcca5]/60" />
                          {job.location}
                        </span>
                      </div>
                      <h3 className="text-xl font-display font-semibold mb-2">
                        {job.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {job.description}
                      </p>
                    </div>
                    <span className="flex items-center gap-2 px-6 py-3 text-sm font-medium border border-[#dbcca5]/20 rounded-xl text-[#dbcca5]/80 hover:bg-[#dbcca5]/5 hover:border-[#dbcca5]/40 transition-all">
                      Voir le détail
                      <ArrowRight size={16} />
                    </span>
                  </div>
                </SpotlightCard>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        {/* View All Link */}
        <AnimatedSection delay={0.4} className="mt-12 text-center">
          <Link
            to="/offres"
            className="inline-flex items-center gap-3 text-[#dbcca5]/70 hover:text-[#dbcca5] transition-colors group"
          >
            <motion.span className="text-lg" whileHover={{ x: 4 }}>
              Voir toutes les offres
            </motion.span>
            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default JobsSection;
