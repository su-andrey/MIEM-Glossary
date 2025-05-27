package handlers

import (
	"strconv"

	"github.com/gofiber/fiber/v3"
	"github.com/su-andrey/kr_aip/services"
)

// GetReaction возвращает реакцию текущего пользователя на пост
func GetReaction(c fiber.Ctx) error {
	// Получаем ID пользователя из контекста (middleware)
	userID, ok := c.Locals("userID").(int)
	if !ok {
		return c.Status(401).JSON(fiber.Map{"error": "Необходима авторизация"})
	}

	// Получаем ID поста из параметров URL
	postIDRaw := c.Params("id")
	if postIDRaw == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Отсутствует ID поста"})
	}

	postID, err := strconv.Atoi(postIDRaw)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Некорректный ID поста"})
	}

	reaction, err := services.GetReaction(c.Context(), userID, postID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Ошибка получения реакции")
	}

	return c.JSON(&reaction)
}

// SetReaction устанавливает реакцию пользователя на пост
func SetReaction(c fiber.Ctx) error {
	// Получаем ID пользователя из контекста (middleware)
	userIDRaw := c.Locals("userID")
	if userIDRaw == nil {
		return fiber.NewError(fiber.StatusUnauthorized, "userID is missing")
	}
	userID, ok := userIDRaw.(int)
	if !ok {
		return fiber.NewError(fiber.StatusUnauthorized, "Некорректный userID")
	}

	//Получаем ID поста из параметров URL
	postIDRaw := c.Params("id")
	if postIDRaw == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Отсутствует ID поста"})
	}

	postID, err := strconv.Atoi(postIDRaw)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Некорректный ID поста"})
	}

	// Парсим тип реакции из тела запроса
	var input struct {
		Reaction bool `json:"reaction"`
	}
	if err := c.Bind().Body(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Неверный формат данных"})
	}

	err = services.SetReaction(c.Context(), userID, postID, input.Reaction)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "ошибка сохранения реакции")
	}

	reaction, err := services.GetReaction(c.Context(), userID, postID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Ошибка получения реакции")
	}

	return c.JSON(reaction)
}
