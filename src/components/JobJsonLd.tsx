import type { Job } from '@shared/types';

/**
 * Renders a hidden <script type="application/ld+json"> for a single JobPosting.
 * Google uses this for rich results in search.
 */
const JobJsonLd = ({ job }: { job: Job }) => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.fullDescription,
    datePosted: job.publishedDate,
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
      sameAs: 'https://www.acreedconsulting.com',
    },
    industry: job.sector,
    skills: job.skills.join(', '),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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

export default JobJsonLd;
