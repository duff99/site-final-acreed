export interface NavLink {
  href: string;
  label: string;
}

export const navLinks: NavLink[] = [
  { href: '#top', label: 'Accueil' },
  { href: '#services', label: 'Services' },
  { href: '#expertise', label: 'Expertise' },
  { href: '#jobs', label: 'Nos Offres' },
  { href: '#about', label: 'Crédo' },
  { href: '#team', label: "L'Équipe" },
  { href: '#histoire', label: 'À propos' },
  { href: '#clients', label: 'Nos clients' },
];

export const ctaLink = {
  href: '/contact',
  label: 'Nous contacter',
};
