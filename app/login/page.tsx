import Image from "next/image";
import { LoginGuestAction, LoginPrimaryActions } from "@/components/mybottle/login-continue";
import { PageTransition } from "@/components/mybottle/page-transition";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-dvh flex-col bg-black">
      <Image
        src="/images/start_page.png"
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      <PageTransition>
        <div className="relative z-10 flex min-h-dvh flex-col px-6 pb-10 pt-[max(2.5rem,env(safe-area-inset-top))]">
          <div className="flex flex-1 flex-col items-center justify-center gap-12">
            <div
              className="relative w-[min(92vw,360px)] drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]"
              style={{ aspectRatio: "280 / 120" }}
            >
              <Image
                src="/images/logo-bottle.png"
                alt="mybottle デジタルボトルキープ"
                fill
                priority
                unoptimized
                sizes="(max-width: 768px) 92vw, 360px"
                className="object-contain object-center"
              />
            </div>

            <LoginPrimaryActions />
          </div>

          <LoginGuestAction />
        </div>
      </PageTransition>
    </main>
  );
}
