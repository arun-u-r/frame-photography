export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0B0B0D] px-6 py-16 text-[#E9E4DA] lg:px-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <p className="text-xs uppercase tracking-[0.36em] text-[#B89B70]">About</p>
        <h1 className="text-5xl tracking-[-0.06em] text-[#E9E4DA]">Photographing atmosphere, not just moments.</h1>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-[32px] border border-white/10 bg-[#171719] p-8 text-base leading-8 text-[#92908B]">
            FRAME is a visual practice devoted to slower, more attentive photography. The work sits between editorial portraiture, documentary travel and atmospheric commercial imagery — shaped by careful light, tactility and a sense of place.
          </div>
          <div className="rounded-[32px] border border-white/10 bg-[#171719] p-8 text-base leading-8 text-[#92908B]">
            Based between London and Copenhagen, the studio collaborates with brands, publications and private clients to make imagery that feels grounded, cinematic and quietly memorable.
          </div>
        </div>
      </div>
    </main>
  );
}
