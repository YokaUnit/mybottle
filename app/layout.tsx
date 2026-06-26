import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono, M_PLUS_Rounded_1c } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/providers";
import { POST_LOGIN_BOOT_COOKIE } from "@/lib/post-login-boot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const mplusRounded = M_PLUS_Rounded_1c({
  variable: "--font-mplus-rounded",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
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
  themeColor: "#14b8a6",
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
        url: "/images/ogp.png",
        width: 1536,
        height: 1024,
        alt: "mybottle — デジタルボトルキープ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "mybottle | デジタルボトルキープ",
    description:
      "mybottleは、店舗のボトルキープをスマホで管理・提示できるデジタルボトルキープサービスです。",
    images: ["/images/ogp.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const postLoginBootLock = cookieStore.get(POST_LOGIN_BOOT_COOKIE)?.value === "1";

  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} ${mplusRounded.variable} h-full antialiased`}
    >
      <head>
        <link rel="mask-icon" href="/images/favicon.png" color="#14b8a6" />
      </head>
      <body
        className={`min-h-full bg-[var(--mb-bg)] text-[var(--mb-ink)]${postLoginBootLock ? " mb-post-login-boot-lock" : ""}`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
