import Link from "next/link";
import Image from "next/image";
import { getPhotos } from "@/src/lib/gallery";

export default async function GalleryPage() {
  const photos = await getPhotos();

  return (
    <main className="min-h-screen bg-[#0B0B0D] px-6 py-16 text-[#E9E4DA] lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.36em] text-[#B89B70]">Archive</p>
            <h1 className="mt-3 text-5xl text-[#E9E4DA]">Gallery</h1>
          </div>
          <Link href="/" className="text-sm uppercase tracking-[0.25em] text-[#E9E4DA]/80">Back to home</Link>
        </div>

        <div className="mb-10 flex flex-wrap gap-3 text-xs uppercase tracking-[0.24em] text-[#E9E4DA]/80">
          {['All', 'Editorial', 'Portrait', 'Travel', 'Commercial', 'Fine Art'].map((category) => (
            <button key={category} className="rounded-full border border-white/10 bg-[#171719] px-4 py-2 transition hover:border-[#B89B70]">
              {category}
            </button>
          ))}
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {photos.map((photo) => (
            <article key={photo._id} className="group overflow-hidden rounded-[30px] border border-white/10 bg-[#171719]">
              <div className="relative h-[420px] overflow-hidden">
                <Image src={photo.imageUrl} alt={photo.alt} fill className="object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="space-y-3 p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#B89B70]">{photo.category}</p>
                  <span className="text-xs text-[#92908B]">{photo.location ?? "Global"}</span>
                </div>
                <h2 className="text-2xl text-[#E9E4DA]">{photo.title}</h2>
                <p className="text-sm leading-6 text-[#92908B]">{photo.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
