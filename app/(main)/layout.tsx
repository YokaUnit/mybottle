import { AppBrandHeader } from "@/components/mybottle/app-brand-header";
import { AppNav } from "@/components/mybottle/app-nav";
import { AppShellBackground } from "@/components/mybottle/app-shell-background";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AppShellBackground />
      <div className="relative z-10 min-h-dvh">
        <AppBrandHeader />
        <div className="mx-auto w-full max-w-md px-4 pb-[calc(5.75rem+env(safe-area-inset-bottom))] pt-16 sm:px-5">
          {children}
        </div>
        <AppNav />
      </div>
    </>
  );
}
