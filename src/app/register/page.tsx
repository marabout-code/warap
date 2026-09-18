"use client";

import { useState } from "react";
import Link from "next/link";
import PinInput from "@/components/pin-input";
import AuthShell from "@/components/auth-shell";
import { registerUser } from "@/lib/actions/auth";

type RegisterRole = "employer" | "jobseeker" | "agent";

const ROLE_OPTIONS: {
  role: RegisterRole;
  title: string;
  description: string;
  icon: string;
}[] = [
  {
    role: "employer",
    title: "Famille employeuse",
    description: "Je recrute depuis la diaspora un personnel de maison vérifié au Cameroun.",
    icon: "M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25",
  },
  {
    role: "jobseeker",
    title: "Candidat",
    description: "Je suis au Cameroun et je postule aux annonces de ma ville.",
    icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z",
  },
  {
    role: "agent",
    title: "Agent vérificateur",
    description: "Je mène les vérifications terrain pour le compte des familles.",
    icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
  },
];

export default function RegisterPage() {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [role, setRole] = useState<RegisterRole | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const isFormValid = role && pin.length === 6 && confirmPin.length === 6 && pin === confirmPin;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!role) {
      setError("Choisissez votre profil avant de continuer.");
      return;
    }
    const formData = new FormData(e.currentTarget);
    formData.set("pin", pin);
    formData.set("confirmPin", confirmPin);
    formData.set("role", role);
    setIsPending(true);
    setError(null);

    const result = await registerUser(null, formData);
    if (result && "error" in result) {
      setError(result.error);
      setIsPending(false);
    }
  };

  return (
    <AuthShell
      title="Créer votre compte"
      subtitle={
        <>
          Vous avez déjà un compte ?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary-600 transition-colors hover:text-primary-500"
          >
            Se connecter
          </Link>
        </>
      }
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="animate-fade-in rounded-xl border border-rose-200/70 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="fullName" className="input-label">
            Nom complet
          </label>
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.8"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
            <input
              name="fullName"
              type="text"
              autoComplete="name"
              required
              className="input-field pl-11"
              placeholder="Aïcha Mbarga"
            />
          </div>
        </div>

        <div className="space-y-2.5">
          <label className="input-label">Vous êtes…</label>
          <div className="grid gap-2.5">
            {ROLE_OPTIONS.map((option) => {
              const isSelected = role === option.role;
              return (
                <button
                  key={option.role}
                  type="button"
                  onClick={() => setRole(option.role)}
                  className={`flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all duration-200 ${
                    isSelected
                      ? "border-primary-500 bg-primary-50/70 shadow-sm ring-1 ring-primary-500/40"
                      : "border-slate-200 bg-white hover:border-primary-300 hover:bg-primary-50/40"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      isSelected
                        ? "bg-brand-gradient text-white shadow-glow"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d={option.icon} />
                    </svg>
                  </span>
                  <span className="min-w-0">
                    <span
                      className={`block text-sm font-semibold ${
                        isSelected ? "text-primary-800" : "text-slate-800"
                      }`}
                    >
                      {option.title}
                    </span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">
                      {option.description}
                    </span>
                  </span>
                  {isSelected && (
                    <svg
                      className="ml-auto mt-1 h-5 w-5 shrink-0 text-primary-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <label className="input-label block text-center">
            Définissez votre code PIN à 6 chiffres
          </label>
          <PinInput
            name="pin"
            value={pin}
            onChange={setPin}
            autoFocus
          />
        </div>

        <div className="space-y-3">
          <label className="input-label block text-center">
            Confirmez votre PIN
          </label>
          <PinInput
            name="confirmPin"
            value={confirmPin}
            onChange={setConfirmPin}
          />
          {pin && confirmPin && pin !== confirmPin && (
            <p className="text-center text-xs text-rose-500">Les PIN ne correspondent pas</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending || !isFormValid}
          className="btn-primary w-full py-3"
        >
          {isPending ? (
            <>
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Création du compte…
            </>
          ) : (
            "Créer le compte"
          )}
        </button>
      </form>
    </AuthShell>
  );
}