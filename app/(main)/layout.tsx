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
      <div className="mx-auto w-full max-w-md overflow-x-clip px-4 pb-28 pt-14 sm:px-5">
        {children}
      </div>
      <AppNav />
    </>
  );
}
