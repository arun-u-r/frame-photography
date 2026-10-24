import { AdminLoginForm } from "@/src/components/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-[#0B0B0D] px-6 py-20 text-[#E9E4DA]">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div className="space-y-6 self-center">
          <p className="text-xs uppercase tracking-[0.36em] text-[#B89B70]">FRAME Admin</p>
          <h1 className="text-5xl tracking-[-0.06em] text-[#E9E4DA]">Secure access to the archive.</h1>
          <p className="max-w-lg text-base leading-8 text-[#92908B]">
            This dashboard is reserved for the authorised administrator. Use the configured studio email address and password to continue.
          </p>
        </div>
        <AdminLoginForm />
      </div>
    </main>
  );
}
