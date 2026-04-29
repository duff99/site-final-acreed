import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/**
 * Cookie consent state. Stored in localStorage so it survives across visits.
 * - `necessary` is always true: those cookies (auth, CSRF, language) are
 *   exempt from consent under the ePrivacy directive + CNIL guidelines.
 * - `analytics` and `marketing` are opt-in. Set to `false` until the user
 *   explicitly accepts. Components that want to load analytics SDKs gate
 *   on `consent.analytics === true`.
 */
export interface CookieConsent {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  /** ISO date when the user made their choice. */
  decidedAt: string;
  /** Bumps when categories change so we can re-prompt on policy update. */
  version: number;
}

const STORAGE_KEY = 'acreed_cookie_consent';
const CURRENT_VERSION = 1;

interface CookieConsentContextValue {
  consent: CookieConsent | null;
  /** True until the user makes a choice — drives the banner visibility. */
  isPending: boolean;
  acceptAll: () => void;
  refuseAll: () => void;
  saveCustom: (choices: { analytics: boolean; marketing: boolean }) => void;
  /** Re-open the banner so the user can update choices later. */
  reopen: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

function readStored(): CookieConsent | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CookieConsent;
    if (parsed.version !== CURRENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

function persist(consent: CookieConsent) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  } catch {
    // localStorage might be disabled; consent is then session-only and the
    // banner reappears next visit. That is the safe default.
  }
}

export const CookieConsentProvider = ({ children }: { children: React.ReactNode }) => {
  const [consent, setConsent] = useState<CookieConsent | null>(() => readStored());
  const [forceOpen, setForceOpen] = useState(false);

  useEffect(() => {
    if (consent) persist(consent);
  }, [consent]);

  const isPending = forceOpen || consent === null;

  const buildConsent = useCallback(
    (analytics: boolean, marketing: boolean): CookieConsent => ({
      necessary: true,
      analytics,
      marketing,
      decidedAt: new Date().toISOString(),
      version: CURRENT_VERSION,
    }),
    []
  );

  const acceptAll = useCallback(() => {
    setConsent(buildConsent(true, true));
    setForceOpen(false);
  }, [buildConsent]);

  const refuseAll = useCallback(() => {
    setConsent(buildConsent(false, false));
    setForceOpen(false);
  }, [buildConsent]);

  const saveCustom = useCallback(
    ({ analytics, marketing }: { analytics: boolean; marketing: boolean }) => {
      setConsent(buildConsent(analytics, marketing));
      setForceOpen(false);
    },
    [buildConsent]
  );

  const reopen = useCallback(() => setForceOpen(true), []);

  const value = useMemo(
    () => ({ consent, isPending, acceptAll, refuseAll, saveCustom, reopen }),
    [consent, isPending, acceptAll, refuseAll, saveCustom, reopen]
  );

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
};

export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) {
    throw new Error('useCookieConsent must be used inside <CookieConsentProvider>');
  }
  return ctx;
}
