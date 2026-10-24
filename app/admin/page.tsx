import { redirect } from "next/navigation";
import { auth } from "@/src/auth";
import { getStorageMode } from "@/src/lib/config";
import { getPhotos } from "@/src/lib/gallery";
import { AdminPhotoManager } from "@/src/components/AdminPhotoManager";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  const photos = await getPhotos();
  const storageMode = getStorageMode();

  return <AdminPhotoManager initialPhotos={photos} storageMode={storageMode} />;
}
