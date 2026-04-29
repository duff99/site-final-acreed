import { Users, UserPlus, Search, KanbanSquare } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import './ExpertiseSection.css';

const services = [
  {
    icon: Users,
    title: 'Consulting Externe sur Mesure',
    desc: "Mise à disposition de consultants spécialisés pour des missions temporaires ou longues dans les télécoms, IT et cybersécurité.",
    image: '/images/offre-consulting.jpg',
  },
  {
    icon: UserPlus,
    title: 'Prestation + Internalisation',
    desc: "Possibilité d’intégrer nos consultants directement chez le client après une première mission réussie et validée.",
    image: '/images/offre-internalisation.jpg',
  },
  {
    icon: Search,
    title: 'Recrutement Interne',
    desc: "Assistance complète au recrutement de talents qualifiés pour répondre avec précision aux besoins spécifiques de nos clients.",
    image: '/images/offre-recrutement.jpg',
  },
  {
    icon: KanbanSquare,
    title: 'Gestion de Projets',
    desc: "Accompagnement complet avec création d’outils personnalisés, pilotage agile et coordination de vos projets complexes.",
    image: '/images/offre-gestion.jpg',
  },
];

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
            {services.map((service, i) => {
              const Icon = service.icon;
              return (
                <div
                  key={i}
                  className="service-card"
                  style={{ backgroundImage: `url('${service.image}')` }}
                >
                  <div className="card-overlay">
                    <div className="card-top">
                      <div className="icon-wrapper">
                        <Icon size={24} />
                      </div>
                    </div>
                    <div className="card-bottom">
                      <h3 className="card-title">{service.title}</h3>
                      <div className="divider"></div>
                      <div className="card-text-wrapper">
                        <div className="card-desc">
                          {service.desc}
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
