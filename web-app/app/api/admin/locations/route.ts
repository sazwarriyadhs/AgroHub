// app/api/admin/locations/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'farmers', 'vendors', 'all'

    let query = `
      SELECT 
        id, 
        name, 
        role_enum as type,
        latitude as lat, 
        longitude as lng,
        address,
        phone,
        email,
        city,
        province,
        rating,
        created_at as joined_date,
        is_verified
      FROM users
      WHERE role_enum IN ('farmer', 'vendor')
      AND latitude IS NOT NULL 
      AND longitude IS NOT NULL
      AND deleted_at IS NULL
    `;

    if (type === 'farmers') {
      query += ` AND role_enum = 'farmer'`;
    } else if (type === 'vendors') {
      query += ` AND role_enum = 'vendor'`;
    }

    query += ` ORDER BY created_at DESC`;

    const client = await pool.connect();
    try {
      const result = await client.query(query);
      return NextResponse.json({ success: true, data: result.rows });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Locations API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

