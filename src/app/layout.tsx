import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "warap — Services vérifiés au Cameroun",
    template: "%s · warap",
  },
  description:
    "Publiez une offre de service au Cameroun ou trouvez le prestataire qu'il vous faut : aide à domicile, soins, cours, conduite, bricolage. Chaque prestataire est vérifié en personne par un agent local avant l'engagement.",
  keywords: [
    "services Cameroun",
    "prestataires vérifiés",
    "offres de service",
    "aide à domicile",
    "cours particuliers",
    "agent vérificateur",
    "recrutement Cameroun",
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
