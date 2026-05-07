import { useState } from 'react';
import * as Icons from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { useIsMobile } from '@/hooks/use-mobile';
import { services } from '@/data/services';
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

            {services.map((service, index) => {
              const Icon = Icons[service.icon as keyof typeof Icons] as Icons.LucideIcon;
              const num = String(index + 1).padStart(2, '0');
              return (
                <div
                  key={service.title}
                  className={`panel${isMobile && activePanel === index ? ' is-active' : ''}`}
                  onClick={() => handlePanelClick(index)}
                  style={{ backgroundImage: `url('${service.image}')` }}
                >
                  <div className="collapsed-content">
                    <div className="num-line"><span>{num}</span></div>
                    <div className="vertical-text">{service.title}</div>
                  </div>
                  <div className="expanded-content">
                    <div className="top-row">
                      <div className="big-num">{num}</div>
                      <div className="circle-badge">{service.badge}</div>
                    </div>
                    <div className="glass-card">
                      <div className="service-icon"><Icon size={28} /></div>
                      <h3 className="glass-card-title">{service.title}</h3>
                      <p>{service.description}</p>
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

export default ServicesSection;
