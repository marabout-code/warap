import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getServiceCategories } from "@/lib/service-categories.server";
import CategoriesManager from "./categories-manager";

export const dynamic = "force-dynamic";

export const metadata = { title: "Gestion des catégories – warap" };

export default async function CategoriesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: me } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", user.id)
    .single();

  if (me?.role !== "admin") redirect("/dashboard");

  const [categories, jobs] = await Promise.all([
    getServiceCategories(),
    supabase.from("jobs").select("category"),
  ]);

  const usage: Record<string, number> = {};
  for (const job of jobs.data ?? []) {
    const key = job.category ?? "other";
    usage[key] = (usage[key] ?? 0) + 1;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1.5">
        <p className="eyebrow">Administration</p>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Catégories de service
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-slate-500">
          Gérez les catégories proposées lors de la publication d&apos;une offre.
          Elles sont reprises sur le classement des annonces, le pied de page et
          les formulaires. La catégorie « Autre » sert de valeur par défaut et ne
          peut pas être supprimée.
        </p>
      </div>

      <CategoriesManager categories={categories} usage={usage} />
    </div>
  );
}