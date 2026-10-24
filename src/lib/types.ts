export type PhotoCategory =
  | "Editorial"
  | "Portrait"
  | "Travel"
  | "Commercial"
  | "Fine Art";

export type Photo = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: PhotoCategory;
  imageUrl: string;
  publicId?: string;
  alt: string;
  featured: boolean;
  location?: string;
  capturedAt?: string;
  camera?: string;
  tags: string[];
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type PhotoStorageMode = "local" | "cloud";
