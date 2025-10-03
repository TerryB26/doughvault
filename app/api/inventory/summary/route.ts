import { NextResponse } from 'next/server';
import { getInventorySummary } from '@/lib/models/queries';

export async function GET() {
  try {
    const summary = await getInventorySummary();
    return NextResponse.json(summary);
  } catch (error) {
    console.error('Error fetching inventory summary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory summary' },
      { status: 500 }
    );
  }
}
