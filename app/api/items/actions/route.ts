import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/database';
import { auth } from '@clerk/nextjs/server';

interface ItemData {
  itemid?: number;
  itemname: string;
  categoryname?: string;
  sku?: string;
  quantity: number;
  unit: string;
  costprice: number;
  reorderthreshold: number;
  supplier?: string;
  storagelocation?: string;
  action: string;
}

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();
    
    // Get the internal user ID from the database using Clerk ID
    let userId = 1; // Default system user ID
    if (clerkUserId) {
      try {
        const db = getPool();
        const userResult = await db.query('SELECT userid FROM users WHERE clerkuserid = $1', [clerkUserId]);
        if (userResult.rows.length > 0) {
          userId = userResult.rows[0].userid;
        }
      } catch {
        console.warn('Could not find user in database, using system user');
      }
    }

    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'add':
        return await addItem(body, userId);
      case 'edit':
        return await editItem(body, userId);
      case 'delete':
        return await deleteItem(body, userId);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in items actions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function addItem(data: ItemData, userId: number) {
  const {
    itemname,
    categoryname,
    sku,
    quantity,
    unit,
    costprice,
    reorderthreshold,
    supplier,
    storagelocation
  } = data;

  // Validate required fields
  if (!itemname || !unit || quantity < 0 || costprice < 0) {
    return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
  }

  const db = getPool();
  
  try {
    // First, get or create category
    let categoryId = null;
    if (categoryname) {
      const categoryResult = await db.query(
        'INSERT INTO categories (categoryname, createdby) VALUES ($1, $2) ON CONFLICT (categoryname) DO UPDATE SET categoryname = EXCLUDED.categoryname RETURNING categoryid',
        [categoryname, userId]
      );
      categoryId = categoryResult.rows[0].categoryid;
    }

    // Insert new item (rely on default itemuuid and timestamps)
    const result = await db.query(`
      INSERT INTO items (
        itemname,
        categoryid,
        sku,
        quantity,
        reorderthreshold,
        unit,
        costprice,
        supplierinfo,
        storagelocation,
        createdby,
        updatedby
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $10)
      RETURNING itemid
    `, [
      itemname,
      categoryId,
      sku || null,
      quantity,
      reorderthreshold,
      unit,
      costprice,
      supplier || null,
      storagelocation || null,
      userId
    ]);

    return NextResponse.json({
      message: 'Item created successfully',
      itemId: result.rows[0].itemid
    });
  } catch (error) {
    console.error('Error adding item:', error);
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
  }
}

async function editItem(data: ItemData, userId: number) {
  const {
    itemid,
    itemname,
    categoryname,
    sku,
    quantity,
    unit,
    costprice,
    reorderthreshold,
    supplier,
    storagelocation
  } = data;

  if (!itemid) {
    return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
  }

  const db = getPool();

  try {
    // Get or create category
    let categoryId = null;
    if (categoryname) {
      const categoryResult = await db.query(
        'INSERT INTO categories (categoryname, createdby) VALUES ($1, $2) ON CONFLICT (categoryname) DO UPDATE SET categoryname = EXCLUDED.categoryname RETURNING categoryid',
        [categoryname, userId]
      );
      categoryId = categoryResult.rows[0].categoryid;
    }

    // Update item
    await db.query(`
      UPDATE items SET
        itemname = $1,
        categoryid = $2,
        sku = $3,
        quantity = $4,
        reorderthreshold = $5,
        unit = $6,
        costprice = $7,
        supplierinfo = $8,
        storagelocation = $9,
        updatedby = $10,
        updatedon = CURRENT_TIMESTAMP
      WHERE itemid = $11
    `, [
      itemname,
      categoryId,
      sku || null,
      quantity,
      reorderthreshold,
      unit,
      costprice,
      supplier || null,
      storagelocation || null,
      userId,
      itemid
    ]);

    return NextResponse.json({ message: 'Item updated successfully' });
  } catch (error) {
    console.error('Error updating item:', error);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

async function deleteItem(data: { itemid: number }, userId: number) {
  const { itemid } = data;

  if (!itemid) {
    return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
  }

  const db = getPool();

  try {
    // Soft delete - update isactive to false
    await db.query(`
      UPDATE items SET 
        isactive = false,
        updatedby = $1,
        updatedon = CURRENT_TIMESTAMP
      WHERE itemid = $2
    `, [userId, itemid]);

    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
