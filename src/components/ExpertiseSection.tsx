import AnimatedSection from './AnimatedSection';
import './ExpertiseSection.css';

const ExpertiseSection = () => {
  return (
    <section id="expertise" className="relative services-section scroll-mt-24">
      <div className="content-wrapper">
        <AnimatedSection className="section-header">
          <span className="subtitle">Nos Services</span>
          <h2 className="title">Offres <span>&</span> Services</h2>
          <p className="header-desc">
            ACREED Consulting propose une gamme complète de services pour accompagner votre
            croissance et sécuriser vos projets complexes.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.2} className="w-full">
          <div className="services-grid">
            <div className="service-card">
              <div className="card-content">
                <div className="card-header">
                  <div className="icon-wrapper">
                    <i className="ph ph-users-three"></i>
                  </div>
                  <i className="ph ph-arrow-up-right action-arrow"></i>
                </div>
                <div className="card-body">
                  <h3 className="card-title">Consulting Externe sur Mesure</h3>
                  <div className="divider"></div>
                  <p className="card-desc">
                    Mise à disposition de consultants spécialisés pour des missions
                    temporaires ou longues dans les télécoms, IT et cybersécurité.
                  </p>
                </div>
              </div>
            </div>

            <div className="service-card">
              <div className="card-content">
                <div className="card-header">
                  <div className="icon-wrapper">
                    <i className="ph ph-user-plus"></i>
                  </div>
                  <i className="ph ph-arrow-up-right action-arrow"></i>
                </div>
                <div className="card-body">
                  <h3 className="card-title">Prestation + Internalisation</h3>
                  <div className="divider"></div>
                  <p className="card-desc">
                    Possibilité d'intégrer nos consultants directement chez le client après
                    une première mission réussie et validée.
                  </p>
                </div>
              </div>
            </div>

            <div className="service-card">
              <div className="card-content">
                <div className="card-header">
                  <div className="icon-wrapper">
                    <i className="ph ph-magnifying-glass"></i>
                  </div>
                  <i className="ph ph-arrow-up-right action-arrow"></i>
                </div>
                <div className="card-body">
                  <h3 className="card-title">Recrutement Interne</h3>
                  <div className="divider"></div>
                  <p className="card-desc">
                    Assistance complète au recrutement de talents qualifiés pour répondre
                    avec précision aux besoins spécifiques de nos clients.
                  </p>
                </div>
              </div>
            </div>

            <div className="service-card">
              <div className="card-content">
                <div className="card-header">
                  <div className="icon-wrapper">
                    <i className="ph ph-kanban"></i>
                  </div>
                  <i className="ph ph-arrow-up-right action-arrow"></i>
                </div>
                <div className="card-body">
                  <h3 className="card-title">Gestion de Projets</h3>
                  <div className="divider"></div>
                  <p className="card-desc">
                    Accompagnement complet avec création d'outils personnalisés, pilotage
                    agile et coordination de vos projets complexes.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default ExpertiseSection;
