import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        order_id,
        courier,
        courier_name,
        tracking_number,
        shipment_code,
        status,
        shipping_cost,
        distance_km,
        estimated_days,
        shipped_at,
        delivered_at,
        delivery_type,
        cargo_type
      FROM shipments
      ORDER BY shipped_at DESC NULLS LAST
      LIMIT 100
    `);

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error: any) {
    console.error('GET /shipments error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch shipments',
        error: error.message,
      },
      { status: 500 }
    );
  }
}