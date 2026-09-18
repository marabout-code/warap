import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import UsersManager from "./users-manager";

export const dynamic = "force-dynamic";

export const metadata = { title: "Gestion des utilisateurs – warap" };

export default async function UsersPage() {
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

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, account_status, phone, location, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1.5">
        <p className="eyebrow">Administration</p>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Gestion des utilisateurs
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-slate-500">
          Attribuez les rôles (Famille / Employeur, Candidat, Agent vérificateur,
          Administrateur) et activez ou désactivez les comptes. Les comptes désactivés
          ne peuvent plus se connecter.
        </p>
      </div>

      <UsersManager profiles={profiles ?? []} currentUserId={user.id} />
    </div>
  );
}