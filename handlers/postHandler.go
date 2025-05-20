package handlers

import (
	"github.com/gofiber/fiber/v3"
	"github.com/su-andrey/kr_aip/models"
	"github.com/su-andrey/kr_aip/services"
)

// Общая структура всех функций в данном хэндлере (схожа с другими)
// Выполняем подключение к БД, выполняем запрос. В случае ошибки сообщаем информативно
// Обрабатываем данные (алгоритмы разные от цели)
// Возвращаем полученный результат или сообщение об ошибки. Если результата не является объектом - выводим сообщение
// GetPosts возвращает все посты
func GetPosts(c fiber.Ctx) error {
	posts, err := services.GetPosts(c.Context())
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Ошибка запроса к БД")
	}

	return c.JSON(posts)
}

// GetPost возвращает один пост по ID
func GetPost(c fiber.Ctx) error {
	id := c.Params("id")

	post, err := services.GetPostByID(c.Context(), id)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Ошибка запроса к БД")
	}

	return c.JSON(post)
}

// Создать новый пост
func CreatePost(c fiber.Ctx) error {
	// Создаем временную структуру для парсинга входных данных
	var input struct {
		CategoryID int    `json:"category_id"`
		Name       string `json:"name"`
		Body       string `json:"body"`
	}

	// Парсим тело запроса
	if err := c.Bind().Body(&input); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "неверный формат данных") // Сообщение об ошибке, чтобы приложение не падало по неясной причине
	}

	userIDRaw := c.Locals("userID")
	if userIDRaw == nil {
		return fiber.NewError(fiber.StatusUnauthorized, "userID is missing")
	}
	userID := userIDRaw.(int)

	post, err := services.CreatePost(c.Context(), input.CategoryID, input.Name, input.Body, userID)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "error creating post")
	}

	return c.JSON(post)
}

// UpdatePost обновляет существующий пост
func UpdatePost(c fiber.Ctx) error {
	id := c.Params("id")
	post := new(models.Post)

	if err := c.Bind().Body(post); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "неверный формат данных") // Сообщение об ошибке, чтобы приложение не падало по неясной причине
	}

	err := services.UpdatePost(c.Context(), id, post.Name, post.Body, post.Likes, post.Dislikes, post.IsModerated)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "ошибка обновления поста")
	}

	return c.JSON(fiber.Map{"message": "Пост обновлен"})
}

// DeletePost удаляет пост
func DeletePost(c fiber.Ctx) error {
	id := c.Params("id")

	err := services.DeletePost(c.Context(), id)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "ошибка удаления поста")
	}

	return c.JSON(fiber.Map{"message": "Пост удален"})
}
