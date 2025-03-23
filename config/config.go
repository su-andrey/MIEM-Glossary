package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port      string
	DbUrl     string
	AppUrl    string
	ReactPort string
	ENV       string
}

func LoadConfig() Config {
	if os.Getenv("ENV") != "production" {
		/* Тут может потребоваться пояснение.
		На сервере переменные окружения будут получаться приложением не из файла .env,
		а через особый механизм передачи. Их все равно можно будет получить через os.Getenv,
		но при этом сам файл .env загрузить не получится */
		if err := godotenv.Load(".env"); err != nil { // Открываем .env и отлавливаем возможную ошибку
			log.Fatal("Error loading environment variables:", err)
		}
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	return Config{
		Port:      port,
		DbUrl:     os.Getenv("DB_URL"),
		AppUrl:    os.Getenv("APP_URL"),
		ReactPort: os.Getenv("REACT_PORT"),
		ENV:       os.Getenv("ENV"),
	}
}
