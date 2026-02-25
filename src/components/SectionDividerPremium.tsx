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
            background: 'linear-gradient(90deg, rgba(219, 204, 165, 0) 0%, rgba(219, 204, 165, 0.3) 50%, rgba(219, 204, 165, 0) 100%)',
          }}
        />
      </motion.div>
    </div>
  );
};

export default SectionDividerPremium;
