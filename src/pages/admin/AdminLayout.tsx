import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Users, Mail, FileText, LogOut, ArrowLeft, ChevronUp, Shield, UserCheck } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

function getRoleLabel(role?: string) {
  switch (role) {
    case 'admin': return 'Administrateur';
    case 'editor': return 'Editeur';
    default: return 'Admin';
  }
}

export default function AdminLayout() {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sessionExpanded, setSessionExpanded] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Offres', href: '/admin/jobs', icon: Briefcase },
    { label: 'Messages', href: '/admin/messages', icon: Mail },
    { label: 'Candidatures', href: '/admin/candidatures', icon: FileText },
    ...(isAdmin ? [{ label: 'Utilisateurs', href: '/admin/users', icon: Users }] : []),
  ];

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?';

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <aside
        className="w-64 border-r border-white/[0.06] flex flex-col backdrop-blur-2xl"
        style={{
          background: 'linear-gradient(180deg, rgba(17, 18, 20, 0.85) 0%, rgba(12, 13, 15, 0.95) 100%)',
          boxShadow: 'inset -1px 0 0 0 rgba(255,255,255,0.06)',
        }}
      >
        <div className="p-6 border-b border-white/[0.06]">
          <Link to="/" className="flex items-center gap-2 text-white/50 text-sm hover:text-white/80 transition-colors duration-300 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Retour au site
          </Link>
          <div className="text-xl font-bold text-gradient font-playfair">ACREED</div>
          <div className="text-sm text-white/40">Panel Admin</div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === '/admin'
                ? location.pathname === '/admin'
                : location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-300 ${
                  isActive
                    ? 'bg-white/[0.08] text-white border border-white/[0.1] shadow-[0_0_15px_hsla(0,0%,100%,0.05)]'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Session info widget */}
        <div className="p-4 border-t border-white/[0.06]">
          <button
            onClick={() => setSessionExpanded(!sessionExpanded)}
            className="w-full flex items-center gap-3 p-2 rounded-xl transition-all duration-300 hover:bg-white/[0.04]"
          >
            <div className="w-8 h-8 rounded-lg bg-white/[0.08] border border-white/[0.1] flex items-center justify-center text-xs font-medium text-white/70 shrink-0">
              {initials}
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="text-sm text-white/80 truncate">{user?.name}</div>
              <div className="text-xs text-white/40 flex items-center gap-1">
                {user?.role === 'admin' ? <Shield className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                {getRoleLabel(user?.role)}
              </div>
            </div>
            <ChevronUp className={`w-4 h-4 text-white/30 transition-transform duration-200 shrink-0 ${sessionExpanded ? '' : 'rotate-180'}`} />
          </button>

          {sessionExpanded && (
            <div className="pt-3 space-y-1">
              <div className="text-xs text-white/40 px-2 mb-2 truncate">{user?.email}</div>
              <div className="h-px bg-white/[0.06]" />
              <button
                onClick={handleLogout}
                className="w-full text-left px-2 py-1.5 text-sm text-white/60 hover:text-white rounded-lg hover:bg-white/[0.04] transition-colors duration-200 flex items-center gap-2 mt-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                Deconnexion
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
