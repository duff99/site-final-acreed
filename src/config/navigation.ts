export interface NavLink {
  href: string;
  label: string;
}

export const navLinks: NavLink[] = [
  { href: '#top', label: 'Accueil' },
  { href: '#services', label: 'Expertise' },
  { href: '#expertise', label: 'Services' },
  { href: '#jobs', label: 'Nos Offres' },
  { href: '#about', label: 'Crédo' },
  { href: '#team', label: "L'Équipe" },
  { href: '#histoire', label: 'À propos' },
];

export const ctaLink = {
  href: '/contact',
  label: 'Nous contacter',
};
