import type { Metadata } from "next"; // Ajoute cet import
import Header from "@/components/header";
import Footer from "@/components/footer";
import "./globals.css";

// Ces métadonnées s'appliqueront à TOUT le site par défaut
export const metadata: Metadata = {
  title: {
    default: "HYVAI | Sustainable Energy Solutions",
    template: "%s | HYVAI" // Permet d'avoir "Locations | HYVAI" automatiquement
  },
  description: "Powering Africa with next-generation solar solutions & energy storage",
  icons: {
    icon: "/favicon.ico", // Assure-toi d'avoir un favicon dans /public
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-black text-white">
        <Header />
        <main>{children}</main> {/* Bonne pratique : envelopper le contenu dans <main> */}
        <Footer />
      </body>
    </html>
  );
}