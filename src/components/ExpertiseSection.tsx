import * as Icons from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { expertises } from '@/data/expertise';
import './ExpertiseSection.css';

const ExpertiseSection = () => {
  return (
    <section id="expertise" className="relative services-section scroll-mt-24">
      <div className="content-wrapper">
        <AnimatedSection className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-sm text-muted-foreground uppercase tracking-premium mb-4 block">
            Nos Services
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            Offres <span>&</span> Services
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            ACREED Consulting propose une gamme complète de services pour accompagner votre
            croissance et sécuriser vos projets complexes.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.2} className="w-full">
          <div className="services-grid">
            {expertises.map((expertise, i) => {
              const Icon = Icons[expertise.icon as keyof typeof Icons] as Icons.LucideIcon;
              return (
                <div
                  key={i}
                  className="service-card"
                  style={{ backgroundImage: `url('${expertise.image}')` }}
                >
                  <div className="card-overlay">
                    <div className="card-top">
                      <div className="icon-wrapper">
                        <Icon size={24} />
                      </div>
                    </div>
                    <div className="card-bottom">
                      <h3 className="card-title">{expertise.title}</h3>
                      <div className="divider"></div>
                      <div className="card-text-wrapper">
                        <div className="card-desc">
                          {expertise.description}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default ExpertiseSection;
