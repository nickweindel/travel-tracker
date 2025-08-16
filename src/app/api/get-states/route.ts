import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/get_states - Get all US states
export async function GET(request: NextRequest) {
  try {    
    const states = await db.getAllStates();
    
    return NextResponse.json(states);
  } catch (error) {
    console.error('Error fetching states:', error);
    return NextResponse.json(
      { error: 'Failed to fetch states' },
      { status: 500 }
    );
  }
}
