import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import ParticleCanvas from "@/components/ParticleCanvas";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/admin/ProtectedRoute";

// Lazy-loaded routes (code splitting)
const AcreedVisionPremium = lazy(() => import("./pages/AcreedVisionPremium"));
const Jobs = lazy(() => import("./pages/Jobs"));
const Contact = lazy(() => import("./pages/Contact"));
const MentionsLegales = lazy(() => import("./pages/MentionsLegales"));
const Confidentialite = lazy(() => import("./pages/Confidentialite"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminJobList = lazy(() => import("./pages/admin/AdminJobList"));
const AdminJobForm = lazy(() => import("./pages/admin/AdminJobForm"));
const AdminUserList = lazy(() => import("./pages/admin/AdminUserList"));
const AdminUserForm = lazy(() => import("./pages/admin/AdminUserForm"));
const AdminMessageList = lazy(() => import("./pages/admin/AdminMessageList"));
const AdminApplicationList = lazy(() => import("./pages/admin/AdminApplicationList"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ParticleCanvas />
        <BrowserRouter>
          <Suspense fallback={null}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/vision" element={<AcreedVisionPremium />} />
              <Route path="/offres" element={<Jobs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/mentions-legales" element={<MentionsLegales />} />
              <Route path="/confidentialite" element={<Confidentialite />} />

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
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
