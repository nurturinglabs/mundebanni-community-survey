import type { Metadata } from "next";
import { Inter, Outfit, IBM_Plex_Mono, Noto_Sans_Kannada, JetBrains_Mono, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-outfit",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

const notoSansKannada = Noto_Sans_Kannada({
  subsets: ["kannada"],
  weight: ["400", "500", "700"],
  variable: "--font-kannada",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SuperPower for your Business — Pre-Webinar Survey",
  description: "Tell us about your business so we can tailor the AI webinar for you. April 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} ${ibmPlexMono.variable} ${notoSansKannada.variable} ${jetbrainsMono.variable} ${playfairDisplay.variable} antialiased bg-background text-foreground font-inter`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
