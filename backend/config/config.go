package config

import (
	"log"

	"github.com/spf13/viper"
)

type AppConfig struct {
	Env      string `mapstructure:"ENV"`
	Port     string `mapstructure:"PORT"`
	DBUrl    string `mapstructure:"DB_URL"`
	SMTPHost string `mapstructure:"SMTP_HOST"`
	SMTPPort string `mapstructure:"SMTP_PORT"`
	SMTPUser string `mapstructure:"SMTP_USER"`
	SMTPPass string `mapstructure:"SMTP_PASS"`
	SMTPFrom string `mapstructure:"SMTP_FROM"`
}

var Cfg AppConfig

func Load() {
	viper.SetConfigFile(".env")
	viper.AutomaticEnv() // override with environment variables

	if err := viper.ReadInConfig(); err != nil {
		log.Printf("Config file not found, relying on ENV vars")
	}

	if err := viper.Unmarshal(&Cfg); err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}
}
