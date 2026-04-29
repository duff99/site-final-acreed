import { Loader2 } from 'lucide-react';

const RouteFallback = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <Loader2 className="w-6 h-6 animate-spin text-white/40" aria-label="Chargement" />
  </div>
);

export default RouteFallback;
