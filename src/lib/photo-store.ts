import { ObjectId } from "mongodb";
import { v2 as cloudinary } from "cloudinary";
import { getMongoDb } from "@/src/lib/db";
import { getStorageMode, isCloudConfigured } from "@/src/lib/config";
import { starterPhotos } from "@/src/data/photos";
import { slugify } from "@/src/lib/utils";
import type { Photo, PhotoCategory } from "@/src/lib/types";

const PHOTO_COLLECTION = "photos";

const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

cloudinary.config(cloudinaryConfig);

function normalizePhoto(raw: any): Photo {
  return {
    _id: String(raw._id),
    title: String(raw.title ?? "Untitled"),
    slug: String(raw.slug ?? slugify(String(raw.title ?? "untitled"))),
    description: String(raw.description ?? ""),
    category: (raw.category ?? "Editorial") as PhotoCategory,
    imageUrl: String(raw.imageUrl ?? ""),
    publicId: raw.publicId ? String(raw.publicId) : undefined,
    alt: String(raw.alt ?? raw.title ?? "Photography"),
    featured: Boolean(raw.featured),
    location: raw.location ? String(raw.location) : undefined,
    capturedAt: raw.capturedAt ? String(raw.capturedAt) : undefined,
    camera: raw.camera ? String(raw.camera) : undefined,
    tags: Array.isArray(raw.tags) ? raw.tags.map((tag: unknown) => String(tag)) : [],
    sortOrder: Number(raw.sortOrder ?? 0),
    createdAt: raw.createdAt ? String(raw.createdAt) : new Date().toISOString(),
    updatedAt: raw.updatedAt ? String(raw.updatedAt) : new Date().toISOString(),
  };
}

export async function getPhotos(): Promise<Photo[]> {
  if (getStorageMode() !== "cloud") {
    return starterPhotos;
  }

  if (!isCloudConfigured()) {
    throw new Error("Cloud mode is enabled, but MongoDB and Cloudinary configuration is missing.");
  }

  const db = await getMongoDb();

  if (!db) {
    throw new Error("Unable to connect to MongoDB in cloud mode.");
  }

  const collection = db.collection(PHOTO_COLLECTION);
  const documents = await collection.find({}).sort({ sortOrder: 1, createdAt: -1 }).toArray();

  return documents.map(normalizePhoto);
}

export async function getPhotoById(id: string): Promise<Photo | undefined> {
  if (getStorageMode() !== "cloud") {
    return starterPhotos.find((photo) => photo._id === id);
  }

  if (!isCloudConfigured()) {
    throw new Error("Cloud mode is enabled, but MongoDB and Cloudinary configuration is missing.");
  }

  const db = await getMongoDb();
  if (!db) {
    throw new Error("Unable to connect to MongoDB in cloud mode.");
  }

  const collection = db.collection(PHOTO_COLLECTION);
  const document = await collection.findOne({ _id: new ObjectId(id) });

  return document ? normalizePhoto(document) : undefined;
}

export async function getFeaturedPhotos(): Promise<Photo[]> {
  const photos = await getPhotos();
  return photos.filter((photo) => photo.featured);
}

export type CreatePhotoInput = {
  title: string;
  slug?: string;
  description?: string;
  category: PhotoCategory;
  imageUrl: string;
  publicId?: string;
  alt?: string;
  featured?: boolean;
  location?: string;
  capturedAt?: string;
  camera?: string;
  tags?: string[];
  sortOrder?: number;
};

export async function createPhoto(input: CreatePhotoInput): Promise<Photo> {
  if (getStorageMode() !== "cloud") {
    throw new Error("Photo creation is only supported in cloud mode.");
  }

  const db = await getMongoDb();
  if (!db) {
    throw new Error("Unable to connect to MongoDB in cloud mode.");
  }

  const title = input.title.trim();
  const finalSlug = input.slug ?? slugify(input.title || title);
  const now = new Date().toISOString();

  const payload = {
    title,
    slug: finalSlug,
    description: input.description ?? "",
    category: input.category,
    imageUrl: input.imageUrl,
    publicId: input.publicId,
    alt: input.alt ?? title,
    featured: Boolean(input.featured),
    location: input.location ?? undefined,
    capturedAt: input.capturedAt ?? undefined,
    camera: input.camera ?? undefined,
    tags: (input.tags ?? []).map((tag) => tag.trim()).filter(Boolean),
    sortOrder: Number(input.sortOrder ?? 0),
    createdAt: now,
    updatedAt: now,
  };

  const collection = db.collection(PHOTO_COLLECTION);
  const result = await collection.insertOne(payload);

  return normalizePhoto({ ...payload, _id: result.insertedId });
}

export async function updatePhoto(id: string, input: Partial<CreatePhotoInput>): Promise<Photo | null> {
  if (getStorageMode() !== "cloud") {
    throw new Error("Photo updates are only supported in cloud mode.");
  }

  const db = await getMongoDb();
  if (!db) {
    throw new Error("Unable to connect to MongoDB in cloud mode.");
  }

  const collection = db.collection(PHOTO_COLLECTION);
  const current = await collection.findOne({ _id: new ObjectId(id) });

  if (!current) {
    return null;
  }

  const nextValues = {
    ...(input.title ? { title: input.title.trim() } : {}),
    ...(input.title ? { slug: slugify(input.title) } : {}),
    ...(input.description !== undefined ? { description: input.description } : {}),
    ...(input.category ? { category: input.category } : {}),
    ...(input.imageUrl ? { imageUrl: input.imageUrl } : {}),
    ...(input.publicId !== undefined ? { publicId: input.publicId } : {}),
    ...(input.alt !== undefined ? { alt: input.alt } : {}),
    ...(input.featured !== undefined ? { featured: Boolean(input.featured) } : {}),
    ...(input.location !== undefined ? { location: input.location } : {}),
    ...(input.capturedAt !== undefined ? { capturedAt: input.capturedAt } : {}),
    ...(input.camera !== undefined ? { camera: input.camera } : {}),
    ...(input.tags ? { tags: input.tags.map((tag) => tag.trim()).filter(Boolean) } : {}),
    ...(input.sortOrder !== undefined ? { sortOrder: Number(input.sortOrder) } : {}),
    updatedAt: new Date().toISOString(),
  };

  await collection.updateOne({ _id: new ObjectId(id) }, { $set: nextValues });
  const updated = await collection.findOne({ _id: new ObjectId(id) });

  return updated ? normalizePhoto(updated) : null;
}

export async function deletePhoto(id: string): Promise<boolean> {
  if (getStorageMode() !== "cloud") {
    throw new Error("Photo deletion is only supported in cloud mode.");
  }

  const db = await getMongoDb();
  if (!db) {
    throw new Error("Unable to connect to MongoDB in cloud mode.");
  }

  const collection = db.collection(PHOTO_COLLECTION);
  const existing = await collection.findOne({ _id: new ObjectId(id) });

  if (!existing) {
    return false;
  }

  const publicId = existing.publicId ? String(existing.publicId) : "";
  await collection.deleteOne({ _id: new ObjectId(id) });

  if (publicId) {
    const remainingMatches = await collection.countDocuments({ publicId });
    if (remainingMatches === 0) {
      await cloudinary.uploader.destroy(publicId).catch(() => undefined);
    }
  }

  return true;
}
