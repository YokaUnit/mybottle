import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "法律・サポート",
  robots: { index: true, follow: true },
};

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
