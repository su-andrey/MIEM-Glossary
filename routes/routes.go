package routes

import (
	"context"

	"github.com/gofiber/fiber/v3"
	"github.com/su-andrey/kr_aip/database"
	"github.com/su-andrey/kr_aip/handlers"
	"github.com/su-andrey/kr_aip/middleware"
	"github.com/su-andrey/kr_aip/models"
)

func SetupRoutes(app *fiber.App) { //Вызывае мобработчики из ./handlers
	auth := app.Group("/auth")

	auth.Post("/register", middleware.Register)
	auth.Post("/login", middleware.Login)

	// Группировка API-роутов
	api := app.Group("/api")

	// Группировка пользователей
	users := api.Group("/users")
	users.Get("/", handlers.GetUsers)         // Получение всех пользователей
	users.Get("/:id", handlers.GetUser)       // Получение пользователя по ID
	users.Post("/", handlers.CreateUser)      // Создание пользователя
	users.Put("/:id", handlers.UpdateUser)    // Обновление пользователя
	users.Delete("/:id", handlers.DeleteUser) // Удаление пользователя

	app.Get("/me", func(c fiber.Ctx) error {
		id := c.Locals("userID").(int)

		var user models.User
		err := database.DB.QueryRow(context.Background(),
			"SELECT id, email, password, is_admin FROM users WHERE id = $1", id).
			Scan(&user.ID, &user.Email, &user.Password, &user.IsAdmin)

		if err != nil {
			return c.Status(404).JSON(fiber.Map{"error": "Пользователь не найден"}) // Сообщение об ошибке, чтобы приложение не падало по неясной причине
		}

		return c.JSON(user)
	}, middleware.JWTMiddlewate())

	// Группировка комментариев
	categories := api.Group("/categories")
	categories.Get("/", handlers.GetCategories)        // Получение всех категорий
	categories.Get("/:id", handlers.GetCategory)       // Получение категории по ID
	categories.Post("/", handlers.CreateCategory)      // Создание категории
	categories.Put("/:id", handlers.UpdateCategory)    // Обновление категории
	categories.Delete("/:id", handlers.DeleteCategory) // Удаление категории

	// Группировка постов
	posts := api.Group("/posts")
	posts.Get("/", handlers.GetPosts)         // Получение всех постов
	posts.Get("/:id", handlers.GetPost)       // Получение поста по ID
	posts.Post("/", handlers.CreatePost)      // Создание поста
	posts.Put("/:id", handlers.UpdatePost)    // Обновление поста
	posts.Delete("/:id", handlers.DeletePost) // Удаление поста

	// Группировка комментариев
	comments := api.Group("/comments")
	comments.Get("/", handlers.GetComments)         // ПОлучение всех комментариев
	comments.Get("/:id", handlers.GetComment)       // Получение комментария по ID
	comments.Post("/", handlers.CreateComment)      // Создание комментария
	comments.Put("/:id", handlers.UpdateComment)    // Обновление комментария
	comments.Delete("/:id", handlers.DeleteComment) // Удаления комментария
} // В каждой из группировок для удаления или обновления обязательно требуется ID
