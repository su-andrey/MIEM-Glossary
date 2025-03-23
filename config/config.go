package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port  string
	DbUrl string
}

func LoadConfig() Config {
	if err := godotenv.Load(".env"); err != nil { // Открываем .env и отлавливаем возможную ошибку
		log.Fatal("Error loading environment variables:", err)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	return Config{
		Port:  port,
		DbUrl: os.Getenv("DB_URL"),
	}
}
