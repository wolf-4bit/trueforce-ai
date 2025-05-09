package router

import (
	"backend/config"
	"backend/internal/handler"
	"backend/internal/middleware"
	"backend/internal/repository"
	v1 "backend/internal/router/v1"
	"backend/internal/service"
	"backend/internal/integration/smtp"

	"gorm.io/gorm"

	"github.com/gin-gonic/gin"
)

func SetupRouter(cfg config.AppConfig, db *gorm.DB) *gin.Engine {
	r := gin.Default()
	r.Use(middleware.CORS())
	r.Use(middleware.Logger())

	// Setup email sender
	mailer := smtp.NewMailer(smtp.SMTPConfig{
		Host:     cfg.SMTPHost,
		Port:     cfg.SMTPPort,
		Username: cfg.SMTPUser,
		Password: cfg.SMTPPass,
		From:     cfg.SMTPFrom,
	})

	// Init layers
	userRepo := repository.NewUserRepo(db)
	userService := service.NewUserService(userRepo, mailer)
	userHandler := handler.NewUserHandler(userService)

	// Group: /api
	api := r.Group("/api")

	// Setup v1 routes
	v1Router := api.Group("/v1")
	v1.SetupAuthRoutes(v1Router)
	v1.SetupUserRoutes(v1Router, userHandler)

	return r
}
