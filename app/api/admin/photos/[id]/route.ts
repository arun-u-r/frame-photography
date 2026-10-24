import { NextResponse } from "next/server";
import { z } from "zod";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@/src/auth";
import { getStorageMode } from "@/src/lib/config";
import { deletePhoto, getPhotoById, updatePhoto } from "@/src/lib/photo-store";
import { slugify } from "@/src/lib/utils";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const photoSchema = z.object({
  title: z.string().trim().min(2).max(120).optional(),
  description: z.string().trim().min(10).max(2000).optional(),
  category: z.enum(["Editorial", "Portrait", "Travel", "Commercial", "Fine Art"]).optional(),
  alt: z.string().trim().min(2).max(200).optional().or(z.literal("")),
  tags: z.string().optional().or(z.literal("")),
  location: z.string().trim().max(200).optional().or(z.literal("")),
  camera: z.string().trim().max(200).optional().or(z.literal("")),
  capturedAt: z.string().trim().max(40).optional().or(z.literal("")),
  featured: z.string().optional().or(z.literal("")),
});

async function uploadReplacement(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed.");
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Image files must be 10MB or smaller.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  return new Promise<any>((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      {
        folder: "frame-archive",
        resource_type: "image",
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      },
      (error, result) => {
        if (error || !result) {
          reject(new Error(error?.message ?? "Image replacement failed."));
          return;
        }

        resolve(result);
      },
    );

    upload.end(buffer);
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (getStorageMode() !== "cloud") {
    return NextResponse.json({ error: "Cloud mode is required for updates." }, { status: 400 });
  }

  try {
    const { id } = await params;
    const formData = await request.formData();
    const fileValue = formData.get("file");
    const rawBody = {
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      category: String(formData.get("category") ?? ""),
      alt: String(formData.get("alt") ?? ""),
      tags: String(formData.get("tags") ?? ""),
      location: String(formData.get("location") ?? ""),
      camera: String(formData.get("camera") ?? ""),
      capturedAt: String(formData.get("capturedAt") ?? ""),
      featured: String(formData.get("featured") ?? "false"),
    };

    const parsed = photoSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json({ error: "Insufficient or invalid metadata for the update." }, { status: 400 });
    }

    const updates: any = {
      title: parsed.data.title,
      description: parsed.data.description,
      category: parsed.data.category,
      alt: parsed.data.alt || undefined,
      tags: parsed.data.tags ? parsed.data.tags.split(",").map((tag) => tag.trim()).filter(Boolean) : undefined,
      location: parsed.data.location || undefined,
      camera: parsed.data.camera || undefined,
      capturedAt: parsed.data.capturedAt || undefined,
      featured: parsed.data.featured === "true",
    };

    let uploaded: any;

    if (parsed.data.title) {
      updates.slug = slugify(parsed.data.title);
    }

    if (fileValue instanceof File) {
      uploaded = await uploadReplacement(fileValue);
      updates.imageUrl = uploaded.secure_url;
      updates.publicId = uploaded.public_id;
    }

    const existing = await getPhotoById(id);
    if (!existing) {
      return NextResponse.json({ error: "Photo not found." }, { status: 404 });
    }

    const updated = await updatePhoto(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Photo not found." }, { status: 404 });
    }

    if (fileValue instanceof File && existing.publicId && existing.publicId !== uploaded?.public_id) {
      await cloudinary.uploader.destroy(existing.publicId).catch(() => undefined);
    }

    return NextResponse.json({ photo: updated });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update photograph." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (getStorageMode() !== "cloud") {
    return NextResponse.json({ error: "Cloud mode is required for deletion." }, { status: 400 });
  }

  try {
    const { id } = await params;
    const success = await deletePhoto(id);

    if (!success) {
      return NextResponse.json({ error: "Photo not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to delete photograph." },
      { status: 500 },
    );
  }
}
