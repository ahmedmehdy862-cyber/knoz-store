import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Tajawal, Almarai } from "next/font/google";
import "./globals.css";
import Providers from "@/components/shared/Providers";
import {
  buildGoogleFontsHref,
  getFont,
  DEFAULT_HEADING_FONT,
  DEFAULT_BODY_FONT,
} from "@/lib/fonts";
import { getSiteSettings } from "@/services/site-content";
import {
  SITE_URL,
  SITE_NAME,
  SITE_LOCALE,
  DEFAULT_TITLE,
  DEFAULT_DESCRIPTION,
  OG_IMAGE,
  OG_IMAGE_WIDTH,
  OG_IMAGE_HEIGHT,
  GOOGLE_SITE_VERIFICATION,
  absoluteUrl,
} from "@/lib/seo";

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
});

const almarai = Almarai({
  variable: "--font-almarai",
  subsets: ["arabic"],
  weight: ["400", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: ["كنوز ستور", "Knoz Store", "منتجات مخصصة", "مجات", "استيكرز", "هدايا", "تخصيص"],
  authors: [{ name: SITE_NAME }],
  alternates: {
    canonical: absoluteUrl("/"),
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: GOOGLE_SITE_VERIFICATION
    ? { google: GOOGLE_SITE_VERIFICATION }
    : undefined,
  openGraph: {
    type: "website",
    locale: SITE_LOCALE,
    siteName: SITE_NAME,
    url: absoluteUrl("/"),
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const fontSettings = (settings.fonts || {}) as Record<string, unknown>;

  const heading = getFont(
    typeof fontSettings.heading === "string" ? fontSettings.heading : undefined,
    DEFAULT_HEADING_FONT
  );
  const body = getFont(
    typeof fontSettings.body === "string" ? fontSettings.body : undefined,
    DEFAULT_BODY_FONT
  );

  const fontStyle = {
    "--font-heading": `'${heading.family}', sans-serif`,
    "--font-body": `'${body.family}', sans-serif`,
  } as CSSProperties;

  const siteJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${absoluteUrl("/")}#organization`,
        name: SITE_NAME,
        url: absoluteUrl("/"),
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl(OG_IMAGE),
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${absoluteUrl("/")}#website`,
        url: absoluteUrl("/"),
        name: SITE_NAME,
        inLanguage: "ar",
        publisher: { "@id": `${absoluteUrl("/")}#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${absoluteUrl("/shop")}?search={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <html
      lang="ar"
      dir="rtl"
      style={fontStyle}
      className={`${tajawal.variable} ${almarai.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href={buildGoogleFontsHref(heading.id, body.id)}
          rel="stylesheet"
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}