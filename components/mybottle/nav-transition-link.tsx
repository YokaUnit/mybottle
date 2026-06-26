"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition, type ComponentProps } from "react";

type Props = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
};

function runViewTransition(navigate: () => void) {
  if (typeof document !== "undefined" && "startViewTransition" in document) {
    (
      document as Document & {
        startViewTransition: (callback: () => void) => void;
      }
    ).startViewTransition(navigate);
    return;
  }
  navigate();
}

export function NavTransitionLink({ href, onClick, scroll = false, prefetch = true, ...props }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const nextPath = href.split("?")[0] ?? href;

  return (
    <Link
      {...props}
      href={href}
      scroll={scroll}
      prefetch={prefetch}
      data-pending={isPending ? "" : undefined}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        if (!nextPath || nextPath === pathname) return;

        event.preventDefault();
        runViewTransition(() => {
          startTransition(() => {
            router.push(href);
          });
        });
      }}
    />
  );
}
