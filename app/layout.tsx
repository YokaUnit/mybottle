import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const metadataBaseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ??
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://mybottle.app");

export const metadata: Metadata = {
  metadataBase: new URL(metadataBaseUrl),
  title: {
    default: "mybottle | デジタルボトルキープ",
    template: "%s | mybottle",
  },
  description:
    "mybottleは、店舗のボトルキープをスマホで管理・提示できるデジタルボトルキープサービスです。",
  applicationName: "mybottle",
  keywords: [
    "mybottle",
    "デジタルボトルキープ",
    "ボトルキープ",
    "バー",
    "飲食店DX",
  ],
  category: "food",
  alternates: {
    canonical: "/",
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
  icons: {
    icon: [{ url: "/images/favicon.png", type: "image/png" }],
    shortcut: ["/images/favicon.png"],
    apple: [{ url: "/images/favicon.png", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
  themeColor: "#ffffff",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "mybottle",
    title: "mybottle | デジタルボトルキープ",
    description:
      "mybottleは、店舗のボトルキープをスマホで管理・提示できるデジタルボトルキープサービスです。",
    url: "/",
    images: [
      {
        url: "/images/favicon.png",
        width: 512,
        height: 512,
        alt: "mybottle ロゴ",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "mybottle | デジタルボトルキープ",
    description:
      "mybottleは、店舗のボトルキープをスマホで管理・提示できるデジタルボトルキープサービスです。",
    images: ["/images/favicon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="mask-icon" href="/images/favicon.png" color="#1e3a2f" />
      </head>
      <body className="min-h-full bg-[var(--mb-bg)] text-[var(--mb-ink)]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
