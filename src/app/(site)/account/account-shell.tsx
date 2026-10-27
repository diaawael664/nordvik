"use client";

import { Heart, LogOut, MapPin, Package } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { demoCustomer } from "@data/account";
import { Container } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/account/orders/", label: "Orders", icon: Package },
  { href: "/account/addresses/", label: "Addresses", icon: MapPin },
  { href: "/wishlist/", label: "Wishlist", icon: Heart },
];

/** Shared layout for signed-in account pages (demo: always "signed in"). */
export function AccountShell({ title, children }: { title: string; children: ReactNode }) {
  const pathname = usePathname();
  return (
    <Container className="py-12 md:py-16">
      <p className="eyebrow mb-3">Welcome back, {demoCustomer.firstName}</p>
      <h1 className="display-lg">{title}</h1>
      <div className="mt-10 grid gap-10 lg:grid-cols-[14rem_1fr] lg:gap-16">
        <nav aria-label="Account">
          <ul className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-0 lg:divide-y lg:divide-line lg:border-y lg:border-line">
            {nav.map(({ href, label, icon: Icon }) => {
              const current = pathname === href;
              return (
                <li key={href} className="shrink-0">
                  <Link
                    href={href}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-full border px-4 py-2 text-sm transition-colors lg:rounded-none lg:border-0 lg:px-0 lg:py-3.5",
                      current ? "border-ink font-semibold" : "border-line hover:text-accent",
                    )}
                  >
                    <Icon className="size-4" strokeWidth={1.5} /> {label}
                  </Link>
                </li>
              );
            })}
            <li className="shrink-0">
              <Link
                href="/account/"
                className="flex items-center gap-3 rounded-full border border-line px-4 py-2 text-sm text-muted hover:text-ink lg:rounded-none lg:border-0 lg:px-0 lg:py-3.5"
              >
                <LogOut className="size-4" strokeWidth={1.5} /> Sign out
              </Link>
            </li>
          </ul>
        </nav>
        <div className="min-w-0">{children}</div>
      </div>
    </Container>
  );
}
