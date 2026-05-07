import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://site.acreedconsulting.com';
const SITE_NAME = 'Acreed Consulting';

const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

interface SEOProps {
  /** Page title — appended with " | Acreed Consulting" automatically unless `bareTitle` is true. */
  title: string;
  /** Meta description (~155 chars). */
  description: string;
  /** Path used to compute canonical + og:url. Default: current pathname. */
  canonicalPath?: string;
  /** Override og:image. Defaults to the site-wide cover. */
  ogImage?: string;
  /** og:type. Default 'website'. Use 'article' for job detail pages. */
  ogType?: 'website' | 'article';
  /** Disable the " | Acreed Consulting" suffix (useful for the home page). */
  bareTitle?: boolean;
  /** Set true on pages we don't want in Google (admin, 404...). */
  noIndex?: boolean;
}

const SEO = ({
  title,
  description,
  canonicalPath,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  bareTitle = false,
  noIndex = false,
}: SEOProps) => {
  const fullTitle = bareTitle ? title : `${title} | ${SITE_NAME}`;
  const path =
    canonicalPath ??
    (typeof window !== 'undefined' ? window.location.pathname : '/');
  const canonicalUrl = `${SITE_URL}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="fr_FR" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SEO;
