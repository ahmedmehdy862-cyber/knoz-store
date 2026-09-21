import type { Metadata } from "next";
import { Tajawal, Almarai } from "next/font/google";
import "./globals.css";
import Providers from "@/components/shared/Providers";

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
      className={`${tajawal.variable} ${almarai.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
