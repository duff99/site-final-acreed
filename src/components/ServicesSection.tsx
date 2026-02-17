import AnimatedSection from './AnimatedSection';
import SpotlightCard from './SpotlightCard';
import { Radio, Code, Shield, Zap, Factory } from 'lucide-react';

const ServicesSection = () => {
  const services = [
    { icon: Radio, title: 'Télécoms', description: 'Déploiement, ingénierie réseau, optimisation d\'infrastructures : nos consultants accompagnent opérateurs et équipementiers sur leurs projets les plus exigeants.' },
    { icon: Code, title: 'IT / Digital', description: 'Intégrés directement au sein de vos équipes, nos experts pilotent vos projets de transformation digitale, développement logiciel et modernisation SI.' },
    { icon: Shield, title: 'Cybersécurité', description: 'Audit, gouvernance, conformité, réponse aux incidents — des profils spécialisés pour renforcer durablement la sécurité de vos infrastructures critiques.' },
    { icon: Zap, title: 'Énergie Renouvelable', description: 'Solaire, éolien, smart grids, efficacité énergétique : des ingénieurs-consultants engagés aux côtés des acteurs de la transition.' },
    { icon: Factory, title: 'Industrie', description: 'En milieu industriel, nos équipes optimisent vos processus de production, votre supply chain et accompagnent la conduite du changement.' },
  ];

  return (
    <section id="services" className="relative py-20 overflow-hidden scroll-mt-24">
      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header - centré */}
        <AnimatedSection className="max-w-3xl mx-auto text-center mb-20">
          <span className="text-sm text-muted-foreground uppercase tracking-premium mb-4 block">
            Secteurs d'Intervention
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            Nos Domaines d'Expertise
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Nos consultants interviennent au coeur de 5 secteurs stratégiques, apportant leur savoir-faire technique et une approche sur-mesure à chaque mission.
          </p>
        </AnimatedSection>

        {/* Services Grid - Row 1 (3 cards) */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.slice(0, 3).map((service, index) => (
            <AnimatedSection key={service.title} delay={index * 0.15}>
              <SpotlightCard className="p-10 h-full">
                <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-8 group-hover:bg-white/10 transition-colors duration-500 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                  <service.icon className="w-7 h-7 text-foreground/70 group-hover:text-foreground transition-colors duration-500" />
                </div>
                <h3 className="text-2xl font-display font-semibold mb-4">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {service.description}
                </p>
              </SpotlightCard>
            </AnimatedSection>
          ))}
        </div>

        {/* Services Grid - Row 2 (2 centered cards) */}
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto mt-8">
          {services.slice(3).map((service, index) => (
            <AnimatedSection key={service.title} delay={index * 0.15 + 0.45}>
              <SpotlightCard className="p-10 h-full">
                <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-8 group-hover:bg-white/10 transition-colors duration-500 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                  <service.icon className="w-7 h-7 text-foreground/70 group-hover:text-foreground transition-colors duration-500" />
                </div>
                <h3 className="text-2xl font-display font-semibold mb-4">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {service.description}
                </p>
              </SpotlightCard>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
