import { motion } from 'framer-motion';

const values = ['Expertise', 'Transparence', 'Excellence'] as const;

const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] md:min-h-screen flex items-start overflow-hidden">
      {/* Background Elements Container */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Video Background — traitement design-10 */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            objectPosition: 'center center',
            opacity: 0.25,
            filter: 'saturate(.3) brightness(.8) blur(0.5px)',
          }}
        >
          <source src="/videos/hero-video.mp4" type="video/mp4" />
        </video>

        {/* Gradient Overlay — design-10 (plus léger) */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(10,10,10,.5) 0%, rgba(10,10,10,.15) 40%, rgba(10,10,10,.6) 80%, rgba(10,10,10,1) 100%)',
          }}
        />

      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12" style={{ paddingTop: '22vh' }}>
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Spacer */}
          <div className="hidden lg:block lg:col-span-5" />

          {/* Right Content */}
          <div className="lg:col-span-7 space-y-8 max-w-2xl">
            {/* Badge / Sur-title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
            >
              <div className="flex items-center gap-[15px] text-[11px] uppercase tracking-[6px] text-[#dbcca5]">
                <div className="w-[50px] h-[1px] bg-[#dbcca5]"></div>
                Recrutement & Conseil
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="font-light text-[50px] md:text-[65px] lg:text-[85px] leading-[0.9] tracking-[-2px] text-white"
            >
              Fantastique
              <em
                className="block font-display text-[80px] md:text-[100px] lg:text-[130px] font-normal text-[#dbcca5] pl-0 italic"
                style={{ marginTop: '4px', textShadow: '0 10px 40px rgba(219, 204, 165, 0.1)' }}
              >
                simplicité
              </em>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="text-[16px] leading-[1.8] text-white/60 font-light max-w-[480px]"
            >
              Le recrutement IT & Télécoms, réinventé avec exigence. Chaque mission est unique, chaque talent aussi.
            </motion.p>

            {/* Values Pills */}
            <div className="flex flex-wrap gap-4">
              {values.map((value, index) => (
                <motion.div
                  key={value}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.3 + index * 0.15 }}
                  className="inline-flex items-center justify-center py-[18px] px-[45px] rounded-[50px] text-[13px] font-medium uppercase tracking-[3px] text-[#dbcca5] bg-[#0a0a0a]/60 border border-[#dbcca5] backdrop-blur-[5px] transition-all duration-400 ease-[cubic-bezier(0.2,1,0.3,1)] hover:bg-[#dbcca5] hover:text-[#0A0A0A] hover:-translate-y-[4px] hover:shadow-[0_15px_30px_rgba(219,204,165,0.2)]"
                >
                  {value}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-[10px]"
      >
        <div className="w-[6px] h-[6px] rounded-full bg-[#dbcca5] animate-[dotPulse_2s_ease-in-out_infinite]" style={{ opacity: 0.4 }} />
        <div className="w-[1px] h-[50px] bg-white/10 relative overflow-hidden">
          <div className="absolute top-[-100%] left-0 w-[1px] h-full bg-gradient-to-b from-transparent to-[#dbcca5] animate-[scrollDown_2s_ease-in-out_infinite]" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
