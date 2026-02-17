import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from './AnimatedSection';
import { team, TeamMember } from '@/data/team';

const TeamCard = ({ member }: { member: TeamMember }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      className="group relative overflow-hidden rounded-2xl"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Border glow effect */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20"
        style={{
          background: isHovered
            ? `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.15), transparent 40%)`
            : 'transparent',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          padding: '1px',
        }}
      />

      {/* Static border */}
      <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-white/20 transition-colors duration-500 z-20" />

      {/* Image */}
      <div className="aspect-[4/5] overflow-hidden">
        <motion.img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6 }}
        />
      </div>

      {/* Spotlight radial glow on image */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.08), transparent 40%)`,
          }}
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500 z-10" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 z-10">
        <h3 className="text-xl font-display font-semibold text-foreground mb-1">
          {member.name}
        </h3>
        <p className="text-sm text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
          {member.role}
        </p>
      </div>
    </motion.div>
  );
};

const TeamSection = () => {
  return (
    <section id="team" className="relative py-20 overflow-hidden scroll-mt-24">
      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header - centré */}
        <AnimatedSection className="max-w-3xl mx-auto text-center mb-20">
          <span className="text-sm text-muted-foreground uppercase tracking-premium mb-4 block">
            Notre Équipe
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            Les visages derrière
            <span className="text-gradient"> Acreed</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            L'équipe dirigeante incarne nos valeurs et notre vision.
          </p>
        </AnimatedSection>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <AnimatedSection key={member.name} delay={index * 0.1}>
              <TeamCard member={member} />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
