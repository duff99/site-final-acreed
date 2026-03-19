import { motion } from 'framer-motion';
import AnimatedSection from './AnimatedSection';
import { partners } from '@/data/partners';

const PartnersMarquee = () => {
  // Duplicate for seamless loop
  const duplicatedPartners = [...partners, ...partners];

  return (
    <section className="py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-16">
        <AnimatedSection className="text-center">
          <span className="text-sm text-muted-foreground uppercase tracking-premium mb-4 block">
            Nos Clients
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold">
            Ils nous font<span className="text-gradient"> confiance</span>
          </h2>
        </AnimatedSection>
      </div>

      {/* Marquee Container */}
      <div className="relative">
        {/* Gradient masks for smooth fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-background to-transparent z-10" />

        {/* Scrolling content */}
        <div className="marquee-container">
          <motion.div
            className="marquee-content"
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              x: {
                duration: 30,
                repeat: Infinity,
                ease: 'linear',
              },
            }}
          >
            {duplicatedPartners.map((partner, index) => (
              <div
                key={`${partner.name}-${index}`}
                className="partner-logo group flex items-center justify-center px-4 md:px-6"
              >
                <div className="bg-white rounded-xl px-6 py-4 md:px-8 md:py-5 opacity-70 transition-all duration-500 group-hover:opacity-100 group-hover:shadow-[0_0_25px_rgba(255,255,255,0.12)] group-hover:scale-110">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="h-10 md:h-14 lg:h-20 w-auto min-w-[80px] md:min-w-[120px] lg:min-w-[140px] max-w-[150px] md:max-w-[180px] lg:max-w-[220px] object-contain"
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PartnersMarquee;
