import { Loader2 } from 'lucide-react';

const RouteFallback = () => (
  <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
    <Loader2 className="w-7 h-7 animate-spin text-[#dbcca5]/60" aria-label="Chargement" />
    <span className="text-xs uppercase tracking-[3px] text-white/30">Chargement</span>
  </div>
);

export default RouteFallback;
