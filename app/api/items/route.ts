import { NextResponse } from 'next/server';
import { getItemsWithCategories } from '@/lib/models/queries';

export async function GET() {
  try {
    const items = await getItemsWithCategories();
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    );
  }
}
