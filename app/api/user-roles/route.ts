import { NextResponse } from 'next/server';
import { getUserRolesWithDetails } from '@/lib/models/queries';

export async function GET() {
  try {
    const userRoles = await getUserRolesWithDetails();
    return NextResponse.json(userRoles);
  } catch (error) {
    console.error('Error fetching user roles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user roles' },
      { status: 500 }
    );
  }
}
