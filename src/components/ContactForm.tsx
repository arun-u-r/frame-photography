"use client";

import { useState } from "react";

const initialState = {
  name: "",
  email: "",
  projectType: "Editorial portraiture",
  preferredDate: "",
  budget: "",
  message: "",
};

export function ContactForm() {
  const [formState, setFormState] = useState(initialState);
  const [status, setStatus] = useState<{ type: "idle" | "loading" | "success" | "error"; message: string }>({
    type: "idle",
    message: "",
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ type: "loading", message: "Sending your enquiry..." });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error ?? "Unable to send your enquiry.");
      }

      setStatus({ type: "success", message: data.message ?? "Your enquiry has been received." });
      setFormState(initialState);
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Something went wrong. Please try again.",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-[28px] border border-white/10 bg-[#171719] p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="space-y-2 text-sm text-[#E9E4DA]">
          <span>Name</span>
          <input
            value={formState.name}
            onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))}
            className="w-full rounded-full border border-white/10 bg-[#0B0B0D] px-4 py-3 text-[#E9E4DA] outline-none transition focus:border-[#B89B70]"
            placeholder="Your name"
            required
          />
        </label>

        <label className="space-y-2 text-sm text-[#E9E4DA]">
          <span>Email</span>
          <input
            type="email"
            value={formState.email}
            onChange={(event) => setFormState((current) => ({ ...current, email: event.target.value }))}
            className="w-full rounded-full border border-white/10 bg-[#0B0B0D] px-4 py-3 text-[#E9E4DA] outline-none transition focus:border-[#B89B70]"
            placeholder="you@example.com"
            required
          />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="space-y-2 text-sm text-[#E9E4DA]">
          <span>Project type</span>
          <select
            value={formState.projectType}
            onChange={(event) => setFormState((current) => ({ ...current, projectType: event.target.value }))}
            className="w-full rounded-full border border-white/10 bg-[#0B0B0D] px-4 py-3 text-[#E9E4DA] outline-none transition focus:border-[#B89B70]"
          >
            <option>Editorial portraiture</option>
            <option>Commercial campaign</option>
            <option>Travel feature</option>
            <option>Brand storytelling</option>
            <option>Wedding / private commission</option>
          </select>
        </label>

        <label className="space-y-2 text-sm text-[#E9E4DA]">
          <span>Preferred date</span>
          <input
            type="date"
            value={formState.preferredDate}
            onChange={(event) => setFormState((current) => ({ ...current, preferredDate: event.target.value }))}
            className="w-full rounded-full border border-white/10 bg-[#0B0B0D] px-4 py-3 text-[#E9E4DA] outline-none transition focus:border-[#B89B70]"
          />
        </label>
      </div>

      <label className="block space-y-2 text-sm text-[#E9E4DA]">
        <span>Budget range</span>
        <input
          value={formState.budget}
          onChange={(event) => setFormState((current) => ({ ...current, budget: event.target.value }))}
          className="w-full rounded-full border border-white/10 bg-[#0B0B0D] px-4 py-3 text-[#E9E4DA] outline-none transition focus:border-[#B89B70]"
          placeholder="Optional budget"
        />
      </label>

      <label className="block space-y-2 text-sm text-[#E9E4DA]">
        <span>Message</span>
        <textarea
          value={formState.message}
          onChange={(event) => setFormState((current) => ({ ...current, message: event.target.value }))}
          className="min-h-32 w-full rounded-[24px] border border-white/10 bg-[#0B0B0D] px-4 py-3 text-[#E9E4DA] outline-none transition focus:border-[#B89B70]"
          placeholder="Tell us about your brief, location and atmosphere..."
          required
        />
      </label>

      {status.message ? (
        <p
          className={status.type === "success" ? "text-sm text-emerald-400" : status.type === "error" ? "text-sm text-red-400" : "text-sm text-[#E9E4DA]"}
        >
          {status.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status.type === "loading"}
        className="rounded-full bg-[#B89B70] px-5 py-3 text-sm font-medium uppercase tracking-[0.24em] text-[#0B0B0D] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status.type === "loading" ? "Sending..." : "Send enquiry"}
      </button>
    </form>
  );
}
