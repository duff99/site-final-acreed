import { Eye, Lightbulb, Users, Zap, BadgeEuro, Handshake, Globe } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import './AboutSection.css';

const credoCards: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Eye,
    title: 'Transparence Absolue',
    description:
      "La transparence structure notre méthode plus qu'elle ne l'orne. Clarté sur les méthodologies, traçabilité sur les facturations, restitutions périodiques sur l'état d'avancement : une discipline qui libère la confiance et garantit la qualité décisionnelle de nos clients.",
  },
  {
    icon: Lightbulb,
    title: 'Expertise & Simplicité',
    description:
      "L'expertise se mesure à la justesse du diagnostic plus qu'à la complexité du discours. Maîtrise des métiers techniques, lecture précise de chaque contexte, sélection rigoureuse des profils : autant de prérequis qui demeurent invisibles pour nos clients. Ce que nous livrons, en revanche, doit être lisible, opérationnel et directement actionnable.",
  },
  {
    icon: Users,
    title: 'Fédérer le Collectif',
    description:
      "Une mission performante repose sur un collectif aligné. Cohésion entre nos équipes internes, accompagnement continu des consultants détachés, dialogue régulier avec les directions clientes : trois équilibres que nous cultivons avec méthode. Le partenariat durable naît de cette continuité humaine, plus que de la qualité ponctuelle d'une intervention.",
  },
];

const atoutCards: { suit: string; icon: LucideIcon; title: string; description: string }[] = [
  {
    suit: '♠',
    icon: Zap,
    title: "Rapidité d'Intervention",
    description:
      "Efficacité opérationnelle avec des déploiements rapides et adaptés aux exigences de vos projets.",
  },
  {
    suit: '♥',
    icon: BadgeEuro,
    title: 'Politique Tarifaire',
    description:
      'Des tarifs inférieurs à la moyenne du marché sans le moindre compromis sur la qualité de service.',
  },
  {
    suit: '♣',
    icon: Handshake,
    title: 'Confiance & Transparence',
    description:
      "Nous construisons nos relations sur une base solide de franchise, d'honnêteté et de transparence.",
  },
  {
    suit: '♦',
    icon: Globe,
    title: 'Ouverture Multisectorielle',
    description:
      "Télécoms, IT, Cybersécurité, Énergies renouvelables et Industrie : cinq piliers traités avec la même rigueur d'excellence.",
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="relative py-20 overflow-hidden scroll-mt-24">
      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 flex flex-col items-center">
        {/* ── Section Crédo ── */}
        <AnimatedSection className="max-w-3xl mb-16 mx-auto text-center">
          <span className="text-sm text-muted-foreground uppercase tracking-premium mb-4 block">
            Notre Force
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            Notre <span className="italic font-normal text-white/90">Crédo</span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Trois principes structurent notre pratique : la transparence comme méthode,
            l'expertise comme discipline, le collectif comme exigence. Loin d'être
            déclaratifs, ils gouvernent nos décisions opérationnelles, nos engagements
            contractuels et la conduite de chaque mission.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.2} className="w-full">
          <div className="credo-cards-container">
            {credoCards.map((card, i) => (
              <div key={i} className="credo-card group">
                <card.icon className="credo-icon" size={40} strokeWidth={1.5} />
                <h3 className="credo-card-title">{card.title}</h3>
                <p className="credo-card-desc">{card.description}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* ── Transition vers Atouts ── */}
        <AnimatedSection className="w-full mt-20 mb-8">
          <div className="transition-divider">
            <span className="transition-text">Soutenu par 4 atouts majeurs</span>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2} className="w-full relative z-10 flex justify-center">
          <div className="hand-of-cards">
            {atoutCards.map((card, i) => (
              <div key={i} className="card-wrapper">
                <div className="card-inner">
                  {/* Face avant — As */}
                  <div className="card-front">
                    <div className="corner-value top-left">
                      <div className="corner-letter">A</div>
                      <div className="corner-suit">{card.suit}</div>
                    </div>
                    <div className="center-suit">{card.suit}</div>
                    <div className="corner-value bottom-right">
                      <div className="corner-letter">A</div>
                      <div className="corner-suit">{card.suit}</div>
                    </div>
                  </div>
                  {/* Face arrière — Contenu */}
                  <div className="card-back">
                    <div className="card-back-content">
                      <card.icon className="card-back-icon" size={36} strokeWidth={1.5} />
                      <h4 className="card-back-title">{card.title}</h4>
                      <div className="card-back-divider" />
                      <p className="card-back-desc">{card.description}</p>
                    </div>
                  </div>
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
