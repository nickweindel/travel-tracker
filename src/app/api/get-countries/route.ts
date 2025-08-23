import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/get_states - Get all US states
export async function GET(request: NextRequest) {
  try {    
    const countries = await db.getAllCountriesWithVisitStatus();
    
    return NextResponse.json(countries);
  } catch (error) {
    console.error('Error fetching countries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch countries' },
      { status: 500 }
    );
  }
}
