import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Mail,
  Phone,
  Linkedin,
  Send,
  User,
  MessageSquare,
  Paperclip,
  FileText,
  X,
} from 'lucide-react';
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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 Mo
const ACCEPTED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvError, setCvError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateAndSetFile = (file: File) => {
    setCvError(null);
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setCvError('Format accepté : PDF ou DOCX uniquement');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setCvError('Le fichier ne doit pas dépasser 5 Mo');
      return;
    }
    setCvFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSetFile(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = () => {
    setCvFile(null);
    setCvError(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // eslint-disable-next-line no-console
    console.log('Contact form submitted:', { ...form, cv: cvFile?.name });
  };

  // Shared input classes
  const inputClasses =
    'bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors w-full';

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main className="pt-32">
        {/* ---------------------------------------------------------------- */}
        {/* HERO HEADER                                                      */}
        {/* ---------------------------------------------------------------- */}
        <section className="relative py-20 md:py-28 overflow-hidden">
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
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12 group"
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
                  <SpotlightCard className="p-6 text-center">
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
        {/* CONTACT FORM (full width, centered)                              */}
        {/* ---------------------------------------------------------------- */}
        <section className="pb-20">
          <div className="max-w-5xl mx-auto px-6 lg:px-12">
            <AnimatedSection delay={0.5}>
              <SpotlightCard className="p-8 md:p-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="text-sm text-muted-foreground uppercase tracking-premium mb-2 block"
                    >
                      <span className="inline-flex items-center gap-2">
                        <User size={14} className="text-white/40" />
                        Nom complet
                      </span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Votre nom et prénom"
                      className={inputClasses}
                      required
                    />
                  </div>

                  {/* Email + Phone row */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="text-sm text-muted-foreground uppercase tracking-premium mb-2 block"
                      >
                        <span className="inline-flex items-center gap-2">
                          <Mail size={14} className="text-white/40" />
                          Email
                        </span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="votre@email.com"
                        className={inputClasses}
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-phone"
                        className="text-sm text-muted-foreground uppercase tracking-premium mb-2 block"
                      >
                        <span className="inline-flex items-center gap-2">
                          <Phone size={14} className="text-white/40" />
                          Téléphone
                        </span>
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+33 6 00 00 00 00"
                        className={inputClasses}
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label
                      htmlFor="contact-subject"
                      className="text-sm text-muted-foreground uppercase tracking-premium mb-2 block"
                    >
                      <span className="inline-flex items-center gap-2">
                        <MessageSquare size={14} className="text-white/40" />
                        Sujet
                      </span>
                    </label>
                    <select
                      id="contact-subject"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className={`${inputClasses} appearance-none`}
                      required
                    >
                      <option value="" disabled>
                        Sélectionnez un sujet
                      </option>
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
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="contact-message"
                      className="text-sm text-muted-foreground uppercase tracking-premium mb-2 block"
                    >
                      <span className="inline-flex items-center gap-2">
                        <MessageSquare size={14} className="text-white/40" />
                        Message
                      </span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Décrivez votre projet ou votre besoin..."
                      rows={5}
                      className={`${inputClasses} resize-none`}
                      required
                    />
                  </div>

                  {/* File attachment + Submit */}
                  <div className="space-y-4">
                    {/* Selected file display */}
                    {cvFile && (
                      <div className="flex items-center gap-3 border border-white/10 rounded-lg p-3 bg-white/5">
                        <FileText className="h-5 w-5 text-white/60 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{cvFile.name}</p>
                          <p className="text-xs text-white/40">
                            {formatFileSize(cvFile.size)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={removeFile}
                          className="p-1 rounded hover:bg-white/10 transition-colors"
                        >
                          <X className="h-4 w-4 text-white/60" />
                        </button>
                      </div>
                    )}

                    {cvError && (
                      <p className="text-sm text-red-400">{cvError}</p>
                    )}

                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {/* Buttons row */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <motion.button
                        type="submit"
                        className="btn-premium btn-premium-primary inline-flex items-center gap-2 text-sm w-full sm:w-auto justify-center"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        aria-label="Envoyer le message"
                      >
                        <Send size={16} />
                        Envoyer le message
                      </motion.button>

                      <motion.button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="btn-premium btn-premium-secondary inline-flex items-center gap-2 text-sm w-full sm:w-auto justify-center"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        aria-label="Joindre un fichier"
                      >
                        <Paperclip size={16} />
                        {cvFile ? 'Changer le fichier' : 'Joindre un CV'}
                      </motion.button>
                    </div>

                    <p className="text-xs text-white/30">
                      PDF, DOCX - 5 Mo max
                    </p>
                  </div>
                </form>
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
