import type { PhotoStorageMode } from "@/src/lib/types";

export const APP_NAME = "FRAME";

export function getStorageMode(): PhotoStorageMode {
  const mode = (process.env.PHOTO_STORAGE_MODE ?? "local").trim().toLowerCase();
  return mode === "cloud" ? "cloud" : "local";
}

export function isCloudConfigured(): boolean {
  return Boolean(
    process.env.MONGODB_URI &&
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

export function getAdminEmail(): string {
  return (process.env.ADMIN_EMAIL ?? "").trim();
}

export function getAdminPassword(): string {
  return (process.env.ADMIN_PASSWORD ?? "").trim();
}
