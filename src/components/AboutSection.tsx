import { Eye, Lightbulb, Users, Zap, BadgeEuro, Handshake, Globe } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import './AboutSection.css';

const credoCards: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Eye,
    title: 'Transparence Absolue',
    description:
      "La confiance se construit dans le détail. Nous communiquons clairement sur nos engagements, nos délais et nos honoraires, sans zone d'ombre. Lorsqu'un imprévu survient, nous le partageons immédiatement avec une proposition de solution — parce qu'un bon partenaire anticipe et tient sa parole, plutôt que de maquiller les difficultés.",
  },
  {
    icon: Lightbulb,
    title: 'Expertise & Simplicité',
    description:
      "Identifier le bon profil ou structurer la bonne mission exige une compréhension fine des métiers techniques que nous servons. Cette exigence ne nous éloigne jamais du terrain : nos consultants restent accessibles, à l'écoute, et privilégient toujours la solution la plus claire à la démonstration la plus complexe. Un savoir-faire véritable se reconnaît à sa lisibilité.",
  },
  {
    icon: Users,
    title: 'Fédérer le Collectif',
    description:
      "Une équipe soudée produit des missions plus saines et des résultats plus solides. Nous cultivons la solidarité et la communication ouverte entre nos équipes internes, nos consultants en mission et nos clients : chacun mérite d'être entendu, soutenu et respecté. C'est ce tissu humain qui transforme une prestation technique en partenariat durable.",
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
            Trois principes guident chaque mission que nous engageons. Bien plus que des
            slogans, ils dessinent notre exigence opérationnelle, notre relation client
            et notre posture humaine. Voici ce qui nous tient debout.
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
