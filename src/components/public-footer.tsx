import Link from "next/link";
import Logo from "./logo";
import { getServiceCategories } from "@/lib/service-categories.server";

export default async function Footer() {
  const categories = await getServiceCategories();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 lg:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Logo size="sm" subtitle="Services vérifiés" />
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              warap connecte les clients aux meilleurs profils de prestataires,
              vérifiés en personne par des agents locaux.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Découvrir
              </p>
              <ul className="mt-3 space-y-2.5 text-sm">
                <li><Link href="/annonces" className="nav-link">Offres</Link></li>
                <li><Link href="/#network" className="nav-link">Le réseau d&apos;agents</Link></li>
                <li><Link href="/#how-it-works" className="nav-link">Comment ça marche</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Espace
              </p>
              <ul className="mt-3 space-y-2.5 text-sm">
                <li><Link href="/login" className="nav-link">Se connecter</Link></li>
                <li><Link href="/register" className="nav-link">Créer un compte</Link></li>
                <li><Link href="/dashboard" className="nav-link">Tableau de bord</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Catégories
              </p>
              <ul className="mt-3 space-y-2.5 text-sm">
                {categories
                  .filter((c) => c.id !== "other")
                  .slice(0, 6)
                  .map((c) => (
                    <li key={c.id}>
                      <Link href={`/annonces?cat=${c.id}`} className="nav-link">
                        {c.emoji} {c.short}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-6 text-xs text-slate-400 sm:flex-row">
          <p>© {new Date().getFullYear()} warap — Services vérifiés au Cameroun.</p>
          <p>Douala · Yaoundé · Bafoussam</p>
        </div>
      </div>
    </footer>
  );
}