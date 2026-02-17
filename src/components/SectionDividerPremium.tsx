import { motion } from 'framer-motion';

const SectionDividerPremium = () => {
  return (
    <div className="relative h-10 md:h-14 flex items-center justify-center overflow-hidden">
      {/* Main gradient line */}
      <motion.div
        className="w-[75%] h-px relative"
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 20%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.15) 80%, transparent 100%)',
          }}
        />
      </motion.div>
      {/* Subtle glow beneath */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <div
          className="w-full max-w-2xl h-6 blur-xl"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 30%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 70%, transparent 100%)',
          }}
        />
      </motion.div>
    </div>
  );
};

export default SectionDividerPremium;
