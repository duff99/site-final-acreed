import { useLocation } from 'react-router-dom';
import ParticleCanvas from '@/components/ParticleCanvas';

const ConditionalParticles = () => {
  const { pathname } = useLocation();
  if (pathname.startsWith('/admin')) return null;
  return <ParticleCanvas />;
};

export default ConditionalParticles;
