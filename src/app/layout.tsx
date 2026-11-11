import type { Metadata, Viewport } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { siteUrl, missionLine } from "@/lib/site";
import { Footer } from "@/components/Footer";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: "variable",
  style: ["normal"],
  axes: ["opsz", "SOFT"],
  variable: "--font-fraunces",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-instrument-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Spread",
  description: missionLine,
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Spread",
  },
  openGraph: {
    title: "Spread",
    description: missionLine,
    siteName: "Spread",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Spread",
    description: missionLine,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFF7ED",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${instrumentSans.variable}`}
    >
      <body>
        <div className="ambient-glow">
          <div
            className="absolute -left-32 -top-32 h-96 w-96 rounded-full opacity-[0.12] blur-3xl"
            style={{ background: "linear-gradient(135deg,#C4472D,#D9836D)" }}
          />
          <div
            className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full opacity-[0.08] blur-3xl"
            style={{ background: "linear-gradient(135deg,#D9836D,#C4472D)" }}
          />
        </div>
        {children}
        <Footer />
      </body>
    </html>
  );
}
