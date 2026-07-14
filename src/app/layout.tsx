import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import "./globals.css";
import { siteUrl, missionLine } from "@/lib/site";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-bricolage",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
  themeColor: "#FBF7F2",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${bricolage.variable} ${inter.variable}`}>
      <body>
        <div className="ambient-glow">
          <div
            className="absolute -left-32 -top-32 h-96 w-96 rounded-full opacity-30 blur-3xl"
            style={{ background: "linear-gradient(135deg,#FF4A2E,#FF8A3D)" }}
          />
          <div
            className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full opacity-20 blur-3xl"
            style={{ background: "linear-gradient(135deg,#FF8A3D,#FF4A2E)" }}
          />
        </div>
        {children}
      </body>
    </html>
  );
}
