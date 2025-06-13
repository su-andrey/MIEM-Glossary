package config

import (
	"os"

	"github.com/joho/godotenv"
)

// задаем конфигурацию для всего приложения, указываем порты всех сервисов
type Config struct {
	Port                string
	DbUrl               string
	AppUrl              string
	ReactPort           string
	ENV                 string
	AdminEmail          string
	AdminPassword       string
	JWTSecret           string
	CloudinaryCloudName string
	CloudinaryAPIKey    string
	CloudinaryAPISecret string
	ModerationEnabled   bool // Флаг для включения/выключения модерации
	AllowedImagesTypes  map[string]bool
	MaxImageWeight      int
}

var allowedImTypes = map[string]bool{
	"image/jpeg": true,
	"image/png":  true,
	"image/webp": true,
}

var maxImWeight = 5 * 1024 * 1024

func LoadConfig() Config {
	if os.Getenv("ENV") != "production" {
		/* Тут может потребоваться пояснение.
		На сервере переменные окружения будут получаться приложением не из файла .env,
		а через особый механизм передачи. Их все равно можно будет получить через os.Getenv,
		но при этом сам файл .env загрузить не получится */
		if err := godotenv.Load(".env"); err != nil { // Открываем .env и отлавливаем возможную ошибку
			panic(err)
		}
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000" // Важное автозаполнение
	}

	moderationEnabled := os.Getenv("MODERATION_ENABLED")
	if moderationEnabled == "" {
		moderationEnabled = "true" // По умолчанию модерация включена
	}

	return Config{
		Port:                port,
		DbUrl:               os.Getenv("DB_URL"),
		AppUrl:              os.Getenv("APP_URL"),
		ReactPort:           os.Getenv("REACT_PORT"),
		AdminEmail:          os.Getenv("ADMIN_EMAIL"),
		AdminPassword:       os.Getenv("ADMIN_PASSWORD"),
		JWTSecret:           os.Getenv("JWT_SECRET"),
		CloudinaryCloudName: os.Getenv("CLOUDINARY_CLOUD_NAME"),
		CloudinaryAPIKey:    os.Getenv("CLOUDINARY_API_KEY"),
		CloudinaryAPISecret: os.Getenv("CLOUDINARY_API_SECRET"),
		ENV:                 os.Getenv("ENV"),            // Все остальные поля подтягиваем из .env напрямую, без доп. обработок
		ModerationEnabled:   moderationEnabled == "true", // Преобразуем строку в bool
		AllowedImagesTypes:  allowedImTypes,
		MaxImageWeight:      maxImWeight,
	}
}
