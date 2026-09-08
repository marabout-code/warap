"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useForm } from "react-hook-form";
import { registerSchema, type RegisterInput } from "@/lib/validations";
import AuthShell from "@/components/auth-shell";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: async (data) => {
      try {
        const validated = await registerSchema.parseAsync(data);
        return { values: validated, errors: {} };
      } catch (err: any) {
        return { values: {}, errors: err.formErrors?.fieldErrors || {} };
      }
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle={
        <>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary-600 transition-colors hover:text-primary-500"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        {error && (
          <div className="animate-fade-in rounded-xl border border-rose-200/70 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="fullName" className="input-label">
            Full name
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
              {...register("fullName")}
              type="text"
              autoComplete="name"
              className="input-field pl-11"
              placeholder="John Doe"
            />
          </div>
          {errors.fullName && (
            <p className="form-error">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="input-label">
            Email address
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
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
            <input
              {...register("email")}
              type="email"
              autoComplete="email"
              className="input-field pl-11"
              placeholder="you@example.com"
            />
          </div>
          {errors.email && <p className="form-error">{errors.email.message}</p>}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="password" className="input-label">
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              autoComplete="new-password"
              className="input-field"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="form-error">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="input-label">
              Confirm password
            </label>
            <input
              {...register("confirmPassword")}
              type="password"
              autoComplete="new-password"
              className="input-field"
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="form-error">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full py-3">
          {loading ? (
            <>
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </button>
      </form>
    </AuthShell>
  );
}