"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_CATEGORY, type ServiceCategory } from "@/lib/service-categories";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  moveCategory,
} from "@/lib/actions/categories";

type Feedback = { type: "error" | "success"; text: string } | null;

function AddCategoryForm() {
  const [id, setId] = useState("");
  const [label, setLabel] = useState("");
  const [short, setShort] = useState("");
  const [emoji, setEmoji] = useState("");
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const submit = async () => {
    if (!id.trim() || !label.trim() || !short.trim()) {
      setFeedback({
        type: "error",
        text: "Renseignez l'identifiant, le libellé et le libellé court.",
      });
      return;
    }
    const formData = new FormData();
    formData.set("id", id.trim());
    formData.set("label", label.trim());
    formData.set("short", short.trim());
    formData.set("emoji", emoji.trim() || "✨");
    const result = await createCategory(null, formData);
    if (result && "error" in result) {
      setFeedback({ type: "error", text: result.error });
      return;
    }
    setId("");
    setLabel("");
    setShort("");
    setEmoji("");
    setFeedback({ type: "success", text: "Catégorie ajoutée." });
    startTransition(() => router.refresh());
  };

  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold text-slate-900">Ajouter une catégorie</h3>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="input-field"
          placeholder="Identifiant (ex. massage)"
          maxLength={40}
        />
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="input-field"
          placeholder="Libellé (ex. Massage & bien-être)"
          maxLength={60}
        />
        <input
          value={short}
          onChange={(e) => setShort(e.target.value)}
          className="input-field"
          placeholder="Libellé court (ex. Massage)"
          maxLength={30}
        />
        <div className="flex items-center gap-2">
          <input
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
            className="input-field w-20 text-center"
            placeholder="🏠"
            maxLength={8}
          />
          <button
            type="button"
            onClick={submit}
            disabled={isPending}
            className="btn-primary flex-1 px-4 py-2.5 text-sm"
          >
            {isPending ? "…" : "Ajouter"}
          </button>
        </div>
      </div>
      {feedback && (
        <p
          className={`mt-3 text-xs font-medium ${
            feedback.type === "error" ? "text-rose-600" : "text-emerald-600"
          }`}
        >
          {feedback.text}
        </p>
      )}
    </div>
  );
}

function CategoryRow({
  category,
  usage,
  index,
  total,
}: {
  category: ServiceCategory;
  usage: number;
  index: number;
  total: number;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(category.label);
  const [short, setShort] = useState(category.short);
  const [emoji, setEmoji] = useState(category.emoji);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const isDefault = category.id === DEFAULT_CATEGORY;

  const save = async () => {
    if (!label.trim() || !short.trim()) {
      setFeedback({
        type: "error",
        text: "Renseignez le libellé et le libellé court.",
      });
      return;
    }
    const formData = new FormData();
    formData.set("id", category.id);
    formData.set("label", label.trim());
    formData.set("short", short.trim());
    formData.set("emoji", emoji.trim() || "✨");
    const result = await updateCategory(null, formData);
    if (result && "error" in result) {
      setFeedback({ type: "error", text: result.error });
      return;
    }
    setIsEditing(false);
    setFeedback({ type: "success", text: "Catégorie mise à jour." });
    startTransition(() => router.refresh());
  };

  const handleMove = async (dir: "up" | "down") => {
    const formData = new FormData();
    formData.set("id", category.id);
    formData.set("dir", dir);
    const result = await moveCategory(null, formData);
    if (result && "error" in result) {
      setFeedback({ type: "error", text: result.error });
      return;
    }
    startTransition(() => router.refresh());
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Supprimer cette catégorie ? Les offres associées seront réaffectées à « Autre »."
      )
    ) {
      return;
    }
    const formData = new FormData();
    formData.set("id", category.id);
    const result = await deleteCategory(null, formData);
    if (result && "error" in result) {
      setFeedback({ type: "error", text: result.error });
      return;
    }
    startTransition(() => router.refresh());
  };

  const moveButtonClass =
    "flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30";

  return (
    <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 last:border-b-0 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="text-2xl" aria-hidden>
          {category.emoji}
        </span>
        <div className="min-w-0">
          {isEditing ? (
            <div className="flex flex-wrap items-center gap-2">
              <input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="input-field min-w-0 flex-1 py-1.5 text-sm"
                maxLength={60}
              />
              <input
                value={short}
                onChange={(e) => setShort(e.target.value)}
                className="input-field w-32 py-1.5 text-sm"
                maxLength={30}
              />
              <input
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                className="input-field w-12 py-1.5 text-center text-sm"
                maxLength={8}
              />
              <button
                type="button"
                onClick={save}
                disabled={isPending}
                className="btn-primary px-3 py-1.5 text-xs"
              >
                {isPending ? "…" : "Enregistrer"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setLabel(category.label);
                  setShort(category.short);
                  setEmoji(category.emoji);
                  setIsEditing(false);
                }}
                className="btn-secondary px-3 py-1.5 text-xs"
              >
                Annuler
              </button>
            </div>
          ) : (
            <>
              <p className="truncate text-sm font-semibold text-slate-900">
                {category.label}
                {isDefault && (
                  <span className="ml-2 rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-semibold text-primary-700">
                    Défaut
                  </span>
                )}
              </p>
              <p className="truncate text-xs text-slate-400">
                {category.short} · <span className="font-mono">{category.id}</span> ·{" "}
                {usage} offre{usage === 1 ? "" : "s"}
              </p>
            </>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <button
          type="button"
          onClick={() => handleMove("up")}
          disabled={isPending || index === 0}
          className={moveButtonClass}
          title="Monter"
        >
          ↑
        </button>
        <button
          type="button"
          onClick={() => handleMove("down")}
          disabled={isPending || index === total - 1}
          className={moveButtonClass}
          title="Descendre"
        >
          ↓
        </button>
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          disabled={isPending}
          className="btn-secondary px-3 py-1.5 text-xs"
        >
          Modifier
        </button>
        {!isDefault && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="btn-danger px-3 py-1.5 text-xs"
          >
            Supprimer
          </button>
        )}
      </div>

      {feedback && (
        <p
          className={`text-xs font-medium ${
            feedback.type === "error" ? "text-rose-600" : "text-emerald-600"
          }`}
        >
          {feedback.text}
        </p>
      )}
    </div>
  );
}

export default function CategoriesManager({
  categories,
  usage,
}: {
  categories: ServiceCategory[];
  usage: Record<string, number>;
}) {
  const total = categories.length;
  const usedCategories = categories.filter((c) => (usage[c.id] ?? 0) > 0).length;
  const totalJobs = Object.values(usage).reduce((sum, n) => sum + n, 0);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[
          { label: "Catégories", value: total, tone: "text-slate-900" },
          { label: "Catégories utilisées", value: usedCategories, tone: "text-primary-600" },
          { label: "Offres publiées", value: totalJobs, tone: "text-emerald-600" },
        ].map((stat) => (
          <div key={stat.label} className="card p-4">
            <p className={`text-2xl font-bold tracking-tight ${stat.tone}`}>{stat.value}</p>
            <p className="mt-1 text-xs font-medium text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <AddCategoryForm />

      <div className="card-table">
        <div className="flex items-center justify-between border-b border-slate-200/70 bg-slate-50/60 px-5 py-3">
          <p className="text-sm font-semibold text-slate-700">
            Liste des catégories
          </p>
          <p className="text-xs text-slate-400">
            {total} au total, ordonnées par affichage
          </p>
        </div>
        {categories.length === 0 && (
          <p className="px-5 py-10 text-center text-sm text-slate-400">
            Aucune catégorie. Ajoutez-en une ci-dessus.
          </p>
        )}
        {categories.map((category, index) => (
          <CategoryRow
            key={category.id}
            category={category}
            usage={usage[category.id] ?? 0}
            index={index}
            total={total}
          />
        ))}
      </div>
    </div>
  );
}