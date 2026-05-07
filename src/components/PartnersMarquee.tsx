import { motion } from 'framer-motion';
import AnimatedSection from './AnimatedSection';
import { partners } from '@/data/partners';
import { businessPartners, type BusinessPartner } from '@/data/business-partners';

const PartnersMarquee = () => {
  // Duplicate for seamless loop
  const duplicatedPartners = [...partners, ...partners];

  return (
    <section id="clients" className="scroll-mt-24 py-20 overflow-hidden">
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
                    loading="lazy"
                    decoding="async"
                    className="h-10 md:h-14 lg:h-20 w-auto min-w-[80px] md:min-w-[120px] lg:min-w-[140px] max-w-[150px] md:max-w-[180px] lg:max-w-[220px] object-contain"
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Partners — glassmorphism grid with hover lift, distinct from the client marquee above */}
      <div className="max-w-6xl mx-auto px-6 lg:px-12 mt-28 md:mt-32">
        <AnimatedSection className="text-center mb-12 md:mb-14">
          <span className="text-sm text-muted-foreground uppercase tracking-premium mb-4 block">
            Nos Partenaires
          </span>
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold">
            Ils <span className="text-gradient">grandissent</span> avec nous
          </h3>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {businessPartners.map((partner, index) => (
            <PartnerCard key={partner.name} partner={partner} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const PartnerCard = ({ partner, index }: { partner: BusinessPartner; index: number }) => {
  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] backdrop-blur-sm px-6 py-10 md:py-12 transition-all duration-500 hover:border-[#dbcca5]/35 hover:bg-white/[0.04] hover:shadow-[0_8px_40px_-12px_rgba(219,204,165,0.25)]"
    >
      {/* Subtle gold glow behind the logo on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 35%, rgba(219,204,165,0.10), transparent 70%)',
        }}
      />

      <div className="relative flex flex-col items-center text-center gap-5">
        {/* Logo or branded placeholder */}
        <div className="flex h-16 md:h-20 items-center justify-center w-full">
          {partner.logo ? (
            <img
              src={partner.logo}
              alt={partner.name}
              loading="lazy"
              decoding="async"
              className="max-h-full max-w-[180px] w-auto object-contain opacity-85 group-hover:opacity-100 transition-opacity duration-500"
            />
          ) : (
            <span className="font-display text-2xl md:text-3xl font-semibold text-white/85 group-hover:text-[#dbcca5] transition-colors duration-500 tracking-tight">
              {partner.name}
            </span>
          )}
        </div>

        {partner.tagline && (
          <span className="text-[11px] uppercase tracking-[2.5px] text-white/40 group-hover:text-white/60 transition-colors duration-500">
            {partner.tagline}
          </span>
        )}
      </div>

      {/* Hairline accent that lights up on hover */}
      <div
        aria-hidden
        className="absolute left-1/2 -translate-x-1/2 bottom-0 h-px w-12 group-hover:w-24 bg-[#dbcca5]/0 group-hover:bg-[#dbcca5]/60 transition-all duration-500"
      />
    </motion.div>
  );

  if (partner.href) {
    return (
      <a
        href={partner.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visiter le site de ${partner.name}`}
        className="block"
      >
        {inner}
      </a>
    );
  }
  return inner;
};

export default PartnersMarquee;
