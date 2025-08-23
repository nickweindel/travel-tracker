import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST /api/toggle-country-visit - Toggle visit status for a country
export async function POST(request: NextRequest) {
  try {
    const { countryId, visited } = await request.json();
    
    if (!countryId || typeof visited !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    await db.toggleCountryVisitStatus(countryId, visited);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error toggling state visit status:', error);
    return NextResponse.json(
      { error: 'Failed to toggle state visit status' },
      { status: 500 }
    );
  }
}
