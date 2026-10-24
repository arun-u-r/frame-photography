import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Camera, Sparkles } from "lucide-react";
import { getFeaturedPhotos, getPhotos } from "@/src/lib/gallery";

export default async function HomePage() {
  const photos = await getPhotos();
  const featurePhotos = (await getFeaturedPhotos()).slice(0, 3);

  return (
    <main className="min-h-screen bg-[#0B0B0D] text-[#E9E4DA]">
      <section className="relative isolate overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(184,155,112,0.35),_transparent_40%)]" />
        <div className="mx-auto grid max-w-7xl gap-10 px-6 pb-20 pt-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
          <div className="relative z-10 flex flex-col justify-between min-h-[70vh]">
            <nav className="flex items-center justify-between py-4 text-sm uppercase tracking-[0.28em] text-[#E9E4DA]/80">
              <div className="font-semibold text-[#E9E4DA]">FRAME</div>
              <div className="hidden items-center gap-6 md:flex">
                <Link href="/gallery">Gallery</Link>
                <Link href="/stories/near-silence">Stories</Link>
                <Link href="/about">About</Link>
                <Link href="/contact">Contact</Link>
              </div>
            </nav>

            <div className="max-w-xl space-y-8 pt-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#B89B70]/40 px-4 py-2 text-[10px] uppercase tracking-[0.34em] text-[#B89B70]">
                <Sparkles className="h-3.5 w-3.5" />
                Cinematic storytelling
              </div>
              <h1 className="text-5xl leading-none tracking-[-0.08em] text-[#E9E4DA] md:text-7xl">
                Images for the <span className="text-[#B89B70]">quiet</span> and the unforgettable.
              </h1>
              <p className="max-w-lg text-base leading-7 text-[#92908B] md:text-lg">
                FRAME is a contemporary photography studio creating thoughtful editorial, portrait and travel work across Europe and beyond.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/gallery" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#B89B70] px-6 py-3 text-sm font-medium uppercase tracking-[0.24em] text-[#0B0B0D]">
                  View gallery <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm uppercase tracking-[0.24em] text-[#E9E4DA]">
                  Enquire
                </Link>
              </div>
            </div>

            <div className="mt-12 flex items-center gap-8 text-sm text-[#92908B]">
              <div>
                <div className="text-2xl font-medium text-[#E9E4DA]">12+</div>
                <div>Years</div>
              </div>
              <div>
                <div className="text-2xl font-medium text-[#E9E4DA]">41</div>
                <div>Editorial commissions</div>
              </div>
              <div>
                <div className="text-2xl font-medium text-[#E9E4DA]">9</div>
                <div>Countries</div>
              </div>
            </div>
          </div>

          <div className="relative flex items-end justify-center">
            <div className="relative h-[620px] w-full max-w-[520px] overflow-hidden rounded-[32px] border border-white/10 bg-[#171719] shadow-2xl shadow-black/30">
              <Image
                src={photos[0]?.imageUrl ?? "/images/nocturne-coast.svg"}
                alt={photos[0]?.alt ?? "Featured FRAME photograph"}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#E9E4DA]/80">Featured work</p>
                <h2 className="mt-3 text-3xl font-medium text-[#E9E4DA]">{photos[0]?.title ?? "Nocturne Coast"}</h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.36em] text-[#B89B70]">Selected works</p>
            <h2 className="mt-3 text-4xl text-[#E9E4DA]">Recent commissions</h2>
          </div>
          <Link href="/gallery" className="hidden items-center gap-2 text-sm uppercase tracking-[0.25em] text-[#E9E4DA]/80 md:inline-flex">
            Explore all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {featurePhotos.map((photo, index) => (
            <article key={photo._id} className="group overflow-hidden rounded-[26px] border border-white/10 bg-[#171719]">
              <div className="relative h-96 overflow-hidden">
                <Image src={photo.imageUrl} alt={photo.alt} fill className="object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="space-y-3 p-5">
                <p className="text-[10px] uppercase tracking-[0.32em] text-[#B89B70]">{index + 1}. {photo.category}</p>
                <h3 className="text-2xl text-[#E9E4DA]">{photo.title}</h3>
                <p className="text-sm leading-6 text-[#92908B]">{photo.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.36em] text-[#B89B70]">Approach</p>
            <h2 className="text-4xl text-[#E9E4DA]">Quietly cinematic, always human.</h2>
            <p className="text-base leading-7 text-[#92908B]">
              FRAME blends location-led storytelling with careful portraiture, shaping images that feel intimate, atmospheric and distinctly editorial.
            </p>
            <div className="space-y-4 rounded-[28px] border border-white/10 bg-[#171719] p-6 text-sm text-[#E9E4DA]">
              <div className="flex items-center gap-3"><Camera className="h-5 w-5 text-[#B89B70]" /> <span>Editorial, portrait and travel commissions</span></div>
              <div className="flex items-center gap-3"><Sparkles className="h-5 w-5 text-[#B89B70]" /> <span>Creative direction and production support</span></div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              ["Editorial", "Long-form visual narratives built for culture, fashion and print."],
              ["Portrait", "Emotion-led portraiture shaped by atmosphere and gesture."],
              ["Travel", "Immersive stories of place, movement and architecture."],
            ].map(([title, text]) => (
              <div key={title} className="rounded-[28px] border border-white/10 bg-[#171719] p-5">
                <p className="text-[10px] uppercase tracking-[0.32em] text-[#B89B70]">{title}</p>
                <p className="mt-5 text-base leading-7 text-[#E9E4DA]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 pt-10 lg:px-10">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.36em] text-[#B89B70]">Frame journal</p>
          <Link href="/stories/near-silence" className="text-sm uppercase tracking-[0.25em] text-[#E9E4DA]/80">Read story</Link>
        </div>
        <div className="mt-8 grid gap-6 overflow-hidden rounded-[34px] border border-white/10 bg-[#171719] p-4 md:grid-cols-[1.2fr_0.8fr] md:p-6">
          <div className="relative h-[400px] overflow-hidden rounded-[30px]">
            <Image src={photos[1]?.imageUrl ?? "/images/desert-study.svg"} alt={photos[1]?.alt ?? "Travel story"} fill className="object-cover" />
          </div>
          <div className="flex flex-col justify-between p-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#B89B70]">Photo story</p>
              <h3 className="mt-4 text-3xl leading-tight text-[#E9E4DA]">Near Silence</h3>
            </div>
            <p className="mt-5 text-base leading-7 text-[#92908B]">
              A reflective editorial essay on stillness, destination and the soft architecture of migration.
            </p>
            <Link href="/stories/near-silence" className="mt-8 inline-flex items-center gap-2 text-sm uppercase tracking-[0.24em] text-[#E9E4DA]">
              Read more <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
