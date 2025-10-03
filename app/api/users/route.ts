import { NextResponse } from 'next/server';
import { getUsersWithRoles } from '@/lib/models/queries';

export async function GET() {
  try {
    const users = await getUsersWithRoles();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
