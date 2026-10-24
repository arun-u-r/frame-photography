import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPhotos } from "@/src/lib/gallery";

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const photos = await getPhotos();
  const collectionPhotos = photos.filter((photo) => photo.category.toLowerCase() === slug.toLowerCase());

  if (!collectionPhotos.length) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#0B0B0D] px-6 py-16 text-[#E9E4DA] lg:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <Link href="/gallery" className="inline-block text-xs uppercase tracking-[0.32em] text-[#B89B70]">Collections</Link>
        <h1 className="text-5xl tracking-[-0.06em] text-[#E9E4DA]">{slug}</h1>
        <div className="grid gap-5 md:grid-cols-2">
          {collectionPhotos.map((photo) => (
            <div key={photo._id} className="overflow-hidden rounded-[30px] border border-white/10 bg-[#171719]">
              <div className="relative h-[340px]">
                <Image src={photo.imageUrl} alt={photo.alt} fill className="object-cover" />
              </div>
              <div className="p-5">
                <h2 className="text-2xl text-[#E9E4DA]">{photo.title}</h2>
                <p className="mt-3 text-sm leading-6 text-[#92908B]">{photo.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
