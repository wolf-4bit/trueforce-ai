package main

import (
	"backend/config"
	"backend/internal/router"
)

func main() {
	config.Load()
	db := config.ConnectDatabase()
	router := router.SetupRouter(config.Cfg, db)
	router.Run(":" + config.Cfg.Port)
}
