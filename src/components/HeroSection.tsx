import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] md:min-h-screen flex items-center overflow-hidden">
      {/* Background Elements Container */}
      <div
        className="absolute inset-0 pointer-events-none"
      >
        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          style={{ objectPosition: 'center center' }}
        >
          <source src="/videos/hero-video.mp4" type="video/mp4" />
        </video>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 hero-overlay" />

        {/* Additional gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-background/60" />

        {/* Smooth Transition to Next Section */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 pt-24">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Spacer */}
          <div className="hidden lg:block lg:col-span-5" />

          {/* Right Content */}
          <div className="lg:col-span-7 space-y-8 max-w-2xl">
            {/* Badge / Sur-title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex items-center gap-[15px] text-[11px] uppercase tracking-[6px] text-[#dbcca5]">
                <div className="w-[50px] h-[1px] bg-[#dbcca5]"></div>
                Recrutement & Conseil
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="font-light text-[50px] md:text-[65px] lg:text-[85px] leading-[0.9] tracking-[-2px] text-white"
            >
              Fantastique
              <em
                className="block font-display text-[80px] md:text-[100px] lg:text-[130px] font-normal text-[#dbcca5] -mt-[10px] pl-0 italic"
                style={{ textShadow: "0 10px 40px rgba(219, 204, 165, 0.1)" }}
              >
                simplicité
              </em>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-[16px] leading-[1.8] text-white/60 font-light max-w-[480px]"
            >
              Nous plaçons les meilleurs consultants auprès des leaders du marché. Simplicité, transparence et excellence.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <a
                href="#contact"
                className="group inline-flex items-center justify-center gap-[12px] py-[18px] px-[45px] rounded-[50px] text-[13px] font-medium uppercase tracking-[3px] text-[#dbcca5] bg-[#0a0a0a]/60 border border-[#dbcca5] backdrop-blur-[5px] no-underline transition-all duration-400 ease-[cubic-bezier(0.2,1,0.3,1)] hover:bg-[#dbcca5] hover:text-[#0A0A0A] hover:-translate-y-[4px] hover:shadow-[0_15px_30px_rgba(219,204,165,0.2)]"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Nous contacter
                <ArrowRight className="text-[18px] transition-transform duration-400 ease-[cubic-bezier(0.2,1,0.3,1)] group-hover:translate-x-[6px]" size={18} />
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex flex-wrap sm:flex-nowrap gap-[30px] lg:gap-[50px] pt-12 border-t border-border/50 mt-12 w-full"
            >
              <div className="flex flex-col">
                <span className="font-display text-[36px] italic text-white leading-none mb-[5px]">
                  30<span className="font-sans text-[20px] not-italic text-[#dbcca5]">+</span>
                </span>
                <span className="text-[10px] uppercase tracking-[2px] text-white/60">Experts</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-[36px] italic text-white leading-none mb-[5px]">
                  10<span className="font-sans text-[20px] not-italic text-[#dbcca5]">+</span>
                </span>
                <span className="text-[10px] uppercase tracking-[2px] text-white/60">Clients</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-[36px] italic text-white leading-none mb-[5px]">
                  98<span className="font-sans text-[20px] not-italic text-[#dbcca5]">%</span>
                </span>
                <span className="text-[10px] uppercase tracking-[2px] text-white/60">Satisfaction</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
