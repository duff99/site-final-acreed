import { useState } from 'react';
import AnimatedSection from './AnimatedSection';
import { useIsMobile } from '@/hooks/use-mobile';
import './TeamSection.css';

const TeamSection = () => {
  const [activePanel, setActivePanel] = useState<number | null>(null);
  const isMobile = useIsMobile();
  const handlePanelClick = (index: number) => {
    if (!isMobile) return;
    setActivePanel(prev => prev === index ? null : index);
  };

  return (
    <section id="team" className="relative py-20 overflow-hidden scroll-mt-24">
      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header - centré */}
        <AnimatedSection className="max-w-3xl mx-auto text-center mb-20">
          <span className="text-sm text-muted-foreground uppercase tracking-premium mb-4 block">
            Notre Équipe
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            Les visages derrière
            <span className="text-gradient"> Acreed</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Trois trajectoires complémentaires, une même exigence : faire de chaque mission
            un partenariat durable. Notre équipe dirigeante engage son expérience à chaque
            étape, de la définition stratégique à l'exécution opérationnelle.
          </p>
        </AnimatedSection>

        {/* New Team Grid based on equipe.html */}
        <AnimatedSection delay={0.2}>
          <div className={`ecosystem-container${activePanel !== null ? ' has-active' : ''}`}>
            {/* Tristan */}
            <div className={`panel${isMobile && activePanel === 0 ? ' is-active' : ''}`} style={{ backgroundImage: "url('/images/tristan.jpg')" }} onClick={() => handlePanelClick(0)}>
              <div className="panel-content">
                <div className="step-number">Business Developer</div>
                <h3 className="title">Tristan</h3>

                <div className="details">
                  <div className="details-inner">
                    <p className="description">
                      Architecte de la croissance, Tristan identifie les opportunités
                      sectorielles et structure les relations stratégiques avec nos
                      clients et partenaires de long terme.
                    </p>

                    <div className="custom-panel-footer">
                      <div className="custom-tags">
                        <span className="tag filled">PROSPECTION</span>
                        <span className="tag">RÉSEAU</span>
                      </div>
                      <div className="micro-visual">
                        <div className="anim-chart">
                          <div className="chart-bar"></div>
                          <div className="chart-bar"></div>
                          <div className="chart-bar"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Steven */}
            <div className={`panel${isMobile && activePanel === 1 ? ' is-active' : ''}`} style={{ backgroundImage: "url('/images/photo_steven.jpg')" }} onClick={() => handlePanelClick(1)}>
              <div className="panel-content">
                <div className="step-number">Président & Fondateur</div>
                <h3 className="title">Steven</h3>

                <div className="details">
                  <div className="details-inner">
                    <p className="description">
                      Fondateur d'Acreed, Steven porte la vision et la stratégie globale
                      de l'entreprise. Son expérience opérationnelle des télécoms ancre
                      chacune de ses décisions.
                    </p>

                    <div className="custom-panel-footer">
                      <div className="custom-tags">
                        <span className="tag filled">LEADERSHIP</span>
                        <span className="tag">STRATEGY</span>
                      </div>
                      <div className="micro-visual">
                        <div className="anim-ripple">
                          <div className="ripple-ring"></div>
                          <div className="ripple-ring"></div>
                          <div className="ripple-core"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Maxime */}
            <div className={`panel${isMobile && activePanel === 2 ? ' is-active' : ''}`} style={{ backgroundImage: "url('/images/maxime.jpg')" }} onClick={() => handlePanelClick(2)}>
              <div className="panel-content">
                <div className="step-number">Business Manager</div>
                <h3 className="title">Maxime</h3>

                <div className="details">
                  <div className="details-inner">
                    <p className="description">
                      Pilote opérationnel, Maxime orchestre l'exécution des missions et
                      garantit la qualité des livrables. Son rôle pivot assure la
                      continuité entre vision stratégique et réalité terrain.
                    </p>

                    <div className="custom-panel-footer">
                      <div className="custom-tags">
                        <span className="tag filled">MANAGEMENT</span>
                        <span className="tag">OPÉRATIONS</span>
                      </div>
                      <div className="micro-visual">
                        <div className="anim-kpi">
                          <div className="kpi-track">
                            <div className="kpi-fill"></div>
                          </div>
                          <div className="kpi-track">
                            <div className="kpi-fill"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default TeamSection;
