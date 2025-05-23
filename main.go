package main

import (
	"fmt"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
	"github.com/gofiber/fiber/v3/middleware/static"
	"github.com/su-andrey/kr_aip/config"
	"github.com/su-andrey/kr_aip/database"
	"github.com/su-andrey/kr_aip/routes"
	"go.uber.org/zap"
)

func main() {
	config.InitLogger()
	defer config.Logger.Sync()

	config.InitValidator()

	app := fiber.New() // Создаем экземпляр приложения
	cfg := config.LoadConfig()

	database.ConnectDB()      // Подключаемся к БД + создаем таблицы, если те еще не существуют
	defer database.DB.Close() // defer откладывает выполнение функции на момет исполнения всех других процессов в текущем окружении (в данном случае в функции main)

	origins := []string{"http://localhost:3000", "http://127.0.0.1:3000"}
	if cfg.ENV != "production" {
		reactDevURL := fmt.Sprintf("%s:%s", cfg.AppUrl, cfg.ReactPort)
		origins = append(origins, reactDevURL)
	}

	app.Use(cors.New(cors.Config{
		AllowOrigins:     origins,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization", "X-Requested-With"},
		AllowCredentials: true,
		ExposeHeaders:    []string{"Content-Length"},
		MaxAge:           86400,
	})) // Даем порту, на котором располагается реакт, возможность работать с API (для разработки, в проде порт будет единым)

	routes.SetupRoutes(app) // Запускаем обработчики запросов (сама функция, вызывающая обработчики, находится в ./routes)

	if cfg.ENV == "production" {
		app.Use("/assets", static.New("./client/dist/assets", static.Config{
			Browse: false,
			MaxAge: 3600,
		}))

		app.Get("/vite.svg", func(c fiber.Ctx) error {
			return c.SendFile("./client/dist/vite.svg")
		})

		app.Get("/*", func(c fiber.Ctx) error {
			return c.SendFile("./client/dist/index.html")
		})
	}

	if err := app.Listen(":" + cfg.Port); err != nil { // Запускаем сервер на localhost:<PORT>
		config.Logger.Fatal("Ошибка запуска сервера: ", zap.Error(err)) // логируем критические ошибки
	}
}
