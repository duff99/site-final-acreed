import { Zap, BadgeEuro, Radio, Handshake, Globe } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import './AboutSection.css';

const AboutSection = () => {
  const values: { icon: LucideIcon; title: string; description: string }[] = [
    { icon: Zap, title: "Rapidité d'Intervention", description: 'Efficacité opérationnelle avec des déploiements rapides et adaptés aux exigences de vos projets.' },
    { icon: BadgeEuro, title: 'Politique Tarifaire', description: 'Des tarifs inférieurs à la moyenne du marché sans le moindre compromis sur la qualité de service.' },
    { icon: Radio, title: 'Expertise Télécoms', description: 'Un savoir-faire pointu reconnu, forgé par l\'expertise terrain du fondateur dans le secteur.' },
    { icon: Handshake, title: 'Confiance & Transparence', description: 'Nous construisons nos relations sur une base solide de franchise, d\'honnêteté et de transparence.' },
    { icon: Globe, title: 'Ouverture Multisectorielle', description: 'Nous transposons notre modèle d\'excellence avec la même rigueur vers l\'IT, la Cyber et l\'Industrie.' },
  ];

  return (
    <section id="about" className="relative py-20 overflow-hidden scroll-mt-24">
      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 flex flex-col items-center">
        {/* Header - centre */}
        <AnimatedSection className="max-w-3xl mb-20 mx-auto text-center">
          <span className="text-sm text-muted-foreground uppercase tracking-premium mb-4 block">
            Notre Force
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            Valeurs <span className="italic font-normal text-white/90">&</span> Atouts
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            ACREED Consulting se distingue par sa rapidité, sa compétitivité et son expertise reconnue.
          </p>
        </AnimatedSection>

        {/* Cards Hand */}
        <AnimatedSection delay={0.2} className="w-full relative z-10 flex justify-center mt-10">
          <div className="cards-hand">
            {values.map((value, index) => (
              <div key={index} className="playing-card group">
                <div className="card-glass-shine" />
                <div className="card-content-wrapper">
                  <value.icon className="card-icon" size={40} strokeWidth={1.5} />
                  <h3 className="card-title">{value.title}</h3>
                  <div className="card-divider" />
                  <p className="card-desc">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default AboutSection;
