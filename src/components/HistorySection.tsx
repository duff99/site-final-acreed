import React, { useEffect } from 'react';
import './HistorySection.css';
import { Rocket, TrendingUp, Sparkles } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

const HistorySection = () => {
  useEffect(() => {
    const rows = document.querySelectorAll('.chapter-row');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.2 }
    );

    rows.forEach((row) => {
      observer.observe(row);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="histoire" className="about-section scroll-mt-24">
      <AnimatedSection className="about-header z-10 relative">
        <span className="section-subtitle">Notre Histoire</span>
        <h2 className="section-title">À propos</h2>
        <p className="section-desc">
          Trois chapitres qui racontent notre trajectoire vers l'excellence.
        </p>
      </AnimatedSection>

      <div className="chapters-container">
        <div className="timeline-track">
          <div className="timeline-glow"></div>
        </div>

        <div className="chapter-row">
          <div className="chapter-content">
            <span className="chapter-dates">2020-2022</span>
            <h3 className="chapter-title">L'Origine</h3>
            <p className="chapter-text-block">
              Lancée par son fondateur, l'aventure Acreed a rapidement fédéré une
              première équipe de 5 consultants. Dès le début, une seule obsession : la qualité technique qui a
              permis de sécuriser plus de 20 missions critiques.
            </p>
          </div>
          <div className="chapter-visual">
            <div className="connector-dot"></div>
            <div className="glass-stat-card">
              <div className="stat-icon"><Rocket size={34} strokeWidth={1.5} className="svg-icon" /></div>
              <span className="stat-value">20+ missions critiques</span>
            </div>
          </div>
        </div>

        <div className="chapter-row">
          <div className="chapter-content">
            <span className="chapter-dates">2023-2024</span>
            <h3 className="chapter-title">La Performance</h3>
            <p className="chapter-text-block">
              Le cap de la maturité. 30 consultants, 2M€ de CA et un staffing en
              moins d'une semaine. Mais au-delà des chiffres, c'est la qualité de nos missions et la
              fidélisation de nos clients qui témoignent de notre exigence.
            </p>
          </div>
          <div className="chapter-visual">
            <div className="connector-dot"></div>
            <div className="glass-stat-card">
              <div className="stat-icon"><TrendingUp size={34} strokeWidth={1.5} className="svg-icon" /></div>
              <span className="stat-value">2M€ de CA annuel</span>
            </div>
          </div>
        </div>

        <div className="chapter-row">
          <div className="chapter-content">
            <span className="chapter-dates">2025-2026</span>
            <h3 className="chapter-title">L'Horizon IA</h3>
            <p className="chapter-text-block">
              L'ère de l'innovation. Fin 2025 marque la naissance d'Acreed IA
              Solutions, notre filière dédiée à l'intelligence artificielle. Une expertise de pointe qui vient
              compléter notre ouverture vers l'Industrie et les Énergies Renouvelables.
            </p>
          </div>
          <div className="chapter-visual">
            <div className="connector-dot"></div>
            <a href="#offres" className="glass-stat-card highlight-link">
              <div className="stat-icon"><Sparkles size={34} strokeWidth={1.5} className="svg-icon" /></div>
              <span className="stat-value whitespace-nowrap">Découvrir Acreed IA Solutions &rarr;</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HistorySection;
