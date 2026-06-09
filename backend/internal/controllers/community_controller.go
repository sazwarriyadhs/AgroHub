package controllers

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "gorm.io/gorm"
)

type CommunityController struct {
    db *gorm.DB
}

func NewCommunityController(db *gorm.DB) *CommunityController {
    return &CommunityController{db: db}
}

func (c *CommunityController) GetFeed(ctx *gin.Context) {
    ctx.JSON(http.StatusOK, gin.H{
        "success": true,
        "data":    []interface{}{},
    })
}

func (c *CommunityController) GetTrending(ctx *gin.Context) {
    ctx.JSON(http.StatusOK, gin.H{
        "success": true,
        "data":    []interface{}{},
    })
}

func (c *CommunityController) GetPostByID(ctx *gin.Context) {
    id := ctx.Param("id")
    ctx.JSON(http.StatusOK, gin.H{
        "success": true,
        "data": gin.H{"id": id},
    })
}

func (c *CommunityController) GetComments(ctx *gin.Context) {
    postId := ctx.Param("postId")
    ctx.JSON(http.StatusOK, gin.H{
        "success": true,
        "data":    []interface{}{},
        "meta": gin.H{"post_id": postId},
    })
}

func (c *CommunityController) CreatePost(ctx *gin.Context) {
    var req struct {
        Content string `json:"content"`
    }
    if err := ctx.ShouldBindJSON(&req); err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    ctx.JSON(http.StatusCreated, gin.H{
        "success": true,
        "data":    req,
    })
}

func (c *CommunityController) LikePost(ctx *gin.Context) {
    var req struct {
        PostID string `json:"post_id"`
    }
    if err := ctx.ShouldBindJSON(&req); err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    ctx.JSON(http.StatusOK, gin.H{
        "success": true,
        "liked":   true,
    })
}

func (c *CommunityController) AddComment(ctx *gin.Context) {
    var req struct {
        PostID  string `json:"post_id"`
        Content string `json:"content"`
    }
    if err := ctx.ShouldBindJSON(&req); err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    ctx.JSON(http.StatusCreated, gin.H{
        "success": true,
        "data":    req,
    })
}
