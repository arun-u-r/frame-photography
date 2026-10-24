"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setPending(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-3xl border border-white/10 bg-[#171719] p-8 shadow-2xl shadow-black/40">
      <div>
        <p className="text-xs uppercase tracking-[0.38em] text-[#B89B70]">secure access</p>
        <h1 className="mt-4 text-3xl font-medium text-[#E9E4DA]">Admin sign in</h1>
      </div>

      <label className="block space-y-2 text-sm text-[#E9E4DA]">
        <span>Email</span>
        <input
          name="email"
          type="email"
          required
          className="w-full rounded-full border border-white/10 bg-[#0B0B0D] px-4 py-3 text-[#E9E4DA] outline-none transition focus:border-[#B89B70]"
          placeholder="admin@frame.studio"
        />
      </label>

      <label className="block space-y-2 text-sm text-[#E9E4DA]">
        <span>Password</span>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          className="w-full rounded-full border border-white/10 bg-[#0B0B0D] px-4 py-3 text-[#E9E4DA] outline-none transition focus:border-[#B89B70]"
          placeholder="••••••••"
        />
      </label>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-[#B89B70] px-5 py-3 text-sm font-medium uppercase tracking-[0.24em] text-[#0B0B0D] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
