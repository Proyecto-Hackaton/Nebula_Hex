"use client";
import Link from "next/link";
import TopbarClient from "@/components/TopbarClients";

export default function Nav() {
  return (
    <nav className="w-full border-b border-white/10 bg-neutral-900/70 backdrop-blur supports-[backdrop-filter]:bg-neutral-900/60 fixed top-0 inset-x-0 z-50">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold tracking-wide">HEX</Link>
          <div className="hidden md:flex items-center gap-4 text-sm text-neutral-300">
            <Link href="/swap" className="hover:text-white">Swap</Link>
            <Link href="/lending" className="hover:text-white">Lending</Link>
            <Link href="/agents/dca" className="hover:text-white">Agentes</Link>
            <Link href="/verify" className="hover:text-white">Verificar</Link>
          </div>
        </div>
        <TopbarClient />
      </div>
    </nav>
  );
}