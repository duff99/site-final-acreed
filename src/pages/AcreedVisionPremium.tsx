import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import {
    Radio,
    Code,
    ShieldCheck,
    Leaf,
    Factory,
    ArrowRight,
    CheckCircle2,
    Users,
    TrendingUp,
    MapPin,
    Linkedin,
    Mail,
    Rocket,
    Sparkles,
    Zap,
    BadgeEuro,
    Eye
} from 'lucide-react';
import SkipToContent from '@/components/SkipToContent';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { historyBlocks, growthTimeline, values } from '@/data/values';

// --- Components ---

const HeroSection = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    return (
        <section ref={containerRef} className="relative min-h-[100dvh] flex items-center overflow-hidden pt-20">
            {/* Background Media - Asymmetric on the right */}
            <div className="absolute top-0 right-0 w-full lg:w-[60%] h-full z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10 lg:block hidden" />
                <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background z-10" />
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover opacity-40 grayscale"
                >
                    <source src="/videos/hero-video.mp4" type="video/mp4" />
                </video>
            </div>

            <div className="container relative z-20 px-6 lg:px-12">
                <motion.div
                    style={{ y, opacity }}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-3xl"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-white/60">Vision Premium 2026</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-display leading-[0.9] tracking-tighter mb-8 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
                        Partenaire du <br />
                        <span className="italic">futur</span> numérique
                    </h1>

                    <p className="text-lg md:text-xl text-white/60 max-w-xl leading-relaxed mb-10 font-light">
                        ACREED Consulting orchestre la convergence entre excellence technique et transformation stratégique. Experts en Télécoms, IT et Cybersécurité.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <Button className="h-14 px-8 rounded-full bg-white text-black hover:bg-white/90 transition-all duration-300 group">
                            Découvrir nos références
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button variant="outline" className="h-14 px-8 rounded-full border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all">
                            Nous Contacter
                        </Button>
                    </div>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <span className="text-[10px] uppercase tracking-widest text-white/20">Scroll</span>
                <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent" />
            </motion.div>
        </section>
    );
};

const ExpertiseSection = () => {
    const expertise = [
        {
            title: "Télécoms",
            icon: <Radio className="w-6 h-6" />,
            desc: "Infrastructures critiques et déploiement 5G de haute précision.",
            span: "lg:col-span-2 lg:row-span-1"
        },
        {
            title: "IT & Digital",
            icon: <Code className="w-6 h-6" />,
            desc: "Transformation Full-stack et environnements Cloud hybrides.",
            span: "lg:col-span-1 lg:row-span-1"
        },
        {
            title: "Cybersécurité",
            icon: <ShieldCheck className="w-6 h-6" />,
            desc: "Gouvernance et protection des actifs numériques stratégiques.",
            span: "lg:col-span-1 lg:row-span-2"
        },
        {
            title: "Industrie",
            icon: <Factory className="w-6 h-6" />,
            desc: "Optimisation des processus et Industrie 4.0 connectée.",
            span: "lg:col-span-1 lg:row-span-1"
        },
        {
            title: "Énergie",
            icon: <Leaf className="w-6 h-6" />,
            desc: "Solutions technologiques pour la transition énergétique.",
            span: "lg:col-span-1 lg:row-span-1"
        }
    ];

    return (
        <section className="py-32 relative overflow-hidden">
            {/* Background text decoration */}
            <div className="absolute -left-20 top-40 text-[20vw] font-display font-bold text-white/[0.02] pointer-events-none select-none">
                DOMAINES
            </div>

            <div className="container px-6 lg:px-12 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                    <div className="max-w-2xl">
                        <span className="text-white/40 uppercase tracking-[0.3em] text-xs font-bold mb-4 block">Secteurs d'Intervention</span>
                        <h2 className="text-5xl md:text-7xl font-display tracking-tight text-white">L'Expertise <br />sans concession</h2>
                    </div>
                    <p className="text-white/40 max-w-sm text-right font-light leading-relaxed hidden md:block">
                        Une approche segmentée par pôles d'excellence pour une réponse technique millimétrée.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[280px] gap-6">
                    {expertise.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.6 }}
                            className={`group relative p-8 rounded-[2.5rem] bg-stone-900/40 border border-white/5 backdrop-blur-sm overflow-hidden flex flex-col justify-end ${item.span} hover:border-white/20 transition-all duration-500`}
                        >
                            <div className="absolute top-8 left-8 p-4 rounded-2xl bg-white/5 text-white/40 group-hover:text-white group-hover:bg-white/10 transition-colors duration-500">
                                {item.icon}
                            </div>

                            <div className="relative z-10">
                                <h3 className="text-2xl font-display text-white mb-2">{item.title}</h3>
                                <p className="text-white/40 text-sm font-light leading-relaxed group-hover:text-white/70 transition-colors duration-500">
                                    {item.desc}
                                </p>
                            </div>

                            {/* Decorative line */}
                            <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-white group-hover:w-full transition-all duration-700" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const TeamSection = () => {
    const team = [
        {
            name: "Steven Breuil",
            role: "Fondateur & PDG",
            img: "/images/steven.jpg",
            desc: "Passionné par les télécoms depuis 2011, expert en missions PME et Grands Comptes."
        },
        {
            name: "Maxime",
            role: "Expert Consultant",
            img: "/images/maxime.jpg",
            desc: "Architecte de solutions IT complexes et accompagnement à la transformation digitale."
        },
        {
            name: "Tristan",
            role: "Expert Consultant",
            img: "/images/tristan.jpg",
            desc: "Spécialiste en cybersécurité et gouvernance des systèmes d'information."
        }
    ];

    return (
        <section className="py-32 bg-stone-950/50">
            <div className="container px-6 lg:px-12">
                <div className="text-center mb-24">
                    <span className="text-white/40 uppercase tracking-[0.3em] text-xs font-bold mb-4 block">L'ADN Acreed</span>
                    <h2 className="text-5xl md:text-7xl font-display tracking-tight text-white mb-6">Le capital humain</h2>
                    <div className="w-20 h-px bg-white/20 mx-auto" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
                    {team.map((member, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.2, duration: 0.8 }}
                            className="group text-center"
                        >
                            <div className="relative mb-8 inline-block">
                                <div className="absolute inset-0 bg-white/5 rounded-[3rem] blur-2xl group-hover:bg-white/10 transition-all duration-500" />
                                <div className="relative w-full aspect-[4/5] rounded-[3rem] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 border border-white/10">
                                    <img src={member.img} alt={member.name} className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000" />
                                </div>
                            </div>
                            <h3 className="text-3xl font-display text-white mb-2">{member.name}</h3>
                            <p className="text-white/40 uppercase tracking-widest text-[10px] font-bold mb-4">{member.role}</p>
                            <p className="text-white/30 text-sm font-light leading-relaxed max-w-[250px] mx-auto">
                                {member.desc}
                            </p>

                            <div className="flex justify-center gap-4 mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <button className="p-2 rounded-full border border-white/10 hover:bg-white/5"><Linkedin className="w-4 h-4 text-white/40" /></button>
                                <button className="p-2 rounded-full border border-white/10 hover:bg-white/5"><Mail className="w-4 h-4 text-white/40" /></button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const TimelineSection = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"]
    });

    const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

    const iconMap: Record<string, React.ElementType> = { Rocket, TrendingUp, Sparkles };

    return (
        <section ref={containerRef} className="py-40 relative overflow-hidden bg-black border-t border-white/5">
            <div className="container px-6 lg:px-12 relative z-10">
                <div className="text-center mb-32">
                    <span className="text-white/40 uppercase tracking-[0.3em] text-xs font-bold mb-4 block">Génèse & Horizon</span>
                    <h2 className="text-5xl md:text-7xl font-display tracking-tight text-white mb-6">Notre Trajectoire</h2>
                </div>

                {/* History Blocks - Sticky Scroll Architecture */}
                <div className="max-w-5xl mx-auto mb-40">
                    {historyBlocks.map((block, idx) => {
                        const Icon = iconMap[block.icon];
                        const isEven = idx % 2 === 0;

                        return (
                            <motion.div
                                key={block.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                className={`flex flex-col md:flex-row items-center gap-12 mb-24 last:mb-0 ${isEven ? '' : 'md:flex-row-reverse'}`}
                            >
                                <div className="flex-1 text-center md:text-left">
                                    <span className="text-white/40 tracking-widest text-xs font-mono mb-4 block">{block.period}</span>
                                    <h3 className="text-4xl md:text-5xl font-display text-white mb-6 relative inline-block">
                                        {block.title}
                                        {/* Subtle glowing underline effect */}
                                        <div className="absolute -bottom-2 left-0 w-full h-[1px] bg-gradient-to-r from-white/40 to-transparent" />
                                    </h3>
                                    <p className="text-white/50 text-lg leading-relaxed font-light mt-4">
                                        {block.description}
                                    </p>
                                </div>

                                <div className="flex-1 w-full flex justify-center">
                                    <div className="relative group w-full max-w-sm p-8 rounded-[2.5rem] bg-stone-900/30 border border-white/5 overflow-hidden transition-all duration-700 hover:border-white/20 select-none">
                                        {/* Perpetual Background Shimmering Glow */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                        <div className="relative z-10 flex flex-col items-center">
                                            <div className="p-5 rounded-2xl bg-white/5 text-white/60 group-hover:text-white transition-colors duration-500 mb-6 drop-shadow-2xl">
                                                {Icon && <Icon className="w-8 h-8" />}
                                            </div>
                                            {block.link ? (
                                                <a href={block.link} target="_blank" rel="noopener noreferrer" className="text-xl text-center text-white/80 font-display font-medium tracking-tight hover:text-white hover:underline underline-offset-4 decoration-white/30 transition-all duration-300">
                                                    {block.highlight}
                                                </a>
                                            ) : (
                                                <p className="text-xl text-center text-white/80 font-display font-medium tracking-tight">
                                                    {block.highlight}
                                                </p>
                                            )}
                                        </div>
                                        {/* Liquid Refraction Inner Shadow Trigger */}
                                        <div className="absolute inset-0 rounded-[2.5rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] pointer-events-none" />
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Timeline SVG Line + Milestones */}
                <div className="max-w-6xl mx-auto relative hidden md:block">
                    {/* SVG Progress Line */}
                    <div className="absolute top-8 left-[10%] right-[10%] h-[2px] bg-white/5 overflow-hidden rounded-full">
                        <motion.div
                            style={{ scaleX: pathLength, originX: 0 }}
                            className="w-full h-full bg-gradient-to-r from-white/20 via-white to-white/20 shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                        />
                    </div>

                    <div className="grid grid-cols-6 gap-4 relative z-10 pt-4">
                        {growthTimeline.map((milestone, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 * idx, duration: 0.6 }}
                                className="flex flex-col items-center text-center group"
                            >
                                <div className="w-3 h-3 rounded-full bg-stone-800 border-2 border-white/20 group-hover:border-white group-hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-all duration-300 mb-8" />
                                <span className="text-2xl font-display text-white mb-2">{milestone.year}</span>
                                <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-2 break-words max-w-[120px] mx-auto">{milestone.title}</span>
                                {milestone.metric && (
                                    <span className="text-xs text-white/20 font-light mt-2 max-w-[140px] leading-snug mx-auto">
                                        {milestone.metric}
                                    </span>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Mobile version timeline (Vertical) */}
                <div className="md:hidden flex flex-col gap-12 relative pl-6">
                    <div className="absolute left-[7px] top-0 bottom-0 w-[2px] bg-white/5" />
                    <motion.div
                        style={{ scaleY: pathLength, originY: 0 }}
                        className="absolute left-[7px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-white/20 via-white to-white/20"
                    />

                    {growthTimeline.map((milestone, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 * idx, duration: 0.6 }}
                            className="relative flex flex-col pl-8 group"
                        >
                            <div className="absolute -left-[5px] top-1.5 w-3 h-3 rounded-full bg-stone-800 border-2 border-white/20 z-10" />
                            <span className="text-2xl font-display text-white mb-1">{milestone.year}</span>
                            <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1 block">{milestone.title}</span>
                            {milestone.metric && (
                                <span className="text-xs text-white/20 font-light leading-snug">
                                    {milestone.metric}
                                </span>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const PartnersSection = () => {
    const partners = [
        "rhon_telecom.png", "spie.png", "tibco.png", "ert.png", "axians.png",
        "sfr.png", "circet.png", "amaris.png", "davidson.png", "orange.png"
    ];

    return (
        <section className="py-24 border-y border-white/5 overflow-hidden">
            <div className="container px-6 lg:px-12 mb-12">
                <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/20 text-center lg:text-left">
                    Ils nous font confiance
                </p>
            </div>

            <div className="relative flex overflow-hidden">
                <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="flex whitespace-nowrap min-w-full items-center py-4"
                >
                    {[...partners, ...partners].map((logo, idx) => (
                        <div key={idx} className="mx-8 lg:mx-16 grayscale opacity-30 hover:opacity-100 hover:grayscale-0 transition-all duration-500 cursor-pointer flex-shrink-0">
                            <img src={`/images/partners/${logo}`} alt="Partner" className="h-8 lg:h-12 w-auto object-contain" />
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

const StatsSection = () => {
    const stats = [
        { value: "30", label: "Consultants", sub: "Expertise Senior" },
        { value: "2M€", label: "CA 2024", sub: "Croissance Durable" },
        { value: "Nationale", label: "Présence", sub: "Proximité Client" },
        { value: "Confiance", label: "Relation", sub: "Transparence Totale" }
    ];

    return (
        <section className="py-32">
            <div className="container px-6 lg:px-12">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-0 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="flex flex-col items-center lg:items-start lg:px-12 py-8 lg:first:pl-0 lg:last:pr-0">
                            <span className="text-4xl md:text-5xl font-display font-medium text-white mb-2">{stat.value}</span>
                            <span className="text-white/40 uppercase tracking-widest text-[10px] font-bold mb-4">{stat.label}</span>
                            <p className="text-white/20 text-xs font-light">{stat.sub}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const CTASection = () => {
    return (
        <section className="py-40 relative">
            <div className="container px-6 lg:px-12 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto"
                >
                    <h2 className="text-5xl md:text-8xl font-display tracking-tighter text-white mb-12">
                        Prêt pour la <br /> <span className="italic">prochaine</span> étape ?
                    </h2>
                    <div className="flex flex-col md:flex-row justify-center gap-6">
                        <Button className="h-16 px-12 rounded-full bg-white text-black hover:bg-zinc-200 transition-all text-lg group" onClick={() => window.location.href = '/offres'}>
                            Découvrir nos offres
                            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button variant="outline" className="h-16 px-12 rounded-full border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-lg" onClick={() => window.location.href = '/contact'}>
                            Nous contacter
                        </Button>
                    </div>
                </motion.div>
            </div>

            {/* Background decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-[120px] -z-10" />
        </section>
    );
};

const ValuesSection = () => {
    const iconMap: Record<string, React.ElementType> = {
        Zap, BadgeEuro, Radio, Eye
    };

    return (
        <section className="py-32 relative overflow-hidden bg-black border-y border-white/5">
            <div className="container px-6 lg:px-12 relative z-10">
                <div className="text-center mb-24">
                    <span className="text-white/40 uppercase tracking-[0.3em] text-xs font-bold mb-4 block">Notre Force</span>
                    <h2 className="text-5xl md:text-7xl font-display tracking-tight text-white mb-6">Valeurs & Atouts</h2>
                    <div className="w-20 h-px bg-white/20 mx-auto" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {values.map((val, idx) => {
                        const Icon = iconMap[val.icon];
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, duration: 0.6 }}
                                className="group relative p-8 rounded-[2.5rem] bg-stone-900/40 border border-white/5 backdrop-blur-sm overflow-hidden flex flex-col items-center text-center hover:border-white/20 transition-all duration-500"
                            >
                                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-500 z-10">
                                    {Icon && <Icon className="w-8 h-8 text-white/70 group-hover:text-white transition-colors duration-500" />}
                                </div>
                                <h3 className="text-2xl font-display text-white mb-4 z-10">{val.title}</h3>
                                <p className="text-white/40 text-sm font-light leading-relaxed group-hover:text-white/70 transition-colors duration-500 z-10">
                                    {val.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

// --- Main Page ---

const AcreedVisionPremium = () => {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
            <SkipToContent />
            <Navigation />

            <main id="main-content" tabIndex={-1}>
                <HeroSection />

                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <StatsSection />

                <PartnersSection />

                <ExpertiseSection />

                <div className="container px-6 py-20">
                    <div className="relative h-[600px] rounded-[3rem] overflow-hidden border border-white/10">
                        <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm z-10 flex flex-col justify-center px-12 lg:px-24">
                            <span className="text-white/40 uppercase tracking-[0.4em] text-xs font-bold mb-6 block">Notre Philosophie</span>
                            <h2 className="text-4xl md:text-6xl font-display text-white max-w-4xl leading-tight">
                                "La simplicité est la sophistication suprême. Nous créons des ponts entre l'humain et la technologie."
                            </h2>
                        </div>
                        <img
                            src="/images/service-telecom.jpg"
                            className="absolute inset-0 w-full h-full object-cover grayscale opacity-20"
                            alt="Technology"
                        />
                    </div>
                </div>

                <ValuesSection />

                <TeamSection />

                <TimelineSection />

                <CTASection />
            </main>

            <Footer />
        </div>
    );
};

export default AcreedVisionPremium;
