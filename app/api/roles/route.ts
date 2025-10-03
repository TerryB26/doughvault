import { NextResponse } from 'next/server';
import { getRolesWithUserCount } from '@/lib/models/queries';

export async function GET() {
  try {
    const roles = await getRolesWithUserCount();
    return NextResponse.json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch roles' },
      { status: 500 }
    );
  }
}
