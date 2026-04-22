import { AppBrandHeader } from "@/components/mybottle/app-brand-header";
import { AppNav } from "@/components/mybottle/app-nav";
import { PageTransition } from "@/components/mybottle/page-transition";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AppBrandHeader />
      <div className="mx-auto w-full max-w-md px-5 pb-28 pt-14">
        <PageTransition>{children}</PageTransition>
      </div>
      <AppNav />
    </>
  );
}
