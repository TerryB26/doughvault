import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'add':
        return await assignRole(data);
      case 'edit':
        return await editUserRole(data);
      case 'delete':
        return await removeRole(data ?? body);
      case 'toggle_status':
        return await toggleUserRoleStatus(data);
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in user role actions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function assignRole(data: {
  userId: number;
  roleId: number;
  isActive?: boolean;
  assignedBy?: number;
}) {
  // Check if assignment already exists
  const existingAssignment = await query(`
    SELECT userroleid FROM userroles 
    WHERE userid = $1 AND roleid = $2 AND isactive = true
  `, [data.userId, data.roleId]);

  if (existingAssignment.rows.length > 0) {
    return NextResponse.json(
      { error: 'User is already assigned to this role' },
      { status: 400 }
    );
  }

  const result = await query(`
    INSERT INTO userroles (userroleuuid, userid, roleid, assignedon, assignedby, isactive, updatedon)
    VALUES (uuid_generate_v4(), $1, $2, NOW(), $3, $4, NOW())
    RETURNING userroleid, userroleuuid, userid, roleid, assignedon, assignedby, isactive
  `, [data.userId, data.roleId, data.assignedBy || null, data.isActive !== false]);

  return NextResponse.json({
    success: true,
    message: 'Role assigned successfully',
    userRole: result.rows[0]
  });
}

async function editUserRole(data: {
  userRoleId: number;
  roleId?: number;
  assignedBy?: number;
  updatedBy?: number;
}) {
  const setParts = [];
  const values = [];
  let paramIndex = 1;

  if (data.roleId) {
    setParts.push(`roleid = $${paramIndex++}`);
    values.push(data.roleId);
  }
  if (data.assignedBy !== undefined) {
    setParts.push(`assignedby = $${paramIndex++}`);
    values.push(data.assignedBy);
  }
  
  setParts.push(`updatedby = $${paramIndex++}`);
  values.push(data.updatedBy || null);
  
  setParts.push(`updatedon = NOW()`);
  
  values.push(data.userRoleId);

  const result = await query(`
    UPDATE userroles 
    SET ${setParts.join(', ')}
    WHERE userroleid = $${paramIndex}
    RETURNING userroleid, userroleuuid, userid, roleid, assignedon, assignedby, isactive, updatedon
  `, values);

  if (result.rows.length === 0) {
    return NextResponse.json(
      { error: 'User role assignment not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'User role assignment updated successfully',
    userRole: result.rows[0]
  });
}

async function removeRole(data: { userRoleId?: number; userroleid?: number; updatedBy?: number }) {
  const userRoleId = data.userRoleId ?? data.userroleid;
  if (!userRoleId) {
    return NextResponse.json(
      { error: 'userRoleId is required' },
      { status: 400 }
    );
  }
  
  // Hard delete - permanently remove the user role assignment
  const result = await query(`
    DELETE FROM userroles 
    WHERE userroleid = $1
    RETURNING userroleid, userroleuuid, userid, roleid
  `, [userRoleId]);

  if (result.rows.length === 0) {
    return NextResponse.json(
      { error: 'User role assignment not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'User role assignment permanently deleted',
    userRole: result.rows[0]
  });
}

async function toggleUserRoleStatus(data: { userRoleId: number; updatedBy?: number }) {
  const result = await query(`
    UPDATE userroles 
    SET isactive = NOT isactive, updatedby = $1, updatedon = NOW()
    WHERE userroleid = $2
    RETURNING userroleid, userroleuuid, userid, roleid, isactive
  `, [data.updatedBy || null, data.userRoleId]);

  if (result.rows.length === 0) {
    return NextResponse.json(
      { error: 'User role assignment not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: `User role assignment ${result.rows[0].isactive ? 'activated' : 'deactivated'} successfully`,
    userRole: result.rows[0]
  });
}
