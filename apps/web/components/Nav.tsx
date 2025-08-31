"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import TopbarClient from "@/components/TopbarClients";

const items = [
  { href: "/swap", label: "Swap" },
  { href: "/lending", label: "Lending" },
  { href: "/agents/dca", label: "Agentes" },
  { href: "/verify", label: "Verificar" },
  { href: "/vaults", label: "Vaults" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <nav className="w-full border-b border-white/10 bg-neutral-900/70 backdrop-blur supports-[backdrop-filter]:bg-neutral-900/60 fixed top-0 inset-x-0 z-50">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold tracking-wide">HEX</Link>
          <div className="hidden md:flex items-center gap-2 text-sm">
            {items.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={[
                    "px-2 py-1 rounded-md",
                    active ? "bg-white text-black" : "text-neutral-300 hover:text-white hover:bg-white/10"
                  ].join(" ")}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
        <TopbarClient />
      </div>
    </nav>
  );
}
