import { AppBrandHeader } from "@/components/mybottle/app-brand-header";
import { AppNav } from "@/components/mybottle/app-nav";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AppBrandHeader />
      <div className="mx-auto w-full max-w-md bg-[#f8fafc] px-4 pb-[calc(5.75rem+env(safe-area-inset-bottom))] pt-16 sm:px-5">
        {children}
      </div>
      <AppNav />
    </>
  );
}
