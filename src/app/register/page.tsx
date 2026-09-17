"use client";

import { useState } from "react";
import Link from "next/link";
import PinInput from "@/components/pin-input";
import AuthShell from "@/components/auth-shell";
import { registerUser } from "@/lib/actions/auth";

export default function RegisterPage() {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const isFormValid = pin.length === 6 && confirmPin.length === 6 && pin === confirmPin;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("pin", pin);
    formData.set("confirmPin", confirmPin);
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
              Création du compte...
            </>
          ) : (
            "Créer le compte"
          )}
        </button>
      </form>
    </AuthShell>
  );
}