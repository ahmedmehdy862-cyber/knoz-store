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
  title: {
    default: "Knoz Store | كنوز ستور",
    template: "%s | Knoz Store",
  },
  description: "كنوز ستور - منتجات مخصصة، مجات، استيكرز، ثيمات، هدايا بطابع شخصي. صمّم منتجك بتفاصيلك.",
  keywords: ["كنوز ستور", "Knoz Store", "منتجات مخصصة", "مجات", "استيكرز", "هدايا", "تخصيص"],
  metadataBase:
    process.env.NEXT_PUBLIC_SITE_URL
      ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
      : null,
  openGraph: {
    type: "website",
    locale: "ar_EG",
    siteName: "Knoz Store",
    title: "Knoz Store | كنوز ستور",
    description:
      "كنوز ستور - منتجات مخصصة، مجات، استيكرز، ثيمات، هدايا بطابع شخصي. صمّم منتجك بتفاصيلك.",
    images: [
      {
        url: "/logo/knoz-logo.png",
        width: 640,
        height: 640,
        alt: "Knoz Store",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Knoz Store | كنوز ستور",
    description:
      "كنوز ستور - منتجات مخصصة، مجات، استيكرز، ثيمات، هدايا بطابع شخصي. صمّم منتجك بتفاصيلك.",
    images: ["/logo/knoz-logo.png"],
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

  return (
    <html
      lang="ar"
      dir="rtl"
      style={fontStyle}
      className={`${tajawal.variable} ${almarai.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
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