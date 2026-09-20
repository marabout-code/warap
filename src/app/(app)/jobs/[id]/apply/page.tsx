"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Job, Profile } from "@/types";
import { documentTypeOptions } from "@/lib/status-labels";

interface DraftDocument {
  name: string;
  type: string;
  file: File | null;
  url?: string;
  uploading?: boolean;
}

export default function ApplyPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [documents, setDocuments] = useState<DraftDocument[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      const { data: jobData } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", jobId)
        .single();

      setProfile(profileData);
      setJob(jobData);
      setContactPhone(profileData?.phone ?? "");

      const { data: existing } = await supabase
        .from("applications")
        .select("id")
        .eq("job_id", jobId)
        .eq("user_id", user.id)
        .maybeSingle();

      setAlreadyApplied(!!existing);
      setLoading(false);
    };
    load();
  }, [jobId, router, supabase]);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const next: DraftDocument[] = [];
    for (const file of Array.from(files)) {
      if (file.size > 10 * 1024 * 1024) {
        setError(`« ${file.name} » dépasse la limite de 10 Mo.`);
        continue;
      }
      next.push({ name: file.name, type: "autre", file });
    }
    if (next.length > 0) {
      setError(null);
      setDocuments((prev) => [...prev, ...next]);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeDocument = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const setDocType = (index: number, type: string) => {
    setDocuments((prev) => prev.map((d, i) => (i === index ? { ...d, type } : d)));
  };

  // Preview the file: if the user gave an explicit label use it, else file name.
  const getDocLabel = (d: DraftDocument) =>
    documentTypeOptions.find((o) => o.value === d.type)?.label ?? d.type;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const owned = documents.filter((d) => d.file);
    if (owned.length > 0) {
      setSubmitting(true);
      const uploaded = await Promise.all(
        owned.map(async (d) => {
          const cleaned = d.file!.name.replace(/[^\w.\-]/g, "_");
          const path = `${user.id}/${Date.now()}-${cleaned}`;
          const { error } = await supabase.storage
            .from("documents")
            .upload(path, d.file!, { cacheControl: "3600", upsert: false });
          if (error) throw new Error(error.message);
          const { data } = supabase.storage.from("documents").getPublicUrl(path);
          return { name: d.name || getDocLabel(d), type: d.type, url: data.publicUrl };
        })
      );

      try {
        const finalDocs = [
          ...documents.filter((d) => d.url).map((d) => ({ name: d.name, type: d.type, url: d.url as string })),
          ...uploaded,
        ];

        const { error: insertError } = await supabase.from("applications").insert({
          job_id: jobId,
          user_id: user.id,
          cover_letter: coverLetter.trim() || null,
          contact_phone: contactPhone.trim() || null,
          documents: finalDocs,
        });

        if (insertError) throw new Error(insertError.message);
        router.push("/applications");
        router.refresh();
      } catch (err) {
        setError(
          err instanceof Error && err.message.includes("duplicate")
            ? "Vous avez déjà répondu à cette offre."
            : "Une erreur est survenue pendant l'envoi. Veuillez réessayer."
        );
        setSubmitting(false);
      }
    } else {
      setSubmitting(true);
      try {
        const finalDocs = documents
          .filter((d) => d.url)
          .map((d) => ({ name: d.name, type: d.type, url: d.url as string }));
        const { error: insertError } = await supabase.from("applications").insert({
          job_id: jobId,
          user_id: user.id,
          cover_letter: coverLetter.trim() || null,
          contact_phone: contactPhone.trim() || null,
          documents: finalDocs,
        });
        if (insertError) throw new Error(insertError.message);
        router.push("/applications");
        router.refresh();
      } catch (err) {
        setError(
          err instanceof Error && err.message.includes("duplicate")
            ? "Vous avez déjà répondu à cette offre."
            : "Une erreur est survenue pendant l'envoi. Veuillez réessayer."
        );
        setSubmitting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="skeleton h-16 rounded-2xl" />
        <div className="skeleton h-80 rounded-2xl" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm font-semibold text-slate-700">Offre introuvable</p>
        <Link href="/annonces" className="btn-primary mt-4">
          Voir les offres
        </Link>
      </div>
    );
  }

  if (profile && profile.role !== "jobseeker") {
    return (
      <div className="mx-auto max-w-lg">
        <div className="card text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient-soft">
            <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h1 className="mt-4 text-lg font-bold text-slate-900">
            Réservé aux prestataires
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Ce formulaire permet de répondre à une offre de service au
            Cameroun. Consultez les réponses reçues depuis votre espace.
          </p>
          <Link href="/jobs" className="btn-primary mt-5">
            Retour aux offres
          </Link>
        </div>
      </div>
    );
  }

  if (alreadyApplied) {
    return (
      <div className="mx-auto max-w-lg">
        <div className="card text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
            <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <h1 className="mt-4 text-lg font-bold text-slate-900">
            Réponse déjà envoyée
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Vous avez déjà répondu à cette offre. Vous pouvez suivre son statut
            depuis votre espace prestataire.
          </p>
          <Link href="/applications" className="btn-primary mt-5">
            Voir mes réponses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link
          href={`/annonces/${job.id}`}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:border-slate-300 hover:text-slate-700"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div>
          <p className="eyebrow">Candidature</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            {job.title}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {job.company} &middot; {job.location}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Motivation */}
        <div className="card">
          <h2 className="text-base font-bold tracking-tight text-slate-900">
            Votre motivation
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Présentez-vous brièvement : expérience, disponibilité, quartier.
          </p>
          <textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            rows={5}
            placeholder="Ex. Aide à domicile expérimentée à Douala Bonapriso, disponible immédiatement, références vérifiables…"
            className="input-field mt-4 resize-y"
          />
          <div className="mt-4">
            <label htmlFor="contact-phone" className="input-label">
              Numéro WhatsApp du prestataire
            </label>
            <input
              id="contact-phone"
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="+237 6XX XX XX XX"
              className="input-field"
            />
            <p className="mt-1.5 text-xs text-slate-400">
              Utilisé par le client pour vous contacter directement.
            </p>
          </div>
        </div>

        {/* Documents */}
        <div className="card">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold tracking-tight text-slate-900">
                Pièces du dossier
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Ajoutez vos documents (PDF, photos). Ils seront vérifiés en
                personne par un agent local.
              </p>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn-secondary !px-3.5 !py-2"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Ajouter
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="application/pdf,image/*"
              className="hidden"
              onChange={(e) => addFiles(e.target.files)}
            />
          </div>

          {documents.length === 0 ? (
            <div className="mt-5 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-8 text-center">
              <svg className="mx-auto h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <p className="mt-3 text-sm font-semibold text-slate-600">
                Aucune pièce pour le moment
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Recommandé : CNI, CV, certificat médical, références, permis.
              </p>
            </div>
          ) : (
            <ul className="mt-5 space-y-2.5">
              {documents.map((doc, index) => (
                <li
                  key={index}
                  className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 sm:flex-row sm:items-center"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                      <svg className="h-4 w-4 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {doc.file ? doc.file.name : doc.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {doc.file
                          ? `${(doc.file.size / 1024 / 1024).toFixed(2)} Mo`
                          : getDocLabel(doc)}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <select
                      value={doc.type}
                      onChange={(e) => setDocType(index, e.target.value)}
                      className="select-field !py-1.5 text-xs"
                    >
                      {documentTypeOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => removeDocument(index)}
                      className="rounded-lg p-2 text-rose-500 transition-colors hover:bg-rose-50"
                      title="Retirer"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-400">
            En envoyant, vous acceptez d&apos;être contacté(e) par le client via
            WhatsApp. Vos pièces sont partagées avec le client et l&apos;agent
            vérificateur.
          </p>
          <button type="submit" disabled={submitting} className="btn-accent !px-6">
            {submitting ? (
              <>
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Envoi en cours…
              </>
            ) : (
              "Envoyer ma réponse"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}