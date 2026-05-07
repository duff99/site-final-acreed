import { lazy, Suspense, type ComponentType } from "react";

// Wraps React.lazy with retry-and-reload-on-failure logic. After a deploy, the user's
// cached HTML may reference chunk hashes that no longer exist on the server (each build
// produces new hashes); the import then 404s and React Suspense gets stuck on its fallback,
// which renders a black screen. We catch that, force a single hard reload (sessionStorage
// guards against an infinite loop) so the browser fetches the up-to-date HTML + chunks.
const lazyWithReload = <T extends ComponentType<unknown>>(
  factory: () => Promise<{ default: T }>,
) =>
  lazy(async () => {
    const KEY = 'acreed_chunk_reload';
    try {
      const mod = await factory();
      // Successful import — clear any leftover guard flag so a future stale-cache
      // failure can also trigger one auto-reload.
      if (typeof window !== 'undefined') sessionStorage.removeItem(KEY);
      return mod;
    } catch (err) {
      if (typeof window !== 'undefined' && !sessionStorage.getItem(KEY)) {
        sessionStorage.setItem(KEY, '1');
        window.location.reload();
      }
      throw err;
    }
  });
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import ConditionalParticles from "@/components/ConditionalParticles";
import ScrollToTop from "@/components/ScrollToTop";
import RouteFallback from "@/components/RouteFallback";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import { CookieConsentProvider } from "@/hooks/use-cookie-consent";
import CookieBanner from "@/components/CookieBanner";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/admin/ProtectedRoute";

// Lazy-loaded routes (code splitting)
const Jobs = lazyWithReload(() => import("./pages/Jobs"));
const JobDetail = lazyWithReload(() => import("./pages/JobDetail"));
const Contact = lazyWithReload(() => import("./pages/Contact"));
const MentionsLegales = lazyWithReload(() => import("./pages/MentionsLegales"));
const Confidentialite = lazyWithReload(() => import("./pages/Confidentialite"));
const PolitiqueCookies = lazyWithReload(() => import("./pages/PolitiqueCookies"));
const CGU = lazyWithReload(() => import("./pages/CGU"));
const AdminLogin = lazyWithReload(() => import("./pages/admin/AdminLogin"));
const AdminLayout = lazyWithReload(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazyWithReload(() => import("./pages/admin/AdminDashboard"));
const AdminJobList = lazyWithReload(() => import("./pages/admin/AdminJobList"));
const AdminJobForm = lazyWithReload(() => import("./pages/admin/AdminJobForm"));
const AdminUserList = lazyWithReload(() => import("./pages/admin/AdminUserList"));
const AdminUserForm = lazyWithReload(() => import("./pages/admin/AdminUserForm"));
const AdminMessageList = lazyWithReload(() => import("./pages/admin/AdminMessageList"));
const AdminApplicationList = lazyWithReload(() => import("./pages/admin/AdminApplicationList"));
const AdminProfile = lazyWithReload(() => import("./pages/admin/AdminProfile"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CookieConsentProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <ConditionalParticles />
            <CookieBanner />
            <Suspense fallback={<RouteFallback />}>
              <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/offres/:id" element={<JobDetail />} />
              <Route path="/offres" element={<Jobs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/mentions-legales" element={<MentionsLegales />} />
              <Route path="/confidentialite" element={<Confidentialite />} />
              <Route path="/politique-cookies" element={<PolitiqueCookies />} />
              <Route path="/cgu" element={<CGU />} />

              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<ProtectedRoute />}>
                <Route element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="jobs" element={<AdminJobList />} />
                  <Route path="jobs/new" element={<AdminJobForm />} />
                  <Route path="jobs/:id/edit" element={<AdminJobForm />} />
                  <Route path="users" element={<AdminUserList />} />
                  <Route path="users/new" element={<AdminUserForm />} />
                  <Route path="users/:id/edit" element={<AdminUserForm />} />
                  <Route path="messages" element={<AdminMessageList />} />
                  <Route path="candidatures" element={<AdminApplicationList />} />
                  <Route path="profile" element={<AdminProfile />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </CookieConsentProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
