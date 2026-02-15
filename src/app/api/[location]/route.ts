import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  try {
    const { searchParams, pathname } = new URL(request.url);
    const [, , location] = pathname.split("/");
    const user = searchParams.get("user");

    const viewName = `vw_${location}_with_visit_status`;

    const { data, error } = await supabase
      .from(viewName)
      .select("*")
      .eq("user_id", user);

    if (error) {
      console.error("Supabase fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch records" },
        { status: 500 },
      );
    }

    return NextResponse.json({ visits: data });
  } catch (error) {
    console.error(`Error fetching ${location} visits:`, error);
    return NextResponse.json(
      { error: `Failed to fetch ${location} visits` },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient();

  try {
    const { pathname } = new URL(request.url);
    const [, , location] = pathname.split("/");

    const tableName = `${location}_visited`;

    const columnPrefix =
      location === "states"
        ? "state"
        : location === "national_parks"
          ? "park"
          : "country";

    const idField = `${columnPrefix}_id`;

    const { id, user_id, visited, only_airport } = await request.json();

    // Build update object dynamically
    const updateData: any = {
      [idField]: id,
      user_id,
    };

    if (typeof visited === "boolean") {
      updateData.visited = visited;

      // If visited is true → clear only_airport automatically
      if (visited === true) {
        updateData.only_airport = false;
      }
    }

    // Only allow only_airport for states & countries
    if (
      (location === "states" || location === "countries") &&
      typeof only_airport === "boolean" &&
      visited !== true // prevent override if visited just became true
    ) {
      updateData.only_airport = only_airport;
    }

    const { error } = await supabase.from(tableName).upsert(updateData, {
      onConflict: `${idField},user_id`,
    });

    if (error) {
      console.error("Supabase upsert error:", error);
      return NextResponse.json(
        { error: "Failed to update visit status" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
