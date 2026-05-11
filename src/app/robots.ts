import type { MetadataRoute } from 'next';

const SITE_URL = 'https://prospettiva.io';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin',
        '/admin/',
        '/dashboard',
        '/dashboard/',
        '/checkout/',
        '/conferma',
        '/pro/',
        '/coming-soon/',
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
