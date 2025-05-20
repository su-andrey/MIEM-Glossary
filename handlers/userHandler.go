package handlers

import (
	"errors"
	"strconv"

	"github.com/gofiber/fiber/v3"
	"github.com/su-andrey/kr_aip/models"
	"github.com/su-andrey/kr_aip/services"
)

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
	idRaw := c.Params("id")
	id, err := strconv.Atoi(idRaw)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "некорректный формат id")
	}

	user, err := services.GetUserByID(c.Context(), id)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "ошибка получения пользователя")
	}

	return c.JSON(user)
}

// CreateUser создает нового пользователя
func CreateUser(c fiber.Ctx) error {
	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
		IsAdmin  bool   `json:"is_admin"`
	}
	if err := c.Bind().Body(&input); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "неверный формат данных")
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
	var input models.User

	if err := c.Bind().Body(input); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "неверный формат данных") // Сообщение об ошибке, чтобы приложение не падало по неясной причине
	}

	err := services.UpdateUser(c.Context(), id, input.Email, input.Password, input.IsAdmin)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "ошибка обновления пользователя")
	}

	return c.JSON(fiber.Map{"message": "Пользователь обновлен"})
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
