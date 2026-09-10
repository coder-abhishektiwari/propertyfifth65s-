import path from "path";
import fs from "fs/promises";

const STORAGE_BASE = process.env.PROPERTY_STORAGE_PATH || "./storage";
const STORAGE_ROOT = path.join(STORAGE_BASE, "properties");
const ALLOWED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
const ALLOWED_BROCHURE_EXTENSIONS = [".pdf"];

function getStorageRoot(): string {
  return path.resolve(STORAGE_ROOT);
}

function getPropertyDir(slug: string): string {
  return path.join(getStorageRoot(), slug);
}

function getPropertyImagesDir(slug: string): string {
  return path.join(getPropertyDir(slug), "images");
}

function getPropertyBrochureDir(slug: string): string {
  return path.join(getPropertyDir(slug), "brochure");
}

function isSafeSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

function isSafeFilename(filename: string): boolean {
  if (!filename || filename.length === 0 || filename.length > 255) return false;
  if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) return false;
  if (filename.startsWith(".")) return false;
  return /^[a-zA-Z0-9._-]+$/.test(filename);
}

function isAllowedExtension(filename: string, allowed: string[]): boolean {
  const ext = path.extname(filename).toLowerCase();
  return allowed.includes(ext);
}

export function getImageContentType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const map: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
  };
  return map[ext] || "application/octet-stream";
}

export function getBrochureContentType(): string {
  return "application/pdf";
}

export function getMediaUrl(type: "images" | "brochure", slug: string, filename: string): string {
  if (type === "images") {
    return `/api/media/properties/${encodeURIComponent(slug)}/images/${encodeURIComponent(filename)}`;
  }
  return `/api/media/properties/${encodeURIComponent(slug)}/brochure/${encodeURIComponent(filename)}`;
}

export async function resolveMediaPath(
  type: "images" | "brochure",
  slug: string,
  filename: string
): Promise<string | null> {
  if (!isSafeSlug(slug)) return null;
  if (!isSafeFilename(filename)) return null;

  const dir = type === "images" ? getPropertyImagesDir(slug) : getPropertyBrochureDir(slug);
  const allowed = type === "images" ? ALLOWED_IMAGE_EXTENSIONS : ALLOWED_BROCHURE_EXTENSIONS;

  if (!isAllowedExtension(filename, allowed)) return null;

  const resolved = path.resolve(path.join(dir, filename));
  const root = getStorageRoot();

  if (!resolved.startsWith(path.resolve(root))) return null;

  try {
    await fs.access(resolved);
    return resolved;
  } catch {
    return null;
  }
}

export async function ensurePropertyDirectories(slug: string): Promise<void> {
  const imagesDir = getPropertyImagesDir(slug);
  const brochureDir = getPropertyBrochureDir(slug);
  await fs.mkdir(imagesDir, { recursive: true });
  await fs.mkdir(brochureDir, { recursive: true });
}

export async function savePropertyImage(
  slug: string,
  filename: string,
  buffer: Buffer
): Promise<string> {
  if (!isSafeSlug(slug)) throw new Error(`Invalid property slug: ${slug}`);
  const safeName = sanitizeFilename(filename);
  if (!isAllowedExtension(safeName, ALLOWED_IMAGE_EXTENSIONS)) {
    throw new Error(`Invalid image extension: ${safeName}`);
  }

  await ensurePropertyDirectories(slug);
  const dest = path.join(getPropertyImagesDir(slug), safeName);
  await fs.writeFile(dest, buffer);
  return `${slug}/images/${safeName}`;
}

export async function savePropertyBrochure(
  slug: string,
  filename: string,
  buffer: Buffer
): Promise<string> {
  if (!isSafeSlug(slug)) throw new Error(`Invalid property slug: ${slug}`);
  const safeName = sanitizeFilename(filename);
  if (!isAllowedExtension(safeName, ALLOWED_BROCHURE_EXTENSIONS)) {
    throw new Error(`Invalid brochure extension: ${safeName}`);
  }

  await ensurePropertyDirectories(slug);
  const dest = path.join(getPropertyBrochureDir(slug), safeName);
  await fs.writeFile(dest, buffer);
  return `${slug}/brochure/${safeName}`;
}

export async function deletePropertyImage(storageKey: string): Promise<boolean> {
  const filePath = resolveStorageKey(storageKey);
  if (!filePath) return false;
  try {
    await fs.unlink(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function deletePropertyBrochure(storageKey: string): Promise<boolean> {
  const filePath = resolveStorageKey(storageKey);
  if (!filePath) return false;
  try {
    await fs.unlink(filePath);
    return true;
  } catch {
    return false;
  }
}

function resolveStorageKey(storageKey: string): string | null {
  if (storageKey.includes("..") || storageKey.startsWith("/")) return null;
  const resolved = path.resolve(path.join(getStorageRoot(), storageKey));
  const root = getStorageRoot();
  if (!resolved.startsWith(root)) return null;
  return resolved;
}

function sanitizeFilename(filename: string): string {
  const base = path.basename(filename);
  return base.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export function getStorageImagePath(slug: string, filename: string): string | null {
  return path.join(getPropertyImagesDir(slug), filename);
}

export function getStorageBrochurePath(slug: string, filename: string): string | null {
  return path.join(getPropertyBrochureDir(slug), filename);
}

export async function propertyExists(slug: string): Promise<boolean> {
  try {
    await fs.access(getPropertyDir(slug));
    return true;
  } catch {
    return false;
  }
}

export async function listPropertyImages(slug: string): Promise<string[]> {
  const dir = getPropertyImagesDir(slug);
  try {
    const files = await fs.readdir(dir);
    return files.filter((f) => isAllowedExtension(f, ALLOWED_IMAGE_EXTENSIONS));
  } catch {
    return [];
  }
}

export {
  isSafeSlug,
  isSafeFilename,
  ALLOWED_IMAGE_EXTENSIONS,
  ALLOWED_BROCHURE_EXTENSIONS,
  getPropertyImagesDir,
  getPropertyBrochureDir,
  getStorageRoot,
};
