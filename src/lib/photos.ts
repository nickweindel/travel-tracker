import type { SupabaseClient } from "@supabase/supabase-js";

const PHOTOS_BUCKET = "photos";

export type PhotoEntityType = "country" | "park" | "state";

export interface Photo {
  id: string;
  user_id: string;
  entity_type: PhotoEntityType;
  entity_id: string;
  storage_path: string;
  public_url: string;
}

export interface PhotoPayload {
  user_id: string;
  entity_type: PhotoEntityType;
  entity_id: string;
}

export interface UploadResult {
  success: boolean;
  error?: string;
}

const PHOTO_TABLES = {
  country: {
    table: "country_photos",
    idColumn: "country_id",
  },
  park: {
    table: "park_photos",
    idColumn: "park_id",
  },
  state: {
    table: "state_photos",
    idColumn: "state_id",
  },
} as const;

/**
 * Fetches photos for a user, optionally filtered by entity type and ID.
 */
export async function fetchPhotos(params: {
  user_id: string;
  entity_type?: PhotoEntityType;
  entity_id?: number;
}): Promise<Photo[]> {
  const url = new URL("/api/photos", window.location.origin);

  url.searchParams.set("user_id", params.user_id);

  if (params.entity_type) {
    url.searchParams.set("entity_type", params.entity_type);
  }

  if (params.entity_id != null) {
    url.searchParams.set("entity_id", String(params.entity_id));
  }

  const res = await fetch(url.toString());

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Failed to fetch photos");
  }

  const data = await res.json();
  return data.photos ?? [];
}

/**
 * Uploads a photo to Supabase Storage and inserts metadata
 * into the appropriate entity-specific table.
 */
export async function uploadPhoto(
  supabase: SupabaseClient,
  file: File,
  photo: PhotoPayload,
): Promise<UploadResult> {
  const config = PHOTO_TABLES[photo.entity_type];
  const path =
    `${photo.user_id}/${photo.entity_type}/${photo.entity_id}/` +
    `${crypto.randomUUID()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from(PHOTOS_BUCKET)
    .upload(path, file);

  if (uploadError) {
    return { success: false, error: uploadError.message };
  }

  const { error: dbError } = await supabase
    .from(config.table)
    .insert({
      user_id: photo.user_id,
      [config.idColumn]: photo.entity_id,
      storage_path: path,
    });

  if (dbError) {
    // Clean up the uploaded file if metadata insertion fails.
    const { error: cleanupError } = await supabase.storage
      .from(PHOTOS_BUCKET)
      .remove([path]);

    if (cleanupError) {
      console.error("Failed to clean up uploaded photo:", cleanupError);
    }

    return { success: false, error: dbError.message };
  }

  return { success: true };
}

/**
 * Uploads multiple photos, continuing after individual failures.
 */
export async function uploadPhotos(
  supabase: SupabaseClient,
  files: File[],
  photo: PhotoPayload,
): Promise<{ uploaded: number; failed: number; errors: string[] }> {
  const errors: string[] = [];
  let uploaded = 0;

  for (const file of files) {
    const result = await uploadPhoto(supabase, file, photo);

    if (result.success) {
      uploaded++;
    } else {
      errors.push(result.error ?? "Unknown error");
    }
  }

  return {
    uploaded,
    failed: files.length - uploaded,
    errors,
  };
}