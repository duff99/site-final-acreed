import React from 'react';
import { Rocket, TrendingUp, Sparkles } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import SpotlightCard from './SpotlightCard';
import { historyBlocks, growthTimeline } from '@/data/values';

const iconMap: Record<string, React.ElementType> = { Rocket, TrendingUp, Sparkles };

const HistorySection = () => {
  return (
    <section id="histoire" className="relative py-20 overflow-hidden scroll-mt-24">
      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">

        {/* Section Header */}
        <AnimatedSection className="text-center mb-20">
          <span className="text-xs uppercase tracking-premium text-muted-foreground mb-4 block">
            Notre Histoire
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gradient mb-4 pb-1">
            A propos
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trois chapitres qui racontent notre trajectoire.
          </p>
        </AnimatedSection>

        {/* 3 History Blocks - Alternating Layout */}
        <div className="space-y-20 md:space-y-28 mb-32">
          {historyBlocks.map((block, index) => {
            const IconComponent = iconMap[block.icon];
            const isReversed = index % 2 === 1;

            return (
              <AnimatedSection key={block.id} delay={index * 0.2}>
                <div
                  className={`flex flex-col md:flex-row items-center gap-10 md:gap-16 ${
                    isReversed ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Text Side */}
                  <div className="flex-1">
                    <span className="text-xs uppercase tracking-premium text-muted-foreground mb-3 block">
                      {block.period}
                    </span>
                    <h3 className="text-3xl font-display font-bold mb-4">
                      {block.title}
                    </h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {block.description}
                    </p>
                  </div>

                  {/* Accent Side */}
                  <div className="w-full md:w-72">
                    <SpotlightCard className="p-8 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4 transition-all duration-500 group-hover:bg-white/10 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                        {IconComponent && (
                          <IconComponent className="w-7 h-7 text-white/80" />
                        )}
                      </div>
                      {block.link ? (
                        <a
                          href={block.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-foreground/80 underline underline-offset-4 decoration-white/30 hover:decoration-white/70 transition-all duration-300"
                        >
                          {block.highlight}
                        </a>
                      ) : (
                        <p className="text-sm font-medium text-foreground/80">
                          {block.highlight}
                        </p>
                      )}
                    </SpotlightCard>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>

        {/* Growth Timeline */}
        <div className="max-w-6xl mx-auto">
          {/* Desktop Timeline */}
          <div className="hidden md:block relative">
            <div className="absolute top-[6px] left-[8%] right-[8%] h-px bg-gradient-to-r from-white/5 via-white/20 to-white/5" />
            <div className="grid grid-cols-6 gap-6">
              {growthTimeline.map((milestone, index) => (
                <AnimatedSection
                  key={milestone.year}
                  delay={0.3 + index * 0.15}
                  className="relative text-center"
                >
                  <div className="w-3 h-3 bg-white rounded-full mx-auto mb-8 shadow-[0_0_20px_rgba(255,255,255,0.3)]" />
                  <div className="text-2xl font-display font-bold mb-2">
                    {milestone.year}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-premium mb-3">
                    {milestone.title}
                  </div>
                  {milestone.metric && (
                    <div className="text-sm text-foreground/70 leading-relaxed">
                      {milestone.metric}
                    </div>
                  )}
                </AnimatedSection>
              ))}
            </div>
          </div>

          {/* Mobile Timeline */}
          <div className="md:hidden relative pl-10">
            <div className="absolute top-0 bottom-0 left-[5px] w-px bg-gradient-to-b from-white/5 via-white/20 to-white/5" />
            <div className="space-y-10">
              {growthTimeline.map((milestone, index) => (
                <AnimatedSection
                  key={milestone.year}
                  delay={0.3 + index * 0.15}
                  className="relative"
                >
                  <div className="absolute -left-10 top-1 w-3 h-3 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)]" />
                  <div className="text-xl font-display font-bold mb-1">
                    {milestone.year}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-premium mb-2">
                    {milestone.title}
                  </div>
                  {milestone.metric && (
                    <div className="text-sm text-foreground/70">
                      {milestone.metric}
                    </div>
                  )}
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HistorySection;
