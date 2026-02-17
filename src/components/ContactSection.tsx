import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnimatedSection from './AnimatedSection';

const ContactSection = () => {
  return (
    <section id="contact" className="py-20 scroll-mt-24">
      <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
        <AnimatedSection>
          <span className="text-sm text-muted-foreground uppercase tracking-premium mb-6 block">
            Parlons-en
          </span>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold mb-8 leading-tight">
            Prêt à transformer
            <br />
            <span className="text-gradient">votre carrière ?</span>
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <p className="text-xl md:text-2xl text-muted-foreground mb-14 leading-relaxed max-w-2xl mx-auto">
            Consultants, entreprises : construisons ensemble votre succès.
          </p>
        </AnimatedSection>

        {/* CTA Buttons */}
        <AnimatedSection delay={0.3}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/offres"
                className="btn-premium btn-premium-primary text-lg inline-block"
              >
                Voir les offres
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/contact"
                className="btn-premium btn-premium-secondary text-lg inline-block"
              >
                Nous contacter
              </Link>
            </motion.div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default ContactSection;
