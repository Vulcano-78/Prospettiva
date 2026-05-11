import type { MetadataRoute } from 'next';
import { services, categories } from '@/data/services';

const SITE_URL = 'https://prospettiva.io';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/login`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/registrazione`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/cookie`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/termini`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/gdpr`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ];

  const categorySlugMap: Record<string, string> = {
    'documenti-catastali': 'documenti-catastali',
    'verifiche-ipotecarie': 'verifiche-ipotecarie',
    urbanistica: 'urbanistica',
    'marketing-ai': 'marketing-ai',
    'strumenti-gratuiti': 'utility-gratuite',
  };

  const categoryRoutes: MetadataRoute.Sitemap = categories.map(c => ({
    url: `${SITE_URL}/catalogo/${categorySlugMap[c.id] ?? c.id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const utilityRoutes: MetadataRoute.Sitemap = services
    .filter(s => s.isActive && s.href)
    .map(s => ({
      url: `${SITE_URL}${s.href}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

  return [...staticRoutes, ...categoryRoutes, ...utilityRoutes];
}
