package routes

import (
	"github.com/gofiber/fiber/v3"
	"github.com/su-andrey/kr_aip/handlers"
)

func SetupRoutes(app *fiber.App) { //Вызывае мобработчики из ./handlers
	// Группировка API-роутов
	api := app.Group("/api")

	// Группировка пользователей
	users := api.Group("/users")
	users.Get("/", handlers.GetUsers)         // Получение всех пользователей
	users.Get("/:id", handlers.GetUser)       // Получение пользователя по ID
	users.Post("/", handlers.CreateUser)      // Создание пользователя
	users.Put("/:id", handlers.UpdateUser)    // Обновление пользователя
	users.Delete("/:id", handlers.DeleteUser) // Удаление пользователя

	// Группировка комментариев
	categories := api.Group("/categories")
	categories.Get("/", handlers.GetCategories)
	categories.Get("/:id", handlers.GetCategory)
	categories.Post("/", handlers.CreateCategory)
	categories.Put("/:id", handlers.UpdateCategory)
	categories.Delete("/:id", handlers.DeleteCategory)

	// Группировка постов
	posts := api.Group("/posts")
	posts.Get("/", handlers.GetPosts)
	posts.Get("/:id", handlers.GetPost)
	posts.Post("/", handlers.CreatePost)
	posts.Put("/:id", handlers.UpdatePost)
	posts.Delete("/:id", handlers.DeletePost)

	// Группировка комментариев
	comments := api.Group("/comments")
	comments.Get("/", handlers.GetComments)
	comments.Get("/:id", handlers.GetComment)
	comments.Post("/", handlers.CreateComment)
	comments.Put("/:id", handlers.UpdateComment)
	comments.Delete("/:id", handlers.DeleteComment)
}
