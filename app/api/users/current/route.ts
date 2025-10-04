import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { query } from '@/lib/database';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user from database using Clerk ID
    const userResult = await query(
      `SELECT userid, email, firstname, lastname, clerkuserid 
       FROM users 
       WHERE clerkuserid = $1 AND isactive = true`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = userResult.rows[0];

    // Get user's roles
    const rolesResult = await query(
      `SELECT r.rolename 
       FROM userroles ur
       JOIN roles r ON ur.roleid = r.roleid
       WHERE ur.userid = $1 AND ur.isactive = true AND r.isactive = true`,
      [user.userid]
    );

    const roles = rolesResult.rows.map(row => row.rolename);

    return NextResponse.json({
      userid: user.userid,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      roles: roles
    });
  } catch (error) {
    console.error('Error fetching current user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
