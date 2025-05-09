package config


import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func ConnectDatabase() *gorm.DB {
	db, err := gorm.Open(postgres.Open(Cfg.DBUrl), &gorm.Config{})
	if err != nil {
		panic("failed to connect to database")
	}
	return db
}
