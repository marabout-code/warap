import Link from "next/link";
import Logo from "./logo";

export function PublicHeader({
  user,
  title = "Annonces",
}: {
  user?: { email?: string } | null;
  title?: string;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 lg:px-6">
        <Logo size="sm" subtitle="Personnel vérifié" />
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/#network" className="nav-link">
            Le réseau
          </Link>
          <Link href="/#how-it-works" className="nav-link">
            Comment ça marche
          </Link>
          <Link href="/annonces" className="nav-link font-semibold text-primary-700">
            {title}
          </Link>
        </nav>
        <div className="flex items-center gap-2.5">
          {user ? (
            <>
              <span className="hidden text-xs font-medium text-slate-500 sm:inline">
                {user.email}
              </span>
              <Link href="/dashboard" className="btn-primary !px-3.5 !py-2">
                Tableau de bord
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost !py-2">
                Se connecter
              </Link>
              <Link href="/register" className="btn-primary !px-3.5 !py-2">
                Rejoindre warap
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}