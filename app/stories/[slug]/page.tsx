import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPhotos } from "@/src/lib/gallery";

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const photos = await getPhotos();
  const photo = photos.find((entry) => entry.slug === slug) ?? photos[0];

  if (!photo) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#0B0B0D] px-6 py-16 text-[#E9E4DA] lg:px-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <Link href="/gallery" className="inline-block text-xs uppercase tracking-[0.32em] text-[#B89B70]">Back to gallery</Link>
        <h1 className="text-5xl tracking-[-0.06em] text-[#E9E4DA]">{photo.title}</h1>
        <div className="relative h-[480px] overflow-hidden rounded-[32px] border border-white/10 bg-[#171719]">
          <Image src={photo.imageUrl} alt={photo.alt} fill className="object-cover" />
        </div>
        <p className="max-w-3xl text-lg leading-8 text-[#92908B]">{photo.description}</p>
      </div>
    </main>
  );
}
