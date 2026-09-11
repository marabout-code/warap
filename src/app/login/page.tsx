"use client";

import { useState } from "react";
import Link from "next/link";
import PinInput from "@/components/pin-input";
import AuthShell from "@/components/auth-shell";
import { loginUser } from "@/lib/actions/auth";

export default function LoginPage() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("pin", pin);
    setIsPending(true);
    setError(null);

    const result = await loginUser(null, formData);
    if (result && "error" in result) {
      setError(result.error);
      setIsPending(false);
    }
  };

  return (
    <AuthShell
      title="Bon retour"
      subtitle={
        <>
          Nouveau sur JobCenter ?{" "}
          <Link
            href="/register"
            className="font-semibold text-primary-600 transition-colors hover:text-primary-500"
          >
            Créer un compte
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

        <div className="space-y-3">
          <label className="input-label block text-center">
            Saisissez votre code PIN à 6 chiffres
          </label>
          <PinInput
            name="pin"
            value={pin}
            onChange={setPin}
            autoFocus
          />
        </div>

        <button
          type="submit"
          disabled={isPending || pin.length !== 6}
          className="btn-primary w-full py-3"
        >
          {isPending ? (
            <>
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Connexion en cours...
            </>
          ) : (
            "Se connecter avec le PIN"
          )}
        </button>
      </form>
    </AuthShell>
  );
}