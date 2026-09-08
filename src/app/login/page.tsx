"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginInput } from "@/lib/validations";
import AuthShell from "@/components/auth-shell";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: async (data) => {
      try {
        const validated = await loginSchema.parseAsync(data);
        return { values: validated, errors: {} };
      } catch (err: any) {
        return { values: {}, errors: err.formErrors?.fieldErrors || {} };
      }
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
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
      title="Welcome back"
      subtitle={
        <>
          New to JobCenter?{" "}
          <Link
            href="/register"
            className="font-semibold text-primary-600 transition-colors hover:text-primary-500"
          >
            Create an account
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

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="input-label">
              Password
            </label>
            <button
              type="button"
              className="mb-1.5 text-xs font-semibold text-primary-600 transition-colors hover:text-primary-500"
            >
              Forgot password?
            </button>
          </div>
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
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
            <input
              {...register("password")}
              type="password"
              autoComplete="current-password"
              className="input-field pl-11"
              placeholder="••••••••"
            />
          </div>
          {errors.password && (
            <p className="form-error">{errors.password.message}</p>
          )}
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full py-3">
          {loading ? (
            <>
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </button>
      </form>
    </AuthShell>
  );
}