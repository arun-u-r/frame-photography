import { ContactForm } from "@/src/components/ContactForm";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#0B0B0D] px-6 py-16 text-[#E9E4DA] lg:px-10">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.36em] text-[#B89B70]">Contact</p>
          <h1 className="text-5xl tracking-[-0.06em] text-[#E9E4DA]">Commission a visual story.</h1>
          <p className="text-base leading-8 text-[#92908B]">
            Share your brief, timeline and ideal mood. We’ll respond with availability, next steps, and a tailored approach to your project.
          </p>
        </div>
        <ContactForm />
      </div>
    </main>
  );
}
