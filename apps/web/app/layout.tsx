import "./globals.css";
import { Providers } from "./providers";
import Nav from "@/components/Nav";

export const metadata = { title: "HEX MVP", description: "Hybrid Exchange MVP" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-neutral-950 text-neutral-100">
        <Providers>
          <Nav />
          {/* Deja espacio para el header fijo */}
          <main className="container mx-auto px-4 pt-20 pb-10">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}