import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
  const { action, data } = body;

    switch (action) {
      case 'add':
        return await addRole(data);
      case 'edit':
        return await editRole(data ?? body);
      case 'delete':
        return await deleteRole(data ?? body);
      case 'toggle_status':
        return await toggleRoleStatus(data);
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in role actions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function addRole(data: {
  roleName: string;
  roleDescription?: string;
  isActive?: boolean;
  createdBy?: number;
}) {
  const result = await query(`
    INSERT INTO roles (roleuuid, rolename, roledescription, isactive, createdby, createdon, updatedon)
    VALUES (uuid_generate_v4(), $1, $2, $3, $4, NOW(), NOW())
    RETURNING roleid, roleuuid, rolename, roledescription, isactive, createdon
  `, [data.roleName, data.roleDescription || null, data.isActive !== false, data.createdBy || null]);

  return NextResponse.json({
    success: true,
    message: 'Role created successfully',
    role: result.rows[0]
  });
}

async function editRole(data: {
  roleId?: number; roleid?: number;
  roleName?: string;
  roleDescription?: string;
  isActive?: boolean;
  updatedBy?: number;
}) {
  const roleId = data.roleId ?? data.roleid;
  if (!roleId) {
    return NextResponse.json(
      { error: 'roleId is required' },
      { status: 400 }
    );
  }
  const setParts = [];
  const values = [];
  let paramIndex = 1;

  if (data.roleName) {
    setParts.push(`rolename = $${paramIndex++}`);
    values.push(data.roleName);
  }
  if (data.roleDescription !== undefined) {
    setParts.push(`roledescription = $${paramIndex++}`);
    values.push(data.roleDescription);
  }
  if (data.isActive !== undefined) {
    setParts.push(`isactive = $${paramIndex++}`);
    values.push(data.isActive);
  }
  
  setParts.push(`updatedby = $${paramIndex++}`);
  values.push(data.updatedBy || null);
  
  setParts.push(`updatedon = NOW()`);
  
  values.push(roleId);

  const result = await query(`
    UPDATE roles 
    SET ${setParts.join(', ')}
    WHERE roleid = $${paramIndex}
    RETURNING roleid, roleuuid, rolename, roledescription, isactive, updatedon
  `, values);

  if (result.rows.length === 0) {
    return NextResponse.json(
      { error: 'Role not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Role updated successfully',
    role: result.rows[0]
  });
}

async function deleteRole(data: { roleId?: number; roleid?: number; updatedBy?: number }) {
  const roleId = data.roleId ?? data.roleid;
  if (!roleId) {
    return NextResponse.json(
      { error: 'roleId is required' },
      { status: 400 }
    );
  }
  // Soft-cascade: deactivate active user role assignments for this role first
  await query(`
    UPDATE userroles 
    SET isactive = false, updatedby = $1, updatedon = NOW()
    WHERE roleid = $2 AND isactive = true
  `, [data.updatedBy || null, roleId]);

  const result = await query(`
    UPDATE roles 
    SET isactive = false, updatedby = $1, updatedon = NOW()
    WHERE roleid = $2 AND isactive = true
    RETURNING roleid, roleuuid, rolename, roledescription, isactive
  `, [data.updatedBy || null, roleId]);

  if (result.rows.length === 0) {
    return NextResponse.json(
      { error: 'Role not found or already inactive' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Role deactivated successfully',
    role: result.rows[0]
  });
}

async function toggleRoleStatus(data: { roleId: number; updatedBy?: number }) {
  const result = await query(`
    UPDATE roles 
    SET isactive = NOT isactive, updatedby = $1, updatedon = NOW()
    WHERE roleid = $2
    RETURNING roleid, roleuuid, rolename, roledescription, isactive
  `, [data.updatedBy || null, data.roleId]);

  if (result.rows.length === 0) {
    return NextResponse.json(
      { error: 'Role not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: `Role ${result.rows[0].isactive ? 'activated' : 'deactivated'} successfully`,
    role: result.rows[0]
  });
}
