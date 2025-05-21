package routes

import (
	"github.com/gofiber/fiber/v3"
	"github.com/su-andrey/kr_aip/handlers"
	"github.com/su-andrey/kr_aip/middleware"
	"github.com/su-andrey/kr_aip/services"
)

func SetupRoutes(app *fiber.App) { //Вызывае мобработчики из ./handlers
	auth := app.Group("/auth")

	auth.Post("/register", middleware.Register)
	auth.Post("/login", middleware.Login)

	// Группировка API-роутов
	api := app.Group("/api")

	// Группировка пользователей
	users := api.Group("/users")
	users.Get("/", handlers.GetUsers, middleware.JWTMiddlewate(), middleware.IsAdmin())               // Получение всех пользователей
	users.Get("/:id", handlers.GetUser, middleware.JWTMiddlewate(), middleware.IsSelfOrAdmin())       // Получение пользователя по ID
	users.Post("/", handlers.CreateUser, middleware.JWTMiddlewate(), middleware.IsAdmin())            // Создание пользователя
	users.Put("/:id", handlers.UpdateUser, middleware.JWTMiddlewate(), middleware.IsSelfOrAdmin())    // Обновление пользователя
	users.Delete("/:id", handlers.DeleteUser, middleware.JWTMiddlewate(), middleware.IsSelfOrAdmin()) // Удаление пользователя

	me := api.Group("/me")
	me.Get("/", handlers.GetMe, middleware.JWTMiddlewate())

	// Группировка комментариев
	categories := api.Group("/categories")
	categories.Get("/", handlers.GetCategories)                                                          // Получение всех категорий
	categories.Get("/:id", handlers.GetCategory)                                                         // Получение категории по ID
	categories.Post("/", handlers.CreateCategory, middleware.JWTMiddlewate(), middleware.IsAdmin())      // Создание категории
	categories.Put("/:id", handlers.UpdateCategory, middleware.JWTMiddlewate(), middleware.IsAdmin())    // Обновление категории
	categories.Delete("/:id", handlers.DeleteCategory, middleware.JWTMiddlewate(), middleware.IsAdmin()) // Удаление категории

	// Группировка постов
	posts := api.Group("/posts")
	posts.Get("/", handlers.GetPosts)                                                                                           // Получение всех постов
	posts.Get("/search/:str", handlers.SearchPosts)                                                                             // Поиск постов по имени
	posts.Get("/:id", handlers.GetPost)                                                                                         // Получение поста по ID
	posts.Post("/", handlers.CreatePost, middleware.JWTMiddlewate())                                                            // Создание поста
	posts.Put("/:id", handlers.UpdatePost, middleware.JWTMiddlewate(), middleware.IsAuthorOrAdmin(services.GetPostAuthorID))    // Обновление поста
	posts.Delete("/:id", handlers.DeletePost, middleware.JWTMiddlewate(), middleware.IsAuthorOrAdmin(services.GetPostAuthorID)) // Удаление поста
	posts.Post("/:id/photos", handlers.UploadPostPhotos, middleware.JWTMiddlewate(), middleware.IsAuthor(services.GetCreatingPostID))

	photos := api.Group("/photos")
	photos.Delete("/:id", handlers.DeletePhoto, middleware.JWTMiddlewate(), middleware.IsAuthorOrAdmin(services.GetPhotoPostAuthorID))

	// Группировка комментариев
	comments := api.Group("/comments")
	comments.Get("/", handlers.GetComments)                                                                                           // Получение всех комментариев
	comments.Get("/:id", handlers.GetComment)                                                                                         // Получение комментария по ID
	comments.Post("/", handlers.CreateComment, middleware.JWTMiddlewate())                                                            // Создание комментария
	comments.Put("/:id", handlers.UpdateComment, middleware.JWTMiddlewate(), middleware.IsAuthorOrAdmin(services.GetCommentAuthorID)) // Обновление комментария
	comments.Delete("/:id", handlers.DeleteComment, middleware.JWTMiddlewate(), middleware.IsAuthorOrAdmin(services.GetPostAuthorID)) // Удаления комментария

	reactions := api.Group("/reactions")
	reactions.Get("/:id", handlers.GetReaction, middleware.JWTMiddlewate())
	reactions.Post("/:id", handlers.SetReaction, middleware.JWTMiddlewate())

	find := api.Group("/find_teacher")
	find.Post("/", handlers.FindTeacher)
} // В каждой из группировок для удаления или обновления обязательно требуется ID
