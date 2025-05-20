package handlers

import (
	"context"

	"github.com/gofiber/fiber/v3"
	"github.com/su-andrey/kr_aip/database"
	"github.com/su-andrey/kr_aip/models"
)

func GetMe(c fiber.Ctx) error {
	id := c.Locals("userID").(int)

	var user models.User
	err := database.DB.QueryRow(context.Background(),
		"SELECT id, email, password, is_admin FROM users WHERE id = $1", id).
		Scan(&user.ID, &user.Email, &user.Password, &user.IsAdmin)

	if err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Пользователь не найден"}) // Сообщение об ошибке, чтобы приложение не падало по неясной причине
	}

	return c.JSON(user)
}
