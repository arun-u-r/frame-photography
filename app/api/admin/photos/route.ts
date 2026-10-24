import { NextResponse } from "next/server";
import { z } from "zod";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@/src/auth";
import { getStorageMode } from "@/src/lib/config";
import { createPhoto, getPhotos } from "@/src/lib/photo-store";
import { slugify } from "@/src/lib/utils";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const photoSchema = z.object({
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().min(10).max(2000),
  category: z.enum(["Editorial", "Portrait", "Travel", "Commercial", "Fine Art"]),
  alt: z.string().trim().min(2).max(200).optional().or(z.literal("")),
  tags: z.string().optional().or(z.literal("")),
  location: z.string().trim().max(200).optional().or(z.literal("")),
  camera: z.string().trim().max(200).optional().or(z.literal("")),
  capturedAt: z.string().trim().max(40).optional().or(z.literal("")),
  featured: z.string().optional().or(z.literal("")),
});

async function uploadPhotoFile(file: File) {
  if (getStorageMode() !== "cloud") {
    throw new Error("Cloud mode is required to upload photographs.");
  }

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
          reject(new Error(error?.message ?? "Image upload failed."));
          return;
        }

        resolve(result);
      },
    );

    upload.end(buffer);
  });
}

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (getStorageMode() !== "cloud") {
    return NextResponse.json({ photos: [] });
  }

  try {
    const photos = await getPhotos();
    return NextResponse.json({ photos });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load photographs." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (getStorageMode() !== "cloud") {
    return NextResponse.json({ error: "Cloud mode is required for photo uploads." }, { status: 400 });
  }

  try {
    const formData = await request.formData();
    const fileValue = formData.get("file");

    if (!(fileValue instanceof File)) {
      return NextResponse.json({ error: "Please choose an image file." }, { status: 400 });
    }

    const rawBody = {
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      category: String(formData.get("category") ?? "Editorial"),
      alt: String(formData.get("alt") ?? ""),
      tags: String(formData.get("tags") ?? ""),
      location: String(formData.get("location") ?? ""),
      camera: String(formData.get("camera") ?? ""),
      capturedAt: String(formData.get("capturedAt") ?? ""),
      featured: String(formData.get("featured") ?? "false"),
    };

    const parsed = photoSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json({ error: "Provide valid title, description, category and image details." }, { status: 400 });
    }

    const uploaded = await uploadPhotoFile(fileValue);
    const tags = parsed.data.tags
      ? parsed.data.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];

    const photo = await createPhoto({
      title: parsed.data.title,
      description: parsed.data.description,
      category: parsed.data.category,
      imageUrl: uploaded.secure_url,
      publicId: uploaded.public_id,
      alt: parsed.data.alt || parsed.data.title,
      featured: parsed.data.featured === "true",
      location: parsed.data.location || undefined,
      camera: parsed.data.camera || undefined,
      capturedAt: parsed.data.capturedAt || undefined,
      tags,
      slug: slugify(parsed.data.title),
      sortOrder: Date.now(),
    });

    return NextResponse.json({ photo }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create photograph." },
      { status: 500 },
    );
  }
}
