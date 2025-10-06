import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient(); 

  try {
    const { searchParams, pathname } = new URL(request.url);
    const [, , location] = pathname.split("/");
    const user = searchParams.get('user');

    const viewName = `vw_${location}_with_visit_status`

    const { data, error } = await supabase
    .from(viewName)
    .select('*')
    .eq('user_id', user)

    if (error) {
      console.error('Supabase fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch records' }, { status: 500 });
    }

    return NextResponse.json({ visits: data });
  } catch (error) {
    console.error(`Error fetching ${location} visits:`, error)
    return NextResponse.json(
      { error: `Failed to fetch ${location} visits` },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient();

  try {
    const { pathname } = new URL(request.url);
    const [, , location] = pathname.split("/");

    const tableName = `${location}_visited`; 
    const columnPrefix = location === "states" ? "state" : "country";
    const idField = `${columnPrefix}_id`; 

    const { id, user_id, visited } = await request.json();

    const { error } = await supabase
      .from(tableName)
      .upsert(
        {
          [idField]: id,
          user_id,
          visited,
        },
        {
          onConflict: `${idField},user_id`,
        }
      );

    if (error) {
      console.error("Supabase upsert error:", error);
      return NextResponse.json({ error: "Failed to update visit status" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}