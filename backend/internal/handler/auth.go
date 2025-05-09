package handler

import (
	"backend/internal/middleware"
	"backend/internal/dto/auth"
	"backend/internal/service"
	"github.com/gin-gonic/gin"
	"net/http"
)

func Login(c *gin.Context) {
	var req auth.SignInRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		middleware.JSON(c, http.StatusBadRequest, "error", err.Error(), nil)
		return
	}

	user, err := service.UserService.GetUserByEmail(req.Email)

	
}

