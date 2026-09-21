import type { Metadata } from "next";
import { Cairo, Aref_Ruqaa } from "next/font/google";
import "./globals.css";
import Providers from "@/components/shared/Providers";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
});

const arefRuqaa = Aref_Ruqaa({
  variable: "--font-aref-ruqaa",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Knoz Store | كنوز ستور",
    template: "%s | Knoz Store",
  },
  description: "كنوز ستور - منتجات مخصصة، مجات، استيكرز، ثيمات، هدايا بطابع شخصي. صمّم منتجك بتفاصيلك.",
  keywords: ["كنوز ستور", "Knoz Store", "منتجات مخصصة", "مجات", "استيكرز", "هدايا", "تخصيص"],
  openGraph: {
    type: "website",
    locale: "ar_EG",
    siteName: "Knoz Store",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} ${arefRuqaa.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
