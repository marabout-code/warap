import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "warap — Personnel domestique vérifié au Cameroun",
    template: "%s · warap",
  },
  description:
    "Depuis la diaspora, recrutez une aide ménagère, une nounou, un chauffeur ou une gouvernante au Cameroun. Chaque candidat est vérifié en personne par un agent local avant l'embauche.",
  keywords: [
    "recrutement Cameroun",
    "personnel domestique",
    "diaspora",
    "aide ménagère",
    "nounou",
    "gouvernante",
    "chauffeur",
    "vérification",
  ],
};

export const viewport: Viewport = {
  themeColor: "#0f766e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
