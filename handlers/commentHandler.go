package handlers

import (
	"context"

	"github.com/gofiber/fiber/v3"
	"github.com/su-andrey/kr_aip/config"
	"github.com/su-andrey/kr_aip/services"
)

type commentsInput struct {
	PostID int    `json:"post_id" validate:"required,gt=0"`
	Body   string `json:"body" validate:"required,min=1,max=1000"`
}

type updateCommentInput struct {
	Body string `json:"body" validate:"required,min=1,max=1000"`
}

// Общая структура хэндлеров в данном файле (схоже с категориями)
// Пробуем подключиться к бд и выполнить запрос, если ошибка - выводим информативное сообщение
// При успешном получении данных пытаемся их обработать, в случае отсутствия ошибок возвращаем их
// Если возвращать нечего (например удаление), выводим сообщение (удалённый объект не возвращаем за ненадобностью)
// GetComments возвращает все комментарии
func GetComments(c fiber.Ctx) error {
	comments, err := services.GetComments(c.Context())
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "ошибка получения комментариев")
	}

	return c.JSON(comments)
}

// GetComment возвращает один комментарий по ID
func GetComment(c fiber.Ctx) error {
	id := c.Params("id")

	comment, err := services.GetCommentById(context.Background(), id)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "ошибка получения комментария")
	}

	return c.JSON(comment)
}

// Создать новый комментарий
func CreateComment(c fiber.Ctx) error {
	// Создаем временную структуру для парсинга входных данных
	var input commentsInput

	// Парсим тело запроса
	if err := c.Bind().Body(&input); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "неверный формат данных") // Сообщение об ошибке, чтобы приложение не падало по неясной причине
	}

	if err := config.Validator.Struct(&input); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "ошибка валидации")
	}

	userIDRaw := c.Locals("userID")
	if userIDRaw == nil {
		return fiber.NewError(fiber.StatusUnauthorized, "userID is missing")
	}
	userID := userIDRaw.(int)

	comment, err := services.CreateComment(c.Context(), userID, input.PostID, input.Body)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "")
	}

	return c.JSON(comment)
}

// UpdateComment обновляет существующий комментарий
func UpdateComment(c fiber.Ctx) error {
	id := c.Params("id")
	var input updateCommentInput

	if err := c.Bind().Body(&input); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "неверный формат данных")
	}

	if err := config.Validator.Struct(&input); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "ошибка валидации")
	}

	err := services.UpdateComment(c.Context(), id, input.Body)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "ошибка обновления комментария")
	}

	return c.JSON(fiber.Map{"message": "Комментарий обновлен"})
}

// DeleteComment удаляет комментарий
func DeleteComment(c fiber.Ctx) error {
	id := c.Params("id")

	err := services.DeleteComment(c.Context(), id)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "ошибка удаления комментария")
	}

	return c.JSON(fiber.Map{"message": "Комментарий удален"})
}
