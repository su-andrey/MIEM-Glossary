package handlers

import (
	"strconv"

	"github.com/gofiber/fiber/v3"
	"github.com/su-andrey/kr_aip/services"
)

func GetMe(c fiber.Ctx) error {
	userIDRaw := c.Locals("userID")
	if userIDRaw == nil {
		return fiber.NewError(fiber.StatusUnauthorized, "userID is missing")
	}
	userID := userIDRaw.(int)

	user, err := services.GetUserByID(c.Context(), strconv.Itoa(userID))
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "пользователь не найден")
	}

	return c.JSON(user)
}
