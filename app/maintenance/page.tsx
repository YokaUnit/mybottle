import { AppShellBackground } from "@/components/mybottle/app-shell-background";
import { AppErrorScreen } from "@/components/mybottle/app-error-screen";

export const metadata = {
  title: "メンテナンス",
  robots: { index: false, follow: false },
};

export default function MaintenancePage() {
  return (
    <>
      <AppShellBackground />
      <div className="relative z-10 min-h-dvh">
        <AppErrorScreen variant="maintenance" standalone />
      </div>
    </>
  );
}
