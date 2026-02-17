import { motion } from 'framer-motion';
import AnimatedSection from './AnimatedSection';

const ClientsSection = () => {
  const clients = ['Davidson', 'SFR', 'SPIE', 'Axians'];

  return (
    <section className="py-32 md:py-40">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <AnimatedSection className="max-w-3xl mb-20">
          <span className="text-sm text-muted-foreground uppercase tracking-premium mb-4 block">
            Références
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold">
            Ils nous font confiance
          </h2>
        </AnimatedSection>

        {/* Clients Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {clients.map((client, index) => (
            <AnimatedSection key={client} delay={index * 0.1}>
              <motion.div
                className="premium-card flex items-center justify-center h-32 md:h-36"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-2xl font-display font-semibold text-muted-foreground">
                  {client}
                </span>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;
