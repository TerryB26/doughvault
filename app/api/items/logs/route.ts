import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');

    if (!itemId) {
      return NextResponse.json(
        { error: 'itemId is required' },
        { status: 400 }
      );
    }

    const result = await query(`
      SELECT 
        il.logid,
        il.action,
        il.oldvalues,
        il.newvalues,
        il.quantitychanged,
        il.reasoncode,
        il.notes,
        il.changedon,
        il.changedby,
        CONCAT(u.firstname, ' ', u.lastname) as changedbyname
      FROM itemslogs il
      LEFT JOIN users u ON il.changedby = u.userid
      WHERE il.itemid = $1
      ORDER BY il.changedon DESC
    `, [itemId]);

    return NextResponse.json({
      success: true,
      logs: result.rows
    });
  } catch (error) {
    console.error('Error fetching item logs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
