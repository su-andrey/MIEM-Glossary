package handlers

import (
	"errors"

	"github.com/gofiber/fiber/v3"
	"github.com/su-andrey/kr_aip/config"
	"github.com/su-andrey/kr_aip/services"
)

type userInput struct {
	Email    string `json:"email" validate:"required,email,max=100"`
	Password string `json:"password" validate:"required,min=8,max=100"`
	IsAdmin  bool   `json:"is_admin"`
}

// Общая структура всех функций в данном файле (схожа с другими хэндлерами)
// Подключаемся к бд, выполняем запрос. В случае ошибки не продолжаем и не пытаемся снова, выводим сообщение
// При успехе обрабатываем полученные данные, если результат объект - возвращаем его, иначе выводим сообщение. При удалении не возвращаем удаленный объект
// GetUsers возвращает всех пользователей
func GetUsers(c fiber.Ctx) error {
	users, err := services.GetUsers(c.Context())
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "ошибка получения пользователей")
	}

	return c.JSON(users)
}

// GetUser возвращает одного пользователя по ID
func GetUser(c fiber.Ctx) error {
	id := c.Params("id")

	user, err := services.GetUserByID(c.Context(), id)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "ошибка получения пользователя")
	}

	return c.JSON(user)
}

// CreateUser создает нового пользователя
func CreateUser(c fiber.Ctx) error {
	var input userInput

	if err := c.Bind().Body(&input); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "неверный формат данных")
	}

	if err := config.Validator.Struct(&input); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "ошибка валидации")
	}

	user, err := services.CreateUser(c.Context(), input.Email, input.Password, input.IsAdmin)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "ошибка добавления пользователя")
	}

	return c.JSON(user)
}

// UpdateUser обновляет данные пользователя
func UpdateUser(c fiber.Ctx) error {
	id := c.Params("id")
	var input userInput

	if err := c.Bind().Body(&input); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "неверный формат данных") // Сообщение об ошибке, чтобы приложение не падало по неясной причине
	}

	if err := config.Validator.Struct(&input); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "ошибка валидации")
	}

	err := services.UpdateUser(c.Context(), id, input.Email, input.Password, input.IsAdmin)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "ошибка обновления пользователя")
	}

	user, err := services.GetUserByID(c.Context(), id)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "ошибка получения обновленного пользователя")
	}

	return c.JSON(user)
}

// DeleteUser удаляет пользователя
func DeleteUser(c fiber.Ctx) error {
	id := c.Params("id")

	err := services.DeleteUser(c.Context(), id)
	if err != nil {
		return errors.New("ошибка удаления пользователя")
	}

	return c.JSON(fiber.Map{"message": "Пользователь удален"})
}
