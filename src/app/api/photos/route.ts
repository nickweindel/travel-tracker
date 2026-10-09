import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const PHOTOS_BUCKET = "photos";

export type PhotoEntityType = "country" | "park" | "state";

export interface PhotoResponse {
  id: string;
  user_id: string;
  entity_type: PhotoEntityType;
  entity_id: string;
  storage_path: string;
  public_url: string;
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

function isPhotoEntityType(value: string): value is PhotoEntityType {
  return value === "country" || value === "park" || value === "state";
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);

    const user_id = searchParams.get("user_id");
    const entity_type = searchParams.get("entity_type");
    const entity_id = searchParams.get("entity_id");

    if (!user_id) {
      return NextResponse.json(
        { error: "Missing user_id" },
        { status: 400 },
      );
    }

    if (entity_type && !isPhotoEntityType(entity_type)) {
      return NextResponse.json(
        { error: "Invalid entity_type. Expected country, park, or state." },
        { status: 400 },
      );
    }

    if (entity_id !== null && !entity_type) {
      return NextResponse.json(
        { error: "entity_type is required when entity_id is provided" },
        { status: 400 },
      );
    }

    // Fetch from one table when a type is supplied;
    // otherwise fetch from all three tables.
    const entityTypes: PhotoEntityType[] = entity_type
      ? [entity_type]
      : ["country", "park", "state"];

    const results = await Promise.all(
      entityTypes.map(async (type) => {
        const config = PHOTO_TABLES[type];

        let query = supabase
          .from(config.table)
          .select(`id, user_id, ${config.idColumn}, storage_path`)
          .eq("user_id", user_id)
          .order("created_at", { ascending: true });

        if (entity_id !== null && entity_id !== "") {
          query = query.eq(config.idColumn, entity_id);
        }

        const { data: rows, error } = await query;

        if (error) {
          throw new Error(`${config.table}: ${error.message}`);
        }

        return (rows ?? []).map((row) => {
          const { data: publicUrlData } = supabase.storage
            .from(PHOTOS_BUCKET)
            .getPublicUrl(row.storage_path);

          return {
            id: row.id,
            user_id: row.user_id,
            entity_type: type,
            entity_id: row[config.idColumn],
            storage_path: row.storage_path,
            public_url: publicUrlData.publicUrl,
          } satisfies PhotoResponse;
        });
      }),
    );

    const photos = results
      .flat()
      .sort((a, b) => a.id.localeCompare(b.id));

    return NextResponse.json({ photos });
  } catch (err) {
    console.error("API photos error:", err);

    return NextResponse.json(
      {
        error: err instanceof Error
          ? err.message
          : "Failed to fetch photos",
      },
      { status: 500 },
    );
  }
}