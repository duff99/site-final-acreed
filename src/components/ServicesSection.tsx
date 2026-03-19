import { useState } from 'react';
import { Radio, Code, ShieldCheck, Zap, Factory } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { useIsMobile } from '@/hooks/use-mobile';
import './ServicesSection.css';

const ServicesSection = () => {
  const [activePanel, setActivePanel] = useState<number | null>(null);
  const isMobile = useIsMobile(900);
  const handlePanelClick = (index: number) => {
    if (!isMobile) return;
    setActivePanel(prev => prev === index ? null : index);
  };

  return (
    <section id="services" className="relative py-20 overflow-hidden scroll-mt-24 expertise-wrapper">
      <div className="relative max-w-6xl xl:max-w-[1200px] mx-auto px-6 lg:px-12 w-full flex flex-col items-center">
        {/* Header - centré */}
        <AnimatedSection className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-sm text-muted-foreground uppercase tracking-premium mb-4 block">
            Secteurs d'Intervention
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            Nos Domaines <span>d'Expertise</span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Nos consultants interviennent au coeur de 5 secteurs stratégiques, apportant leur savoir-faire technique et une approche sur-mesure à chaque mission.
          </p>
        </AnimatedSection>

        {/* L'Accordéon */}
        <AnimatedSection delay={0.2} className="w-full flex justify-center">
          <div className={`gallery-container${activePanel !== null ? ' has-active' : ''}`}>

            <div className={`panel${isMobile && activePanel === 0 ? ' is-active' : ''}`}
              onClick={() => handlePanelClick(0)}
              style={{ backgroundImage: "url('/images/service-recrutement.jpg')" }}>
              <div className="collapsed-content">
                <div className="num-line"><span>01</span></div>
                <div className="vertical-text">Télécoms</div>
              </div>
              <div className="expanded-content">
                <div className="top-row">
                  <div className="big-num">01</div>
                  <div className="circle-badge">Infrastructure Réseau</div>
                </div>
                <div className="glass-card">
                  <div className="service-icon"><Radio size={28} /></div>
                  <h3 className="glass-card-title">Télécoms</h3>
                  <p>Déploiement, ingénierie réseau, optimisation d'infrastructures : nos consultants accompagnent
                    opérateurs et équipementiers sur leurs projets les plus exigeants.</p>
                </div>
              </div>
            </div>

            <div className={`panel${isMobile && activePanel === 1 ? ' is-active' : ''}`}
              onClick={() => handlePanelClick(1)}
              style={{ backgroundImage: "url('/images/service-telecom.jpg')" }}>
              <div className="collapsed-content">
                <div className="num-line"><span>02</span></div>
                <div className="vertical-text">IT / Digital</div>
              </div>
              <div className="expanded-content">
                <div className="top-row">
                  <div className="big-num">02</div>
                  <div className="circle-badge">Transformation Digitale</div>
                </div>
                <div className="glass-card">
                  <div className="service-icon"><Code size={28} /></div>
                  <h3 className="glass-card-title">IT / Digital</h3>
                  <p>Intégrés directement au sein de vos équipes, nos experts pilotent vos projets de
                    transformation digitale, développement logiciel et modernisation SI.</p>
                </div>
              </div>
            </div>

            <div className={`panel${isMobile && activePanel === 2 ? ' is-active' : ''}`}
              onClick={() => handlePanelClick(2)}
              style={{ backgroundImage: "url('/images/service-cybersecurite.jpg')" }}>
              <div className="collapsed-content">
                <div className="num-line"><span>03</span></div>
                <div className="vertical-text">Cybersécurité</div>
              </div>
              <div className="expanded-content">
                <div className="top-row">
                  <div className="big-num">03</div>
                  <div className="circle-badge">Sécurité des SI</div>
                </div>
                <div className="glass-card">
                  <div className="service-icon"><ShieldCheck size={28} /></div>
                  <h3 className="glass-card-title">Cybersécurité</h3>
                  <p>Audit, gouvernance, conformité, réponse aux incidents — des profils spécialisés pour
                    renforcer durablement la sécurité de vos infrastructures critiques.</p>
                </div>
              </div>
            </div>

            <div className={`panel${isMobile && activePanel === 3 ? ' is-active' : ''}`}
              onClick={() => handlePanelClick(3)}
              style={{ backgroundImage: "url('/images/service-energie.jpg')" }}>
              <div className="collapsed-content">
                <div className="num-line"><span>04</span></div>
                <div className="vertical-text">Énergie Renouvelable</div>
              </div>
              <div className="expanded-content">
                <div className="top-row">
                  <div className="big-num">04</div>
                  <div className="circle-badge">Transition Énergétique</div>
                </div>
                <div className="glass-card">
                  <div className="service-icon"><Zap size={28} /></div>
                  <h3 className="glass-card-title">Énergie Renouvelable</h3>
                  <p>Solaire, éolien, smart grids, efficacité énergétique : des ingénieurs-consultants engagés aux
                    côtés des acteurs de la transition.</p>
                </div>
              </div>
            </div>

            <div className={`panel${isMobile && activePanel === 4 ? ' is-active' : ''}`}
              onClick={() => handlePanelClick(4)}
              style={{ backgroundImage: "url('/images/service-digital.jpg')" }}>
              <div className="collapsed-content">
                <div className="num-line"><span>05</span></div>
                <div className="vertical-text">Industrie</div>
              </div>
              <div className="expanded-content">
                <div className="top-row">
                  <div className="big-num">05</div>
                  <div className="circle-badge">Performance Industrielle</div>
                </div>
                <div className="glass-card">
                  <div className="service-icon"><Factory size={28} /></div>
                  <h3 className="glass-card-title">Industrie</h3>
                  <p>En milieu industriel, nos équipes optimisent vos processus de production, votre supply chain
                    et accompagnent la conduite du changement.</p>
                </div>
              </div>
            </div>

          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default ServicesSection;
