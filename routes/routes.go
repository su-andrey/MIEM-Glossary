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
