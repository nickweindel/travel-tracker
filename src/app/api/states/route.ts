import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient(); 

  try {
    const { searchParams } = new URL(request.url);
    const user = searchParams.get('user');

    const { data, error } = await supabase
    .from('vw_states_with_visit_status')
    .select('*')
    .eq('user_id', user)

    if (error) {
      console.error('Supabase fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch records' }, { status: 500 });
    }

    return NextResponse.json({ states: data });
  } catch (error) {
    console.error('Error fetching state visits:', error)
    return NextResponse.json(
      { error: 'Failed to fetch state visits' },
      { status: 500 }
    )
  }
}