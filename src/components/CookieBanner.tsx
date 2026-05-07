import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';
import { useCookieConsent } from '@/hooks/use-cookie-consent';

/**
 * Persistent cookie consent banner.
 *
 * Behavior (CNIL-compliant):
 * - Visible while no choice has been recorded. Cannot be dismissed by
 *   clicking outside or pressing Escape — the user must click Accept,
 *   Refuse, or Save preferences. Refusing must be as easy as accepting,
 *   so we surface both at the same level.
 * - Categories: Strictly necessary (always on, non-toggleable), Analytics
 *   (opt-in), Marketing (opt-in). No category is loaded until the user
 *   accepts that category.
 * - Visually anchored bottom-center. Page content remains usable behind
 *   it (no opaque overlay) so the user can still read the policy linked
 *   from the banner before deciding.
 */
const CookieBanner = () => {
  const { isPending, acceptAll, refuseAll, saveCustom } = useCookieConsent();
  const [showCustom, setShowCustom] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  return (
    <AnimatePresence>
      {isPending && (
        <motion.div
          role="dialog"
          aria-modal="false"
          aria-labelledby="cookie-banner-title"
          aria-describedby="cookie-banner-desc"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 bottom-0 z-[80] px-4 pb-4 md:pb-6 pointer-events-none"
        >
          <div
            className="pointer-events-auto mx-auto max-w-3xl rounded-2xl border border-white/[0.08] bg-[#0a0a0b]/95 backdrop-blur-2xl shadow-[0_24px_60px_rgba(0,0,0,0.6)]"
            style={{
              boxShadow:
                '0 0 0 1px rgba(255,255,255,0.04), 0 24px 60px rgba(0,0,0,0.55)',
            }}
          >
            <div className="p-5 md:p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#dbcca5]/20 bg-[#dbcca5]/[0.06]">
                  <Cookie className="h-4 w-4 text-[#dbcca5]" aria-hidden="true" />
                </div>
                <div>
                  <h2
                    id="cookie-banner-title"
                    className="text-base md:text-lg font-display text-white mb-1"
                  >
                    Vos préférences en matière de cookies
                  </h2>
                  <p
                    id="cookie-banner-desc"
                    className="text-sm text-white/60 leading-relaxed font-light"
                  >
                    Nous utilisons des cookies strictement nécessaires au fonctionnement
                    du site. Avec votre accord, nous pouvons aussi déposer des cookies
                    de mesure d'audience et marketing. Vous pouvez accepter, refuser ou
                    personnaliser à tout moment. Pour en savoir plus, consultez notre{' '}
                    <Link
                      to="/politique-cookies"
                      className="text-[#dbcca5] underline decoration-dotted underline-offset-2 hover:text-white"
                    >
                      politique de cookies
                    </Link>
                    .
                  </p>
                </div>
              </div>

              {showCustom && (
                <div className="space-y-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 mb-4">
                  <CategoryRow
                    title="Strictement nécessaires"
                    description="Authentification, préférences de session. Ces cookies sont indispensables et ne peuvent pas être désactivés."
                    locked
                    checked
                  />
                  <CategoryRow
                    title="Mesure d'audience"
                    description="Statistiques anonymisées sur l'utilisation du site (aucun outil tiers actif aujourd'hui)."
                    checked={analytics}
                    onChange={setAnalytics}
                  />
                  <CategoryRow
                    title="Marketing"
                    description="Contenus personnalisés et mesure d'efficacité des campagnes."
                    checked={marketing}
                    onChange={setMarketing}
                  />
                </div>
              )}

              <div className="flex flex-col-reverse gap-2 md:flex-row md:items-center md:justify-end">
                {showCustom ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowCustom(false)}
                      className="px-4 py-2.5 text-sm rounded-xl border border-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.04] transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      onClick={() => saveCustom({ analytics, marketing })}
                      className="px-5 py-2.5 text-sm font-medium rounded-xl bg-[#dbcca5] text-[#0a0a0b] hover:bg-white transition-colors"
                    >
                      Enregistrer mes choix
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowCustom(true)}
                      className="px-4 py-2.5 text-sm rounded-xl border border-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.04] transition-colors"
                    >
                      Personnaliser
                    </button>
                    <button
                      type="button"
                      onClick={refuseAll}
                      className="px-5 py-2.5 text-sm font-medium rounded-xl border border-white/[0.12] bg-white/[0.04] text-white hover:bg-white/[0.08] hover:border-white/[0.18] transition-colors"
                    >
                      Tout refuser
                    </button>
                    <button
                      type="button"
                      onClick={acceptAll}
                      className="px-5 py-2.5 text-sm font-medium rounded-xl border border-white/[0.12] bg-white/[0.04] text-white hover:bg-white/[0.08] hover:border-white/[0.18] transition-colors"
                    >
                      Tout accepter
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface CategoryRowProps {
  title: string;
  description: string;
  checked: boolean;
  locked?: boolean;
  onChange?: (next: boolean) => void;
}

const CategoryRow = ({ title, description, checked, locked, onChange }: CategoryRowProps) => (
  <div className="flex items-start justify-between gap-4">
    <div className="flex-1">
      <div className="text-sm text-white/85 font-medium mb-0.5">{title}</div>
      <p className="text-xs text-white/50 leading-relaxed font-light">{description}</p>
    </div>
    <label
      className={`mt-1 relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
        checked ? 'bg-[#dbcca5]' : 'bg-white/[0.08] border border-white/[0.06]'
      } ${locked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        disabled={locked}
        onChange={(e) => onChange?.(e.target.checked)}
        aria-label={title}
      />
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-[#0a0a0b] transition-transform ${
          checked ? 'translate-x-[1.125rem]' : 'translate-x-0.5'
        }`}
      />
    </label>
  </div>
);

export default CookieBanner;
export { X };
