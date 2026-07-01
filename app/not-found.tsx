import { AppShellBackground } from "@/components/mybottle/app-shell-background";
import { AppErrorScreen } from "@/components/mybottle/app-error-screen";

export default function NotFound() {
  return (
    <>
      <AppShellBackground />
      <div className="relative z-10 min-h-dvh">
        <div className="mx-auto w-full max-w-md px-4 pb-8 pt-16 sm:px-5">
          <AppErrorScreen variant="not-found" />
        </div>
      </div>
    </>
  );
}
