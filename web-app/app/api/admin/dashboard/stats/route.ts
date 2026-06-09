// app/api/admin/dashboard/stats/route.ts
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

    const token = authHeader.split(' ')[1];
    // TODO: Verify JWT token and check admin role

    const client = await pool.connect();

    try {
      // Execute all queries in parallel
      const [
        superadminResult,
        totalUsersResult,
        totalFarmersResult,
        totalVendorsResult,
        totalBuyersResult,
        totalStoresResult,
        totalProductsResult,
        totalOrdersResult,
        totalRevenueResult,
        totalEscrowResult,
        totalWalletResult,
        pendingWithdrawalsResult,
        approvedWithdrawalsResult,
        openDisputesResult,
        pendingKycResult,
        approvedKycResult,
        rejectedKycResult,
        recentOrdersResult,
        pendingWithdrawListResult,
        disputeManagementResult,
        topSellersResult,
        recentReviewsResult,
        osmMapDataResult,
        commodityPricesResult,
        membershipMonitoringResult,
        badgesResult,
        verificationAuditResult,
        lastLoginResult,
        securityMonitoringResult,
        investorSummaryResult
      ] = await Promise.all([
        client.query(`
          SELECT id, name, email, role, role_enum, user_type, 
                 is_active, is_verified, photo_url, created_at, last_login_at
          FROM users WHERE role_enum = 'superadmin' LIMIT 1
        `),
        client.query(`SELECT COUNT(*) as total FROM users WHERE deleted_at IS NULL`),
        client.query(`SELECT COUNT(*) as total FROM users WHERE role_enum = 'farmer' AND deleted_at IS NULL`),
        client.query(`SELECT COUNT(*) as total FROM users WHERE role_enum = 'vendor' AND deleted_at IS NULL`),
        client.query(`SELECT COUNT(*) as total FROM users WHERE role_enum = 'buyer' AND deleted_at IS NULL`),
        client.query(`SELECT COUNT(*) as total FROM stores`),
        client.query(`SELECT COUNT(*) as total FROM products`),
        client.query(`SELECT COUNT(*) as total FROM orders`),
        client.query(`SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE status = 'completed'`),
        client.query(`SELECT COALESCE(SUM(amount), 0) as total FROM escrows WHERE status = 'held'`),
        client.query(`SELECT COALESCE(SUM(balance), 0) as total FROM wallets`),
        client.query(`SELECT COUNT(*) as total FROM withdrawals WHERE status = 'pending'`),
        client.query(`SELECT COUNT(*) as total FROM withdrawals WHERE status = 'approved'`),
        client.query(`SELECT COUNT(*) as total FROM disputes WHERE status = 'open'`),
        client.query(`SELECT COUNT(*) as total FROM verifications WHERE kyc_status = 'pending'`),
        client.query(`SELECT COUNT(*) as total FROM verifications WHERE kyc_status = 'approved'`),
        client.query(`SELECT COUNT(*) as total FROM verifications WHERE kyc_status = 'rejected'`),
        client.query(`
          SELECT id, buyer_id, seller_id, total_amount, status, created_at 
          FROM orders ORDER BY created_at DESC LIMIT 10
        `),
        client.query(`
          SELECT w.id, u.name, w.amount, w.status, w.created_at
          FROM withdrawals w JOIN users u ON u.id = w.user_id
          WHERE w.status = 'pending' ORDER BY w.created_at DESC
        `),
        client.query(`
          SELECT d.id, d.order_id, d.status, d.created_at 
          FROM disputes d ORDER BY d.created_at DESC
        `),
        client.query(`
          SELECT u.id, u.name, s.name as store_name, ss.score
          FROM seller_scores ss
          JOIN users u ON u.id = ss.user_id
          LEFT JOIN stores s ON s.user_id = u.id
          ORDER BY ss.score DESC LIMIT 10
        `),
        client.query(`
          SELECT pr.id, pr.product_id, pr.user_id, pr.rating, pr.created_at
          FROM product_reviews pr ORDER BY pr.created_at DESC LIMIT 20
        `),
        client.query(`
          SELECT id, name, role_enum, latitude, longitude, city, province, farm_name, farm_type
          FROM users
          WHERE role_enum IN ('farmer', 'vendor')
          AND latitude IS NOT NULL AND longitude IS NOT NULL
        `),
        client.query(`
          SELECT * FROM commodity_prices ORDER BY created_at DESC LIMIT 20
        `),
        client.query(`
          SELECT u.id, u.name, m.name as membership_name, u.membership_expiry
          FROM users u LEFT JOIN memberships m ON u.membership_id = m.id
          WHERE u.membership_id IS NOT NULL
        `),
        client.query(`SELECT * FROM badges ORDER BY id DESC`),
        client.query(`
          SELECT v.id, u.name as user_name, v.store_name, v.kyc_status, v.kyc_reviewed_at,
                 admin.name as reviewed_by
          FROM verifications v
          LEFT JOIN users u ON u.id = v.user_id
          LEFT JOIN users admin ON admin.id = v.kyc_reviewed_by
          ORDER BY v.created_at DESC
        `),
        client.query(`
          SELECT id, name, email, role_enum, last_login_at, last_login_ip
          FROM users ORDER BY last_login_at DESC LIMIT 20
        `),
        client.query(`
          SELECT id, name, email, login_attempts, locked_until, two_factor_enabled
          FROM users
          WHERE login_attempts > 0 OR locked_until IS NOT NULL
          ORDER BY login_attempts DESC
        `),
        client.query(`
          SELECT
            (SELECT COUNT(*) FROM users) as total_users,
            (SELECT COUNT(*) FROM orders) as total_orders,
            (SELECT COALESCE(SUM(total_amount),0) FROM orders WHERE status = 'completed') as total_revenue,
            (SELECT COUNT(*) FROM stores) as total_stores,
            (SELECT COUNT(*) FROM products) as total_products
        `)
      ]);

      const response = {
        success: true,
        data: {
          superadmin: superadminResult.rows[0] || null,
          stats: {
            total_users: parseInt(totalUsersResult.rows[0]?.total || '0'),
            total_farmers: parseInt(totalFarmersResult.rows[0]?.total || '0'),
            total_vendors: parseInt(totalVendorsResult.rows[0]?.total || '0'),
            total_buyers: parseInt(totalBuyersResult.rows[0]?.total || '0'),
            total_stores: parseInt(totalStoresResult.rows[0]?.total || '0'),
            total_products: parseInt(totalProductsResult.rows[0]?.total || '0'),
            total_orders: parseInt(totalOrdersResult.rows[0]?.total || '0'),
            total_revenue: parseFloat(totalRevenueResult.rows[0]?.total || '0'),
            total_escrow_balance: parseFloat(totalEscrowResult.rows[0]?.total || '0'),
            total_wallet_balance: parseFloat(totalWalletResult.rows[0]?.total || '0'),
            pending_withdrawals: parseInt(pendingWithdrawalsResult.rows[0]?.total || '0'),
            approved_withdrawals: parseInt(approvedWithdrawalsResult.rows[0]?.total || '0'),
            open_disputes: parseInt(openDisputesResult.rows[0]?.total || '0'),
            pending_kyc: parseInt(pendingKycResult.rows[0]?.total || '0'),
            approved_kyc: parseInt(approvedKycResult.rows[0]?.total || '0'),
            rejected_kyc: parseInt(rejectedKycResult.rows[0]?.total || '0'),
          },
          recent_orders: recentOrdersResult.rows,
          pending_withdrawals_list: pendingWithdrawListResult.rows,
          disputes: disputeManagementResult.rows,
          top_sellers: topSellersResult.rows,
          recent_reviews: recentReviewsResult.rows,
          osm_map_data: osmMapDataResult.rows,
          commodity_prices: commodityPricesResult.rows,
          memberships: membershipMonitoringResult.rows,
          badges: badgesResult.rows,
          verification_audit: verificationAuditResult.rows,
          last_login: lastLoginResult.rows,
          security_monitoring: securityMonitoringResult.rows,
          investor_summary: investorSummaryResult.rows[0]
        }
      };

      return NextResponse.json(response);

    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

