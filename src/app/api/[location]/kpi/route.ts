import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  try {
    const { searchParams, pathname } = new URL(request.url);
    const [, , location] = pathname.split("/");
    const user = searchParams.get("user");

    const viewName = `vw_visit_kpis`;

    const visitedField = `${location}_visited`;
    const notVisitedField = `${location}_not_visited`;

    const { data, error } = await supabase
      .from(viewName)
      .select(`${visitedField}, ${notVisitedField}`)
      .eq("user_id", user);

    if (error) {
      console.error("Supabase fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch visit kpis" },
        { status: 500 },
      );
    }

    return NextResponse.json({ kpis: data?.[0] ?? null });
  } catch (error) {
    console.error(`Error fetching visit kpis:`, error);
    return NextResponse.json(
      { error: `Failed to fetch visit kpis` },
      { status: 500 },
    );
  }
}
