import Link from "next/link";
import Logo from "./logo";

export default function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 bg-hero-mesh px-4 py-12 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-96 w-96 animate-float rounded-full bg-primary-400/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-24 h-[28rem] w-[28rem] animate-float rounded-full bg-accent-400/20 blur-3xl [animation-delay:3s]" />
        <div className="absolute left-1/2 top-1/3 h-72 w-72 rounded-full bg-primary-400/10 blur-3xl" />
      </div>

      <div className="animate-fade-in-up relative w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex">
            <Logo size="lg" subtitle="Personnel vérifié" />
          </Link>
        </div>

        <div className="card-glass rounded-3xl border-white/70 p-8 shadow-card-hover">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}