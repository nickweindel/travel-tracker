import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST /api/toggle-state-visit - Toggle visit status for a state
export async function POST(request: NextRequest) {
  try {
    const { stateId, visited } = await request.json();
    
    if (!stateId || typeof visited !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    await db.toggleStateVisitStatus(stateId, visited);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error toggling state visit status:', error);
    return NextResponse.json(
      { error: 'Failed to toggle state visit status' },
      { status: 500 }
    );
  }
}
