package controllers

import (
    "net/http"
    "strconv"

    "github.com/gin-gonic/gin"
    "gorm.io/gorm"
)

type WalletController struct {
    db *gorm.DB
}

func NewWalletController(db *gorm.DB) *WalletController {
    return &WalletController{db: db}
}

// GetWallet - Get user's own wallet (existing)
func (wc *WalletController) GetWallet(ctx *gin.Context) {
    ctx.JSON(http.StatusOK, gin.H{
        "success": true,
        "data": gin.H{
            "balance": 0,
        },
    })
}

// ================= ADMIN METHODS =================

// AdminGetWallets - Get all wallets with pagination and filters
func (wc *WalletController) AdminGetWallets(c *gin.Context) {
    page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
    limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
    search := c.Query("search")
    userType := c.Query("user_type")
    status := c.Query("status")

    offset := (page - 1) * limit

    query := wc.db.Table("wallets").
        Select("wallets.*, users.name as user_name, users.email as user_email, users.user_type").
        Joins("LEFT JOIN users ON users.id = wallets.user_id")

    if search != "" {
        query = query.Where("users.name ILIKE ? OR users.email ILIKE ?", "%"+search+"%", "%"+search+"%")
    }
    if userType != "" && userType != "all" {
        query = query.Where("users.user_type = ?", userType)
    }
    if status != "" && status != "all" {
        query = query.Where("wallets.status = ?", status)
    }

    var total int64
    query.Count(&total)

    var wallets []map[string]interface{}
    query.Offset(offset).Limit(limit).Find(&wallets)

    c.JSON(http.StatusOK, gin.H{
        "success": true,
        "data":    wallets,
        "total":   total,
        "page":    page,
        "limit":   limit,
    })
}

// AdminGetWalletStats - Get wallet statistics
func (wc *WalletController) AdminGetWalletStats(c *gin.Context) {
    var stats struct {
        TotalWallets     int64   `json:"total_wallets"`
        TotalBalance     float64 `json:"total_balance"`
        TotalPending     float64 `json:"total_pending"`
        TotalDeposited   float64 `json:"total_deposited"`
        TotalWithdrawn   float64 `json:"total_withdrawn"`
        TotalSpent       float64 `json:"total_spent"`
        ActiveWallets    int64   `json:"active_wallets"`
        FrozenWallets    int64   `json:"frozen_wallets"`
        SuspendedWallets int64   `json:"suspended_wallets"`
        AvgBalance       float64 `json:"avg_balance"`
    }

    wc.db.Table("wallets").Select("COUNT(*) as total_wallets").Scan(&stats.TotalWallets)
    wc.db.Table("wallets").Select("COALESCE(SUM(balance), 0) as total_balance").Scan(&stats.TotalBalance)
    wc.db.Table("wallets").Select("COALESCE(SUM(pending_balance), 0) as total_pending").Scan(&stats.TotalPending)
    wc.db.Table("wallets").Select("COALESCE(SUM(total_deposited), 0) as total_deposited").Scan(&stats.TotalDeposited)
    wc.db.Table("wallets").Select("COALESCE(SUM(total_withdrawn), 0) as total_withdrawn").Scan(&stats.TotalWithdrawn)
    wc.db.Table("wallets").Where("status = ?", "active").Count(&stats.ActiveWallets)
    wc.db.Table("wallets").Where("status = ?", "frozen").Count(&stats.FrozenWallets)
    wc.db.Table("wallets").Where("status = ?", "suspended").Count(&stats.SuspendedWallets)

    if stats.TotalWallets > 0 {
        stats.AvgBalance = stats.TotalBalance / float64(stats.TotalWallets)
    }

    c.JSON(http.StatusOK, gin.H{
        "success": true,
        "data":    stats,
    })
}

// AdminUpdateWalletStatus - Update wallet status
func (wc *WalletController) AdminUpdateWalletStatus(c *gin.Context) {
    walletID := c.Param("id")
    var req struct {
        Status string `json:"status"`
    }
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    result := wc.db.Table("wallets").Where("id = ?", walletID).Update("status", req.Status)
    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "success": true,
        "message": "Status updated successfully",
    })
}

// AdminTopUpWallet - Top up wallet balance
func (wc *WalletController) AdminTopUpWallet(c *gin.Context) {
    walletID := c.Param("id")
    var req struct {
        Amount      float64 `json:"amount"`
        Note        string  `json:"note"`
        AdminAction bool    `json:"admin_action"`
    }
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    if req.Amount <= 0 {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Amount must be greater than 0"})
        return
    }

    // Update wallet balance
    result := wc.db.Exec(`
        UPDATE wallets 
        SET balance = balance + ?, 
            total_deposited = total_deposited + ?,
            updated_at = NOW()
        WHERE id = ?`,
        req.Amount, req.Amount, walletID)

    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
        return
    }

    // Record transaction
    wc.db.Exec(`
        INSERT INTO wallet_transactions (wallet_id, amount, type, status, description, created_at, updated_at)
        VALUES (?, ?, 'deposit', 'completed', ?, NOW(), NOW())`,
        walletID, req.Amount, req.Note)

    c.JSON(http.StatusOK, gin.H{
        "success": true,
        "message": "Top up successful",
    })
}

// AdminGetWalletTransactions - Get wallet transactions
func (wc *WalletController) AdminGetWalletTransactions(c *gin.Context) {
    walletID := c.Param("id")

    var transactions []map[string]interface{}
    wc.db.Table("wallet_transactions").
        Where("wallet_id = ?", walletID).
        Order("created_at DESC").
        Find(&transactions)

    c.JSON(http.StatusOK, gin.H{
        "success": true,
        "data":    transactions,
    })
}