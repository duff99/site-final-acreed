
## Curseur fleche historique noir et blanc

### Concept
Remplacer le point rond actuel par un curseur en forme de fleche avec un design "historique" / vintage, inspire des anciennes fleches typographiques ou heraldiques. Le curseur sera dessine en SVG inline pour un rendu net a toutes les tailles.

### Design du curseur
- **Forme** : Fleche pointue classique avec empennage (style fleche ancienne / calligraphique), orientee vers le haut-gauche (pointe a la position exacte de la souris)
- **Style normal** : Fleche blanche avec un fin contour, taille ~24px
- **Style hover** (elements cliquables) : La fleche s'agrandit legerement et un halo subtil apparait autour
- **Couleurs** : Blanc pur avec contour noir tres fin (ou inverse selon le mix-blend-difference)

### Modifications techniques

**Fichier** : `src/components/CustomCursor.tsx`

1. Remplacer le `div` rond (`rounded-full bg-primary`) par un element SVG representant une fleche historique
2. Le SVG sera un `path` dessine avec des courbes pour un aspect elegant et ancien (pointe de fleche + tige fine + empennage)
3. Supprimer le `-translate-x-1/2 -translate-y-1/2` car la pointe de la fleche doit etre alignee sur le coin superieur gauche (comme un curseur natif)
4. Conserver le `mix-blend-difference` pour l'adaptation au fond
5. Au hover sur elements cliquables : animation de scale (1 vers 1.3) et legere rotation

### Aucun autre fichier modifie
Le CSS global (`cursor: none !important`) reste en place dans `src/index.css`.
