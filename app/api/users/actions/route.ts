import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
  const { action, data } = body;

    switch (action) {
      case 'add':
        return await addUser(data);
      case 'edit':
        return await editUser(data);
      case 'delete':
        return await deleteUser(data ?? body);
      case 'toggle_status':
        return await toggleUserStatus(data);
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in user actions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function addUser(data: {
  email: string;
  firstName: string;
  lastName: string;
  clerkUserId?: string;
  isActive?: boolean;
  createdBy?: number;
}) {
  // Generate a temporary clerk ID if not provided (for manual admin creation)
  const clerkId = data.clerkUserId || `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const result = await query(`
    INSERT INTO users (useruuid, clerkuserid, email, firstname, lastname, isactive, createdby, createdon, updatedon)
    VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6, NOW(), NOW())
    RETURNING userid, useruuid, email, firstname, lastname, isactive, createdon
  `, [clerkId, data.email, data.firstName, data.lastName, data.isActive !== false, data.createdBy || null]);

  return NextResponse.json({
    success: true,
    message: 'User created successfully',
    user: result.rows[0]
  });
}

async function editUser(data: {
  userId: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  updatedBy?: number;
}) {
  const setParts = [];
  const values = [];
  let paramIndex = 1;

  if (data.email) {
    setParts.push(`email = $${paramIndex++}`);
    values.push(data.email);
  }
  if (data.firstName) {
    setParts.push(`firstname = $${paramIndex++}`);
    values.push(data.firstName);
  }
  if (data.lastName) {
    setParts.push(`lastname = $${paramIndex++}`);
    values.push(data.lastName);
  }
  
  setParts.push(`updatedby = $${paramIndex++}`);
  values.push(data.updatedBy || null);
  
  setParts.push(`updatedon = NOW()`);
  
  values.push(data.userId);

  const result = await query(`
    UPDATE users 
    SET ${setParts.join(', ')}
    WHERE userid = $${paramIndex}
    RETURNING userid, useruuid, email, firstname, lastname, isactive, updatedon
  `, values);

  if (result.rows.length === 0) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'User updated successfully',
    user: result.rows[0]
  });
}

async function deleteUser(data: { userId?: number; userid?: number; updatedBy?: number }) {
  const userId = data.userId ?? data.userid;
  if (!userId) {
    return NextResponse.json(
      { error: 'userId is required' },
      { status: 400 }
    );
  }

  // Soft-cascade deactivate user role assignments first
  await query(`
    UPDATE userroles SET isactive = false, updatedby = $1, updatedon = NOW()
    WHERE userid = $2 AND isactive = true
  `, [data.updatedBy || null, userId]);

  const result = await query(`
    UPDATE users 
    SET isactive = false, updatedby = $1, updatedon = NOW()
    WHERE userid = $2 AND isactive = true
    RETURNING userid, useruuid, email, firstname, lastname, isactive
  `, [data.updatedBy || null, userId]);

  if (result.rows.length === 0) {
    return NextResponse.json(
      { error: 'User not found or already inactive' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'User deactivated successfully',
    user: result.rows[0]
  });
}

async function toggleUserStatus(data: { userId: number; updatedBy?: number }) {
  const result = await query(`
    UPDATE users 
    SET isactive = NOT isactive, updatedby = $1, updatedon = NOW()
    WHERE userid = $2
    RETURNING userid, useruuid, email, firstname, lastname, isactive
  `, [data.updatedBy || null, data.userId]);

  if (result.rows.length === 0) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: `User ${result.rows[0].isactive ? 'activated' : 'deactivated'} successfully`,
    user: result.rows[0]
  });
}
