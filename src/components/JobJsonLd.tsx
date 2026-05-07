import type { Job } from '@shared/types';

const SITE_URL = 'https://site.acreedconsulting.com';
const JOB_VALIDITY_DAYS = 60;

/**
 * Renders a hidden <script type="application/ld+json"> for a single JobPosting.
 * Google uses this for rich results in search and Google Jobs.
 */
const JobJsonLd = ({ job }: { job: Job }) => {
  const validThrough = computeValidThrough(job.publishedDate);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.fullDescription,
    datePosted: job.publishedDate,
    validThrough,
    employmentType: mapEmploymentType(job.type),
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location,
        addressCountry: 'FR',
      },
    },
    hiringOrganization: {
      '@type': 'Organization',
      name: 'Acreed Consulting',
      sameAs: SITE_URL,
      logo: `${SITE_URL}/images/favicon_footer.png`,
    },
    industry: job.sector,
    skills: job.skills.join(', '),
    directApply: true,
  };

  const safeJsonLd = JSON.stringify(jsonLd)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd }}
    />
  );
};

function mapEmploymentType(type: string): string {
  const lower = type.toLowerCase();
  if (lower.includes('cdi')) return 'FULL_TIME';
  if (lower.includes('cdd')) return 'CONTRACTOR';
  if (lower.includes('freelance')) return 'CONTRACTOR';
  if (lower.includes('stage') || lower.includes('intern')) return 'INTERN';
  if (lower.includes('alternance')) return 'OTHER';
  return 'FULL_TIME';
}

function computeValidThrough(publishedDate: string): string {
  const base = new Date(publishedDate);
  if (Number.isNaN(base.getTime())) {
    // Fallback: validity counted from today if the stored date is malformed.
    base.setTime(Date.now());
  }
  base.setDate(base.getDate() + JOB_VALIDITY_DAYS);
  return base.toISOString();
}

export default JobJsonLd;
