import { Users, UserPlus, Search, FolderKanban } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import SpotlightCard from './SpotlightCard';

interface ExpertiseCard {
  icon: React.ElementType;
  title: string;
  description: string;
}

const ExpertiseSection = () => {
  const expertises: ExpertiseCard[] = [
    { icon: Users, title: 'Consulting Externe sur Mesure', description: 'Mise à disposition de consultants spécialisés pour des missions temporaires ou longues dans les télécoms, IT et cybersécurité.' },
    { icon: UserPlus, title: 'Prestation + Internalisation', description: "Possibilité d'intégrer nos consultants chez le client après une première mission réussie." },
    { icon: Search, title: 'Recrutement Interne', description: 'Assistance complète au recrutement de talents qualifiés pour répondre aux besoins spécifiques de nos clients.' },
    { icon: FolderKanban, title: 'Gestion de Projets', description: "Accompagnement complet avec création d'outils personnalisés, pilotage et coordination de projets complexes." },
  ];

  return (
    <section id="expertise" className="relative py-20 overflow-hidden scroll-mt-24">
      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header - centré */}
        <AnimatedSection className="max-w-3xl mx-auto text-center mb-20">
          <span className="text-sm text-muted-foreground uppercase tracking-premium mb-4 block">
            Nos Services
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            Offres &<span className="text-gradient"> Services</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            ACREED Consulting propose une gamme complète de services pour accompagner votre croissance.
          </p>
        </AnimatedSection>

        {/* Expertise Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {expertises.map((card, index) => {
            const Icon = card.icon;
            return (
              <AnimatedSection key={card.title} delay={index * 0.1}>
                <SpotlightCard className="p-8 h-full">
                  <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors duration-500 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                    <Icon className="w-7 h-7 text-foreground/70 group-hover:text-foreground transition-colors duration-500" />
                  </div>
                  <h3 className="text-xl font-display font-semibold mb-3 text-foreground">
                    {card.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {card.description}
                  </p>
                </SpotlightCard>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ExpertiseSection;
