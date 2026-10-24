"use client";

import { useState } from "react";
import type { Photo, PhotoCategory, PhotoStorageMode } from "@/src/lib/types";

const defaultFormState = {
  title: "",
  description: "",
  category: "Editorial" as PhotoCategory,
  alt: "",
  tags: "",
  location: "",
  camera: "",
  capturedAt: "",
  featured: false,
  file: null as File | null,
};

type Props = {
  initialPhotos: Photo[];
  storageMode: PhotoStorageMode;
};

export function AdminPhotoManager({ initialPhotos, storageMode }: Props) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [status, setStatus] = useState<{ type: "idle" | "error" | "success"; message: string }>({
    type: "idle",
    message: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState(defaultFormState);

  const isCloudMode = storageMode === "cloud";

  const stats = [
    ["Total images", String(photos.length)],
    ["Featured", String(photos.filter((photo) => photo.featured).length)],
    ["Categories", String(new Set(photos.map((photo) => photo.category)).size)],
    ["Storage", storageMode.toUpperCase()],
  ];

  function resetForm() {
    setFormState(defaultFormState);
    setEditingId(null);
  }

  function updateField<K extends keyof typeof defaultFormState>(key: K, value: (typeof defaultFormState)[K]) {
    setFormState((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isCloudMode) {
      setStatus({ type: "error", message: "Cloud mode is required for upload and metadata edits." });
      return;
    }

    const formData = new FormData();
    formData.append("title", formState.title);
    formData.append("description", formState.description);
    formData.append("category", formState.category);
    formData.append("alt", formState.alt || formState.title);
    formData.append("tags", formState.tags);
    formData.append("location", formState.location);
    formData.append("camera", formState.camera);
    formData.append("capturedAt", formState.capturedAt);
    formData.append("featured", String(formState.featured));

    if (formState.file) {
      formData.append("file", formState.file);
    }

    const url = editingId ? `/api/admin/photos/${editingId}` : "/api/admin/photos";
    const response = await fetch(url, {
      method: editingId ? "PATCH" : "POST",
      body: formData,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      setStatus({ type: "error", message: data.error ?? "The photo could not be saved." });
      return;
    }

    const nextPhoto = data.photo as Photo;
    setPhotos((current) => {
      if (editingId) {
        return current.map((photo) => (photo._id === editingId ? nextPhoto : photo));
      }
      return [nextPhoto, ...current];
    });

    resetForm();
    setStatus({ type: "success", message: editingId ? "Photo updated." : "Photo created." });
  }

  async function handleDelete(photoId: string) {
    if (!isCloudMode) {
      setStatus({ type: "error", message: "Cloud mode is required to delete uploaded images." });
      return;
    }

    const response = await fetch(`/api/admin/photos/${photoId}`, {
      method: "DELETE",
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      setStatus({ type: "error", message: data.error ?? "Delete failed." });
      return;
    }

    setPhotos((current) => current.filter((photo) => photo._id !== photoId));
    setStatus({ type: "success", message: "Photo removed from the archive." });
  }

  return (
    <main className="min-h-screen bg-[#0B0B0D] px-6 py-16 text-[#E9E4DA] lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.36em] text-[#B89B70]">Dashboard</p>
            <h1 className="mt-3 text-4xl text-[#E9E4DA]">Archive overview</h1>
          </div>
          <form action="/api/auth/signout" method="post">
            <button type="submit" className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.24em] text-[#E9E4DA]">
              Sign out
            </button>
          </form>
        </div>

        <div className="grid gap-5 md:grid-cols-4">
          {stats.map(([label, value]) => (
            <div key={label} className="rounded-[28px] border border-white/10 bg-[#171719] p-5">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#B89B70]">{label}</p>
              <p className="mt-4 text-3xl text-[#E9E4DA]">{value}</p>
            </div>
          ))}
        </div>

        {!isCloudMode ? (
          <div className="rounded-[28px] border border-[#B89B70]/30 bg-[#171719] p-5 text-sm text-[#E9E4DA]">
            Local mode is active. Starter photographs are being served from the public gallery and can be browsed without database or Cloudinary credentials.
          </div>
        ) : null}

        <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
          <form onSubmit={handleSubmit} className="space-y-5 rounded-[30px] border border-white/10 bg-[#171719] p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl text-[#E9E4DA]">{editingId ? "Edit photo" : "Add photo"}</h2>
              {editingId ? (
                <button type="button" onClick={resetForm} className="text-xs uppercase tracking-[0.24em] text-[#B89B70]">
                  Cancel
                </button>
              ) : null}
            </div>

            <label className="block space-y-2 text-sm text-[#E9E4DA]">
              <span>Title</span>
              <input
                value={formState.title}
                onChange={(event) => updateField("title", event.target.value)}
                className="w-full rounded-full border border-white/10 bg-[#0B0B0D] px-4 py-3 text-[#E9E4DA] outline-none focus:border-[#B89B70]"
                required={isCloudMode}
              />
            </label>

            <label className="block space-y-2 text-sm text-[#E9E4DA]">
              <span>Description</span>
              <textarea
                value={formState.description}
                onChange={(event) => updateField("description", event.target.value)}
                className="min-h-24 w-full rounded-[24px] border border-white/10 bg-[#0B0B0D] px-4 py-3 text-[#E9E4DA] outline-none focus:border-[#B89B70]"
                required={isCloudMode}
              />
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block space-y-2 text-sm text-[#E9E4DA]">
                <span>Category</span>
                <select
                  value={formState.category}
                  onChange={(event) => updateField("category", event.target.value as PhotoCategory)}
                  className="w-full rounded-full border border-white/10 bg-[#0B0B0D] px-4 py-3 text-[#E9E4DA] outline-none focus:border-[#B89B70]"
                >
                  <option>Editorial</option>
                  <option>Portrait</option>
                  <option>Travel</option>
                  <option>Commercial</option>
                  <option>Fine Art</option>
                </select>
              </label>

              <label className="block space-y-2 text-sm text-[#E9E4DA]">
                <span>Location</span>
                <input
                  value={formState.location}
                  onChange={(event) => updateField("location", event.target.value)}
                  className="w-full rounded-full border border-white/10 bg-[#0B0B0D] px-4 py-3 text-[#E9E4DA] outline-none focus:border-[#B89B70]"
                />
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block space-y-2 text-sm text-[#E9E4DA]">
                <span>Camera</span>
                <input
                  value={formState.camera}
                  onChange={(event) => updateField("camera", event.target.value)}
                  className="w-full rounded-full border border-white/10 bg-[#0B0B0D] px-4 py-3 text-[#E9E4DA] outline-none focus:border-[#B89B70]"
                />
              </label>

              <label className="block space-y-2 text-sm text-[#E9E4DA]">
                <span>Captured</span>
                <input
                  type="date"
                  value={formState.capturedAt}
                  onChange={(event) => updateField("capturedAt", event.target.value)}
                  className="w-full rounded-full border border-white/10 bg-[#0B0B0D] px-4 py-3 text-[#E9E4DA] outline-none focus:border-[#B89B70]"
                />
              </label>
            </div>

            <label className="block space-y-2 text-sm text-[#E9E4DA]">
              <span>Alt text</span>
              <input
                value={formState.alt}
                onChange={(event) => updateField("alt", event.target.value)}
                className="w-full rounded-full border border-white/10 bg-[#0B0B0D] px-4 py-3 text-[#E9E4DA] outline-none focus:border-[#B89B70]"
              />
            </label>

            <label className="block space-y-2 text-sm text-[#E9E4DA]">
              <span>Tags</span>
              <input
                value={formState.tags}
                onChange={(event) => updateField("tags", event.target.value)}
                className="w-full rounded-full border border-white/10 bg-[#0B0B0D] px-4 py-3 text-[#E9E4DA] outline-none focus:border-[#B89B70]"
                placeholder="editorial, portrait, travel"
              />
            </label>

            <label className="block w-full cursor-pointer rounded-3xl border border-dashed border-white/15 bg-[#0B0B0D] p-4 text-sm text-[#E9E4DA]">
              <span>Choose image file</span>
              <input
                type="file"
                accept="image/*"
                className="mt-3 block w-full text-xs text-[#92908B]"
                onChange={(event) => updateField("file", event.target.files?.[0] ?? null)}
              />
            </label>

            <label className="flex items-center gap-3 text-sm text-[#E9E4DA]">
              <input
                type="checkbox"
                checked={formState.featured}
                onChange={(event) => updateField("featured", event.target.checked)}
                className="h-4 w-4 rounded border-white/15 bg-[#0B0B0D]"
              />
              Featured in the homepage and story highlights
            </label>

            {status.message ? (
              <p className={status.type === "success" ? "text-sm text-emerald-400" : "text-sm text-red-400"}>{status.message}</p>
            ) : null}

            <button
              type="submit"
              disabled={!isCloudMode}
              className="w-full rounded-full bg-[#B89B70] px-5 py-3 text-sm font-medium uppercase tracking-[0.24em] text-[#0B0B0D] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {editingId ? "Update photo" : "Save photo"}
            </button>
          </form>

          <div className="space-y-5">
            {photos.length === 0 ? (
              <div className="rounded-[30px] border border-white/10 bg-[#171719] p-8 text-[#92908B]">
                No uploaded photographs yet.
              </div>
            ) : (
              photos.map((photo) => (
                <div key={photo._id} className="flex flex-col gap-4 rounded-[30px] border border-white/10 bg-[#171719] p-4 sm:flex-row">
                  <div className="relative h-36 w-full overflow-hidden rounded-[22px] bg-[#0B0B0D] sm:w-48">
                    <img src={photo.imageUrl} alt={photo.alt} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-[#B89B70]">{photo.category}</p>
                        <h3 className="mt-2 text-2xl text-[#E9E4DA]">{photo.title}</h3>
                      </div>
                      <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.24em] text-[#E9E4DA]">
                        {photo.featured ? "Featured" : "Archive"}
                      </span>
                    </div>
                    <p className="text-sm leading-6 text-[#92908B]">{photo.description}</p>
                    <div className="flex flex-wrap gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(photo._id);
                          setFormState({
                            title: photo.title,
                            description: photo.description,
                            category: photo.category,
                            alt: photo.alt,
                            tags: photo.tags.join(", "),
                            location: photo.location ?? "",
                            camera: photo.camera ?? "",
                            capturedAt: photo.capturedAt ?? "",
                            featured: photo.featured,
                            file: null,
                          });
                        }}
                        className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.24em] text-[#E9E4DA]"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(photo._id)}
                        className="rounded-full border border-red-500/40 px-4 py-2 text-xs uppercase tracking-[0.24em] text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
