import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#08090c",
};

export const metadata: Metadata = {
  title: "Rhea Awsarmal — Marketing × Media × AI × Creative Production",
  description:
    "Portfolio of Rhea Awsarmal. Marketing and media professional combining strategy, creative production, business development and AI-assisted creative workflows.",
  keywords: [
    "Marketing",
    "Media",
    "Creative Production",
    "AI",
    "Business Development",
    "Brand Strategy",
    "Film Production",
  ],
  authors: [{ name: "Rhea Awsarmal" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans bg-[#08090c] text-[#21181a] selection:bg-pink-500/30 selection:text-white antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
