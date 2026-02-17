import AnimatedSection from './AnimatedSection';
import SpotlightCard from './SpotlightCard';
import { Zap, BadgeEuro, Radio, Eye } from 'lucide-react';

const AboutSection = () => {
  const values = [
    { icon: Zap, title: "Rapidité d'Intervention", description: 'Efficacité opérationnelle avec des déploiements rapides et adaptés.' },
    { icon: BadgeEuro, title: 'Politique Tarifaire Compétitive', description: 'Tarifs inférieurs à la moyenne du marché sans compromis sur la qualité.' },
    { icon: Radio, title: 'Expertise Télécoms Pointue', description: "Savoir-faire reconnu grâce à l'expertise du fondateur dans le secteur." },
    { icon: Eye, title: 'Transparence & Confiance', description: 'Relations basées sur la franchise et la transparence totale.' },
  ];

  return (
    <section id="about" className="relative py-20 overflow-hidden scroll-mt-24">
      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header - centre */}
        <AnimatedSection className="max-w-3xl mb-20 mx-auto text-center">
          <span className="text-sm text-muted-foreground uppercase tracking-premium mb-4 block">
            Notre Force
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            Valeurs & Atouts
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            ACREED Consulting se distingue par sa rapidité, sa compétitivité et son expertise reconnue.
          </p>
        </AnimatedSection>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <AnimatedSection key={value.title} delay={index * 0.15}>
              <SpotlightCard className="p-8 h-full">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors duration-500 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                  <value.icon className="w-6 h-6 text-foreground/70 group-hover:text-foreground transition-colors duration-500" />
                </div>
                <h3 className="text-xl font-display font-semibold mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </SpotlightCard>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
