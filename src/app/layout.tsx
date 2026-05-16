import type { Metadata, Viewport } from "next";
import { Manrope, Inter, Fira_Code } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import HeaderLab from "@/components/HeaderLab";
import Footer from "@/components/Footer";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["800"],
  variable: "--font-manrope",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-fira-code",
  display: "swap",
});

const SITE_URL = "https://prospettiva.io";
const SITE_NAME = "Prospettiva.io";
const SITE_TITLE = "Prospettiva.io - Documenti Catastali e Servizi Immobiliari";
const SITE_DESCRIPTION =
  "L'intelligenza digitale per il professionista immobiliare. Documenti catastali, verifiche ipotecarie, marketing AI.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | Prospettiva.io",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "visura catastale",
    "documenti catastali",
    "ispezione ipotecaria",
    "conservatoria",
    "planimetria catastale",
    "estratto di mappa",
    "professionisti immobiliari",
    "agenzie immobiliari",
    "marketing immobiliare AI",
  ],
  authors: [{ name: "Nuvó S.r.l." }],
  creator: "Nuvó S.r.l.",
  publisher: "Nuvó S.r.l.",
  alternates: { canonical: "/" },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Prospettiva.io — l'immobiliare, senza burocrazia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  legalName: "Nuvó S.r.l.",
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.ico`,
  description: SITE_DESCRIPTION,
  email: "info@prospettiva.io",
  vatID: "IT17463031009",
  address: {
    "@type": "PostalAddress",
    addressCountry: "IT",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: "it-IT",
  publisher: { "@type": "Organization", name: "Nuvó S.r.l." },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={`${manrope.variable} ${inter.variable} ${firaCode.variable}`}>
      <head>
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@400,0..1&display=swap"
        />
        <link
          id="material-symbols-stylesheet"
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@400,0..1&display=swap"
          media="print"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var l=document.getElementById('material-symbols-stylesheet');if(l){l.addEventListener('load',function(){l.media='all'});if(l.sheet)l.media='all'}})();`,
          }}
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@400,0..1&display=swap"
          />
        </noscript>
      </head>
      <body className="bg-white font-body text-on-surface">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <CartProvider>
          <HeaderLab />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
