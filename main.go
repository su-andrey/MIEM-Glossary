package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
	"github.com/joho/godotenv"
	"github.com/su-andrey/kr_aip/database"
	"github.com/su-andrey/kr_aip/routes"
)

func main() {
	app := fiber.New() // Создаем экземпляр приложения

	if err := godotenv.Load(".env"); err != nil { // Открываем .env и отлавливаем возможную ошибку
		log.Fatal("Error loading .env file:", err)
	}

	PORT := os.Getenv("PORT") // Получаем порт из .env

	database.ConnectDB()      // Подключаемся к БД + создаем таблицы, если те еще не существуют
	defer database.DB.Close() // defer откладывает выполнение функции на момет исполнения всех других процессов в текущем окружении (в данном случае в функции main)

	app.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:5173"},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders: []string{"Origin", "Content-Type", "Accept"},
	})) // Даем хосту, на котором располагается реакт, возможность работать с API

	routes.SetupRoutes(app) // Запускаем обработчики запросов (сама функция, вызывающая обработчики, находится в ./routes)

	err := app.Listen(":" + PORT) // Запускаем сервер на localhost:<PORT>
	if err != nil {
		log.Fatal("Ошибка запуска сервера:", err)
	}
}
