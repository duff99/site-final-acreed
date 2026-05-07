import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Mail,
  Phone,
  Linkedin,
  Send,
  User,
  MessageSquare,
  Clock,
  CheckCircle2,
  MessageCircle,
  Loader2,
} from 'lucide-react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api';
import { createContactSchema } from '@shared/schemas';
import type { CreateContactInput } from '@shared/types';
import SkipToContent from '@/components/SkipToContent';
import SEO from '@/components/SEO';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AnimatedSection from '@/components/AnimatedSection';
import SpotlightCard from '@/components/SpotlightCard';
import { team } from '@/data/team';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SUBJECT_OPTIONS = [
  'Recrutement',
  'Consulting',
  'Partenariat',
  'Candidature spontanée',
  'Autre',
] as const;

// ---------------------------------------------------------------------------
// Contact Page
// ---------------------------------------------------------------------------

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const honeypotRef = useRef<HTMLInputElement>(null);

  // Extra UI-only fields that get merged into message before sending
  const [b2bFields, setB2bFields] = useState({ company: '', positions: '', timeline: '' });
  const [b2cFields, setB2cFields] = useState({ preferredSector: '', availability: '' });

  const form = useForm<CreateContactInput>({
    resolver: zodResolver(createContactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: 'Recrutement',
      message: '',
      consent: false as unknown as true,
    },
  });

  const watchedSubject = form.watch('subject');
  const isB2B = watchedSubject === 'Recrutement' || watchedSubject === 'Consulting';
  const isB2C = watchedSubject === 'Candidature spontanée';

  const onSubmit = async (data: CreateContactInput) => {
    setIsSubmitting(true);
    try {
      // Enrich message with conditional UI-only fields
      let enrichedMessage = data.message;
      if (isB2B) {
        const extras = [
          b2bFields.company && `Entreprise : ${b2bFields.company}`,
          b2bFields.positions && `Postes : ${b2bFields.positions}`,
          b2bFields.timeline && `Delai : ${b2bFields.timeline}`,
        ].filter(Boolean);
        if (extras.length) enrichedMessage = `${extras.join(' | ')}\n\n${enrichedMessage}`;
      }
      if (isB2C) {
        const extras = [
          b2cFields.preferredSector && `Secteur : ${b2cFields.preferredSector}`,
          b2cFields.availability && `Disponibilite : ${b2cFields.availability}`,
        ].filter(Boolean);
        if (extras.length) enrichedMessage = `${extras.join(' | ')}\n\n${enrichedMessage}`;
      }

      await apiClient.sendContact({
        ...data,
        message: enrichedMessage,
        website: honeypotRef.current?.value ?? '',
      });

      toast({
        title: 'Message envoyé !',
        description: 'Notre équipe vous recontactera dans les plus brefs délais.',
      });
      form.reset();
      setB2bFields({ company: '', positions: '', timeline: '' });
      setB2cFields({ preferredSector: '', availability: '' });
      setSubmitSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Une erreur est survenue';
      toast({
        title: 'Erreur',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Shared input classes
  const inputClasses =
    'w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#dbcca5]/50 focus:bg-white/[0.04] focus:ring-1 focus:ring-[#dbcca5]/50 transition-all duration-300 font-light';
  const labelClasses =
    'text-[11px] text-white/50 uppercase tracking-[2px] mb-2 pl-1 block font-medium flex items-center gap-2';

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SkipToContent />
      <SEO
        title="Contact"
        description="Une question, un besoin en recrutement, un projet ? Notre équipe est à votre écoute. Joignez Acreed Consulting par téléphone, email ou via le formulaire."
        canonicalPath="/contact"
      />

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main id="main-content" tabIndex={-1} className="pt-24 md:pt-28">
        {/* ---------------------------------------------------------------- */}
        {/* HERO HEADER                                                      */}
        {/* ---------------------------------------------------------------- */}
        <section className="relative pt-8 pb-20 md:pt-12 md:pb-28 overflow-hidden">
          {/* Subtle radial glow behind heading */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)',
            }}
          />

          <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
            {/* Back link */}
            <AnimatedSection>
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
                aria-label="Retour à l'accueil"
              >
                <ArrowLeft
                  size={16}
                  className="group-hover:-translate-x-1 transition-transform"
                />
                Retour à l'accueil
              </Link>
            </AnimatedSection>

            {/* Heading */}
            <AnimatedSection delay={0.1} className="max-w-3xl mx-auto text-center">
              <span className="text-sm text-muted-foreground uppercase tracking-premium mb-4 block">
                Nous Contacter
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 pb-2 leading-[1.15] text-gradient">
                Parlons de votre projet
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Une question, un besoin en recrutement, un projet ? Notre équipe
                est à votre écoute.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* TEAM CARDS (horizontal row)                                      */}
        {/* ---------------------------------------------------------------- */}
        <section className="pb-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <AnimatedSection delay={0.2}>
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-10 text-gradient text-center">
                Vos interlocuteurs directs
              </h2>
            </AnimatedSection>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.map((member, index) => (
                <AnimatedSection key={member.name} delay={0.3 + index * 0.1}>
                  <SpotlightCard className="p-6 text-center" disableHoverMove>
                    <img
                      src={member.image}
                      alt={`Photo de ${member.name}`}
                      className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-2 border-white/10"
                    />
                    <h3 className="font-display font-bold text-lg">
                      {member.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {member.role}
                    </p>

                    <div className="border-t border-white/10 my-4" />

                    <div className="space-y-3">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors justify-center"
                          aria-label={`Envoyer un email à ${member.name}`}
                        >
                          <Mail size={15} className="flex-shrink-0" />
                          <span className="truncate">{member.email}</span>
                        </a>
                      )}

                      {member.phone && (
                        <a
                          href={`tel:${member.phone.replace(/\s/g, '')}`}
                          className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors justify-center"
                          aria-label={`Appeler ${member.name}`}
                        >
                          <Phone size={15} className="flex-shrink-0" />
                          <span>{member.phone}</span>
                        </a>
                      )}

                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors justify-center"
                          aria-label={`Profil LinkedIn de ${member.name}`}
                        >
                          <Linkedin size={15} className="flex-shrink-0" />
                          <span>LinkedIn</span>
                        </a>
                      )}
                    </div>
                  </SpotlightCard>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* NOTRE PROCESSUS                                                  */}
        {/* ---------------------------------------------------------------- */}
        <section className="pb-16 pt-8">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <AnimatedSection className="text-center mb-16">
              <span className="text-sm text-[#dbcca5] uppercase tracking-[3px] mb-4 block">
                Notre Processus
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
                Ce qu'il se passe ensuite
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg max-w-2xl mx-auto">
                Parce que votre temps est précieux, nous nous engageons à vous apporter une réponse rapide et un suivi entièrement personnalisé pour votre projet.
              </p>
            </AnimatedSection>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {/* Step 1 */}
              <AnimatedSection delay={0.2} className="h-full">
                <SpotlightCard className="p-8 h-full flex flex-col items-center text-center" disableHoverMove>
                  <div className="w-14 h-14 bg-[#dbcca5]/10 border border-[#dbcca5]/30 rounded-full flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(219,204,165,0.1)]">
                    <MessageCircle className="w-6 h-6 text-[#dbcca5]" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-white mb-3">1. Prise en compte</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Dès réception de votre message ou de votre candidature, notre équipe analyse votre besoin avec la plus grande attention.
                  </p>
                </SpotlightCard>
              </AnimatedSection>

              {/* Step 2 */}
              <AnimatedSection delay={0.3} className="h-full">
                <SpotlightCard className="p-8 h-full flex flex-col items-center text-center" disableHoverMove>
                  <div className="w-14 h-14 bg-[#dbcca5]/10 border border-[#dbcca5]/30 rounded-full flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(219,204,165,0.1)]">
                    <Clock className="w-6 h-6 text-[#dbcca5]" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-white mb-3">2. Retours rapides</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Un consultant spécialisé de la direction vous recontacte dans les plus brefs délais pour qualifier et approfondir vos enjeux.
                  </p>
                </SpotlightCard>
              </AnimatedSection>

              {/* Step 3 */}
              <AnimatedSection delay={0.4} className="h-full">
                <SpotlightCard className="p-8 h-full flex flex-col items-center text-center" disableHoverMove>
                  <div className="w-14 h-14 bg-[#dbcca5]/10 border border-[#dbcca5]/30 rounded-full flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(219,204,165,0.1)]">
                    <CheckCircle2 className="w-6 h-6 text-[#dbcca5]" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-white mb-3">3. Proposition d'action</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Nous vous présentons une solution sur-mesure (profils exclusifs, stratégie de consulting) totalement adaptée à votre contexte.
                  </p>
                </SpotlightCard>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* CONTACT FORM (Centered)                                          */}
        {/* ---------------------------------------------------------------- */}
        <section className="pb-24 pt-12">
          <div className="max-w-4xl mx-auto px-6 lg:px-12">
            <AnimatedSection>
              <div className="mb-12 text-center">
                <h3 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">Envoyez-nous un message</h3>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">Remplissez les informations ci-dessous et notre équipe vous recontactera dans les plus brefs délais.</p>
              </div>

              <SpotlightCard className="p-8 md:p-12 relative overflow-hidden" disableHoverMove>
                {/* Subtle inner ambient glow */}
                <div className="absolute -top-[150px] -right-[150px] w-[400px] h-[400px] bg-[#dbcca5]/10 rounded-full blur-[120px] opacity-40 pointer-events-none" />

                <AnimatePresence mode="wait">
                {submitSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-16 text-center relative z-10"
                  >
                    <div className="w-16 h-16 bg-[#dbcca5]/10 border border-[#dbcca5]/30 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 className="w-8 h-8 text-[#dbcca5]" />
                    </div>
                    <h4 className="text-2xl font-display font-bold text-white mb-3">Message envoye</h4>
                    <p className="text-muted-foreground mb-8 max-w-md">
                      Merci pour votre message. Notre equipe vous recontactera dans les plus brefs delais.
                    </p>
                    <motion.button
                      type="button"
                      onClick={() => setSubmitSuccess(false)}
                      className="px-6 py-3 bg-white/5 border border-white/10 text-white text-sm uppercase tracking-[1px] font-medium rounded-xl hover:bg-white/10 transition-colors"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Envoyer un autre message
                    </motion.button>
                  </motion.div>
                ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 relative z-10">
                    {/* Honeypot — invisible to humans, irresistible to bots */}
                    <div
                      aria-hidden="true"
                      style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}
                    >
                      <label htmlFor="contact-website">Ne pas remplir</label>
                      <input
                        ref={honeypotRef}
                        id="contact-website"
                        type="text"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        defaultValue=""
                      />
                    </div>

                    {/* Name */}
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClasses}>
                            <User size={13} className="text-[#dbcca5]/80" />
                            Nom complet
                          </FormLabel>
                          <FormControl>
                            <input
                              id="contact-name"
                              type="text"
                              placeholder="Votre nom et prénom"
                              className={inputClasses}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs text-red-400 mt-1 pl-1" />
                        </FormItem>
                      )}
                    />

                    {/* Email + Phone row */}
                    <div className="grid sm:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={labelClasses}>
                              <Mail size={13} className="text-[#dbcca5]/80" />
                              Email
                            </FormLabel>
                            <FormControl>
                              <input
                                id="contact-email"
                                type="email"
                                placeholder="votre@email.com"
                                className={inputClasses}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs text-red-400 mt-1 pl-1" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={labelClasses}>
                              <Phone size={13} className="text-[#dbcca5]/80" />
                              Téléphone
                            </FormLabel>
                            <FormControl>
                              <input
                                id="contact-phone"
                                type="tel"
                                placeholder="+33 6 00 00 00 00"
                                className={inputClasses}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs text-red-400 mt-1 pl-1" />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Subject */}
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClasses}>
                            <MessageSquare size={13} className="text-[#dbcca5]/80" />
                            Sujet
                          </FormLabel>
                          <FormControl>
                            <select
                              id="contact-subject"
                              className={`${inputClasses} appearance-none`}
                              {...field}
                            >
                              {SUBJECT_OPTIONS.map((option) => (
                                <option
                                  key={option}
                                  value={option}
                                  className="bg-[#121212] text-white"
                                >
                                  {option}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage className="text-xs text-red-400 mt-1 pl-1" />
                        </FormItem>
                      )}
                    />

                    {/* B2B conditional fields */}
                    <AnimatePresence>
                      {isB2B && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-6 overflow-hidden"
                        >
                          <div>
                            <label htmlFor="contact-company" className={labelClasses}>
                              <User size={13} className="text-[#dbcca5]/80" />
                              Entreprise
                            </label>
                            <input
                              id="contact-company"
                              type="text"
                              value={b2bFields.company}
                              onChange={(e) => setB2bFields((p) => ({ ...p, company: e.target.value }))}
                              placeholder="Nom de votre entreprise"
                              className={inputClasses}
                            />
                          </div>
                          <div className="grid sm:grid-cols-2 gap-6">
                            <div>
                              <label htmlFor="contact-positions" className={labelClasses}>
                                <MessageSquare size={13} className="text-[#dbcca5]/80" />
                                Nombre de postes
                              </label>
                              <select
                                id="contact-positions"
                                value={b2bFields.positions}
                                onChange={(e) => setB2bFields((p) => ({ ...p, positions: e.target.value }))}
                                className={`${inputClasses} appearance-none`}
                              >
                                <option value="" className="bg-[#121212] text-white">Non précisé</option>
                                <option value="1" className="bg-[#121212] text-white">1 poste</option>
                                <option value="2-5" className="bg-[#121212] text-white">2-5 postes</option>
                                <option value="5-10" className="bg-[#121212] text-white">5-10 postes</option>
                                <option value="10+" className="bg-[#121212] text-white">10+ postes</option>
                              </select>
                            </div>
                            <div>
                              <label htmlFor="contact-timeline" className={labelClasses}>
                                <Clock size={13} className="text-[#dbcca5]/80" />
                                Délai souhaité
                              </label>
                              <select
                                id="contact-timeline"
                                value={b2bFields.timeline}
                                onChange={(e) => setB2bFields((p) => ({ ...p, timeline: e.target.value }))}
                                className={`${inputClasses} appearance-none`}
                              >
                                <option value="" className="bg-[#121212] text-white">Non précisé</option>
                                <option value="urgent" className="bg-[#121212] text-white">Urgent (- de 2 semaines)</option>
                                <option value="1-month" className="bg-[#121212] text-white">Sous 1 mois</option>
                                <option value="3-months" className="bg-[#121212] text-white">Sous 3 mois</option>
                                <option value="flexible" className="bg-[#121212] text-white">Flexible</option>
                              </select>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* B2C conditional fields */}
                    <AnimatePresence>
                      {isB2C && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-6 overflow-hidden"
                        >
                          <div className="grid sm:grid-cols-2 gap-6">
                            <div>
                              <label htmlFor="contact-sector" className={labelClasses}>
                                <MessageSquare size={13} className="text-[#dbcca5]/80" />
                                Secteur préféré
                              </label>
                              <select
                                id="contact-sector"
                                value={b2cFields.preferredSector}
                                onChange={(e) => setB2cFields((p) => ({ ...p, preferredSector: e.target.value }))}
                                className={`${inputClasses} appearance-none`}
                              >
                                <option value="" className="bg-[#121212] text-white">Tous secteurs</option>
                                <option value="Telecoms" className="bg-[#121212] text-white">Télécoms</option>
                                <option value="IT" className="bg-[#121212] text-white">IT / Digital</option>
                                <option value="Cyber" className="bg-[#121212] text-white">Cybersécurité</option>
                                <option value="Energie" className="bg-[#121212] text-white">Énergie</option>
                                <option value="Industrie" className="bg-[#121212] text-white">Industrie</option>
                              </select>
                            </div>
                            <div>
                              <label htmlFor="contact-availability" className={labelClasses}>
                                <Clock size={13} className="text-[#dbcca5]/80" />
                                Disponibilité
                              </label>
                              <select
                                id="contact-availability"
                                value={b2cFields.availability}
                                onChange={(e) => setB2cFields((p) => ({ ...p, availability: e.target.value }))}
                                className={`${inputClasses} appearance-none`}
                              >
                                <option value="" className="bg-[#121212] text-white">Non précisé</option>
                                <option value="immediate" className="bg-[#121212] text-white">Immédiate</option>
                                <option value="1-month" className="bg-[#121212] text-white">Sous 1 mois</option>
                                <option value="3-months" className="bg-[#121212] text-white">Sous 3 mois</option>
                                <option value="listening" className="bg-[#121212] text-white">En veille</option>
                              </select>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Message */}
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClasses}>
                            <MessageSquare size={13} className="text-[#dbcca5]/80" />
                            Message
                          </FormLabel>
                          <FormControl>
                            <textarea
                              id="contact-message"
                              placeholder="Décrivez votre projet ou votre besoin..."
                              rows={5}
                              className={`${inputClasses} resize-none`}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs text-red-400 mt-1 pl-1" />
                        </FormItem>
                      )}
                    />

                    {/* Consent (RGPD) */}
                    <FormField
                      control={form.control}
                      name="consent"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start gap-3 rounded-lg border border-white/[0.08] p-3 bg-white/[0.02]">
                          <FormControl>
                            <Checkbox
                              id="contact-consent"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="mt-1 border-white/30 data-[state=checked]:bg-white data-[state=checked]:text-black"
                            />
                          </FormControl>
                          <div className="flex-1 space-y-1">
                            <FormLabel className="text-sm text-white/70 leading-snug font-light">
                              J'accepte que mes données soient traitées pour répondre à ma demande,
                              conformément à la{' '}
                              <Link
                                to="/confidentialite"
                                target="_blank"
                                className="text-[#dbcca5] underline hover:text-white"
                              >
                                politique de confidentialité
                              </Link>
                              .
                            </FormLabel>
                            <FormMessage className="text-xs text-red-400" />
                          </div>
                        </FormItem>
                      )}
                    />

                    {/* Submit */}
                    <div className="pt-6 mt-6 border-t border-white/5">
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className="group relative w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#dbcca5] text-[#0a0a0b] text-[13px] uppercase tracking-[2px] font-semibold rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(219,204,165,0.15)] disabled:opacity-60"
                        whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                        aria-label="Envoyer le message"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          {isSubmitting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                          {isSubmitting ? 'Envoi en cours...' : 'Finaliser l\'envoi'}
                        </span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                      </motion.button>

                      {watchedSubject === 'Candidature spontanée' && (
                        <p className="text-[11px] text-white/40 text-center mt-4 leading-relaxed">
                          Pour postuler à une offre précise avec votre CV, rendez-vous sur la page{' '}
                          <Link to="/offres" className="text-[#dbcca5] hover:underline">
                            Nos offres
                          </Link>
                          .
                        </p>
                      )}
                    </div>
                  </form>
                </Form>
                )}
                </AnimatePresence>
              </SpotlightCard>
            </AnimatedSection>

          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Contact;
