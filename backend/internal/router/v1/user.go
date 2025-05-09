package v1

import (
	"backend/internal/handler"

	"github.com/gin-gonic/gin"
)

// SetupUserRoutes registers all user-related routes
func SetupUserRoutes(router *gin.RouterGroup, userHandler *handler.UserHandler) {
	users := router.Group("/users")
	{
		users.POST("/register", userHandler.Register)
		users.GET("/", userHandler.ListUsers)
	}
}
